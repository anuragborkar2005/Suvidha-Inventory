"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Role = "superadmin" | "admin" | "staff";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [myRole, setMyRole] = useState<Role>("staff");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff" as Role,
  });

  // 🔹 Load logged-in profile
  async function loadProfile() {
    const res = await fetch("/api/profile");
    const data = await res.json();
    if (data?.success) {
      setMyRole(data.data.role);
    }
  }

  // 🔹 Load users list
  async function loadUsers() {
    const res = await fetch("/api/user");
    const data = await res.json();
    setUsers(data || []);
  }

  useEffect(() => {
    loadProfile();
    loadUsers();
  }, []);

  // 🔹 Create user (SUPERADMIN)
  async function createUser() {
    if (!form.name || !form.email || !form.password) {
      alert("All fields required");
      return;
    }

    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const err = await res.text();
      alert(err);
      return;
    }

    setForm({
      name: "",
      email: "",
      password: "",
      role: "staff",
    });

    await loadUsers();
    alert("User created successfully ✅");
  }

  // 🔹 Change user role (SUPERADMIN)
  async function changeRole(email: string, role: Role) {
    const res = await fetch("/api/user/role", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });

    if (!res.ok) {
      const err = await res.text();
      alert("Role update failed: " + err);
      return;
    }

    await loadUsers();
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">👥 User Management</h1>

      {/* ✅ ADD USER FORM (SUPERADMIN ONLY) */}
      {myRole === "superadmin" && (
        <div className="border rounded-xl p-4 space-y-3 bg-muted">
          <h2 className="font-medium">➕ Add New User</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <select
              className="border rounded px-2"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as Role })
              }
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>

          <Button onClick={createUser}>Create User</Button>
        </div>
      )}

      {/* ✅ USERS TABLE */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-center">Role</th>
              {myRole === "superadmin" && (
                <th className="p-2 text-center">Access Control</th>
              )}
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>

                <td className="p-2 text-center capitalize">
                  {u.role}
                </td>

                {/* ✅ ROLE CONTROL (SUPERADMIN ONLY) */}
                {myRole === "superadmin" && (
                  <td className="p-2 text-center">
                    <select
                      className="border rounded px-2 py-1"
                      value={u.role}
                      onChange={(e) =>
                        changeRole(
                          u.email,
                          e.target.value as Role
                        )
                      }
                    >
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">
                        Super Admin
                      </option>
                    </select>
                  </td>
                )}
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-gray-500"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
