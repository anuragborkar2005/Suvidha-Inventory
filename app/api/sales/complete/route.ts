import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customerName } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 }
      );
    }

    const receiptId = "REC-" + Math.random().toString(36).substring(2, 9).toUpperCase();

    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error("Product not found: " + item.productId);
        }

        const totalPrice =
          Number(product.sellingPrice) * Number(item.qty);

        const totalCost =
          Number(product.costPrice) * Number(item.qty);

        
        await tx.sale.create({
          data: {
            receiptId,
            customerName: customerName || "General Customer",
            productId: product.id,
            quantity: item.qty,
            totalPrice,
            totalCost,
          },
        });

        
        await tx.product.update({
          where: { id: product.id },
          data: {
            stockQuantity: {
              decrement: item.qty,
            },
          },
        });
      }
    });

    return NextResponse.json({ success: true, receiptId });
  } catch (error) {
    console.error("❌ SALE ERROR:", error);

    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
