"use client";

import { useEffect, useState } from "react";

export default function ProductCount() {
  const [count, setCount] = useState(0);

  async function loadCount() {
    const res = await fetch("/api/products");
    const products = await res.json();
    setCount(products.length);
  }

  useEffect(() => {
    loadCount();
  }, []);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <h3 className="font-semibold text-blue-700">📦 Total Products</h3>
      <p className="text-3xl font-bold mt-2">{count}</p>
    </div>
  );
}
