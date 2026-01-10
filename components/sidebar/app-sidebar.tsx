"use client";

import Link from "next/link";
import { hasPermission } from "@/lib/rbac";

type Role = "staff" | "admin" | "superadmin";

export default function AppSidebar({ role }: { role: Role }) {
  return (
    <aside className="w-64 border-r min-h-screen p-4 space-y-3">
      <Link href="/" className="block font-medium">
        Dashboard
      </Link>

      <Link href="/products/all" className="block">
        Products
      </Link>

      {hasPermission(role, "manageUsers") && (
        <Link href="/settings/user" className="block">
          Users
        </Link>
      )}
    </aside>
  );
}
