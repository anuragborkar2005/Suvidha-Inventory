import { Sale } from "./sale";

export interface Product {
    id: string;

    barcode: string | null;

    name: string;

    category: string;

    stockQuantity: number;

    stockThreshold: number;

    costPrice: number;

    sellingPrice: number;

    sales?: Sale[];

    createdAt: Date;

    updatedAt: Date;
}
