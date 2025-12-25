"use server";

import { prisma } from "@/lib/prisma";

export async function createSale(formData: FormData) {
  const productId = formData.get("productId") as string;
  const quantity = Number(formData.get("quantity"));

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");

  const totalCost = Number(product.costPrice) * quantity;
  const totalPrice = Number(product.sellingPrice) * quantity;

  await prisma.sale.create({
    data: {
      productId,
      quantity,
      totalCost,
      totalPrice,
    },
  });

  await prisma.product.update({
    where: { id: productId },
    data: { stockQuantity: product.stockQuantity - quantity },
  });
}
