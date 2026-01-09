import { Product } from "@prisma/client"

export default function ProductTable({ products }: { products: Product[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{p.stockQuantity}</td>
            <td>₹{p.sellingPrice.toString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
