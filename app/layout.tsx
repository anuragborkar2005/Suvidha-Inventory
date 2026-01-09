import type { Metadata } from "next";
import { Inter, Merriweather, Fira_Code } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const merriweather = Merriweather({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-serif",
});
const firaCode = Fira_Code({
    subsets: ["latin"],
    variable: "--font-mono",
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
            <body
                className={`${inter.variable} ${merriweather.variable} ${firaCode.variable} font-sans antialiased`}
            >
                {children}
                <Toaster richColors position="top-right" />
            </body>
        </html>
    );
}
