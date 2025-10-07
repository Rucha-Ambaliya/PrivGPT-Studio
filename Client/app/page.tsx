'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Zap, Star, Github, Twitter, Mail, Menu } from 'lucide-react';
import Link from 'next/link';
import SplashScreen from './splashScreen';
import { useState, useEffect } from 'react';
import ScrollToTop from '@/components/ui/scroll-to-top';
import Layout from '@/components/layout';

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (showSplash) return <SplashScreen />;

  return (
    <div className="min-h-screen bg-background">
      <Layout>
        {/* Rest of your component remains exactly the same */}
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              🚀 Now supporting local AI models
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              PrivGPT Studio
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Experience the future of AI conversations with both cloud-powered
              Gemini and privacy-focused local models
            </p>
            <Link href="/chat">
              <Button size="lg" className="text-lg px-8 py-6">
                Start for Free
              </Button>
            </Link>
          </div>
        </section>

        {/* Key Stats */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  99.9%
                </div>
                <div className="text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <div className="text-muted-foreground">Supported Models</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Choose Your Model
                </h3>
                <p className="text-muted-foreground">
                  Select between cloud-powered Gemini or privacy-focused local
                  models
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Start Chatting</h3>
                <p className="text-muted-foreground">
                  Ask questions, get help, or have natural conversations
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Results</h3>
                <p className="text-muted-foreground">
                  Receive intelligent, contextual responses in real-time
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Gemini vs Local Models
            </h2>
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
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
                        <tr className="border-b">
                          <td className="p-4">Speed</td>
                          <td className="p-4 text-center">
                            <Badge variant="default">Ultra Fast</Badge>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="secondary">Fast</Badge>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-4">Offline Capability</td>
                          <td className="p-4 text-center">❌</td>
                          <td className="p-4 text-center">✅</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-4">Privacy</td>
                          <td className="p-4 text-center">
                            <Badge variant="outline">Standard</Badge>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="default">Maximum</Badge>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-4">Model Variety</td>
                          <td className="p-4 text-center">
                            <Badge variant="default">Extensive</Badge>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="secondary">Growing</Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-4">Cost</td>
                          <td className="p-4 text-center">
                            <Badge variant="outline">Pay per use</Badge>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="default">Free</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
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
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
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
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
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
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Live Demo Preview */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              See It In Action
            </h2>
            <div className="w-full flex justify-center">
              <Card className="w-full max-w-4xl shadow-xl border-2 border-primary/20">
                <CardHeader className="bg-primary/10 rounded-t-lg">
                  <CardTitle className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="font-semibold">Live Chat Demo</span>
                    </span>
                    <Badge variant="secondary">Gemini Model</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-background rounded-b-lg mt-8">
                  <div className="flex flex-col gap-2 h-80 overflow-y-auto bg-muted/30 rounded-lg p-4 border border-muted-foreground/10">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-2 max-w-xs shadow-md text-right">
                        Give me 3 fun facts about space.
                      </div>
                    </div>
                    {/* Bot message */}
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl px-4 py-2 max-w-xs shadow text-left">
                        <div className="prose prose-sm dark:prose-invert">
                          1. A day on Venus is longer than its year
                          <br />
                          2. Neutron stars can spin 600 times/sec
                          <br />
                          3. Space isn't completely silent!
                        </div>
                      </div>
                    </div>
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-2 max-w-xs shadow-md text-right">
                        Explain AI like I'm 5.
                      </div>
                    </div>
                    {/* Bot message */}
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl px-4 py-2 max-w-xs shadow text-left">
                        It's like a super-smart robot brain that learns by
                        looking at patterns!
                      </div>
                    </div>
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-2 max-w-xs shadow-md text-right">
                        Write a one-line love poem.
                      </div>
                    </div>
                    {/* Bot message */}
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl px-4 py-2 max-w-xs shadow text-left">
                        Your smile rewrites the code in my heart.
                      </div>
                    </div>
                    {/* Typing indicator */}
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl px-4 py-2 max-w-xs shadow text-left">
                        <div className="flex items-center gap-2">
                          <span className="animate-pulse w-2 h-2 bg-primary rounded-full"></span>
                          <span className="animate-pulse">Typing...</span>
                        </div>
                      </div>
                    </div>
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
            </div>
          </div>
        </section>
      </Layout>

      <ScrollToTop />
    </div>
  );
}
