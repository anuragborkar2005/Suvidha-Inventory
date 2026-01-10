import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, quantity } = body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (quantity > product.stockQuantity) {
      return NextResponse.json(
        { error: "Not enough stock" },
        { status: 400 }
      );
    }

    const total = Number(product.sellingPrice) * Number(quantity);

    // Transaction ensures consistency
    await prisma.$transaction([
      prisma.sale.create({
        data: {
          productId,
          quantity: Number(quantity),
          total,
        },
      }),

      prisma.product.update({
        where: { id: productId },
        data: {
          stockQuantity: product.stockQuantity - Number(quantity),
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SALE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create sale" },
      { status: 500 }
    );
  }
}
