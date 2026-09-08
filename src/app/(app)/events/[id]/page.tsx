"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FitScoreBadge } from "@/components/events/fit-score-badge";
import { PriorityIndicator } from "@/components/events/priority-indicator";
import { BusinessLineChip } from "@/components/events/business-line-chip";
import { BUSINESS_LINES } from "@/lib/constants/business-lines";
import { EventForm } from "@/components/events/event-form";
import { ModalPortal } from "@/components/shared/modal-portal";
import {
  MapPin,
  Calendar,
  Building,
  Globe,
  Users,
  DollarSign,
  Clock,
  Mail,
  User,
  Share2,
  Edit,
  Trash2,
  ArrowLeft,
  ExternalLink,
  Loader2,
  FileCheck,
  Award,
  Star,
  Ticket,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useLocaleStore } from "@/stores/locale-store";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "INTERN";
  const { locale } = useLocaleStore();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        if (res.ok) {
          setEvent(data.event);
        } else {
          toast.error(data.error || "Event not found");
        }
      } catch (err) {
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this event record?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Event record deleted");
        router.push("/events");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Error deleting event");
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-[#046241]">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <span className="text-xs font-semibold text-[#133020]">
          Loading exhibition specifications...
        </span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-12 text-center text-[#B91C1C] font-semibold text-sm">
        Event not found.
      </div>
    );
  }

  let businessLines: string[] = [];
  try {
    businessLines = JSON.parse(event.businessLines || "[]");
  } catch {
    businessLines = Array.isArray(event.businessLines)
      ? event.businessLines
      : [event.businessLines];
  }

  let sourceLinks: string[] = [];
  try {
    sourceLinks = JSON.parse(event.sourceLinks || "[]");
  } catch {
    sourceLinks = Array.isArray(event.sourceLinks)
      ? event.sourceLinks
      : [event.sourceLinks];
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
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-manrope">
      {/* Back Button & Section Title */}
      <div className="flex items-center justify-between">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#046241] hover:text-[#133020] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{locale === "en" ? "Back to All Events" : "返回展会列表"}</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-[#666666]">
          {locale === "en" ? "Exhibition Details" : "展会详细信息"}
        </span>
      </div>

      {/* Main Full-Width Standalone Card Container */}
      <div className="bg-white rounded-2xl border-[1.5px] border-[#D8D2C8] shadow-lg overflow-hidden relative">
        {/* 6px Left Accent Bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2 z-10"
          style={{ backgroundColor: accentColor }}
        />

        {/* HEADER AREA */}
        <div className="p-8 pl-10 border-b border-[#D8D2C8]/60 bg-gradient-to-r from-white to-[#F9F7F7]">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#046241] bg-[#046241]/10 px-3 py-1 rounded-full">
                Record #{event.eventNumber} • {event.region}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isFree
                    ? "bg-[#046241]/10 text-[#046241]"
                    : "bg-[#FFB347]/25 text-[#133020]"
                }`}
              >
                <Ticket className="w-3.5 h-3.5" />
                {isFree ? "Free Entry" : "Paid / Ticketed"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <PriorityIndicator priority={event.priorityLevel} />
              
              {/* ENLARGED & HIGHLIGHTED TOP-RIGHT FIT SCORE BADGE */}
              <div className="flex items-center gap-2 bg-[#FFB347] text-[#133020] px-4 py-2 rounded-xl border-2 border-[#133020] shadow-md transform hover:scale-105 transition">
                <Award className="w-5 h-5 text-[#133020]" />
                <div className="leading-none text-left">
                  <span className="text-[9px] uppercase font-black tracking-wider block text-[#133020]/80">Fit Score</span>
                  <span className="text-base font-black text-[#133020]">{event.fitScore}.0 / 5.0</span>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-[#133020] tracking-tight mb-3">
            {event.eventName}
          </h1>

          <div className="flex items-center gap-2 flex-wrap mb-5">
            {businessLines.map((bl) => (
              <BusinessLineChip key={bl} name={bl} />
            ))}
          </div>

          {/* Prominent External Website Button & Logistics Row */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-[#D8D2C8]/60">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#133020]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#046241] shrink-0" />
                <div>
                  <span className="text-[10px] text-[#666666] block uppercase font-semibold">
                    Dates
                  </span>
                  <span className="font-bold text-sm">{event.dates}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#046241] shrink-0" />
                <div>
                  <span className="text-[10px] text-[#666666] block uppercase font-semibold">
                    Location
                  </span>
                  <span className="font-bold text-sm">
                    {event.city}, {event.country}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#046241] shrink-0" />
                <div>
                  <span className="text-[10px] text-[#666666] block uppercase font-semibold">
                    Venue
                  </span>
                  <span className="font-bold text-sm truncate block max-w-[200px]">
                    {event.venue}
                  </span>
                </div>
              </div>
            </div>

            {/* PROMINENT OFFICIAL WEBSITE CTA */}
            {event.officialWebsite && (
              <a
                href={event.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#046241] hover:bg-[#133020] text-white font-bold text-xs rounded-xl transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Globe className="w-4 h-4" />
                <span>Visit Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* BODY (2-Column Grid) */}
        <div className="p-8 pl-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[#D8D2C8]">
          {/* Left Column: Strategic Focus */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#046241] mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#046241]" />
                <span>Event Location & Map Address</span>
              </h3>
              <div className="bg-[#F5EEDB] p-4 rounded-xl border border-[#D8D2C8] space-y-2 text-xs text-[#133020]">
                <div>
                  <span className="font-bold block text-[#133020] text-sm">{event.venue}</span>
                  <p className="text-[#666666] mt-0.5">
                    {event.locationAddress || `${event.city}, ${event.country}`}
                  </p>
                  <span className="text-[11px] text-[#046241] font-semibold block mt-1">
                    Region: {event.region} • Country: {event.country} • City: {event.city}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#D8D2C8] flex justify-start">
                  {event.locationAddress && event.locationAddress !== "Not publicly disclosed" ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue}, ${event.locationAddress}, ${event.city}, ${event.country}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#133020] text-white font-bold text-xs rounded-xl hover:bg-[#046241] transition shadow-xs"
                    >
                      <MapPin className="w-4 h-4 text-[#FFB347]" />
                      <span>Open Location in Google Maps ↗</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/70 text-[#666666] font-semibold text-xs rounded-lg border border-[#D8D2C8]">
                      <MapPin className="w-3.5 h-3.5 text-[#999999]" />
                      <span>No map link available for this event</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#046241] mb-2 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" />
                <span>Strategic Focus & Purpose</span>
              </h3>
              <p className="text-xs text-[#133020] leading-relaxed bg-[#F9F7F7] p-4 rounded-xl border border-[#D8D2C8]/60">
                {event.strategicFocus}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#046241] mb-2">
                Relevance to Lifewood
              </h3>
              <p className="text-xs font-medium text-[#133020] leading-relaxed bg-[rgba(4,98,65,0.06)] p-4 rounded-xl border border-[#046241]/20">
                {event.relevanceToLifewood}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#133020] mb-2">
                Target Audience & Buyers
              </h3>
              <p className="text-xs text-[#666666]">
                {event.targetAudience}
              </p>
            </div>
          </div>

          {/* Right Column: Commercial & Organizer Specs */}
          <div className="space-y-4 bg-[#F9F7F7] p-6 rounded-xl border border-[#D8D2C8] text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#133020] border-b border-[#D8D2C8] pb-2">
              Commercial & Organizer Detail
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <span className="text-[10px] uppercase font-bold text-[#666666] block">
                  Organizer
                </span>
                <span className="font-semibold text-[#133020]">
                  {event.organizer}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#666666] block">
                  Est. Attendees
                </span>
                <span className="font-bold text-[#046241]">
                  {event.estimatedAttendees}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#666666] block">
                  Booth / Sponsor Cost
                </span>
                <span className="font-bold text-[#133020]">
                  {event.boothCost}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#666666] block">
                  Registration Deadline
                </span>
                <span className="font-semibold text-[#133020]">
                  {event.registrationDeadline}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#666666] block">
                  Contact Person
                </span>
                <span className="font-semibold text-[#133020]">
                  {event.contactPerson}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-[10px] uppercase font-bold text-[#666666] block">
                  Contact Email
                </span>
                <span className="font-semibold text-[#046241]">
                  {event.contactEmail}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-[10px] uppercase font-bold text-[#666666] block">
                  Exhibitor Opportunities
                </span>
                <span className="text-[#133020]">
                  {event.exhibitorOpportunity}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER & ACTIONS */}
        <div className="p-6 pl-10 bg-[#133020] text-white flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#FFB347] block font-bold">
                Participation Recommendation
              </span>
              <span className="text-lg font-bold text-white">
                {event.participationRec}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {(userRole === "ADMIN" || userRole === "SUPERVISOR") && (
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] font-bold text-xs rounded-lg transition"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Record</span>
              </button>
            )}

            {userRole === "ADMIN" && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#B91C1C] hover:bg-[#B91C1C]/80 text-white font-bold text-xs rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Event Pop-up Modal */}
      <ModalPortal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="bg-[#133020] text-white p-5 px-7 flex items-center justify-between shrink-0 shadow-sm border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFB347] text-[#133020] flex items-center justify-center font-bold shadow-xs">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {locale === "en" ? "Edit Exhibition Record" : "编辑展会记录"}
              </h3>
              <p className="text-[10px] text-[#F5EEDB]/70 uppercase tracking-wider">
                Record #{event?.eventNumber} • {event?.eventName}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowEditModal(false)}
            className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transform hover:rotate-90 transition duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto no-scrollbar">
          <EventForm
            initialData={event}
            isEditing={true}
            onSuccess={() => {
              setShowEditModal(false);
              window.location.reload();
            }}
            onCancel={() => setShowEditModal(false)}
          />
        </div>
      </ModalPortal>
    </div>
  );
}
