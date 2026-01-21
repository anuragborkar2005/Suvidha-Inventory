"use client";

import * as React from "react";
import {
    Boxes,
    Command,
    LayoutDashboard,
    Settings2,
    ShoppingCart,
    Truck,
} from "lucide-react";
import { NavMain } from "@/components/sidebar/nav-main";
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
import { useCurrentUser } from "@/hooks/use-current-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const user = useCurrentUser();
    let navMain = [
        {
            title: "Dashboard",
            url: "#",
            icon: LayoutDashboard,
            items: [
                { title: "Overview", url: "/dashboard/overview" },
                { title: "Reports", url: "/dashboard/reports" },
                { title: "Analytics", url: "/dashboard/analytics" },
            ],
        },
        {
            title: "Products",
            url: "#",
            icon: Boxes,
            items: [
                { title: "All Products", url: "/products/all" },
                { title: "Add Product", url: "/products/add-products" },
                {
                    title: "Stock Levels",
                    url: "/products/stock-levels",
                },
            ],
        },
        {
            title: "Sales",
            url: "#",
            icon: ShoppingCart,
            items: [
                { title: "New Sale", url: "/sales/new" },
                { title: "Sales History", url: "/sales/history" },
            ],
        },
        // {
        //     title: "Suppliers",
        //     url: "#",
        //     icon: Truck,
        //     items: [
        //         { title: "All Suppliers", url: "#" },
        //         { title: "Purchase Orders", url: "#" },
        //     ],
        // },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                { title: "General", url: "/settings/general" },
                { title: "Users & Roles", url: "/settings/users" },
            ],
        },
    ];

    if (user?.role !== "superadmin") {
        navMain = navMain.map((item) => {
            if (item.title === "Dashboard") {
                item.items = item.items.filter(
                    (subItem) => subItem.title !== "Analytics",
                );
            }
            if (item.title === "Settings") {
                item.items = item.items.filter(
                    (subItem) => subItem.title !== "Users & Roles",
                );
            }
            return item;
        });
    }

    if (user?.role === "staff") {
        navMain = navMain.map((item) => {
            if (item.title === "Products") {
                item.items = item.items.filter(
                    (subItem) => subItem.title !== "Add Product",
                );
            }
            if (item.title === "Products") {
                item.items = item.items.filter(
                    (subItem) => subItem.title !== "All Products",
                );
            }
            if (item.title === "Dashboard") {
                item.items = item.items.filter(
                    (subItem) => subItem.title !== "Overview",
                );
            }
            return item;
        });
    }
    // const navSecondary = [
    //     {
    //         title: "Support",
    //         url: "#",
    //         icon: LifeBuoy,
    //     },
    //     {
    //         title: "Feedback",
    //         url: "#",
    //         icon: Send,
    //     },
    // ];

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
                <NavMain items={navMain} />
                {/*<NavSecondary items={navSecondary} className="mt-auto" />*/}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
