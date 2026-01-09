"use server";
import prisma from "@/lib/prisma";

export default async function StockReport() {
  const products = await prisma.product.findMany();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Stock Report</h1>

      <table className="w-full border">
        <tr className="font-bold border-b">
          <td>Name</td><td>Stock</td><td>Selling Price</td><td>Cost</td>
        </tr>
        {products.map(p=>(
          <tr key={p.id} className="border-b">
            <td>{p.name}</td>
            <td>{p.stockQuantity}</td>
            <td>₹{p.sellingPrice.toString()}</td>
            <td>₹{p.costPrice.toString()}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
