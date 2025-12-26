import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: any, { params }: { params: { barcode: string } }) {
  const product = await prisma.product.findUnique({
    where: { barcode: params.barcode }
  });

  return NextResponse.json(product);
}
