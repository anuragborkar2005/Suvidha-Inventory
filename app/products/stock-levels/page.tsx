import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, Package } from "lucide-react";

export default async function StockLevelPage() {
  const products = await prisma.product.findMany({
    orderBy: { stockQuantity: 'asc' }
  });

  const lowStock = products.filter(p => p.stockQuantity <= p.stockThreshold);
  const outOfStock = products.filter(p => p.stockQuantity === 0);
  const healthyStock = products.filter(p => p.stockQuantity > p.stockThreshold);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Stock Levels</h2>
        <p className="text-muted-foreground">Monitor inventory quantities and reorder thresholds.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{outOfStock.length}</div>
            <p className="text-xs text-red-600">Immediate action required</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{lowStock.length}</div>
            <p className="text-xs text-amber-600">Reorder soon</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Healthy Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{healthyStock.length}</div>
            <p className="text-xs text-green-600">Inventory looks good</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const stockPercent = Math.min(100, (product.stockQuantity / (product.stockThreshold * 2)) * 100);
                const isOutOfStock = product.stockQuantity === 0;
                const isLowStock = product.stockQuantity <= product.stockThreshold;

                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        {product.name}
                      </div>
                    </TableCell>
                    <TableCell className="w-[300px]">
                      <div className="space-y-1">
                        <Progress 
                          value={stockPercent} 
                          className={`h-2 ${isOutOfStock ? 'bg-red-100' : isLowStock ? 'bg-amber-100' : 'bg-green-100'}`}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {isOutOfStock ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" /> Out of Stock
                        </Badge>
                      ) : isLowStock ? (
                        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 gap-1">
                          <AlertTriangle className="h-3 w-3" /> Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Healthy
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {product.stockQuantity} / {product.stockThreshold}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
