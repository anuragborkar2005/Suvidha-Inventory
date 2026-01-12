"use client";

import Link from "next/link";
import { hasPermission } from "@/lib/rbac";

type Role = "superadmin" | "admin" | "staff";

interface AppSidebarProps {
  role: Role;
}

export default function AppSidebar({ role }: AppSidebarProps) {
  return (
    <aside className="w-64 border-r min-h-screen p-4 space-y-3">
      <Link href="/dashboard" className="block font-medium">
        Dashboard
      </Link>

      <Link href="/products/all" className="block">
        Products
      </Link>

      <Link href="/sales/new-sale" className="block">
        Sales
      </Link>

      {/* ✅ Only superadmin can see Users */}
      {hasPermission(role, "manageUsers") && (
        <Link href="/settings/user" className="block">
          Users
        </Link>
      )}
    </aside>
  );
}
