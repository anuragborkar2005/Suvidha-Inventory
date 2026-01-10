"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  useEffect(() => {
  fetch("/api/user")
    .then((res) => {
      if (res.status === 403) {
        alert("Access denied: Only Super Admin can manage users.");
        window.location.href = "/";
      }
    });
}, []);


  async function loadUsers() {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users", error);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function createUser() {
    try {
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setOpen(false);
      setForm({ name: "", email: "", password: "", role: "staff" });
      loadUsers();
    } catch (error) {
      console.error("Failed to create user", error);
    }
  }

  async function changeRole(userId: string, role: string) {
    try {
      await fetch(`/api/user/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      loadUsers();
    } catch (error) {
      console.error("Failed to update role", error);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">User Management</h1>

      <Button onClick={() => setOpen(true)}>➕ Add User</Button>

      <div className="border rounded-md">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex items-center justify-between p-3 border-b"
          >
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-muted-foreground">{u.email}</p>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-sm">Role:</span>

              <select
                value={u.role}
                onChange={(e) => changeRole(u.id, e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="staff">staff</option>
                <option value="admin">admin</option>
                <option value="superadmin">superadmin</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-[400px] space-y-4">
            <h2 className="text-lg font-semibold">Add New User</h2>

            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
              className="border rounded px-2 py-1 w-full"
            >
              <option value="staff">staff</option>
              <option value="admin">admin</option>
              <option value="superadmin">superadmin</option>
            </select>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createUser}>Create</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
