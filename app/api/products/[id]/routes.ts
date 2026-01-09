import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      session.user.role !== "admin" &&
      session.user.role !== "superadmin"
    ) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
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

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
