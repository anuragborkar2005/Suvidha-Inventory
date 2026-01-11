"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadUsers() {
    const res = await fetch("/api/user");
    const data = await res.json();
    setUsers(data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function changeRole(email: string, role: string) {
    try {
      setLoading(true);

      const res = await fetch(`/api/user/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      await loadUsers();
      alert("✅ Role updated successfully");

    } catch (error) {
      console.error("ROLE UPDATE ERROR:", error);
      alert("❌ Failed to update role");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">User Management</h1>

      <table className="w-full border text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2 text-left">Role</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.email}>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2 font-medium">{u.role}</td>
              <td className="border p-2 text-center space-x-2">
                <Button
                  size="sm"
                  disabled={loading}
                  onClick={() => changeRole(u.email, "admin")}
                >
                  Make Admin
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={loading}
                  onClick={() => changeRole(u.email, "staff")}
                >
                  Make Staff
                </Button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
