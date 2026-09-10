"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FitScoreBadge } from "@/components/events/fit-score-badge";
import { PriorityIndicator } from "@/components/events/priority-indicator";
import { ModalPortal } from "@/components/shared/modal-portal";
import { ListTodo, CheckCircle, XCircle, Clock, Globe, Eye, Sparkles, X, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Check, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { useLocaleStore } from "@/stores/locale-store";
import { sanitizeEventUrl } from "@/lib/url";
import { localizeEvent } from "@/lib/i18n/event-localization";

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
      const res = await fetch("/api/queues?status=PENDING");
      const data = await res.json();
      if (res.ok) {
        setItems(data.queueItems || []);
      }
    } catch {
      toast.error(locale === "zh" ? "加载队列记录失败" : "Failed to load queue items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);
  useEffect(() => { void fetchQueues(); }, [fetchQueues]);

  async function handleAction(id: number, action: "APPROVE" | "REJECT") {
    if (busy !== null) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/queues/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        toast.success(
          action === "APPROVE"
            ? (locale === "zh" ? "记录已批准并发布至展会库！" : "Item approved & published to catalog!")
            : (locale === "zh" ? "记录已被驳回" : "Item rejected")
        );
        fetchQueues();
      } else {
        const data = await res.json();
        toast.error(data.error || (locale === "zh" ? "操作失败" : "Action failed"));
      }
    } catch {
      toast.error(locale === "zh" ? "处理队列操作出错" : "Error processing queue action");
    }
  };

  const filteredItems = items.filter((i) => i.type === activeTab);

  return (
    <div className="space-y-6 font-manrope">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D8D2C8] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#046241]/10 border border-[#046241]/30 flex items-center justify-center text-[#046241]">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#133020]">
                {locale === "en" ? "Review & Governance Queues" : "审核与更正队列"}
              </h2>
              <p className="text-xs text-[#666666] mt-0.5">
                {locale === "zh"
                  ? "主管与管理员审核流水线，用于评估实习生草稿、AI 抓取记录与数据更正申请"
                  : "Supervisor & Admin approval pipeline for intern drafts, AI scraped records, and data corrections"}
              </p>
            </div>
          </div>
        </div>

        {userRole === "INTERN" && (
          <div className="px-3.5 py-2 bg-[#FFB347]/20 border border-[#FFB347] text-[#133020] text-xs font-bold rounded-xl flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C17110]" />
            <span>{locale === "zh" ? "实习生提交待主管审核" : "Intern Submissions Awaiting Supervisor Review"}</span>
          </div>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-[#D8D2C8] gap-6">
        <button
          onClick={() => setActiveTab("FOR_REVIEW")}
          className={`pb-3 text-xs font-extrabold transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "FOR_REVIEW"
              ? "border-[#046241] text-[#046241]"
              : "border-transparent text-[#666666] hover:text-[#133020]"
          }`}
        >
          <span>{locale === "zh" ? "待审核（新提交）" : "For Review (New Submissions)"}</span>
          <span className="px-2 py-0.5 rounded-full bg-[#133020] text-white text-[10px] font-extrabold">
            {items.filter((i) => i.type === "FOR_REVIEW" && i.status === "PENDING").length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("CORRECTION")}
          className={`pb-3 text-xs font-extrabold transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "CORRECTION"
              ? "border-[#046241] text-[#046241]"
              : "border-transparent text-[#666666] hover:text-[#133020]"
          }`}
        >
          <span>{locale === "zh" ? "更正队列（数据修改）" : "Corrections Queue (Data Edits)"}</span>
          <span className="px-2 py-0.5 rounded-full bg-[#708E7C] text-white text-[10px] font-extrabold">
            {items.filter((i) => i.type === "CORRECTION" && i.status === "PENDING").length}
          </span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#046241]">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <span className="text-xs font-semibold text-[#133020]">
            {locale === "zh" ? "正在加载待处理队列记录..." : "Loading pending queue records..."}
          </span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#D8D2C8] rounded-2xl p-12 text-center max-w-md mx-auto my-8 font-manrope">
          <div className="w-12 h-12 rounded-full bg-[#046241]/10 flex items-center justify-center text-[#046241] mx-auto mb-3">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#133020] mb-1">
            {locale === "zh" ? "队列已清空！" : "Queue is clear!"}
          </h3>
          <p className="text-xs text-[#666666]">
            {locale === "zh"
              ? "当前标签下的所有提交均已评估并录入展会库。"
              : "All submissions in this tab have been evaluated and processed into the catalog."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredItems.map((item) => {
              const localizedEvt = localizeEvent(item.event, locale);
              const statusText =
                item.status === "PENDING"
                  ? (locale === "zh" ? "待审核" : "PENDING")
                  : item.status === "APPROVED"
                  ? (locale === "zh" ? "已批准" : "APPROVED")
                  : (locale === "zh" ? "已驳回" : "REJECTED");

              const submitterRole =
                locale === "zh"
                  ? (item.submittedBy?.role === "ADMIN" ? "管理员" : item.submittedBy?.role === "SUPERVISOR" ? "主管" : "实习生")
                  : item.submittedBy?.role;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white p-6 rounded-2xl border border-[#D8D2C8] shadow-xs flex flex-col md:flex-row items-start justify-between gap-6 hover:shadow-md transition relative group"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          item.status === "PENDING"
                            ? "bg-[#FFB347] text-[#133020]"
                            : item.status === "APPROVED"
                            ? "bg-[#046241] text-white"
                            : "bg-[#B91C1C] text-white"
                        }`}
                      >
                        {statusText}
                      </span>

                      <span className="text-xs text-[#666666]">
                        {locale === "zh" ? "提交人：" : "Submitted by: "}
                        <strong className="text-[#133020]">{item.submittedBy?.name || (locale === "zh" ? "实习生" : "Intern")}</strong> ({submitterRole})
                      </span>

                      {localizedEvt?.priorityLevel && (
                        <PriorityIndicator priority={localizedEvt.priorityLevel} />
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <button
                          onClick={() => setInspectEvent(localizedEvt)}
                          className="font-bold text-base text-[#133020] hover:text-[#046241] text-left flex items-center gap-2 group cursor-pointer"
                        >
                          <span>
                            {locale === "zh" ? `记录 #${localizedEvt?.eventNumber} — ${localizedEvt?.eventName}` : `Record #${localizedEvt?.eventNumber} — ${localizedEvt?.eventName}`}
                          </span>
                          <Eye className="w-4 h-4 text-[#046241] group-hover:scale-110 transition" />
                        </button>

                        <p className="text-xs text-[#666666]">
                          📍 {localizedEvt?.city}, {localizedEvt?.country} • 🗓️ {localizedEvt?.dates} • {locale === "zh" ? "主办方：" : "Organizer: "}{localizedEvt?.organizer}
                        </p>
                      </div>

                      {localizedEvt?.fitScore && (
                        <FitScoreBadge score={localizedEvt.fitScore} size="lg" showLevel />
                      )}
                    </div>

                    <div className="text-xs text-[#133020] bg-[#F9F7F7] p-3.5 rounded-xl border border-[#D8D2C8] space-y-1">
                      <span className="font-bold text-[#046241] block uppercase tracking-wider text-[10px]">
                        {locale === "zh" ? "提交理由与来源：" : "Submission Rationale & Source:"}
                      </span>
                      <p className="leading-relaxed">{item.reason}</p>
                      {(() => {
                        let firstSource: string | null = null;
                        try {
                          const parsed = JSON.parse(item.event?.sourceLinks || "[]");
                          firstSource = Array.isArray(parsed) ? parsed[0] : null;
                        } catch {
                          firstSource = item.event?.sourceLinks || null;
                        }
                        const validUrl = sanitizeEventUrl(
                          item.event?.officialWebsite,
                          firstSource
                        );
                        if (!validUrl) return null;
                        return (
                          <a
                            href={validUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-[#046241] hover:underline pt-1"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>{locale === "zh" ? "查看官方抓取源站 ↗" : "Inspect Official Scraped Site ↗"}</span>
                          </a>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Governance Actions for Supervisor / Admin */}
                  {item.status === "PENDING" && (userRole === "ADMIN" || userRole === "SUPERVISOR") && (
                    <div className="flex flex-row md:flex-col items-center gap-2 shrink-0 self-center">
                      <button
                        onClick={() => handleAction(item.id, "APPROVE")}
                        className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#046241] hover:bg-[#133020] text-white font-bold text-xs rounded-xl transition shadow-sm w-full cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4 text-[#FFB347]" />
                        <span>{locale === "zh" ? "批准并发布" : "Approve & Publish"}</span>
                      </button>

                      <button
                        onClick={() => handleAction(item.id, "REJECT")}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#B91C1C]/10 text-[#B91C1C] hover:bg-[#B91C1C]/20 font-bold text-xs rounded-xl transition w-full cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{locale === "zh" ? "驳回" : "Reject"}</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Inspect Event Specs Popup Modal */}
      <ModalPortal isOpen={!!inspectEvent} onClose={() => setInspectEvent(null)}>
        <div className="bg-[#133020] text-white p-5 px-7 flex items-center justify-between shrink-0 shadow-sm border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFB347] text-[#133020] flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {locale === "zh" ? "队列记录规格详情" : "Queue Record Specifications"}
              </h3>
              <p className="text-[10px] text-[#F5EEDB]/70 uppercase tracking-wider">
                {locale === "zh"
                  ? `记录 #${inspectEvent?.eventNumber} · ${inspectEvent?.eventName}`
                  : `Record #${inspectEvent?.eventNumber} · ${inspectEvent?.eventName}`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setInspectEvent(null)}
            className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transform hover:rotate-90 transition duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 bg-white max-h-[80vh] overflow-y-auto space-y-4 text-xs font-manrope">
          {inspectEvent && (
            <>
              <div className="flex items-center justify-between border-b border-[#D8D2C8] pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">
                    {locale === "zh" ? "展会名称与区域" : "Event Name & Region"}
                  </span>
                  <h4 className="text-lg font-bold text-[#133020]">{inspectEvent.eventName}</h4>
                  <p className="text-xs text-[#666666]">📍 {inspectEvent.city}, {inspectEvent.country} ({inspectEvent.region})</p>
                </div>
                <FitScoreBadge score={inspectEvent.fitScore} size="xl" showLevel />
              </div>

              <div className="grid grid-cols-2 gap-4 bg-[#F9F7F7] p-4 rounded-xl border border-[#D8D2C8]">
                <div>
                  <span className="text-[10px] text-[#666666] font-bold uppercase block">
                    {locale === "zh" ? "主办方" : "Organizer"}
                  </span>
                  <span className="font-bold text-[#133020]">{inspectEvent.organizer || (locale === "zh" ? "未公开披露" : "Not disclosed")}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666666] font-bold uppercase block">
                    {locale === "zh" ? "展会日期" : "Dates"}
                  </span>
                  <span className="font-bold text-[#133020]">{inspectEvent.dates}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666666] font-bold uppercase block">
                    {locale === "zh" ? "展馆/场地" : "Venue"}
                  </span>
                  <span className="font-bold text-[#133020]">{inspectEvent.venue || (locale === "zh" ? "未公开披露" : "Not disclosed")}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666666] font-bold uppercase block">
                    {locale === "zh" ? "目标受众" : "Target Audience"}
                  </span>
                  <span className="font-bold text-[#133020]">{inspectEvent.targetAudience || (locale === "zh" ? "企业级采购决策者" : "Enterprise buyers")}</span>
                </div>
              </div>

              <div className="bg-[#F0F5F2] p-4 rounded-xl border border-[#046241]/20 space-y-1">
                <span className="text-[10px] text-[#046241] font-bold uppercase block">
                  {locale === "zh" ? "与 Lifewood 战略相关性" : "Relevance to Lifewood"}
                </span>
                <p className="text-xs text-[#133020] leading-relaxed">
                  {inspectEvent.relevanceToLifewood || inspectEvent.strategicFocus || (locale === "zh" ? "契合企业级买家战略需求" : "Strategic buyer alignment")}
                </p>
              </div>
            </>
          )}
        </div>
      </ModalPortal>
    </div>
  );
}
