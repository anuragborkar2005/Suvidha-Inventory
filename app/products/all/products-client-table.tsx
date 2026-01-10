"use client";

import { useState } from "react";
import { hasPermission } from "@/lib/rbac";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProductsClientTable({
  products,
  userRole,
}: {
  products: any[];
  userRole: string;
}) {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    barcode: "",
    category: "",
    stockQuantity: "",
    stockThreshold: "",
    costPrice: "",
    sellingPrice: "",
  });

  async function saveChanges() {
    if (!selectedProduct) return;

    setLoading(true);

    await fetch(`/api/products/${selectedProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedProduct),
    });

    setLoading(false);
    setSelectedProduct(null);
    window.location.reload();
  }

  async function createProduct() {
    setLoading(true);

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    setLoading(false);
    setShowAdd(false);
    window.location.reload();
  }

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold">Products</h2>

        {hasPermission(userRole as any, "editProducts") && (
          <Button onClick={() => setShowAdd(true)}>
            ➕ Add Product
          </Button>
        )}
      </div>

      {/* TABLE */}
      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.stockQuantity}</TableCell>
                <TableCell>₹{p.sellingPrice}</TableCell>

                <TableCell>
                  {hasPermission(userRole as any, "editProducts") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedProduct(p)}
                    >
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* EDIT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-[400px] space-y-3">
            <h2 className="font-semibold">Edit Product</h2>

            <Input
              placeholder="Stock Quantity"
              value={selectedProduct.stockQuantity}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  stockQuantity: e.target.value,
                })
              }
            />

            <Input
              placeholder="Selling Price"
              value={selectedProduct.sellingPrice}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  sellingPrice: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedProduct(null)}
              >
                Cancel
              </Button>
              <Button onClick={saveChanges} disabled={loading}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-[420px] space-y-3">
            <h2 className="font-semibold">Add Product</h2>

            <Input
              placeholder="Name"
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <Input
              placeholder="Barcode"
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  barcode: e.target.value,
                })
              }
            />
            <Input
              placeholder="Category"
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  category: e.target.value,
                })
              }
            />
            <Input
              placeholder="Stock Quantity"
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  stockQuantity: e.target.value,
                })
              }
            />
            <Input
              placeholder="Stock Threshold"
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  stockThreshold: e.target.value,
                })
              }
            />
            <Input
              placeholder="Cost Price"
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  costPrice: e.target.value,
                })
              }
            />
            <Input
              placeholder="Selling Price"
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  sellingPrice: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </Button>
              <Button onClick={createProduct} disabled={loading}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
