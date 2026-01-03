"use client";

import { ReviewForm } from "@/components/review-form";
import { DynamicTestimonials } from "@/components/dynamic-testimonials";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Reviews</h1>
            <div></div>
          </div>
        </div>
      </div>

      {/* Review Form Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Share Your Experience</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Help others discover PrivGPT Studio by sharing your thoughts and experience. 
              Your feedback helps us improve and grow our community.
            </p>
          </div>
          <ReviewForm />
        </div>
      </section>

      {/* All Reviews Section */}
      <DynamicTestimonials />
    </div>
  );
}