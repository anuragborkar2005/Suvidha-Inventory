import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function SalesHistoryPage() {

  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales History</h1>

        <Link href="/sales/new" className="px-4 py-2 bg-black text-white rounded">
          + New Sale
        </Link>
      </div>

      {invoices.length === 0 && <p>No invoices recorded yet.</p>}

      <table className="w-full border mt-3">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2">Date</th>
            <th className="p-2">Student/Customer</th>
            <th className="p-2">Total Amount</th>
            <th className="p-2"></th>
          </tr>
        </thead>

        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id} className="border-b">
              <td className="p-2">{new Date(inv.date).toLocaleDateString()}</td>
              <td className="p-2">{inv.student}</td>
              <td className="p-2 font-semibold">₹{inv.total.toString()}</td>
              <td className="p-2 text-blue-600 underline">
                <Link href={`/sales/invoice/${inv.id}`}>View Invoice</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
