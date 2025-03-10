import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/navbar/Navbar";
import AuthProvider from "@/providers/AuthProvider";
import { AuthModalProvider } from "@/providers/AuthModalProvider";
import { ToasterProvider } from "@/providers/ToasterProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

const interFont = Inter({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    preload: true,
});

export const metadata: Metadata = {
    title: "One-Clip",
    description: "Quickly copy and manage your text snippets",
    icons: {
        icon: "/favicon.png",
    },
    viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${interFont.variable} ${interFont.variable} antialiased h-screen w-screen font-mono overflow-hidden`}
            >
                <AuthProvider>
                    <AuthModalProvider>
                        <ToasterProvider />
                        <TooltipProvider>
                            <div className="h-full w-full overflow-hidden">
                                <Navbar />
                                <main className="h-[calc(100%-4rem)] md:h-[calc(100%-5rem)] w-full p-3 md:p-4 bg-gray-50">
                                    {children}
                                </main>
                            </div>
                        </TooltipProvider>
                    </AuthModalProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
