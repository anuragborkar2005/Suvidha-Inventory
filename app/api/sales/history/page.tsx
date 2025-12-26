"use server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SalesHistory() {
  const invoices = await prisma.invoice.findMany({
    orderBy:{ createdAt:"desc" }
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Sales History</h1>

      {invoices.length===0 && <p>No invoices yet</p>}

      <div className="space-y-3">
        {invoices.map(inv=>(
          <div key={inv.id} className="border p-3 rounded flex justify-between">
            <div>
              <b>{inv.student}</b>
              <p>{inv.date.toDateString()}</p>
            </div>

            <Link href={`/sales/invoice/${inv.id}`} className="text-blue-600 underline">
              View Invoice
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
