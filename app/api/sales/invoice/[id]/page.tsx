"use server";

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function InvoicePage({ params }: { params: { id: string } }) {

  // console.log("Invoice page loaded with ID:", params.id);

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      sales: { include: { product: true } }
    }
  });

  if (!invoice) {
    return <div className="p-10 text-red-600 text-xl">❌ Invoice not found</div>;
  }

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">Invoice #{invoice.id}</h1>

      <div>
        <p><b>Student:</b> {invoice.student}</p>
        <p><b>Date:</b> {invoice.date.toDateString()}</p>
      </div>

      <h2 className="text-xl font-semibold mt-6">Items</h2>
      <div className="space-y-2">
        {invoice.sales.map(item => (
          <div key={item.id} className="border p-3 rounded flex justify-between">
            <span>{item.product?.name} × {item.quantity}</span>
            <span>₹ {Number(item.totalPrice).toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-6">
        Total: ₹ {Number(invoice.total).toLocaleString("en-IN")}
      </h2>

      <Link href="/sales/history" className="text-blue-600 underline mt-5 block">
        ← Back to History
      </Link>
    </div>
  );
}
