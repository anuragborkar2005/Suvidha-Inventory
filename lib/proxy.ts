import { NextResponse } from "next/server";
import { getSession } from "./session";
import { Role, hasPermission, permissions } from "./rbac";
import prisma from "./prisma";

type ProtectedHandler = (
  req: Request,
  context: { params: any; user: { id: string; role: Role } }
) => Promise<NextResponse> | NextResponse;

export function withAuth(
  handler: ProtectedHandler,
  requiredPermission?: keyof typeof permissions.staff
) {
  return async (req: Request, { params }: { params: any }) => {
    try {
      const session = await getSession();

      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, role: true },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const role = user.role as Role;

      if (requiredPermission && !hasPermission(role, requiredPermission)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      return await handler(req, { params, user: { id: user.id, role } });
    } catch (error) {
      console.error("Auth Proxy Error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}
