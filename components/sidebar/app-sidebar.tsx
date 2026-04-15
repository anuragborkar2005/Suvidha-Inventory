"use client";

import * as React from "react";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    BarChart3,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { hasPermission } from "@/lib/rbac";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Role = "superadmin" | "admin" | "staff";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    role: Role;
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
}

export function AppSidebar({ role, user, ...props }: AppSidebarProps) {
    const pathname = usePathname();

    const navigation = [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: pathname === "/dashboard",
        },
        {
            title: "Inventory",
            url: "/products/all",
            icon: Package,
            items: [
                {
                    title: "All Products",
                    url: "/products/all",
                },
                {
                    title: "Stock Levels",
                    url: "/products/stock-levels",
                },
            ],
        },
        {
            title: "Sales & POS",
            url: "/sales/new-sale",
            icon: ShoppingCart,
            items: [
                {
                    title: "Point of Sale",
                    url: "/sales/new-sale",
                },
                {
                    title: "Sales History",
                    url: "/sales/history",
                },
            ],
        },
        {
            title: "Analytics",
            url: "/dashboard/analytics",
            icon: BarChart3,
            hidden: role === "staff",
        },
        {
            title: "User Management",
            url: "/settings/user",
            icon: Users,
            hidden: !hasPermission(role, "manageUsers"),
        },
        {
            title: "Settings",
            url: "/settings/user",
            icon: Settings,
            hidden: !hasPermission(role, "accessSettings"),
        },
    ];

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Package className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="truncate font-semibold">
                            Suvidha Inventory
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                            Admin Panel
                        </span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarMenu>
                        {navigation.map((item) => {
                            if (item.hidden) return null;

                            return (
                                <SidebarMenuItem key={item.title}>
                                    {item.items ? (
                                        <>
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={item.title}
                                                isActive={pathname.startsWith(
                                                    item.url,
                                                )}
                                            >
                                                <Link href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                            <SidebarMenuSub>
                                                {item.items.map((subItem) => {
                                                    return (
                                                        <SidebarMenuSubItem
                                                            key={subItem.title}
                                                        >
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={
                                                                    pathname ===
                                                                    subItem.url
                                                                }
                                                            >
                                                                <Link
                                                                    href={
                                                                        subItem.url
                                                                    }
                                                                >
                                                                    <span>
                                                                        {
                                                                            subItem.title
                                                                        }
                                                                    </span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    );
                                                })}
                                            </SidebarMenuSub>
                                        </>
                                    ) : (
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            isActive={pathname === item.url}
                                        >
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
