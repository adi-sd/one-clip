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
            <body className={`${interFont.variable} ${interFont.variable} antialiased h-screen w-screen`}>
                <AuthProvider>
                    <AuthModalProvider>
                        <div className="h-full w-full overflow-hidden">
                            <Navbar />
                            <main className="h-[calc(100%-5rem)] w-full py-4 px-8">{children}</main>
                        </div>
                    </AuthModalProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
