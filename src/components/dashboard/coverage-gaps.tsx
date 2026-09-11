"use client";

import { useState, useMemo } from "react";
import { AlertCircle, Calendar, Globe, Layers } from "lucide-react";
import { useLocaleStore } from "@/stores/locale-store";
import {
  localizeMonthYear,
  REGIONS_MAP,
  BUSINESS_LINES_MAP,
} from "@/lib/i18n/event-localization";
import { REGIONS, BUSINESS_LINES } from "@/lib/constants/business-lines";

type ViewMode = "months" | "regions" | "businessLines";

interface CoverageGapsProps {
  gaps?: { month: string; count: number }[];
  eventsByRegion?: { region: string; count: number }[];
  businessLineDist?: { name: string; count: number }[];
}

export function CoverageGapsWidget({
  gaps = [],
  eventsByRegion = [],
  businessLineDist = [],
}: CoverageGapsProps) {
  const { locale } = useLocaleStore();
  const [view, setView] = useState<ViewMode>("months");

  const monthGaps = useMemo(() => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return (gaps || [])
      .filter((g) => {
        const parts = g.month.split(" ");
        const mIdx = monthNames.indexOf(parts[0]);
        const year = parseInt(parts[1] || "2026", 10);
        // Start from September 2026 (year > 2026 or (year === 2026 and month index >= 8))
        if (year < 2026) return false;
        if (year === 2026 && mIdx < 8) return false;
        return true;
      })
      .map((g) => ({
        id: g.month,
        name: localizeMonthYear(g.month, locale),
        count: g.count,
        needed: Math.max(0, 5 - g.count),
      }));
  }, [gaps, locale]);

  const regionGaps = useMemo(() => {
    const countsMap: Record<string, number> = {};

    (eventsByRegion || []).forEach((r) => {
      countsMap[r.region.toLowerCase()] = r.count;
    });

    return REGIONS.map((r) => {
      const count = countsMap[r.toLowerCase()] || 0;

      return {
        id: r,
        name: locale === "zh" ? REGIONS_MAP[r] || r : r,
        count,
        needed: Math.max(0, 5 - count),
      };
    })
      .filter((item) => item.needed > 0)
      .sort((a, b) => a.count - b.count);
  }, [eventsByRegion, locale]);

  const businessLineGaps = useMemo(() => {
    const countsMap: Record<string, number> = {};

    (businessLineDist || []).forEach((b) => {
      countsMap[b.name.toLowerCase()] = b.count;
    });

    return BUSINESS_LINES.map((b) => {
      const count = countsMap[b.name.toLowerCase()] || 0;

      return {
        id: b.id || b.name,
        name:
          locale === "zh"
            ? BUSINESS_LINES_MAP[b.name] || b.name
            : b.name,
        count,
        needed: Math.max(0, 5 - count),
      };
    })
      .filter((item) => item.needed > 0)
      .sort((a, b) => a.count - b.count);
  }, [businessLineDist, locale]);

  const currentGaps =
    view === "months"
      ? monthGaps
      : view === "regions"
        ? regionGaps
        : businessLineGaps;

  const viewButtons = [
    {
      id: "months" as const,
      labelEn: "Months",
      labelZh: "月份",
      icon: Calendar,
    },
    {
      id: "regions" as const,
      labelEn: "Regions",
      labelZh: "地区",
      icon: Globe,
    },
    {
      id: "businessLines" as const,
      labelEn: "Business Lines",
      labelZh: "业务线",
      icon: Layers,
    },
  ];

  return (
    <div className="bg-white p-5 rounded-[12px] border-[1.5px] border-[#D8D2C8] shadow-[0_2px_16px_rgba(0,0,0,0.05)] flex flex-col h-full font-manrope">

      {/* Header */}
      <div className="border-b border-[#D8D2C8] pb-3 mb-3.5">
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle className="w-4 h-4 text-[#C17110] shrink-0" />

          <h3 className="text-[14px] font-semibold text-[#133020]">
            {locale === "zh"
              ? "覆盖缺口评估"
              : "Coverage gap assessment"}
          </h3>
        </div>

        <p className="text-[11px] text-[#666666] mb-3">
          {view === "months"
            ? locale === "zh"
              ? "高匹配展会少于 5 场的月份，需补充采集"
              : "Months with < 5 high-fit exhibition entries requiring sourcing"
            : view === "regions"
              ? locale === "zh"
                ? "高匹配展会少于 5 场的大区，需补充拓展"
                : "Regions with < 5 high-fit exhibition entries requiring sourcing"
              : locale === "zh"
                ? "高匹配展会少于 5 场的业务线，需补充采集"
                : "Business lines with < 5 high-fit exhibition entries requiring sourcing"}
        </p>

        {/* View Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {viewButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = view === btn.id;

            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => setView(btn.id)}
                className={`h-12 px-2 text-xs font-semibold rounded-[8px] transition-all duration-150 flex items-center justify-center gap-1.5 select-none ${
                  isActive
                    ? "bg-[#133020] text-white border border-[#133020] shadow-xs"
                    : "bg-[#F5EEDB] text-[#133020] hover:bg-[#EDE5D0] border border-[#D8D2C8]/80 font-medium"
                }`}
                aria-pressed={isActive}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-white" : "text-[#133020]/75"
                  }`}
                />

                <span className="truncate">
                  {locale === "zh" ? btn.labelZh : btn.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {currentGaps.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center p-4 text-center text-xs text-[#046241] font-medium bg-[#046241]/10 rounded-[8px] border border-[#046241]/20">
          {view === "months"
            ? locale === "zh"
              ? "✓ 所有月份均已达到目标覆盖阈值（≥5 场展会）"
              : "✓ All months meet target coverage threshold (≥5 exhibitions)"
            : view === "regions"
              ? locale === "zh"
                ? "✓ 所有大区均已达到目标覆盖阈值（≥5 场展会）"
                : "✓ All regions meet target coverage threshold (≥5 exhibitions)"
              : locale === "zh"
                ? "✓ 所有业务线均已达到目标覆盖阈值（≥5 场展会）"
                : "✓ All business lines meet target coverage threshold (≥5 exhibitions)"}
        </div>
      ) : (
        <div className="h-[300px] overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#D8D2C8] hover:[&::-webkit-scrollbar-thumb]:bg-[#C17110]/50 [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="grid grid-cols-2 gap-x-2 gap-y-2">
            {currentGaps.map((item) => (
              <div
                key={item.id}
                className="p-2.5 bg-[#F5EEDB] border border-[#FFB347]/50 rounded-[8px] flex items-center justify-between shadow-2xs hover:border-[#FFB347] transition"
              >
                <div className="min-w-0 pr-1.5">
                  <span className="text-xs font-semibold text-[#133020] block truncate">
                    {item.name}
                  </span>

                  <span className="text-[10px] text-[#666666] font-medium block">
                    {locale === "zh"
                      ? `已录入 ${item.count} 场`
                      : `${item.count} listed`}
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded-[6px] bg-[#C17110] text-white text-[10px] font-semibold shrink-0 shadow-2xs whitespace-nowrap">
                  {locale === "zh"
                    ? `需补充 +${item.needed} 场`
                    : `+${item.needed} needed`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-[#D8D2C8] dark:border-[#1E4830] flex items-center justify-between text-[11px] text-[#666666] dark:text-white/60 shrink-0">
        <span className="text-[#046241] dark:text-[#52B788] font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#046241] dark:bg-[#52B788]" />

          <span>
            {view === "months"
              ? locale === "zh"
                ? `${currentGaps.length} 个缺口月份`
                : `${currentGaps.length} gap months`
              : view === "regions"
                ? locale === "zh"
                  ? `${currentGaps.length} 个缺口大区`
                  : `${currentGaps.length} gap regions`
                : locale === "zh"
                  ? `${currentGaps.length} 条缺口业务线`
                  : `${currentGaps.length} gap business lines`}
          </span>
        </span>

        <span className="font-medium">
          {view === "months"
            ? locale === "zh"
              ? "目标：每月 ≥ 5 场展会"
              : "Target: ≥ 5 exhibitions / month"
            : view === "regions"
              ? locale === "zh"
                ? "目标：每地区 ≥ 5 场展会"
                : "Target: ≥ 5 exhibitions / region"
              : locale === "zh"
                ? "目标：每业务线 ≥ 5 场展会"
                : "Target: ≥ 5 exhibitions / line"}
        </span>
      </div>
    </div>
  );
}