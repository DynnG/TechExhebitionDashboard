"use client";

import { REGIONS, BUSINESS_LINES, PRIORITIES } from "@/lib/constants/business-lines";
import { Search, X, Filter, Plus } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";
import { REGIONS_MAP, BUSINESS_LINES_MAP, PRIORITIES_MAP } from "@/lib/i18n/event-localization";
import { LifewoodDropdown } from "@/components/shared/lifewood-dropdown";

interface EventFiltersProps {
  filters: {
    region: string;
    businessLine: string;
    fitScore: string;
    priority: string;
    search: string;
  };
  onChange: (key: string, value: string) => void;
  onClear: () => void;
  onAddEvent?: () => void;
}

export function EventFilters({ filters, onChange, onClear, onAddEvent }: EventFiltersProps) {
  const { locale, t } = useTranslation();

  const isFiltered =
    filters.region !== "ALL" ||
    filters.businessLine !== "ALL" ||
    filters.fitScore !== "ALL" ||
    filters.priority !== "ALL" ||
    filters.search !== "";

  const regionOptions = [
    { value: "ALL", label: locale === "zh" ? "所有大区" : "All regions" },
    ...REGIONS.map((r) => ({
      value: r,
      label: locale === "zh" ? REGIONS_MAP[r] || r : r,
    })),
  ];

  const businessLineOptions = [
    { value: "ALL", label: locale === "zh" ? "所有业务线" : "All business lines" },
    ...BUSINESS_LINES.map((b) => ({
      value: b.name,
      label: locale === "zh" ? BUSINESS_LINES_MAP[b.name] || b.name : b.name,
    })),
  ];

  const fitScoreOptions = [
    { value: "ALL", label: locale === "zh" ? "所有适配度" : "All fit scores" },
    { value: "5", label: locale === "zh" ? "Fit 5 (直接匹配)" : "Fit 5 (Direct fit)" },
    { value: "4", label: locale === "zh" ? "Fit 4 (高度匹配)" : "Fit 4 (Strong fit)" },
    { value: "3", label: locale === "zh" ? "Fit 3 (中度匹配)" : "Fit 3 (Moderate fit)" },
  ];

  const priorityOptions = [
    { value: "ALL", label: locale === "zh" ? "所有优先级" : "All priorities" },
    ...PRIORITIES.map((p) => ({
      value: p.name,
      label:
        locale === "zh"
          ? `${PRIORITIES_MAP[p.name] || p.name}优先级`
          : `${p.name} priority`,
    })),
  ];

  return (
    <div className="bg-[#F5EEDB] border-[1.5px] border-[#D8D2C8] rounded-[12px] p-4 sm:px-6 mb-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)] font-manrope">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Dropdown Filters with Section 6.9 Pill Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#133020] mr-1">
            <Filter className="w-3.5 h-3.5 text-[#046241]" />
            <span>{t("common.filters", "Filters:")}</span>
          </div>

          {/* Region */}
          <LifewoodDropdown
            variant="pill"
            value={filters.region}
            onChange={(val) => onChange("region", val)}
            options={regionOptions}
            isActivePill={filters.region !== "ALL"}
            aria-label="Filter by region"
          />

          {/* Business Line */}
          <LifewoodDropdown
            variant="pill"
            value={filters.businessLine}
            onChange={(val) => onChange("businessLine", val)}
            options={businessLineOptions}
            isActivePill={filters.businessLine !== "ALL"}
            aria-label="Filter by business line"
          />

          {/* Fit Score */}
          <LifewoodDropdown
            variant="pill"
            value={filters.fitScore}
            onChange={(val) => onChange("fitScore", val)}
            options={fitScoreOptions}
            isActivePill={filters.fitScore !== "ALL"}
            aria-label="Filter by fit score"
          />

          {/* Priority */}
          <LifewoodDropdown
            variant="pill"
            value={filters.priority}
            onChange={(val) => onChange("priority", val)}
            options={priorityOptions}
            isActivePill={filters.priority !== "ALL"}
            aria-label="Filter by priority"
          />

          {isFiltered && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium text-[#B91C1C] hover:bg-[#B91C1C]/10 transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t("common.clearFilters", "Clear all filters")}</span>
            </button>
          )}
        </div>

        {/* Search Input + Add Event (same bar) */}
        <div className="flex items-center gap-2.5 flex-1 min-w-[260px] max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#999999] absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onChange("search", e.target.value)}
              placeholder={t(
                "events.searchPlaceholder",
                "Search event name, city, organizer..."
              )}
              className="w-full pl-9 pr-8 py-2 rounded-[8px] border-[1.5px] border-[#D8D2C8] bg-white text-xs text-[#133020] placeholder-[#999999] focus:outline-none focus:border-[#046241] focus:ring-2 focus:ring-[#046241]/15 transition"
            />
            {filters.search && (
              <button
                onClick={() => onChange("search", "")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-[#133020]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {onAddEvent && (
            <button
              onClick={onAddEvent}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] font-medium text-xs rounded-[8px] transition-all duration-180 shadow-2xs cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t("common.addEvent", "Add event")}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}