import { PageTitle } from "@/components/app/page-title";
import UsersTable from "@/components/settings/users-table";
import prisma from "@/lib/prisma";
import { Role } from "@/lib/definitions";

export default async function UserSettingsPage() {
    const usersData = await prisma.user.findMany();
    const users = usersData.map((user) => ({
        ...user,
        role: user.role as Role,
    }));
    return (
        <div className="px-8 py-4">
            <PageTitle>Users & Roles</PageTitle>
            <UsersTable users={users} />
        </div>
    );
}
