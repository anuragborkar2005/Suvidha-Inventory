import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;   // ✅ Important fix
    const body = await request.json();

    console.log("✏️ UPDATE PRODUCT:", id, body);

    if (!id) {
      return NextResponse.json(
        { error: "Product ID missing" },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        category: body.category,
        stockQuantity: Number(body.stockQuantity),
        costPrice: body.costPrice,
        sellingPrice: body.sellingPrice,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ UPDATE PRODUCT FAILED:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID missing" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ DELETE PRODUCT FAILED:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
