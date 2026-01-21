"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function addProduct(formData: FormData) {
    const { user } = await auth();
    if (user?.role !== "admin" && user?.role !== "superadmin") {
        throw new Error("Forbidden");
    }
    const name = formData.get("name") as string;
    const costPrice = Number(formData.get("costPrice"));
    const sellingPrice = Number(formData.get("sellingPrice"));
    const quantity = Number(formData.get("quantity"));
    const barcode = formData.get("barcode") as string | null;
    const category = (formData.get("category") as string) || "general";

    await prisma.product.create({
        data: {
            name,
            costPrice,
            sellingPrice,
            stockQuantity: quantity,
            barcode: barcode || null,
            category,
        },
    });
    revalidatePath("products/all");
}

export async function getProductById(id: string) {
    const { user } = await auth();
    if (user?.role !== "admin" && user?.role !== "superadmin" && user?.role !== "staff") {
        throw new Error("Forbidden");
    }
    return prisma.product.findUnique({
        where: { id },
    });
}

export async function deleteProductById(id: string) {
    const { user } = await auth();
    if (user?.role !== "admin" && user?.role !== "superadmin") {
        throw new Error("Forbidden");
    }
    await prisma.product.delete({
        where: { id },
    });
    revalidatePath("products/all");
}

export async function updateProduct(productId: string, formData: FormData) {
    const { user } = await auth();
    if (user?.role !== "admin" && user?.role !== "superadmin") {
        throw new Error("Forbidden");
    }
    const name = formData.get("name") as string;
    const stockQuantity = Number(formData.get("quantity"));
    const costPrice = Number(formData.get("cprice"));
    const sellingPrice = Number(formData.get("sprice"));

    await prisma.product.update({
        where: { id: productId },
        data: {
            name,
            stockQuantity,
            costPrice,
            sellingPrice,
        },
    });
    revalidatePath("products/all");
}
