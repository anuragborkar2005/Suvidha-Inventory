import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { code: string } }
) {
  const product = await prisma.product.findUnique({
    where: { barcode: params.code }
  });

  return NextResponse.json(product ?? null);
}
