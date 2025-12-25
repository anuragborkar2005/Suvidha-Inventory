"use server";

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SalesHistoryPage() {
  const sales = await prisma.sale.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sales History</h1>

      {sales.length === 0 && (
        <p className="text-gray-500 text-lg">No sales recorded yet.</p>
      )}

      <div className="space-y-4">
        {sales.map((s) => (
          <div key={s.id} className="border p-4 rounded-md flex justify-between">
            <div>
              <p className="font-semibold">{s.product?.name}</p>
              <p className="text-sm text-gray-600">
                Qty: {s.quantity} × Price: ₹{s.totalPrice.toString()}
              </p>
              <p className="text-xs text-gray-500">{s.createdAt.toLocaleString()}</p>
            </div>

            {/* You can later create a invoice-details page */}
            <Link href={`/sales/invoice/${s.invoiceId}`} className="text-blue-600 underline">
  View Invoice
</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
