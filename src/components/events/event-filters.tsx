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
    { value: "5", label: `Fit 5 (${locale === "en" ? "Direct fit" : "直接匹配"})` },
    { value: "4", label: `Fit 4 (${locale === "en" ? "Strong fit" : "高度匹配"})` },
    { value: "3", label: `Fit 3 (${locale === "en" ? "Moderate fit" : "中度匹配"})` },
  ];

  const priorityOptions = [
    { value: "ALL", label: locale === "en" ? "All priorities" : "所有优先级" },
    ...PRIORITIES.map((p) => ({
      value: p.name,
      label: `${p.name} ${locale === "en" ? "priority" : "优先级"}`,
    })),
  ];

  return (
<<<<<<< HEAD
    <div className="bg-[#F5EEDB] border-[1.5px] border-[#D8D2C8] rounded-[12px] p-4 sm:px-6 mb-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)] font-manrope">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Dropdown Filters with Section 6.9 Pill Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#133020] mr-1">
            <Filter className="w-3.5 h-3.5 text-[#046241]" />
            <span>{locale === "en" ? "Filters:" : "筛选条件:"}</span>
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
=======
    <div className="bg-white border-[1.5px] border-[#D8D2C8] rounded-2xl p-4 sm:px-6 mb-6 shadow-sm font-manrope transition-all">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Dropdown Filters with Badges & Visual Polish */}
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
          <div className="relative">
            <select
              value={filters.region}
              onChange={(e) => onChange("region", e.target.value)}
              className={`px-3.5 py-2 rounded-xl border-[1.5px] text-xs font-semibold transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#046241]/20 ${
                filters.region !== "ALL"
                  ? "bg-[#133020] border-[#133020] text-white"
                  : "bg-[#F9F7F7] border-[#D8D2C8] text-[#133020] hover:border-[#046241]"
              }`}
            >
              <option value="ALL">{locale === "en" ? "All Regions" : "所有大区"}</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Business Line */}
          <div className="relative">
            <select
              value={filters.businessLine}
              onChange={(e) => onChange("businessLine", e.target.value)}
              className={`px-3.5 py-2 rounded-xl border-[1.5px] text-xs font-semibold transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#046241]/20 ${
                filters.businessLine !== "ALL"
                  ? "bg-[#133020] border-[#133020] text-white"
                  : "bg-[#F9F7F7] border-[#D8D2C8] text-[#133020] hover:border-[#046241]"
              }`}
            >
              <option value="ALL">{locale === "en" ? "All Business Lines" : "所有业务线"}</option>
              {BUSINESS_LINES.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fit Score */}
          <div className="relative">
            <select
              value={filters.fitScore}
              onChange={(e) => onChange("fitScore", e.target.value)}
              className={`px-3.5 py-2 rounded-xl border-[1.5px] text-xs font-semibold transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#046241]/20 ${
                filters.fitScore !== "ALL"
                  ? "bg-[#133020] border-[#133020] text-white"
                  : "bg-[#F9F7F7] border-[#D8D2C8] text-[#133020] hover:border-[#046241]"
              }`}
            >
              <option value="ALL">{locale === "en" ? "All Fit Scores" : "所有适配度"}</option>
              <option value="5">Fit 5.0 ({locale === "en" ? "Direct Strategic Fit" : "直接战略匹配"})</option>
              <option value="4">Fit 4.0 ({locale === "en" ? "Strong Fit" : "高度匹配"})</option>
              <option value="3">Fit 3.0 ({locale === "en" ? "Moderate Fit" : "中度匹配"})</option>
            </select>
          </div>

          {/* Priority */}
          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) => onChange("priority", e.target.value)}
              className={`px-3.5 py-2 rounded-xl border-[1.5px] text-xs font-semibold transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#046241]/20 ${
                filters.priority !== "ALL"
                  ? "bg-[#133020] border-[#133020] text-white"
                  : "bg-[#F9F7F7] border-[#D8D2C8] text-[#133020] hover:border-[#046241]"
              }`}
            >
              <option value="ALL">{locale === "en" ? "All Priorities" : "所有优先级"}</option>
              {PRIORITIES.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} {locale === "en" ? "Priority" : "优先级"}
                </option>
              ))}
            </select>
          </div>
>>>>>>> b62534b (feat: event attendance, enlarged fit score badges, bento filter system, queues/history/users UI redesign, and sticky header blur)

          {activeFiltersCount > 0 && (
            <button
              onClick={onClear}
<<<<<<< HEAD
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium text-[#B91C1C] hover:bg-[#B91C1C]/10 transition"
=======
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#B91C1C] hover:bg-[#B91C1C]/10 transition"
>>>>>>> b62534b (feat: event attendance, enlarged fit score badges, bento filter system, queues/history/users UI redesign, and sticky header blur)
            >
              <X className="w-4 h-4" />
              <span>{locale === "en" ? "Clear Filters" : "重置筛选"}</span>
            </button>
          )}
        </div>

        {/* Search Input */}
<<<<<<< HEAD
        <div className="relative min-w-[260px] flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#999999] absolute left-3.5 top-2.5" />
=======
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#999999] absolute left-3.5 top-3" />
>>>>>>> b62534b (feat: event attendance, enlarged fit score badges, bento filter system, queues/history/users UI redesign, and sticky header blur)
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
<<<<<<< HEAD
            placeholder={locale === "en" ? "Search event name, city, organizer..." : "搜索展会名称、城市、主办方..."}
            className="w-full pl-9 pr-8 py-2 rounded-[8px] border-[1.5px] border-[#D8D2C8] bg-white text-xs text-[#133020] placeholder-[#999999] focus:outline-none focus:border-[#046241] focus:ring-2 focus:ring-[#046241]/15 transition"
=======
            placeholder={locale === "en" ? "Search exhibition name, venue, city..." : "搜索展会名称、展馆、城市..."}
            className="w-full pl-10 pr-8 py-2.5 rounded-xl border-[1.5px] border-[#D8D2C8] bg-[#F9F7F7] text-xs text-[#133020] placeholder-[#999999] focus:outline-none focus:border-[#046241] focus:bg-white focus:ring-2 focus:ring-[#046241]/15 transition font-medium"
>>>>>>> b62534b (feat: event attendance, enlarged fit score badges, bento filter system, queues/history/users UI redesign, and sticky header blur)
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
