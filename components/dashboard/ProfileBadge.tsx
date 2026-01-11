"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Profile = {
  name: string;
  email: string;
  role: string;
};

export default function ProfileBadge() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  async function loadProfile() {
  try {
    const res = await fetch("/api/profile");

    if (!res.ok) {
      console.error("Profile API failed:", res.status);
      return;
    }

    const text = await res.text();

    // ✅ Prevent HTML parse crash
    if (text.startsWith("<")) {
      console.error("HTML received instead of JSON");
      return;
    }

    const data = JSON.parse(text);

    if (data?.success) {
      setProfile(data.data);
    }
  } catch (err) {
    console.error("Failed to load profile", err);
  }
}


  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div className="flex items-center gap-3">
      {profile ? (
        <div className="text-right">
          <p className="text-sm font-semibold">
            👤 {profile.name}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {profile.role}
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Loading...</p>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={logout}
      >
        Logout
      </Button>
    </div>
  );
}
