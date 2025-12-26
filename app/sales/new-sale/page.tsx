"use client";

import { useState, useEffect, useRef } from "react";
import { createSale } from "@/app/actions/createSale";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Plus, Trash2, Calendar as CalendarIcon, IndianRupee } from "lucide-react";
import { format } from "date-fns";

async function getProducts() {
  const res = await fetch("/api/products", { cache: "no-store" });
  return res.json();
}

export default function SalesPage() {
  const [date, setDate] = useState(new Date());
  const [studentName, setStudentName] = useState("");
  const [productList, setProductList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<
    { id: string; name: string; price: number; qty: number }[]
  >([]);

  useEffect(() => {
    getProducts().then(setProductList);
    searchRef.current?.focus();
  }, []);

  // 🔥 Select from dropdown (Not auto add)
  function chooseProduct(p: any) {
    setSelectedProduct(p);
    setSearch(p.name);
  }

  // 🔥 Scan barcode + automatically select product but not add
  const handleBarcodeScan = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    const code = search.trim();
    const res = await fetch(`/api/products/by-barcode/${code}`);
    const product = await res.json();

    if (!product) return toast.error("Product not found");

    setSelectedProduct(product);
    setSearch(product.name);
    toast.info("Product detected — click Add Product");
  };

  // 🔥 Product is added ONLY when this button is clicked
  function addProductToList() {
    if (!selectedProduct) return toast.error("Select product first");

    setItems(prev => [
      ...prev,
      {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: Number(selectedProduct.sellingPrice),
        qty: 1,
      }
    ]);

    toast.success(`${selectedProduct.name} added`);

    setSelectedProduct(null);
    setSearch("");
  }

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const total = subtotal;

  const updateQty = (i: string, qty: number) => {
    setItems(items.map(v => v.id === i ? { ...v, qty } : v));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  async function handleSubmit() {
    if (!studentName.trim()) return toast.error("Enter student name");
    if (items.length === 0) return toast.error("Add items first");

    const res = await createSale({ studentName, date, items });

    if (res.success) {
      toast.success("Invoice Saved Successfully");
      setItems([]);
      setSearch("");
      setSelectedProduct(null);
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold">Create Invoice</h1>
        <p className="text-gray-600 mb-6">Scan barcode or search item and then add manually</p>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-xl">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Invoice</CardTitle>
                  <CardDescription>Billing Panel</CardDescription>
                </div>
                <Badge>Draft</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">

              {/* Student + Date */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Student Name</Label>
                  <Input value={studentName} onChange={e=>setStudentName(e.target.value)}/>
                </div>

                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full text-left">
                        <CalendarIcon className="mr-2"/>{format(date,"PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent><Calendar selected={date} onSelect={(d)=>setDate(d!)} /></PopoverContent>
                  </Popover>
                </div>
              </div>

              <Separator/>

              {/* Unified Input + ADD Button */}
              <div className="flex gap-3 relative">

                <Input
                  ref={searchRef}
                  placeholder="Scan barcode or type product name..."
                  value={search}
                  onChange={e=>{setSearch(e.target.value); setSelectedProduct(null)}}
                  onKeyDown={handleBarcodeScan}
                  className="flex-1"
                />

                <Button onClick={addProductToList}>
                  <Plus size={16} className="mr-1"/> Add Product
                </Button>

                {/* Dropdown */}
                {search && (
                  <div className="absolute bg-white border shadow w-full top-12 z-50 max-h-52 overflow-auto">
                    {productList
                      .filter(p=>p.name.toLowerCase().includes(search.toLowerCase()))
                      .map(p=>(
                        <div key={p.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onMouseDown={()=>chooseProduct(p)}>
                          {p.name} • ₹{Number(p.sellingPrice)}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead/>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-6">No items</TableCell></TableRow>
                  ) : items.map(i => (
                    <TableRow key={i.id}>
                      <TableCell>{i.name}</TableCell>

                      <TableCell className="text-center">
                        <Input type="number" min={1} className="w-20 text-center"
                          value={i.qty} onChange={e=>updateQty(i.id,Number(e.target.value))}/>
                      </TableCell>

                      <TableCell className="text-right">₹{i.price}</TableCell>
                      <TableCell className="text-right font-semibold">₹{i.qty*i.price}</TableCell>

                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={()=>removeItem(i.id)} className="text-red-500">
                          <Trash2 size={16}/>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Button className="w-full mt-4" onClick={handleSubmit}>Save Invoice</Button>
            </CardContent>
          </Card>

          {/* SUMMARY PANEL */}
          <Card className="h-fit sticky top-6">
            <CardHeader><CardTitle><IndianRupee className="inline"/> Summary</CardTitle></CardHeader>
            <CardContent>
              {items.map(i=>(
                <div key={i.id} className="flex justify-between text-sm">
                  <span>{i.name} × {i.qty}</span>
                  <span>₹{i.qty*i.price}</span>
                </div>
              ))}

              <Separator className="my-3"/>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span><span>₹{total}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
