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

export default async function StockLevelPage() {
    const lowStockProducts = await prisma.product.findMany({
        where: {
            stockQuantity: {
                lt: prisma.product.fields.stockThreshold,
            },
        },
    });

    return (
        <div className="w-full flex flex-col justify-center p-6">
            <PageTitle>Low Stock Levels</PageTitle>

            <div className="flex justify-center px-4">
                <Table className="w-full text-sm rounded-md p-0 scrollbar-hide">
                    <TableHeader className="bg-primary/50 text-accent-foreground">
                        <TableRow>
                            <TableHead className="px-4 py-3 text-left font-semibold">
                                Product Name
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold">
                                Stock Quantity
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold">
                                Stock Threshold
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lowStockProducts.length > 0 ? (
                            lowStockProducts.map((product) => (
                                <TableRow key={product.id} className="border-t">
                                    <TableCell className="px-4 py-2 font-medium">
                                        {product.name}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        {product.stockQuantity}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        {product.stockThreshold}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={3}
                                    className="px-4 py-6 text-center italic"
                                >
                                    No products with low stock
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
