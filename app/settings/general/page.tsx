import { PageTitle } from "@/components/app/page-title";
import SettingsForm from "@/components/settings/settings-form";

export default function GeneralSettingsPage() {
    return (
        <div className="p-4">
            <PageTitle title="General Settings" />
            <SettingsForm />
        </div>
    );
}
