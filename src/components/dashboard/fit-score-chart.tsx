"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface FitScoreChartProps {
  data: { name: string; count: number; color: string }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#133020] text-white px-3 py-2 rounded-[8px] border border-[#FFB347] shadow-[0_4px_20px_rgba(0,0,0,0.12)] text-xs font-manrope">
        <p className="font-semibold text-[#FFB347] mb-0.5">{data.name}</p>
        <p className="text-white font-medium">{data.value} exhibitions</p>
      </div>
    );
  }
  return null;
};

const FIT_COLOR_MAP: Record<string, string> = {
  "#133020": "#FFB347",
  "#046241": "#046241",
  "#708E7C": "#708E7C",
};

export function FitScoreChart({ data }: FitScoreChartProps) {
  const total = (data || []).reduce((acc, curr) => acc + curr.count, 0);

  const formattedData = (data || []).map((d) => ({
    ...d,
    displayColor: FIT_COLOR_MAP[d.color] || d.color || "#10B981",
  }));

  return (
    <div className="bg-white dark:bg-[#133020] p-5 rounded-[12px] border-[1.5px] border-[#D8D2C8] dark:border-[#1E4830] shadow-sm font-manrope flex flex-col justify-between transition-colors">
      <div>
        <div className="flex items-center justify-between border-b border-[#D8D2C8] dark:border-[#1E4830] pb-3 mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-emerald-950 dark:text-white">
              Fit score distribution
            </h3>
            <p className="text-[11px] text-emerald-800/70 dark:text-slate-400">
              Alignment threshold evaluation across verified records
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-amber-300 bg-emerald-500/10 dark:bg-amber-400/10 px-2.5 py-1 rounded-full">
            {total} total scored
          </span>
        </div>

        <div className="h-48 w-full [&_*:focus]:outline-none [&_path]:outline-none relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart style={{ outline: "none" }}>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="count"
                nameKey="name"
                style={{ outline: "none" }}
              >
                {formattedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.displayColor}
                    style={{ outline: "none", cursor: "pointer" }}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Structured Legend Grid */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#D8D2C8] dark:border-[#1E4830] text-xs">
        {formattedData.map((item) => (
          <div key={item.name} className="flex flex-col items-center text-center p-1.5 rounded-[6px] bg-[#F9F7F7] dark:bg-black/20">
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-[3px] inline-block shrink-0"
                style={{ backgroundColor: item.displayColor }}
              />
              <span className="text-[11px] font-medium text-emerald-950 dark:text-slate-200 truncate">
                {item.name.split(" ")[0]} {item.name.split(" ")[1]}
              </span>
            </div>
            <span className="text-[14px] font-bold text-emerald-950 dark:text-white leading-none">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
