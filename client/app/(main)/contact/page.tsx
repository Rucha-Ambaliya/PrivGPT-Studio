"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import SplashScreen from "../../splashScreen";
import { useState, useEffect, FormEvent } from "react";
import {
    Mail,
    MapPin,
    Clock,
    Send,
    MessageSquare,
    Phone,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import Head from "next/head";
import { toast } from "sonner";

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
    website: string; // Honeypot field
}

interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
}

export default function ContactPage() {
    const [showSplash, setShowSplash] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        subject: "",
        message: "",
        website: "", // Honeypot field - should remain empty
    });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 100);
        return () => clearTimeout(timer);
    }, []);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "Message must be at least 10 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/contact`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        subject: formData.subject,
                        message: formData.message,
                        website: formData.website, // Honeypot
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
                toast.success("Message sent successfully!", {
                    description: "We'll get back to you as soon as possible.",
                });
                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                    website: "",
                });
            } else {
                toast.error("Failed to send message", {
                    description: data.message || "Please try again later.",
                });
            }
        } catch {
            toast.error("Connection error", {
                description: "Please check your internet connection and try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showSplash) return <SplashScreen />;

    return (
        <>
            <Head>
                <title>Contact Us | PrivGPT Studio - Get in Touch</title>
                <meta
                    name="description"
                    content="Have questions about PrivGPT Studio? Contact our team for support, partnerships, or general inquiries. We're here to help with your AI privacy needs."
                />
                <meta
                    name="keywords"
                    content="Contact PrivGPT Studio, AI support, privacy AI contact, PrivGPT help, AI assistance"
                />
                <meta
                    property="og:title"
                    content="Contact Us | PrivGPT Studio - Get in Touch"
                />
                <meta
                    property="og:description"
                    content="Reach out to the PrivGPT Studio team for support, partnerships, or general inquiries about our privacy-first AI solutions."
                />
                <meta
                    property="og:url"
                    content="https://privgpt-studio.vercel.app/contact"
                />
                <meta property="og:type" content="website" />
                <meta
                    property="og:image"
                    content="https://privgpt-studio.vercel.app/logo.png"
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Contact Us | PrivGPT Studio" />
                <meta
                    name="twitter:description"
                    content="Get in touch with the PrivGPT Studio team for support and inquiries."
                />
                <link rel="canonical" href="https://privgpt-studio.vercel.app/contact" />
            </Head>

            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="py-20 px-4 text-center">
                    <Badge variant="secondary" className="mb-4">
                        📬 Get in Touch
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Contact Us
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Have questions, feedback, or need support? We'd love to hear from you.
                        Fill out the form below and our team will get back to you shortly.
                    </p>
                </section>

                {/* Main Content */}
                <section className="py-16 px-4">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Contact Form */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-primary" />
                                        Send Us a Message
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isSubmitted ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                                            <p className="text-muted-foreground mb-6">
                                                Your message has been sent successfully. We'll get back to
                                                you as soon as possible.
                                            </p>
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsSubmitted(false)}
                                            >
                                                Send Another Message
                                            </Button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {/* Honeypot field - hidden from users */}
                                            <div className="hidden" aria-hidden="true">
                                                <Label htmlFor="website">Website</Label>
                                                <Input
                                                    type="text"
                                                    id="website"
                                                    name="website"
                                                    value={formData.website}
                                                    onChange={handleInputChange}
                                                    tabIndex={-1}
                                                    autoComplete="off"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="name">
                                                    Name <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    placeholder="Your full name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className={errors.name ? "border-destructive" : ""}
                                                />
                                                {errors.name && (
                                                    <p className="text-sm text-destructive">{errors.name}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">
                                                    Email <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="your.email@example.com"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className={errors.email ? "border-destructive" : ""}
                                                />
                                                {errors.email && (
                                                    <p className="text-sm text-destructive">{errors.email}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="subject">Subject</Label>
                                                <Input
                                                    id="subject"
                                                    name="subject"
                                                    placeholder="What is this about?"
                                                    value={formData.subject}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message">
                                                    Message <span className="text-destructive">*</span>
                                                </Label>
                                                <Textarea
                                                    id="message"
                                                    name="message"
                                                    placeholder="Tell us more about your inquiry..."
                                                    rows={5}
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                    className={errors.message ? "border-destructive" : ""}
                                                />
                                                {errors.message && (
                                                    <p className="text-sm text-destructive">
                                                        {errors.message}
                                                    </p>
                                                )}
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4 mr-2" />
                                                        Send Message
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            <div className="space-y-8">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                                <Mail className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                                                <p className="text-muted-foreground mb-2">
                                                    For general inquiries and support
                                                </p>
                                                <a
                                                    href="mailto:support@privgpt-studio.com"
                                                    className="text-primary hover:underline"
                                                >
                                                    support@privgpt-studio.com
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                                <Clock className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg mb-1">
                                                    Support Hours
                                                </h3>
                                                <p className="text-muted-foreground mb-2">
                                                    We typically respond within 24-48 hours
                                                </p>
                                                <p className="text-sm">
                                                    Monday - Friday: 9:00 AM - 6:00 PM (IST)
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                                <MapPin className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg mb-1">Location</h3>
                                                <p className="text-muted-foreground mb-2">
                                                    Operating globally, headquartered in
                                                </p>
                                                <p className="text-sm">India</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                                <Phone className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg mb-1">
                                                    Community Support
                                                </h3>
                                                <p className="text-muted-foreground mb-2">
                                                    Join our Discord for quick help
                                                </p>
                                                <a
                                                    href="https://discord.gg/J9z5T52rkZ"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    Join Discord Server
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ CTA */}
                <section className="py-16 px-4 bg-muted/50">
                    <div className="container mx-auto text-center max-w-3xl">
                        <h2 className="text-3xl font-bold mb-4">Need Quick Answers?</h2>
                        <p className="text-lg text-muted-foreground mb-6">
                            Check out our documentation and community resources for instant help
                            with common questions.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button variant="outline" asChild>
                                <a
                                    href="https://github.com/Rucha-Ambaliya/PrivGPT-Studio"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Documentation
                                </a>
                            </Button>
                            <Button variant="outline" asChild>
                                <a
                                    href="https://github.com/Rucha-Ambaliya/PrivGPT-Studio/issues"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Browse Issues
                                </a>
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
