"use client";

import { useState, useEffect } from "react";
import { REGIONS, BUSINESS_LINES } from "@/lib/constants/business-lines";
import { Bot, Play, Check, X, RefreshCw, Sparkles, Sliders, Calendar, ShieldCheck, Edit, Search } from "lucide-react";
import { toast } from "sonner";
import { useLocaleStore } from "@/stores/locale-store";
import EventScraperDashboard from "@/components/events/EventScraperDashboard";
import { LifewoodDropdown } from "@/components/shared/lifewood-dropdown";
import { localizeEvent } from "@/lib/i18n/event-localization";

export default function ScraperPage() {
  const [engineMode, setEngineMode] = useState<"apify_gemini" | "standard">("apify_gemini");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { locale } = useLocaleStore();

  const frequencyOptions = [
    { value: "Daily", label: "Daily Execution" },
    { value: "Weekly", label: "Weekly (Recommended)" },
    { value: "Monthly", label: "Monthly" },
  ];

  const dayOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Friday", label: "Friday" },
  ];

  const [config, setConfig] = useState({
    startDate: "2026-09-01",
    endDate: "2027-12-31",
    regions: ["Asia", "North America", "Europe"],
    businessLines: ["Global AI Data", "AIGC", "Autonomous Driving", "AEO/GEO", "EDGE Intelligence"],
    tier1: true,
    tier2: true,
    tier3: true,
  });

  const [schedule, setSchedule] = useState({
    enabled: true,
    frequency: "Weekly",
    day: "Monday",
    time: "06:00 AM",
  });

  useEffect(() => {
    if (engineMode === "standard" && results.length === 0) {
      fetchResults();
    }
  }, [engineMode]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/scraper/results");
      const data = await res.json();
      if (res.ok) {
        setResults(data.results || []);
      }
    } catch {
      toast.error(locale === "zh" ? "加载采集抽取结果失败" : "Failed to load scraper results");
    } finally {
      setLoading(false);
    }
  };

  const handleRunScraper = async () => {
    setRunning(true);
    toast.info(locale === "zh" ? "采集任务已触发..." : "Scraper execution initiated...");

    try {
      const res = await fetch("/api/scraper/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        toast.success(locale === "zh" ? "采集任务执行成功！" : "Scraper job finished successfully!");
        fetchResults();
      } else {
        toast.error(locale === "zh" ? "采集器执行失败" : "Scraper execution failed");
      }
    } catch {
      toast.error(locale === "zh" ? "触发采集任务异常" : "Error triggering scraper");
    } finally {
      setRunning(false);
    }
  };

  const handleAccept = async (item: any) => {
    try {
      const res = await fetch("/api/scraper/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (res.ok) {
        toast.success(
          locale === "zh"
            ? `“${item.eventName}”已提交至审核队列等待主管审批！`
            : `"${item.eventName}" transferred to Review Queue for supervisor approval!`
        );
        setResults((prev) => prev.filter((r) => r.id !== item.id));
      } else {
        const data = await res.json();
        toast.error(data.error || (locale === "zh" ? "采纳记录失败" : "Failed to accept event"));
      }
    } catch {
      toast.error(locale === "zh" ? "采纳展会异常" : "Error accepting event");
    }
  };

  const handleReject = (id: string, name: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id));
    toast.info(locale === "zh" ? `已驳回“${name}”` : `Rejected "${name}"`);
  };

  return (
    <div className="min-h-screen -m-8 p-8 space-y-8 font-manrope bg-[#F5EEDB] dark:bg-[#133020] text-[#133020] dark:text-white transition-colors duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D8D2C8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#046241]" />
            <h2 className="text-2xl font-bold text-[#FFB347]">
              {locale === "en" ? "AI Event Scraper Engine" : "AI 智能抓取引擎"}
            </h2>
          </div>
          <p className="text-xs text-black dark:text-white/60 mt-0.5">
            {locale === "zh"
              ? "自动抓取解析官方主办方站点、会展中心与行业 AI 展会日程"
              : "Automated crawler parsing official organizer sites, convention centers & AI conference calendars"}
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D8D2C8] pb-2">
        <button
          onClick={() => setEngineMode("apify_gemini")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            engineMode === "apify_gemini"
              ? "bg-[#046241] text-white shadow-xs"
              : "bg-white text-[#133020] border border-[#D8D2C8] hover:bg-[#F5EEDB]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{locale === "zh" ? "Apify + Google Gemini 智能抓取引擎" : "Apify + Google Gemini Engine (Batch 11 Spec)"}</span>
        </button>
        <button
          onClick={() => setEngineMode("standard")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            engineMode === "standard"
              ? "bg-[#046241] text-white shadow-xs"
              : "bg-white text-[#133020] border border-[#D8D2C8] hover:bg-[#F5EEDB]"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{locale === "zh" ? "内置采集器与定时调度" : "Internal Crawler & Scheduler"}</span>
        </button>
      </div>

      {engineMode === "apify_gemini" ? (
        <div className="bg-white rounded-xl border border-[#D8D2C8] shadow-xs overflow-hidden">
          <EventScraperDashboard />
        </div>
      ) : (
        <>
          {/* Grid: Config Panel & Schedule Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Config Panel */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#D8D2C8] pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#046241]" />
                  <h3 className="text-sm font-bold text-[#133020]">
                    {locale === "zh" ? "采集搜索配置" : "Scraper Search Configuration"}
                  </h3>
                </div>
                <span className="text-[11px] text-[#046241] font-semibold bg-[#046241]/10 px-2.5 py-0.5 rounded-full">
                  {locale === "zh"
                    ? running ? "状态：正在采集" : "状态：就绪空闲"
                    : `Status: ${running ? "Crawling" : "Idle"}`}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
                    {locale === "zh" ? "目标起始日期" : "Target Start Date"}
                  </label>
                  <input
                    type="date"
                    value={config.startDate}
                    onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] text-xs text-[#133020] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
                    {locale === "zh" ? "目标截止日期" : "Target End Date"}
                  </label>
                  <input
                    type="date"
                    value={config.endDate}
                    onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] text-xs text-[#133020] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-2">
                  {locale === "zh" ? "包含的数据来源层级" : "Included Source Tiers"}
                </label>
                <div className="flex items-center gap-4 text-xs font-medium text-[#133020]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.tier1}
                      onChange={(e) => setConfig({ ...config, tier1: e.target.checked })}
                      className="rounded text-[#046241]"
                    />
                    <span>{locale === "zh" ? "第 1 层 (官方主办方)" : "Tier 1 (Official Organizers)"}</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.tier2}
                      onChange={(e) => setConfig({ ...config, tier2: e.target.checked })}
                      className="rounded text-[#046241]"
                    />
                    <span>{locale === "zh" ? "第 2 层 (会展中心)" : "Tier 2 (Convention Centers)"}</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.tier3}
                      onChange={(e) => setConfig({ ...config, tier3: e.target.checked })}
                      className="rounded text-[#046241]"
                    />
                    <span>{locale === "zh" ? "第 3 层 (精选 AI 展会日程)" : "Tier 3 (Curated AI Calendars)"}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Schedule Panel */}
            <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#D8D2C8] pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#046241]" />
                  <h3 className="text-sm font-bold text-[#133020]">
                    {locale === "zh" ? "自动化执行计划" : "Automated Schedule"}
                  </h3>
                </div>
                <input
                  type="checkbox"
                  checked={schedule.enabled}
                  onChange={(e) => setSchedule({ ...schedule, enabled: e.target.checked })}
                  className="w-4 h-4 text-[#046241] rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
                  {locale === "zh" ? "执行频率" : "Frequency"}
                </label>
                <LifewoodDropdown
                  value={schedule.frequency}
                  onChange={(val) => setSchedule({ ...schedule, frequency: val })}
                  options={
                    locale === "zh"
                      ? [
                          { value: "Daily", label: "每日执行" },
                          { value: "Weekly", label: "每周执行 (推荐)" },
                          { value: "Monthly", label: "每月执行" },
                        ]
                      : frequencyOptions
                  }
                  aria-label="Frequency"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
                  {locale === "zh" ? "执行星期与时间" : "Execution Day & Time"}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <LifewoodDropdown
                    value={schedule.day}
                    onChange={(val) => setSchedule({ ...schedule, day: val })}
                    options={
                      locale === "zh"
                        ? [
                            { value: "Monday", label: "周一" },
                            { value: "Wednesday", label: "周三" },
                            { value: "Friday", label: "周五" },
                          ]
                        : dayOptions
                    }
                    aria-label="Execution Day"
                  />
                  <input
                    type="text"
                    value={schedule.time}
                    onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-[#133020]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#F5EEDB] rounded-lg text-[11px] text-[#133020]">
                <span className="font-bold">{locale === "zh" ? "下次自动执行时间：" : "Next Automated Execution:"}</span>
                <p className="text-[#046241] font-semibold mt-0.5">
                  {locale === "zh"
                    ? "2026年9月14日 (周一) 06:00 (北京/亚太标准时间)"
                    : "Mon, Sep 14, 2026 at 06:00 AM (APAC Standard)"}
                </p>
              </div>
            </div>
          </div>

          {/* Scraped Results Review Table */}
          <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8D2C8] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#133020]">
                  {locale === "zh" ? `采集抽取结果 (${results.length})` : `Scraper Extracted Results (${results.length})`}
                </h3>
                <p className="text-xs text-[#666666]">
                  {locale === "zh"
                    ? "在采纳入主展会库前审核 AI 分类的展会记录"
                    : "Review AI-classified events before accepting into main database"}
                </p>
              </div>
              <button
                onClick={fetchResults}
                className="flex items-center gap-1 text-xs text-[#046241] font-semibold hover:underline cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{locale === "zh" ? "刷新结果" : "Refresh Results"}</span>
              </button>
            </div>

            {results.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#666666]">
                {locale === "zh"
                  ? "暂无待审核的抓取记录。点击上方“立即运行采集器”开始扫描目标源。"
                  : "No pending scraped records awaiting review. Click \"Run Scraper Now\" above to crawl target sources."}
              </div>
            ) : (
              <div className="divide-y divide-[#D8D2C8]/60">
                {results.map((rawItem) => {
                  const item = localizeEvent(rawItem, locale);
                  return (
                    <div
                      key={item.id}
                      className="py-4 flex items-start justify-between gap-4 hover:bg-[#F9F7F7] p-3 rounded-xl transition"
                    >
                      <div className="space-y-1 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-[#046241]/10 text-[#046241] font-bold text-[10px] rounded uppercase">
                            {locale === "zh"
                              ? `AI 置信度: ${Math.round((item.confidence || 0.9) * 100)}%`
                              : `AI Confidence: ${Math.round((item.confidence || 0.9) * 100)}%`}
                          </span>
                          <span className="text-xs font-semibold text-[#133020]">
                            {item.city}, {item.country} ({item.region})
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-[#133020]">
                          {item.eventName}
                        </h4>

                        <p className="text-xs text-[#666666] line-clamp-2">
                          {item.strategicFocus}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[11px] text-[#666666]">
                            {locale === "zh" ? "展期：" : "Dates: "}<strong className="text-[#133020]">{item.dates}</strong>
                          </span>
                          <span className="text-[11px] text-[#666666]">
                            {locale === "zh" ? "展馆：" : "Venue: "}<strong className="text-[#133020]">{item.venue}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleAccept(rawItem)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#046241] hover:bg-[#133020] text-white text-xs font-semibold rounded-lg transition shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{locale === "zh" ? "采纳入库" : "Accept into DB"}</span>
                        </button>

                        <button
                          onClick={() => handleReject(rawItem.id, rawItem.eventName)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#B91C1C]/10 text-[#B91C1C] hover:bg-[#B91C1C]/20 text-xs font-semibold rounded-lg transition cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{locale === "zh" ? "驳回" : "Reject"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
