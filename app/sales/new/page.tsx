"use client";

import { useState, useEffect } from "react";
import { createSale } from "@/app/actions/createSale";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// type for dynamic adding
type Item = { id: string; name: string; price: number; qty: number };
type Product = { id: string; name: string; sellingPrice: number; barcode: string };

export default function NewSalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [studentName, setStudentName] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [barcode, setBarcode] = useState("");

  // Load products for dropdown/autocomplete
  useEffect(() => {
    fetch("/api/products") // <-- must exist
      .then(r => r.json())
      .then(setProducts)
      .catch(() => toast.error("Failed loading inventory"));
  }, []);

  // Auto add item via barcode
  const scanBarcode = async () => {
    if (!barcode.trim()) return;

    const res = await fetch(`/api/products/by-barcode/${barcode}`);
    const product = await res.json();

    if (!product) return toast.error("Product not found");

    addItem(product);
    setBarcode("");
  };

  // Add item to list
  const addItem = (p: Product) => {
    setItems(prev => {
      const exist = prev.find(i => i.id === p.id);
      if (exist) {
        return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { id: p.id, name: p.name, price: p.sellingPrice, qty: 1 }];
    });

    toast.success(`${p.name} added`);
  };

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const total = subtotal;

  // Save Sale → Invoice created
  const saveSale = async () => {
    if (!studentName.trim()) return toast.error("Enter name");
    if (items.length == 0) return toast.error("Add items first");

    const res = await createSale({ studentName, items });
    if (res.success) toast.success("Sale Completed");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">New Sale (POS Mode)</h1>
        <Link className="underline" href="/sales">← Back to Sales</Link>
      </div>

      <Card className="p-4 mb-4">
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Customer/Student Name"
            value={studentName}
            onChange={e => setStudentName(e.target.value)}
            className="mb-2"
          />
        </CardContent>
      </Card>

      <Card className="p-4">
        <CardHeader>
          <CardTitle>Add Items</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* BARCODE */}
          <div className="flex gap-2">
            <Input
              placeholder="Scan Barcode"
              value={barcode}
              onChange={e => setBarcode(e.target.value)}
              onKeyDown={e => e.key === "Enter" && scanBarcode()}
            />
            <Button onClick={scanBarcode}>Scan</Button>
          </div>

          {/* AUTOCOMPLETE DROPDOWN */}
          <div className="relative">
            <Input
              placeholder="Search & Select Product"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search.length > 0 && (
              <div className="absolute bg-white shadow-lg border w-full rounded mt-1 max-h-48 overflow-auto z-10">
                {products
                  .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
                  .map(p => (
                    <div
                      key={p.id}
                      onClick={() => { addItem(p); setSearch(""); }}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      {p.name} — ₹{p.sellingPrice}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <Separator />

          {/* ITEM LIST */}
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th>Name</th><th>Qty</th><th>Price</th><th>Total</th><th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id} className="border-b">
                  <td>{i.name}</td>
                  <td>
                    <Input
                      type="number" min="1"
                      value={i.qty}
                      onChange={e => setItems(prev =>
                        prev.map(x => x.id === i.id ? { ...x, qty: +e.target.value } : x)
                      )}
                      className="w-16"
                    />
                  </td>
                  <td>₹{i.price}</td>
                  <td>₹{i.price * i.qty}</td>
                  <td>
                    <Button variant="destructive" size="sm"
                      onClick={() => setItems(prev => prev.filter(x => x.id !== i.id))}
                    >X</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Divider/>

          <div className="text-right text-xl font-bold">
            Total: ₹{total}
          </div>

          <Button className="w-full" onClick={saveSale}>Complete Sale</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Divider() {
  return <div className="h-[1px] bg-gray-300 my-3" />;
}
