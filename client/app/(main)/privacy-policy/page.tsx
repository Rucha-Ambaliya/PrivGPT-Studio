"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  Shield,
  Eye,
  Lock,
  Users,
  Globe,
  Clock,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import Head from "next/head";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>
          Privacy Policy | PrivGPT Studio - Your Data Security & Privacy
        </title>
        <meta
          name="description"
          content="PrivGPT Studio's commitment to your privacy. Learn how we protect your data with local AI processing, strict no-sale policies, and compliance with GDPR, CCPA, and global privacy laws."
        />
        <meta
          name="keywords"
          content="AI privacy policy, data protection, GDPR compliance, CCPA compliance, local AI privacy, chat data security, PrivGPT Studio privacy, AI data retention"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Privacy Policy | PrivGPT Studio - Your Data Security & Privacy"
        />
        <meta
          property="og:description"
          content="Learn how PrivGPT Studio protects your conversations with local AI processing and strict privacy safeguards compliant with GDPR and CCPA."
        />
        <meta
          property="og:url"
          content="https://privgpt-studio.vercel.app/privacy-policy"
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
          content="PrivGPT Studio Privacy Policy Overview"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | PrivGPT Studio" />
        <meta
          name="twitter:description"
          content="Your privacy is our priority. Learn how we protect your AI conversations with local processing and strict data safeguards."
        />
        <meta
          name="twitter:image"
          content="https://privgpt-studio.vercel.app/logo.png"
        />

        {/* Canonical */}
        <link
          rel="canonical"
          href="https://privgpt-studio.vercel.app/privacy-policy"
        />
      </Head>
      


      {/* Quick Overview */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Privacy at a Glance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Local Model Privacy</h3>
                    <p className="text-sm text-muted-foreground">
                      Your conversations with local models never leave your
                      device
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Your Rights</h3>
                    <p className="text-sm text-muted-foreground">
                      Access, correct, or delete your data anytime
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Global Compliance</h3>
                    <p className="text-sm text-muted-foreground">
                      GDPR, CCPA, and other privacy law compliant
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Minimal Data</h3>
                    <p className="text-sm text-muted-foreground">
                      We only collect what's necessary for service operation
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Section 1 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    Information You Provide Directly
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      <strong>Chat Messages:</strong> The messages you send to
                      our AI models
                    </li>
                    <li>
                      <strong>Account Information:</strong> Email address,
                      username (if you create an account)
                    </li>
                    <li>
                      <strong>Support Communications:</strong> Messages you send
                      to our support team
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    Information Collected Automatically
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      <strong>Usage Data:</strong> How you interact with our
                      service, features used, session duration
                    </li>
                    <li>
                      <strong>Technical Data:</strong> IP address, browser type,
                      device information, operating system
                    </li>
                    <li>
                      <strong>Cookies:</strong> Essential cookies for
                      functionality, analytics cookies (with consent)
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    <strong>Local Model Privacy:</strong> When using local AI
                    models, your conversations are processed entirely on your
                    device and are never transmitted to our servers.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Service Provision</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      Process and respond to your chat messages via cloud-based
                      AI models
                    </li>
                    <li>
                      Maintain your conversation history (for cloud models only)
                    </li>
                    <li>Provide technical support and customer service</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Service Improvement</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Analyze usage patterns to improve our service</li>
                    <li>Develop new features and capabilities</li>
                    <li>Monitor service performance and reliability</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Legal Basis (GDPR)</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      <strong>Consent:</strong> For optional features like
                      analytics
                    </li>
                    <li>
                      <strong>Contract Performance:</strong> To provide our chat
                      services
                    </li>
                    <li>
                      <strong>Legitimate Interests:</strong> For service
                      improvement and security
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>3. Information Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    Third-Party AI Providers
                  </h4>
                  <p className="text-muted-foreground mb-2">
                    When you use cloud-based models (like Gemini), your messages
                    are sent to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      <strong>Google (Gemini):</strong> Subject to Google's
                      privacy policy and terms
                    </li>
                    <li>
                      Other AI model providers as clearly indicated in our
                      interface
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Service Providers</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Cloud hosting providers for infrastructure</li>
                    <li>Analytics services (with your consent)</li>
                    <li>Customer support platforms</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Legal Requirements</h4>
                  <p className="text-muted-foreground">
                    We may disclose information when required by law, court
                    order, or to protect our rights and safety.
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    <strong>We Never:</strong> Sell your personal data, use it
                    for advertising, or share it for commercial purposes
                    unrelated to our service.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>4. Data Security and Retention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Security Measures</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>End-to-end encryption for data transmission</li>
                    <li>
                      Secure cloud infrastructure with industry-standard
                      protections
                    </li>
                    <li>Regular security audits and monitoring</li>
                    <li>Access controls and authentication requirements</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Retention</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      <strong>Chat History:</strong> Retained for 90 days, or
                      until you delete it
                    </li>
                    <li>
                      <strong>Account Data:</strong> Retained while your account
                      is active
                    </li>
                    <li>
                      <strong>Usage Analytics:</strong> Aggregated data retained
                      for 2 years
                    </li>
                    <li>
                      <strong>Local Model Data:</strong> Never stored on our
                      servers
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>5. Your Privacy Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Access
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Request a copy of your personal data
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Correction
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Update or correct your information
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Deletion
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Request deletion of your data
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Portability
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Export your data in a standard format
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">
                    California Residents (CCPA)
                  </h4>
                  <p className="text-muted-foreground mb-2">
                    Additional rights include:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>
                      Right to know what personal information is collected
                    </li>
                    <li>Right to opt-out of sale (we don't sell your data)</li>
                    <li>
                      Right to non-discrimination for exercising your rights
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    <strong>Exercise Your Rights:</strong> Contact us at
                    privacy@privgptstudio.com or use our in-app settings to
                    manage your data.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>6. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    Types of Cookies We Use
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Badge variant="outline" className="mt-1">
                        Essential
                      </Badge>
                      <div>
                        <p className="text-sm">
                          Required for basic functionality (login, preferences)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Badge variant="secondary" className="mt-1">
                        Analytics
                      </Badge>
                      <div>
                        <p className="text-sm">
                          Help us understand usage patterns (optional, requires
                          consent)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cookie Management</h4>
                  <p className="text-muted-foreground">
                    You can control cookies through your browser settings or our
                    cookie preferences center. Note that disabling essential
                    cookies may affect service functionality.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 7 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>7. International Data Transfers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Your data may be processed in countries outside your
                  residence, including the United States. We ensure appropriate
                  safeguards are in place:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Standard Contractual Clauses for EU data transfers</li>
                  <li>Adequacy decisions where applicable</li>
                  <li>Additional security measures for sensitive data</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 8 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>8. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our service is not intended for children under 13 (or 16 in
                  the EU). We do not knowingly collect personal information from
                  children. If you believe we have collected information from a
                  child, please contact us immediately.
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Parents: If you discover your child has provided personal
                    information, contact us to have it removed.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 9 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>9. Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We may update this privacy policy to reflect changes in our
                  practices or for legal compliance. We will:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                  <li>
                    Notify you of material changes via email or in-app
                    notification
                  </li>
                  <li>
                    Update the "Last Modified" date at the top of this policy
                  </li>
                  <li>Maintain previous versions for your reference</li>
                </ul>
                <p className="text-muted-foreground">
                  Continued use of our service after changes constitutes
                  acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  10. Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  For privacy-related questions, concerns, or to exercise your
                  rights, contact us:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Privacy Officer</h4>
                    <p className="text-sm text-muted-foreground">
                      privacy@privgptstudio.com
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">
                      Data Protection Officer (EU)
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      dpo@privgptstudio.com
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Mailing Address</h4>
                  <p className="text-sm text-muted-foreground">
                    PrivGPT Studio
                    <br />
                    Privacy Department
                    <br />
                    [Your Business Address]
                    <br />
                    [City, State, ZIP Code]
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  We will respond to your privacy requests within 30 days (or as
                  required by applicable law).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


    </div>
  );
}
