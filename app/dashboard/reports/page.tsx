"use client";

import { PageTitle } from "@/components/app/page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchSale } from "@/app/actions/sales";

interface Sale {
    product: {
        name: string;
    };
    quantity: number;
    totalPrice: number;
    date: string;
}

export default function DashboardReportPage() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });

    const [sales, setSales] = useState<Sale[]>([]);

    useEffect(() => {
        const loadSales = async () => {
            if (!date?.from || !date?.to) return;

            try {
                const fetchedSales = await fetchSale(date);

                const mappedSales: Sale[] = fetchedSales.map((s) => ({
                    product: { name: s.product.name },
                    quantity: s.quantity,
                    totalPrice: s.totalPrice,
                    date: s.createdAt,
                }));

                setSales(mappedSales);
            } catch (err) {
                console.error("Failed to fetch sales:", err);
            }
        };

        loadSales();
    }, [date]);
    const generateReport = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Sales Report", 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);

        if (date?.from) {
            const dateString = date.to
                ? `${format(date.from, "PP")} - ${format(date.to, "PP")}`
                : format(date.from, "PP");
            doc.text(`Period: ${dateString}`, 14, 30);
        }

        autoTable(doc, {
            startY: 35,
            head: [["Product", "Quantity", "Total Price", "Date"]],
            body: sales.map((sale) => [
                sale.product.name,
                sale.quantity,
                `₹${sale.totalPrice.toFixed(2)}`,
                sale.date,
            ]),
            theme: "striped",
            headStyles: { fillColor: [41, 128, 185] },
        });

        doc.save(`Report_${new Date().toISOString().split("T")[0]}.pdf`);
    };

    return (
        <div className="w-full flex flex-col gap-4 p-4">
            <PageTitle>Reports</PageTitle>
            <Card>
                <CardHeader>
                    <CardTitle>Sales Report</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-75 justify-start text-left font-normal",
                                        !date && "text-muted-foreground",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, "LLL dd, y")}{" "}
                                                - {format(date.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(date.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    autoFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button onClick={generateReport}>Generate Report</Button>
                </CardContent>
            </Card>
        </div>
    );
}
