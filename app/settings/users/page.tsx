import { PageTitle } from "@/components/app/page-title";
import UsersTable from "@/components/settings/users-table";

export default function UserSettingsPage() {
    return (
        <div className="p-4">
            <PageTitle title="Users & Roles" />
            <UsersTable />
        </div>
    );
}
