"use client";

import { Button } from "@/components/ui/button";
import { Zap, Menu, User, LogOut } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/context/AuthContext";

export default function header() {
  const { darkMode } = useTheme();
  const { token, user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  const getInitials = (user: any) => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">

        <Link href="/" className="flex items-center">
          <Image
            src={darkMode ? "/logos/logo-dark.svg" : "/logos/logo-light.svg"}
            alt="PrivGPT Studio Logo"
            width={290}
            height={43}
            priority
            className="w-[220px] h-auto"
          />
        </Link>

        <div className="flex items-center space-x-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/reviews"
              className="text-muted-foreground hover:text-foreground"
            >
              Reviews
            </Link>
            <Link href="/about">
              <Button variant="ghost">About Us</Button>
            </Link>
            <Link href={isAuthenticated ? "/chat" : "/sign-in?redirect=/chat"}>
              <Button variant="outline">Try Chat</Button>
            </Link>
          </nav>

          <ThemeToggle />

          {/* User Menu or Auth Button */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.first_name && user.last_name 
                        ? `${user.first_name} ${user.last_name}`
                        : user.username || "User"
                      }
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/chat" className="cursor-pointer">
                    <Zap className="mr-2 h-4 w-4" />
                    <span>Chat ({user.chat_sessions_count})</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}

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
                  <Link href="/reviews">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={closeMobileMenu}
                    >
                      Reviews
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
                  <Link href={isAuthenticated ? "/chat" : "/sign-in?redirect=/chat"}>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={closeMobileMenu}
                    >
                      Try Chat
                    </Button>
                  </Link>
                </SheetClose>
                
                {isAuthenticated && user ? (
                  <>
                    <div className="border-t pt-4">
                      <div className="px-2 py-2">
                        <p className="text-sm font-medium">
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}`
                            : user.username || "User"
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <Link href="/profile">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={closeMobileMenu}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <div className="border-t pt-4" />
                    <SheetClose asChild>
                      <Link href="/sign-in">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={closeMobileMenu}
                        >
                          Sign In
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/sign-up">
                        <Button
                          className="w-full"
                          onClick={closeMobileMenu}
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </SheetClose>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
