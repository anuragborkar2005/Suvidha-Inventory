"use client";

import { useEffect, useState } from "react";
import { hasPermission } from "@/lib/rbac";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  const [sessionRole, setSessionRole] = useState("staff");

  async function loadUsers() {
    const res = await fetch("/api/user");
    const data = await res.json();
    setUsers(data);
  }

  async function loadSession() {
    const res = await fetch("/api/auth/session");
    const data = await res.json();
    setSessionRole(data?.user?.role ?? "staff");
  }

  useEffect(() => {
    loadUsers();
    loadSession();
  }, []);

  useEffect(() => {
    if (!hasPermission(sessionRole as any, "manageUsers")) {
      window.location.href = "/";
    }
  }, [sessionRole]);

  async function createUser() {
    await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setOpen(false);
    setForm({ name: "", email: "", password: "", role: "staff" });
    loadUsers();
  }

  async function changeRole(userId: string, role: string) {
    await fetch(`/api/user/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    loadUsers();
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">User Management</h1>

      {hasPermission(sessionRole as any, "manageUsers") && (
        <Button onClick={() => setOpen(true)}>➕ Add User</Button>
      )}

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

              {hasPermission(sessionRole as any, "manageUsers") ? (
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="staff">staff</option>
                  <option value="admin">admin</option>
                  <option value="superadmin">superadmin</option>
                </select>
              ) : (
                <span className="font-semibold">{u.role}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">
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
              className="border rounded px-2 py-1"
            >
              <option value="staff">staff</option>
              <option value="admin">admin</option>
              <option value="superadmin">superadmin</option>
            </select>

            <Button onClick={createUser}>Create User</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
