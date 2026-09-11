"use client";

import { useState } from "react";
import { REGIONS, BUSINESS_LINES, PRIORITIES } from "@/lib/constants/business-lines";
import { Search, X, Filter, Plus, ArrowUpDown, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";
import { REGIONS_MAP, BUSINESS_LINES_MAP, PRIORITIES_MAP } from "@/lib/i18n/event-localization";
import { LifewoodDropdown, LifewoodMultiSelectDropdown } from "@/components/shared/lifewood-dropdown";

interface EventFiltersProps {
  filters: {
    region: string;
    businessLine: string;
    fitScore: string;
    priority: string;
    search: string;
    sortBy: string;
  };
  viewMode?: "card" | "table";
  onChange: (key: string, value: string) => void;
  onClear: () => void;
  onAddEvent?: () => void;
}

export function EventFilters({ filters, viewMode = "card", onChange, onClear, onAddEvent }: EventFiltersProps) {
  const { locale, t } = useTranslation();
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Count active non-default filters
  let activeFilterCount = 0;
  if (filters.region !== "ALL") activeFilterCount++;
  if (filters.businessLine !== "ALL") activeFilterCount++;
  if (filters.fitScore !== "ALL") activeFilterCount++;
  if (filters.priority !== "ALL") activeFilterCount++;

  const isFiltered = activeFilterCount > 0 || filters.search !== "";

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

  const sortOptions = [
    { value: "NUMBER_ASC", label: locale === "zh" ? "按编号 1-9 正序" : "By Event # (1-9)" },
    { value: "NUMBER_DESC", label: locale === "zh" ? "按编号 9-1 倒序" : "By Event # (9-1)" },
    { value: "NAME_ASC", label: locale === "zh" ? "按展会名称 (A-Z 首字母)" : "Alphabetical (A-Z)" },
    { value: "NAME_DESC", label: locale === "zh" ? "按展会名称 (Z-A 反序)" : "Alphabetical (Z-A)" },
    { value: "DATE_ASC", label: locale === "zh" ? "按日期 (最近展期)" : "By Date (Earliest)" },
    { value: "DATE_DESC", label: locale === "zh" ? "按日期 (最晚展期)" : "By Date (Latest)" },
    { value: "FIT_DESC", label: locale === "zh" ? "按契合度评分 (从高到低)" : "By Fit Score (High-Low)" },
  ];

  return (
    <div className="bg-[#F5EEDB] dark:bg-[#133020] border-[1.5px] border-[#D8D2C8] dark:border-[#1E4830] rounded-[12px] p-4 sm:px-6 mb-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)] font-manrope space-y-4 transition-colors">
      {/* MAIN TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-[#999999] dark:text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder={t(
              "events.searchPlaceholder",
              "Search event name, city, organizer..."
            )}
            className="w-full pl-9 pr-8 py-2 rounded-[8px] border-[1.5px] border-[#D8D2C8] dark:border-[#235338] bg-white dark:bg-[#1A3D2A] text-xs text-[#133020] dark:text-white placeholder-[#999999] dark:placeholder-slate-400 focus:outline-none focus:border-[#046241] focus:ring-2 focus:ring-[#046241]/15 transition"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange("search", "")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-[#133020] dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls: Filter Toggle Button + Sort Dropdown + Add Event */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Main Filter Panel Toggle Button */}
          <button
            type="button"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[8px] border-[1.5px] text-xs font-bold transition-all shadow-2xs cursor-pointer ${
              showFilterPanel || activeFilterCount > 0
                ? "bg-[#133020] dark:bg-[#046241] text-white border-[#133020] dark:border-[#046241]"
                : "bg-white dark:bg-[#1A3D2A] text-[#133020] dark:text-slate-200 border-[#D8D2C8] dark:border-[#235338] hover:bg-[#F9F7F7]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#FFB347]" />
            <span>{locale === "zh" ? "筛选条件" : "Filter Options"}</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#FFB347] text-[#133020] text-[10px] font-extrabold flex items-center justify-center shrink-0">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showFilterPanel ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Sort Dropdown (Shown in Card View only; Table View uses clickable column headers) */}
          {viewMode !== "table" && (
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#1A3D2A] border-[1.5px] border-[#D8D2C8] dark:border-[#235338] rounded-[8px] px-2.5 py-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#046241] dark:text-[#FFB347] shrink-0" />
              <LifewoodDropdown
                variant="pill"
                value={filters.sortBy || "NUMBER_ASC"}
                onChange={(val) => onChange("sortBy", val)}
                options={sortOptions}
                aria-label="Sort events by"
              />
            </div>
          )}

          {/* Add Event Button */}
          {onAddEvent && (
            <button
              type="button"
              onClick={onAddEvent}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] font-bold text-xs rounded-[8px] transition-all duration-180 shadow-2xs cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t("common.addEvent", "Add event")}</span>
            </button>
          )}
        </div>
      </div>

      {/* EXPANDABLE FILTER OPTIONS PANEL */}
      {showFilterPanel && (
        <div className="p-4 rounded-[10px] bg-white dark:bg-[#1A3D2A] border border-[#D8D2C8] dark:border-[#235338] space-y-4 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#D8D2C8] dark:border-[#235338] pb-2">
            <span className="text-xs font-bold text-[#133020] dark:text-white flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#046241] dark:text-[#FFB347]" />
              <span>{locale === "zh" ? "按类别精准筛选展会" : "Select Filter Dimensions"}</span>
            </span>

            {isFiltered && (
              <button
                type="button"
                onClick={onClear}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t("common.clearFilters", "Clear all filters")}</span>
              </button>
            )}
          </div>

          {/* Filter Dropdowns Grid (Multi-Select Enabled) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] dark:text-slate-300 mb-1">
                {locale === "zh" ? "大区 Region (多选)" : "Region (Multi-Select)"}
              </label>
              <LifewoodMultiSelectDropdown
                value={filters.region}
                onChange={(val) => onChange("region", val)}
                options={regionOptions}
                aria-label="Filter by region"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] dark:text-slate-300 mb-1">
                {locale === "zh" ? "业务线 Business Line (多选)" : "Business Line (Multi-Select)"}
              </label>
              <LifewoodMultiSelectDropdown
                value={filters.businessLine}
                onChange={(val) => onChange("businessLine", val)}
                options={businessLineOptions}
                aria-label="Filter by business line"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] dark:text-slate-300 mb-1">
                {locale === "zh" ? "契合度 Fit Score (多选)" : "Fit Score (Multi-Select)"}
              </label>
              <LifewoodMultiSelectDropdown
                value={filters.fitScore}
                onChange={(val) => onChange("fitScore", val)}
                options={fitScoreOptions}
                aria-label="Filter by fit score"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] dark:text-slate-300 mb-1">
                {locale === "zh" ? "优先级 Priority (多选)" : "Priority (Multi-Select)"}
              </label>
              <LifewoodMultiSelectDropdown
                value={filters.priority}
                onChange={(val) => onChange("priority", val)}
                options={priorityOptions}
                aria-label="Filter by priority"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
