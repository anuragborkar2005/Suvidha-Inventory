"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalRevenue: number;
  totalQuantity: number;
  totalOrders: number;
};

export default function SalesSummary() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalQuantity: 0,
    totalOrders: 0,
  });

  const [loading, setLoading] = useState(true);

  async function loadSales() {
    try {
      const res = await fetch("/api/sales/today", {
        cache: "no-store",
      });

      if (!res.ok) {
        console.warn("Sales API failed");
        return;
      }

      const data = await res.json();

      setStats({
        totalRevenue: data?.totalRevenue ?? 0,
        totalQuantity: data?.totalQuantity ?? 0,
        totalOrders: data?.totalOrders ?? 0,
      });
    } catch (err) {
      console.error("Failed to load sales stats", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSales();

    // 🔁 Refresh every 5 seconds
    const refreshInterval = setInterval(loadSales, 5000);

    // 🕛 Detect date change
    let today = new Date().toDateString();

    const dayWatcher = setInterval(() => {
      const now = new Date().toDateString();
      if (now !== today) {
        console.log("📅 New day detected → refreshing dashboard");
        today = now;
        loadSales();
      }
    }, 60_000); // every minute

    return () => {
      clearInterval(refreshInterval);
      clearInterval(dayWatcher);
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Today's Revenue" value="Loading..." />
        <StatCard label="Items Sold" value="Loading..." />
        <StatCard label="Orders" value="Loading..." />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        label="Today's Revenue"
        value={`₹${stats.totalRevenue.toFixed(2)}`}
        highlight
      />
      <StatCard
        label="Items Sold"
        value={stats.totalQuantity.toString()}
      />
      <StatCard
        label="Orders"
        value={stats.totalOrders.toString()}
      />
    </div>
  );
}

/* -------------------- */
/* Small reusable card  */
/* -------------------- */
function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border p-4 bg-white shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className={`text-2xl font-bold ${
          highlight ? "text-green-600" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
