"use client";
import { PageTitle } from "@/components/app/page-title";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function SalesChart() {
    const { data, error } = useSWR("/api/analytics/sales-by-day", fetcher);

    if (error) return <div>Failed to load chart</div>;
    if (!data) return <div>Loading...</div>;

    return (
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
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default function DashboardAnalyticsPage() {
    return (
        <div className="w-full flex flex-col gap-4 p-4">
            <PageTitle>Analytics</PageTitle>
            <Card>
                <CardHeader>
                    <CardTitle>Sales in Last 7 Days</CardTitle>
                </CardHeader>
                <CardContent>
                    <SalesChart />
                </CardContent>
            </Card>
        </div>
    );
}
