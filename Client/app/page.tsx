"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Zap, Star, Github, Twitter, Mail } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import SplashScreen from "./splashScreen";
import { useState, useEffect } from "react";
import Head from "next/head";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>PrivGPT Studio | AI Chat with Cloud & Local Models</title>
        <meta
          name="description"
          content="Experience the future of AI conversations with PrivGPT Studio. Switch seamlessly between cloud-powered Gemini and privacy-focused local models — secure, fast, and intuitive."
        />
        <meta
          name="keywords"
          content="AI chat, Gemini AI, local AI models, PrivGPT Studio, privacy-focused AI, AI conversations, AI chatbot, offline AI"
        />
        <meta name="author" content="PrivGPT Studio Team" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="PrivGPT Studio | AI Chat with Cloud & Local Models"
        />
        <meta
          property="og:description"
          content="Switch between Gemini (cloud) and local AI models for secure, seamless conversations. Try it free today!"
        />
        <meta property="og:url" content="https://privgpt-studio.vercel.app/" />
        <meta property="og:site_name" content="PrivGPT Studio" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://privgpt-studio.vercel.app/logo.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="PrivGPT Studio AI Chat Preview"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="PrivGPT Studio | AI Chat with Cloud & Local Models"
        />
        <meta
          name="twitter:description"
          content="Experience seamless AI chat with both cloud-powered Gemini and private local models."
        />
        <meta
          name="twitter:image"
          content="https://privgpt-studio.vercel.app/logo.png"
        />

        {/* Icons */}
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </Head>

      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge variant="secondary" className="mb-4">
              🚀 Now supporting local AI models
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            PrivGPT Studio
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Experience the future of AI conversations with both cloud-powered
            Gemini and privacy-focused local models
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link href="/chat">
              <Button size="lg" className="text-lg px-8 py-6">
                Start for Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
            viewport={{ once: true }}
          >
            {[
              { number: "50K+", label: "Active Users" },
              { number: "99.9%", label: "Uptime" },
              { number: "15+", label: "Supported Models" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="text-3xl font-bold text-primary mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                  viewport={{ once: true }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
            viewport={{ once: true }}
          >
            {[
              {
                step: "1",
                title: "Choose Your Model",
                description: "Select between cloud-powered Gemini or privacy-focused local models"
              },
              {
                step: "2",
                title: "Start Chatting",
                description: "Ask questions, get help, or have natural conversations"
              },
              {
                step: "3",
                title: "Get Results",
                description: "Receive intelligent, contextual responses in real-time"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <motion.div
                  className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.3, type: "spring", stiffness: 200 }}
                  viewport={{ once: true }}
                >
                  <span className="text-2xl font-bold text-primary">{item.step}</span>
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Gemini vs Local Models
          </motion.h2>
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <motion.tr
                        className="border-b"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                      >
                        <th className="text-left p-4 font-semibold">Feature</th>
                        <th className="text-center p-4 font-semibold">
                          Gemini (Cloud)
                        </th>
                        <th className="text-center p-4 font-semibold">
                          Local Models
                        </th>
                      </motion.tr>
                    </thead>
                    <tbody>
                      {[
                        { feature: "Speed", gemini: "Ultra Fast", local: "Fast", geminiVariant: "default", localVariant: "secondary" },
                        { feature: "Offline Capability", gemini: "❌", local: "✅", geminiVariant: null, localVariant: null },
                        { feature: "Privacy", gemini: "Standard", local: "Maximum", geminiVariant: "outline", localVariant: "default" },
                        { feature: "Model Variety", gemini: "Extensive", local: "Growing", geminiVariant: "default", localVariant: "secondary" },
                        { feature: "Cost", gemini: "Pay per use", local: "Free", geminiVariant: "outline", localVariant: "default" }
                      ].map((row, index) => (
                        <motion.tr
                          key={index}
                          className="border-b last:border-b-0"
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                          viewport={{ once: true }}
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                        >
                          <td className="p-4">{row.feature}</td>
                          <td className="p-4 text-center">
                            {row.geminiVariant ? (
                              <Badge variant={row.geminiVariant as any}>{row.gemini}</Badge>
                            ) : (
                              row.gemini
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {row.localVariant ? (
                              <Badge variant={row.localVariant as any}>{row.local}</Badge>
                            ) : (
                              row.local
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What Our Users Say
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
            viewport={{ once: true }}
          >
            {[
              {
                stars: 5,
                text: "The local model option is a game-changer for our privacy-sensitive work. Amazing performance!",
                name: "John Doe",
                role: "Security Engineer",
                avatar: "https://salondesmaires-po.fr/wp-content/uploads/2015/04/speaker-3-v2.jpg",
                initials: "JD"
              },
              {
                stars: 5,
                text: "Seamless switching between Cloud and local models. Perfect for different use cases.",
                name: "Sarah Miller",
                role: "Product Manager",
                avatar: "https://s3.amazonaws.com/media.mixrank.com/profilepic/30051c3ae8729c984c3c9d8a51ba7df8",
                initials: "SM"
              },
              {
                stars: 5,
                text: "Best AI chat interface I've used. Clean, fast, and incredibly intuitive.",
                name: "Mike Johnson",
                role: "Developer",
                avatar: "https://tse1.mm.bing.net/th/id/OIP.6FXhGomoaY1IKhQp0zFPfwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
                initials: "MJ"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <motion.div
                      className="flex items-center mb-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                      viewport={{ once: true }}
                    >
                      {[...Array(testimonial.stars)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.2 + 0.4 + i * 0.1, type: "spring", stiffness: 200 }}
                          viewport={{ once: true }}
                        >
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </motion.div>
                    <p className="text-muted-foreground mb-4">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center">
                      <Avatar className="w-10 h-10 mr-3">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>{testimonial.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Live Demo Preview */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            See It In Action
          </motion.h2>
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Live Chat Demo</span>
                    <Badge variant="secondary">Gemini Model</Badge>
                  </CardTitle>
                </CardHeader>
              </motion.div>
              <CardContent>
                <motion.div
                  className="space-y-4 h-64 overflow-y-auto bg-muted/30 rounded-lg p-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  {[
                    { type: "user", message: "Give me 3 fun facts about space.", delay: 0.5 },
                    {
                      type: "ai",
                      message: "1. A day on Venus is longer than its year\n2. Neutron stars can spin 600 times/sec\n3. Space isn't completely silent!",
                      delay: 0.7,
                      isHtml: true
                    },
                    { type: "user", message: "Explain AI like I'm 5.", delay: 0.9 },
                    { type: "ai", message: "It's like a super-smart robot brain that learns by looking at patterns!", delay: 1.1 },
                    { type: "user", message: "Write a one-line love poem.", delay: 1.3 },
                    { type: "ai", message: "Your smile rewrites the code in my heart.", delay: 1.5, isHtml: true },
                    { type: "typing", message: "Typing...", delay: 1.7 }
                  ].map((msg, index) => (
                    <motion.div
                      key={index}
                      className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: msg.delay }}
                      viewport={{ once: true }}
                    >
                      <motion.div
                        className={`rounded-lg px-3 py-2 max-w-xs ${msg.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : msg.type === "typing"
                              ? "bg-muted rounded-lg px-3 py-2 max-w-xs"
                              : "bg-muted rounded-lg px-3 py-2 max-w-xs"
                          }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        {msg.type === "typing" ? (
                          <div className="animate-pulse">{msg.message}</div>
                        ) : msg.isHtml ? (
                          <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap">
                            {msg.message}
                          </div>
                        ) : (
                          msg.message
                        )}
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className="mt-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.9 }}
                  viewport={{ once: true }}
                >
                  <Link href="/chat">
                    <Button>Try It Yourself</Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="border-t py-12 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">PrivGPT Studio</span>
              </div>
              <p className="text-muted-foreground">
                The future of AI conversations, powered by both cloud and local
                models.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/chat" className="hover:text-foreground transition-colors">
                    Chat Interface
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    API Access
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Model Library
                  </Link>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="border-t mt-8 pt-8 text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p>&copy; 2025 PrivGPT Studio. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
      <ScrollToTop />
    </div>
  );
}
