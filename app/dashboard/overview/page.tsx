import { PageTitle } from "@/components/app/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { absoluteUrl } from "@/lib/utils";
import { ShoppingBag, Package, PackageX, IndianRupee } from "lucide-react";

type RecentSale = {
    id: number;
    totalPrice: number;
    createdAt: string;
    product: {
        name: string;
    };
    invoice: {
        student: string;
    } | null;
};

type TopProduct = {
    id: string;
    name: string | null;
    quantitySold: number | null;
};

type OverviewData = {
    totalProducts: number;
    totalSales: number;
    totalRevenue: number;
    lowStockProducts: number;
    recentSales: RecentSale[];
    topProducts: TopProduct[];
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{Number(data.totalRevenue).toFixed(2)}
                        </div>
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
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Low Stock
                        </CardTitle>
                        <PackageX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data.lowStockProducts}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Products running low on stock
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-1 lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">
                                        Amount
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.recentSales.map((sale) => (
                                    <TableRow key={sale.id}>
                                        <TableCell>
                                            <div className="font-medium">
                                                {sale.invoice?.student ?? "N/A"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {sale.product.name}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                sale.createdAt,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ₹
                                            {Number(sale.totalPrice).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Top Selling Products</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-8">
                        {data.topProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center gap-4"
                            >
                                <Avatar className="hidden h-9 w-9 sm:flex">
                                    <AvatarFallback>
                                        {product.name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium leading-none">
                                        {product.name}
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">
                                    +{product.quantitySold}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
