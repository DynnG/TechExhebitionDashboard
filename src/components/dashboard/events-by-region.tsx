"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface EventsByRegionProps {
  data: { region: string; count: number }[];
}

const COLORS = ["#FFB347", "#046241", "#C17110", "#E89131", "#417256", "#708E7C", "#FFC370"];

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

export function EventsByRegionChart({ data }: EventsByRegionProps) {
  return (
    <div className="bg-white p-5 rounded-[12px] border-[1.5px] border-[#D8D2C8] shadow-[0_2px_16px_rgba(0,0,0,0.05)] font-manrope">
      <div className="border-b border-[#D8D2C8] pb-3 mb-4">
        <h3 className="text-[14px] font-semibold text-[#133020]">
          Events by region
        </h3>
        <p className="text-[11px] text-[#666666]">
          Geographic distribution of strategic tech exhibitions
        </p>
      </div>

      <div className="h-64 w-full [&_*:focus]:outline-none [&_path]:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart style={{ outline: "none" }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="count"
              nameKey="region"
              activeShape={false}
              style={{ outline: "none" }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{ outline: "none", cursor: "pointer" }}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
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
