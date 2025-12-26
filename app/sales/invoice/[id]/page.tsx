"use server";

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function InvoicePage({ params }: { params: { id: string } }) {

  if (!params?.id) {
    return <div style={{padding:30}}>❌ Invalid Invoice ID</div>
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { sales: { include: { product: true } } }
  });

  if (!invoice) {
    return <div style={{padding:30}}>❌ Invoice Not Found</div>
  }

  return (
    <div style={{padding:30}}>
      <h1 style={{fontSize:26, fontWeight:"bold"}}>Invoice #{invoice.id.slice(0,6)}</h1>

      <p><b>Student:</b> {invoice.student}</p>
      <p><b>Date:</b> {invoice.date.toDateString()}</p>

      <h3 style={{marginTop:20,fontSize:20}}>Items:</h3>
      <ul>
        {invoice.sales.map(s => (
          <li key={s.id}>
            {s.product?.name} × {s.quantity} = ₹{s.totalPrice.toString()}
          </li>
        ))}
      </ul>

      <h2 style={{marginTop:20,fontSize:22}}>Total: ₹{invoice.total.toString()}</h2>

      <Link href="/sales/history" style={{marginTop:20,display:"inline-block",color:"blue"}}>
        ← Back to Sales History
      </Link>
    </div>
  )
}
