import { Prisma } from "@/lib/generated/prisma/client";
import { Product } from "./product";

export interface Sale {
    id: number;
    productId: string;
    product: Product;
    quantity: number;
    totalPrice: number;
    totalCost: number;
    createdAt: Date;
    updatedAt: Date;
}
