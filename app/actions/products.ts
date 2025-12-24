"use server"

import prisma from "@/lib/prisma"

export async function addProduct(formData: FormData) {
  await prisma.product.create({
    data: {
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      quantity: Number(formData.get("quantity")),
    },
  })
}
