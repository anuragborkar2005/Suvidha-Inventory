import { PageTitle } from "@/components/app/page-title";
import { Card } from "@/components/ui/card";

export default function DashboardOverviewPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <PageTitle>Overview</PageTitle>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <Card className="bg-muted/50 aspect-video rounded-xl"></Card>
                <Card className="bg-muted/50 aspect-video rounded-xl"></Card>
                <Card className="bg-muted/50 aspect-video rounded-xl"></Card>
            </div>
            <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
        </div>
    );
}
