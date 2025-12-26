"use server";
import { prisma } from "@/lib/prisma";

export default async function Dashboard() {
  const totalProducts = await prisma.product.count();
  const totalInvoices = await prisma.invoice.count();
  const totalRevenue = await prisma.invoice.aggregate({ _sum:{ total:true }});

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="p-4 border rounded">Products: {totalProducts}</div>
        <div className="p-4 border rounded">Invoices: {totalInvoices}</div>
        <div className="p-4 border rounded">Revenue: ₹{totalRevenue._sum.total?.toString()||0}</div>
      </div>
    </div>
  );
}
