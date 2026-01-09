import { PageTitle } from "@/components/app/page-title";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/client";

export default async function AllProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { id: "desc" },
    });

    const formatCurrency = (value: Decimal | number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(Number(value));
    };

    return (
        <div className="container mx-auto py-10 px-4 md:px-8">
            <div className="mb-8">
                <PageTitle>All Products</PageTitle>
            </div>

            {/* Added overflow container to prevent layout break on small desktop screens */}
            <div className="rounded-md border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-20 font-bold">ID</TableHead>
                            <TableHead className="font-bold">
                                Product Name
                            </TableHead>
                            <TableHead className="font-bold">
                                Cost Price
                            </TableHead>
                            <TableHead className="font-bold">
                                Selling Price
                            </TableHead>
                            <TableHead className="font-bold text-right">
                                Margin
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {products.length > 0 ? (
                            products.map((product) => {
                                const margin =
                                    Number(product.sellingPrice) -
                                    Number(product.costPrice);

                                return (
                                    <TableRow
                                        key={product.id}
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            #{product.id.toString().slice(-4)}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {product.name}
                                        </TableCell>
                                        <TableCell>
                                            {formatCurrency(product.costPrice)}
                                        </TableCell>
                                        <TableCell>
                                            {formatCurrency(
                                                product.sellingPrice,
                                            )}
                                        </TableCell>
                                        <TableCell
                                            className={`text-right font-semibold ${margin >= 0 ? "text-green-600" : "text-red-600"}`}
                                        >
                                            {formatCurrency(margin)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-24 text-center text-muted-foreground italic"
                                >
                                    No products found in the inventory.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
