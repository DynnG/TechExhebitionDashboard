"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/shared/skeleton";
import { StatCard } from "@/components/dashboard/stat-card";
import { EventsByMonthChart } from "@/components/dashboard/events-by-month";
import { EventsByRegionChart } from "@/components/dashboard/events-by-region";
import { BusinessLineChart } from "@/components/dashboard/business-line-chart";
import { FitScoreChart } from "@/components/dashboard/fit-score-chart";
import { CoverageGapsWidget } from "@/components/dashboard/coverage-gaps";
import { ScraperStatusWidget } from "@/components/dashboard/scraper-status-widget";
import { FitScoreBadge } from "@/components/events/fit-score-badge";
import { PriorityIndicator } from "@/components/events/priority-indicator";
import { BUSINESS_LINES } from "@/lib/constants/business-lines";
import {
  CalendarDays,
  Globe,
  Award,
  CalendarCheck,
  Bot,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useLocaleStore } from "@/stores/locale-store";
import { localizeEvent } from "@/lib/i18n/event-localization";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { locale } = useLocaleStore();

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          toast.error("Failed to load dashboard statistics");
        }
      } catch {
        toast.error("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen -m-8 p-8 space-y-8 font-manrope bg-[#F5EEDB] dark:bg-[#0B1712] text-[#133020] dark:text-white transition-colors duration-300">
        <div className="flex items-center justify-between pb-4 border-b border-[#D8D2C8] dark:border-[#1E4830]">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-28" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Skeleton className="h-32 w-full rounded-[12px]" />
          <Skeleton className="h-32 w-full rounded-[12px]" />
          <Skeleton className="h-32 w-full rounded-[12px]" />
          <Skeleton className="h-32 w-full rounded-[12px]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-8 h-72 w-full rounded-[12px]" />
          <Skeleton className="lg:col-span-4 h-72 w-full rounded-[12px]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-7 h-64 w-full rounded-[12px]" />
          <Skeleton className="lg:col-span-5 h-64 w-full rounded-[12px]" />
        </div>
      </div>
    );
  }

  const { stats, eventsByMonth, eventsByRegion, businessLineDist, fitScoreDist, gaps, recentEvents } = data;

  return (
    <div className="min-h-screen -m-8 p-8 space-y-8 font-manrope bg-[#F5EEDB] dark:bg-[#133020] text-[#133020] dark:text-white transition-colors duration-300">
      {/* Top Bar / Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D8D2C8] pb-4">
        <div>
            <h2 className="text-2xl font-bold text-[#133020] dark:text-white">
            {locale === "en" ? "Lifewood intelligence overview" : "Lifewood 展会情报总览"}
            </h2>
            <p className="text-xs text-black dark:text-white/60 mt-0.5">
            {locale === "en"
                ? "Real-time exhibition pipeline tracking, strategic alignment, and coverage gap intelligence"
                : "实时展会追踪、战略适配评估与覆盖空缺分析"}
            </p>
        </div>
        </div>

      {/* Row 1 — Stat Cards (4 across) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title={locale === "en" ? "Total exhibitions" : "已录入展会总数"}
          value={stats.totalEvents}
          subtitle={locale === "en" ? "Fit 3+ verified records" : "适配度 3+ 已审核记录"}
          icon={CalendarDays}
        />
        <StatCard
          title={locale === "en" ? "Monthly Pipeline Target" : "2027 战略展会储备"}
          value={stats.events2027}
          subtitle={locale === "en" ? "2027 target" : "前瞻储备展会指标"}
          icon={CalendarCheck}
        />
        <StatCard
          title={locale === "en" ? "Average fit score" : "平均战略适配度"}
          value={`${stats.avgFitScore} / 5.0`}
          subtitle={locale === "en" ? "High relevance alignment" : "业务线高度对齐"}
          icon={Award}
        />
        <StatCard
          title={locale === "en" ? "Global regions covered" : "覆盖全球大区"}
          value={locale === "zh" ? `${stats.uniqueRegions} 个大区` : `${stats.uniqueRegions} regions`}
          subtitle={locale === "en" ? "APAC, NA, Europe & ME" : "亚太、北美、欧洲及中东"}
          icon={Globe}
        />
      </div>

            {/* Row 2 — Charts (Events by Month & Events by Region) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <EventsByMonthChart data={eventsByMonth} />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <EventsByRegionChart data={eventsByRegion} />
        </div>
      </div>

      {/* Row 3 — Charts (Business Line Distribution & Fit Score Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <BusinessLineChart data={businessLineDist} />
        </div>
        <div className="lg:col-span-5">
          <FitScoreChart data={fitScoreDist} />
        </div>
      </div>

      {/* Row 4 — Gaps & Alerts (Coverage Gaps + Recently Added Events) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 flex flex-col">
          <CoverageGapsWidget
            gaps={gaps}
            eventsByRegion={eventsByRegion}
            businessLineDist={businessLineDist}
          />
        </div>

        <div className="lg:col-span-7 bg-white dark:bg-[#1A3828] p-5 rounded-[12px] border-[1.5px] border-[#D8D2C8] dark:border-[#1E4830] shadow-[0_2px_16px_rgba(0,0,0,0.05)] flex flex-col justify-between font-manrope transition-colors">
          <div>
            {/* 1. Card Header */}
            <div className="flex items-center justify-between border-b border-[#D8D2C8] dark:border-[#1E4830] pb-3 mb-4">
              <div>
                <h3 className="text-[15px] font-bold text-[#133020] dark:text-white">
                  {locale === "en" ? "Recently added exhibitions" : "最新录入展会记录"}
                </h3>
                <p className="text-[11px] text-[#666666] dark:text-white/60 mt-0.5">
                  {locale === "zh"
                    ? "情报数据库中最新审核的展会"
                    : "Latest verified entries in intelligence database"}
                </p>
              </div>

              {/* Top-right action link */}
              <Link
                href="/events"
                className="text-xs font-semibold text-[#046241] dark:text-[#52B788] hover:text-[#133020] dark:hover:text-white flex items-center gap-1 transition group"
              >
                <span>{locale === "en" ? "View all events →" : "查看全部展会 →"}</span>
              </Link>
            </div>

            {/* 2. Event List Rows (Latest 4 verified events) */}
            <div className="divide-y divide-[#D8D2C8] dark:divide-[#1E4830]">
              {(recentEvents || []).slice(0, 4).map((rawEvt: any) => {
                const evt = localizeEvent(rawEvt, locale);
                let businessLines: string[] = [];
                try {
                  businessLines = JSON.parse(evt.businessLines || "[]");
                } catch {
                  businessLines = Array.isArray(evt.businessLines)
                    ? evt.businessLines
                    : [evt.businessLines];
                }

                const primaryBL = businessLines[0] || "Global AI Data";
                const blConfig = BUSINESS_LINES.find(
                  (b) => b.name.toLowerCase() === primaryBL.toLowerCase()
                );
                const accentColor = blConfig ? blConfig.colorHex : "#046241";

                const priorityLabel = evt.priorityLevel || "High";
                const fitFormatted =
                  typeof evt.fitScore === "number"
                    ? `${evt.fitScore.toFixed(1)} / 5.0`
                    : "4.5 / 5.0";

                return (
                  <Link
                    key={evt.id}
                    href={`/events/${evt.id}`}
                    className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-[#F0F5F2] dark:hover:bg-[#133020]/60 rounded-xl transition group relative"
                  >
                    {/* 4px rounded vertical accent bar colored by primary business line */}
                    <div
                      className="w-1 self-stretch rounded-full shrink-0"
                      style={{ backgroundColor: accentColor }}
                    />

                    <div className="min-w-0 flex-1">
                      {/* Event metadata: #EventNumber · Region · Dates */}
                      <div className="flex items-center gap-1.5 text-[11px] text-[#666666] dark:text-white/60 mb-0.5">
                        <span className="font-bold text-[#133020] dark:text-white">
                          #{evt.eventNumber}
                        </span>
                        <span>·</span>
                        <span>{evt.region}</span>
                        <span>·</span>
                        <span className="truncate">{evt.dates}</span>
                      </div>

                      {/* Event Title: Single-line truncated bold with emerald hover */}
                      <h4 className="font-bold text-[13px] text-[#133020] dark:text-white group-hover:text-[#046241] dark:group-hover:text-[#52B788] transition truncate">
                        {evt.eventName}
                      </h4>

                      {/* Event City & Country */}
                      <p className="text-[11px] text-[#666666] dark:text-white/60 truncate mt-0.5">
                        {evt.city}, {evt.country}
                      </p>
                    </div>

                    {/* Right: Priority Level Badge & Fit Score Pill */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          priorityLabel.toLowerCase() === "critical"
                            ? "bg-[#B91C1C]/15 text-[#B91C1C] border border-[#B91C1C]/30"
                            : priorityLabel.toLowerCase() === "high"
                            ? "bg-[#FFB347]/20 text-[#C17110] dark:text-[#FFB347] border border-[#FFB347]/40"
                            : priorityLabel.toLowerCase() === "medium"
                            ? "bg-[#046241]/15 text-[#046241] dark:text-[#52B788] border border-[#046241]/30"
                            : "bg-[#708E7C]/15 text-[#708E7C] border border-[#708E7C]/30"
                        }`}
                      >
                        {priorityLabel}
                      </span>

                      <span className="px-2.5 py-1 rounded-lg bg-[#046241]/10 dark:bg-[#046241]/25 border border-[#046241]/20 text-[#046241] dark:text-[#52B788] text-xs font-bold font-mono">
                        {fitFormatted}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 3. Card Footer */}
          <div className="pt-3 border-t border-[#D8D2C8] dark:border-[#1E4830] flex items-center justify-between text-[11px] text-[#666666] dark:text-white/60 mt-3 flex-wrap gap-2">
            <span>
              {locale === "zh"
                ? "所有展会均已根据 Lifewood 买家画像完成战略评估"
                : "All entries reviewed for Lifewood buyer alignment"}
            </span>
            <span className="font-semibold text-[#046241] dark:text-[#52B788]">
              {locale === "zh" ? "✓ 27 项审计已核验" : "27-Column Audit Verified"}
            </span>
          </div>
        </div>
      </div>

      {/* Row 5 — Scraper Engine Status (Section 7.1) */}
      <ScraperStatusWidget />
    </div>
  );
}
