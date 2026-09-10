"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Check, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { useLocaleStore } from "@/stores/locale-store";
import { displayDate, sessionRole, type EventRecord, type QueueRecord } from "@/lib/events/dossier";
import { DossierDialog, EmptyState, HistoryRecordCard, LoadState, PageHeader } from "@/components/operations/workflow-ui";
import s from "@/components/operations/operations.module.css";

export default function QueuesPage() {
  const { locale } = useLocaleStore();
  const { data: session } = useSession();
  const canReview = ["ADMIN", "SUPERVISOR"].includes(sessionRole(session?.user));
  const [items, setItems] = useState<QueueRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState<number | null>(null);
  const [inspectEvent, setInspectEvent] = useState<EventRecord | null>(null);
  const fetchQueues = useCallback(async () => {
    setLoading(true); setError(false);
    try {
      const res = await fetch("/api/queues?status=PENDING", { cache: "no-store" });
      if (!res.ok) throw new Error("queue");
      const data: { queueItems: QueueRecord[] } = await res.json();
      setItems(data.queueItems.filter(item => item.type === "FOR_REVIEW"));
    } catch { setError(true); } finally { setLoading(false); }
  }, []);
  useEffect(() => { void fetchQueues(); }, [fetchQueues]);

  async function handleAction(id: number, action: "APPROVE" | "REJECT") {
    if (busy !== null) return;
    setBusy(id);
    try {
      const res = await fetch("/api/queues/" + id, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
      if (!res.ok) throw new Error("action");
      toast.success(locale === "en" ? action === "APPROVE" ? "Record approved and published." : "Record rejected." : action === "APPROVE" ? "记录已批准并发布。" : "记录已拒绝。");
      await fetchQueues();
    } catch { toast.error(locale === "en" ? "Could not process this decision. Please retry." : "无法处理此决定，请重试。"); } finally { setBusy(null); }
  }

  return <div className={s.page}>
    <PageHeader eyebrow={locale === "en" ? "Operations / Review" : "运营 / 审核"} title={locale === "en" ? "Exhibition review" : "展会审核"} description={locale === "en" ? "A considered review of every submission. Inspect the evidence, assess the fit, and publish with confidence." : "逐一审阅提交记录，检查来源、评估匹配度并批准发布。"}><button className={s.button} onClick={fetchQueues} disabled={loading}><RefreshCw size={15} />{locale === "en" ? "Refresh" : "刷新"}</button></PageHeader>
    <div className={s.toolbar}><p className={s.eyebrow}>{locale === "en" ? "New submissions" : "新提交记录"}</p><span className={s.pill + " " + s.pending}>{loading || error ? "—" : items.length} {locale === "en" ? "Pending Approval" : "待审批"}</span></div>
    {!canReview && <p className={s.hint}>{locale === "en" ? "Submissions are reviewed by a supervisor or administrator." : "提交记录由主管或管理员审核。"}</p>}
    {loading || error ? <LoadState locale={locale} error={error} retry={fetchQueues} /> : items.length === 0 ? <EmptyState title={locale === "en" ? "All Exhibition Records Reviewed" : "所有展会记录已审核"} description={locale === "en" ? "Your submission queue is clear. New exhibition records will appear here when they are ready for review." : "提交队列已清空。新的待审核展会记录将在此显示。"} pills={locale === "en" ? ["0 Pending Approval", "Database Synchronized"] : ["0 条待审批", "数据库已同步"]} /> : <div className={s.grid}>{items.map(item => item.event ? <HistoryRecordCard key={item.id} event={item.event} locale={locale} status={item.status} onInspect={() => setInspectEvent(item.event)} note={item.reason} metadata={[[locale === "en" ? "Submitted by" : "提交人", item.submittedBy?.name || "—"], [locale === "en" ? "Submitted on" : "提交日期", displayDate(item.createdAt, locale)]]} actions={canReview && <div className={s.actions}><button disabled={busy !== null} className={s.button + " " + s.primary} onClick={() => handleAction(item.id, "APPROVE")}><Check size={15} />{locale === "en" ? "Approve & publish" : "批准并发布"}</button><button disabled={busy !== null} className={s.button + " " + s.danger} onClick={() => handleAction(item.id, "REJECT")}><X size={15} />{locale === "en" ? "Reject" : "拒绝"}</button></div>} /> : <div key={item.id} className={s.error}>{locale === "en" ? "The event linked to this submission is unavailable." : "此提交记录关联的展会不可用。"}</div>)}</div>}
    <DossierDialog event={inspectEvent} locale={locale} onClose={() => setInspectEvent(null)} />
  </div>;
}
