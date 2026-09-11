"use client";

import { Bot } from "lucide-react";
import { useLocaleStore } from "@/stores/locale-store";
import EventScraperDashboard from "@/components/events/EventScraperDashboard";

export default function ScraperPage() {
  const { locale } = useLocaleStore();

  return (
    <div className="min-h-screen -m-8 p-8 space-y-6 font-manrope bg-[#F5EEDB] dark:bg-[#133020] text-[#133020] dark:text-white transition-colors duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D8D2C8] dark:border-[#1E4830] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#046241]/10 dark:bg-[#046241]/25 border border-[#046241]/20 flex items-center justify-center text-[#046241] dark:text-[#52B788]">
            <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-[#133020] dark:text-white">
            {locale === "en" ? "AI Event Scraper Engine" : "AI 智能抓取引擎"}
            </h2>
          </div>
          <p className="text-xs text-[#666666] dark:text-white/60 mt-0.5">
            {locale === "zh"
              ? "自动抓取解析官方主办方站点、会展中心与行业 AI 展会日程"
              : "Automated crawler parsing official organizer sites, convention centers & AI conference calendars"}
          </p>
        </div>
      </div>

      {/* Tech Exhibition Discovery Engine Container */}
      <div className="bg-white dark:bg-[#1A3828] rounded-xl border border-[#D8D2C8] dark:border-[#1E4830] shadow-xs overflow-hidden transition-colors">
        <EventScraperDashboard />
      </div>
    </div>
  );
}
