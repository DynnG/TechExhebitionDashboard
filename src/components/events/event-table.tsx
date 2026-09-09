import Link from "next/link";
import { FitScoreBadge } from "./fit-score-badge";
import { PriorityIndicator } from "./priority-indicator";
import { BusinessLineChip } from "./business-line-chip";
import { Eye, Edit, Trash2, ExternalLink } from "lucide-react";
import { useSession } from "next-auth/react";

interface EventTableProps {
  events: any[];
  onDelete?: (id: number) => void;
}

export function EventTable({ events, onDelete }: EventTableProps) {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "INTERN";

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto rounded-[12px] border border-[#E6E6E6] bg-white shadow-xs font-manrope">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#133020] text-white text-[10.5px] uppercase tracking-[0.08em] font-semibold border-b border-[#133020]">
            <th className="py-3.5 px-4 text-center w-12">#</th>
            <th className="py-3.5 px-4 min-w-[240px]">Event name</th>
            <th className="py-3.5 px-4 min-w-[120px]">Dates</th>
            <th className="py-3.5 px-4 min-w-[140px]">City / Country</th>
            <th className="py-3.5 px-4 min-w-[180px]">Business lines</th>
            <th className="py-3.5 px-4 text-center w-20">Fit</th>
            <th className="py-3.5 px-4 text-center w-24">Priority</th>
            <th className="py-3.5 px-4 min-w-[100px]">Action</th>
            <th className="py-3.5 px-4 text-right min-w-[100px]">Manage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E6E6E6] text-xs text-[#133020]">
          {events.map((evt) => {
            let businessLines: string[] = [];
            try {
              businessLines = JSON.parse(evt.businessLines || "[]");
            } catch {
              businessLines = Array.isArray(evt.businessLines)
                ? evt.businessLines
                : [evt.businessLines];
            }

            return (
              <tr
                key={evt.id}
                className="hover:bg-[#F0F5F2] transition-colors duration-150"
              >
                <td className="py-3 px-4 font-bold text-center text-[#666666]">
                  {evt.eventNumber}
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={`/events/${evt.id}`}
                    className="font-semibold text-[#133020] hover:text-[#046241] transition line-clamp-2"
                  >
                    {evt.eventName}
                  </Link>
                  <span className="text-[11px] text-[#666666] block truncate mt-0.5">
                    {evt.venue}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-[#133020] whitespace-nowrap">
                  {evt.dates}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="font-semibold text-[#133020]">
                    {evt.city}
                  </span>
                  <span className="text-[#666666] block text-[11px]">
                    {evt.country} ({evt.region})
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 flex-wrap">
                    {businessLines.slice(0, 2).map((bl) => (
                      <BusinessLineChip key={bl} name={bl} />
                    ))}
                    {businessLines.length > 2 && (
                      <span className="text-[10px] text-[#666666] font-semibold">
                        +{businessLines.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center">
                    <FitScoreBadge score={evt.fitScore} />
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center">
                    <PriorityIndicator priority={evt.priorityLevel} />
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#046241]/10 text-[#046241] font-semibold text-[11px]">
                    {evt.participationRec}
                  </span>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/events/${evt.id}`}
                      title="View Details"
                      className="p-1.5 text-[#046241] hover:bg-[#046241]/10 rounded transition"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    {(userRole === "ADMIN" || userRole === "SUPERVISOR") && (
                      <Link
                        href={`/events/${evt.id}/edit`}
                        title="Edit Event"
                        className="p-1.5 text-[#133020] hover:bg-[#133020]/10 rounded transition"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    )}
                    {userRole === "ADMIN" && onDelete && (
                      <button
                        onClick={() => onDelete(evt.id)}
                        title="Delete Event"
                        className="p-1.5 text-[#B91C1C] hover:bg-[#B91C1C]/10 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
