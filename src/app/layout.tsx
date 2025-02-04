import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import AuthProvider from "@/providers/AuthProvider";
import { AuthModalProvider } from "@/providers/AuthModalProvider";
import { ToasterProvider } from "@/providers/ToasterProvider";

const interFont = Inter({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    preload: true,
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
            <body className={`${interFont.variable} ${interFont.variable} antialiased h-screen w-screen`}>
                <AuthProvider>
                    <AuthModalProvider>
                        <ToasterProvider />
                        <div className="h-full w-full overflow-hidden">
                            <Navbar />
                            <main className="h-[calc(100%-5rem)] w-full p-8 bg-gray-50">{children}</main>
                        </div>
                    </AuthModalProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
