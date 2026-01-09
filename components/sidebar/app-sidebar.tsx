"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hasPermission } from "@/lib/rbac";

export default function AppSidebar() {
  const [role, setRole] = useState("staff");

  async function loadSession() {
    const res = await fetch("/api/auth/session");
    const data = await res.json();
    setRole(data?.user?.role ?? "staff");
  }

  useEffect(() => {
    loadSession();
  }, []);

  return (
    <aside className="w-64 border-r min-h-screen p-4 space-y-3">
      <Link href="/" className="block font-medium">
        Dashboard
      </Link>

      <Link href="/products/all" className="block">
        Products
      </Link>

      {hasPermission(role as any, "manageUsers") && (
        <Link href="/settings/user" className="block">
          Users
        </Link>
      )}
    </aside>
  );
}
