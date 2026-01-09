import { PageTitle } from "@/components/app/page-title";
import SettingsForm from "@/components/settings/settings-form";

export default function GeneralSettingsPage() {
    return (
        <div className="px-8 py-4">
            <PageTitle>General Settings</PageTitle>
            <SettingsForm />
        </div>
    );
}
