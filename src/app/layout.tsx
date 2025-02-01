import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import AuthProvider from "@/providers/AuthProvider";
import { AuthModalProvider } from "@/providers/AuthModalProvider";

const interFont = Inter({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "One-Clip",
    description: "Quickly copy and manage your text snippets",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${interFont.variable} ${interFont.variable} antialiased`}>
                <AuthProvider>
                    <AuthModalProvider>
                        <Navbar />
                        <main className="container mx-auto p-4">{children}</main>
                    </AuthModalProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
