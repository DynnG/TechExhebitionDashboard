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
      <div className="bg-[#133020] text-white p-3 rounded-xl border border-[#FFB347] shadow-xl text-xs space-y-1">
        <p className="font-bold text-[#FFB347]">{dataItem.name}</p>
        <p className="font-semibold text-white">
          Exhibitions: <span className="text-[#FFB347] font-black text-sm">{dataItem.exhibitions}</span>
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
    <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-xs">
      <h3 className="text-sm font-bold text-[#133020] mb-1">
        Business Line Distribution
      </h3>
      <p className="text-[11px] text-[#666666] mb-4">
        Exhibitions mapped across Lifewood's 6 core offerings
      </p>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 35, left: 10, bottom: 5 }}
          >
            <XAxis type="number" tick={{ fontSize: 10, fill: "#133020", fontWeight: 600 }} allowDecimals={false} />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 10, fill: "#133020", fontWeight: 600 }}
              width={160}
              tickLine={false}
              axisLine={{ stroke: "#D8D2C8" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="exhibitions" radius={[0, 6, 6, 0]}>
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
