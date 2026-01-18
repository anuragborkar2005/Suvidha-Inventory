import AppSidebar from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export default async function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  let role: "staff" | "admin" | "superadmin" = "staff";

  if (session?.userId) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (user?.role) {
      role = user.role as any;
    }
  }

  return (
    <SidebarProvider className="flex flex-col">
      <div className="flex flex-1">
        <AppSidebar role={role} />
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
