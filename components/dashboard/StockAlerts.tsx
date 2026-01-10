"use client";

import { useEffect, useState } from "react";

export default function StockAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);

  async function loadAlerts() {
    const res = await fetch("/api/products");
    const products = await res.json();

    const low = products.filter(
      (p: any) => p.stockQuantity <= p.stockThreshold,
    );

    setAlerts(low);
  }

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!alerts.length) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <h3 className="font-semibold text-red-700 mb-3">
        🚨 Low Stock Alerts
      </h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-red-600">
            <th>Product</th>
            <th>Stock</th>
            <th>Threshold</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((item) => (
            <tr key={item.id} className="border-t">
              <td>{item.name}</td>
              <td>{item.stockQuantity}</td>
              <td>{item.stockThreshold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
