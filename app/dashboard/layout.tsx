import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
                <div className="flex flex-1">
                    <AppSidebar />
                    <SidebarInset>
                        <SiteHeader />
                        {children}
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
}
