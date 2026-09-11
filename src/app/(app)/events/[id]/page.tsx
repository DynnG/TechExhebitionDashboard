"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FitScoreBadge } from "@/components/events/fit-score-badge";
import { PriorityIndicator } from "@/components/events/priority-indicator";
import { BusinessLineChip } from "@/components/events/business-line-chip";
import { BUSINESS_LINES } from "@/lib/constants/business-lines";
import { EventForm } from "@/components/events/event-form";
import { ModalPortal } from "@/components/shared/modal-portal";
import { DeleteEventModal } from "@/components/events/delete-event-modal";
import { sanitizeEventUrl } from "@/lib/url";
import {
  MapPin,
  Calendar,
  Building,
  Globe,
  Users,
  DollarSign,
  Clock,
  Mail,
  User,
  Share2,
  Edit,
  Trash2,
  ArrowLeft,
  ExternalLink,
  Loader2,
  FileCheck,
  Award,
  Star,
  Ticket,
  CheckCircle2,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/use-translation";
import { localizeEvent } from "@/lib/i18n/event-localization";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "USER";
  const { locale, t } = useTranslation();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const localized = useMemo(() => (event ? localizeEvent(event, locale) : null), [event, locale]);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        if (res.ok) {
          setEvent(data.event);
        } else {
          toast.error(data.error || (locale === "zh" ? "未找到展会" : "Event not found"));
        }
      } catch (err) {
        toast.error(locale === "zh" ? "加载展会详情失败" : "Failed to load event details");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id, locale]);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success(locale === "zh" ? "展会记录已删除" : "Event record deleted");
        setShowDeleteModal(false);
        router.push("/events");
      } else {
        toast.error(locale === "zh" ? "删除展会失败" : "Failed to delete event");
      }
    } catch {
      toast.error(locale === "zh" ? "删除展会出错" : "Error deleting event");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-[#046241]">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <span className="text-xs font-semibold text-[#133020]">
          {locale === "zh" ? "正在加载展会详细规格..." : "Loading exhibition specifications..."}
        </span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-12 text-center text-[#B91C1C] font-semibold text-sm">
        {locale === "zh" ? "未找到相关展会记录。" : "Event not found."}
      </div>
    );
  }

  let businessLines: string[] = [];
  try {
    businessLines = JSON.parse(localized?.businessLines || "[]");
  } catch {
    businessLines = Array.isArray(localized?.businessLines)
      ? localized?.businessLines
      : [localized?.businessLines || "Global AI Data"];
  }

  let sourceLinks: string[] = [];
  try {
    sourceLinks = JSON.parse(event.sourceLinks || "[]");
  } catch {
    sourceLinks = Array.isArray(event.sourceLinks)
      ? event.sourceLinks
      : [event.sourceLinks];
  }

  const primaryBL = businessLines[0] || "Global AI Data";
  const blConfig = BUSINESS_LINES.find(
    (b) =>
      b.name.toLowerCase() === primaryBL.toLowerCase() ||
      primaryBL.includes(b.name)
  );
  const accentColor = blConfig ? blConfig.colorHex : "#046241";

  const isFree =
    event.boothCost?.toLowerCase().includes("free") ||
    event.boothCost === "$0" ||
    event.boothCost === "0";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-manrope">
      {/* Back Button & Section Title */}
      <div className="flex items-center justify-between">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#046241] hover:text-[#133020] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{locale === "zh" ? "返回展会列表" : "Back to All Events"}</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-[#666666]">
          {locale === "zh" ? "展会详细信息" : "Exhibition Details"}
        </span>
      </div>

      {/* Main Full-Width Standalone Card Container */}
      <div className="bg-white rounded-[12px] border-[1.5px] border-[#D8D2C8] shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden relative">
        {/* 6px Left Accent Bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[6px] z-10 rounded-l-[12px]"
          style={{ backgroundColor: accentColor }}
        />

        {/* HEADER AREA */}
        <div className="p-6 pl-8 border-b border-[#D8D2C8] bg-white">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold text-[#133020]">
                {locale === "zh"
                  ? `记录编号 #${localized?.eventNumber} · ${localized?.region}`
                  : `Record #${localized?.eventNumber} · ${localized?.region}`}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-tight ${
                  isFree
                    ? "bg-[#046241]/10 text-[#046241]"
                    : "bg-[#FFB347]/25 text-[#133020]"
                }`}
              >
                <Ticket className="w-3 h-3" />
                {locale === "zh"
                  ? isFree
                    ? "免费入场"
                    : "付费 / 需购票"
                  : isFree
                  ? "Free entry"
                  : "Paid / Ticketed"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const newAttended = !event.isAttended;
                    const res = await fetch(`/api/events/${event.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ isAttended: newAttended }),
                    });
                    if (res.ok) {
                      setEvent({ ...event, isAttended: newAttended });
                      if (newAttended) {
                        toast.success(
                          locale === "zh"
                            ? "展会已成功标记为已参展，正跳转至参展历史档案库！"
                            : "Event marked as Attended! Redirecting to Attendance History..."
                        );
                        router.push("/history?tab=ATTENDED");
                        router.refresh();
                      } else {
                        toast.success(
                          locale === "zh"
                            ? "已取消展会参展标记"
                            : "Event attendance removed"
                        );
                      }
                    }
                  } catch {
                    toast.error(
                      locale === "zh"
                        ? "更新参展状态失败"
                        : "Failed to update attendance status"
                    );
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs border ${
                  event.isAttended
                    ? "bg-[#046241] text-white border-[#046241]"
                    : "bg-[#F5EEDB] text-[#133020] border-[#D8D2C8] hover:border-[#046241]"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-[#FFB347]" />
                <span>
                  {event.isAttended
                    ? locale === "zh"
                      ? "已参展 ✓"
                      : "Already Attended ✓"
                    : locale === "zh"
                    ? "标记为已参展"
                    : "Mark as Attended"}
                </span>
              </button>

              <FitScoreBadge score={localized?.fitScore} size="xl" showLevel />
            </div>
          </div>

          <h1 className="text-[28px] font-semibold text-[#133020] tracking-tight leading-tight mb-3">
            {localized?.eventName}
          </h1>

          <div className="flex items-center gap-2 flex-wrap mb-4">
            {businessLines.map((bl) => (
              <BusinessLineChip key={bl} name={bl} />
            ))}
          </div>

          {/* Logistics & Official Website CTA */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-[#D8D2C8]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#133020]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-[#666666] block uppercase font-medium">
                    {locale === "zh" ? "展会日期" : "Dates"}
                  </span>
                  <span className="font-semibold text-sm">{localized?.dates}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-[#666666] block uppercase font-medium">
                    {locale === "zh" ? "地点" : "Location"}
                  </span>
                  <span className="font-semibold text-sm">
                    {localized?.city}, {localized?.country}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600 dark:text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-[#666666] block uppercase font-medium">
                    {locale === "zh" ? "展馆场地" : "Venue"}
                  </span>
                  <span className="font-semibold text-sm truncate block max-w-[200px]">
                    {localized?.venue}
                  </span>
                </div>
              </div>
            </div>

            {/* Official Website Button */}
            {(() => {
              let firstSource: string | null = null;
              try {
                const parsed = JSON.parse(event.sourceLinks || "[]");
                firstSource = Array.isArray(parsed) ? parsed[0] : null;
              } catch {
                firstSource = event.sourceLinks || null;
              }

              const validUrl = sanitizeEventUrl(event.officialWebsite, firstSource);
              if (!validUrl) return null;

              return (
                <a
                  href={validUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] font-medium text-xs rounded-[8px] transition-all duration-180 shadow-2xs"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>
                    {locale === "zh" ? "访问官方网站" : "Visit official website"}
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              );
            })()}
          </div>
        </div>

        {/* BODY (2-Column Grid) */}
        <div className="p-6 pl-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-[#D8D2C8]">
          {/* Left Column: Strategic Assessment */}
          <div className="space-y-4">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#046241] mb-1.5 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-[#046241]" />
                <span>
                  {locale === "zh"
                    ? "战略侧重点与展会定位"
                    : "Strategic focus & purpose"}
                </span>
              </h3>
              <p className="text-xs text-[#133020] leading-relaxed bg-[#F9F7F7] p-3.5 rounded-[8px] border border-[#D8D2C8]">
                {localized?.strategicFocus ||
                  (locale === "zh"
                    ? "重点产业科技情报展会"
                    : "Strategic industrial intelligence event")}
              </p>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#046241] mb-1.5">
                {locale === "zh" ? "与 Lifewood 的相关性" : "Relevance to Lifewood"}
              </h3>
              <p className="text-xs font-medium text-[#133020] leading-relaxed bg-[#F0F5F2] p-3.5 rounded-[8px] border border-[#046241]/20">
                {localized?.relevanceToLifewood ||
                  (locale === "zh"
                    ? "与 Lifewood 目标买家群体高度契合"
                    : "High alignment with Lifewood target buyers")}
              </p>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#666666] mb-1.5">
                {locale === "zh" ? "目标受众与买家画像" : "Target audience & buyers"}
              </h3>
              <p className="text-xs text-[#133020] bg-white p-3 rounded-[8px] border border-[#D8D2C8]">
                {localized?.targetAudience ||
                  (locale === "zh"
                    ? "企业买家、AI 技术负责人、战略采购团队"
                    : "Enterprise buyers, AI leaders, procurement teams")}
              </p>
            </div>

            {/* Location card */}
            <div className="bg-[#F5EEDB] p-3.5 rounded-[8px] border border-[#D8D2C8] space-y-1.5 text-xs text-[#133020]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[13px]">{localized?.venue}</span>
                {localized?.locationAddress &&
                  localized.locationAddress !== "Not publicly disclosed" &&
                  localized.locationAddress !== "未公开披露" && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${event.venue}, ${event.locationAddress}, ${event.city}, ${event.country}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#046241] hover:underline font-semibold"
                    >
                      <span>{locale === "zh" ? "谷歌地图" : "Google Maps"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
              </div>
              <p className="text-[#666666] text-[11.5px]">
                {localized?.locationAddress || `${localized?.city}, ${localized?.country}`}
              </p>
            </div>
          </div>

          {/* Right Column: Commercial & Organizer Specs */}
          <div className="space-y-4 bg-[#F9F7F7] p-5 rounded-[8px] border border-[#D8D2C8] text-xs">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#133020] border-b border-[#D8D2C8] pb-2">
              {locale === "zh" ? "商业规格与主办方信息" : "Commercial & organizer detail"}
            </h3>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="col-span-2">
                <span className="text-[10px] uppercase font-medium text-[#666666] block">
                  {locale === "zh" ? "主办机构" : "Organizer"}
                </span>
                <span className="font-semibold text-[#133020] text-sm">
                  {localized?.organizer || (locale === "zh" ? "未公开披露" : "Not publicly disclosed")}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-medium text-[#666666] block">
                  {locale === "zh" ? "参会规模预估" : "Estimated attendees"}
                </span>
                <span className="font-semibold text-[#046241]">
                  {localized?.estimatedAttendees ||
                    (locale === "zh" ? "未公开披露" : "Not publicly disclosed")}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-medium text-[#666666] block">
                  {locale === "zh" ? "展位 / 赞助费用" : "Booth / sponsorship cost"}
                </span>
                <span className="font-semibold text-[#133020]">
                  {localized?.boothCost || (locale === "zh" ? "未公开披露" : "Not publicly disclosed")}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-medium text-[#666666] block">
                  {locale === "zh" ? "报名截止日期" : "Registration deadline"}
                </span>
                <span className="font-medium text-[#133020]">
                  {localized?.registrationDeadline ||
                    (locale === "zh" ? "未公开披露" : "Not publicly disclosed")}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-medium text-[#666666] block">
                  {locale === "zh" ? "联络人" : "Contact person"}
                </span>
                <span className="font-medium text-[#133020]">
                  {localized?.contactPerson ||
                    (locale === "zh" ? "未公开披露" : "Not publicly disclosed")}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-[10px] uppercase font-medium text-[#666666] block">
                  {locale === "zh" ? "联络邮箱" : "Contact email"}
                </span>
                <span className="font-medium text-[#046241]">
                  {localized?.contactEmail ||
                    (locale === "zh" ? "未公开披露" : "Not publicly disclosed")}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-[10px] uppercase font-medium text-[#666666] block">
                  {locale === "zh" ? "参展与赞助商合作权益" : "Exhibitor opportunities"}
                </span>
                <span className="text-[#133020]">
                  {localized?.exhibitorOpportunity ||
                    (locale === "zh" ? "未公开披露" : "Not publicly disclosed")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER & ACTIONS */}
        <div className="p-5 pl-8 bg-[#133020] text-white flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-[#FFB347] font-semibold">
              {locale === "zh" ? "建议：" : "Recommendation:"}
            </span>
            <span className="px-3 py-1 rounded-[6px] text-xs font-semibold bg-[#FFB347] text-[#133020]">
              {localized?.participationRec || (locale === "zh" ? "参展" : "Exhibit")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {(userRole === "SUPERADMIN" || userRole === "ADMIN") && (
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] font-medium text-xs rounded-[8px] transition shadow-2xs"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{locale === "zh" ? "编辑记录" : "Edit record"}</span>
              </button>
            )}

            {userRole === "SUPERADMIN" && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#B91C1C] hover:bg-[#B91C1C]/90 text-white font-medium text-xs rounded-[8px] transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{locale === "zh" ? "删除" : "Delete"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Event Pop-up Modal */}
      <ModalPortal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="bg-[#133020] text-white p-5 px-7 flex items-center justify-between shrink-0 shadow-sm border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFB347] text-[#133020] flex items-center justify-center font-bold shadow-xs">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {locale === "en" ? "Edit Exhibition Record" : "编辑展会记录"}
              </h3>
              <p className="text-[10px] text-[#F5EEDB]/70 uppercase tracking-wider">
                Record #{event?.eventNumber} • {event?.eventName}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowEditModal(false)}
            className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transform hover:rotate-90 transition duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto no-scrollbar">
          <EventForm
            initialData={event}
            isEditing={true}
            onSuccess={() => {
              setShowEditModal(false);
              window.location.reload();
            }}
            onCancel={() => setShowEditModal(false)}
          />
        </div>
      </ModalPortal>

      {/* Delete Event Modal */}
      <DeleteEventModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        eventName={localized?.eventName}
        isDeleting={isDeleting}
      />
    </div>
  );
}
