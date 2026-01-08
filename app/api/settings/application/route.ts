import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const settings = await prisma.storeSettings.findFirst();
        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error fetching store settings:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { user } = await auth();
        if (!user || user.role !== "superadmin" && user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { storeName, address, currency } = body;

        if (!storeName || !address || !currency) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const updatedSettings = await prisma.storeSettings.update({
            where: { id: 1 }, // Assuming there's always one settings entry with id 1
            data: { storeName, address, currency },
        });

        return NextResponse.json(updatedSettings);
    } catch (error) {
        console.error("Error updating store settings:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
