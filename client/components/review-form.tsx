"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface Review {
  rating: number;
  comment: string;
  created_at: string;
  updated_at?: string;
}

export function ReviewForm() {
  const { token, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchUserReview();
    } else {
      setIsLoading(false);
    }
  }, [token, isAuthenticated]);

  const fetchUserReview = async () => {
    try {
      const response = await fetch("/api/reviews/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.review) {
          setExistingReview(data.review);
          setRating(data.review.rating);
          setComment(data.review.comment);
        }
      }
    } catch (error) {
      console.error("Error fetching user review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0 || !comment.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a rating and comment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const url = existingReview ? "/api/reviews/user" : "/api/reviews";
      const method = existingReview ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: existingReview 
            ? "Your review has been updated successfully!" 
            : "Your review has been submitted successfully!",
        });
        
        if (!existingReview) {
          setExistingReview({ rating, comment, created_at: new Date().toISOString() });
        } else {
          setExistingReview({ ...existingReview, rating, comment, updated_at: new Date().toISOString() });
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to submit review.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !existingReview) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews/user", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your review has been deleted successfully!",
        });
        setExistingReview(null);
        setRating(0);
        setComment("");
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete review.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center space-y-4">
          <p className="text-muted-foreground">
            Please log in to submit a review and help others discover PrivGPT Studio.
          </p>
          <div className="flex gap-2 justify-center">
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Create Account</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {existingReview ? "Update Your Review" : "Share Your Experience"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Comment</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about PrivGPT Studio..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || !comment.trim()}
              className="flex-1"
            >
              {isSubmitting
                ? "Submitting..."
                : existingReview
                ? "Update Review"
                : "Submit Review"}
            </Button>
            
            {existingReview && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Delete
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}