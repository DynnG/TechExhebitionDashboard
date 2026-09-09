import Link from "next/link";
import { motion } from "framer-motion";
import { PriorityIndicator } from "./priority-indicator";
import { BusinessLineChip } from "./business-line-chip";
import { FitScoreBadge } from "./fit-score-badge";
import { BUSINESS_LINES } from "@/lib/constants/business-lines";
import { MapPin, CheckCircle2 } from "lucide-react";

interface EventCardProps {
  event: any;
  onToggleAttended?: (id: number, currentStatus: boolean) => void;
}

export function EventCard({ event, onToggleAttended }: EventCardProps) {
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

<<<<<<< HEAD
  const fitLevel =
    event.fitScore >= 4 ? "High" : event.fitScore === 3 ? "Mid" : "Low";
  const fitColor =
    event.fitScore >= 4
      ? "text-[#046241]"
      : event.fitScore === 3
      ? "text-[#C17110]"
      : "text-[#708E7C]";

  return (
    <Link
      href={`/events/${event.id}`}
      className="bg-white rounded-[12px] border-[1.5px] border-[#D8D2C8] shadow-[0_2px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.08)] hover:-translate-y-[1px] transition-all duration-180 overflow-hidden flex flex-col justify-between relative group cursor-pointer block font-manrope"
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
            <div className="flex items-center gap-1.5 text-[12px] text-[#666666]">
              <span className="font-semibold text-[#133020]">#{event.eventNumber}</span>
              <span>·</span>
              <span className="text-[#666666] font-medium">{event.dates}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#666666]">
              <span>{event.region}</span>
              {event.country && <span>· {event.country}</span>}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <PriorityIndicator priority={event.priorityLevel} />
            {/* Enlarged numeric fit score + High / Mid / Low indicator below */}
            <div
              className="flex flex-col items-center justify-center min-w-[44px] px-2 py-1 rounded-[8px] bg-[#F5EEDB]/50 border border-[#D8D2C8]"
              title={`Fit score: ${event.fitScore}/5 (${fitLevel} fit)`}
            >
              <span className="text-[26px] font-extrabold text-[#133020] leading-none">
                {event.fitScore}
              </span>
              <span className={`text-[9.5px] font-bold uppercase tracking-wider mt-0.5 ${fitColor}`}>
                {fitLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Event Name (Manrope Semibold, 18px) */}
        <h3 className="text-[18px] font-semibold text-[#133020] group-hover:text-[#046241] transition leading-snug tracking-tight line-clamp-2">
          {event.eventName}
        </h3>

        {/* Location & Venue */}
        <div className="flex items-center gap-1.5 text-[12px] text-[#666666] truncate">
          <MapPin className="w-3.5 h-3.5 text-[#046241] shrink-0" />
          <span className="truncate">
            {event.city}, {event.country}
            {event.venue && (
              <span className="text-[#133020] font-medium"> · {event.venue}</span>
            )}
          </span>
        </div>

        {/* Business Line Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {businessLines.map((bl) => (
            <BusinessLineChip key={bl} name={bl} />
          ))}
=======
  const handleAttendedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleAttended) {
      onToggleAttended(event.id, !!event.isAttended);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/events/${event.id}`}
        className="bg-white rounded-[12px] border-[1.5px] border-[#D8D2C8] shadow-sm hover:shadow-md transition-all duration-180 overflow-hidden flex flex-col justify-between relative group cursor-pointer block font-manrope"
      >
        {/* 6px Color Accent Bar on Left Edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[6px] z-10 rounded-l-[12px]"
          style={{ backgroundColor: accentColor }}
        />

        {/* HEADER AREA */}
        <div className="p-5 pl-6 space-y-3">
          {/* Event # · Date & Score */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[12px] text-[#666666]">
                <span className="font-bold text-[#133020]">#{event.eventNumber}</span>
                <span>·</span>
                <span className="font-medium">{event.dates}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#666666]">
                <span>{event.region}</span>
                {event.country && <span>· {event.country}</span>}
              </div>

              {/* Attendance Indicator / Toggle Pill */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleAttendedClick}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold transition-all border ${
                    event.isAttended
                      ? "bg-[#046241] text-white border-[#046241]"
                      : "bg-[#F9F7F7] text-[#666666] border-[#D8D2C8] hover:border-[#046241] hover:text-[#046241]"
                  }`}
                  title={event.isAttended ? "Attended (Click to toggle)" : "Click to mark as Attended"}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{event.isAttended ? "Attended" : "Mark Attended"}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <PriorityIndicator priority={event.priorityLevel} />
              {/* Enlarge Score Badge & Remove Side Text */}
              <FitScoreBadge score={event.fitScore} size="lg" showLevel />
            </div>
          </div>

          {/* Event Name */}
          <h3 className="text-[18px] font-bold text-[#133020] group-hover:text-[#046241] transition leading-snug tracking-tight line-clamp-2">
            {event.eventName}
          </h3>

          {/* Location & Venue */}
          <div className="flex items-center gap-1.5 text-[12px] text-[#666666] truncate">
            <MapPin className="w-3.5 h-3.5 text-[#046241] shrink-0" />
            <span className="truncate">
              {event.city}, {event.country}
              {event.venue && (
                <span className="text-[#133020] font-medium"> · {event.venue}</span>
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
        <div className="border-t border-[#D8D2C8] bg-white px-5 pl-6 py-3 grid grid-cols-3 gap-2.5 text-[12px]">
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-wider text-[#666666] font-medium block">
              Organizer
            </span>
            <span className="text-[12px] font-medium text-[#133020] truncate block" title={event.organizer}>
              {event.organizer || "Not disclosed"}
            </span>
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-wider text-[#666666] font-medium block">
              Audience
            </span>
            <span className="text-[12px] font-medium text-[#133020] truncate block" title={event.targetAudience}>
              {event.targetAudience || "Enterprise buyers"}
            </span>
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-wider text-[#666666] font-medium block">
              Attendees
            </span>
            <span className="text-[12px] font-medium text-[#133020] truncate block" title={event.estimatedAttendees}>
              {event.estimatedAttendees || "Not disclosed"}
            </span>
          </div>
        </div>

        {/* STRATEGIC SECTION */}
        <div className="border-t border-[#D8D2C8] bg-[#F0F5F2] px-5 pl-6 py-3 flex items-center justify-between gap-3 text-xs">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-[#046241] font-bold block mb-0.5">
              Relevance to Lifewood
            </span>
            <p className="text-[12px] text-[#133020] line-clamp-2 leading-relaxed font-normal">
              {event.relevanceToLifewood || event.strategicFocus || "Strategic enterprise buyer alignment"}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#666666] font-medium block mb-0.5">
              Recommendation
            </span>
            <span className="inline-block px-2.5 py-1 rounded-[6px] text-[11px] font-bold bg-[#FFB347] text-[#133020] border border-[#FFB347]/40 shadow-2xs">
              {event.participationRec || "Exhibit"}
            </span>
          </div>
>>>>>>> b62534b (feat: event attendance, enlarged fit score badges, bento filter system, queues/history/users UI redesign, and sticky header blur)
        </div>
      </div>

      {/* BODY GRID (auto-fit columns) */}
      <div className="border-t border-[#D8D2C8] bg-white px-5 pl-6 py-3 grid grid-cols-3 gap-2.5 text-[12px]">
        <div className="min-w-0">
          <span className="text-[10px] uppercase tracking-wider text-[#666666] font-medium block">
            Organizer
          </span>
          <span className="text-[12px] font-medium text-[#133020] truncate block" title={event.organizer}>
            {event.organizer || "Not disclosed"}
          </span>
        </div>
        <div className="min-w-0">
          <span className="text-[10px] uppercase tracking-wider text-[#666666] font-medium block">
            Audience
          </span>
          <span className="text-[12px] font-medium text-[#133020] truncate block" title={event.targetAudience}>
            {event.targetAudience || "Enterprise buyers"}
          </span>
        </div>
        <div className="min-w-0">
          <span className="text-[10px] uppercase tracking-wider text-[#666666] font-medium block">
            Attendees
          </span>
          <span className="text-[12px] font-medium text-[#133020] truncate block" title={event.estimatedAttendees}>
            {event.estimatedAttendees || "Not disclosed"}
          </span>
        </div>
      </div>

      {/* STRATEGIC SECTION (green-tinted bg) */}
      <div className="border-t border-[#D8D2C8] bg-[#F0F5F2] px-5 pl-6 py-3 flex items-center justify-between gap-3 text-xs">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] uppercase tracking-wider text-[#046241] font-semibold block mb-0.5">
            Relevance to Lifewood
          </span>
          <p className="text-[12px] text-[#133020] line-clamp-2 leading-relaxed font-normal">
            {event.relevanceToLifewood || event.strategicFocus || "Strategic enterprise buyer alignment"}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <span className="text-[10px] uppercase tracking-wider text-[#666666] font-medium block mb-0.5">
            Recommendation
          </span>
          <span className="inline-block px-2.5 py-1 rounded-[6px] text-[11px] font-semibold bg-[#FFB347] text-[#133020] border border-[#FFB347]/40 shadow-2xs">
            {event.participationRec || "Exhibit"}
          </span>
        </div>
      </div>
    </Link>
  );
}
