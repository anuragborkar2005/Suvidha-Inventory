"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Profile = {
  name: string;
  email: string;
  role: string;
};

export default function ProfileBadge() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mounted, setMounted] = useState(false);

  async function loadProfile() {
    try {
      const res = await fetch("/api/profile");

      if (!res.ok) {
        console.error("Profile API failed:", res.status);
        return;
      }

      const text = await res.text();

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
    setMounted(true);
    loadProfile();
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-right">
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16 ml-auto" />
        </div>
        <Skeleton className="h-9 w-20" />
      </div>
    );
  }

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
        <div className="text-right">
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16 ml-auto" />
        </div>
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
