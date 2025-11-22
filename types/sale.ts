import { Prisma } from "@/prisma/generated/client/client";
import { Product } from "./product";

export interface Sale {
    id: number;
    productId: string;
    product: Product;
    quantity: number;
    totalPrice: Prisma.Decimal;
    totalCost: Prisma.Decimal;
    createdAt: Date;
    updatedAt: Date;
}
