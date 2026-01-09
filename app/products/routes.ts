import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" }
    });

    return NextResponse.json(products);
  } catch (e) {
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
