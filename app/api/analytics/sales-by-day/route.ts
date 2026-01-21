import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { subDays, format } from "date-fns";
import { auth } from "@/lib/auth";

export async function GET() {
    const { user } = await auth();
    if (user?.role !== "superadmin") {
        return new NextResponse("Forbidden", { status: 403 });
    }
    const today = new Date();
    const last7Days = subDays(today, 7);

    const sales = await prisma.sale.findMany({
        where: {
            createdAt: {
                gte: last7Days,
            },
        },
        select: {
            createdAt: true,
            totalPrice: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const salesByDay = sales.reduce((acc, sale) => {
        const day = format(sale.createdAt, "yyyy-MM-dd");
        if (!acc[day]) {
            acc[day] = 0;
        }
        acc[day] += Number(sale.totalPrice);
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.keys(salesByDay).map((day) => ({
        name: format(new Date(day), "eee"),
        total: salesByDay[day],
    }));

    return NextResponse.json(chartData);
}
