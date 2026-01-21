"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role } from "@/lib/definitions";

export async function updateUserRole(userId: string, role: Role) {
    await prisma.user.update({
        where: { id: userId },
        data: { role },
    });
    revalidatePath("/settings/users");
}

export async function deleteUser(userId: string) {
    await prisma.user.delete({
        where: { id: userId },
    });
    revalidatePath("/settings/users");
}
