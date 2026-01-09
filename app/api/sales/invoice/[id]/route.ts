import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Context = {
    params: Promise<{ id: string }>;
};

export async function GET(req: Request, { params }: Context) {
    try {
        const { id } = await params;

        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                sales: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!invoice) {
            return new NextResponse("Invoice not found", { status: 404 });
        }

        return NextResponse.json(invoice);
    } catch (error) {
        console.error("Error fetching invoice:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
