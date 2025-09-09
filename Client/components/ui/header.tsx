"use client";

import { Button } from "@/components/ui/button";
import { Zap, Menu } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default function header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">PrivGPT Studio</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <Link href="/about">
              <Button variant="ghost">About Us</Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline">Try Chat</Button>
            </Link>
          </nav>

          <ThemeToggle />

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <SheetClose asChild>
                  <Link href="/">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={closeMobileMenu}
                    >
                      Home
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/about">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={closeMobileMenu}
                    >
                      About Us
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/chat">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={closeMobileMenu}
                    >
                      Try Chat
                    </Button>
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
