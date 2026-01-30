"use client";

import Header from "./ui/header";
import Footer from "./ui/footer";
import type React from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
