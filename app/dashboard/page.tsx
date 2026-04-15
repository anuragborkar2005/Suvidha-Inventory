import SalesSummary from "@/components/dashboard/sales-summary";
import StockChart from "@/components/dashboard/stock-chart";
import StockAlerts from "@/components/dashboard/stocks-alerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
    const productCount = await prisma.product.count();
    const lowStockCount = await prisma.product.count({
        where: {
            stockQuantity: {
                lte: prisma.product.fields.stockThreshold,
            },
        },
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                    Dashboard Overview
                </h2>
            </div>

            <SalesSummary />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all categories
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-600">
                            Low Stock Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {lowStockCount}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Action required
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Stock Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <StockChart />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <StockAlerts />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
