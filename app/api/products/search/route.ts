import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/proxy";

export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q) {
      return NextResponse.json([]);
    }

    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      take: 5,
      select: {
        id: true,
        name: true,
        sellingPrice: true,
        barcode: true,
        category: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("SEARCH API ERROR:", error);
    return NextResponse.json([], { status: 200 });
  }
}, "viewProducts");
