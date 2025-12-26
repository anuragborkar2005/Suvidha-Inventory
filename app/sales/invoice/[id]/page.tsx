// ❌ No "use client" here
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function InvoicePage({ params }: { params: { id: string } }) {

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { 
      sales: { include: { product: true } }
    }
  });

  if (!invoice) {
    return <div className="p-10 text-red-500 text-xl">Invoice Not Found</div>;
  }

  return (
    <div className="p-10 space-y-5">
      <h1 className="text-3xl font-bold">Invoice #{invoice.id}</h1>

      <p><b>Customer:</b> {invoice.student}</p>
      <p><b>Date:</b> {invoice.date.toDateString()}</p>

      <h2 className="text-xl font-semibold mt-4">Items</h2>
      <ul className="space-y-2">
        {invoice.sales.map(i => (
          <li key={i.id}>
            {i.product?.name} × {i.quantity} = ₹{i.totalPrice.toString()}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mt-4">Total: ₹{invoice.total.toString()}</h2>

      <Link href="/sales/history" className="underline text-blue-600">
        ← Back to History
      </Link>
    </div>
  );
}
