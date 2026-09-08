"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Calendar, Filter } from "lucide-react";

interface EventsByMonthProps {
  data: { month: string; count: number; isGap: boolean }[];
}

export function EventsByMonthChart({ data }: EventsByMonthProps) {
  const [rangeFilter, setRangeFilter] = useState("ALL");

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (rangeFilter === "ALL") return data;
    if (rangeFilter === "2026") return data.filter((d) => d.month.includes("2026"));
    if (rangeFilter === "2027") return data.filter((d) => d.month.includes("2027"));
    if (rangeFilter === "H2_2026")
      return data.filter((d) =>
        ["Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026"].includes(d.month)
      );
    return data;
  }, [data, rangeFilter]);

  return (
    <div className="bg-white p-5 rounded-xl border border-[#D8D2C8] shadow-xs">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#133020]">
            Events Distribution by Month
          </h3>
          <p className="text-[11px] text-[#666666]">
            Months with &lt; 5 events highlighted in Saffron
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold flex-wrap">
          {/* Interactive Date Range Filter */}
          <div className="flex items-center gap-1.5 bg-[#F9F7F7] px-2.5 py-1 rounded-lg border border-[#D8D2C8]">
            <Filter className="w-3 h-3 text-[#046241]" />
            <select
              value={rangeFilter}
              onChange={(e) => setRangeFilter(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-[#133020] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Timeframe (2026–2027)</option>
              <option value="2026">Year 2026</option>
              <option value="H2_2026">H2 2026 (Jul–Dec)</option>
              <option value="2027">Year 2027</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#046241] inline-block" />
              <span className="text-[#666666]">Target (≥5)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#FFB347] inline-block" />
              <span className="text-[#C17110]">Gap (&lt;5)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#666666" }}
              axisLine={{ stroke: "#D8D2C8" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#666666" }}
              axisLine={{ stroke: "#D8D2C8" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#133020",
                color: "#FFFFFF",
                borderRadius: "8px",
                fontSize: "12px",
                border: "1px solid #FFB347",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
              labelStyle={{ fontWeight: "bold", color: "#FFB347" }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {filteredData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.count < 5 ? "#FFB347" : "#046241"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
