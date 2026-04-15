"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Stats = {
    totalRevenue: number;
    totalQuantity: number;
    totalOrders: number;
};

export default function SalesSummary() {
    const [stats, setStats] = useState<Stats>({
        totalRevenue: 0,
        totalQuantity: 0,
        totalOrders: 0,
    });

    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    async function loadSales() {
        try {
            const res = await fetch("/api/sales/today", {
                cache: "no-store",
            });

            if (!res.ok) {
                console.warn("Sales API failed");
                return;
            }

            const data = await res.json();

            setStats({
                totalRevenue: data?.totalRevenue ?? 0,
                totalQuantity: data?.totalQuantity ?? 0,
                totalOrders: data?.totalOrders ?? 0,
            });
        } catch (err) {
            console.error("Failed to load sales stats", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setMounted(true);
        loadSales();
        const refreshInterval = setInterval(loadSales, 10000);
        return () => clearInterval(refreshInterval);
    }, []);

    if (!mounted) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-32 mb-2" />
                            <Skeleton className="h-3 w-40" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Today&apos;s Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {loading
                            ? "..."
                            : `₹${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        +20.1% from yesterday
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Items Sold
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {loading ? "..." : stats.totalQuantity}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        +12% from yesterday
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Orders
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {loading ? "..." : stats.totalOrders}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        +5 new orders today
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
