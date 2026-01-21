"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    changePasswordFormSchema,
    ChangePasswordFormValues,
} from "@/lib/definitions";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { changePassword } from "@/app/actions/auth";

const defaultValues: Partial<ChangePasswordFormValues> = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

export default function ChangePasswordForm() {
    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordFormSchema),
        defaultValues,
    });

    async function onSubmit(data: ChangePasswordFormValues) {
        try {
            const result = await changePassword(data);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Password changed successfully.");
                form.reset();
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 px-8 py-4"
            >
                <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Change Password</Button>
            </form>
        </Form>
    );
}
