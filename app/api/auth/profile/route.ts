import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getSession();

    if (!session?.userId) {
        return NextResponse.json({
            success: false,
            data: "",
            message: "Cannot get userId from session",
        });
    }

    const user = await prisma.user.findUnique({
        where: { id: session?.userId },
    });

    if (!user) {
        return NextResponse.json({
            success: false,
            data: "",
            message: "User does not exist",
        });
    }

    return NextResponse.json({
        success: true,
        data: user,
        message: "User fetched successfully",
    });
}
