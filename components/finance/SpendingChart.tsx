"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IOSCard } from "@/components/ui/IOSCard";

interface ChartData {
  month: string;
  income: number;
  expenses: number;
}

interface SpendingChartProps {
  data: ChartData[];
}

export function SpendingChart({ data }: SpendingChartProps) {
  return (
    <IOSCard>
      <p className="text-sm font-semibold text-[#3C3C43]/60 mb-4 uppercase tracking-wider text-xs">
        6-Month Overview
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barGap={4} barSize={12}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F7" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#8E8E93" }}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "#F2F2F7", radius: 4 }}
            contentStyle={{
              backgroundColor: "white",
              border: "none",
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              fontSize: 12,
            }}
            formatter={(value) =>
              new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value))
            }
          />
          <Bar dataKey="income" fill="#34C759" radius={[4, 4, 0, 0]} name="Income" />
          <Bar dataKey="expenses" fill="#FF3B30" radius={[4, 4, 0, 0]} name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#34C759]" />
          <span className="text-xs text-[#8E8E93]">Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF3B30]" />
          <span className="text-xs text-[#8E8E93]">Expenses</span>
        </div>
      </div>
    </IOSCard>
  );
}
