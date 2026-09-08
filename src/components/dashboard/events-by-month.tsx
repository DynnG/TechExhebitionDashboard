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
import { Calendar, RotateCcw } from "lucide-react";

interface EventsByMonthProps {
  data: { month: string; count: number; isGap: boolean }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-[#133020] text-white p-3 rounded-xl border border-[#FFB347] shadow-xl text-xs space-y-1">
        <p className="font-bold text-[#FFB347]">{label}</p>
        <p className="font-semibold text-white">
          Exhibitions: <span className="text-[#FFB347] font-black text-sm">{val}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function EventsByMonthChart({ data }: EventsByMonthProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const formattedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data
      .map((d) => {
        const parts = d.month.split(" ");
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const mIdx = monthNames.indexOf(parts[0]);
        const year = parts[1] || "2026";
        const isoMonth = `${year}-${String(mIdx + 1).padStart(2, "0")}`;

        return {
          month: d.month,
          exhibitions: d.count,
          isGap: d.count < 5,
          isoMonth,
        };
      })
      .filter((d) => {
        if (startDate) {
          const startIso = startDate.substring(0, 7);
          if (d.isoMonth < startIso) return false;
        }
        if (endDate) {
          const endIso = endDate.substring(0, 7);
          if (d.isoMonth > endIso) return false;
        }
        return true;
      });
  }, [data, startDate, endDate]);

  const handleResetDates = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-[#D8D2C8] shadow-xs">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4 border-b border-[#D8D2C8] pb-3">
        <div>
          <h3 className="text-sm font-bold text-[#133020]">
            Exhibitions Distribution by Month
          </h3>
          <p className="text-[11px] text-[#666666]">
            Target threshold: ≥5 exhibitions per month (gaps highlighted in Saffron)
          </p>
        </div>

        {/* Custom Interactive Date Range Pickers (Month, Day, Year) */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 bg-[#F9F7F7] px-2.5 py-1.5 rounded-xl border border-[#D8D2C8] shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-[#046241]" />
            <span className="font-bold text-[#133020]">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#133020] focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[#F9F7F7] px-2.5 py-1.5 rounded-xl border border-[#D8D2C8] shadow-2xs">
            <span className="font-bold text-[#133020]">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#133020] focus:outline-none cursor-pointer"
            />
          </div>

          {(startDate || endDate) && (
            <button
              onClick={handleResetDates}
              title="Reset Date Range"
              className="p-1.5 text-[#046241] bg-[#046241]/10 hover:bg-[#046241]/20 rounded-xl transition flex items-center gap-1 font-bold text-[11px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mb-2 text-xs font-semibold">
        <div className="flex items-center gap-1 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#046241] inline-block" />
          <span className="text-[#133020]">Target Met (≥5 Exhibitions)</span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#FFB347] inline-block" />
          <span className="text-[#C17110]">Gap (&lt;5 Exhibitions)</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#133020", fontWeight: 600 }}
              axisLine={{ stroke: "#D8D2C8" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#133020", fontWeight: 600 }}
              axisLine={{ stroke: "#D8D2C8" }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="exhibitions" radius={[4, 4, 0, 0]}>
              {formattedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.exhibitions < 5 ? "#FFB347" : "#046241"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
