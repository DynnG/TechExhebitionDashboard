import { REGIONS, BUSINESS_LINES, PRIORITIES } from "@/lib/constants/business-lines";
import { Search, X, Filter } from "lucide-react";
import { useLocaleStore } from "@/stores/locale-store";
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
}

export function EventFilters({ filters, onChange, onClear }: EventFiltersProps) {
  const { locale } = useLocaleStore();

  const activeFiltersCount = [
    filters.region !== "ALL",
    filters.businessLine !== "ALL",
    filters.fitScore !== "ALL",
    filters.priority !== "ALL",
    filters.search !== "",
  ].filter(Boolean).length;

  const regionOptions = [
    { value: "ALL", label: locale === "en" ? "All regions" : "所有大区" },
    ...REGIONS.map((r) => ({ value: r, label: r })),
  ];

  const businessLineOptions = [
    { value: "ALL", label: locale === "en" ? "All business lines" : "所有业务线" },
    ...BUSINESS_LINES.map((b) => ({ value: b.name, label: b.name })),
  ];

  const fitScoreOptions = [
    { value: "ALL", label: locale === "en" ? "All fit scores" : "所有适配度" },
    { value: "5", label: `Fit 5.0 (${locale === "en" ? "Direct fit" : "直接匹配"})` },
    { value: "4", label: `Fit 4.0 (${locale === "en" ? "Strong fit" : "高度匹配"})` },
    { value: "3", label: `Fit 3.0 (${locale === "en" ? "Moderate fit" : "中度匹配"})` },
  ];

  const priorityOptions = [
    { value: "ALL", label: locale === "en" ? "All priorities" : "所有优先级" },
    ...PRIORITIES.map((p) => ({
      value: p.name,
      label: `${p.name} ${locale === "en" ? "priority" : "优先级"}`,
    })),
  ];

  return (
    <div className="bg-white border-[1.5px] border-[#D8D2C8] rounded-2xl p-4 sm:px-6 mb-6 shadow-sm font-manrope">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Dropdown Filters with Section 6.9 Pill Chips */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#133020] mr-1">
            <Filter className="w-4 h-4 text-[#046241]" />
            <span>{locale === "en" ? "Filter Intelligence:" : "智能筛选:"}</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#FFB347] text-[#133020] text-[10px] font-extrabold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
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

          {activeFiltersCount > 0 && (
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#B91C1C] hover:bg-[#B91C1C]/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>{locale === "en" ? "Clear Filters" : "重置筛选"}</span>
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#999999] absolute left-3.5 top-3" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder={locale === "en" ? "Search exhibition name, venue, city..." : "搜索展会名称、展馆、城市..."}
            className="w-full pl-10 pr-8 py-2.5 rounded-xl border-[1.5px] border-[#D8D2C8] bg-[#F9F7F7] text-xs text-[#133020] placeholder-[#999999] focus:outline-none focus:border-[#046241] focus:bg-white focus:ring-2 focus:ring-[#046241]/15 transition font-medium"
          />
          {filters.search && (
            <button
              onClick={() => onChange("search", "")}
              className="absolute right-3 top-3 text-[#999999] hover:text-[#133020]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
