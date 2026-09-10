"use client";

import { useEffect, useState } from "react";
import { History, CheckCircle2, Calendar, ExternalLink, Loader2, Sparkles, Award, Eye, X, MapPin, Building, Globe, Trash2, Ticket, Mail, User as UserIcon, DollarSign, Clock } from "lucide-react";
import { toast } from "sonner";
import { useLocaleStore } from "@/stores/locale-store";
import { FitScoreBadge } from "@/components/events/fit-score-badge";
import { PriorityIndicator } from "@/components/events/priority-indicator";
import { BusinessLineChip } from "@/components/events/business-line-chip";
import { ModalPortal } from "@/components/shared/modal-portal";
import { sanitizeEventUrl } from "@/lib/url";
import { useSession } from "next-auth/react";

export default function HistoryPage() {
  const { locale } = useLocaleStore();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "INTERN";

  const [activeTab, setActiveTab] = useState<"DECISIONS" | "ATTENDED">("DECISIONS");
  const [decisionFilter, setDecisionFilter] = useState<"ALL" | "APPROVED" | "REJECTED">("ALL");

  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModalEvent, setSelectedModalEvent] = useState<any>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Fetch queue decisions
      const resQ = await fetch("/api/queues?status=HISTORY");
      const dataQ = await resQ.json();
      if (resQ.ok) {
        // Filter decisions within 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const items = (dataQ.queueItems || []).filter((item: any) => {
          const itemDate = new Date(item.resolvedAt || item.createdAt);
          return itemDate >= thirtyDaysAgo;
        });

        setHistoryItems(items);
      }

      // Fetch attended events (isAttended = true or participationRec = Exhibit / Attend)
      const resE = await fetch("/api/events?limit=100");
      const dataE = await resE.json();
      if (resE.ok) {
        const attended = (dataE.events || []).filter(
          (e: any) => e.isAttended || e.participationRec === "Exhibit" || e.participationRec === "Attend"
        );
        setAttendedEvents(attended);
      }
    } catch {
      toast.error("Failed to load history log");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeleteAttended = async (id: number, eventName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to remove/delete "${eventName}" from the attended log?`)) return;

    try {
      // Unmark attended or delete if admin
      const res = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAttended: false }),
      });

      if (res.ok) {
        toast.success(`"${eventName}" removed from attended log.`);
        fetchHistory();
      } else {
        toast.error("Failed to update record");
      }
    } catch {
      toast.error("Error removing record");
    }
  };

  return (
    <div className="space-y-6 font-manrope">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D8D2C8] pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#046241]/10 border border-[#046241]/30 flex items-center justify-center text-[#046241]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#133020]">
                {locale === "en" ? "Governance & Attendance History" : "审核与参展历史记录"}
              </h2>
              <p className="text-xs text-[#333333] mt-0.5">
                Historical audit log for supervisor queue decisions (30-day retention) and permanent attended exhibition records
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#D8D2C8] gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab("DECISIONS")}
          className={`pb-3 transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "DECISIONS"
              ? "border-[#046241] text-[#046241]"
              : "border-transparent text-[#666666] hover:text-[#133020]"
          }`}
        >
          <span>Queue Decisions (30-Day Retention)</span>
          <span className="px-2 py-0.5 rounded-full bg-[#133020] text-white text-[10px] font-extrabold">
            {historyItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("ATTENDED")}
          className={`pb-3 transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === "ATTENDED"
              ? "border-[#046241] text-[#046241]"
              : "border-transparent text-[#666666] hover:text-[#133020]"
          }`}
        >
          <span>Attended Exhibitions Log (View & Delete Only)</span>
          <span className="px-2 py-0.5 rounded-full bg-[#046241] text-white text-[10px] font-extrabold">
            {attendedEvents.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#046241]">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <span className="text-xs font-semibold text-[#133020]">
            Loading history records...
          </span>
        </div>
      ) : activeTab === "DECISIONS" ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#F5EEDB] rounded-xl border border-[#D8D2C8] text-xs text-[#133020]">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-[#C17110] shrink-0" />
              <span>
                <strong>30-Day Auto-Clear Policy:</strong> Decisions clear automatically after 30 days. Click any item to inspect full specifications in popup modal.
              </span>
            </div>

            {/* Decision Status Filter Pills */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#D8D2C8] shrink-0">
              <button
                onClick={() => setDecisionFilter("ALL")}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  decisionFilter === "ALL"
                    ? "bg-[#133020] text-white shadow-2xs"
                    : "text-[#666666] hover:text-[#133020]"
                }`}
              >
                All Decisions
              </button>
              <button
                onClick={() => setDecisionFilter("APPROVED")}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  decisionFilter === "APPROVED"
                    ? "bg-[#046241] text-white shadow-2xs"
                    : "text-[#666666] hover:text-[#133020]"
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setDecisionFilter("REJECTED")}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  decisionFilter === "REJECTED"
                    ? "bg-[#B91C1C] text-white shadow-2xs"
                    : "text-[#666666] hover:text-[#133020]"
                }`}
              >
                Rejected
              </button>
            </div>
          </div>

          {historyItems.filter((i) => decisionFilter === "ALL" || i.status === decisionFilter).length === 0 ? (
            <div className="bg-white border-2 border-dashed border-[#D8D2C8] rounded-xl p-12 text-center max-w-md mx-auto my-6 font-manrope">
              <History className="w-12 h-12 text-[#666666] mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#133020] mb-1">
                No decision records found
              </h3>
              <p className="text-xs text-[#666666]">
                No matching queue decisions found for this filter within the past 30 days.
              </p>
            </div>
          ) : (
            /* Minimized Compact Decision Rows */
            <div className="divide-y divide-[#D8D2C8] bg-white rounded-xl border border-[#D8D2C8] overflow-hidden shadow-xs">
              {historyItems
                .filter((i) => decisionFilter === "ALL" || i.status === decisionFilter)
                .map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedModalEvent(item.event)}
                  className="p-3.5 px-4 flex items-center justify-between gap-4 hover:bg-[#F9F7F7] cursor-pointer transition group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
                        item.status === "APPROVED"
                          ? "bg-[#046241] text-white"
                          : "bg-[#B91C1C] text-white"
                      }`}
                    >
                      {item.status}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#133020] group-hover:text-[#046241] truncate">
                          #{item.event?.eventNumber} — {item.event?.eventName}
                        </span>
                        <span className="text-[11px] text-[#666666] shrink-0">
                          · {item.event?.city}, {item.event?.country}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#666666] truncate mt-0.5">
                        Rationale: {item.reason}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-[#666666] hidden sm:inline font-medium">
                      {new Date(item.resolvedAt || item.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedModalEvent(item.event);
                      }}
                      className="p-1.5 rounded-lg bg-[#F5EEDB] text-[#046241] hover:bg-[#046241] hover:text-white transition cursor-pointer"
                      title="Inspect Record Specifications"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ATTENDED EXHIBITIONS TAB — Strictly View Only & Delete Only */
        <div className="space-y-4 font-manrope">
          <div className="p-3.5 bg-[#046241]/10 rounded-xl border border-[#046241]/20 text-xs text-[#046241] flex items-center justify-between font-semibold">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#046241] shrink-0" />
              <span>
                <strong>Attended Registry (View & Delete Only):</strong> Click any exhibition card to view full specifications in popup modal.
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#046241] bg-white px-2.5 py-1 rounded-full border border-[#046241]/30">
              {attendedEvents.length} Verified Logged
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attendedEvents.map((evt) => {
              let businessLines: string[] = [];
              try {
                businessLines = JSON.parse(evt.businessLines || "[]");
              } catch {
                businessLines = Array.isArray(evt.businessLines)
                  ? evt.businessLines
                  : [evt.businessLines];
              }

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedModalEvent(evt)}
                  className="bg-white rounded-xl border-[1.5px] border-[#D8D2C8] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all p-5 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-[#666666]">
                          <span className="font-bold text-[#133020]">#{evt.eventNumber}</span>
                          <span>·</span>
                          <span className="font-medium">{evt.dates}</span>
                        </div>
                        <span className="text-[11px] text-[#666666] font-medium block mt-0.5">
                          {evt.region} · {evt.country}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <FitScoreBadge score={evt.fitScore} size="lg" showLevel />
                      </div>
                    </div>

                    <h3 className="font-bold text-base text-[#133020] group-hover:text-[#046241] transition line-clamp-2 leading-snug">
                      {evt.eventName}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-[#666666] truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#046241] shrink-0" />
                      <span className="truncate">{evt.city}, {evt.country}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {businessLines.slice(0, 2).map((bl) => (
                        <BusinessLineChip key={bl} name={bl} />
                      ))}
                    </div>
                  </div>

                  {/* View & Delete Action Controls Only */}
                  <div className="pt-4 mt-4 border-t border-[#D8D2C8] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-[#046241] font-bold">
                      <CheckCircle2 className="w-4 h-4 text-[#046241]" />
                      <span>Attended</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModalEvent(evt);
                        }}
                        className="px-3 py-1.5 bg-[#F5EEDB] text-[#046241] hover:bg-[#046241] hover:text-white rounded-lg font-bold transition flex items-center gap-1 text-[11px]"
                        title="View Full Specifications"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {(userRole === "ADMIN" || userRole === "SUPERVISOR") && (
                        <button
                          onClick={(e) => handleDeleteAttended(evt.id, evt.eventName, e)}
                          className="px-3 py-1.5 bg-[#B91C1C]/10 text-[#B91C1C] hover:bg-[#B91C1C] hover:text-white rounded-lg font-bold transition flex items-center gap-1 text-[11px]"
                          title="Delete from Attended Registry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Specifications Popup Modal */}
      <ModalPortal isOpen={!!selectedModalEvent} onClose={() => setSelectedModalEvent(null)}>
        <div className="bg-[#133020] text-white p-5 px-7 flex items-center justify-between shrink-0 shadow-sm border-b border-white/10 font-manrope">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFB347] text-[#133020] flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Full Exhibition Specifications
              </h3>
              <p className="text-[10px] text-[#F5EEDB]/70 uppercase tracking-wider">
                Record #{selectedModalEvent?.eventNumber} · {selectedModalEvent?.eventName}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedModalEvent(null)}
            className="p-2 rounded-xl bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transform hover:rotate-90 transition duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 bg-white max-h-[82vh] overflow-y-auto space-y-6 text-xs font-manrope">
          {selectedModalEvent && (
            <>
              {/* Header Title & Score */}
              <div className="flex items-start justify-between gap-4 border-b border-[#D8D2C8] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#133020]">
                      Record #{selectedModalEvent.eventNumber} · {selectedModalEvent.region}
                    </span>
                    {selectedModalEvent.isAttended && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#046241] text-white font-extrabold text-[10px]">
                        ✓ Attended
                      </span>
                    )}
                  </div>
                  <h4 className="text-2xl font-bold text-[#133020] leading-tight">
                    {selectedModalEvent.eventName}
                  </h4>
                  <p className="text-xs text-[#666666]">
                    📍 {selectedModalEvent.city}, {selectedModalEvent.country}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <PriorityIndicator priority={selectedModalEvent.priorityLevel} />
                  <FitScoreBadge score={selectedModalEvent.fitScore} size="xl" showLevel />
                </div>
              </div>

              {/* Logistics & Primary Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F9F7F7] p-5 rounded-2xl border border-[#D8D2C8]">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">Dates</span>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-[#133020]">
                    <Calendar className="w-4 h-4 text-[#046241]" />
                    <span>{selectedModalEvent.dates}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">Venue Name</span>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-[#133020]">
                    <Building className="w-4 h-4 text-[#046241]" />
                    <span>{selectedModalEvent.venue || "Not disclosed"}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">Organizer</span>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-[#133020]">
                    <UserIcon className="w-4 h-4 text-[#046241]" />
                    <span>{selectedModalEvent.organizer || "Not disclosed"}</span>
                  </div>
                </div>
              </div>

              {/* Business Lines & Official Website CTA */}
              <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl border border-[#D8D2C8] bg-white">
                <div>
                  <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block mb-1.5">Business Lines Alignment</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(() => {
                      let lines: string[] = [];
                      try {
                        lines = JSON.parse(selectedModalEvent.businessLines || "[]");
                      } catch {
                        lines = Array.isArray(selectedModalEvent.businessLines)
                          ? selectedModalEvent.businessLines
                          : [selectedModalEvent.businessLines];
                      }
                      return lines.map((bl) => <BusinessLineChip key={bl} name={bl} />);
                    })()}
                  </div>
                </div>

                {(() => {
                  let firstSource: string | null = null;
                  try {
                    const parsed = JSON.parse(selectedModalEvent.sourceLinks || "[]");
                    firstSource = Array.isArray(parsed) ? parsed[0] : null;
                  } catch {
                    firstSource = selectedModalEvent.sourceLinks || null;
                  }

                  const validUrl = sanitizeEventUrl(selectedModalEvent.officialWebsite, firstSource);
                  if (!validUrl) return null;

                  return (
                    <a
                      href={validUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-xs"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Visit Official Website ↗</span>
                    </a>
                  );
                })()}
              </div>

              {/* Strategic Analysis & Relevance */}
              <div className="space-y-3">
                <div className="bg-[#F0F5F2] p-4 rounded-xl border border-[#046241]/20 space-y-1">
                  <span className="text-[10px] text-[#046241] font-extrabold uppercase tracking-wider block">Relevance to Lifewood</span>
                  <p className="text-xs text-[#133020] leading-relaxed font-medium">{selectedModalEvent.relevanceToLifewood || selectedModalEvent.strategicFocus || "Strategic buyer alignment"}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#F9F7F7] p-4 rounded-xl border border-[#D8D2C8] space-y-1">
                    <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">Target Audience</span>
                    <p className="text-xs font-semibold text-[#133020]">{selectedModalEvent.targetAudience || "Enterprise buyers"}</p>
                  </div>

                  <div className="bg-[#F9F7F7] p-4 rounded-xl border border-[#D8D2C8] space-y-1">
                    <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider block">Participation Recommendation</span>
                    <span className="inline-block px-3 py-1 bg-[#FFB347] text-[#133020] font-bold text-xs rounded-lg">
                      {selectedModalEvent.participationRec || "Exhibit"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary Details Table */}
              <div className="bg-[#F9F7F7] p-4 rounded-xl border border-[#D8D2C8] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-[#666666] font-bold uppercase block">Attendees</span>
                  <span className="font-bold text-[#133020]">{selectedModalEvent.estimatedAttendees || "Not disclosed"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666666] font-bold uppercase block">Booth Cost</span>
                  <span className="font-bold text-[#133020]">{selectedModalEvent.boothCost || "Not disclosed"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666666] font-bold uppercase block">Opportunity</span>
                  <span className="font-bold text-[#133020]">{selectedModalEvent.exhibitorOpportunity || "Not disclosed"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#666666] font-bold uppercase block">Deadline</span>
                  <span className="font-bold text-[#133020]">{selectedModalEvent.registrationDeadline || "Not disclosed"}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </ModalPortal>
    </div>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}