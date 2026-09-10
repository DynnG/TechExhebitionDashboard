"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PriorityIndicator } from "./priority-indicator";
import { BusinessLineChip } from "./business-line-chip";
import { BUSINESS_LINES } from "@/lib/constants/business-lines";
import { MapPin } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";
import { localizeEvent } from "@/lib/i18n/event-localization";

interface EventCardProps {
  event: any;
  onToggleAttended?: (id: number, currentStatus: boolean) => Promise<void> | void;
}

export function EventCard({ event }: EventCardProps) {
  const { locale, t } = useTranslation();
  const localized = useMemo(() => localizeEvent(event, locale), [event, locale]);

  let businessLines: string[] = [];
  try {
    businessLines = JSON.parse(localized.businessLines || "[]");
  } catch {
    businessLines = Array.isArray(localized.businessLines)
      ? localized.businessLines
      : [localized.businessLines];
  }

  const primaryBL = businessLines[0] || "Global AI Data";
  const blConfig = BUSINESS_LINES.find(
    (b) =>
      b.name.toLowerCase() === primaryBL.toLowerCase() ||
      primaryBL.includes(b.name)
  );
  const accentColor = blConfig ? blConfig.colorHex : "#046241";

  const fitLevel =
    localized.fitScore >= 4
      ? locale === "zh"
        ? "高度契合"
        : "High"
      : localized.fitScore === 3
      ? locale === "zh"
        ? "中度契合"
        : "Mid"
      : locale === "zh"
      ? "基础契合"
      : "Low";

  const fitColor =
    localized.fitScore >= 4
      ? "text-[#046241]"
      : localized.fitScore === 3
      ? "text-[#C17110]"
      : "text-[#708E7C]";

  return (
    <Link
      href={`/events/${localized.id}`}
      className="bg-white rounded-[12px] border-[1.5px] border-[#D8D2C8] shadow-[0_2px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.08)] hover:-translate-y-[1px] transition-all duration-180 overflow-hidden flex flex-col justify-between relative group cursor-pointer block font-manrope"
    >
      {/* 6px Color Accent Bar on Left Edge */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[6px] z-10 rounded-l-[12px]"
        style={{ backgroundColor: accentColor }}
      />

      {/* HEADER AREA */}
      <div className="p-5 pl-6 space-y-3">
        {/* Event # · Date & Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[12px] text-[#666666]">
              <span className="font-semibold text-[#133020]">#{localized.eventNumber}</span>
              <span>·</span>
              <span className="text-[#666666] font-medium">{localized.dates}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#666666]">
              <span>{localized.region}</span>
              {localized.country && <span>· {localized.country}</span>}
            </div>
          </div>

          <div className="flex items-center shrink-0">
            {/* Enlarged numeric fit score + High / Mid / Low indicator below */}
            <div
              className="flex flex-col items-center justify-center min-w-[44px] px-2.5 py-1 rounded-[8px] bg-[#F9F7F7] dark:bg-[#133020] border border-[#D8D2C8] dark:border-[#1E4830]"
              title={
                locale === "zh"
                  ? `战略适配度：${localized.fitScore}/5 (${fitLevel})`
                  : `Fit score: ${localized.fitScore}/5 (${fitLevel} fit)`
              }
            >
              <span className="text-[26px] font-extrabold text-[#133020] dark:text-white leading-none">
                {localized.fitScore}
              </span>
              <span className={`text-[9.5px] font-bold uppercase tracking-wider mt-0.5 ${fitColor}`}>
                {fitLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Event Name */}
        <h3 className="text-[18px] font-semibold text-[#133020] group-hover:text-[#046241] transition leading-snug tracking-tight line-clamp-2">
          {localized.eventName}
        </h3>

        {/* Location & Venue */}
        <div className="flex items-center gap-1.5 text-[12px] text-[#666666] truncate">
          <MapPin className="w-3.5 h-3.5 text-[#046241] shrink-0" />
          <span className="truncate">
            {localized.city}, {localized.country}
            {localized.venue && (
              <span className="text-[#133020] font-medium"> · {localized.venue}</span>
            )}
          </span>
        </div>

        {/* Business Line Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {businessLines.map((bl) => (
            <BusinessLineChip key={bl} name={bl} />
          ))}
        </div>
      </div>

      {/* BODY GRID (auto-fit columns) */}
      <div className="border-t border-[#D8D2C8] bg-white px-5 pl-6 py-3 grid grid-cols-3 gap-2.5 text-[12px]">
        <div className="min-w-0">
          <span className="text-[10px] uppercase tracking-wider text-[#666666] font-medium block">
            {locale === "zh" ? "主办机构" : "Organizer"}
          </span>
          <span className="text-[12px] font-medium text-[#133020] truncate block" title={localized.organizer}>
            {localized.organizer || (locale === "zh" ? "未公开披露" : "Not disclosed")}
          </span>
        </div>
        <div className="min-w-0">
          <span className="text-[10px] uppercase tracking-wider text-[#666666] font-medium block">
            {locale === "zh" ? "目标受众" : "Audience"}
          </span>
          <span className="text-[12px] font-medium text-[#133020] truncate block" title={localized.targetAudience}>
            {localized.targetAudience || (locale === "zh" ? "企业级采购决策者" : "Enterprise buyers")}
          </span>
        </div>
        <div className="min-w-0">
          <span className="text-[10px] uppercase tracking-wider text-[#666666] font-medium block">
            {locale === "zh" ? "参会人数" : "Attendees"}
          </span>
          <span className="text-[12px] font-medium text-[#133020] truncate block" title={localized.estimatedAttendees}>
            {localized.estimatedAttendees || (locale === "zh" ? "未公开披露" : "Not disclosed")}
          </span>
        </div>
      </div>

      {/* STRATEGIC SECTION (green-tinted bg) */}
      <div className="border-t border-[#D8D2C8] bg-[#F0F5F2] px-5 pl-6 py-3 flex items-center justify-between gap-3 text-xs">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] uppercase tracking-wider text-[#046241] font-semibold block mb-0.5">
            {locale === "zh" ? "与 Lifewood 的相关性" : "Relevance to Lifewood"}
          </span>
          <p className="text-[12px] text-[#133020] line-clamp-2 leading-relaxed font-normal">
            {localized.relevanceToLifewood ||
              localized.strategicFocus ||
              (locale === "zh" ? "契合企业级买家战略需求" : "Strategic enterprise buyer alignment")}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <span className="text-[10px] uppercase tracking-wider text-[#666666] font-medium block mb-0.5">
            {locale === "zh" ? "建议" : "Recommendation"}
          </span>
          <span className="inline-block px-2.5 py-1 rounded-[6px] text-[11px] font-semibold bg-[#FFB347] text-[#133020] border border-[#FFB347]/40 shadow-2xs">
            {localized.participationRec || (locale === "zh" ? "参展" : "Exhibit")}
          </span>
        </div>
      </div>
    </Link>
  );
}
