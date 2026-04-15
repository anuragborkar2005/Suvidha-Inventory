"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Bar,
    BarChart,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import {
    DollarSign,
    Users,
    ShoppingCart,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        async function fetchHistory() {
            try {
                const res = await fetch("/api/sales/history");
                const history = await res.json();
                setData(history);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, []);

    // Process data for charts

    const salesByDate = data.reduce((acc: any, sale: any) => {
        const date = format(new Date(sale.createdAt), "MMM dd");
        acc[date] = (acc[date] || 0) + sale.totalPrice;
        return acc;
    }, {});

    const chartData = Object.keys(salesByDate)
        .map((date) => ({
            date,
            total: salesByDate[date],
        }))
        .reverse();

    const totalRevenue = data.reduce((sum, s) => sum + s.totalPrice, 0);
    const totalProfit = data.reduce(
        (sum, s) => sum + (s.totalPrice - s.totalCost),
        0,
    );
    const averageOrderValue = data.length > 0 ? totalRevenue / data.length : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Analytics
                    </h2>
                    <p className="text-muted-foreground">
                        Deep dive into your business performance.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? (
                                <Skeleton className="h-8 w-24" />
                            ) : (
                                `₹${totalRevenue.toLocaleString()}`
                            )}
                        </div>
                        <div className="flex items-center text-xs text-green-600">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +12.5% from last month
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Profit
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {loading ? (
                                <Skeleton className="h-8 w-24" />
                            ) : (
                                `₹${totalProfit.toLocaleString()}`
                            )}
                        </div>
                        <div className="flex items-center text-xs text-green-600">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +8.2% from last month
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Avg Order Value
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? (
                                <Skeleton className="h-8 w-24" />
                            ) : (
                                `₹${averageOrderValue.toFixed(2)}`
                            )}
                        </div>
                        <div className="flex items-center text-xs text-red-600">
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                            -2.4% from last month
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Customer Retention
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? (
                                <Skeleton className="h-8 w-12" />
                            ) : (
                                "84%"
                            )}
                        </div>
                        <div className="flex items-center text-xs text-green-600">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +4% from last month
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Over Time</CardTitle>
                        <CardDescription>
                            Daily revenue for the last 30 days.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[350px] w-full flex items-center justify-center">
                            {!mounted ? (
                                <Skeleton className="h-full w-full" />
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="#e2e8f0"
                                        />
                                        <XAxis
                                            dataKey="date"
                                            tick={{
                                                fontSize: 12,
                                                fill: "#64748b",
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{
                                                fontSize: 12,
                                                fill: "#64748b",
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(value) =>
                                                `₹${value}`
                                            }
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: "8px",
                                                border: "none",
                                                boxShadow:
                                                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="total"
                                            stroke="var(--chart-1)"
                                            strokeWidth={3}
                                            dot={{
                                                r: 4,
                                                fill: "var(--chart-2)",
                                                strokeWidth: 2,
                                                stroke: "#fff",
                                            }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Profit Margin</CardTitle>
                        <CardDescription>
                            Revenue vs Cost distribution.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full flex items-center justify-center">
                            {!mounted ? (
                                <Skeleton className="h-full w-full" />
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <XAxis
                                            dataKey="date"
                                            tick={{
                                                fontSize: 12,
                                                fill: "#64748b",
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: "8px",
                                                border: "none",
                                                boxShadow:
                                                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                            }}
                                        />
                                        <Bar
                                            dataKey="total"
                                            fill="var(--chart-3)"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
