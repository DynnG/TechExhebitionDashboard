"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useLocaleStore } from "@/stores/locale-store";
import { localizeMonthYear, localizeRegionName } from "@/lib/i18n/event-localization";

interface CoverageGapsProps {
  gaps: { month: string; count: number }[];
  eventsByRegion?: { region: string; count: number }[];
  businessLineDist?: { name: string; count: number }[];
}

export function CoverageGapsWidget({
  gaps,
  eventsByRegion = [],
  businessLineDist = [],
}: CoverageGapsProps) {
  const { locale } = useLocaleStore();
  const [activeTab, setActiveTab] = useState<"months" | "regions" | "lines">("months");

  // Threshold is >= 5 verified entries
  const TARGET_THRESHOLD = 5;

  // Month gaps
  const monthGaps = gaps.filter((m) => m.count < TARGET_THRESHOLD);

  // Region gaps
  const ALL_REGIONS = ["Asia", "North America", "Europe", "Middle East"];
  const regionGaps = ALL_REGIONS.map((regionName) => {
    const found = eventsByRegion.find(
      (r) => r.region.toLowerCase() === regionName.toLowerCase()
    );
    return {
      region: regionName,
      count: found ? found.count : 0,
    };
  }).filter((r) => r.count < TARGET_THRESHOLD);

  // Business Line gaps
  const ALL_LINES = [
    "Global AI Data",
    "Data Annotation",
    "AI Training & Testing",
    "Language Technology",
    "Autonomous Mobility",
    "Digital Healthcare",
  ];
  const lineGaps = ALL_LINES.map((lineName) => {
    const found = businessLineDist.find(
      (b) => b.name.toLowerCase() === lineName.toLowerCase() || lineName.toLowerCase().includes(b.name.toLowerCase())
    );
    return {
      line: lineName,
      count: found ? found.count : 0,
    };
  }).filter((l) => l.count < TARGET_THRESHOLD);

  const totalGapCount = monthGaps.length + regionGaps.length + lineGaps.length;

  return (
    <div className="bg-white dark:bg-[#1A3828] p-5 rounded-[12px] border-[1.5px] border-[#D8D2C8] dark:border-[#1E4830] shadow-[0_2px_16px_rgba(0,0,0,0.05)] flex flex-col justify-between font-manrope h-full transition-colors">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between mb-4 border-b border-[#D8D2C8] dark:border-[#1E4830] pb-3.5 gap-2">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-[#046241] dark:text-[#52B788] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-[15px] font-bold text-[#133020] dark:text-white">
                {locale === "zh" ? "覆盖缺口评估" : "Coverage gap assessment"}
              </h3>
              <p className="text-[11px] text-[#666666] dark:text-white/60 mt-0.5">
                {locale === "zh"
                  ? "目标阈值：每个维度 ≥ 5 场已核验展会"
                  : "Target threshold: ≥ 5 verified entries per dimension"}
              </p>
            </div>
          </div>

          {/* Top-right pill showing total identified gap count */}
          <span className="px-2.5 py-1 rounded-full bg-[#046241]/10 dark:bg-[#046241]/25 border border-[#046241]/20 text-[#046241] dark:text-[#52B788] text-xs font-bold shrink-0">
            {totalGapCount} {locale === "zh" ? "项缺口" : "gaps"}
          </span>
        </div>

        {/* Dimension Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F9F7F7] dark:bg-[#133020] border border-[#D8D2C8] dark:border-[#1E4830] rounded-xl mb-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab("months")}
            className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "months"
                ? "bg-[#046241] text-white shadow-xs"
                : "text-[#666666] dark:text-white/70 hover:text-[#133020]"
            }`}
          >
            <span>{locale === "zh" ? "月份" : "Months"}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "months"
                  ? "bg-white/20 text-white"
                  : "bg-[#D8D2C8]/50 dark:bg-white/10 text-[#133020] dark:text-white"
              }`}
            >
              {monthGaps.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("regions")}
            className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "regions"
                ? "bg-[#046241] text-white shadow-xs"
                : "text-[#666666] dark:text-white/70 hover:text-[#133020]"
            }`}
          >
            <span>{locale === "zh" ? "区域" : "Regions"}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "regions"
                  ? "bg-white/20 text-white"
                  : "bg-[#D8D2C8]/50 dark:bg-white/10 text-[#133020] dark:text-white"
              }`}
            >
              {regionGaps.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("lines")}
            className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "lines"
                ? "bg-[#046241] text-white shadow-xs"
                : "text-[#666666] dark:text-white/70 hover:text-[#133020]"
            }`}
          >
            <span>{locale === "zh" ? "业务线" : "Lines"}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "lines"
                  ? "bg-white/20 text-white"
                  : "bg-[#D8D2C8]/50 dark:bg-white/10 text-[#133020] dark:text-white"
              }`}
            >
              {lineGaps.length}
            </span>
          </button>
        </div>

        {/* Sub-Card Display for Months */}
        {activeTab === "months" && (
          <div>
            {monthGaps.length === 0 ? (
              <div className="py-7 px-4 text-center text-xs text-[#046241] dark:text-[#52B788] font-bold bg-[#046241]/10 dark:bg-[#046241]/20 rounded-xl border border-[#046241]/20 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#046241] dark:text-[#52B788]" />
                <span>
                  {locale === "zh"
                    ? "所有月份均已达到目标覆盖阈值（≥5 场展会）"
                    : "All months meet target coverage threshold (≥5 exhibitions)"}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {monthGaps.map((g) => (
                  <Link
                    key={g.month}
                    href={`/events?search=${encodeURIComponent(g.month)}`}
                    className="p-2.5 bg-[#F9F7F7] dark:bg-[#133020] border border-[#D8D2C8] dark:border-[#1E4830] rounded-xl flex items-center justify-between shadow-2xs hover:border-[#046241] dark:hover:border-[#52B788] transition group"
                    title={locale === "zh" ? `查看 ${g.month} 展会记录` : `View events for ${g.month}`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-[#133020] dark:text-white group-hover:text-[#046241] dark:group-hover:text-[#52B788] block truncate transition">
                        {localizeMonthYear(g.month, locale)}
                      </span>
                      <span className="text-[10px] text-[#666666] dark:text-white/60 font-medium">
                        {locale === "zh" ? `已录入 ${g.count} 场` : `${g.count} listed`}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-[#046241] text-white text-[10px] font-bold shadow-2xs shrink-0 ml-1.5">
                      +{TARGET_THRESHOLD - g.count}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sub-Card Display for Regions */}
        {activeTab === "regions" && (
          <div>
            {regionGaps.length === 0 ? (
              <div className="py-7 px-4 text-center text-xs text-[#046241] dark:text-[#52B788] font-bold bg-[#046241]/10 dark:bg-[#046241]/20 rounded-xl border border-[#046241]/20 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#046241] dark:text-[#52B788]" />
                <span>
                  {locale === "zh"
                    ? "所有区域均已达到目标覆盖阈值（≥5 场展会）"
                    : "All regions meet target coverage threshold (≥5 exhibitions)"}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {regionGaps.map((g) => (
                  <Link
                    key={g.region}
                    href={`/events?region=${encodeURIComponent(g.region)}`}
                    className="p-3 bg-[#F9F7F7] dark:bg-[#133020] border border-[#D8D2C8] dark:border-[#1E4830] rounded-xl flex items-center justify-between shadow-2xs hover:border-[#046241] dark:hover:border-[#52B788] transition group"
                    title={locale === "zh" ? `查看 ${g.region} 展会记录` : `View events for ${g.region}`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-[#133020] dark:text-white group-hover:text-[#046241] dark:group-hover:text-[#52B788] block truncate transition">
                        {localizeRegionName(g.region, locale)}
                      </span>
                      <span className="text-[10px] text-[#666666] dark:text-white/60 font-medium">
                        {locale === "zh" ? `已录入 ${g.count} 场` : `${g.count} listed`}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-[#046241] text-white text-[10px] font-bold shadow-2xs shrink-0 ml-1.5">
                      +{TARGET_THRESHOLD - g.count}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sub-Card Display for Business Lines */}
        {activeTab === "lines" && (
          <div>
            {lineGaps.length === 0 ? (
              <div className="py-7 px-4 text-center text-xs text-[#046241] dark:text-[#52B788] font-bold bg-[#046241]/10 dark:bg-[#046241]/20 rounded-xl border border-[#046241]/20 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#046241] dark:text-[#52B788]" />
                <span>
                  {locale === "zh"
                    ? "所有业务线均已达到目标覆盖阈值（≥5 场展会）"
                    : "All business lines meet target coverage threshold (≥5 exhibitions)"}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {lineGaps.map((g) => (
                  <Link
                    key={g.line}
                    href={`/events?businessLine=${encodeURIComponent(g.line)}`}
                    className="p-3 bg-[#F9F7F7] dark:bg-[#133020] border border-[#D8D2C8] dark:border-[#1E4830] rounded-xl flex items-center justify-between shadow-2xs hover:border-[#046241] dark:hover:border-[#52B788] transition group"
                    title={locale === "zh" ? `查看 ${g.line} 展会记录` : `View events for ${g.line}`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-[#133020] dark:text-white group-hover:text-[#046241] dark:group-hover:text-[#52B788] block truncate transition">
                        {g.line}
                      </span>
                      <span className="text-[10px] text-[#666666] dark:text-white/60 font-medium">
                        {locale === "zh" ? `已录入 ${g.count} 场` : `${g.count} listed`}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-[#046241] text-white text-[10px] font-bold shadow-2xs shrink-0 ml-1.5">
                      +{TARGET_THRESHOLD - g.count}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-4 pt-3 border-t border-[#D8D2C8] dark:border-[#1E4830] flex items-center justify-between text-[11px] text-[#666666] dark:text-white/60">
        <span className="font-semibold text-[#133020] dark:text-white">
          {locale === "zh" ? "战略采购优先级" : "Strategic Sourcing Priority"}
        </span>
        <span className="font-medium">
          {locale === "zh" ? "目标：每类 ≥ 5 场已核验展会" : "Target: ≥ 5 entries / category"}
        </span>
      </div>
    </div>
  );
}
