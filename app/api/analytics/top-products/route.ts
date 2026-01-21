import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
    const { user } = await auth();
    if (user?.role !== "superadmin") {
        return new NextResponse("Forbidden", { status: 403 });
    }
    const topProducts = await prisma.sale.groupBy({
        by: ["productId"],
        _sum: {
            quantity: true,
        },
        orderBy: {
            _sum: {
                quantity: "desc",
            },
        },
        take: 5,
    });

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: topProducts.map((p) => p.productId),
            },
        },
    });

    const data = topProducts.map((p) => {
        const product = products.find((pr) => pr.id === p.productId);
        return {
            name: product?.name || "Unknown",
            total: p._sum.quantity,
        };
    });

    return NextResponse.json(data);
}
