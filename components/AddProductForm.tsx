"use client";
import { addProduct } from "@/app/actions/products";

export default function AddProductForm() {
  return (
    <form action={addProduct} className="space-y-4 w-full max-w-md bg-white p-6 rounded shadow">

      <div>
        <label className="block mb-1 font-medium">Product Name</label>
        <input name="name" className="border p-2 w-full rounded" required />
      </div>

      <div>
        <label className="block mb-1 font-medium">Cost Price (per unit)</label>
        <input name="costPrice" type="number" className="border p-2 w-full rounded" required />
      </div>

      <div>
        <label className="block mb-1 font-medium">Selling Price (per unit)</label>
        <input name="sellingPrice" type="number" className="border p-2 w-full rounded" required />
      </div>

      <div>
        <label className="block mb-1 font-medium">Quantity</label>
        <input name="quantity" type="number" className="border p-2 w-full rounded" required />
      </div>

      <div>
        <label className="block mb-1 font-medium">Barcode (Optional)</label>
        <input name="barcode" className="border p-2 w-full rounded" placeholder="eg. 89012345678" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Category</label>
        <input name="category" className="border p-2 w-full rounded" placeholder="general" />
      </div>

      <button className="bg-blue-600 text-white w-full py-2 rounded">Add Product</button>
    </form>
  );
}
