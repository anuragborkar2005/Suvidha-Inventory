"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StockChart() {
  const [data, setData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  async function loadStock() {
    try {
      const res = await fetch("/api/products");
      const products = await res.json();

      setData(
        products.slice(0, 10).map((p: any) => ({
          name: p.name.length > 10 ? p.name.substring(0, 10) + "..." : p.name,
          stock: p.stockQuantity,
        })),
      );
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    setMounted(true);
    loadStock();
    const interval = setInterval(loadStock, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[300px] w-full mt-4">
      {!mounted ? (
        <Skeleton className="h-full w-full" />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: "#64748b" }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: "#64748b" }} 
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar
              dataKey="stock"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
