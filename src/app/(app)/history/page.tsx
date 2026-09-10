"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLocaleStore } from "@/stores/locale-store";
import { displayDate, sessionRole, type EventRecord, type QueueRecord } from "@/lib/events/dossier";
import { DossierDialog, EmptyState, HistoryRecordCard, LoadState, OperationDialog, PageHeader, StatusPill } from "@/components/operations/workflow-ui";
import s from "@/components/operations/operations.module.css";

export default function HistoryPage() {
  const { locale } = useLocaleStore();
  const { data: session } = useSession();
  const canRemove = ["ADMIN", "SUPERVISOR"].includes(sessionRole(session?.user));
  const [tab, setTab] = useState<"DECISIONS" | "ATTENDED">("DECISIONS");
  const [filter, setFilter] = useState<"ALL" | "APPROVED" | "REJECTED">("ALL");
  const [decisions, setDecisions] = useState<QueueRecord[]>([]);
  const [attended, setAttended] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selection, setSelection] = useState<{ event: EventRecord; decision?: QueueRecord } | null>(null);
  const [removing, setRemoving] = useState<EventRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const fetchHistory = useCallback(async () => {
    setLoading(true); setError(false);
    try {
      const res = await fetch("/api/queues?status=HISTORY", { cache: "no-store" });
      if (!res.ok) throw new Error("history");
      const data: { queueItems: QueueRecord[] } = await res.json();
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      setDecisions(data.queueItems.filter(item => new Date(item.resolvedAt || item.createdAt) >= cutoff));
      // Preserve the legacy attendance/recommendation selection, but fetch every page.
      const events: EventRecord[] = [];
      let page = 1;
      let totalPages = 1;
      do {
        const result = await fetch("/api/events?limit=100&page=" + page, { cache: "no-store" });
        if (!result.ok) throw new Error("events");
        const batch: { events: EventRecord[]; pagination: { totalPages: number } } = await result.json();
        events.push(...batch.events);
        totalPages = batch.pagination.totalPages;
        page++;
      } while (page <= totalPages);
      setAttended(events.filter(event => event.isAttended || event.participationRec === "Exhibit" || event.participationRec === "Attend"));
    } catch { setError(true); } finally { setLoading(false); }
  }, []);
  useEffect(() => { void fetchHistory(); }, [fetchHistory]);

  async function removeAttendance() {
    if (!removing || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/events/" + removing.id, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isAttended: false }) });
      if (!res.ok) throw new Error("remove");
      setRemoving(null);
      toast.success(locale === "en" ? "Attendance mark removed." : "已取消参加标记。");
      await fetchHistory();
    } catch { toast.error(locale === "en" ? "Could not update attendance. Please retry." : "无法更新参加状态，请重试。"); } finally { setBusy(false); }
  }

  const filtered = decisions.filter(item => filter === "ALL" || item.status === filter);
  const count = tab === "DECISIONS" ? filtered.length : attended.length;
  return <div className={s.page}>
    <PageHeader eyebrow={locale === "en" ? "Operations / Record of activity" : "运营 / 活动记录"} title={locale === "en" ? "Governance & attendance history" : "审核与参展历史"} description={locale === "en" ? "The decisions behind your exhibition intelligence, and the events in your participation register." : "回顾展会情报的审核决定与参展记录。"}><button className={s.button} disabled={loading} onClick={fetchHistory}><RefreshCw size={15} />{locale === "en" ? "Refresh" : "刷新"}</button></PageHeader>
    <div className={s.tabs} role="group" aria-label={locale === "en" ? "History section" : "历史记录分类"}>
      <button aria-pressed={tab === "DECISIONS"} onClick={() => setTab("DECISIONS")}>{locale === "en" ? "Queue Decisions" : "审核决定"} · {loading || error ? "—" : decisions.length}</button>
      <button aria-pressed={tab === "ATTENDED"} onClick={() => setTab("ATTENDED")}>{locale === "en" ? "Attended Exhibitions Log" : "参展记录"} · {loading || error ? "—" : attended.length}</button>
    </div>
    <section className={s.card}>
      <div className={s.toolbar}><div><p className={s.eyebrow}>{tab === "DECISIONS" ? locale === "en" ? "Last 30 days" : "最近 30 天" : locale === "en" ? "Permanent register" : "长期参展档案"}</p><p className={s.hint}>{tab === "DECISIONS" ? locale === "en" ? "Review recorded decisions and their rationale. Older decisions remain stored in the database." : "查看审核结果及其理由。更早的决定仍保留在数据库中。" : locale === "en" ? "Includes attendance marks and the existing Exhibit / Attend recommendations. View dossiers or remove attendance marks." : "包含参加标记与现有的参展/出席建议。可查看档案或取消参加标记。"}</p></div>
      {tab === "DECISIONS" ? <div className={s.tabs} role="group" aria-label={locale === "en" ? "Decision filter" : "筛选审核结果"}>{(["ALL", "APPROVED", "REJECTED"] as const).map(value => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{locale === "en" ? { ALL: "All", APPROVED: "Approved", REJECTED: "Rejected" }[value] : { ALL: "全部", APPROVED: "已批准", REJECTED: "已拒绝" }[value]}</button>)}</div> : <span className={s.pill}>{loading || error ? "—" : count} {locale === "en" ? "Records" : "条记录"}</span>}</div>
    </section>
    {loading || error ? <LoadState locale={locale} error={error} retry={fetchHistory} /> : count === 0 ? <EmptyState title={tab === "DECISIONS" ? locale === "en" ? "No decisions in this view" : "暂无审核决定" : locale === "en" ? "Your participation history starts here" : "参展历史从这里开始"} description={tab === "DECISIONS" ? locale === "en" ? "Completed reviews from the last 30 days will appear here. Try another filter to explore recorded decisions." : "最近 30 天的审核结果将在此显示。可切换筛选条件查看。" : locale === "en" ? "Logged exhibitions will appear here with the same complete dossier used throughout the platform." : "已登记的展会将在此显示完整档案。"} /> : <div className={s.grid}>
      {tab === "DECISIONS" ? filtered.map(item => item.event ? <HistoryRecordCard key={item.id} event={item.event} locale={locale} status={item.status} note={item.reason} metadata={[[locale === "en" ? "Decision date" : "决定日期", displayDate(item.resolvedAt || item.createdAt, locale)], [locale === "en" ? "Submitted by" : "提交人", item.submittedBy?.name || "—"]]} onInspect={() => setSelection({ event: item.event!, decision: item })} /> : <div key={item.id} className={s.card}><StatusPill status={item.status} locale={locale} /><p className={s.note}>{item.reason}</p><p className={s.hint}>{locale === "en" ? "The linked exhibition is unavailable." : "关联展会不可用。"}</p></div>) : attended.map(event => <HistoryRecordCard key={event.id} event={event} locale={locale} status={event.isAttended ? "ATTENDED" : locale === "en" ? "Participation recommendation" : "参与建议"} metadata={[[locale === "en" ? "Attendance marked" : "参加标记日期", displayDate(event.attendedAt, locale)], [locale === "en" ? "Participation" : "参与方式", event.participationRec || "—"]]} onInspect={() => setSelection({ event })} actions={canRemove && <button className={s.button + " " + s.danger} onClick={() => setRemoving(event)}><Trash2 size={15} />{locale === "en" ? "Remove attendance" : "取消参加标记"}</button>} />)}
    </div>}
    <DossierDialog locale={locale} event={selection?.event ?? null} onClose={() => setSelection(null)} context={selection?.decision && <section className={s.card}><div className={s.toolbar}><StatusPill status={selection.decision.status} locale={locale} /><span className={s.hint}>{displayDate(selection.decision.resolvedAt || selection.decision.createdAt, locale)}</span></div><p className={s.note}>{selection.decision.reason}</p><p className={s.hint}>{locale === "en" ? "Submitted by: " : "提交人："}{selection.decision.submittedBy?.name || "—"}</p></section>} />
    <OperationDialog open={!!removing} onClose={() => { if (!busy) setRemoving(null); }} locale={locale} title={locale === "en" ? "Remove attendance mark?" : "取消参加标记？"} description={removing?.eventName || ""}><p className={s.hint}>{locale === "en" ? "The exhibition dossier will be kept. Records with an Exhibit or Attend recommendation continue to appear in this register." : "展会档案将保留。有参展或出席建议的记录仍将在此显示。"}</p><div className={s.actions}><button disabled={busy} className={s.button} onClick={() => setRemoving(null)}>{locale === "en" ? "Cancel" : "取消"}</button><button disabled={busy} className={s.button + " " + s.danger} onClick={removeAttendance}>{busy ? locale === "en" ? "Updating…" : "正在更新…" : locale === "en" ? "Remove mark" : "取消标记"}</button></div></OperationDialog>
  </div>;
}
