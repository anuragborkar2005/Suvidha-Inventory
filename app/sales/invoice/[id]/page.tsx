"use server";

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function InvoicePage({ params }: { params: { id: string } }) {

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: { 
      sales: { include: { product: true } } 
    }
  });

  if(!invoice) {
    return <div style={{padding:30}}>❌ Invoice not found for ID: {params.id}</div>;
  }

  return (
    <div style={{padding:30}}>
      <h1 style={{fontSize:26,fontWeight:"bold"}}>Invoice</h1>
      <p><b>Student:</b> {invoice.student}</p>
      <p><b>Date:</b> {invoice.date.toDateString()}</p>

      <h3 style={{marginTop:20,fontSize:20}}>Items</h3>
      <ul>
        {invoice.sales.map((item)=>(
          <li key={item.id}>
            {item.product?.name} × {item.quantity} = ₹{item.totalPrice.toString()}
          </li>
        ))}
      </ul>

      <h2 style={{marginTop:20,fontSize:22}}>
        Total: ₹{invoice.total.toString()}
      </h2>

      <Link href="/sales/history" style={{marginTop:20,display:"inline-block",color:"blue"}}>
        ← Back to History
      </Link>
    </div>
  );
}
