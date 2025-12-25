import { prisma } from "@/lib/prisma";

export default async function SalesPage() {
  const sales = await prisma.sale.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Sales History</h1>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th>Date</th><th>Product</th><th>Qty</th><th>Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(s => (
            <tr key={s.id} className="border-b">
              <td>{new Date(s.createdAt).toLocaleDateString()}</td>
              <td>{s.product.name}</td>
              <td>{s.quantity}</td>
              <td>₹{s.totalPrice.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
