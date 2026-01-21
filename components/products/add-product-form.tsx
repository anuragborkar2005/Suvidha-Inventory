"use client";
import { addProduct } from "@/app/actions/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AddProductForm() {
    return (
        <div className="flex justify-center items-start lg:items-center min-h-screen bg-slate-50/50 p-4 md:p-8">
            <Card className="w-full max-w-3xl shadow-lg">
                <CardHeader className="border-b mb-6">
                    <CardTitle className="text-2xl font-bold">
                        Add a New Product
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={addProduct} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <Label htmlFor="name" className="mb-2 block">
                                    Product Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="e.g. Notebook"
                                    required
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="costPrice"
                                    className="mb-2 block"
                                >
                                    Cost Price (per unit)
                                </Label>
                                <Input
                                    id="costPrice"
                                    name="costPrice"
                                    type="number"
                                    placeholder="e.g. 20"
                                    required
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="sellingPrice"
                                    className="mb-2 block"
                                >
                                    Selling Price (per unit)
                                </Label>
                                <Input
                                    id="sellingPrice"
                                    name="sellingPrice"
                                    type="number"
                                    placeholder="e.g. 30"
                                    required
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="quantity"
                                    className="mb-2 block"
                                >
                                    Quantity
                                </Label>
                                <Input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    placeholder="e.g. 100"
                                    required
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="category"
                                    className="mb-2 block"
                                >
                                    Category
                                </Label>
                                <Input
                                    id="category"
                                    name="category"
                                    placeholder="e.g. Stationery"
                                />
                            </div>

                            <div className="md:col-span-2">
                                {" "}
                                {/* Barcode spans full width */}
                                <Label htmlFor="barcode" className="mb-2 block">
                                    Barcode (Optional)
                                </Label>
                                <Input
                                    id="barcode"
                                    name="barcode"
                                    placeholder="e.g. 89012345678"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                className="w-full md:w-48 text-lg py-6"
                            >
                                Add Product
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
