"use client";

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SalesChart() {
    const { data, error } = useSWR("/api/analytics/sales-by-day", fetcher);

    if (error) return <div>Failed to load chart</div>;
    if (!data) return <div>Loading...</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales in Last 7 Days</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₹${value}`}
                        />
                        <Tooltip
                            formatter={(value) => {
                                if (typeof value === "number") {
                                    return [`₹${value.toFixed(2)}`, "Profit"];
                                }
                                return [`₹0.00`, "Profit"];
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey="total"
                            fill="#fa931d"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
