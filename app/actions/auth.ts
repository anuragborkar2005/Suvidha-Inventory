"use server";

import {
    LoginFormSchema,
    LoginFormState,
    SignupFormSchema,
    SignUpFormState,
    ChangePasswordFormValues,
} from "@/lib/definitions";
import { createSession, deleteSession, getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function signup(
    state: SignUpFormState,
    formData: FormData,
): Promise<SignUpFormState> {
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
        role: formData.get("role"),
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
    }

    const { name, email, password, role } = validatedFields.data;
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { name, email, password: hashPassword, role },
    });

    if (!user) {
        return { message: "An error occurred while creating your account" };
    }

    await createSession(user.id);
    if (user?.role == "superadmin") {
        redirect("/dashboard/overview");
    } else if (user?.role == "admin") {
        redirect("/dashboard/overview");
    } else {
        redirect("/sales/new");
    }
}

export async function login(
    state: LoginFormState,
    formData: FormData,
): Promise<LoginFormState> {
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
    }

    const { email, password } = validatedFields.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return { errors: { email: ["No account found with this email"] } };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return { errors: { password: ["Incorrect password"] } };
    }

    await createSession(user.id);
    redirect("/dashboard/overview");
}

export async function getProfile(userId: string) {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            name: true,
            email: true,
            role: true,
        },
    });
}

export async function logout() {
    await deleteSession();
    redirect("/login");
}

export async function changePassword(data: ChangePasswordFormValues) {
    const session = await getSession();
    if (!session) {
        return { error: "You must be logged in to change your password." };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
    });
    if (!user) {
        return { error: "User not found." };
    }

    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) {
        return { error: "Incorrect current password." };
    }

    const hashPassword = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({
        where: { id: session.userId },
        data: { password: hashPassword },
    });

    return { success: "Password changed successfully." };
}
