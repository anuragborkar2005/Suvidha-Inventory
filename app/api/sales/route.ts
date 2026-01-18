import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No sale items provided" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error("Product not found");
        }

        if (product.stockQuantity < item.quantity) {
          throw new Error(`Not enough stock for ${product.name}`);
        }

        const totalPrice =
          Number(product.sellingPrice) * Number(item.quantity);

        const totalCost =
          Number(product.costPrice) * Number(item.quantity);

        
        await tx.sale.create({
          data: {
            productId: product.id,
            quantity: Number(item.quantity),
            totalPrice,
            totalCost,
          },
        });

        
        await tx.product.update({
          where: { id: product.id },
          data: {
            stockQuantity: {
              decrement: Number(item.quantity),
            },
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ SALE FAILED:", error);
    return NextResponse.json(
      { error: "Sale failed" },
      { status: 500 }
    );
  }
}
