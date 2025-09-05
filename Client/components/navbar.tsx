"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const NavLink = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => {
    return (
        <Link
            href={href}
            className={`nav-link-underline ${className}`}
        >
            {children}
        </Link>
    );
};

export default function Navbar() {
    return (
        <motion.header
            className="border-b"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <motion.div
                    className="flex items-center space-x-2"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold">PrivGPT Studio</span>
                </motion.div>

                <motion.div
                    className="flex items-center space-x-6"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <ThemeToggle />
                    <NavLink href="/" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                        Home
                    </NavLink>
                    <NavLink href="/about" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                        About Us
                    </NavLink>
                    <Link href="/chat">
                        <Button variant="outline">Try Chat</Button>
                    </Link>
                </motion.div>
            </div>
        </motion.header>
    );
}
