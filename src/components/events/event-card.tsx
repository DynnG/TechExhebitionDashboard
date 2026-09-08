import Link from "next/link";
import { PriorityIndicator } from "./priority-indicator";
import { BusinessLineChip } from "./business-line-chip";
import { BUSINESS_LINES } from "@/lib/constants/business-lines";
import { MapPin, Calendar, Ticket, Award } from "lucide-react";

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
      className="bg-white rounded-2xl border-[1.5px] border-[#D8D2C8] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col justify-between relative group cursor-pointer block p-6"
    >
      {/* 6px Accent Bar on Left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[6px] z-10"
        style={{ backgroundColor: accentColor }}
      />

      <div className="space-y-4">
        {/* Top Meta Header */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#133020]">#{event.eventNumber}</span>
            <span className="text-[#666666]">• {event.region}</span>
          </div>

          {/* Simple Clean Score Badge */}
          <div className="flex items-center gap-1 bg-[#133020] text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#FFB347]" />
            <span>Score: {event.fitScore}.0</span>
          </div>
        </div>

        {/* Event Name */}
        <h3 className="text-base font-bold text-[#133020] group-hover:text-[#046241] transition line-clamp-2 leading-snug">
          {event.eventName}
        </h3>

        {/* Date & Location */}
        <div className="space-y-1.5 text-xs text-[#666666]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#046241] shrink-0" />
            <span className="font-semibold text-[#133020]">{event.dates}</span>
          </div>

          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-4 h-4 text-[#046241] shrink-0" />
            <span className="truncate text-[#133020] font-medium">
              {event.city}, {event.country} • {event.venue}
            </span>
          </div>
        </div>

        {/* Business Lines */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {businessLines.slice(0, 3).map((bl) => (
            <BusinessLineChip key={bl} name={bl} />
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3 border-t border-[#D8D2C8] flex items-center justify-between text-xs">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isFree
              ? "bg-[#046241]/10 text-[#046241]"
              : "bg-[#FFB347]/25 text-[#133020]"
          }`}
        >
          <Ticket className="w-3 h-3" />
          {isFree ? "Free Entry" : "Paid / Ticketed"}
        </span>

        <span className="px-3 py-1 rounded-lg bg-[#046241] text-white text-xs font-bold shadow-2xs">
          {event.participationRec}
        </span>
      </div>
    </Link>
  );
}
