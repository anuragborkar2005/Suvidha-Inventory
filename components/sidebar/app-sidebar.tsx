"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AppSidebar() {
  const [role, setRole] = useState<string | null>(null);

  async function loadProfile() {
    try {
      const res = await fetch("/api/auth/profile"); // ✅ FIXED PATH
      if (!res.ok) return;

      const data = await res.json();
      console.log("👤 PROFILE DATA:", data);

      if (data?.success) {
        setRole(data.data.role);
      } else {
        setRole(null);
      }
    } catch (error) {
      console.error("Profile load failed", error);
      setRole(null);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <aside className="w-64 border-r min-h-screen p-4 space-y-3">
      <Link href="/" className="block font-medium">
        Dashboard
      </Link>

      <Link href="/products/all" className="block">
        Products
      </Link>

      <Link href="/sales/new-sale" className="block">
        Sales
      </Link>

      {/* ✅ ONLY SUPERADMIN CAN SEE USERS */}
      {role === "superadmin" && (
        <Link href="/settings/user" className="block font-semibold">
          Users
        </Link>
      )}
    </aside>
  );
}
