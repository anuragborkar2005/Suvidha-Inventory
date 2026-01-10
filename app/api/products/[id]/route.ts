import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * PUT → Update product by ID
 */
export async function PUT(
  req: Request,
  context: { params?: { id?: string } }
) {
  try {
    // ✅ SAFELY EXTRACT ID
    let productId = context?.params?.id;

    // Fallback: extract ID from URL if params fail
    if (!productId) {
      const url = new URL(req.url);
      productId = url.pathname.split("/").pop();
    }

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID missing in request" },
        { status: 400 }
      );
    }

    const body = await req.json();

    console.log("✏️ UPDATE PRODUCT:", productId, body);

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        name: body.name,
        category: body.category,
        stockQuantity: Number(body.stockQuantity),
        stockThreshold: Number(body.stockThreshold),
        costPrice: Number(body.costPrice),
        sellingPrice: Number(body.sellingPrice),
      },
    });

    console.log("✅ PRODUCT UPDATED:", updated);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ UPDATE PRODUCT FAILED:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
