"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StockAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  async function loadAlerts() {
    try {
      const res = await fetch("/api/products");
      const products = await res.json();

      const low = products.filter(
        (p: any) => p.stockQuantity <= p.stockThreshold,
      );

      setAlerts(low.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    setMounted(true);
    loadAlerts();
    const interval = setInterval(loadAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-2 py-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!alerts.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
        <p>No low stock alerts</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span className="text-xs text-muted-foreground">Threshold: {item.stockThreshold}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                 <Badge variant={item.stockQuantity === 0 ? "destructive" : "outline"}>
                   {item.stockQuantity}
                 </Badge>
              </TableCell>
              <TableCell className="text-right">
                <AlertTriangle className="h-4 w-4 text-amber-500 inline" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
