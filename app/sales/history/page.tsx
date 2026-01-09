import Link from "next/link";
import prisma from "@/lib/prisma";
import { PageTitle } from "@/components/app/page-title";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default async function SalesHistoryPage() {
    const invoices = await prisma.invoice.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="w-full flex flex-col justify-center p-6">
            <div className="flex justify-between items-center mb-4">
                <PageTitle>Sales History</PageTitle>
                <Link href="/sales/new">
                    <Button>+ New Sale</Button>
                </Link>
            </div>

            <div className="flex justify-center px-4">
                <Table className="w-full text-sm rounded-md p-0 scrollbar-hide">
                    <TableHeader className="bg-primary/50 text-accent-foreground">
                        <TableRow>
                            <TableHead className="px-4 py-3 text-left font-semibold">
                                Date
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold">
                                Student/Customer
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold">
                                Total Amount
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.length > 0 ? (
                            invoices.map((inv) => (
                                <TableRow key={inv.id} className="border-t">
                                    <TableCell className="px-4 py-2">
                                        {format(
                                            new Date(inv.date),
                                            "dd/MM/yyyy"
                                        )}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        {inv.student}
                                    </TableCell>
                                    <TableCell className="px-4 py-2 font-semibold">
                                        ₹{inv.total.toString()}
                                    </TableCell>
                                    <TableCell className="px-4 py-2 text-blue-600 underline">
                                        <Link
                                            href={`/sales/invoice/${inv.id}`}
                                        >
                                            View Invoice
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="px-4 py-6 text-center italic"
                                >
                                    No invoices recorded yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
