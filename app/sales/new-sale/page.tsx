"use client";
import SaleForm from "@/components/SaleForm"

export function Page() {
  return <SaleForm />
}


import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Plus,
    Trash2,
    Calendar as CalendarIcon,
    IndianRupee,
    Barcode,
} from "lucide-react";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Product } from "@/types/product";

export default function SalesPage() {
    const [cart, setCart] = useState<Product[]>([]);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [studentName, setStudentName] = useState("");
    const barcodeInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        barcodeInputRef?.current?.focus();
    });

    const handleBarcodeScan = async (e: React.KeyboardEvent) => {
        if (e.key !== "Enter") return;

        const barcode = (e.target as HTMLInputElement).value.trim();
        try {
            const res = await fetch(`/api/products/by-barcode/${barcode}`);
            const product = await res.json();
            console.log(product);
            if (!product) {
                toast.error("Product not found!");
                return;
            }

            toast.success(`${product.name} added`);
            (e.target as HTMLInputElement).value = ""; // Clear for next scan
        } catch (error: unknown) {
            const msg =
                error instanceof Error ? error.message : "Unknown Error";
            toast.error(msg);
        }
    };

    const [items, setItems] = useState<
        { id: string; name: string; price: number; qty: number }[]
    >([
        {
            id: "1",
            name: "Monthly Tuition Fee - Class 10th",
            price: 5000,
            qty: 1,
        },
        { id: "2", name: "Science Practical Workbook", price: 650, qty: 1 },
    ]);

    const addItem = () => {};

    const updateItem = () => {};

    const removeItem = (id: string) => {};

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0,
    );
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Create Invoice
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Generate professional fee receipts for students
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-7xl rounded-xl">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Invoice Details</CardTitle>
                                        <CardDescription>
                                            Fill in student and fee details
                                        </CardDescription>
                                    </div>
                                    <Badge variant="secondary">Draft</Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-8">
                                {/* Student Name & Date */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="student-name">
                                            Student Name
                                        </Label>
                                        <Input
                                            id="student-name"
                                            placeholder="e.g. Priya Singh"
                                            value={studentName}
                                            onChange={(e) =>
                                                setStudentName(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Invoice Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date
                                                        ? format(date, "PPP")
                                                        : "Pick a date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <Separator />

                                {/* Items Table */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">
                                            Fee Items
                                        </h3>
                                        <div className="space-x-3">
                                            <Button
                                                variant="outline"
                                                onClick={addItem}
                                                size="sm"
                                            >
                                                <Barcode className="h-4 w-4 mr-2" />
                                                Ready To Scan
                                            </Button>
                                            <Button onClick={addItem} size="sm">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Item
                                            </Button>
                                        </div>
                                    </div>

                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-full">
                                                    Description
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    Qty
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Unit Price
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Amount
                                                </TableHead>
                                                <TableHead className="w-12"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {items.length === 0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={5}
                                                        className="text-center py-10 text-gray-500"
                                                    >
                                                        No items added. Click
                                                        &quot;Add Item&quot; to
                                                        begin.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                items.map((item) => (
                                                    <TableRow
                                                        key={item.id}
                                                        className="hover:bg-muted/50"
                                                    >
                                                        <TableCell>
                                                            <Input
                                                                placeholder="e.g. Monthly Tuition Fee"
                                                                value={
                                                                    item.name
                                                                }
                                                                onChange={(e) =>
                                                                    updateItem()
                                                                }
                                                                className="border-0 focus-visible:ring-1 focus-visible:ring-ring h-9"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Input
                                                                type="number"
                                                                value={item.qty}
                                                                onChange={(e) =>
                                                                    updateItem()
                                                                }
                                                                className="w-20 mx-auto h-9 border-0 text-center"
                                                                min="1"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Input
                                                                type="number"
                                                                value={
                                                                    item.price
                                                                }
                                                                onChange={(e) =>
                                                                    updateItem()
                                                                }
                                                                className="w-28 h-9 border-0 text-right"
                                                                min="0"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium">
                                                            ₹
                                                            {(
                                                                item.price *
                                                                item.qty
                                                            ).toLocaleString(
                                                                "en-IN",
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    removeItem(
                                                                        item.id,
                                                                    )
                                                                }
                                                                className="h-8 w-8 text-red-600 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button size="lg" className="flex-1">
                                        Save & Send Invoice
                                    </Button>
                                    <Button size="lg" variant="outline">
                                        Save Draft
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="space-y-6">
                        {/* Invoice Summary */}
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <IndianRupee className="h-5 w-5" />
                                    Invoice Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {items.length > 0 && (
                                    <>
                                        <div className="space-y-3">
                                            {items
                                                .filter(
                                                    (i) =>
                                                        i.name.trim() &&
                                                        i.price > 0,
                                                )
                                                .map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex justify-between text-sm"
                                                    >
                                                        <span className="text-gray-600 max-w-[200px] truncate">
                                                            {item.name}
                                                            {item.qty > 1 &&
                                                                ` × ${item.qty}`}
                                                        </span>
                                                        <span className="font-medium">
                                                            ₹
                                                            {(
                                                                item.price *
                                                                item.qty
                                                            ).toLocaleString(
                                                                "en-IN",
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>

                                        <Separator />

                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span>Subtotal</span>
                                                <span>
                                                    ₹
                                                    {subtotal.toLocaleString(
                                                        "en-IN",
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>GST (18%)</span>
                                                <span>₹{gst.toFixed(0)}</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-bold pt-3 border-t">
                                                <span>Total</span>
                                                <span className="text-xl">
                                                    ₹{total.toFixed(0)}
                                                </span>
                                            </div>
                                        </div>

                                        {/*<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <p className="text-xs font-medium text-blue-900">
                                                Amount in words
                                            </p>
                                            <p className="text-sm text-blue-800 mt-1 font-medium">
                                                {numberToWords(total)} Only
                                            </p>
                                        </div>*/}
                                    </>
                                )}

                                {items.length === 0 && (
                                    <p className="text-center text-gray-500 py-8">
                                        Add items to see summary
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Info */}
                        <Card className="bg-linear-to-r from-indigo-50 to-purple-50 border-indigo-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">
                                    Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-xs text-gray-700 space-y-2">
                                    <li>• GST is auto-calculated at 18%</li>
                                    <li>• Use clear fee descriptions</li>
                                    <li>• Preview before sending</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
