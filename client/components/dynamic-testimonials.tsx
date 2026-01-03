"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface Review {
  username: string;
  rating: number;
  comment: string;
  created_at: string;
}

export function DynamicTestimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // Split reviews into two rows for scrolling effect
  const midpoint = Math.ceil(reviews.length / 2);
  const firstRow = reviews.slice(0, midpoint);
  const secondRow = reviews.slice(midpoint);

  // Duplicate arrays for seamless scrolling
  const duplicatedFirstRow = [...firstRow, ...firstRow];
  const duplicatedSecondRow = [...secondRow, ...secondRow];

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="text-center text-muted-foreground">
            Loading reviews...
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="text-center text-muted-foreground">
            No reviews yet. Be the first to share your experience!
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 overflow-hidden">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Users Say
        </h2>
        
        <div className="space-y-8">
          {/* First Row - Scroll Right */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll-right space-x-6" style={{ width: `${firstRow.length * 2 * 320}px` }}>
              {duplicatedFirstRow.map((review, index) => (
                <TestimonialCard
                  key={`row1-${index}`}
                  review={review}
                  getInitials={getInitials}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>

          {/* Second Row - Scroll Left */}
          {secondRow.length > 0 && (
            <div className="relative overflow-hidden">
              <div className="flex animate-scroll-left space-x-6" style={{ width: `${secondRow.length * 2 * 320}px` }}>
                {duplicatedSecondRow.map((review, index) => (
                  <TestimonialCard
                    key={`row2-${index}`}
                    review={review}
                    getInitials={getInitials}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  review,
  getInitials,
  formatDate,
}: {
  review: Review;
  getInitials: (username: string) => string;
  formatDate: (dateString: string) => string;
}) {
  return (
    <Card className="flex-shrink-0 w-80">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          "{review.comment}"
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="w-10 h-10 mr-3">
              <AvatarFallback>{getInitials(review.username)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{review.username}</div>
              <div className="text-sm text-muted-foreground">
                User since {formatDate(review.created_at)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}