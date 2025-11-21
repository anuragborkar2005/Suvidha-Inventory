"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useActionState } from "react";
import { signup } from "@/app/actions/auth";
import { Spinner } from "@/components/ui/spinner";

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [state, action, pending] = useActionState(signup, undefined);

    return (
        <form
            action={action}
            className={cn("flex flex-col gap-6", className)}
            {...props}
        >
            <FieldGroup>
                <div className="flex flex-col  gap-1 text-center">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Fill in the form below to create your account
                    </p>
                </div>
                <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        required
                    />
                    {state?.errors?.name && (
                        <p className="text-red-700 text-xs">
                            {state.errors.name}
                        </p>
                    )}
                </Field>
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
                    <FieldLabel htmlFor="role">Role</FieldLabel>
                    <Select name="role">
                        <SelectTrigger className="max-w-40">
                            <SelectValue placeholder="Select a Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="superadmin">
                                Superadmin
                            </SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                    />
                    <FieldDescription>
                        Must be at least 8 characters long.
                    </FieldDescription>
                    {state?.errors?.password && (
                        <div>
                            <p className="text-red-700 text-xs">
                                Password must:
                            </p>
                            <ul>
                                {state.errors.password.map((error) => (
                                    <li key={error}>- {error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Field>
                <Field>
                    <FieldLabel htmlFor="confirm-password">
                        Confirm Password
                    </FieldLabel>
                    <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        required
                    />
                    <FieldDescription>
                        Please confirm your password.
                    </FieldDescription>
                </Field>
                <Field>
                    <Button type="submit" disabled={pending}>
                        {pending && <Spinner className="mr-2 animate-spin" />}
                        Create Account
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}
