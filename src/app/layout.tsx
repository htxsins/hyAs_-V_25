"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Theme-Provider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { UserProvider } from "@/providers/UserProvider";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "DU Hacks 25",
  description: "Hypertext Assasins",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title as React.ReactNode}</title>
        <meta name="description" content={metadata.description ?? undefined} />
        <link rel="icon" href="../public/logo.ico" sizes="any" />
      </head>
      <body className={`${inter.className} w-full h-screen overflow-auto`}>
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
