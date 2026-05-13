"use client";

import { useState, useEffect } from "react";
import { hasPermission } from "@/lib/rbac";
import { Skeleton } from "@/components/ui/skeleton";
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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function ProductsClientTable({
  products,
  userRole,
}: {
  products: any[];
  userRole: string;
}) {
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    barcode: "",
    category: "",
    stockQuantity: 0,
    stockThreshold: 30,
    costPrice: 0,
    sellingPrice: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode?.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  async function saveChanges() {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedProduct),
      });
      if (res.ok) {
        toast.success("Product updated successfully");
        window.location.reload();
      } else {
        toast.error("Failed to update product");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
      setSelectedProduct(null);
    }
  }

  async function createProduct() {
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        toast.success("Product created successfully");
        window.location.reload();
      } else {
        toast.error("Failed to create product");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
      setShowAdd(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Product deleted successfully");
        window.location.reload();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  }

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-10 w-full sm:w-72" />
          <Skeleton className="h-10 w-full sm:w-32" />
        </div>
        <div className="rounded-md border bg-card shadow-sm">
          <div className="p-4 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {hasPermission(userRole as any, "editProducts") && (
          <Button onClick={() => setShowAdd(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{p.barcode || "No barcode"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {p.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className={p.stockQuantity <= p.stockThreshold ? "text-red-600 font-bold" : ""}>
                        {p.stockQuantity}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Min: {p.stockThreshold}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ₹{Number(p.sellingPrice).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {hasPermission(userRole as any, "editProducts") && (
                          <>
                            <DropdownMenuItem onClick={() => setSelectedProduct({
                              ...p,
                              stockQuantity: Number(p.stockQuantity),
                              stockThreshold: Number(p.stockThreshold),
                              costPrice: Number(p.costPrice),
                              sellingPrice: Number(p.sellingPrice)
                            })}>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => deleteProduct(p.id)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* EDIT DIALOG */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  value={selectedProduct.name}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stock" className="text-right">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={selectedProduct.stockQuantity}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, stockQuantity: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={selectedProduct.sellingPrice}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, sellingPrice: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProduct(null)}>Cancel</Button>
            <Button onClick={saveChanges} disabled={loading}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADD DIALOG */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Enter product details to add to your inventory.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="e.g. Milk" onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input id="barcode" placeholder="Optional" onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="e.g. Dairy" onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Initial Stock</Label>
                <Input id="stock" type="number" defaultValue={0} onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost Price (₹)</Label>
                <Input id="cost" type="number" step="0.01" onChange={(e) => setNewProduct({ ...newProduct, costPrice: parseFloat(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="selling">Selling Price (₹)</Label>
                <Input id="selling" type="number" step="0.01" onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: parseFloat(e.target.value) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={createProduct} disabled={loading}>Create Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
