import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sales = await prisma.sale.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    return NextResponse.json({
      total: sales._sum.totalAmount ?? 0,
    });
  } catch (error) {
    console.error("SALES API ERROR:", error);
    return NextResponse.json(
      { total: 0 },
      { status: 200 } // still return valid JSON
    );
  }
}
