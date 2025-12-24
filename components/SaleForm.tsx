"use client"

import { createSale } from "@/app/actions/sales"

export default function SaleForm() {
  return (
    <form action={createSale}>
      <input name="productId" placeholder="Product ID" required />
      <input name="quantity" type="number" required />
      <button type="submit">Complete Sale</button>
    </form>
  )
}
