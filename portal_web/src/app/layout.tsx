// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/widgets/header/ui/header";
import { Footer } from "@/widgets/footer/ui/footer";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "СибАДИ | Портал трудоустройства",
  description: "Единая платформа для студентов и партнеров",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen bg-background`}>
        <Providers> {/* <--- ОБЕРТКА */}
          <Header />
          
          <div className="flex-grow">
            {children}
          </div>

          <Footer />
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}