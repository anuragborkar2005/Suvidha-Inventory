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

export default async function AllProductsPage() {
    const products = await prisma.product.findMany();

    return (
        <div className="w-full flex flex-col justify-center p-6">
            <PageTitle>All Products</PageTitle>

            <div className="flex justify-center px-4">
                <Table className="w-full text-sm rounded-md p-0 scrollbar-hide">
                    <TableHeader className="bg-primary/50 text-accent-foreground">
                        <TableRow>
                            <TableHead className="px-4 py-3 text-left font-semibold">
                                Id
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold">
                                Product Name
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold">
                                Cost Price
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold">
                                Selling Price
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <TableRow key={product.id} className="border-t">
                                    <TableCell className="px-4 py-2 font-medium">
                                        {product.id}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        {product.name}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        ₹
                                        {Number(
                                            product.costPrice,
                                        ).toLocaleString("en-IN")}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        ₹
                                        {Number(
                                            product.sellingPrice,
                                        ).toLocaleString("en-IN")}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="px-4 py-6 text-center italic"
                                >
                                    No products found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
