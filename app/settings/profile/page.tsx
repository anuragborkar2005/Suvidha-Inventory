import { PageTitle } from "@/components/app/page-title";
import ChangePasswordForm from "@/components/settings/change-password-form";

export default function ProfilePage() {
    return (
        <div className="px-8 py-4">
            <PageTitle>Change Password</PageTitle>
            <ChangePasswordForm />
        </div>
    );
}
