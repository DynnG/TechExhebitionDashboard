"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
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

export function BusinessLineChart({ data }: BusinessLineChartProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-[#D8D2C8] shadow-xs">
      <h3 className="text-sm font-bold text-[#133020] mb-1">
        Business Line Distribution
      </h3>
      <p className="text-[11px] text-[#666666] mb-4">
        Exhibition count mapped across Lifewood's 6 core offerings
      </p>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
          >
            <XAxis type="number" tick={{ fontSize: 10, fill: "#666666" }} />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 10, fill: "#133020", fontWeight: 600 }}
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#133020",
                color: "#FFFFFF",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={LOB_COLORS[entry.name] || "#046241"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
