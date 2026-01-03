"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCard, AnimatedCardContent } from "@/components/ui/animated-card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { AnimatedPage } from "@/components/ui/animated-page";
import { AnimatedSection, AnimatedItem } from "@/components/ui/animated-section";
import { motion } from "framer-motion";
import { fadeInUpVariants } from "@/lib/animations";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <AnimatedPage className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <motion.div
          className="container mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2, delayChildren: 0.1 },
            },
          }}
        >
          <motion.div variants={fadeInUpVariants}>
            <Badge variant="secondary" className="mb-4">
              🚀 Now supporting local AI models
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUpVariants}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
          >
            PrivGPT Studio
          </motion.h1>

          <motion.p
            variants={fadeInUpVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
          >
            Experience the future of AI conversations with both cloud-powered
            Gemini and privacy-focused local models
          </motion.p>

          <motion.div variants={fadeInUpVariants}>
            <Link href="/chat">
              <Button size="lg" className="text-lg px-8 py-6">
                Start for Free
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Key Stats */}
      <AnimatedSection className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            ["50K+", "Active Users"],
            ["99.9%", "Uptime"],
            ["15+", "Supported Models"],
            ["24/7", "Support"],
          ].map(([value, label]) => (
            <AnimatedItem key={label}>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {value}
                </div>
                <div className="text-muted-foreground">{label}</div>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "John Doe",
                role: "Security Engineer",
                text:
                  "The local model option is a game-changer for privacy-sensitive work.",
                img:
                  "https://salondesmaires-po.fr/wp-content/uploads/2015/04/speaker-3-v2.jpg",
              },
              {
                name: "Sarah Miller",
                role: "Product Manager",
                text:
                  "Seamless switching between cloud and local models. Love it.",
                img:
                  "https://s3.amazonaws.com/media.mixrank.com/profilepic/30051c3ae8729c984c3c9d8a51ba7df8",
              },
              {
                name: "Mike Johnson",
                role: "Developer",
                text:
                  "Best AI chat interface I've ever used. Clean and fast.",
                img:
                  "https://tse1.mm.bing.net/th/id/OIP.6FXhGomoaY1IKhQp0zFPfwHaEK",
              },
            ].map((user) => (
              <AnimatedItem key={user.name}>
                <AnimatedCard>
                  <AnimatedCardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      "{user.text}"
                    </p>
                    <div className="flex items-center">
                      <Avatar className="mr-3">
                        <AvatarImage src={user.img} />
                        <AvatarFallback>
                          {user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.role}
                        </div>
                      </div>
                    </div>
                  </AnimatedCardContent>
                </AnimatedCard>
              </AnimatedItem>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <ScrollToTop />
    </AnimatedPage>
  );
}
