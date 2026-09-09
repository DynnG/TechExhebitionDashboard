import { Skeleton } from "@/components/shared/skeleton";
import { Bot, Sparkles } from "lucide-react";

export default function ScraperLoading() {
  return (
    <div className="space-y-8 font-manrope">
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D8D2C8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#046241]/50" />
            <h2 className="text-2xl font-bold text-[#133020]">AI Event Scraper Engine</h2>
          </div>
          <p className="text-xs text-[#666666] mt-0.5">
            Automated crawler parsing official organizer sites, convention centers & AI conference calendars
          </p>
        </div>

        {/* Action Button Skeleton */}
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D8D2C8] pb-2">
        <div className="px-4 py-2 rounded-lg bg-[#046241]/10 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#046241]" />
          <span className="text-xs font-bold text-[#046241]">Apify + Google Gemini Engine (Batch 11 Spec)</span>
        </div>
        <Skeleton className="h-8 w-48 rounded-lg" />
      </div>

      {/* Main Scraper Card Container Skeleton */}
      <div className="bg-white rounded-xl border border-[#D8D2C8] shadow-xs p-6 space-y-5">
        {/* Sub-header */}
        <div className="flex items-start justify-between flex-wrap gap-4 border-b border-[#D8D2C8] pb-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-64 rounded" />
            <Skeleton className="h-3.5 w-96 rounded" />
          </div>
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>

        {/* Search & Crawl Input Bar */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <Skeleton className="h-10 flex-1 rounded-[8px]" />
          <Skeleton className="h-10 w-44 rounded-[8px]" />
        </div>

        {/* Table / Results Skeleton */}
        <div className="border border-[#D8D2C8] rounded-[10px] overflow-hidden">
          {/* Table Header */}
          <div className="bg-[#F5EEDB] px-4 py-3 flex items-center gap-4">
            <Skeleton className="h-4 w-8 rounded" />
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#D8D2C8]/60 bg-white">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-4 py-3.5 flex items-center gap-4">
                <Skeleton className="h-4 w-8 rounded" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-52 rounded" />
                  <Skeleton className="h-3 w-72 rounded" />
                </div>
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-6 w-10 rounded-md" />
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
