"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { DateRange } from "react-day-picker";

export async function createSale(formData: FormData) {
    const { user } = await auth();
    if (
        user?.role !== "staff" &&
        user?.role !== "admin" &&
        user?.role !== "superadmin"
    ) {
        throw new Error("Forbidden");
    }
    const productId = formData.get("productId") as string;
    const quantity = Number(formData.get("quantity"));

    const product = await prisma.product.findUnique({
        where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    const totalCost = Number(product.costPrice) * quantity;
    const totalPrice = Number(product.sellingPrice) * quantity;

    await prisma.sale.create({
        data: {
            productId,
            quantity,
            totalCost,
            totalPrice,
        },
    });

    await prisma.product.update({
        where: { id: productId },
        data: { stockQuantity: product.stockQuantity - quantity },
    });
}

export async function fetchSale(range: DateRange | undefined) {
    const sales = await prisma.sale.findMany({
        where: {
            createdAt: {
                gte: range?.from,
                lte: range?.to,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        include: { product: true },
    });

    return sales.map((s) => ({
        id: s.id,
        productId: s.productId,
        invoiceId: s.invoiceId,
        quantity: s.quantity,
        totalPrice: Number(s.totalPrice),
        totalCost: Number(s.totalCost),
        createdAt: s.createdAt.toLocaleDateString(),
        updatedAt: s.updatedAt.toLocaleDateString(),
        product: {
            name: s.product.name,
        },
    }));
}
