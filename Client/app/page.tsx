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


export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <div className="min-h-screen bg-[#f0f4ff]">

      {/* Header */}
      <header className="bg-gradient-to-r from-[#2e3b70] to-[#3f4f8c] border-b border-gray-800">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl md:text-4xl font-bold text-white">PrivGPT Studio</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/chat">
              <Button
                className="bg-blue-500 text-white border border-blue-500 hover:bg-white hover:text-blue-600 transition-colors duration-300 px-4 py-2 rounded-lg font-semibold"
              >
                Try Chat
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
            🚀 Now supporting local AI models
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            PrivGPT Studio
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Experience the future of AI conversations with both cloud-powered Gemini and privacy-focused local models
          </p>
          <Link href="/chat">
            <Button size="lg" className="text-lg px-8 py-6 bg-blue-700 text-white hover:bg-blue-800">
              Start for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-16 px-4 bg-[#e6edff]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-800 mb-2">50K+</div>
              <div className="text-gray-700">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-800 mb-2">99.9%</div>
              <div className="text-gray-700">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-800 mb-2">15+</div>
              <div className="text-gray-700">Supported Models</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-800 mb-2">24/7</div>
              <div className="text-gray-700">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Choose Your Model", "Start Chatting", "Get Results"].map((title, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-700">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-700">
                  {index === 0
                    ? "Select between cloud-powered Gemini or privacy-focused local models"
                    : index === 1
                      ? "Ask questions, get help, or have natural conversations"
                      : "Receive intelligent, contextual responses in real-time"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-4 bg-[#e6edff]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Gemini vs Local Models
          </h2>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-gray-700">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold">Feature</th>
                        <th className="text-center p-4 font-semibold">Gemini (Cloud)</th>
                        <th className="text-center p-4 font-semibold">Local Models</th>
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
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "John Doe", role: "Security Engineer", text: "The local model option is a game-changer for our privacy-sensitive work. Amazing performance!" },
              { name: "Sarah Miller", role: "Product Manager", text: "Seamless switching between Cloud and local models. Perfect for different use cases." },
              { name: "Mike Johnson", role: "Developer", text: "Best AI chat interface I've used. Clean, fast, and incredibly intuitive." },
            ].map((user, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">{user.text}</p>
                  <div className="flex items-center">
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-800">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section className="py-16 px-4 bg-[#e6edff]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            See It In Action
          </h2>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Live Chat Demo</span>
                  <Badge variant="secondary">Gemini Model</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 h-64 overflow-y-auto bg-blue-50 rounded-lg p-4">
                  {/* Chat bubbles */}
                  <div className="flex justify-end">
                    <div className="bg-blue-700 text-white rounded-lg px-3 py-2 max-w-xs">
                      Give me 3 fun facts about space.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-blue-100 rounded-lg px-3 py-2 max-w-xs whitespace-pre-wrap text-gray-700">
                      1. A day on Venus is longer than its year<br />2. Neutron stars can spin 600 times/sec<br />3. Space isn’t completely silent!
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-blue-700 text-white rounded-lg px-3 py-2 max-w-xs">
                      Explain AI like I'm 5.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-blue-100 rounded-lg px-3 py-2 max-w-xs text-gray-700">
                      It's like a super-smart robot brain that learns by looking at patterns!
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-blue-700 text-white rounded-lg px-3 py-2 max-w-xs">
                      Write a one-line love poem.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-blue-100 rounded-lg px-3 py-2 max-w-xs whitespace-pre-wrap text-gray-700">
                      Your smile rewrites the code in my heart.
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-blue-100 rounded-lg px-3 py-2 max-w-xs">
                      <div className="animate-pulse text-gray-700">Typing...</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <Link href="/chat">
                    <Button className="bg-blue-700 text-white hover:bg-blue-800">Try It Yourself</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#2e3b70] to-[#3f4f8c] border-t border-gray-800 py-12 px-4 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">PrivGPT Studio</span>
              </div>
              <p className="text-gray-300">
                The future of AI conversations, powered by both cloud and local models.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/chat" className="hover:text-white">Chat Interface</Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">API Access</Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">Model Library</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white">Documentation</Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Connect</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-300 hover:text-white">
                  <Github className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white">
                  <Mail className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PrivGPT Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
