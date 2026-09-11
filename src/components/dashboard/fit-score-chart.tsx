"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useLocaleStore } from "@/stores/locale-store";
import { localizeFitScoreName } from "@/lib/i18n/event-localization";

interface FitScoreChartProps {
  data: { name: string; count: number; color: string }[];
}

const CustomTooltip = ({ active, payload, locale }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#133020] text-white px-3 py-2 rounded-[8px] border border-[#FFB347] shadow-[0_4px_20px_rgba(0,0,0,0.12)] text-xs font-manrope">
        <p className="font-semibold text-[#FFB347] mb-0.5">{data.name}</p>
        <p className="text-white font-medium">
          {data.value} {locale === "zh" ? "???" : "exhibitions"}
        </p>
      </div>
    );
  }
  return null;
};

export function FitScoreChart({ data }: FitScoreChartProps) {
  const { locale } = useLocaleStore();
  const total = (data || []).reduce((acc, curr) => acc + curr.count, 0);

  const localizedData = useMemo(() => {
    return (data || []).map((item) => ({
      ...item,
      name: localizeFitScoreName(item.name, locale),
      rawName: item.name,
    }));
  }, [data, locale]);

  /**
   * External label renderer: short connector line + category + value outside donut.
   * For Fit Score: shows "Fit 5" / "Fit 4" / "Fit 3" with count on next line.
   */
  const renderExternalLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    value,
    percent,
    index,
  }: any) => {
    if (!value || percent < 0.04) return null;

    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);

    const x1 = cx + (outerRadius + 4) * cos;
    const y1 = cy + (outerRadius + 4) * sin;
    const x2 = cx + (outerRadius + 18) * cos;
    const y2 = cy + (outerRadius + 18) * sin;
    const lx = cx + (outerRadius + 26) * cos;
    const ly = cy + (outerRadius + 26) * sin;

    const anchor = cos > 0.1 ? "start" : cos < -0.1 ? "end" : "middle";

    const rawName = localizedData[index]?.rawName ?? "";
    // Extract short score badge: "Fit 5", "Fit 4", "Fit 3"
    const scoreLabel = rawName.startsWith("Fit") ? rawName.slice(0, 5) : rawName;

    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#AAAAAA" strokeWidth={1} strokeLinecap="round" />
        <text
          x={lx}
          y={ly - 5}
          textAnchor={anchor}
          dominantBaseline="central"
          fontSize={10}
          fontWeight={600}
          fill="#666666"
          style={{ userSelect: "none", pointerEvents: "none" }}
        >
          {scoreLabel}
        </text>
        <text
          x={lx}
          y={ly + 7}
          textAnchor={anchor}
          dominantBaseline="central"
          fontSize={12}
          fontWeight={700}
          fill="#133020"
          style={{ userSelect: "none", pointerEvents: "none" }}
        >
          {value}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white p-5 rounded-[12px] border-[1.5px] border-[#D8D2C8] shadow-[0_2px_16px_rgba(0,0,0,0.05)] font-manrope h-[400px] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[#D8D2C8] pb-3 mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-[#133020]">
              {locale === "zh" ? "???????" : "Fit score distribution"}
            </h3>
            <p className="text-[11px] text-[#666666]">
              {locale === "zh" ? "????????????" : "Alignment threshold evaluation across verified records"}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#046241] bg-[#046241]/10 px-2.5 py-1 rounded-full">
            {locale === "zh" ? `??? ${total} ?` : `${total} total scored`}
          </span>
        </div>

        <div className="h-56 w-full [&_*:focus]:outline-none [&_path]:outline-none relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart style={{ outline: "none" }}>
              <Pie
                data={localizedData}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={72}
                paddingAngle={3}
                dataKey="count"
                nameKey="name"
                style={{ outline: "none" }}
                label={renderExternalLabel}
                labelLine={false}
              >
                {localizedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{ outline: "none", cursor: "pointer" }}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip locale={locale} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Structured Legend Grid */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#D8D2C8] text-xs">
        {localizedData.map((item) => (
          <div key={item.rawName} className="flex flex-col items-center text-center p-1.5 rounded-[6px] bg-[#F9F7F7]">
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-[3px] inline-block shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] font-medium text-[#133020] truncate">
                {item.name}
              </span>
            </div>
            <span className="text-[14px] font-bold text-[#133020] leading-none">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
