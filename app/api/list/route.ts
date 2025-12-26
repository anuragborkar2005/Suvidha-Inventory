import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, sellingPrice: true, barcode: true }
  });

  return Response.json(products);
}
