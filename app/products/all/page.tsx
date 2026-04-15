import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import ProductsClientTable from "@/components/products/products-client-table";

export default async function ProductsPage() {
  const session = await getSession();

  let role: "staff" | "admin" | "superadmin" = "staff";

  if (session?.userId) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (user?.role) {
      role = user.role as any;
    }
  }

  const rawProducts = await prisma.product.findMany({
  orderBy: { createdAt: "desc" },
});

const products = rawProducts.map((p) => ({
  ...p,
  costPrice: Number(p.costPrice),
  sellingPrice: Number(p.sellingPrice),
  stockQuantity: Number(p.stockQuantity),
  stockThreshold: Number(p.stockThreshold),
}));


  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">All Products</h1>

      <ProductsClientTable products={products} userRole={role} />
    </div>
  );
}
