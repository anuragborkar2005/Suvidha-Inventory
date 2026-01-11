import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const totalRevenue = sales.reduce(
      (sum, sale) => sum + Number(sale.totalPrice),
      0
    );

    const totalQuantity = sales.reduce(
      (sum, sale) => sum + sale.quantity,
      0
    );

    return NextResponse.json({
      totalRevenue,
      totalQuantity,
      totalOrders: sales.length,
    });
  } catch (error) {
    console.error("❌ TODAY SALES API ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load today sales" },
      { status: 500 }
    );
  }
}
