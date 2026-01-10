"use client";

import { useEffect, useState } from "react";

export default function ProfileBadge() {
  const [profile, setProfile] = useState<any>(null);

  async function loadProfile() {
    const res = await fetch("/api/auth/profile");
    const data = await res.json();
    if (data.success) setProfile(data.data);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (!profile) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-semibold">{profile.name}</p>
        <p className="text-xs text-gray-500 capitalize">
          {profile.role}
        </p>
      </div>
      <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
        {profile.name?.[0]?.toUpperCase()}
      </div>
    </div>
  );
}
