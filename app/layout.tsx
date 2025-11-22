import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const dmSans = localFont({
    src: "./font/DM_Sans.ttf",
});

export const metadata: Metadata = {
    title: "Suvidha | Inventory Management",
    description: "Inventory Management Platform for Suvidha",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${dmSans.className} antialiased`}>
                {children}
                <Toaster richColors position="top-right" />
            </body>
        </html>
    );
}
