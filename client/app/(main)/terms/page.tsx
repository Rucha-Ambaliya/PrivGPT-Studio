"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Zap, FileText, Clock, Mail } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import Head from "next/head";


export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>
          Terms of Service | PrivGPT Studio - Usage Guidelines & Policies
        </title>
        <meta
          name="description"
          content="PrivGPT Studio's Terms of Service. Learn about user responsibilities, prohibited activities, intellectual property rights, and platform usage guidelines for our AI chat service."
        />
        <meta
          name="keywords"
          content="Terms of Service, AI usage policy, user guidelines, platform rules, PrivGPT Studio terms, AI chat terms, prohibited activities, intellectual property AI"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Terms of Service | PrivGPT Studio - Usage Guidelines & Policies"
        />
        <meta
          property="og:description"
          content="Read PrivGPT Studio's Terms of Service covering user responsibilities, prohibited activities, and intellectual property rights for AI chat usage."
        />
        <meta
          property="og:url"
          content="https://privgpt-studio.vercel.app/terms"
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
          content="PrivGPT Studio Terms of Service Overview"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Terms of Service | PrivGPT Studio"
        />
        <meta
          name="twitter:description"
          content="Usage guidelines and policies for PrivGPT Studio's AI chat platform. Learn about responsible use and prohibited activities."
        />
        <meta
          name="twitter:image"
          content="https://privgpt-studio.vercel.app/logo.png"
        />

        {/* Canonical */}
        <link rel="canonical" href="https://privgpt-studio.vercel.app/terms" />
      </Head>
      
    

      {/* Hero Section */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <FileText className="w-11 h-11 text-primary mr-3" />
              <h1 className="text-4xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Rules and guidelines you need to know. Use the platform
              responsibly.
            </p>
            <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-2" />
              Last updated: August 16, 2025
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Section 1 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>1. User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Users must use PrivGPT-Studio responsibly and comply with all
                  applicable laws.
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Provide accurate information when creating accounts.</li>
                  <li>Do not misuse or disrupt the platform.</li>
                  <li>Respect the rights of other users.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>2. Prohibited Activities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Users are strictly prohibited from engaging in activities that
                  violate the law or infringe on others' rights.
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Uploading malicious or harmful content.</li>
                  <li>Attempting unauthorized access to the platform.</li>
                  <li>Using the platform for fraudulent purposes.</li>
                </ul>
                <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    <strong>We Never:</strong> Allow illegal activity,
                    harassment, or data misuse on PrivGPT-Studio.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>3. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  All content on PrivGPT-Studio, including text, images, and
                  software, is owned by PrivGPT-Studio or its licensors.
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>
                    You may use AI outputs for personal, research, or internal
                    purposes.
                  </li>
                  <li>Respect other users and follow platform rules.</li>
                  <li>
                    Do not redistribute or sell platform content without
                    permission.
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>4. Disclaimers & Limitations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  PrivGPT-Studio is provided "as is" without warranties. We are
                  not liable for indirect or consequential damages.
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>No guarantee of uninterrupted or error-free service.</li>
                  <li>Use the platform at your own risk.</li>
                  <li>We are not responsible for user-generated content.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>5. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We may update these Terms of Service occasionally. Continued
                  use of the platform indicates acceptance of updates.
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Changes will be posted on this page.</li>
                  <li>
                    Important changes may be communicated via email or
                    notifications.
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  6. Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  For questions about the Terms of Service, contact us:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Support Email</h4>
                    <p className="text-sm text-muted-foreground">
                      support@privgptstudio.com
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Legal Department</h4>
                    <p className="text-sm text-muted-foreground">
                      legal@privgptstudio.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


    </div>
  );
}
