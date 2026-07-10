"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MessageSquarePlus, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Sparkles, ShieldCheck, Cpu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Review {
  _id: string;
  user_id: string;
  username: string;
  comment: string;
  rating: number;
  role?: string;
}

const staticReviews: Review[] = [
  {
    _id: "static-1",
    user_id: "static-user-1",
    username: "Alex Chen",
    comment:
      "The local model support is a game changer for privacy. Finally I can use AI without worrying about my data leaving my device.",
    rating: 5,
  },
  {
    _id: "static-2",
    user_id: "static-user-2",
    username: "Sarah Jones",
    comment:
      "Incredibly fast responses and the UI is beautiful. Switched from ChatGPT and haven't looked back.",
    rating: 5,
  },
  {
    _id: "static-3",
    user_id: "static-user-3",
    username: "Michael R.",
    comment:
      "Great flexibility between cloud and local models. The setup was surprisingly easy.",
    rating: 4,
  },
];

export default function HomePage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(""),
        );

        const payload = JSON.parse(jsonPayload);
        setCurrentUserId(payload.user_id);
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    } else {
      setCurrentUserId(null);
    }
  }, [token]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews`,
        );
        if (res.ok) {
          const data = await res.json();
          setReviews([...data, ...staticReviews]);
        } else {
          setReviews(staticReviews);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
        setReviews(staticReviews);
      } finally {
        setIsLoadingReviews(false);
      }
    };
    fetchReviews();
  }, []);

  const handleSubmitReview = async () => {
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to leave a review.",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, comment }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Success",
          description: "Your review has been submitted!",
        });
        setIsDialogOpen(false);
        setComment("");
        const refreshRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews`,
        );
        if (refreshRes.ok) {
          const newData = await refreshRes.json();
          setReviews([...newData, ...staticReviews]);
        }
      } else if (res.status === 409) {
        toast({
          title: "Notice",
          description: "You have already submitted a review.",
          variant: "destructive",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasReviewed =
    currentUserId && reviews.some((review) => review.user_id === currentUserId);

  const midPoint = Math.ceil(reviews.length / 2);
  const firstRow = reviews.slice(0, midPoint);
  const secondRow = reviews.slice(midPoint);

  return (
    <div className="home-page min-h-screen bg-background overflow-hidden">
      <style jsx global>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }
        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Hero Section */}

      <section className="relative pb-24 pt-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-5xl text-center">
          <Badge
            variant="secondary"
            className="mb-12 px-4 py-1.5 text-sm rounded-full"
          >
            <Cpu className="mr-2 h-4 w-4" />
            Now supporting local AI models
          </Badge>

          <h1 className="text-6xl md:text-7xl font-bold mb-10 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            PrivGPT Studio
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
            Experience the future of AI conversations with{" "}
            <span className="font-semibold text-foreground">
              privacy-first local AI models
            </span>{" "}
            and <span className="font-semibold text-foreground">Gemini</span>,
            all in one powerful workspace.
          </p>

          <Link href="/chat">
            <Button size="lg" className="h-12 px-8 text-lg group">
              <Sparkles className="mr-2 h-5 w-5" />
              Start for Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              Privacy First
            </div>

            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-blue-500" />
              Local & Cloud AI
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Free to Start
            </div>
          </div>
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
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
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
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Model</h3>
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
                        <th className="text-left p-4 font-semibold">Feature</th>
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

      <section className="py-16 px-4 overflow-hidden">
        <div className="container mx-auto mb-12 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center mb-4">
            What Our Users Say
          </h2>

          {hasReviewed ? (
            <Button
              variant="outline"
              disabled
              className="gap-2 cursor-default bg-muted/50 border-primary/20 text-primary"
            >
              <CheckCircle2 className="w-4 h-4" />
              Thank you for reviewing!
            </Button>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <MessageSquarePlus className="w-4 h-4" />
                  Add Your Review
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share your experience</DialogTitle>
                  <DialogDescription>
                    Tell us what you think about PrivGPT Studio.
                  </DialogDescription>
                </DialogHeader>

                {!token ? (
                  <div className="py-4 text-center text-muted-foreground">
                    Please{" "}
                    <Link
                      href="/sign-in"
                      className="text-primary hover:underline"
                    >
                      sign in
                    </Link>{" "}
                    to leave a review.
                  </div>
                ) : (
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                      <Label>Rating</Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-6 h-6 cursor-pointer transition-colors ${
                              star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                            onClick={() => setRating(star)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="comment">Comment</Label>
                      <Textarea
                        id="comment"
                        placeholder="Write your review here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <DialogFooter>
                  {token && (
                    <Button
                      onClick={handleSubmitReview}
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Submit Review
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isLoadingReviews ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No reviews yet. Be the first to share your experience!
          </div>
        ) : (
          <div className="relative w-full max-w-[100vw]">
            <div className="flex mb-8 w-max animate-scroll-left">
              {firstRow.map((review, i) => (
                <Card
                  key={`${review._id}-1-${i}`}
                  className="w-[350px] mx-4 shrink-0"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center">
                      <Avatar className="w-10 h-10 mr-3">
                        <AvatarFallback>
                          {review.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-semibold">{review.username}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {secondRow.length > 0 && (
              <div className="flex w-max animate-scroll-right">
                {secondRow.map((review, i) => (
                  <Card
                    key={`${review._id}-2-${i}`}
                    className="w-[350px] mx-4 shrink-0"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        "{review.comment}"
                      </p>
                      <div className="flex items-center">
                        <Avatar className="w-10 h-10 mr-3">
                          <AvatarFallback>
                            {review.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-semibold">{review.username}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
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
                      It's like a super-smart robot brain that learns by looking
                      at patterns!
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

      <ScrollToTop />
    </div>
  );
}
