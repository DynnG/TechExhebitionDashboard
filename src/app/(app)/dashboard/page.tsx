"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/shared/skeleton";
import { StatCard } from "@/components/dashboard/stat-card";
import { EventsByMonthChart } from "@/components/dashboard/events-by-month";
import { EventsByRegionChart } from "@/components/dashboard/events-by-region";
import { BusinessLineChart } from "@/components/dashboard/business-line-chart";
import { CoverageGapsWidget } from "@/components/dashboard/coverage-gaps";
import { FitScoreBadge } from "@/components/events/fit-score-badge";
import { PriorityIndicator } from "@/components/events/priority-indicator";
import {
  CalendarDays,
  Globe,
  Award,
  CalendarCheck,
  Bot,
  Plus,
  Loader2,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { useLocaleStore } from "@/stores/locale-store";

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
      } catch (err) {
        toast.error("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 font-manrope">
        <div className="flex items-center justify-between pb-4 border-b border-[#D8D2C8]">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-72 w-full rounded-xl" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const { stats, eventsByMonth, eventsByRegion, businessLineDist, gaps, recentEvents } = data;

  return (
    <div className="space-y-8 font-manrope">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D8D2C8] pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#133020]">
            {locale === "en" ? "Lifewood Intelligence Overview" : "Lifewood 展会情报总览"}
          </h2>
          <p className="text-xs text-[#666666] mt-0.5">
            {locale === "en"
              ? "Real-time exhibition pipeline tracking, strategic alignment, and coverage gap intelligence"
              : "实时展会追踪、战略适配评估与覆盖空缺分析"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/scraper"
            className="flex items-center gap-1.5 px-3.5 py-2 border border-[#133020] bg-white text-[#133020] hover:bg-[#F5EEDB] text-xs font-semibold rounded-lg transition"
          >
            <Bot className="w-4 h-4 text-[#046241]" />
            <span>{locale === "en" ? "AI Scraper" : "AI 抓取"}</span>
          </Link>
          <Link
            href="/events/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] font-bold text-xs rounded-lg transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === "en" ? "Add Event" : "添加展会"}</span>
          </Link>
        </div>
      </div>

      {/* Row 1 — Stat Summary Cards (4 across) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Exhibitions"
          value={stats.totalEvents}
          subtitle="Fit 3+ Verified Records"
          icon={CalendarDays}
        />
        <StatCard
          title="2027 Pipeline"
          value={stats.events2027}
          subtitle="Forward-looking Target"
          icon={CalendarCheck}
        />
        <StatCard
          title="Avg Fit Score"
          value={`${stats.avgFitScore} / 5.0`}
          subtitle="High Relevance Alignment"
          icon={Award}
        />
        <StatCard
          title="Global Coverage"
          value={`${stats.uniqueRegions} Regions`}
          subtitle="APAC, NA, EU & ME"
          icon={Globe}
        />
      </div>

      {/* Row 2 — Charts (Events by Month & Events by Region) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EventsByMonthChart data={eventsByMonth} />
        </div>
        <div>
          <EventsByRegionChart data={eventsByRegion} />
        </div>
      </div>

      {/* Row 3 — Business Line Distribution & Coverage Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BusinessLineChart data={businessLineDist} />
        <CoverageGapsWidget gaps={gaps} />
      </div>

      {/* Row 4 — Recently Added Events Table */}
      <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-xs">
        <div className="flex items-center justify-between border-b border-[#D8D2C8] pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#133020]">
              {locale === "en" ? "Recently Added Exhibition Records" : "最新录入展会记录"}
            </h3>
            <p className="text-xs text-[#666666]">
              Latest verified exhibition entries in database
            </p>
          </div>

          <Link
            href="/events"
            className="text-xs font-bold text-[#046241] hover:text-[#133020] flex items-center gap-1 transition"
          >
            <span>{locale === "en" ? "View All Events" : "查看全部展会"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="divide-y divide-[#D8D2C8]/60">
          {recentEvents.map((evt: any) => (
            <div
              key={evt.id}
              className="py-3 flex items-center justify-between gap-4 hover:bg-[#F0F5F2] px-2 rounded-lg transition"
            >
              <div className="min-w-0">
                <Link
                  href={`/events/${evt.id}`}
                  className="font-bold text-xs text-[#133020] hover:text-[#046241] truncate block"
                >
                  #{evt.eventNumber} — {evt.eventName}
                </Link>
                <span className="text-[11px] text-[#666666] block truncate">
                  {evt.city}, {evt.country} • {evt.dates}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <PriorityIndicator priority={evt.priorityLevel} />
                <FitScoreBadge score={evt.fitScore} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
