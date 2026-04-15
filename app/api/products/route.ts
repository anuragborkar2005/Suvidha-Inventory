import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/proxy";

export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        barcode: body.barcode,
        category: body.category,
        stockQuantity: Number(body.stockQuantity),
        stockThreshold: Number(body.stockThreshold),
        costPrice: Number(body.costPrice),
        sellingPrice: Number(body.sellingPrice),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Product creation failed" },
      { status: 500 }
    );
  }
}, "editProducts");

export const GET = withAuth(async () => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}, "viewProducts");
