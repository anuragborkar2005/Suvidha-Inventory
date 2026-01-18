"use client";

import { useEffect, useState } from "react";

type Sale = {
  id: number;
  productName: string;
  quantity: number;
  totalPrice: number;
  totalCost: number;
  createdAt: string;
};

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadSales() {
    try {
      const res = await fetch("/api/sales/history");
      const data = await res.json();
      setSales(data);
    } catch (err) {
      console.error("Failed to load sales history", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSales();
  }, []);

  if (loading) {
    return <p className="p-6">Loading sales...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">📊 Sales History</h1>

      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-right">Total ₹</th>
              <th className="p-2 text-right">Cost ₹</th>
              <th className="p-2 text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No sales found
                </td>
              </tr>
            )}

            {sales.map((sale) => (
              <tr key={sale.id} className="border-t">
                <td className="p-2">{sale.productName}</td>
                <td className="p-2 text-center">{sale.quantity}</td>
                <td className="p-2 text-right">
                  ₹{sale.totalPrice.toFixed(2)}
                </td>
                <td className="p-2 text-right">
                  ₹{sale.totalCost.toFixed(2)}
                </td>
                <td className="p-2 text-right">
                  {new Date(sale.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
