"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import SplashScreen from "../splashScreen";
import { useState, useEffect } from "react";
import {
  Github,
  Twitter,
  Mail,
  Zap,
  Shield,
  Users,
  Globe,
  Heart,
  Target,
  Award,
  Lightbulb,
  Star,
} from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import Layout from "@/components/layout";

export default function AboutPage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <>
      <Head>
        <title>About Us | PrivGPT Studio - Our Mission, Team & AI Vision</title>
        <meta
          name="description"
          content="Meet the team behind PrivGPT Studio. Learn about our mission to democratize AI with privacy-first solutions, our core values, and our innovative approach to cloud + local AI models."
        />
        <meta
          name="keywords"
          content="About PrivGPT Studio, AI company mission, privacy-first AI, AI team, cloud and local AI, AI innovation, PrivGPT Studio team, AI technology company"
        />
        <meta
          property="og:title"
          content="About Us | PrivGPT Studio - Our Mission, Team & AI Vision"
        />
        <meta
          property="og:description"
          content="Discover PrivGPT Studio's mission to make AI accessible and private. Meet our team and learn about our innovative cloud + local AI solutions."
        />
        <meta
          property="og:url"
          content="https://privgpt-studio.vercel.app/about"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://privgpt-studio.vercel.app/logo.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="PrivGPT Studio Team and Mission Overview"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | PrivGPT Studio" />
        <meta
          name="twitter:description"
          content="Learn about our mission to democratize AI with privacy-first solutions and our innovative cloud + local AI approach."
        />
        <meta
          name="twitter:image"
          content="https://privgpt-studio.vercel.app/logo.png"
        />
        <link rel="canonical" href="https://privgpt-studio.vercel.app/about" />
      </Head>

      <div className="min-h-screen bg-background">
        <Layout>
          {/* Hero */}
          <section className="py-20 px-4 text-center">
            <Badge variant="secondary" className="mb-4">
              🚀 About PrivGPT Studio
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              About Us
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto">
              At{" "}
              <span className="font-semibold text-foreground">
                PrivGPT Studio
              </span>
              , we believe AI should be powerful, accessible, and private. Our
              mission is to provide an intuitive platform that lets users
              experience the best of both cloud-powered and local AI models.
            </p>
          </section>

          {/* Our Story */}
          <section className="py-16 px-4 bg-muted/50">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold text-center mb-12">
                Our Story
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">The Vision</h3>
                  <p className="text-muted-foreground mb-4">
                    Founded in 2024, PrivGPT Studio emerged from a simple yet
                    powerful idea: AI should be accessible, private, and
                    tailored to individual needs. We recognized the growing
                    tension between the convenience of cloud-based AI and the
                    necessity of data privacy.
                  </p>
                  <p className="text-muted-foreground">
                    Our mission is to democratize AI by giving users the freedom
                    to choose between the speed of cloud computing and the
                    security of local processing, without compromising on
                    quality or user experience.
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-2xl flex items-center justify-center">
                    <Lightbulb className="w-24 h-24 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl font-bold text-center mb-12">
                Our Core Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Privacy First
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Your data belongs to you. We champion privacy-preserving
                      AI solutions that keep your conversations secure.
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">User-Centric</h3>
                    <p className="text-muted-foreground text-sm">
                      Every feature we build is designed with our users in mind,
                      prioritizing simplicity and effectiveness.
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Accessibility
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      AI should be accessible to everyone, regardless of
                      technical expertise or geographical location.
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                    <p className="text-muted-foreground text-sm">
                      We continuously push boundaries to bring you the latest
                      advancements in AI technology.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Mission Section Enhanced */}
          <section className="py-16 px-4 bg-muted/50">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl font-bold text-center mb-12">
                Our Mission & Goals
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">
                    What We Stand For
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Target className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold mb-2">Empower Choice</h4>
                        <p className="text-muted-foreground">
                          Give users the freedom to choose between cloud and
                          local AI models based on their specific needs and
                          privacy requirements.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold mb-2">Protect Privacy</h4>
                        <p className="text-muted-foreground">
                          Ensure that users maintain complete control over their
                          data while still accessing powerful AI capabilities.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Award className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold mb-2">Drive Innovation</h4>
                        <p className="text-muted-foreground">
                          Push the boundaries of what's possible with AI while
                          maintaining ethical standards and user trust.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>What Sets Us Apart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">
                          Dual-mode architecture supporting both cloud and local
                          AI
                        </span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">
                          Privacy-first design with optional offline
                          capabilities
                        </span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">
                          Seamless model switching without losing conversation
                          context
                        </span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">
                          Open-source commitment to transparency and community
                        </span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">
                          Enterprise-grade security with consumer-friendly UX
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Team Section Enhanced */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl font-bold text-center mb-12">
                Meet the Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg mb-1">Bob Walten</h3>
                    <Badge variant="outline" className="mb-3">
                      Founder & CEO
                    </Badge>
                    <p className="text-muted-foreground text-sm mb-4">
                      Former AI researcher with 10+ years experience. Passionate
                      about democratizing AI and building user-centric products.
                    </p>
                    <div className="flex justify-center space-x-3">
                      <Button variant="ghost" size="sm">
                        <Github className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg mb-1">Alisa Jones</h3>
                    <Badge variant="outline" className="mb-3">
                      Product Manager
                    </Badge>
                    <p className="text-muted-foreground text-sm mb-4">
                      Expert in product strategy and user experience. Focused on
                      making complex AI interactions simple and intuitive.
                    </p>
                    <div className="flex justify-center space-x-3">
                      <Button variant="ghost" size="sm">
                        <Github className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src="https://randomuser.me/api/portraits/men/85.jpg" />
                      <AvatarFallback>MJ</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg mb-1">Alice Roy</h3>
                    <Badge variant="outline" className="mb-3">
                      Lead Developer
                    </Badge>
                    <p className="text-muted-foreground text-sm mb-4">
                      Full-stack developer specialized in AI integration and
                      privacy-preserving technologies. Loves clean code and
                      great UX.
                    </p>
                    <div className="flex justify-center space-x-3">
                      <Button variant="ghost" size="sm">
                        <Github className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Company Stats */}
          <section className="py-16 px-4 bg-muted/50">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold text-center mb-12">
                Our Impact
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    50K+
                  </div>
                  <div className="text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    2M+
                  </div>
                  <div className="text-muted-foreground">Conversations</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    15+
                  </div>
                  <div className="text-muted-foreground">AI Models</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    99.9%
                  </div>
                  <div className="text-muted-foreground">Uptime</div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="py-16 px-4">
            <div className="container mx-auto text-center max-w-3xl">
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Have questions about our mission, want to join our team, or
                interested in partnerships? We'd love to hear from you.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
                <Link href="/chat">
                  <Button variant="outline" size="lg">
                    <Zap className="w-4 h-4 mr-2" />
                    Try Our Chat
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </Layout>
      </div>
    </>
  );
}
