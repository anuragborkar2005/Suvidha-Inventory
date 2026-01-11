"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hasPermission } from "@/lib/rbac";

type Role = "superadmin" | "admin" | "staff";

export default function AppSidebar() {
  const [role, setRole] = useState<Role>("staff");
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    try {
      const res = await fetch("/api/profile", {
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("Profile API failed:", res.status);
        return;
      }

      const text = await res.text();

      // 🚨 Prevent HTML parsing crash
      if (text.startsWith("<")) {
        console.error("Profile API returned HTML instead of JSON");
        return;
      }

      const data = JSON.parse(text);

      console.log("👤 Loaded profile:", data);

      if (data?.success && data?.data?.role) {
        setRole(data.data.role);
      }
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <aside className="w-64 border-r min-h-screen p-4 text-gray-500">
        Loading...
      </aside>
    );
  }

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

      <Link href="/sales/history" className="block">
        Sales History
      </Link>

      {/* ✅ SUPERADMIN ONLY */}
      {hasPermission(role, "manageUsers") && (
        <Link
          href="/settings/user"
          className="block font-semibold text-blue-600"
        >
          Users
        </Link>
      )}
    </aside>
  );
}
