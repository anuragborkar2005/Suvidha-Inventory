import StockChart from "@/components/dashboard/StockChart";
import StockAlerts from "@/components/dashboard/StockAlerts";
import ProfileBadge from "@/components/dashboard/ProfileBadge";
import SalesSummary from "@/components/dashboard/SalesSummary";
import ProductCount from "@/components/dashboard/ProductCount";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <ProfileBadge />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SalesSummary />
        <ProductCount />
      </div>

      {/* Chart */}
      <StockChart />

      {/* Alerts */}
      <StockAlerts />

    </div>
  );
}
