"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Barcode } from "lucide-react";
import { toast } from "sonner";

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export default function NewSalePage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  // ✅ Scan barcode and add product
  const handleBarcodeScan = async (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;

    const barcode = (e.target as HTMLInputElement).value.trim();
    if (!barcode) return;

    try {
      const res = await fetch(`/api/products/by-barcode/${barcode}`);
      const product = await res.json();

      if (!res.ok || !product) {
        toast.error("Product not found");
        return;
      }

      setItems((prev) => {
        const existing = prev.find((i) => i.id === product.id);

        if (existing) {
          return prev.map((i) =>
            i.id === product.id
              ? { ...i, qty: i.qty + 1 }
              : i,
          );
        }

        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: Number(product.sellingPrice),
            qty: 1,
          },
        ];
      });

      toast.success(`${product.name} added`);
      (e.target as HTMLInputElement).value = "";
    } catch {
      toast.error("Scan failed");
    }
  };

  // ✅ Add empty manual item
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        price: 0,
        qty: 1,
      },
    ]);
  };

  // ✅ Update item
  const updateItem = (
    id: string,
    field: keyof CartItem,
    value: any,
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  // ✅ Remove item
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  // ✅ Save sale and reduce stock
  const saveSale = async () => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setLoading(true);

      for (const item of items) {
        await fetch("/api/sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.id,
            quantity: item.qty,
          }),
        });
      }

      toast.success("Sale completed successfully");
      setItems([]);
    } catch {
      toast.error("Sale failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">New Sale</h1>

      {/* Barcode Input */}
      <div className="flex gap-3">
        <Input
          ref={barcodeInputRef}
          placeholder="Scan barcode and press Enter"
          onKeyDown={handleBarcodeScan}
        />
        <Button variant="outline">
          <Barcode className="w-4 h-4 mr-2" />
          Scan
        </Button>
      </div>

      {/* Add Item */}
      <Button onClick={addItem} size="sm">
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>

      {/* Items Table */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">Amount</th>
              <th className="p-2"></th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center p-6 text-gray-500"
                >
                  No items added
                </td>
              </tr>
            )}

            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2">
                  <Input
                    value={item.name}
                    placeholder="Product name"
                    onChange={(e) =>
                      updateItem(item.id, "name", e.target.value)
                    }
                  />
                </td>

                <td className="p-2 text-center">
                  <Input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "qty",
                        Number(e.target.value),
                      )
                    }
                    className="w-20 mx-auto text-center"
                  />
                </td>

                <td className="p-2 text-right">
                  <Input
                    type="number"
                    min={0}
                    value={item.price}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "price",
                        Number(e.target.value),
                      )
                    }
                    className="w-28 text-right"
                  />
                </td>

                <td className="p-2 text-right font-medium">
                  ₹{(item.price * item.qty).toFixed(0)}
                </td>

                <td className="p-2 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-80 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(0)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (18%)</span>
            <span>₹{gst.toFixed(0)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{total.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={saveSale}
          disabled={loading}
        >
          {loading ? "Processing..." : "Save Sale"}
        </Button>
      </div>
    </div>
  );
}
