import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const UpdateUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    role: z.enum(["staff", "admin", "superadmin"]),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { user } = await auth();
        if (!user || (user.role !== "superadmin" && user.role !== "admin")) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = params;
        const targetUser = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        if (!targetUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json(targetUser);
    } catch (error) {
        console.error("Error fetching user:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { user } = await auth();
        if (!user || user.role !== "superadmin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = params;
        const body = await req.json();

        const validation = UpdateUserSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(validation.error.format(), {
                status: 400,
            });
        }

        const { name, email, role } = validation.data;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { name, email, role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { user } = await auth();
        if (!user || user.role !== "superadmin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = params;
        await prisma.user.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
