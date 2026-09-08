import Link from "next/link";
import { FitScoreBadge } from "./fit-score-badge";
import { PriorityIndicator } from "./priority-indicator";
import { BusinessLineChip } from "./business-line-chip";
import { BUSINESS_LINES } from "@/lib/constants/business-lines";
import { MapPin, Calendar, ExternalLink, Ticket } from "lucide-react";

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

  const isFree =
    event.boothCost?.toLowerCase().includes("free") ||
    event.boothCost === "$0" ||
    event.boothCost === "0";

  return (
    <Link
      href={`/events/${event.id}`}
      className="bg-white rounded-[12px] border-[1.5px] border-[#D8D2C8] shadow-[0_2px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col justify-between relative group cursor-pointer block"
    >
      {/* 6px Accent Bar on Left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[6px] z-10"
        style={{ backgroundColor: accentColor }}
      />

      <div>
        {/* Header Section */}
        <div className="p-5 pl-7 border-b border-[#D8D2C8]/60">
          <div className="flex items-center justify-between gap-2 text-xs text-[#666666] mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#133020]">
                Event #{event.eventNumber}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  isFree
                    ? "bg-[#046241]/10 text-[#046241]"
                    : "bg-[#FFB347]/25 text-[#133020]"
                }`}
              >
                <Ticket className="w-3 h-3" />
                {isFree ? "Free Entry" : "Paid / Ticketed"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#046241]" />
              <span>{event.dates}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#133020] group-hover:text-[#046241] transition line-clamp-2 leading-snug mb-3">
            {event.eventName}
          </h3>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {businessLines.map((bl) => (
                <BusinessLineChip key={bl} name={bl} />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <PriorityIndicator priority={event.priorityLevel} />
              <FitScoreBadge score={event.fitScore} />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-[#666666]">
            <div className="flex items-center gap-1 truncate max-w-[70%]">
              <MapPin className="w-3.5 h-3.5 text-[#046241] shrink-0" />
              <span className="truncate font-medium text-[#133020]">
                {event.city}, {event.country}
              </span>
            </div>
            <span className="truncate text-[#666666]">{event.venue}</span>
          </div>
        </div>

        {/* Body Grid */}
        <div className="p-5 pl-7 grid grid-cols-3 gap-3 text-xs border-b border-[#D8D2C8]/60 bg-[#F9F7F7]">
          <div>
            <span className="block text-[10px] uppercase font-semibold text-[#666666] tracking-wider mb-0.5">
              Organizer
            </span>
            <p className="font-medium text-[#133020] line-clamp-2">
              {event.organizer}
            </p>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-semibold text-[#666666] tracking-wider mb-0.5">
              Target Audience
            </span>
            <p className="font-medium text-[#133020] line-clamp-2">
              {event.targetAudience}
            </p>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-semibold text-[#666666] tracking-wider mb-0.5">
              Attendees
            </span>
            <p className="font-semibold text-[#046241]">
              {event.estimatedAttendees}
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Section */}
      <div className="p-4 pl-7 bg-[rgba(4,98,65,0.05)] border-t border-[#046241]/10 flex items-center justify-between">
        <div className="max-w-[75%]">
          <span className="block text-[10px] uppercase font-bold text-[#046241] tracking-wider mb-0.5">
            Relevance to Lifewood
          </span>
          <p className="text-xs text-[#133020] line-clamp-1 leading-relaxed">
            {event.relevanceToLifewood}
          </p>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#046241] text-white text-[11px] font-semibold shrink-0">
          Action: {event.participationRec}
        </span>
      </div>
    </Link>
  );
}
