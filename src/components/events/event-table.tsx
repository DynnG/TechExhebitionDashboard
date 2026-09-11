"use client";

import { useMemo } from "react";
import Link from "next/link";
import { FitScoreBadge } from "./fit-score-badge";
import { PriorityIndicator } from "./priority-indicator";
import { BusinessLineChip } from "./business-line-chip";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/lib/i18n/use-translation";
import { localizeEvent } from "@/lib/i18n/event-localization";

interface EventTableProps {
  events: any[];
  onDelete?: (id: number) => void;
  onEdit?: (event: any) => void;
}

export function EventTable({ events, onDelete, onEdit }: EventTableProps) {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "USER";
  const { locale, t } = useTranslation();

  const localizedEvents = useMemo(() => {
    return (events || []).map((evt) => localizeEvent(evt, locale));
  }, [events, locale]);

  if (!localizedEvents || localizedEvents.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto rounded-[12px] border-[1.5px] border-[#D8D2C8] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)] font-manrope">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#133020] text-white text-[10.5px] uppercase tracking-[0.08em] font-semibold border-b border-[#133020]">
            <th className="py-3.5 px-4 text-center w-12">
              {t("events.table.hash", "#")}
            </th>
            <th className="py-3.5 px-4 min-w-[240px]">
              {t("events.table.eventName", "Event name")}
            </th>
            <th className="py-3.5 px-4 min-w-[120px]">
              {t("events.table.dates", "Dates")}
            </th>
            <th className="py-3.5 px-4 min-w-[140px]">
              {t("events.table.cityCountry", "City / Country")}
            </th>
            <th className="py-3.5 px-4 min-w-[180px]">
              {t("events.table.businessLines", "Business lines")}
            </th>
            <th className="py-3.5 px-4 text-center w-20">
              {t("events.table.fit", "Fit")}
            </th>
            <th className="py-3.5 px-4 text-center w-24">
              {t("events.table.priority", "Priority")}
            </th>
            <th className="py-3.5 px-4 min-w-[100px]">
              {t("events.table.action", "Action")}
            </th>
            <th className="py-3.5 px-4 text-right min-w-[100px]">
              {t("events.table.manage", "Manage")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#D8D2C8] text-xs text-[#133020]">
          {localizedEvents.map((evt) => {
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
                  <span className="inline-block px-2.5 py-1 rounded-[6px] bg-[#FFB347]/30 text-[#133020] font-semibold text-[11px]">
                    {evt.participationRec}
                  </span>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/events/${evt.id}`}
                      title={locale === "zh" ? "查看详情" : "View Details"}
                      className="p-1.5 text-[#046241] hover:bg-[#046241]/10 rounded transition"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    {(userRole === "SUPERADMIN" || userRole === "ADMIN") && (
                      onEdit ? (
                        <button
                          type="button"
                          onClick={() => {
                            const original = events.find((e: any) => e.id === evt.id) || evt;
                            onEdit(original);
                          }}
                          title={locale === "zh" ? "编辑展会" : "Edit Event"}
                          className="p-1.5 text-[#133020] hover:bg-black/10 rounded transition cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      ) : (
                        <Link
                          href={`/events/${evt.id}/edit`}
                          title={locale === "zh" ? "编辑展会" : "Edit Event"}
                          className="p-1.5 text-[#133020] hover:bg-black/10 rounded transition"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      )
                    )}
                    {userRole === "SUPERADMIN" && onDelete && (
                      <button
                        onClick={() => onDelete(evt.id)}
                        title={locale === "zh" ? "删除展会" : "Delete Event"}
                        className="p-1.5 text-rose-600 hover:bg-rose-500/10 rounded transition"
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
