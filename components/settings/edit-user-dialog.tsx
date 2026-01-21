"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Role } from "@/lib/definitions";
import { updateUserRole } from "@/app/actions/users";
import { User } from "@/types/user";

const editUserFormSchema = z.object({
    role: z.nativeEnum(Role),
});

type EditUserFormValues = z.infer<typeof editUserFormSchema>;

interface EditUserDialogProps {
    user: User;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function EditUserDialog({ user, open, setOpen }: EditUserDialogProps) {
    const form = useForm<EditUserFormValues>({
        resolver: zodResolver(editUserFormSchema),
        defaultValues: {
            role: user.role,
        },
    });

    async function onSubmit(data: EditUserFormValues) {
        try {
            await updateUserRole(user.id, data.role);
            toast.success("User role updated successfully.");
            setOpen(false);
        } catch (error) {
            toast.error("Failed to update user role.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update the role for {user.name}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(Role).map((role) => (
                                                <SelectItem key={role} value={role}>
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Save</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
