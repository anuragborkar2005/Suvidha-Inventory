"use server";

import {
    LoginFormSchema,
    LoginFormState,
    SignupFormSchema,
    SignUpFormState,
} from "@/lib/definitions";
import { createSession, deleteSession } from "@/lib/session";
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
    redirect("/dashboard/overview"); // ✅ no need to return after this
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
