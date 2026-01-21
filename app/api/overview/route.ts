import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const totalProducts = await prisma.product.count();
    const totalSales = await prisma.sale.aggregate({
        _sum: {
            quantity: true,
        },
    });
    const totalRevenue = await prisma.sale.aggregate({
        _sum: {
            totalPrice: true,
        },
    });

    const lowStockCountResult: [{ count: bigint }] = await prisma.$queryRaw`
        SELECT count(*) FROM "products" WHERE "stock_quantity" <= "stock_threshold"
    `;
    const lowStockProducts = Number(lowStockCountResult[0].count);

    const recentSales = await prisma.sale.findMany({
        take: 5,
        orderBy: {
            createdAt: "desc",
        },
        include: {
            product: {
                select: {
                    name: true,
                },
            },
            invoice: {
                select: {
                    student: true,
                },
            },
        },
    });

    const topProductsResult = await prisma.sale.groupBy({
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

    const productIds = topProductsResult.map((p) => p.productId);
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds,
            },
        },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    const topProducts = topProductsResult.map((p) => {
        const product = productMap.get(p.productId);
        return {
            id: product?.id,
            name: product?.name,
            quantitySold: p._sum.quantity,
        };
    });

    return NextResponse.json({
        totalProducts,
        totalSales: totalSales._sum.quantity ?? 0,
        totalRevenue: totalRevenue._sum.totalPrice ?? 0,
        lowStockProducts,
        recentSales,
        topProducts,
    });
}
