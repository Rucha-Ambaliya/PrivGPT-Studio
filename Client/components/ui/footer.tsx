'use client';

import { Zap, Star, Github, Twitter, Mail, Menu } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/components/theme-provider';

export default function footer() {
  const { darkMode } = useTheme();
  return (
    <footer className="border-t py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center">
              <Image
                src={
                  darkMode ? '/logos/logo-dark.svg' : '/logos/logo-light.svg'
                }
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
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-5">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="w-6 h-6" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="w-6 h-6" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
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
