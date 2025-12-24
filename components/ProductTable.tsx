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
            <td>{p.quantity}</td>
            <td>₹{p.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
