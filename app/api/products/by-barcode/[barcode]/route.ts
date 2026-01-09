import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    barcode: string;
};

export async function GET(
    _req: NextRequest,
    context: { params: Promise<Params> },
) {
    const { barcode } = await context.params;

    const product = await prisma.product.findUnique({
        where: { barcode },
    });

    return NextResponse.json(product ?? null);
}
