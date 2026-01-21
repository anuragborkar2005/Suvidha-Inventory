"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/user";

export function useCurrentUser() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/auth/profile");
                if (!res.ok) {
                    throw new Error(`Request failed with status ${res.status}`);
                }
                const text = await res.text();
                if (!text) {
                    throw new Error("Empty response body");
                }
                const data = JSON.parse(text);

                if (data.success) {
                    setUser(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        }

        fetchUser();
    }, []);

    return user;
}
