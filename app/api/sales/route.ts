import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getSession();

    if (!session?.userId) {
        throw new Error("User is not logined");
    }

    const sales = await prisma.sale.findMany();

    if (!sales) {
        return NextResponse.json({
            success: true,
            data: null,
            message: "Sales not found",
        });
    }

    return NextResponse.json({
        success: true,
        data: sales,
        message: "All Sales fetched",
    });
}
