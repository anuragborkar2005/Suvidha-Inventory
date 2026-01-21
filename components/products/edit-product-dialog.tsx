"use client";

import { useEffect, useState } from "react";
import { getProductById, updateProduct } from "@/app/actions/products";
import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Product } from "@/types/product";
import { Button } from "../ui/button";

interface EditProductDialogProps {
    productId: string;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function EditProductDialog({
    productId,
    open,
    setOpen,
}: EditProductDialogProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            try {
                const productDataFromDb = await getProductById(productId);
                if (productDataFromDb) {
                    setProduct({
                        ...productDataFromDb,
                        costPrice: Number(productDataFromDb.costPrice),
                        sellingPrice: Number(productDataFromDb.sellingPrice),
                    });
                } else {
                    setProduct(null);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        if (open && productId) {
            fetchProduct();
        }
    }, [open, productId]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-1/3">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                        Edit the product details here
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <p>Loading...</p>
                ) : product ? (
                    <form
                        key={product.id}
                        action={async (formData: FormData) => {
                            await updateProduct(productId, formData);
                            setOpen(false);
                        }}
                        className="grid gap-4"
                    >
                        <div className="grid gap-3">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={product.name}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="quantity">Product Quantity</Label>
                            <Input
                                id="quantity"
                                name="quantity"
                                defaultValue={product.stockQuantity}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="cprice">Product Cost Price</Label>
                            <Input
                                id="cprice"
                                name="cprice"
                                defaultValue={product.costPrice}
                            />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="sprice">Product Sell Price</Label>
                            <Input
                                id="sprice"
                                name="sprice"
                                defaultValue={product.sellingPrice}
                            />
                        </div>
                        <Button type="submit">Save</Button>
                    </form>
                ) : (
                    <p>Product not found.</p>
                )}
            </DialogContent>
        </Dialog>
    );
}
