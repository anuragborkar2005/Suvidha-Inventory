import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const totalProducts = await prisma.product.count();
  const totalSales = await prisma.sale.aggregate({
    _sum: {
      quantity: true,
    },
  });
  const totalRevenue = await prisma.sale.aggregate({
    _sum: {
      totalPrice: true,
    },
  });

  return NextResponse.json({
    totalProducts,
    totalSales: totalSales._sum.quantity ?? 0,
    totalRevenue: totalRevenue._sum.totalPrice ?? 0,
  });
}
