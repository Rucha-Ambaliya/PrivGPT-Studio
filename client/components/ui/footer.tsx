"use client";

import { Github, Mail } from "lucide-react";
import { AiOutlineDiscord } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/components/theme-provider";

export default function Footer() {
  const { darkMode } = useTheme();

  return (
    <footer className="border-t py-12 bg-background px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Logo + Description */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center">
              <Image
                src={darkMode ? "/logos/logo-dark.svg" : "/logos/logo-light.svg"}
                alt="PrivGPT Studio Logo"
                width={290}
                height={53}
                priority
                className="w-[220px] h-auto"
              />
            </Link>

            <p className="text-muted-foreground">
              The future of AI conversations, powered by both cloud and local
              models.
            </p>
          </div>

          {/* Community */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="https://github.com/Rucha-Ambaliya/PrivGPT-Studio/issues"
                  target="_blank"
                  className="hover:text-foreground"
                >
                  Open Issues
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/Rucha-Ambaliya/PrivGPT-Studio?tab=readme-ov-file#-contributing"
                  target="_blank"
                  className="hover:text-foreground"
                >
                  Contribute
                </Link>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/chat" className="hover:text-foreground">
                  Chat Interface
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  API Access
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Model Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-5 text-muted-foreground">

              {/* GitHub */}
              <a
                href="https://github.com/Rucha-Ambaliya/PrivGPT-Studio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-foreground transition"
              >
                <Github className="w-6 h-6" />
              </a>

              {/* Discord (outline icon as requested) */}
              <a
                href="https://discord.gg/J9z5T52rkZ"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="hover:text-foreground transition"
              >
                <AiOutlineDiscord className="w-7 h-8 -m-1" />
              </a>

              {/* Contact */}
              <Link
                href="/contact"
                aria-label="Contact Us"
                className="hover:text-foreground transition"
              >
                <Mail className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 PrivGPT Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
