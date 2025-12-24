"use client"

import { addProduct } from "@/app/actions/products"

export default function AddProductForm() {
  return (
    <form action={addProduct} className="space-y-4">
      <input name="name" placeholder="Product Name" required />
      <input name="price" type="number" required />
      <input name="quantity" type="number" required />
      <button type="submit">Add Product</button>
    </form>
  )
}
