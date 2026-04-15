import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Suvidha Inventory</h1>
        <p className="text-sm text-muted-foreground">
          Inventory Management System
        </p>
      </div>

      <div className="w-full max-w-sm bg-background rounded-xl shadow-lg p-6">
        <Suspense fallback={<Loading />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
