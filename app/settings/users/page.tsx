import { PageTitle } from "@/components/app/page-title";
import UsersTable from "@/components/settings/users-table";

export default function UserSettingsPage() {
    return (
        <div className="px-8 py-4">
            <PageTitle>Users & Roles</PageTitle>
            <UsersTable />
        </div>
    );
}
