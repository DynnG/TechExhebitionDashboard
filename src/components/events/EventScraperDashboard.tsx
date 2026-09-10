"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Play,
  Square,
  ExternalLink,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  Globe,
  Loader2,
  PlusCircle,
  Layers,
  ArrowRight,
  Trash2,
  Filter,
  X,
} from "lucide-react";
import { FitScoreBadge } from "./fit-score-badge";
import { PriorityIndicator } from "./priority-indicator";
import { BusinessLineChip } from "./business-line-chip";
import { toast } from "sonner";
import { sanitizeEventUrl } from "@/lib/url";

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
  is_duplicate?: boolean;
  duplicate_reason?: string;
  duplicate_of?: string;
}

export default function EventScraperDashboard() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [statusText, setStatusText] = useState("");
  const [candidateUrls, setCandidateUrls] = useState<string[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [query, setQuery] = useState("tech exhibition 2027 Singapore OR Malaysia OR Philippines");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [acceptedEvents, setAcceptedEvents] = useState<Record<string, boolean>>({});
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "unique" | "duplicates">("all");

  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const uniqueCount = events.filter((e) => !e.is_duplicate).length;
  const duplicateCount = events.filter((e) => e.is_duplicate).length;

  const displayedEvents = events.filter((e) => {
    if (filterMode === "unique") return !e.is_duplicate;
    if (filterMode === "duplicates") return e.is_duplicate;
    return true;
  });

  // Load previously cached events on initial mount
  useEffect(() => {
    async function loadCache() {
      try {
        const res = await fetch("http://localhost:5000/api/crawl-events/cache");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.length > 0) {
            setEvents(json.data);
          }
        }
      } catch {
        // Silent catch if engine is not running yet
      }
    }
    loadCache();
  }, []);

  // Timer while crawling
  useEffect(() => {
    if (loading) {
      setElapsedSeconds(0);
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    toast.info(`Stopped crawl. Preserved ${events.length} event(s) already scraped on screen!`);
  };

  const handleCrawl = async () => {
    setLoading(true);
    setCurrentStep(1);
    setStatusText("Initiating Google Search Discovery via Apify...");
    setCandidateUrls([]);
    // Retain existing event details on screen; append newly discovered items

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Prefer proxy /api/crawl-events with streaming Accept header
      let res: Response;
      try {
        res = await fetch("http://localhost:5000/api/crawl-events?stream=true", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({ query, existingEvents: events }),
          signal: controller.signal,
        });
      } catch {
        res = await fetch("/api/crawl-events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({ query, existingEvents: events }),
          signal: controller.signal,
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      // Check if response is Server-Sent Events stream
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("text/event-stream") && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const chunk of parts) {
            const trimmed = chunk.trim();
            if (!trimmed) continue;
            const match = trimmed.match(/^data:\s*(.+)$/m);
            if (!match) continue;

            try {
              const payload = JSON.parse(match[1]);

              if (payload.type === "status") {
                setStatusText(payload.message);
                if (payload.step) setCurrentStep(payload.step);
              } else if (payload.type === "candidates") {
                setCandidateUrls(payload.urls || []);
                setStatusText(payload.message);
                setCurrentStep(2);
              } else if (payload.type === "auditing") {
                setStatusText(payload.message);
                setCurrentStep(3);
              } else if (payload.type === "event") {
                // 🌟 REAL-TIME EVENT STREAMED DIRECTLY TO SCREEN!
                const incoming = payload.data;
                setEvents((prev) => {
                  const idx = prev.findIndex(
                    (p) =>
                      p.event_name.toLowerCase() === incoming.event_name.toLowerCase() &&
                      (p.city?.toLowerCase() === incoming.city?.toLowerCase() || !p.city || !incoming.city)
                  );
                  if (idx !== -1) {
                    const updated = [...prev];
                    updated[idx] = { ...updated[idx], ...incoming };
                    return updated;
                  }
                  return [...prev, { ...incoming, no: prev.length + 1 }];
                });
                if (incoming.is_duplicate) {
                  toast.warning(
                    `Duplicate: ${incoming.event_name} (${incoming.duplicate_reason || "Already recorded"})`
                  );
                } else {
                  toast.success(`Found: ${incoming.event_name} (Fit ${incoming.fit_score}/5)`);
                }
              } else if (payload.type === "done") {
                setStatusText(payload.message || "Crawl finished!");
                setCurrentStep(3);
                toast.success(
                  `Crawl complete! ${payload.uniqueCount || 0} unique events processed.`
                );
              } else if (payload.type === "error") {
                toast.error(`Crawler Error: ${payload.error}`);
              }
            } catch (parseErr) {
              console.warn("Could not parse SSE payload chunk:", parseErr);
            }
          }
        }
      } else {
        // Fallback standard JSON response
        const result = await res.json();
        if (result.success) {
          const incomingList: EventRecord[] = result.data || [];
          setEvents((prev) => {
            const merged = [...prev];
            for (const item of incomingList) {
              const idx = merged.findIndex(
                (p) =>
                  p.event_name.toLowerCase() === item.event_name.toLowerCase() &&
                  (p.city?.toLowerCase() === item.city?.toLowerCase() || !p.city || !item.city)
              );
              if (idx !== -1) {
                merged[idx] = { ...merged[idx], ...item };
              } else {
                merged.push({ ...item, no: merged.length + 1 });
              }
            }
            return merged;
          });
          toast.success(`Discovered ${result.uniqueCount || incomingList.length} unique records`);
        } else {
          toast.error(`Crawler error: ${result.error}`);
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Crawl manually aborted by user.");
      } else {
        toast.error(`Engine unreachable: ${err.message}. Ensure "node server.js" is running.`);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Clear crawler disk cache
  const handleClearCache = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/crawl-events/cache", {
        method: "DELETE",
      });
      if (res.ok) {
        setEvents([]);
        toast.success("Crawler cache cleared successfully.");
      } else {
        toast.error("Could not clear crawler cache.");
      }
    } catch {
      toast.error("Failed to reach crawler on port 5000.");
    }
  };

  // Accept single event and send directly to review queue
  const handleAcceptEvent = async (event: EventRecord) => {
    setAcceptingId(event.event_name);
    try {
      const res = await fetch("/api/scraper/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: event.event_name,
          region: event.region,
          country: event.country,
          city: event.city,
          dates: event.dates,
          venue: event.venue,
          locationAddress: event.location_address,
          officialWebsite:
            sanitizeEventUrl(event.official_website, event.source_links) ||
            "https://",
          organizer: event.organizer,
          eventCategory: event.event_category,
          businessLines: event.business_lines
            ? event.business_lines.split(",").map((s) => s.trim())
            : ["Global AI Data"],
          strategicFocus: event.strategic_focus,
          relevanceToLifewood: event.relevance_lifewood,
          targetAudience: event.target_audience,
          estimatedAttendees: event.estimated_attendees,
          boothCost: event.booth_sponsorship_cost,
          participationRec: event.participation_recommendation || "Exhibit",
          priorityLevel: event.priority_level || "High",
          fitScore: event.fit_score || 4,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Automatically remove the accepted event from the scraped list!
        setEvents((prev) =>
          prev.filter(
            (item) =>
              item.event_name.toLowerCase().trim() !==
              event.event_name.toLowerCase().trim()
          )
        );

        // Also remove from crawler cache file so it does not reappear on reload
        try {
          fetch("http://localhost:5000/api/crawl-events/cache/item", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventName: event.event_name }),
          }).catch(() => {});
        } catch {}

        if (data.isDuplicate) {
          toast.info(
            data.message ||
              `"${event.event_name}" already exists in the database and was removed from scraped queue.`
          );
        } else {
          toast.success(
            `"${event.event_name}" accepted and transferred to Review Queue!`
          );
        }
      } else {
        toast.error(data.error || "Failed to accept event");
      }
    } catch {
      toast.error("Error submitting event to queue");
    } finally {
      setAcceptingId(null);
    }
  };

  // Dismiss / Remove event from scraped list without queuing
  const handleDismissEvent = (event: EventRecord) => {
    setEvents((prev) =>
      prev.filter(
        (item) =>
          item.event_name.toLowerCase().trim() !==
          event.event_name.toLowerCase().trim()
      )
    );

    try {
      fetch("http://localhost:5000/api/crawl-events/cache/item", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName: event.event_name }),
      }).catch(() => {});
    } catch {}

    toast.info(`Removed "${event.event_name}" from scraped list.`);
  };

  // Bulk Accept All Unique
  const handleAcceptAll = async () => {
    const uniqueToAccept = events.filter((e) => !e.is_duplicate);
    if (uniqueToAccept.length === 0) {
      toast.info("No unique events to transfer.");
      return;
    }

    toast.info(`Transferring ${uniqueToAccept.length} unique events to Review Queue...`);
    for (const evt of uniqueToAccept) {
      await handleAcceptEvent(evt);
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
              <span>Real-Time Stream · Apify + Gemini 2.5 Flash</span>
            </span>
          </div>
          <p className="text-[12px] text-[#666666]">
            Target scope: Sep 1, 2026 – Dec 31, 2027 · Automated 27-column audit · Minimum Fit 3+ enforcement
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F9F7F7] border border-[#D8D2C8] rounded-full text-[#133020]">
            <span className="w-2 h-2 rounded-full bg-[#046241] animate-pulse" />
            <span className="font-semibold">Engine Port: 5000</span>
          </div>
          {events.length > 0 && (
            <span className="font-semibold text-[#046241] bg-[#046241]/10 px-2.5 py-1 rounded-full">
              {events.length} verified event(s)
            </span>
          )}
        </div>
      </div>

      {/* Query Search & Control Bar */}
      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            placeholder="e.g. tech exhibition 2027 Singapore OR Hong Kong OR United States"
            className="w-full px-4 py-2.5 rounded-[8px] border border-[#D8D2C8] bg-white text-xs text-[#133020] placeholder-[#999999] focus:outline-none focus:border-[#046241] focus:ring-2 focus:ring-[#046241]/15 transition disabled:opacity-60"
          />
        </div>

        {!loading ? (
          <button
            onClick={handleCrawl}
            className="px-5 py-2.5 rounded-[8px] bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] font-semibold text-xs shadow-xs transition-all duration-180 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-[#133020]" />
            <span>Start discovery & crawl</span>
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-5 py-2.5 rounded-[8px] bg-[#B91C1C] hover:bg-[#991B1B] text-white font-semibold text-xs shadow-xs transition-all duration-180 flex items-center gap-2 shrink-0 cursor-pointer animate-pulse"
            title="Stop crawl and keep whatever events were already discovered"
          >
            <Square className="w-3.5 h-3.5 fill-white" />
            <span>Stop & keep ({events.length})</span>
          </button>
        )}
      </div>

      {/* Real-Time User Experience & Progress Stepper */}
      {loading && (
        <div className="bg-[#F5EEDB]/60 border border-[#D8D2C8] rounded-[10px] p-4.5 space-y-3.5 transition-all">
          {/* Top Status line + Elapsed Stopwatch */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <Loader2 className="w-4 h-4 text-[#046241] animate-spin shrink-0" />
              <span className="text-xs font-semibold text-[#133020]">
                {statusText || "Discovering exhibitions..."}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#133020] bg-white px-2.5 py-1 rounded-[6px] border border-[#D8D2C8] shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#C17110]" />
              <span>Elapsed: {formatTimer(elapsedSeconds)}</span>
            </div>
          </div>

          {/* Stepper Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {/* Step 1 */}
            <div
              className={`p-3 rounded-[8px] border text-xs transition ${
                currentStep >= 1
                  ? "bg-white border-[#046241] text-[#133020] shadow-xs"
                  : "bg-white/50 border-[#D8D2C8] text-[#999999]"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                {currentStep > 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-[#046241]" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-[#046241] text-white text-[10px] flex items-center justify-center font-bold">
                    1
                  </span>
                )}
                <span>1. Google Discovery</span>
              </div>
              <p className="text-[11px] text-[#666666] mt-1 pl-6">
                Organic candidate event search via Apify
              </p>
            </div>

            {/* Step 2 */}
            <div
              className={`p-3 rounded-[8px] border text-xs transition ${
                currentStep >= 2
                  ? "bg-white border-[#046241] text-[#133020] shadow-xs"
                  : "bg-white/50 border-[#D8D2C8] text-[#999999]"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                {currentStep > 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-[#046241]" />
                ) : currentStep === 2 ? (
                  <Loader2 className="w-4 h-4 text-[#046241] animate-spin" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-[#D8D2C8] text-[#666666] text-[10px] flex items-center justify-center font-bold">
                    2
                  </span>
                )}
                <span>2. High-Speed Crawl</span>
              </div>
              <p className="text-[11px] text-[#666666] mt-1 pl-6">
                Parallel page content extraction
              </p>
            </div>

            {/* Step 3 */}
            <div
              className={`p-3 rounded-[8px] border text-xs transition ${
                currentStep >= 3
                  ? "bg-white border-[#046241] text-[#133020] shadow-xs"
                  : "bg-white/50 border-[#D8D2C8] text-[#999999]"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                {currentStep === 3 ? (
                  <Loader2 className="w-4 h-4 text-[#046241] animate-spin" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-[#D8D2C8] text-[#666666] text-[10px] flex items-center justify-center font-bold">
                    3
                  </span>
                )}
                <span>3. Gemini AI Audit</span>
              </div>
              <p className="text-[11px] text-[#666666] mt-1 pl-6">
                27-column audit & Fit Score calculation
              </p>
            </div>
          </div>

          {/* Candidate URLs Pill Chips */}
          {candidateUrls.length > 0 && (
            <div className="pt-1">
              <span className="text-[11px] font-semibold text-[#666666] block mb-1.5">
                Found Candidate Exhibition URLs ({candidateUrls.length}):
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {candidateUrls.map((u, i) => (
                  <a
                    key={i}
                    href={u}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-white border border-[#D8D2C8] text-[11px] font-medium text-[#046241] hover:text-[#133020] hover:border-[#046241] transition truncate max-w-xs"
                  >
                    <Globe className="w-3 h-3 text-[#046241] shrink-0" />
                    <span className="truncate">{new URL(u).hostname}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter and Bulk Action Header when events are present */}
      {events.length > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-xs font-semibold text-[#133020] flex items-center gap-1.5 mr-2">
              <Filter className="w-3.5 h-3.5 text-[#046241]" />
              <span>Filter:</span>
            </div>

            {/* Filter Pills */}
            <div className="inline-flex rounded-lg border border-[#D8D2C8] bg-[#F9F7F7] p-0.5 text-xs">
              <button
                onClick={() => setFilterMode("all")}
                className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                  filterMode === "all"
                    ? "bg-[#133020] text-white shadow-2xs font-semibold"
                    : "text-[#666666] hover:text-[#133020]"
                }`}
              >
                All Events ({events.length})
              </button>
              <button
                onClick={() => setFilterMode("unique")}
                className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                  filterMode === "unique"
                    ? "bg-[#046241] text-white shadow-2xs font-semibold"
                    : "text-[#046241] hover:text-[#133020]"
                }`}
              >
                <span>New Unique</span>
                <span className="bg-[#046241]/20 px-1 rounded-full text-[10px] font-bold">
                  {uniqueCount}
                </span>
              </button>
              <button
                onClick={() => setFilterMode("duplicates")}
                className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                  filterMode === "duplicates"
                    ? "bg-[#B87A00] text-white shadow-2xs font-semibold"
                    : "text-[#B87A00] hover:text-[#8C6B14]"
                }`}
              >
                <span>Duplicates</span>
                <span className="bg-[#B87A00]/20 px-1 rounded-full text-[10px] font-bold">
                  {duplicateCount}
                </span>
              </button>
            </div>

            {loading && (
              <span className="text-[11px] text-[#046241] animate-pulse font-normal ml-2">
                (Streaming in real time...)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearCache}
              className="px-2.5 py-1.5 border border-[#D8D2C8] hover:border-red-300 text-[#666666] hover:text-red-600 rounded-[6px] text-xs font-medium flex items-center gap-1 transition cursor-pointer"
              title="Clear previously saved crawler memory"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cache</span>
            </button>

            <button
              onClick={handleAcceptAll}
              disabled={uniqueCount === 0}
              className="px-3.5 py-1.5 bg-[#133020] hover:bg-[#046241] text-white hover:text-[#FFB347] rounded-[6px] text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#FFB347]" />
              <span>Accept All Unique ({uniqueCount})</span>
            </button>
          </div>
        </div>
      )}

      {/* Results Table adhering to Section 6.7 with real-time updates */}
      <div className="overflow-x-auto rounded-[8px] border border-[#D8D2C8] bg-white shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#133020] text-white text-[10.5px] uppercase tracking-[0.08em] font-semibold border-b border-[#133020]">
              <th className="py-3 px-3.5 text-center w-12">#</th>
              <th className="py-3 px-3.5 min-w-[220px]">Exhibition event</th>
              <th className="py-3 px-3.5 min-w-[120px]">Dates</th>
              <th className="py-3 px-3.5 min-w-[140px]">Location</th>
              <th className="py-3 px-3.5 min-w-[160px]">Business lines</th>
              <th className="py-3 px-3.5 text-center w-16">Fit</th>
              <th className="py-3 px-3.5 text-center w-24">Priority</th>
              <th className="py-3 px-3.5 min-w-[110px]">Booth cost</th>
              <th className="py-3 px-3.5 text-right w-24">Link</th>
              <th className="py-3 px-3.5 text-right w-28">Queue Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8D2C8] text-[#133020]">
            {displayedEvents.length === 0 && !loading ? (
              <tr>
                <td colSpan={10} className="text-center py-12 px-4 text-[#666666]">
                  <div className="max-w-xs mx-auto space-y-1">
                    <p className="font-semibold text-[#133020] text-[13px]">
                      {filterMode === "duplicates"
                        ? "No duplicate events detected"
                        : filterMode === "unique"
                        ? "No new unique events found"
                        : "No exhibition records crawled yet"}
                    </p>
                    <p className="text-[11px] text-[#666666]">
                      {filterMode !== "all"
                        ? "Switch back to 'All Events' to view the full discovery list."
                        : "Enter a geographic or industrial search query above to trigger automated discovery."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              displayedEvents.map((e, idx) => {
                let blArray: string[] = [];
                try {
                  blArray =
                    typeof e.business_lines === "string"
                      ? e.business_lines.split(",")
                      : [e.business_lines];
                } catch {
                  blArray = [e.business_lines];
                }

                const isAccepted = acceptedEvents[e.event_name];
                const isAccepting = acceptingId === e.event_name;
                const isDuplicate = Boolean(e.is_duplicate);

                return (
                  <tr
                    key={e.event_name + idx}
                    className={`transition-colors duration-150 animate-in fade-in duration-300 ${
                      isDuplicate
                        ? "bg-[#FCFAF6] hover:bg-[#F7F2E8]"
                        : "hover:bg-[#F0F5F2]"
                    }`}
                  >
                    <td className="py-3 px-3.5 text-center font-semibold text-[#666666]">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="flex items-start gap-1 flex-wrap">
                        <span className="font-semibold text-[#133020] block leading-snug">
                          {e.event_name}
                        </span>
                        {isDuplicate && (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#8C6B14] bg-[#FDF4DC] border border-[#ECD189] px-2 py-0.5 rounded-full"
                            title={e.duplicate_reason || "Already in system"}
                          >
                            <AlertCircle className="w-2.5 h-2.5" />
                            <span>Duplicate</span>
                          </span>
                        )}
                      </div>
                      {isDuplicate && e.duplicate_reason && (
                        <span className="text-[10px] text-[#8C6B14] block mt-0.5 italic">
                          ↳ {e.duplicate_reason}
                        </span>
                      )}
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
                      {(() => {
                        const targetUrl = sanitizeEventUrl(
                          e.official_website,
                          e.source_links
                        );
                        if (!targetUrl) {
                          return (
                            <span className="text-[11px] text-[#999999]">
                              No link
                            </span>
                          );
                        }
                        return (
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#046241] hover:text-[#133020] transition"
                          >
                            <span>Visit</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        );
                      })()}
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      {isDuplicate ? (
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <span
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#777777] bg-[#F0ECE1] px-2.5 py-1 rounded-full border border-[#D8D2C8]"
                            title={e.duplicate_reason || "Event already recorded in system"}
                          >
                            <span>Existing Record</span>
                          </span>
                          <button
                            onClick={() => handleDismissEvent(e)}
                            title="Dismiss from list"
                            className="p-1 text-[#777777] hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => handleAcceptEvent(e)}
                            disabled={isAccepting}
                            className="px-2.5 py-1 bg-[#046241] hover:bg-[#133020] text-white rounded-[6px] text-[11px] font-semibold transition cursor-pointer disabled:opacity-50"
                          >
                            {isAccepting ? "Moving..." : "+ Accept"}
                          </button>
                          <button
                            onClick={() => handleDismissEvent(e)}
                            title="Dismiss from list"
                            className="p-1 text-[#777777] hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
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

