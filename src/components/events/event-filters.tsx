import { REGIONS, BUSINESS_LINES, PRIORITIES } from "@/lib/constants/business-lines";
import { Search, X, Filter } from "lucide-react";
import { useLocaleStore } from "@/stores/locale-store";

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

  const isFiltered =
    filters.region !== "ALL" ||
    filters.businessLine !== "ALL" ||
    filters.fitScore !== "ALL" ||
    filters.priority !== "ALL" ||
    filters.search !== "";

  return (
    <div className="bg-white dark:bg-[#133020] border-[1.5px] border-[#D8D2C8] dark:border-[#1E4830] rounded-[12px] p-4 sm:px-6 mb-6 shadow-sm font-manrope transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-emerald-950 dark:text-slate-200 mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-600 dark:text-amber-400" />
            <span>{locale === "en" ? "Filters:" : "筛选条件:"}</span>
          </div>

          {/* Region */}
          <select
            value={filters.region}
            onChange={(e) => onChange("region", e.target.value)}
            className={`px-3.5 py-1.5 rounded-full border-[1.5px] text-[12.5px] font-medium transition cursor-pointer focus:outline-none ${
              filters.region !== "ALL"
                ? "bg-amber-400 border-amber-400 text-emerald-950 font-bold"
                : "bg-paper dark:bg-black/30 border-[#D8D2C8] dark:border-white/10 text-emerald-950 dark:text-slate-200 hover:border-amber-400"
            }`}
          >
            <option value="ALL">{locale === "en" ? "All regions" : "所有大区"}</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* Business Line */}
          <select
            value={filters.businessLine}
            onChange={(e) => onChange("businessLine", e.target.value)}
            className={`px-3.5 py-1.5 rounded-full border-[1.5px] text-[12.5px] font-medium transition cursor-pointer focus:outline-none ${
              filters.businessLine !== "ALL"
                ? "bg-amber-400 border-amber-400 text-emerald-950 font-bold"
                : "bg-paper dark:bg-black/30 border-[#D8D2C8] dark:border-white/10 text-emerald-950 dark:text-slate-200 hover:border-amber-400"
            }`}
          >
            <option value="ALL">{locale === "en" ? "All business lines" : "所有业务线"}</option>
            {BUSINESS_LINES.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Fit Score */}
          <select
            value={filters.fitScore}
            onChange={(e) => onChange("fitScore", e.target.value)}
            className={`px-3.5 py-1.5 rounded-full border-[1.5px] text-[12.5px] font-medium transition cursor-pointer focus:outline-none ${
              filters.fitScore !== "ALL"
                ? "bg-amber-400 border-amber-400 text-emerald-950 font-bold"
                : "bg-paper dark:bg-black/30 border-[#D8D2C8] dark:border-white/10 text-emerald-950 dark:text-slate-200 hover:border-amber-400"
            }`}
          >
            <option value="ALL">{locale === "en" ? "All fit scores" : "所有适配度"}</option>
            <option value="5">Fit 5 ({locale === "en" ? "Direct fit" : "直接匹配"})</option>
            <option value="4">Fit 4 ({locale === "en" ? "Strong fit" : "高度匹配"})</option>
            <option value="3">Fit 3 ({locale === "en" ? "Moderate fit" : "中度匹配"})</option>
          </select>

          {/* Priority */}
          <select
            value={filters.priority}
            onChange={(e) => onChange("priority", e.target.value)}
            className={`px-3.5 py-1.5 rounded-full border-[1.5px] text-[12.5px] font-medium transition cursor-pointer focus:outline-none ${
              filters.priority !== "ALL"
                ? "bg-amber-400 border-amber-400 text-emerald-950 font-bold"
                : "bg-paper dark:bg-black/30 border-[#D8D2C8] dark:border-white/10 text-emerald-950 dark:text-slate-200 hover:border-amber-400"
            }`}
          >
            <option value="ALL">{locale === "en" ? "All priorities" : "所有优先级"}</option>
            {PRIORITIES.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name} {locale === "en" ? "priority" : "优先级"}
              </option>
            ))}
          </select>

          {isFiltered && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>{locale === "en" ? "Clear all filters" : "重置筛选"}</span>
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] flex-1 max-w-sm">
          <Search className="w-4 h-4 text-emerald-800/50 dark:text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder={locale === "en" ? "Search event name, city, organizer..." : "搜索展会名称、城市、主办方..."}
            className="w-full pl-9 pr-8 py-2 rounded-[8px] border-[1.5px] border-[#D8D2C8] dark:border-white/10 bg-paper dark:bg-black/30 text-xs text-emerald-950 dark:text-slate-100 placeholder:text-emerald-800/40 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
          />
          {filters.search && (
            <button
              onClick={() => onChange("search", "")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
