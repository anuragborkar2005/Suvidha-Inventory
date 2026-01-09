"use server";

import prisma from "@/lib/prisma";

export async function createSale(payload: any) {
  const { studentName, date, items } = payload;

  const totalAmount = items.reduce((sum: number, i: any) => sum + i.price * i.qty, 0);

  // Create invoice first
  const invoice = await prisma.invoice.create({
    data: {
      student: studentName,
      date,
      total: totalAmount,
    }
  });

  // Save items under invoice
  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.id } });
    if (!product) continue;

    await prisma.sale.create({
      data: {
        productId: product.id,
        quantity: item.qty,
        totalPrice: item.price * item.qty,
        totalCost: Number(product.costPrice) * item.qty,
        invoiceId: invoice.id,             // <-- linking to invoice
      }
    });

    await prisma.product.update({
      where: { id: product.id },
      data: { stockQuantity: product.stockQuantity - item.qty }
    });
  }

  return { success: true, invoiceId: invoice.id };
}
