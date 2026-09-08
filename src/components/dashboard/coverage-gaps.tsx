import Link from "next/link";
import { AlertCircle, Plus, Calendar } from "lucide-react";

interface CoverageGapsProps {
  gaps: { month: string; count: number }[];
}

export function CoverageGapsWidget({ gaps }: CoverageGapsProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-[#D8D2C8] shadow-xs">
      <div className="flex items-center justify-between mb-3 border-b border-[#D8D2C8] pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-[#C17110]" />
          <div>
            <h3 className="text-sm font-bold text-[#133020]">
              Coverage Gap Assessment
            </h3>
            <p className="text-[11px] text-[#666666]">
              Months with &lt; 5 high-fit exhibition entries requiring sourcing
            </p>
          </div>
        </div>

        <Link
          href="/scraper"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] text-xs font-semibold rounded-lg transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Run Scraper</span>
        </Link>
      </div>

      {gaps.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#046241] font-semibold">
          ✓ All months meet target coverage threshold (≥5 events)
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {gaps.map((g) => (
            <div
              key={g.month}
              className="p-3 bg-[#FFB347]/15 border border-[#FFB347]/40 rounded-lg flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-[#133020] block">
                  {g.month}
                </span>
                <span className="text-[10px] text-[#C17110] font-semibold">
                  {g.count} {g.count === 1 ? "event" : "events"} listed
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#C17110] text-white text-[10px] font-bold">
                Need {5 - g.count}+
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
