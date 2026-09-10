"use client";

import { useEffect, useState } from "react";
import { History, CheckCircle2, Calendar, Loader2, Sparkles, Eye, X, MapPin, Building, Globe, Trash2, User as UserIcon, Clock } from "lucide-react";
import { toast } from "sonner";
import { useLocaleStore } from "@/stores/locale-store";
import { FitScoreBadge } from "@/components/events/fit-score-badge";
import { PriorityIndicator } from "@/components/events/priority-indicator";
import { BusinessLineChip } from "@/components/events/business-line-chip";
import { ModalPortal } from "@/components/shared/modal-portal";
import { DeleteEventModal } from "@/components/events/delete-event-modal";
import { sanitizeEventUrl } from "@/lib/url";
import { useSession } from "next-auth/react";
import { localizeEvent } from "@/lib/i18n/event-localization";

export default function HistoryPage() {
  const { locale } = useLocaleStore();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "INTERN";

  const [activeTab, setActiveTab] = useState<"DECISIONS" | "ATTENDED">("DECISIONS");
  const [decisionFilter, setDecisionFilter] = useState<"ALL" | "APPROVED" | "REJECTED">("ALL");

  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModalEvent, setSelectedModalEvent] = useState<any>(null);
  const [deletingAttended, setDeletingAttended] = useState<{ id: number; eventName: string } | null>(null);
  const [isDeletingAttended, setIsDeletingAttended] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Fetch queue decisions
      const resQ = await fetch("/api/queues?status=HISTORY");
      const dataQ = await resQ.json();
      if (resQ.ok) {
        // Filter decisions within 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const items = (dataQ.queueItems || []).filter((item: any) => {
          const itemDate = new Date(item.resolvedAt || item.createdAt);
          return itemDate >= thirtyDaysAgo;
        });

        setHistoryItems(items);
      }

      // Fetch attended events (isAttended = true or participationRec = Exhibit / Attend)
      const resE = await fetch("/api/events?limit=100");
      const dataE = await resE.json();
      if (resE.ok) {
        const attended = (dataE.events || []).filter(
          (e: any) => e.isAttended || e.participationRec === "Exhibit" || e.participationRec === "Attend"
        );
        setAttendedEvents(attended);
      }
    } catch {
      toast.error(locale === "zh" ? "加载历史记录失败" : "Failed to load history log");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeleteAttended = (id: number, eventName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingAttended({ id, eventName });
  };

  const handleConfirmDeleteAttended = async () => {
    if (!deletingAttended) return;
    setIsDeletingAttended(true);
    try {
      const res = await fetch(`/api/events/${deletingAttended.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAttended: false }),
      });

      if (res.ok) {
        toast.success(
          locale === "zh"
            ? `已从参展记录中移除“${deletingAttended.eventName}”。`
            : `"${deletingAttended.eventName}" removed from attended log.`
        );
        setDeletingAttended(null);
        fetchHistory();
      } else {
        toast.error(locale === "zh" ? "更新记录失败" : "Failed to update record");
      }
    } catch {
      toast.error(locale === "zh" ? "移除记录出错" : "Error removing record");
    } finally {
      setIsDeletingAttended(false);
    }
  };

  return (
    <div className="min-h-screen -m-8 p-8 space-y-8 font-manrope bg-[#F5EEDB] dark:bg-[#133020] text-[#133020] dark:text-white transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D8D2C8] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#046241]/10 border border-[#046241]/30 flex items-center justify-center text-[#046241]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#FFB347]">
                {locale === "en" ? "Governance & Attendance History" : "审核与参展历史记录"}
              </h2>
              <p className="text-xs text-black dark:text-white/60 mt-0.5">
                {locale === "zh"
                  ? "主管审核决策历史审计日志（保留 30 天）与已参展展会档案记录"
                  : "Historical audit log for supervisor queue decisions (30-day retention) and permanent attended exhibition records"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#D8D2C8] gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab("DECISIONS")}
          className={`pb-3 transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "DECISIONS"
              ? "border-[#046241] text-[#046241]"
              : "border-transparent text-[#666666] hover:text-[#133020]"
          }`}
        >
          <span>{locale === "zh" ? "审核决策记录（保留 30 天）" : "Queue Decisions (30-Day Retention)"}</span>
          <span className="px-2 py-0.5 rounded-full bg-[#133020] text-white text-[10px] font-extrabold">
            {historyItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("ATTENDED")}
          className={`pb-3 transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "ATTENDED"
              ? "border-[#046241] text-[#046241]"
              : "border-transparent text-[#666666] hover:text-[#133020]"
          }`}
        >
          <span>{locale === "zh" ? "已参展展会档案（仅查看与删除）" : "Attended Exhibitions Log (View & Delete Only)"}</span>
          <span className="px-2 py-0.5 rounded-full bg-[#046241] text-white text-[10px] font-extrabold">
            {attendedEvents.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#046241]">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <span className="text-xs font-semibold text-[#133020] dark:text-white">
            {locale === "zh" ? "正在加载历史记录..." : "Loading history records..."}
          </span>
        </div>
      ) : activeTab === "DECISIONS" ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#F5EEDB] dark:bg-[#FFFFFF] rounded-xl border border-[#D8D2C8] dark:border-[#1E4830] text-xs text-[#133020] dark:text-black transition-colors duration-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C17110] shrink-0" />
              <span>
                {locale === "zh" ? (
                  <>
                    <strong>30天自动归档机制：</strong>审核决策记录将在 30 天后自动清理。点击任意记录可在弹窗中查看完整参数规格。
                  </>
                ) : (
                  <>
                    <strong>30-Day Auto-Clear Policy:</strong> Decisions clear automatically after 30 days. Click any item to inspect full specifications in popup modal.
                  </>
                )}
              </span>
            </div>

            {/* Decision Status Filter Pills */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#D8D2C8] shrink-0">
              <button
                onClick={() => setDecisionFilter("ALL")}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  decisionFilter === "ALL"
                    ? "bg-[#133020] text-white shadow-2xs"
                    : "text-[#666666] hover:text-[#133020]"
                }`}
              >
                {locale === "zh" ? "全部决策" : "All Decisions"}
              </button>
              <button
                onClick={() => setDecisionFilter("APPROVED")}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  decisionFilter === "APPROVED"
                    ? "bg-[#046241] text-white shadow-2xs"
                    : "text-[#666666] hover:text-[#133020]"
                }`}
              >
                {locale === "zh" ? "已批准" : "Approved"}
              </button>
              <button
                onClick={() => setDecisionFilter("REJECTED")}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  decisionFilter === "REJECTED"
                    ? "bg-[#B91C1C] text-white shadow-2xs"
                    : "text-[#666666] hover:text-[#133020]"
                }`}
              >
                {locale === "zh" ? "已驳回" : "Rejected"}
              </button>
            </div>
          </div>

          {historyItems.filter((i) => decisionFilter === "ALL" || i.status === decisionFilter).length === 0 ? (
            <div className="bg-white dark:bg-[#1A3828] border border-[#D8D2C8] dark:border-[#1E4830] rounded-2xl p-16 text-center max-w-md mx-auto my-8 font-manrope shadow-xs">
              <History className="w-12 h-12 text-[#666666] dark:text-white/50 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#133020] dark:text-white mb-1">
                {locale === "zh" ? "未找到审核决策记录" : "No decision records found"}
              </h3>
              <p className="text-xs text-[#666666] dark:text-white/60">
                {locale === "zh"
                  ? "在过去 30 天内未找到符合此筛选条件的决策记录。"
                  : "No matching queue decisions found for this filter within the past 30 days."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {historyItems
                .filter((i) => decisionFilter === "ALL" || i.status === decisionFilter)
                .map((item) => {
                  const localizedEvt = localizeEvent(item.event, locale);
                  const statusLabel =
                    item.status === "APPROVED"
                      ? (locale === "zh" ? "已批准" : "APPROVED")
                      : (locale === "zh" ? "已驳回" : "REJECTED");

                  let businessLines: string[] = [];
                  try {
                    businessLines = JSON.parse(localizedEvt?.businessLines || "[]");
                  } catch {
                    businessLines = Array.isArray(localizedEvt?.businessLines)
                      ? localizedEvt.businessLines
                      : localizedEvt?.businessLines ? [localizedEvt.businessLines] : [];
                  }

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedModalEvent(item.event)}
                      className="bg-white dark:bg-[#1A3828] rounded-xl border border-[#D8D2C8] dark:border-[#1E4830] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all p-5 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs text-[#666666] dark:text-white/60">
                              <span className="font-bold text-[#133020] dark:text-white">#{localizedEvt?.eventNumber}</span>
                              <span>·</span>
                              <span className="font-medium">{localizedEvt?.dates}</span>
                            </div>
                            <span className="text-[11px] text-[#666666] dark:text-white/60 font-medium block mt-0.5">
                              {localizedEvt?.region} · {localizedEvt?.country}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {localizedEvt?.fitScore && (
                              <FitScoreBadge score={localizedEvt.fitScore} size="lg" showLevel />
                            )}
                          </div>
                        </div>

                        <h3 className="font-bold text-base text-[#133020] dark:text-white group-hover:text-[#046241] dark:group-hover:text-[#52B788] transition line-clamp-2 leading-snug">
                          {localizedEvt?.eventName}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-[#666666] dark:text-white/60 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#046241] dark:text-[#52B788] shrink-0" />
                          <span className="truncate">{localizedEvt?.city}, {localizedEvt?.country}</span>
                        </div>

                        {/* Decision Details Box */}
                        <div className="text-xs bg-[#F9F7F7] dark:bg-[#133020] p-3 rounded-lg border border-[#D8D2C8] dark:border-[#1E4830] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#666666] dark:text-white/60 uppercase">
                              {locale === "zh" ? "决策依据" : "Rationale"}
                            </span>
                            <span className="text-[10px] text-[#666666] dark:text-white/50">
                              {new Date(item.resolvedAt || item.createdAt).toLocaleDateString(
                                locale === "zh" ? "zh-CN" : "en-US"
                              )}
                            </span>
                          </div>
                          <p className="text-xs text-[#133020] dark:text-white line-clamp-2 leading-relaxed">
                            {item.reason}
                          </p>
                        </div>

                        {businessLines.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            {businessLines.slice(0, 2).map((bl) => (
                              <BusinessLineChip key={bl} name={bl} />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Unified Bottom Action Bar */}
                      <div className="pt-4 mt-4 border-t border-[#D8D2C8] dark:border-[#1E4830] flex items-center justify-between text-xs">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            item.status === "APPROVED"
                              ? "bg-[#046241] text-white"
                              : "bg-[#B91C1C] text-white"
                          }`}
                        >
                          {statusLabel}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModalEvent(item.event);
                            }}
                            className="px-3 py-1.5 bg-[#F5EEDB] dark:bg-[#133020] text-[#046241] dark:text-[#52B788] hover:bg-[#046241] hover:text-white rounded-lg font-bold transition flex items-center gap-1 text-[11px] cursor-pointer"
                            title={locale === "zh" ? "查看完整参数规格" : "View Full Specifications"}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{locale === "zh" ? "查看" : "View"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      ) : (
        /* ATTENDED EXHIBITIONS TAB — Strictly View Only & Delete Only */
        <div className="space-y-4 font-manrope">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#F5EEDB] dark:bg-[#FFFFFF] rounded-xl border border-[#D8D2C8] dark:border-[#1E4830] text-xs text-[#133020] dark:text-black transition-colors duration-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#046241] shrink-0" />
              <span>
                {locale === "zh" ? (
                  <>
                    <strong>已参展档案库（仅支持查看与删除）：</strong>点击任意展会卡片可在弹窗中查看完整参数规格。
                  </>
                ) : (
                  <>
                    <strong>Attended Registry (View & Delete Only):</strong> Click any exhibition card to view full specifications in popup modal.
                  </>
                )}
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#046241] bg-white px-2.5 py-1 rounded-full border border-[#046241]/30">
              {attendedEvents.length} {locale === "zh" ? "场已核验归档" : "Verified Logged"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attendedEvents.map((evt) => {
              const localizedEvt = localizeEvent(evt, locale);
              let businessLines: string[] = [];
              try {
                businessLines = JSON.parse(localizedEvt.businessLines || "[]");
              } catch {
                businessLines = Array.isArray(localizedEvt.businessLines)
                  ? localizedEvt.businessLines
                  : [localizedEvt.businessLines];
              }

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedModalEvent(evt)}
                  className="bg-white rounded-xl border-[1.5px] border-[#D8D2C8] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all p-5 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-[#666666]">
                          <span className="font-bold text-[#133020]">#{localizedEvt.eventNumber}</span>
                          <span>·</span>
                          <span className="font-medium">{localizedEvt.dates}</span>
                        </div>
                        <span className="text-[11px] text-[#666666] font-medium block mt-0.5">
                          {localizedEvt.region} · {localizedEvt.country}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <FitScoreBadge score={localizedEvt.fitScore} size="lg" showLevel />
                      </div>
                    </div>

                    <h3 className="font-bold text-base text-[#133020] group-hover:text-[#046241] transition line-clamp-2 leading-snug">
                      {localizedEvt.eventName}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-[#666666] truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#046241] shrink-0" />
                      <span className="truncate">{localizedEvt.city}, {localizedEvt.country}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {businessLines.slice(0, 2).map((bl) => (
                        <BusinessLineChip key={bl} name={bl} />
                      ))}
                    </div>
                  </div>

                  {/* View & Delete Action Controls Only */}
                  <div className="pt-4 mt-4 border-t border-[#D8D2C8] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-[#046241] font-bold">
                      <CheckCircle2 className="w-4 h-4 text-[#046241]" />
                      <span>{locale === "zh" ? "已参展" : "Attended"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModalEvent(evt);
                        }}
                        className="px-3 py-1.5 bg-[#F5EEDB] text-[#046241] hover:bg-[#046241] hover:text-white rounded-lg font-bold transition flex items-center gap-1 text-[11px]"
                        title={locale === "zh" ? "查看完整参数规格" : "View Full Specifications"}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{locale === "zh" ? "查看" : "View"}</span>
                      </button>

                      {(userRole === "ADMIN" || userRole === "SUPERVISOR") && (
                        <button
                          onClick={(e) => handleDeleteAttended(evt.id, evt.eventName, e)}
                          className="px-3 py-1.5 bg-[#B91C1C]/10 text-[#B91C1C] hover:bg-[#B91C1C] hover:text-white rounded-lg font-bold transition flex items-center gap-1 text-[11px]"
                          title={locale === "zh" ? "从参展档案库中移除" : "Delete from Attended Registry"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{locale === "zh" ? "删除" : "Delete"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Specifications Popup Modal */}
      <ModalPortal isOpen={!!selectedModalEvent} onClose={() => setSelectedModalEvent(null)}>
        {(() => {
          const locModalEvt = selectedModalEvent ? localizeEvent(selectedModalEvent, locale) : null;
          return (
            <>
              <div className="bg-[#133020] text-white p-5 px-7 flex items-center justify-between shrink-0 shadow-sm border-b border-white/10 font-manrope">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FFB347] text-[#133020] flex items-center justify-center font-bold shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      {locale === "zh" ? "展会完整参数规格" : "Full Exhibition Specifications"}
                    </h3>
                    <p className="text-[10px] text-[#F5EEDB]/70 uppercase tracking-wider">
                      {locale === "zh"
                        ? `记录 #${locModalEvt?.eventNumber} · ${locModalEvt?.eventName}`
                        : `Record #${locModalEvt?.eventNumber} · ${locModalEvt?.eventName}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedModalEvent(null)}
                  className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transform hover:rotate-90 transition duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 bg-white max-h-[82vh] overflow-y-auto space-y-6 text-xs font-manrope">
                {locModalEvt && (
                  <>
                    {/* Header Title & Score */}
                    <div className="flex items-start justify-between gap-4 border-b border-[#D8D2C8] pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#133020]">
                            {locale === "zh"
                              ? `记录 #${locModalEvt.eventNumber} · ${locModalEvt.region}`
                              : `Record #${locModalEvt.eventNumber} · ${locModalEvt.region}`}
                          </span>
                          {locModalEvt.isAttended && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#046241] text-white font-extrabold text-[10px]">
                              {locale === "zh" ? "✓ 已参展" : "✓ Attended"}
                            </span>
                          )}
                        </div>
                        <h4 className="text-2xl font-bold text-[#133020] leading-tight">
                          {locModalEvt.eventName}
                        </h4>
                        <p className="text-xs text-[#666666]">
                          📍 {locModalEvt.city}, {locModalEvt.country}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <PriorityIndicator priority={locModalEvt.priorityLevel} />
                        <FitScoreBadge score={locModalEvt.fitScore} size="xl" showLevel />
                      </div>
                    </div>

                    {/* Logistics & Primary Specs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F9F7F7] p-5 rounded-2xl border border-[#D8D2C8]">
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">
                          {locale === "zh" ? "展会日期" : "Dates"}
                        </span>
                        <div className="flex items-center gap-1.5 font-bold text-sm text-[#133020]">
                          <Calendar className="w-4 h-4 text-[#046241]" />
                          <span>{locModalEvt.dates}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">
                          {locale === "zh" ? "展馆场地" : "Venue Name"}
                        </span>
                        <div className="flex items-center gap-1.5 font-bold text-sm text-[#133020]">
                          <Building className="w-4 h-4 text-[#046241]" />
                          <span>{locModalEvt.venue || (locale === "zh" ? "未公开披露" : "Not disclosed")}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">
                          {locale === "zh" ? "主办机构" : "Organizer"}
                        </span>
                        <div className="flex items-center gap-1.5 font-bold text-sm text-[#133020]">
                          <UserIcon className="w-4 h-4 text-[#046241]" />
                          <span>{locModalEvt.organizer || (locale === "zh" ? "未公开披露" : "Not disclosed")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Business Lines & Official Website CTA */}
                    <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl border border-[#D8D2C8] bg-white">
                      <div>
                        <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block mb-1.5">
                          {locale === "zh" ? "对齐业务线" : "Business Lines Alignment"}
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(() => {
                            let lines: string[] = [];
                            try {
                              lines = JSON.parse(locModalEvt.businessLines || "[]");
                            } catch {
                              lines = Array.isArray(locModalEvt.businessLines)
                                ? locModalEvt.businessLines
                                : [locModalEvt.businessLines];
                            }
                            return lines.map((bl) => <BusinessLineChip key={bl} name={bl} />);
                          })()}
                        </div>
                      </div>

                      {(() => {
                        let firstSource: string | null = null;
                        try {
                          const parsed = JSON.parse(locModalEvt.sourceLinks || "[]");
                          firstSource = Array.isArray(parsed) ? parsed[0] : null;
                        } catch {
                          firstSource = locModalEvt.sourceLinks || null;
                        }

                        const validUrl = sanitizeEventUrl(locModalEvt.officialWebsite, firstSource);
                        if (!validUrl) return null;

                        return (
                          <a
                            href={validUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-xs"
                          >
                            <Globe className="w-4 h-4" />
                            <span>{locale === "zh" ? "访问官方网站 ↗" : "Visit Official Website ↗"}</span>
                          </a>
                        );
                      })()}
                    </div>

                    {/* Strategic Analysis & Relevance */}
                    <div className="space-y-3">
                      <div className="bg-[#F0F5F2] p-4 rounded-xl border border-[#046241]/20 space-y-1">
                        <span className="text-[10px] text-[#046241] font-extrabold uppercase tracking-wider block">
                          {locale === "zh" ? "与 Lifewood 的相关性" : "Relevance to Lifewood"}
                        </span>
                        <p className="text-xs text-[#133020] leading-relaxed font-medium">
                          {locModalEvt.relevanceToLifewood ||
                            locModalEvt.strategicFocus ||
                            (locale === "zh" ? "契合企业级买家战略需求" : "Strategic buyer alignment")}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#F9F7F7] p-4 rounded-xl border border-[#D8D2C8] space-y-1">
                          <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">
                            {locale === "zh" ? "目标受众与买家画像" : "Target Audience"}
                          </span>
                          <p className="text-xs font-semibold text-[#133020]">
                            {locModalEvt.targetAudience || (locale === "zh" ? "企业级采购决策者" : "Enterprise buyers")}
                          </p>
                        </div>

                        <div className="bg-[#F9F7F7] p-4 rounded-xl border border-[#D8D2C8] space-y-1">
                          <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">
                            {locale === "zh" ? "参会建议" : "Participation Recommendation"}
                          </span>
                          <span className="inline-block px-3 py-1 bg-[#FFB347] text-[#133020] font-bold text-xs rounded-lg">
                            {locModalEvt.participationRec || (locale === "zh" ? "参展" : "Exhibit")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Details Table */}
                    <div className="bg-[#F9F7F7] p-4 rounded-xl border border-[#D8D2C8] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] text-[#666666] font-bold uppercase block">
                          {locale === "zh" ? "参会人数" : "Attendees"}
                        </span>
                        <span className="font-bold text-[#133020]">
                          {locModalEvt.estimatedAttendees || (locale === "zh" ? "未公开披露" : "Not disclosed")}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#666666] font-bold uppercase block">
                          {locale === "zh" ? "展位费用" : "Booth Cost"}
                        </span>
                        <span className="font-bold text-[#133020]">
                          {locModalEvt.boothCost || (locale === "zh" ? "未公开披露" : "Not disclosed")}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#666666] font-bold uppercase block">
                          {locale === "zh" ? "参展合作权益" : "Opportunity"}
                        </span>
                        <span className="font-bold text-[#133020]">
                          {locModalEvt.exhibitorOpportunity || (locale === "zh" ? "未公开披露" : "Not disclosed")}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#666666] font-bold uppercase block">
                          {locale === "zh" ? "报名截止" : "Deadline"}
                        </span>
                        <span className="font-bold text-[#133020]">
                          {locModalEvt.registrationDeadline || (locale === "zh" ? "未公开披露" : "Not disclosed")}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          );
        })()}
      </ModalPortal>

      {/* Delete / Remove Attended Event Modal */}
      <DeleteEventModal
        isOpen={!!deletingAttended}
        onClose={() => setDeletingAttended(null)}
        onConfirm={handleConfirmDeleteAttended}
        title={locale === "zh" ? "从参展档案中移除" : "Remove from Attended Log"}
        eventName={deletingAttended?.eventName}
        description={
          locale === "zh"
            ? "确定要从已参展档案中移除此展会记录吗？此操作将解除参展标记。"
            : "Are you sure you want to remove this event from the attended log? This will unmark the event's attended status."
        }
        isDeleting={isDeletingAttended}
      />
    </div>
  );
}
