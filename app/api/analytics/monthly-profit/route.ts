import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const { user } = await auth();
        if (user?.role !== "superadmin") {
            return new NextResponse("Forbidden", { status: 403 });
        }
        const data: { year: number; month: number; profit: number }[] =
            await prisma.$queryRaw`
            SELECT
                EXTRACT(YEAR FROM "created_at") as year,
                EXTRACT(MONTH FROM "created_at") as month,
                SUM("total_price" - "total_cost") as profit
            FROM "sales"
            WHERE "created_at" > NOW() - INTERVAL '12 months'
            GROUP BY 1, 2
            ORDER BY 1, 2;
        `;

        const chartData = data.map((d) => ({
            name:
                new Date(d.year, d.month - 1).toLocaleString("default", {
                    month: "short",
                }) +
                " " +
                d.year,
            profit: Number(d.profit),
        }));

        return NextResponse.json(chartData);
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
