"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import "./print.css";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/app/page-title";
import { Invoice } from "@/types/invoice";

export default function InvoicePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { id } = use(params);

    useEffect(() => {
        if (id) {
            fetch(`/api/sales/invoice/${id}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch invoice");
                    }
                    return res.json();
                })
                .then((data) => {
                    setInvoice(data);
                })
                .catch((err) => {
                    setError(err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    // useEffect(() => {
    //     if (!loading && invoice) {
    //         window.print();
    //     }
    // }, [loading, invoice]);

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4">Error: {error}</div>;
    }

    if (!invoice) {
        return <div className="p-4">Invoice not found.</div>;
    }

    return (
        <div className="p-4 invoice-container">
            <div className="flex justify-between items-center mb-4">
                <PageTitle>Invoice #{invoice.invoiceCode}</PageTitle>
                <Button onClick={() => window.print()} className="no-print">
                    Print
                </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="font-bold">Invoice Id:</p>
                        <p>{invoice.invoiceCode}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="font-bold">Student Name:</p>
                        <p>{invoice.student}</p>
                    </div>
                    <div>
                        <p className="font-bold">Date:</p>
                        <p>{new Date(invoice.date).toLocaleDateString()}</p>
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-2">Items:</h3>
                <table className="w-full mb-4">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2">Product</th>
                            <th className="text-center py-2">Quantity</th>
                            <th className="text-right py-2">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.sales.map((s) => (
                            <tr key={s.id} className="border-b">
                                <td className="py-2">{s.product.name}</td>
                                <td className="text-center py-2">
                                    {s.quantity}
                                </td>
                                <td className="text-right py-2">
                                    ₹{Number(s.totalPrice).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="text-right">
                    <h2 className="text-2xl font-bold">
                        Total: ₹{Number(invoice.total).toFixed(2)}
                    </h2>
                </div>
            </div>

            <Link
                href="/sales/history"
                className="mt-4 inline-block text-blue-500 no-print"
            >
                ← Back to Sales History
            </Link>
        </div>
    );
}
