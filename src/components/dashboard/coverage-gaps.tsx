"use client";

import Link from "next/link";
import { AlertCircle, Plus, Sparkles } from "lucide-react";
import { useLocaleStore } from "@/stores/locale-store";
import { localizeMonthYear } from "@/lib/i18n/event-localization";

interface CoverageGapsProps {
  gaps: { month: string; count: number }[];
}

export function CoverageGapsWidget({ gaps }: CoverageGapsProps) {
  const { locale } = useLocaleStore();

  return (
    <div className="bg-white p-5 rounded-[12px] border-[1.5px] border-[#D8D2C8] shadow-[0_2px_16px_rgba(0,0,0,0.05)] flex flex-col justify-between font-manrope">
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-[#D8D2C8] dark:border-[#1E4830] pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#C17110] shrink-0" />
            <div>
              <h3 className="text-[14px] font-semibold text-[#133020]">
                {locale === "zh" ? "覆盖缺口评估" : "Coverage gap assessment"}
              </h3>
              <p className="text-[11px] text-emerald-800/70 dark:text-slate-400">
                {locale === "zh"
                  ? "高匹配展会少于 5 场的月份，需补充采集"
                  : "Months with < 5 high-fit exhibition entries requiring sourcing"}
              </p>
            </div>
          </div>

          <Link
            href="/scraper"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] text-xs font-medium rounded-[8px] transition-all duration-180 shadow-2xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{locale === "zh" ? "运行采集器" : "Run scraper"}</span>
          </Link>
        </div>

        {gaps.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#046241] font-medium bg-[#046241]/10 rounded-[8px] border border-[#046241]/20">
            {locale === "zh"
              ? "✓ 所有月份均已达到目标覆盖阈值（≥5 场展会）"
              : "✓ All months meet target coverage threshold (≥5 exhibitions)"}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {gaps.map((g) => (
              <div
                key={g.month}
                className="p-3 bg-[#F5EEDB] border border-[#FFB347]/50 rounded-[8px] flex items-center justify-between shadow-2xs hover:border-[#FFB347] transition"
              >
                <div>
                  <span className="text-xs font-semibold text-[#133020] block">
                    {localizeMonthYear(g.month, locale)}
                  </span>
                  <span className="text-[10px] text-emerald-800/70 dark:text-slate-400 font-medium">
                    {locale === "zh" ? `已录入 ${g.count} 场` : `${g.count} listed`}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-[6px] bg-[#C17110] text-white text-[10px] font-semibold shadow-2xs">
                  {locale === "zh" ? `需补充 +${5 - g.count} 场` : `+${5 - g.count} needed`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#D8D2C8] flex items-center justify-between text-[11px] text-[#666666]">
        <span className="flex items-center gap-1 text-[#046241] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{locale === "zh" ? "自动抓取流水线就绪" : "Automated scraper pipeline active"}</span>
        </span>
        <span className="font-medium">
          {locale === "zh" ? "目标：每月 ≥ 5 场展会" : "Target: ≥ 5 exhibitions / month"}
        </span>
      </div>
    </div>
  );
}
