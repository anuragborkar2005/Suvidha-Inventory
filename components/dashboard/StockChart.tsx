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

export default function StockChart() {
  const [data, setData] = useState<any[]>([]);

  async function loadStock() {
    const res = await fetch("/api/products");
    const products = await res.json();

    setData(
      products.map((p: any) => ({
        name: p.name,
        stock: p.stockQuantity,
      })),
    );
  }

  useEffect(() => {
    loadStock();
    const interval = setInterval(loadStock, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-5 h-[380px]">
      <h2 className="font-semibold text-lg mb-4">📦 Stock Distribution</h2>

      <ResponsiveContainer width="100%" height="100%">
  <BarChart data={data}>
    <defs>
      {/* 🌿 Green Gradient */}
      <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
    </defs>

    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
    <YAxis />
    <Tooltip />

    {/* ✅ Green Bars */}
    <Bar
      dataKey="stock"
      fill="url(#greenGradient)"
      radius={[6, 6, 0, 0]}
    />
  </BarChart>
</ResponsiveContainer>

    </div>
  );
}
