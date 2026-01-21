import { PageTitle } from "@/components/app/page-title";
import { ProductTable } from "@/components/products/product-table";

import prisma from "@/lib/prisma";

export default async function AllProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { id: "desc" },
    });

    const serialisedProducts = products.map((product) => ({
        ...product,
        costPrice: Number(product.costPrice),
        sellingPrice: Number(product.sellingPrice),
    }));

    return (
        <div className="container mx-auto py-10 px-4 md:px-8">
            <div className="mb-8">
                <PageTitle>All Products</PageTitle>
            </div>

            {/* Added overflow container to prevent layout break on small desktop screens */}
            <div className="rounded-md border bg-card shadow-sm overflow-hidden">
                <ProductTable products={serialisedProducts} />
            </div>
        </div>
    );
}
