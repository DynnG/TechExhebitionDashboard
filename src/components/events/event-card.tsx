import Link from "next/link";
import { motion } from "framer-motion";
import { PriorityIndicator } from "./priority-indicator";
import { BusinessLineChip } from "./business-line-chip";
import { BUSINESS_LINES } from "@/lib/constants/business-lines";
import { MapPin } from "lucide-react";

interface EventCardProps {
  event: any;
}

export function EventCard({ event }: EventCardProps) {
  let businessLines: string[] = [];
  try {
    businessLines = JSON.parse(event.businessLines || "[]");
  } catch {
    businessLines = Array.isArray(event.businessLines)
      ? event.businessLines
      : [event.businessLines];
  }

  const primaryBL = businessLines[0] || "Global AI Data";
  const blConfig = BUSINESS_LINES.find(
    (b) => b.name.toLowerCase() === primaryBL.toLowerCase()
  );
  const accentColor = blConfig ? blConfig.colorHex : "#046241";

  const fitLevel =
    event.fitScore >= 4 ? "High" : event.fitScore === 3 ? "Mid" : "Low";
  const fitColor =
    event.fitScore >= 4
      ? "text-emerald-600 dark:text-emerald-400"
      : event.fitScore === 3
      ? "text-amber-600 dark:text-amber-400"
      : "text-slate-500 dark:text-slate-400";

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/events/${event.id}`}
        className="bg-white dark:bg-[#133020] rounded-[12px] border-[1.5px] border-[#D8D2C8] dark:border-[#1E4830] shadow-sm hover:shadow-md transition-all duration-180 overflow-hidden flex flex-col justify-between relative group cursor-pointer block font-manrope"
      >
        {/* 6px Color Accent Bar on Left Edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[6px] z-10 rounded-l-[12px]"
          style={{ backgroundColor: accentColor }}
        />

        {/* HEADER AREA */}
        <div className="p-5 pl-6 space-y-3">
          {/* Event # · Date & Badges */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[12px] text-emerald-800/70 dark:text-slate-400">
                <span className="font-bold text-emerald-950 dark:text-slate-100">#{event.eventNumber}</span>
                <span>·</span>
                <span className="font-medium">{event.dates}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-800/70 dark:text-slate-400">
                <span>{event.region}</span>
                {event.country && <span>· {event.country}</span>}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <PriorityIndicator priority={event.priorityLevel} />
              {/* Enlarged numeric fit score */}
              <div
                className="flex flex-col items-center justify-center min-w-[44px] px-2 py-1 rounded-[8px] bg-[#F5EEDB]/50 dark:bg-black/20 border border-[#D8D2C8] dark:border-white/10"
                title={`Fit score: ${event.fitScore}/5 (${fitLevel} fit)`}
              >
                <span className="text-[26px] font-extrabold text-emerald-950 dark:text-white leading-none">
                  {event.fitScore}
                </span>
                <span className={`text-[9.5px] font-bold uppercase tracking-wider mt-0.5 ${fitColor}`}>
                  {fitLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Event Name */}
          <h3 className="text-[18px] font-bold text-emerald-950 dark:text-white group-hover:text-amber-500 transition leading-snug tracking-tight line-clamp-2">
            {event.eventName}
          </h3>

          {/* Location & Venue */}
          <div className="flex items-center gap-1.5 text-[12px] text-emerald-800/70 dark:text-slate-400 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-amber-400 shrink-0" />
            <span className="truncate">
              {event.city}, {event.country}
              {event.venue && (
                <span className="text-emerald-950 dark:text-slate-200 font-medium"> · {event.venue}</span>
              )}
            </span>
          </div>

          {/* Business Line Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {businessLines.map((bl) => (
              <BusinessLineChip key={bl} name={bl} />
            ))}
          </div>
        </div>

        {/* BODY GRID */}
        <div className="border-t border-[#D8D2C8] dark:border-[#1E4830] bg-white dark:bg-[#133020] px-5 pl-6 py-3 grid grid-cols-3 gap-2.5 text-[12px] transition-colors">
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-wider text-emerald-800/70 dark:text-slate-400 font-medium block">
              Organizer
            </span>
            <span className="text-[12px] font-medium text-emerald-950 dark:text-slate-100 truncate block" title={event.organizer}>
              {event.organizer || "Not disclosed"}
            </span>
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-wider text-emerald-800/70 dark:text-slate-400 font-medium block">
              Audience
            </span>
            <span className="text-[12px] font-medium text-emerald-950 dark:text-slate-100 truncate block" title={event.targetAudience}>
              {event.targetAudience || "Enterprise buyers"}
            </span>
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-wider text-emerald-800/70 dark:text-slate-400 font-medium block">
              Attendees
            </span>
            <span className="text-[12px] font-medium text-emerald-950 dark:text-slate-100 truncate block" title={event.estimatedAttendees}>
              {event.estimatedAttendees || "Not disclosed"}
            </span>
          </div>
        </div>

        {/* STRATEGIC SECTION */}
        <div className="border-t border-[#D8D2C8] dark:border-[#1E4830] bg-[#F0F5F2] dark:bg-black/30 px-5 pl-6 py-3 flex items-center justify-between gap-3 text-xs transition-colors">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold block mb-0.5">
              Relevance to Lifewood
            </span>
            <p className="text-[12px] text-emerald-950 dark:text-slate-200 line-clamp-2 leading-relaxed font-normal">
              {event.relevanceToLifewood || event.strategicFocus || "Strategic enterprise buyer alignment"}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-[10px] uppercase tracking-wider text-emerald-800/70 dark:text-slate-400 font-medium block mb-0.5">
              Recommendation
            </span>
            <span className="inline-block px-2.5 py-1 rounded-[6px] text-[11px] font-bold bg-amber-400 text-emerald-950 border border-amber-400/40 shadow-2xs">
              {event.participationRec || "Exhibit"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
