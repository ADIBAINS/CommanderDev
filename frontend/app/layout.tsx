import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CommanderD - Incident Intelligence",
  description: "AI-Powered Incident Response Platform for DevOps Teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "bg-zinc-950 text-zinc-100 min-h-screen antialiased selection:bg-indigo-500/30")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
