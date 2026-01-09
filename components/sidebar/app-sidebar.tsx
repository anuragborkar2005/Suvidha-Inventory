"use client";

import * as React from "react";
import {
    BookOpen,
    Boxes,
    ClipboardList,
    Command,
    LayoutDashboard,
    LifeBuoy,
    Palette,
    Send,
    Settings2,
    ShoppingCart,
    Truck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { filterNavByRole } from "@/lib/nav-utils";
import { usePathname } from "next/navigation";

type ProfileType = {
    name: string;
    email: string;
    role: string;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [profile, setProfile] = useState<ProfileType>({
        name: "Guest",
        email: "guest@example.com",
        role: "guest",
    });
    const pathname = usePathname();

    useEffect(() => {
        fetch("/api/auth/profile")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch profile");
                return res.json();
            })
            .then((data) => {
                const p = data.data ?? data;
                setProfile({
                    name: p.name || "Guest",
                    email: p.email || "guest@example.com",
                    role: p.role || "guest",
                });
            })
            .catch((err) => {
                console.error("Error loading profile:", err);
            });
    }, []);

    const navMain = [
        {
            title: "Dashboard",
            url: "#",
            icon: LayoutDashboard,
            isActive: pathname.startsWith("/dashboard"),
            items: [
                { title: "Overview", url: "/dashboard/overview" },
                { title: "Reports", url: "/dashboard/reports" },
                { title: "Analytics", url: "/dashboard/analytics" },
            ],
            roles: ["superadmin"],
        },
        {
            title: "Products",
            url: "#",
            icon: Boxes,
            isActive: pathname.startsWith("/products"),
            items: [
                { title: "All Products", url: "/products/all" },
                { title: "Add Product", url: "/products/add-products" },
                {
                    title: "Stock Levels",
                    url: "/products/stock-levels",
                },
            ],
            roles: ["superadmin", "admin"],
        },
        {
            title: "Sales",
            url: "#",
            icon: ShoppingCart,
            isActive: pathname.startsWith("/sales"),
            items: [
                { title: "New Sale", url: "/sales/new" },
                { title: "Sales History", url: "/sales/history" },
            ],
            roles: ["superadmin", "admin", "staff"],
        },
        {
            title: "Suppliers",
            url: "#",
            icon: Truck,
            items: [
                { title: "All Suppliers", url: "#" },
                { title: "Purchase Orders", url: "#" },
            ],
            roles: ["superadmin", "admin"],
        },
        {
            title: "Settings",
            url: "/settings/general",
            icon: Settings2,
            isActive: pathname.startsWith("/settings"),
            items: [
                { title: "General", url: "/settings/general" },
                { title: "Users & Roles", url: "/settings/users" },
            ],
            roles: ["superadmin", "admin"],
        },
    ];

    const navSecondary = [
        {
            title: "Support",
            url: "#",
            icon: LifeBuoy,
            roles: ["superadmin", "admin", "manager", "cashier"],
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
            roles: ["superadmin", "admin", "manager", "cashier"],
        },
    ];

    const data = {
        user: {
            name: profile.name || "Guest",
            email: profile.email || "guest@example.com",
            avatar: "https://avatar.iran.liara.run/public/boy",
            role: profile.role || "guest",
        },
        navMain: filterNavByRole(navMain, profile.role),
        navSecondary: filterNavByRole(navSecondary, profile.role),
    };

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/dashboard">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        Suvidha
                                    </span>
                                    <span className="truncate text-xs">
                                        Inventory
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="scrollbar-hide">
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
