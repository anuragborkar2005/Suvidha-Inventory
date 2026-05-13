"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { Spinner } from "@/components/ui/spinner";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [state, action, pending] = useActionState(login, undefined);

    return (
        <form
            action={action}
            className={cn("flex flex-col gap-6", className)}
            {...props}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">
                        Login to your account
                    </h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email below to login to your account
                    </p>
                </div>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                    />
                    {state?.errors?.email && (
                        <p className="text-red-700 text-xs">
                            {state.errors.email}
                        </p>
                    )}
                </Field>
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <a
                            href="#"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </a>
                    </div>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                    />
                    {state?.errors?.password && (
                        <div>
                            <p className="text-red-700 text-xs">
                                Password must:
                            </p>
                            <ul>
                                {state.errors.password.map((error) => (
                                    <li
                                        className="text-red-700 text-xs"
                                        key={error}
                                    >
                                        - {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Field>
                <Field>
                    <Button type="submit" disabled={pending}>
                        {pending && <Spinner className="mr-2 animate-spin" />}
                        Login
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}
