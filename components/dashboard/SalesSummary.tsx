"use client";

import { useEffect, useState } from "react";

export default function SalesSummary() {
  const [total, setTotal] = useState(0);

  async function loadSales() {
  try {
    const res = await fetch("/api/sales/today");

    if (!res.ok) return;

    const text = await res.text();
    if (!text) return;

    const data = JSON.parse(text);
    setTotal(data.total || 0);
  } catch (err) {
    console.error("Sales fetch failed", err);
  }
}


  useEffect(() => {
    loadSales();
  }, []);

  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
      <h3 className="font-semibold text-green-700">💰 Today Sales</h3>
      <p className="text-3xl font-bold mt-2">₹ {total}</p>
      <p className="text-xs text-gray-500 mt-1">
        Auto-updates every refresh
      </p>
    </div>
  );
}
