import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * POST → Create product
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("🔥 PRODUCT CREATE BODY:", body);

    const product = await prisma.product.create({
      data: {
        name: body.name || "TEST PRODUCT",
        barcode: body.barcode || "0000",
        category: body.category || "TEST",
        stockQuantity: Number(body.stockQuantity || 1),
        stockThreshold: Number(body.stockThreshold || 1),
        costPrice: Number(body.costPrice || 1),
        sellingPrice: Number(body.sellingPrice || 1),
      },
    });

    console.log("✅ PRODUCT CREATED:", product);

    return NextResponse.json(product);
  } catch (error) {
    console.error("❌ PRODUCT CREATE FAILED:", error);
    return NextResponse.json(
      { error: "Product creation failed" },
      { status: 500 }
    );
  }
}

/**
 * GET → Fetch all products
 */
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
