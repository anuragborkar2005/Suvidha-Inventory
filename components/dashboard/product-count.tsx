"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCount() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  async function loadCount() {
    try {
      const res = await fetch("/api/products");
      const products = await res.json();
      setCount(products.length);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    setMounted(true);
    loadCount();
  }, []);

  if (!mounted) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-16" />
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <h3 className="font-semibold text-blue-700">📦 Total Products</h3>
      <p className="text-3xl font-bold mt-2">{count}</p>
    </div>
  );
}
