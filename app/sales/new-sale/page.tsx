"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Trash2,
    Search,
    Barcode,
    ShoppingCart,
    Plus,
    Minus,
    CreditCard,
    Banknote,
    Wallet,
    CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

type Item = {
    id: string; // cart row id
    productId: string; // real DB product id
    name: string;
    price: number;
    qty: number;
    category: string;
};

export default function SalesPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [query, setQuery] = useState("");
    const [studentName, setStudentName] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi">(
        "cash",
    );
    const [showSuccess, setShowSuccess] = useState(false);
    const [lastSaleId, setLastSaleId] = useState<string | null>(null);
    const [lastSaleData, setLastSaleData] = useState<{
        items: Item[];
        total: number;
        tax: number;
        subtotal: number;
        studentName: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const barcodeInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
        setTimeout(() => {
            barcodeInputRef.current?.focus();
        }, 100);
    }, []);

    async function loadSuggestions(text: string) {
        setQuery(text);
        if (!text || text.length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            const res = await fetch(`/api/products/search?q=${text}`);
            const data = await res.json();
            setSuggestions(data);
        } catch (err) {
            console.error("Search failed", err);
        }
    }

    function addProductToCart(product: any) {
        const existingItem = items.find((i) => i.productId === product.id);
        if (existingItem) {
            updateQty(existingItem.id, existingItem.qty + 1);
        } else {
            setItems((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    productId: product.id,
                    name: product.name,
                    price: Number(product.sellingPrice),
                    qty: 1,
                    category: product.category,
                },
            ]);
        }
        setQuery("");
        setSuggestions([]);
        barcodeInputRef.current?.focus();
    }

    async function handleBarcodeScan(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key !== "Enter") return;
        const barcode = (e.target as HTMLInputElement).value.trim();
        if (!barcode) return;

        try {
            const res = await fetch(`/api/products/barcode/${barcode}`);
            if (!res.ok) {
                if (res.status === 404) {
                    toast.error("Product not found");
                } else {
                    toast.error("Barcode lookup failed");
                }
                return;
            }
            const product = await res.json();

            addProductToCart(product);
            toast.success(`${product.name} added`);
            (e.target as HTMLInputElement).value = "";
        } catch (error) {
            toast.error("An error occurred during barcode lookup");
        }
    }

    function updateQty(id: string, qty: number) {
        if (qty < 1) return;
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
    }

    function removeItem(id: string) {
        setItems((prev) => prev.filter((i) => i.id !== id));
    }

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0,
    );
    const tax = subtotal * 0.18; // 18% GST example
    const total = subtotal + tax;

    async function completeSale() {
        if (items.length === 0) {
            toast.error("No items in cart");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/sales/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    paymentMethod,
                    totalAmount: total,
                    subtotal,
                    tax,
                    customerName: studentName || "General Customer",
                }),
            });

            if (!res.ok) throw new Error("Sale failed");

            const data = await res.json();
            setLastSaleId(
                data.receiptId || "REC-" + Math.floor(Math.random() * 100000),
            );
            setLastSaleData({
                items: [...items],
                total,
                tax,
                subtotal,
                studentName: studentName || "General Customer",
            });
            setShowSuccess(true);
            setItems([]);
            setStudentName("");
            toast.success("Sale completed successfully");
        } catch (error) {
            toast.error("Failed to complete sale");
        } finally {
            setLoading(false);
        }
    }

    function handlePrint() {
        window.print();
    }

    if (!mounted) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full p-6">
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
                <div className="lg:col-span-4">
                    <Skeleton className="h-[500px] w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* LEFT COLUMN - SEARCH & CART */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Search className="h-5 w-5" /> Product Selection
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="student-name">
                                Student / Customer Name
                            </Label>
                            <Input
                                id="student-name"
                                placeholder="Enter student name..."
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                className="h-10"
                            />
                        </div>
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Barcode className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    ref={barcodeInputRef}
                                    placeholder="Scan barcode..."
                                    className="pl-9 h-10"
                                    onKeyDown={handleBarcodeScan}
                                />
                            </div>
                            <div className="relative flex-2">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search products by name or category..."
                                    className="pl-9 h-10"
                                    value={query}
                                    onChange={(e) =>
                                        loadSuggestions(e.target.value)
                                    }
                                />
                                {suggestions.length > 0 && (
                                    <div className="absolute z-50 bg-popover border rounded-md shadow-lg w-full mt-1 overflow-hidden">
                                        {suggestions.map((p) => (
                                            <div
                                                key={p.id}
                                                onClick={() =>
                                                    addProductToCart(p)
                                                }
                                                className="px-4 py-2 cursor-pointer hover:bg-accent text-sm flex justify-between items-center transition-colors"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {p.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {p.category}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold">
                                                        ₹{p.sellingPrice}
                                                    </span>
                                                    <Badge
                                                        variant={
                                                            p.stockQuantity > 0
                                                                ? "outline"
                                                                : "destructive"
                                                        }
                                                    >
                                                        {p.stockQuantity} in
                                                        stock
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1 shadow-sm overflow-hidden flex flex-col">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" /> Shopping Cart
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[300px]">
                                        Product
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Quantity
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Unit Price
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Total
                                    </TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <ShoppingCart className="h-8 w-8 opacity-20" />
                                                <p>No items in cart</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="hover:bg-accent/5 transition-colors"
                                        >
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground uppercase">
                                                        {item.category}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() =>
                                                            updateQty(
                                                                item.id,
                                                                item.qty - 1,
                                                            )
                                                        }
                                                        disabled={item.qty <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center font-medium">
                                                        {item.qty}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() =>
                                                            updateQty(
                                                                item.id,
                                                                item.qty + 1,
                                                            )
                                                        }
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                ₹{item.price.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right font-bold">
                                                ₹
                                                {(
                                                    item.price * item.qty
                                                ).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() =>
                                                        removeItem(item.id)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT COLUMN - SUMMARY & PAYMENT */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <Card className="shadow-sm border-primary/20 bg-primary/2">
                    <CardHeader>
                        <CardTitle className="text-lg">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Subtotal
                                </span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    GST (18%)
                                </span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-2xl font-black text-primary">
                                    ₹{total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3 pt-2">
                            <p className="text-sm font-medium">
                                Payment Method
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    variant={
                                        paymentMethod === "cash"
                                            ? "default"
                                            : "outline"
                                    }
                                    className="flex flex-col h-16 gap-1"
                                    onClick={() => setPaymentMethod("cash")}
                                >
                                    <Banknote className="h-4 w-4" />
                                    <span className="text-[10px]">Cash</span>
                                </Button>
                                <Button
                                    variant={
                                        paymentMethod === "card"
                                            ? "default"
                                            : "outline"
                                    }
                                    className="flex flex-col h-16 gap-1"
                                    onClick={() => setPaymentMethod("card")}
                                >
                                    <CreditCard className="h-4 w-4" />
                                    <span className="text-[10px]">Card</span>
                                </Button>
                                <Button
                                    variant={
                                        paymentMethod === "upi"
                                            ? "default"
                                            : "outline"
                                    }
                                    className="flex flex-col h-16 gap-1"
                                    onClick={() => setPaymentMethod("upi")}
                                >
                                    <Wallet className="h-4 w-4" />
                                    <span className="text-[10px]">UPI</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            size="lg"
                            className="w-full h-14 text-lg font-bold"
                            onClick={completeSale}
                            disabled={items.length === 0 || loading}
                        >
                            {loading ? "Processing..." : "Complete Checkout"}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="bg-muted/30 border rounded-lg p-4 text-xs text-muted-foreground space-y-2">
                    <p className="font-semibold text-foreground">Shortcuts</p>
                    <div className="flex justify-between">
                        <span>Focus Barcode</span>
                        <kbd className="px-1 bg-background border rounded">
                            F2
                        </kbd>
                    </div>
                    <div className="flex justify-between">
                        <span>Complete Sale</span>
                        <kbd className="px-1 bg-background border rounded">
                            F10
                        </kbd>
                    </div>
                </div>
            </div>

            {/* SUCCESS DIALOG */}
            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="sm:max-w-[400px]">
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl">
                                Sale Completed!
                            </DialogTitle>
                            <DialogDescription className="text-lg font-medium text-foreground">
                                Amount: ₹{total.toFixed(2)}
                            </DialogDescription>
                        </div>
                        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md w-full">
                            Receipt ID:{" "}
                            <span className="font-mono font-bold">
                                {lastSaleId}
                            </span>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-center flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowSuccess(false)}
                        >
                            Close
                        </Button>
                        <Button onClick={handlePrint}>Print Receipt</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* PRINTABLE RECEIPT (Hidden in UI, Visible in Print) */}
            <div
                id="printable-receipt"
                className="fixed left-[-9999px] top-0 w-[300px] bg-white text-black p-4 font-mono text-sm border"
            >
                <div className="text-center mb-4">
                    <h1 className="text-xl font-bold uppercase">
                        Suvidha Inventory
                    </h1>
                    <p className="text-xs">Main Bazaar, Suvidha City</p>
                    <p className="text-xs">Phone: +91 9876543210</p>
                    <div className="border-b border-dashed my-2"></div>
                    <h2 className="text-sm font-bold">FEE RECEIPT</h2>
                    <div className="border-b border-dashed my-2"></div>
                </div>

                <div className="mb-4 space-y-1">
                    <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Receipt:</span>
                        <span className="font-bold">{lastSaleId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Student:</span>
                        <span className="font-bold uppercase">
                            {lastSaleData?.studentName}
                        </span>
                    </div>
                </div>

                <div className="border-b border-gray-300 pb-1 mb-2 font-bold flex text-[10px]">
                    <span className="flex-1">Item</span>
                    <span className="w-8 text-center">Qty</span>
                    <span className="w-16 text-right">Total</span>
                </div>

                <div className="space-y-1 mb-4">
                    {lastSaleData?.items.map((item, idx) => (
                        <div key={idx} className="flex text-[10px]">
                            <span className="flex-1 truncate">{item.name}</span>
                            <span className="w-8 text-center">{item.qty}</span>
                            <span className="w-16 text-right">
                                ₹{(item.price * item.qty).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="border-t border-dashed pt-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{lastSaleData?.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>GST (18%):</span>
                        <span>₹{lastSaleData?.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm pt-1 border-t border-double mt-1">
                        <span>TOTAL:</span>
                        <span>₹{lastSaleData?.total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="mt-6 text-center text-[10px]">
                    <p>Payment: {paymentMethod.toUpperCase()}</p>
                    <p className="mt-4 font-bold">THANK YOU!</p>
                    <p>This is a computer generated receipt.</p>
                </div>
            </div>
        </div>
    );
}
