import { Prisma } from "@/prisma/generated/client/client";
import { Sale } from "./sale";

export interface Product {
    id: string;
    name: string;
    category: string;
    stockQuantity: number;
    stockThreshold: number;
    costPrice: Prisma.Decimal;
    sellingPrice: Prisma.Decimal;
    sales: Sale[];
    createdAt: Date;
    updatedAt: Date;
}
