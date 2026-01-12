import { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/sidebar/site-header";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function SalesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  const user = session?.userId
    ? await prisma.user.findUnique({
        where: { id: session.userId },
        select: { role: true },
      })
    : null;

  const role = user?.role ?? "staff";

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <div className="flex flex-1">
          <AppSidebar role={role} />
          <SidebarInset>
            <SiteHeader />
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
