"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FitScoreBadge } from "./fit-score-badge";
import { PriorityIndicator } from "./priority-indicator";
import { BusinessLineChip } from "./business-line-chip";
import { Eye, Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
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
  const userRole = (session?.user as any)?.role || "INTERN";
  const { locale, t } = useTranslation();

  const [sortKey, setSortKey] = useState<string>("eventNumber");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleHeaderClick = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedEvents = useMemo(() => {
    const list = (events || []).map((evt) => localizeEvent(evt, locale));

    return list.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (sortKey === "eventNumber" || sortKey === "fitScore") {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal || "").toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [events, locale, sortKey, sortDirection]);

  if (!sortedEvents || sortedEvents.length === 0) {
    return null;
  }

  const renderSortIcon = (key: string) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="w-3 h-3 text-white/50 opacity-0 group-hover:opacity-100 transition" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-[#FFB347]" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[#FFB347]" />
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-[12px] border-[1.5px] border-[#D8D2C8] dark:border-[#1E4830] bg-white dark:bg-[#133020] shadow-[0_2px_16px_rgba(0,0,0,0.05)] font-manrope">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#133020] text-white text-[10.5px] uppercase tracking-[0.08em] font-semibold border-b border-[#133020]">
            <th
              onClick={() => handleHeaderClick("eventNumber")}
              className="py-3.5 px-4 text-center w-16 cursor-pointer select-none group hover:text-[#FFB347] transition"
              title={locale === "zh" ? "按编号排序" : "Sort by Event #"}
            >
              <div className="flex items-center justify-center gap-1">
                <span>{t("events.table.hash", "#")}</span>
                {renderSortIcon("eventNumber")}
              </div>
            </th>
            <th
              onClick={() => handleHeaderClick("eventName")}
              className="py-3.5 px-4 min-w-[240px] cursor-pointer select-none group hover:text-[#FFB347] transition"
              title={locale === "zh" ? "按展会名称排序" : "Sort by Event Name"}
            >
              <div className="flex items-center gap-1.5">
                <span>{t("events.table.eventName", "Event name")}</span>
                {renderSortIcon("eventName")}
              </div>
            </th>
            <th
              onClick={() => handleHeaderClick("dates")}
              className="py-3.5 px-4 min-w-[120px] cursor-pointer select-none group hover:text-[#FFB347] transition"
              title={locale === "zh" ? "按日期排序" : "Sort by Dates"}
            >
              <div className="flex items-center gap-1.5">
                <span>{t("events.table.dates", "Dates")}</span>
                {renderSortIcon("dates")}
              </div>
            </th>
            <th
              onClick={() => handleHeaderClick("city")}
              className="py-3.5 px-4 min-w-[140px] cursor-pointer select-none group hover:text-[#FFB347] transition"
              title={locale === "zh" ? "按城市/国家排序" : "Sort by City / Country"}
            >
              <div className="flex items-center gap-1.5">
                <span>{t("events.table.cityCountry", "City / Country")}</span>
                {renderSortIcon("city")}
              </div>
            </th>
            <th className="py-3.5 px-4 min-w-[180px]">
              {t("events.table.businessLines", "Business lines")}
            </th>
            <th
              onClick={() => handleHeaderClick("fitScore")}
              className="py-3.5 px-4 text-center w-20 cursor-pointer select-none group hover:text-[#FFB347] transition"
              title={locale === "zh" ? "按契合度评分排序" : "Sort by Fit Score"}
            >
              <div className="flex items-center justify-center gap-1">
                <span>{t("events.table.fit", "Fit")}</span>
                {renderSortIcon("fitScore")}
              </div>
            </th>
            <th
              onClick={() => handleHeaderClick("priorityLevel")}
              className="py-3.5 px-4 text-center w-24 cursor-pointer select-none group hover:text-[#FFB347] transition"
              title={locale === "zh" ? "按优先级排序" : "Sort by Priority"}
            >
              <div className="flex items-center justify-center gap-1">
                <span>{t("events.table.priority", "Priority")}</span>
                {renderSortIcon("priorityLevel")}
              </div>
            </th>
            <th className="py-3.5 px-4 min-w-[100px]">
              {t("events.table.action", "Action")}
            </th>
            <th className="py-3.5 px-4 text-right min-w-[100px]">
              {t("events.table.manage", "Manage")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#D8D2C8] dark:divide-[#1E4830] text-xs text-[#133020] dark:text-slate-100">
          {sortedEvents.map((evt) => {
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
                className="hover:bg-[#F0F5F2] dark:hover:bg-[#1A3D2A] transition-colors duration-150"
              >
                <td className="py-3 px-4 font-bold text-center text-[#666666] dark:text-slate-400">
                  {evt.eventNumber}
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={`/events/${evt.id}`}
                    className="font-bold text-[#133020] dark:text-white hover:text-[#046241] dark:hover:text-[#FFB347] transition line-clamp-2"
                  >
                    {evt.eventName}
                  </Link>
                  <span className="text-[11px] text-[#666666] dark:text-slate-400 block truncate mt-0.5">
                    {evt.venue}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-[#133020] dark:text-slate-200 whitespace-nowrap">
                  {evt.dates}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="font-semibold text-[#133020] dark:text-white block">
                    {evt.city}
                  </span>
                  <span className="text-[#666666] dark:text-slate-400 block text-[11px]">
                    {evt.country} ({evt.region})
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 flex-wrap">
                    {businessLines.slice(0, 2).map((bl) => (
                      <BusinessLineChip key={bl} name={bl} />
                    ))}
                    {businessLines.length > 2 && (
                      <span className="text-[10px] text-[#666666] dark:text-slate-400 font-semibold">
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
                  <span className="inline-block px-2.5 py-1 rounded-[6px] bg-[#FFB347]/30 text-[#133020] dark:text-slate-100 font-semibold text-[11px]">
                    {evt.participationRec}
                  </span>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/events/${evt.id}`}
                      title={locale === "zh" ? "查看详情" : "View Details"}
                      className="p-1.5 text-[#046241] dark:text-[#FFB347] hover:bg-[#046241]/10 rounded transition"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    {(userRole === "ADMIN" || userRole === "SUPERVISOR") && (
                      onEdit ? (
                        <button
                          type="button"
                          onClick={() => {
                            const original = events.find((e: any) => e.id === evt.id) || evt;
                            onEdit(original);
                          }}
                          title={locale === "zh" ? "编辑展会" : "Edit Event"}
                          className="p-1.5 text-[#133020] dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/10 rounded transition cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      ) : (
                        <Link
                          href={`/events/${evt.id}/edit`}
                          title={locale === "zh" ? "编辑展会" : "Edit Event"}
                          className="p-1.5 text-[#133020] dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/10 rounded transition"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      )
                    )}
                    {userRole === "ADMIN" && onDelete && (
                      <button
                        onClick={() => onDelete(evt.id)}
                        title={locale === "zh" ? "删除展会" : "Delete Event"}
                        className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded transition cursor-pointer"
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
