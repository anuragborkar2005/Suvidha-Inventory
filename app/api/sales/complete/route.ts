import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 },
      );
    }

    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.qty,
      0,
    );

    // ✅ Transaction: create sale + reduce stock
    await prisma.$transaction(async (tx) => {
      // 1️⃣ Create Sale
      await tx.sale.create({
        data: {
          totalAmount,
        },
      });

      // 2️⃣ Reduce Stock using PRODUCT ID (unique)
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.qty,
            },
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  }  catch (error) {
  console.error("SALE ERROR FULL:", error);
  return NextResponse.json(
    { error: String(error) },
    { status: 500 },
  );
}

}
