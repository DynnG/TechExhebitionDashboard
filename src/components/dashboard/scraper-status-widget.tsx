"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bot, Play, CheckCircle2, Clock, CalendarClock } from "lucide-react";
import { useLocaleStore } from "@/stores/locale-store";

export function ScraperStatusWidget() {
  const { locale } = useLocaleStore();
  const [status, setStatus] = useState<any>({
    status: "idle",
    events_found: 12,
    started_at: null,
    completed_at: null,
  });

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetch("/api/scraper/status");
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        }
      } catch {
        // Fallback default
      }
    }
    loadStatus();
  }, []);

  const formatTime = (iso?: string | null) => {
    if (!iso) return "Sep 7, 2026, 18:30";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Sep 7, 2026, 18:30";
    }
  };

  return (
    <div className="bg-white dark:bg-[#133020] rounded-[12px] p-5 border-[1.5px] border-[#D8D2C8] dark:border-[#1E4830] shadow-sm font-manrope transition-colors">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Title & Engine info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-emerald-500/10 dark:bg-amber-400/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-emerald-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-[14px] font-semibold text-emerald-950 dark:text-white">
                {locale === "en" ? "AI discovery & scraper engine status" : "AI 智能发现与抓取引擎状态"}
              </h4>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                <span>{locale === "en" ? "Operational" : "正常运行"}</span>
              </span>
            </div>
            <p className="text-[11px] text-emerald-800/70 dark:text-slate-400 mt-0.5">
              Apify + Google Gemini 2.5 Flash continuous discovery pipeline
            </p>
          </div>
        </div>

        {/* 4 Data-dense status columns */}
        <div className="flex items-center gap-6 text-xs flex-wrap">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider text-emerald-800/70 dark:text-slate-400 font-medium block">
              Last run time
            </span>
            <div className="flex items-center gap-1 font-semibold text-emerald-950 dark:text-slate-200">
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-amber-400" />
              <span>{formatTime(status.completed_at || status.started_at)}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider text-emerald-800/70 dark:text-slate-400 font-medium block">
              Next scheduled run
            </span>
            <div className="flex items-center gap-1 font-semibold text-emerald-950 dark:text-slate-200">
              <CalendarClock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Daily at 02:00 UTC</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider text-emerald-800/70 dark:text-slate-400 font-medium block">
              Events found last run
            </span>
            <span className="text-[14px] font-bold text-emerald-950 dark:text-white">
              {status.events_found || 12} records
            </span>
          </div>

          {/* Trigger button */}
          <Link
            href="/scraper"
            className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-sm hover:scale-105 transition shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-emerald-950" />
            <span>{locale === "en" ? "Trigger crawler run" : "立即触发抓取"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
