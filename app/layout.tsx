import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ভর্তি ফরম - Admission Form",
  description: "Bengali admission form application with modern Next.js 15",
  keywords: ["admission", "form", "bengali", "education"],
  authors: [{ name: "Admission System" }],
  creator: "Admission System",
  openGraph: {
    title: "ভর্তি ফরম - Admission Form",
    description: "Bengali admission form application",
    type: "website",
    locale: "bn_BD",
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Header />

        <main className="min-h-screen">{children}</main>

        <footer className="bg-gray-100 text-center text-sm text-gray-600 p-4 border-t">
          &copy; {new Date().getFullYear()} ভর্তি ফরম | সর্বস্বত্ব সংরক্ষিত
        </footer>
      </body>
    </html>
  );
}
