import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import ProductsClientTable from "./products-client-table";

export default async function ProductsPage() {
  const session = await auth();

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">All Products</h1>

      <ProductsClientTable
        products={products}
        userRole={session?.user?.role ?? "staff"}
      />
    </div>
  );
}
