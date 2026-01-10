"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

type Item = {
  id: string;          // cart row id
  productId: string;  // real DB product id
  name: string;
  price: number;
  qty: number;
};

export default function SalesPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  // ===============================
  // 🔍 PRODUCT AUTOCOMPLETE SEARCH
  // ===============================
  async function loadSuggestions(text: string) {
    setQuery(text);

    if (!text) {
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

  function selectProduct(product: any) {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        productId: product.id,     // ✅ store DB id
        name: product.name,
        price: Number(product.sellingPrice),
        qty: 1,
      },
    ]);

    setQuery("");
    setSuggestions([]);
  }

  // ===============================
  // 📦 BARCODE SCAN AUTO ADD
  // ===============================
  async function handleBarcodeScan(
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key !== "Enter") return;

    const barcode = (e.target as HTMLInputElement).value.trim();
    if (!barcode) return;

    try {
      const res = await fetch(`/api/products/by-barcode/${barcode}`);
      const product = await res.json();

      if (!product?.id) {
        toast.error("Product not found");
        return;
      }

      setItems((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          productId: product.id,   // ✅ store DB id
          name: product.name,
          price: Number(product.sellingPrice),
          qty: 1,
        },
      ]);

      toast.success(`${product.name} added`);
      (e.target as HTMLInputElement).value = "";
    } catch (error) {
      toast.error("Barcode lookup failed");
    }
  }

  // ===============================
  // 🧮 ITEM OPERATIONS
  // ===============================
  function updateQty(id: string, qty: number) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty } : i)),
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  // ===============================
  // ✅ COMPLETE SALE
  // ===============================
  async function completeSale() {
    if (items.length === 0) {
      toast.error("No items in cart");
      return;
    }

    try {
      const res = await fetch("/api/sales/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        throw new Error("Sale failed");
      }

      toast.success("Sale completed successfully ✅");

      // ✅ Clear cart
      setItems([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to complete sale");
    }
  }

  // ===============================
  // 🖥 UI
  // ===============================
  return (
    <div className="p-6 space-y-6 max-w-3xl">

      <h1 className="text-xl font-semibold">🧾 New Sale</h1>

      {/* Barcode Input */}
      <Input
        ref={barcodeInputRef}
        placeholder="Scan barcode and press Enter..."
        onKeyDown={handleBarcodeScan}
      />

      {/* Product Search */}
      <div className="relative">
        <Input
          placeholder="Type product name..."
          value={query}
          onChange={(e) => loadSuggestions(e.target.value)}
        />

        {suggestions.length > 0 && (
          <div className="absolute z-50 bg-white border rounded shadow w-full mt-1">
            {suggestions.map((p) => (
              <div
                key={p.id}
                onClick={() => selectProduct(p)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm flex justify-between"
              >
                <span>{p.name}</span>
                <span className="text-gray-500">
                  ₹{p.sellingPrice}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Table */}
      <div className="border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2">{item.name}</td>

                <td className="p-2 text-center">
                  <Input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) =>
                      updateQty(item.id, Number(e.target.value))
                    }
                    className="w-16 text-center"
                  />
                </td>

                <td className="p-2 text-right">
                  ₹{item.price}
                </td>

                <td className="p-2 text-right font-medium">
                  ₹{item.price * item.qty}
                </td>

                <td className="p-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No products added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>₹ {total}</span>
      </div>

      <Button size="lg" onClick={completeSale}>
        Complete Sale
      </Button>
    </div>
  );
}
