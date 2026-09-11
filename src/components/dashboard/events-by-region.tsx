"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useLocaleStore } from "@/stores/locale-store";
import { localizeRegionName } from "@/lib/i18n/event-localization";

interface EventsByRegionProps {
  data: { region: string; count: number }[];
}

const COLORS = ["#FFB347", "#046241", "#C17110", "#E89131", "#417256", "#708E7C", "#FFC370"];

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

const renderExternalLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  value,
  percent,
}: any) => {
  if (!value || percent < 0.03) return null;

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

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#AAAAAA" strokeWidth={1} strokeLinecap="round" />
      <text
        x={lx}
        y={ly}
        textAnchor={anchor}
        dominantBaseline="central"
        fontSize={11}
        fontWeight={700}
        fill="#133020"
        style={{ userSelect: "none", pointerEvents: "none" }}
      >
        {value}
      </text>
    </g>
  );
};

export function EventsByRegionChart({ data }: EventsByRegionProps) {
  const { locale } = useLocaleStore();

  const localizedData = useMemo(() => {
    return (data || []).map((item) => ({
      ...item,
      region: localizeRegionName(item.region, locale),
    }));
  }, [data, locale]);

  return (
    <div className="bg-white dark:bg-[#fefefe] p-5 rounded-[12px] border-[1.5px] border-[#D8D2C8] dark:border-[#1E4830] shadow-[0_2px_16px_rgba(0,0,0,0.05)] font-manrope h-full min-h-[420px] flex flex-col justify-between transition-colors">
      <div className="flex items-center justify-between min-h-[52px] border-b border-[#D8D2C8] dark:border-[#1E4830] pb-3 mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[#133020]">
            {locale === "zh" ? "???????" : "Events by region"}
          </h3>
          <p className="text-[11px] text-[#666666]">
            {locale === "zh" ? "??????????" : "Geographic distribution of strategic tech exhibitions"}
          </p>
        </div>
        <span className="text-[11px] font-bold px-2 py-1 bg-[#046241]/10 text-[#046241] rounded-[6px] shrink-0">
          {data?.length || 0} {locale === "zh" ? "??" : "Regions"}
        </span>
      </div>

      <div className="flex-1 min-h-64 w-full [&_*:focus]:outline-none [&_path]:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart style={{ outline: "none" }}>
            <Pie
              data={localizedData}
              cx="50%"
              cy="46%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={3}
              dataKey="count"
              nameKey="region"
              activeShape={false}
              style={{ outline: "none" }}
              label={renderExternalLabel}
              labelLine={false}
            >
              {localizedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{ outline: "none", cursor: "pointer" }}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip locale={locale} />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "11px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
