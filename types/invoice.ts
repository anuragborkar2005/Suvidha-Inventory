export interface Invoice {
    id: string;
    invoiceNumber: number;
    invoiceCode: string;
    student: string;
    date: string;
    total: number;
    sales: {
        id: number;
        product: {
            name: string;
        };
        quantity: number;
        totalPrice: number;
    }[];
}
