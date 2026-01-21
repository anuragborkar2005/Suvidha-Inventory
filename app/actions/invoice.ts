"use server";

import prisma from "@/lib/prisma";
import { Item } from "@/types/item";

export async function createInvoice({
    studentName,
    date,
    items,
}: {
    studentName: string;
    date: Date;
    items: Item[];
}) {
    const totalAmount = items.reduce(
        (sum: number, i: Item) => sum + i.price * i.qty,
        0,
    );

    // Create invoice first
    const invoice = await prisma.invoice.create({
        data: {
            student: studentName,
            date,
            total: Number(totalAmount),
        },
    });
    const year = new Date().getFullYear();
    const invoiceCode = `INV-${year}-${String(invoice.invoiceNumber).padStart(6, "0")}`;
    await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
            invoiceCode,
        },
    });

    // Save items under invoice
    for (const item of items) {
        const product = await prisma.product.findUnique({
            where: { id: item.id },
        });
        if (!product) continue;

        await prisma.sale.create({
            data: {
                productId: product.id,
                quantity: item.qty,
                totalPrice: Number(item.price * item.qty),
                totalCost: Number(product.costPrice) * item.qty,
                invoiceId: invoice.id, // <-- linking to invoice
            },
        });

        await prisma.product.update({
            where: { id: product.id },
            data: { stockQuantity: product.stockQuantity - item.qty },
        });
    }

    return { success: true, invoiceId: invoice.id };
}
