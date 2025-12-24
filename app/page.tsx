import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function HomePage() {
    const session = await getSession();

    if (session?.userId) {
        redirect("/dashboard/overview");
    } else {
        redirect("/login");
    }
    return <div></div>;
}
