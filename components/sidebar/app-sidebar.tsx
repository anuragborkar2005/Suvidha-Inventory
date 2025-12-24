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
import { useState, useEffect, useMemo } from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-products";
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

    useEffect(() => {
        fetch("/api/auth/profile")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch profile");
                return res.json();
            })
            .then((data) => {
                const p = data.data ?? data;
                console.log(p);
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
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
            items: [
                { title: "Overview", url: "/dashboard/overview" },
                { title: "Reports", url: "/dashboard/reports" },
                { title: "Analytics", url: "/dashboard/analytics" },
            ],
            roles: ["superadmin"],
        },
        {
            title: "Products",
            url: "/products",
            icon: Boxes,
            items: [
                { title: "All Products", url: "/products/all" },
                { title: "Add Product", url: "/products/add-products" },
                {
                    title: "Stock Levels",
                    url: "/products/stock-levels",
                },
            ],
            roles: ["superadmin", "admin", "manager"],
        },
        {
            title: "Sales",
            url: "#",
            icon: ShoppingCart,
            items: [
                { title: "New Sale", url: "/sales/new-sale" },
                { title: "Sales History", url: "/sales/history" },
                { title: "Invoices", url: "/sales/invoice" },
            ],
            roles: ["superadmin", "admin", "manager", "cashier"],
        },
        {
            title: "Suppliers",
            url: "#",
            icon: Truck,
            items: [
                { title: "All Suppliers", url: "#" },
                { title: "Purchase Orders", url: "#" },
            ],
            roles: ["superadmin", "admin", "manager"],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                { title: "General", url: "#" },
                { title: "Users & Roles", url: "#" },
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
        projects: [
            { name: "Semester Essentials", url: "#", icon: ClipboardList },
            { name: "Exam Season", url: "#", icon: BookOpen },
            { name: "Art & Design", url: "#", icon: Palette },
        ],
    };

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        Suvidha
                                    </span>
                                    <span className="truncate text-xs">
                                        Inventory Management
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="scrollbar-hide">
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
