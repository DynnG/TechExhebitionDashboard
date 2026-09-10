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
import { useLocaleStore } from "@/stores/locale-store";
import { localizeMonthYear } from "@/lib/i18n/event-localization";

interface EventsByMonthProps {
  data: { month: string; count: number; isGap: boolean }[];
}

const CustomTooltip = ({ active, payload, label, locale }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-[#133020] text-white p-3 rounded-[8px] border border-[#FFB347] shadow-[0_4px_20px_rgba(0,0,0,0.12)] text-xs font-manrope space-y-1">
        <p className="font-semibold text-[#FFB347]">{label}</p>
        <p className="font-medium text-white">
          {locale === "zh" ? "展会数量：" : "Exhibitions: "}<span className="text-[#FFB347] font-bold text-xs">{val}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function EventsByMonthChart({ data }: EventsByMonthProps) {
  const { locale } = useLocaleStore();
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
        const displayMonth = localizeMonthYear(d.month, locale);

        return {
          month: displayMonth,
          rawMonth: d.month,
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
  }, [data, startDate, endDate, locale]);

  const handleResetDates = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="bg-white p-5 rounded-[12px] border-[1.5px] border-[#D8D2C8] shadow-[0_2px_16px_rgba(0,0,0,0.05)] font-manrope">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4 border-b border-[#D8D2C8] pb-3">
        <div>
          <h3 className="text-[14px] font-semibold text-[#133020]">
            {locale === "zh" ? "各月份展会分布" : "Exhibitions distribution by month"}
          </h3>
          <p className="text-[11px] text-[#666666]">
            {locale === "zh"
              ? "目标阈值：每月 ≥ 5 场展会（空缺月份以藏红橙高亮）"
              : "Target threshold: ≥ 5 exhibitions per month (gaps highlighted in Saffron)"}
          </p>
        </div>

        {/* Custom Interactive Date Range Pickers (Month, Day, Year) */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 bg-[#F9F7F7] px-2.5 py-1.5 rounded-[8px] border-[1.5px] border-[#D8D2C8]">
            <Calendar className="w-3.5 h-3.5 text-[#046241]" />
            <span className="font-semibold text-[#133020]">{locale === "zh" ? "起始:" : "From:"}</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#133020] focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[#F9F7F7] px-2.5 py-1.5 rounded-[8px] border-[1.5px] border-[#D8D2C8]">
            <span className="font-semibold text-[#133020]">{locale === "zh" ? "截止:" : "To:"}</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#133020] focus:outline-none cursor-pointer"
            />
          </div>

          {(startDate || endDate) && (
            <button
              onClick={handleResetDates}
              title={locale === "zh" ? "重置日期范围" : "Reset Date Range"}
              className="px-2.5 py-1 text-[#046241] bg-[#046241]/10 hover:bg-[#046241]/20 rounded-[8px] transition flex items-center gap-1 font-semibold text-[11px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{locale === "zh" ? "重置" : "Reset"}</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mb-2 text-xs font-medium">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#046241] inline-block" />
          <span className="text-[#133020]">{locale === "zh" ? "达标 (≥ 5 场展会)" : "Target met (≥ 5 exhibitions)"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#FFB347] inline-block" />
          <span className="text-[#C17110]">{locale === "zh" ? "空缺 (< 5 场展会)" : "Gap (< 5 exhibitions)"}</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#133020", fontWeight: 500 }}
              axisLine={{ stroke: "#D8D2C8" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#133020", fontWeight: 500 }}
              axisLine={{ stroke: "#D8D2C8" }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip locale={locale} />} />
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
