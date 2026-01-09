import { GalleryVerticalEnd } from "lucide-react";
import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";

function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Spinner className="size-8 animate-spin" />
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="grid min-h-svh flex-col lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a
                        href="#"
                        className="flex items-center gap-2 font-semibold"
                    >
                        <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        <span className="text-lg">Suvidha Inventory</span>
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-sm">
                        <Suspense fallback={<Loading />}>
                            <LoginForm />
                        </Suspense>
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <Image
                    src="/login.png"
                    alt="Inventory Management"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                />
            </div>
        </div>
    );
}
