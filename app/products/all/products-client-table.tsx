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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProductsClientTable({
  products,
  userRole,
}: {
  products: any[];
  userRole: string;
}) {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
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

      {/* Edit Modal */}
      {selectedProduct && (
        <Dialog open onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>

            <div className="grid gap-3">
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

              <Input
                placeholder="Cost Price"
                value={selectedProduct.costPrice}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    costPrice: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Category"
                value={selectedProduct.category}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    category: e.target.value,
                  })
                }
              />
            </div>

            <Button disabled={loading} onClick={saveChanges}>
              Save Changes
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
