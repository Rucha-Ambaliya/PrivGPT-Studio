"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCard, AnimatedCardContent } from "@/components/ui/animated-card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Zap, Star, Github, Twitter, Mail, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { AnimatedPage } from "@/components/ui/animated-page";
import { AnimatedSection, AnimatedItem } from "@/components/ui/animated-section";
import { motion } from "framer-motion";
import { fadeInUpVariants, staggerItemVariants } from "@/lib/animations";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
              }
            }
          }}
        >
          <motion.div variants={fadeInUpVariants}>
            <Badge variant="secondary" className="mb-4 hover:scale-105 transition-transform">
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
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <AnimatedItem>
              <div className="text-center hover:scale-105 transition-transform">
                <motion.div 
                  className="text-3xl font-bold text-primary mb-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  50K+
                </motion.div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
            </AnimatedItem>
            <AnimatedItem>
              <div className="text-center hover:scale-105 transition-transform">
                <motion.div 
                  className="text-3xl font-bold text-primary mb-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  99.9%
                </motion.div>
                <div className="text-muted-foreground">Uptime</div>
              </div>
            </AnimatedItem>
            <AnimatedItem>
              <div className="text-center hover:scale-105 transition-transform">
                <motion.div 
                  className="text-3xl font-bold text-primary mb-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  15+
                </motion.div>
                <div className="text-muted-foreground">Supported Models</div>
              </div>
            </AnimatedItem>
            <AnimatedItem>
              <div className="text-center hover:scale-105 transition-transform">
                <motion.div 
                  className="text-3xl font-bold text-primary mb-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  24/7
                </motion.div>
                <div className="text-muted-foreground">Support</div>
              </div>
            </AnimatedItem>
          </div>
        </div>
      </AnimatedSection>

      {/* How It Works */}
      <AnimatedSection className="py-16 px-4">
        <div className="container mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-12"
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedItem>
              <div className="text-center">
                <motion.div 
                  className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-2xl font-bold text-primary">1</span>
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">
                  Choose Your Model
                </h3>
                <p className="text-muted-foreground">
                  Select between cloud-powered Gemini or privacy-focused local
                  models
                </p>
              </div>
            </AnimatedItem>
            <AnimatedItem>
              <div className="text-center">
                <motion.div 
                  className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-2xl font-bold text-primary">2</span>
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Start Chatting</h3>
                <p className="text-muted-foreground">
                  Ask questions, get help, or have natural conversations
                </p>
              </div>
            </AnimatedItem>
            <AnimatedItem>
              <div className="text-center">
                <motion.div 
                  className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-2xl font-bold text-primary">3</span>
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Get Results</h3>
                <p className="text-muted-foreground">
                  Receive intelligent, contextual responses in real-time
                </p>
              </div>
            </AnimatedItem>
          </div>
        </div>
      </AnimatedSection>

      {/* Feature Comparison */}
      <AnimatedSection className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Gemini vs Local Models
          </motion.h2>
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left p-4 font-semibold">
                          Feature
                        </th>
                        <th className="text-center p-4 font-semibold">
                          Gemini (Cloud)
                        </th>
                        <th className="text-center p-4 font-semibold">
                          Local Models
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <motion.tr 
                        className="border-b hover:bg-muted/20 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                      >
                        <td className="p-4 font-medium">Speed</td>
                        <td className="p-4 text-center">
                          <Badge variant="default" className="hover:scale-105 transition-transform">Ultra Fast</Badge>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant="secondary" className="hover:scale-105 transition-transform">Fast</Badge>
                        </td>
                      </motion.tr>
                      <motion.tr 
                        className="border-b hover:bg-muted/20 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                      >
                        <td className="p-4 font-medium">Offline Capability</td>
                        <td className="p-4 text-center text-xl">❌</td>
                        <td className="p-4 text-center text-xl">✅</td>
                      </motion.tr>
                      <motion.tr 
                        className="border-b hover:bg-muted/20 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                      >
                        <td className="p-4 font-medium">Privacy</td>
                        <td className="p-4 text-center">
                          <Badge variant="outline" className="hover:scale-105 transition-transform">Standard</Badge>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant="default" className="hover:scale-105 transition-transform">Maximum</Badge>
                        </td>
                      </motion.tr>
                      <motion.tr 
                        className="border-b hover:bg-muted/20 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                      >
                        <td className="p-4 font-medium">Model Variety</td>
                        <td className="p-4 text-center">
                          <Badge variant="default" className="hover:scale-105 transition-transform">Extensive</Badge>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant="secondary" className="hover:scale-105 transition-transform">Growing</Badge>
                        </td>
                      </motion.tr>
                      <motion.tr 
                        className="hover:bg-muted/20 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                      >
                        <td className="p-4 font-medium">Cost</td>
                        <td className="p-4 text-center">
                          <Badge variant="outline" className="hover:scale-105 transition-transform">Pay per use</Badge>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant="default" className="hover:scale-105 transition-transform">Free</Badge>
                        </td>
                      </motion.tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection className="py-16 px-4">
        <div className="container mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-12"
          >
            What Our Users Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedItem>
              <AnimatedCard>
                <AnimatedCardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "The local model option is a game-changer for our
                    privacy-sensitive work. Amazing performance!"
                  </p>
                  <div className="flex items-center">
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarImage src="https://salondesmaires-po.fr/wp-content/uploads/2015/04/speaker-3-v2.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">John Doe</div>
                      <div className="text-sm text-muted-foreground">
                        Security Engineer
                      </div>
                    </div>
                  </div>
                </AnimatedCardContent>
              </AnimatedCard>
            </AnimatedItem>
            <AnimatedItem>
              <AnimatedCard>
                <AnimatedCardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "Seamless switching between Cloud and local models. Perfect
                    for different use cases."
                  </p>
                  <div className="flex items-center">
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarImage src="https://s3.amazonaws.com/media.mixrank.com/profilepic/30051c3ae8729c984c3c9d8a51ba7df8" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">Sarah Miller</div>
                      <div className="text-sm text-muted-foreground">
                        Product Manager
                      </div>
                    </div>
                  </div>
                </AnimatedCardContent>
              </AnimatedCard>
            </AnimatedItem>
            <AnimatedItem>
              <AnimatedCard>
                <AnimatedCardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "Best AI chat interface I've used. Clean, fast, and
                    incredibly intuitive."
                  </p>
                  <div className="flex items-center">
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarImage src="https://tse1.mm.bing.net/th/id/OIP.6FXhGomoaY1IKhQp0zFPfwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" />
                      <AvatarFallback>MJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">Mike Johnson</div>
                      <div className="text-sm text-muted-foreground">
                        Developer
                      </div>
                    </div>
                  </div>
                </AnimatedCardContent>
              </AnimatedCard>
            </AnimatedItem>
          </div>
        </div>
      </AnimatedSection>

      {/* Live Demo Preview */}
      <AnimatedSection className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-12"
          >
            See It In Action
          </motion.h2>
          <div className="w-full flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl"
            >
              <Card className="shadow-xl border-2 border-primary/20">
                <CardHeader className="bg-primary/10 rounded-t-lg">
                  <CardTitle className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <motion.span 
                        className="inline-block w-2 h-2 bg-green-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="font-semibold">Live Chat Demo</span>
                    </span>
                    <Badge variant="secondary">Gemini Model</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-background rounded-b-lg mt-8">
                  <div className="flex flex-col gap-2 h-80 overflow-y-auto bg-muted/30 rounded-lg p-4 border border-muted-foreground/10">
                    {/* User message */}
                    <motion.div 
                      className="flex justify-end"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-2 max-w-xs shadow-md text-right">
                        Give me 3 fun facts about space.
                      </div>
                    </motion.div>
                    {/* Bot message */}
                    <motion.div 
                      className="flex justify-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="bg-muted rounded-2xl px-4 py-2 max-w-xs shadow text-left">
                        <div className="prose prose-sm dark:prose-invert">
                          1. A day on Venus is longer than its year
                          <br />
                          2. Neutron stars can spin 600 times/sec
                          <br />
                          3. Space isn't completely silent!
                        </div>
                      </div>
                    </motion.div>
                    {/* User message */}
                    <motion.div 
                      className="flex justify-end"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-2 max-w-xs shadow-md text-right">
                        Explain AI like I'm 5.
                      </div>
                    </motion.div>
                    {/* Bot message */}
                    <motion.div 
                      className="flex justify-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="bg-muted rounded-2xl px-4 py-2 max-w-xs shadow text-left">
                        It's like a super-smart robot brain that learns by
                        looking at patterns!
                      </div>
                    </motion.div>
                    {/* User message */}
                    <motion.div 
                      className="flex justify-end"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-2 max-w-xs shadow-md text-right">
                        Write a one-line love poem.
                      </div>
                    </motion.div>
                    {/* Bot message */}
                    <motion.div 
                      className="flex justify-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="bg-muted rounded-2xl px-4 py-2 max-w-xs shadow text-left">
                        Your smile rewrites the code in my heart.
                      </div>
                    </motion.div>
                    {/* Typing indicator */}
                    <motion.div 
                      className="flex justify-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="bg-muted rounded-2xl px-4 py-2 max-w-xs shadow text-left">
                        <div className="flex items-center gap-2">
                          <motion.span 
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <span className="animate-pulse-slow">Typing...</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <Link href="/chat">
                      <Button size="lg" className="px-8">
                        Try It Yourself
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      <ScrollToTop />
    </AnimatedPage>
  );
}