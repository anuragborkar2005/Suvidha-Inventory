import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    const formatted = sales.map((sale) => ({
      id: sale.id,
      productName: sale.product.name,
      quantity: sale.quantity,
      totalPrice: Number(sale.totalPrice),
      totalCost: Number(sale.totalCost),
      createdAt: sale.createdAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("❌ SALES HISTORY ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load sales history" },
      { status: 500 }
    );
  }
}
