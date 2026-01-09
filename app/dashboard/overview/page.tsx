import { PageTitle } from "@/components/app/page-title";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { absoluteUrl } from "@/lib/utils";
import { DollarSign, ShoppingBag, Package } from "lucide-react";

type OverviewData = {
    totalProducts: number;
    totalSales: number;
    totalRevenue: number;
};

async function getOverviewData(): Promise<OverviewData> {
    const res = await fetch(absoluteUrl(`/api/overview`), {
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch overview data");
    }
    return res.json();
}

export default async function DashboardOverviewPage() {
    const data = await getOverviewData();

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            <PageTitle>Overview</PageTitle>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${Number(data.totalRevenue).toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Sales
                        </CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            +{data.totalSales}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +180.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Products
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.totalProducts}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +2 since last hour
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-1 lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                        <CardDescription>
                            You made 265 sales this month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Placeholder for recent sales table */}
                        <div className="h-64 w-full bg-muted/50 rounded-lg" />
                    </CardContent>
                </Card>
                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Top Products</CardTitle>
                        <CardDescription>
                            Your top selling products.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Placeholder for top products list */}
                        <div className="h-64 w-full bg-muted/50 rounded-lg" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
