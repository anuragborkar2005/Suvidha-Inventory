"use client";
import { Product } from "@/types/product";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { deleteProductById } from "@/app/actions/products";
import { useState } from "react";
import { EditProductDialog } from "./edit-product-dialog";

interface ProductTableProps {
    products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
    const [isEditProductForm, setEditProductForm] = useState(false);
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(value);
    };

    return (
        <Table>
            <TableHeader className="bg-muted/50">
                <TableRow>
                    <TableHead className="w-20 font-bold">ID</TableHead>
                    <TableHead className="font-bold">Product Name</TableHead>
                    <TableHead className="font-bold">Cost Price</TableHead>
                    <TableHead className="font-bold">Selling Price</TableHead>
                    <TableHead className="font-bold text-right">
                        Margin
                    </TableHead>

                    <TableHead className="font-bold text-right">
                        <span className="sr-only">Actions</span>
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
                                    {formatCurrency(product.sellingPrice)}
                                </TableCell>
                                <TableCell
                                    className={`text-right font-semibold ${margin >= 0 ? "text-green-600" : "text-red-600"}`}
                                >
                                    {formatCurrency(margin)}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                aria-haspopup="true"
                                                size="icon"
                                                variant="ghost"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Toggle menu
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setEditProductForm(
                                                        !isEditProductForm,
                                                    )
                                                }
                                            >
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    deleteProductById(
                                                        product.id,
                                                    )
                                                }
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <EditProductDialog
                                        productId={product.id}
                                        open={isEditProductForm}
                                        setOpen={setEditProductForm}
                                    />
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
    );
}
