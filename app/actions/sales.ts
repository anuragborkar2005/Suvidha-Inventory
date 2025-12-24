"use server"

import prisma from "@/lib/prisma"

export async function createSale(formData: FormData) {
  const productId = formData.get("productId") as string
  const qty = Number(formData.get("quantity"))

  const product = await prisma.product.findUnique({ where: { id: productId } })

  if (!product || product.quantity < qty) {
    throw new Error("Insufficient stock")
  }

  await prisma.$transaction([
    prisma.sale.create({
      data: {
        productId,
        quantity: qty,
        totalPrice: product.price * qty,
      },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { quantity: { decrement: qty } },
    }),
  ])
}
