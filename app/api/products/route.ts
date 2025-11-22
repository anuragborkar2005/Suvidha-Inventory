import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getSession();

    if (!session?.userId) {
        throw new Error("User is not logined");
    }

    const products = await prisma.product.findMany();

    if (!products) {
        return NextResponse.json({
            success: true,
            data: null,
            message: "Products not found",
        });
    }

    return NextResponse.json({
        success: true,
        data: products,
        message: "All Products fetched",
    });
}
