"use client";

import { SidebarIcon } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React from "react";

// Helper to format segment titles
function formatTitle(segment: string) {
    return segment
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
}

export function SiteHeader() {
    const { toggleSidebar } = useSidebar();
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    return (
        <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
            <div className="flex h-(--header-height) w-full  gap-2 px-4">
                <Button
                    className="h-8 w-8"
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                >
                    <SidebarIcon />
                </Button>
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb className="hidden sm:block">
                    <BreadcrumbList>
                        {segments.map((segment, index) => {
                            const link =
                                "/" + segments.slice(0, index + 1).join("/");
                            const isLast = index === segments.length - 1;

                            return (
                                <React.Fragment key={link}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage>
                                                {formatTitle(segment)}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={link}>
                                                {formatTitle(segment)}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </React.Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
}
