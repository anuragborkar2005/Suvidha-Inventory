"use client";
import { useState, useEffect, useRef } from "react";
import { createSale } from "@/app/actions/createSale"; // server action
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";

import { Plus, Trash2, Calendar as CalendarIcon, IndianRupee, Barcode } from "lucide-react";
import { format } from "date-fns";

export default function SalesPage() {

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [studentName, setStudentName] = useState("");
    const barcodeInputRef = useRef<HTMLInputElement>(null);

    const [items, setItems] = useState<
        { id: string; name: string; price: number; qty: number }[]
    >([]);

    useEffect(() => {
        barcodeInputRef.current?.focus();
    }, []);

    // ---------- Barcode Add ----------
    const handleBarcodeScan = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;
    
        const barcode = e.currentTarget.value.trim();
        const res = await fetch(`/api/products/by-barcode/${barcode}`);
        const product = await res.json();
    
        if (!product) {
          toast.error("Product not found");
          return;
        }
    
        setItems(prev => [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: Number(product.sellingPrice),
            qty: 1,
          }
        ]);
    
        toast.success(`${product.name} added`);
        e.currentTarget.value = "";
    };

    // ---------- Add / Edit / Remove ----------
    const addItem = () => {
        setItems([...items, { id: crypto.randomUUID(), name: "", price: 0, qty: 1 }]);
    };

    const updateItem = (id: string, key: string, value: any) => {
        setItems(items.map(i => i.id === id ? { ...i, [key]: value } : i));
    };

    const removeItem = (id: string) => {
        setItems(items.filter(i => i.id !== id));
    };

    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const gst = subtotal * 0.18;
    const total = subtotal ;

    // ---------- Submit ----------
    async function handleSubmit() {
        if (!studentName.trim()) return toast.error("Enter student name");
        if (items.length === 0) return toast.error("Add at least one item");

        const res = await createSale({ studentName, date, items });

        if (res.success) toast.success("Invoice Saved Successfully");
        else toast.error("Failed to save");
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
                    <p className="text-gray-600 mt-1">Generate professional fee receipts for students</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT SIDE */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-xl rounded-xl">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Invoice Details</CardTitle>
                                        <CardDescription>Fill student & fee details</CardDescription>
                                    </div>
                                    <Badge variant="secondary">Draft</Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-8">

                                {/* Student + Date */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label>Student Name</Label>
                                        <Input placeholder="e.g Priya Singh"
                                            value={studentName}
                                            onChange={(e) => setStudentName(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label>Invoice Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full text-left">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {format(date!, "PPP")}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar selected={date} onSelect={setDate} mode="single"/>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <Separator />

                                {/* Barcode + Add */}
                                <div className="flex gap-3">
                                    <Input
                                        placeholder="Scan barcode..."
                                        ref={barcodeInputRef}
                                        onKeyDown={handleBarcodeScan}
                                        className="w-60"
                                    />
                                    <Button size="sm" onClick={addItem}>
                                        <Plus className="h-4 w-4 mr-2" /> Add Item
                                    </Button>
                                </div>

                                {/* Items Table */}
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-center">Qty</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                            <TableHead />
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {items.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                                    No items added
                                                </TableCell>
                                            </TableRow>
                                        )}

                                        {items.map(item => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <Input
                                                        value={item.name}
                                                        onChange={e => updateItem(item.id,"name",e.target.value)}
                                                        className="border-0"
                                                    />
                                                </TableCell>

                                                <TableCell className="text-center">
                                                    <Input type="number" min={1}
                                                        value={item.qty}
                                                        onChange={e => updateItem(item.id,"qty",Number(e.target.value))}
                                                        className="w-20 text-center border-0"
                                                    />
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <Input type="number" min={0}
                                                        value={item.price}
                                                        onChange={e => updateItem(item.id,"price",Number(e.target.value))}
                                                        className="w-28 text-right border-0"
                                                    />
                                                </TableCell>

                                                <TableCell className="text-right font-medium">
                                                    ₹ {(item.price * item.qty).toLocaleString("en-IN")}
                                                </TableCell>

                                                <TableCell>
                                                    <Button size="icon" variant="ghost"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-red-600">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className="flex gap-3 pt-4">
                                    <Button className="flex-1" onClick={handleSubmit}>Save & Send Invoice</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT SUMMARY */}
                    <div className="space-y-6">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="flex gap-2 items-center">
                                    <IndianRupee className="h-5 w-5" /> Invoice Summary
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-6">

                                {items.map(i => (
                                    <div key={i.id} className="flex justify-between text-sm">
                                        <span>{i.name} {i.qty > 1 && "×"+i.qty}</span>
                                        <span>₹ {(i.qty * i.price).toLocaleString("en-IN")}</span>
                                    </div>
                                ))}

                                <Separator/>

                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>GST (18%)</span>
                                    <span>₹{gst.toFixed(0)}</span>
                                </div>

                                <div className="flex justify-between font-bold text-lg border-t pt-3">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(0)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
