"use client";
import { PageTitle } from "@/components/app/page-title";
import { MonthlyProfitChart } from "@/components/analytics/monthly-profit-chart";
import { SalesChart } from "@/components/analytics/sales-chart";
import { TopProductsChart } from "@/components/analytics/top-products-chart";

export default function DashboardAnalyticsPage() {
    return (
        <div className="w-full flex flex-col gap-4 p-4">
            <PageTitle>Analytics</PageTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SalesChart />
                <TopProductsChart />
                <div className="lg:col-span-2">
                    <MonthlyProfitChart />
                </div>
            </div>
        </div>
    );
}
