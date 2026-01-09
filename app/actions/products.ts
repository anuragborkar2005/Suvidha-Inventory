"use server";

import prisma from "@/lib/prisma";

export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const costPrice = Number(formData.get("costPrice"));
  const sellingPrice = Number(formData.get("sellingPrice"));
  const quantity = Number(formData.get("quantity"));
  const barcode = formData.get("barcode") as string | null;
  const category = formData.get("category") as string || "general";

  await prisma.product.create({
    data: {
      name,
      costPrice,
      sellingPrice,
      stockQuantity: quantity,
      barcode: barcode || null,
      category,
    },
  });
}
