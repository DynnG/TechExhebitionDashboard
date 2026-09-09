import Link from "next/link";
import { AlertCircle, Plus, Sparkles } from "lucide-react";

interface CoverageGapsProps {
  gaps: { month: string; count: number }[];
}

export function CoverageGapsWidget({ gaps }: CoverageGapsProps) {
  return (
    <div className="bg-white dark:bg-[#133020] p-5 rounded-[12px] border-[1.5px] border-[#D8D2C8] dark:border-[#1E4830] shadow-sm flex flex-col justify-between font-manrope transition-colors">
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-[#D8D2C8] dark:border-[#1E4830] pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <h3 className="text-[14px] font-semibold text-emerald-950 dark:text-white">
                Coverage gap assessment
              </h3>
              <p className="text-[11px] text-emerald-800/70 dark:text-slate-400">
                Months with &lt; 5 high-fit exhibition entries requiring sourcing
              </p>
            </div>
          </div>

          <Link
            href="/scraper"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold rounded-[8px] transition-all duration-180 shadow-2xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Run scraper</span>
          </Link>
        </div>

        {gaps.length === 0 ? (
          <div className="py-8 text-center text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-500/10 rounded-[8px] border border-emerald-500/20">
            ✓ All months meet target coverage threshold (≥5 exhibitions)
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {gaps.map((g) => (
              <div
                key={g.month}
                className="p-3 bg-[#F5EEDB] dark:bg-black/20 border border-[#FFB347]/50 dark:border-amber-400/30 rounded-[8px] flex items-center justify-between shadow-2xs hover:border-[#FFB347] transition"
              >
                <div>
                  <span className="text-xs font-semibold text-emerald-950 dark:text-slate-200 block">
                    {g.month}
                  </span>
                  <span className="text-[10px] text-emerald-800/70 dark:text-slate-400 font-medium">
                    {g.count} listed
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-[6px] bg-amber-600 dark:bg-amber-500 text-white text-[10px] font-bold shadow-2xs">
                  +{5 - g.count} needed
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#D8D2C8] dark:border-[#1E4830] flex items-center justify-between text-[11px] text-emerald-800/70 dark:text-slate-400">
        <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Automated scraper pipeline active</span>
        </span>
        <span className="font-medium">Target: ≥ 5 exhibitions / month</span>
      </div>
    </div>
  );
}
