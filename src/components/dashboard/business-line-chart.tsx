"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

interface BusinessLineChartProps {
  data: { name: string; count: number }[];
}

const LOB_COLORS: Record<string, string> = {
  "Global AI Data": "#046241",
  AIGC: "#133020",
  "Global Scanning + Indexing": "#C17110",
  "Autonomous Driving": "#034E34",
  "AEO/GEO": "#E89131",
  "EDGE Intelligence": "#417256",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const dataItem = payload[0].payload;
    return (
      <div className="bg-[#133020] text-white p-3 rounded-[8px] border border-[#FFB347] shadow-[0_4px_20px_rgba(0,0,0,0.12)] text-xs font-manrope space-y-1">
        <p className="font-semibold text-[#FFB347]">{dataItem.name}</p>
        <p className="font-medium text-white">
          Exhibitions: <span className="text-[#FFB347] font-bold text-xs">{dataItem.exhibitions}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function BusinessLineChart({ data }: BusinessLineChartProps) {
  const chartData = useMemo(() => {
    return (data || []).map((d) => ({
      name: d.name,
      exhibitions: d.count,
    }));
  }, [data]);

  return (
    <div className="bg-white p-5 rounded-[12px] border-[1.5px] border-[#D8D2C8] shadow-[0_2px_16px_rgba(0,0,0,0.05)] font-manrope">
      <div className="border-b border-[#D8D2C8] pb-3 mb-4">
        <h3 className="text-[14px] font-semibold text-[#133020]">
          Business line distribution
        </h3>
        <p className="text-[11px] text-[#666666]">
          Exhibitions mapped across Lifewood's 6 core business lines
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 35, left: 10, bottom: 5 }}
          >
            <XAxis type="number" tick={{ fontSize: 10, fill: "#133020", fontWeight: 500 }} allowDecimals={false} />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 10, fill: "#133020", fontWeight: 500 }}
              width={160}
              tickLine={false}
              axisLine={{ stroke: "#D8D2C8" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="exhibitions" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={LOB_COLORS[entry.name] || "#046241"}
                />
              ))}
              <LabelList dataKey="exhibitions" position="right" style={{ fontSize: 11, fontWeight: 700, fill: "#133020" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
