"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface EventsByRegionProps {
  data: { region: string; count: number }[];
}

const COLORS = ["#133020", "#046241", "#C17110", "#E89131", "#417256", "#708E7C", "#9CAFA4"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#133020] text-white px-3 py-2 rounded-lg border border-[#FFB347] shadow-xl text-xs">
        <p className="font-bold text-[#FFB347] mb-0.5">{data.name}</p>
        <p className="text-white font-semibold">{data.value} Exhibitions</p>
      </div>
    );
  }
  return null;
};

export function EventsByRegionChart({ data }: EventsByRegionProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-[#D8D2C8] shadow-xs">
      <h3 className="text-sm font-bold text-[#133020] mb-1">
        Events by Region
      </h3>
      <p className="text-[11px] text-[#666666] mb-4">
        Geographic distribution of strategic tech exhibitions
      </p>

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
              wrapperStyle={{ fontSize: "11px", color: "#133020" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
