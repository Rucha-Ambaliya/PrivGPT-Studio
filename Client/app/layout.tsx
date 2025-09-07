import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PrivGPT Studio",
  description:
    "Experience the future of AI conversations with both cloud-powered Gemini and privacy-focused local models",
  icons: {
    icon: "/assets/logo-icon-dark.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300`}
      >
        <ThemeProvider>
          {/* Your existing top navigation (with Try Chat + Sun icon) is inside children */}
          <Toaster position="top-right" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
