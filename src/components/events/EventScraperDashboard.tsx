"use client";

import React, { useState } from "react";
import { Bot, Play, ExternalLink, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { FitScoreBadge } from "./fit-score-badge";
import { PriorityIndicator } from "./priority-indicator";
import { BusinessLineChip } from "./business-line-chip";
import { toast } from "sonner";

export interface EventRecord {
  no: number;
  region?: string;
  country: string;
  city: string;
  event_name: string;
  dates: string;
  venue?: string;
  location_address?: string;
  official_website: string;
  organizer?: string;
  event_category?: string;
  business_lines: string;
  strategic_focus?: string;
  relevance_lifewood?: string;
  target_audience?: string;
  estimated_attendees?: string;
  exhibitor_sponsor_opportunity?: string;
  booth_sponsorship_cost: string;
  registration_deadline?: string;
  contact_email?: string;
  contact_person?: string;
  linkedin_social_media?: string;
  participation_recommendation: string;
  fit_score: number;
  priority_level: string;
  key_notes?: string;
  source_links?: string;
}

export default function EventScraperDashboard() {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [query, setQuery] = useState("tech exhibition 2027 Singapore OR Malaysia OR Philippines");

  const handleCrawl = async () => {
    setLoading(true);
    setStatusText("Running Google Search and Apify Crawlers...");

    try {
      let res: Response;
      try {
        res = await fetch("http://localhost:5000/api/crawl-events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
      } catch {
        res = await fetch("/api/crawl-events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
      }

      setStatusText("Applying Lifewood 27-column audit and Fit Scoring with Gemini...");
      const result = await res.json();

      if (result.success) {
        setEvents(result.data || []);
        toast.success(`Discovered ${result.data?.length || 0} exhibition records`);
      } else {
        toast.error(`Crawler error: ${result.error}`);
      }
    } catch (err: any) {
      toast.error(`Engine unreachable: ${err.message}. Ensure node server.js is running.`);
    } finally {
      setLoading(false);
      setStatusText("");
    }
  };

  return (
    <div className="p-6 font-manrope space-y-5 bg-white">
      {/* Header bar */}
      <div className="flex items-start justify-between flex-wrap gap-4 border-b border-[#D8D2C8] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-[18px] font-semibold text-[#133020]">
              Tech exhibition discovery engine (Batch 11)
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#046241] bg-[#046241]/10 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              <span>Apify + Google Gemini 2.5 Flash</span>
            </span>
          </div>
          <p className="text-[12px] text-[#666666]">
            Crawl boundary: Sep 1, 2026 – Dec 31, 2027 · Automated 27-column audit · Minimum Fit 3+ enforcement
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#666666]">
          <span className="w-2 h-2 rounded-full bg-[#046241] inline-block" />
          <span>Pipeline port: 5000</span>
        </div>
      </div>

      {/* Query Search Bar */}
      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          placeholder="e.g. tech exhibition 2027 Singapore OR Hong Kong OR United States"
          className="flex-1 px-4 py-2.5 rounded-[8px] border border-[#D8D2C8] bg-white text-xs text-[#133020] placeholder-[#999999] focus:outline-none focus:border-[#046241] focus:ring-2 focus:ring-[#046241]/15 transition disabled:opacity-50"
        />
        <button
          onClick={handleCrawl}
          disabled={loading}
          className="px-5 py-2.5 rounded-[8px] bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] font-medium text-xs shadow-xs transition-all duration-180 flex items-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-[#133020]" />
          <span>{loading ? "Processing pipeline..." : "Start discovery & crawl"}</span>
        </button>
      </div>

      {/* Loading Status Alert */}
      {loading && (
        <div className="p-3.5 bg-[#F0F5F2] border border-[#046241]/30 rounded-[8px] flex items-center gap-2.5 text-xs text-[#046241] font-medium animate-pulse">
          <Sparkles className="w-4 h-4 text-[#046241] shrink-0" />
          <span>{statusText}</span>
        </div>
      )}

      {/* Results Table adhering to Section 6.7 with seamless editorial flow */}
      <div className="overflow-x-auto rounded-[8px] border border-[#D8D2C8] bg-white">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#133020] text-white text-[10.5px] uppercase tracking-[0.08em] font-semibold border-b border-[#133020]">
              <th className="py-3 px-3.5 text-center w-12">#</th>
              <th className="py-3 px-3.5 min-w-[200px]">Exhibition event</th>
              <th className="py-3 px-3.5 min-w-[120px]">Dates</th>
              <th className="py-3 px-3.5 min-w-[140px]">Location</th>
              <th className="py-3 px-3.5 min-w-[160px]">Business lines</th>
              <th className="py-3 px-3.5 text-center w-16">Fit</th>
              <th className="py-3 px-3.5 text-center w-24">Priority</th>
              <th className="py-3 px-3.5 min-w-[110px]">Booth cost</th>
              <th className="py-3 px-3.5 text-right w-20">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8D2C8] text-[#133020]">
            {events.length === 0 && !loading ? (
              <tr>
                <td colSpan={9} className="text-center py-12 px-4 text-[#666666]">
                  <div className="max-w-xs mx-auto space-y-1">
                    <p className="font-semibold text-[#133020] text-[13px]">
                      No exhibition records crawled yet
                    </p>
                    <p className="text-[11px] text-[#666666]">
                      Enter a geographic or industrial search query above to trigger automated discovery.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              events.map((e) => {
                let blArray: string[] = [];
                try {
                  blArray = typeof e.business_lines === "string" ? e.business_lines.split(",") : [e.business_lines];
                } catch {
                  blArray = [e.business_lines];
                }

                return (
                  <tr key={e.no} className="hover:bg-[#F0F5F2] transition-colors duration-150">
                    <td className="py-3 px-3.5 text-center font-semibold text-[#666666]">
                      {e.no}
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="font-semibold text-[#133020] block leading-snug">
                        {e.event_name}
                      </span>
                      {e.organizer && (
                        <span className="text-[11px] text-[#666666] block truncate mt-0.5">
                          {e.organizer}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap font-medium text-[#133020]">
                      {e.dates}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="font-medium text-[#133020]">
                        {e.city}, {e.country}
                      </span>
                      {e.region && (
                        <span className="text-[11px] text-[#666666] block">
                          {e.region}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-1 flex-wrap">
                        {blArray.map((bl) => (
                          <BusinessLineChip key={bl.trim()} name={bl.trim()} />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex justify-center">
                        <FitScoreBadge score={e.fit_score} />
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex justify-center">
                        <PriorityIndicator priority={e.priority_level} />
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-[11px] font-medium text-[#666666]">
                      {e.booth_sponsorship_cost || "Not disclosed"}
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      {e.official_website && (
                        <a
                          href={e.official_website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#046241] hover:text-[#133020] transition"
                        >
                          <span>Visit</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
