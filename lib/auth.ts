import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function auth() {
    const session = await getSession();
    if (!session?.userId) {
        return { user: null };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    return { user };
}
