"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Lock, Cpu, Cloud, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SettingsPage() {
  const { token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<{ username: string; email: string } | null>(null);
  const [models, setModels] = useState<{ local_models: string[]; cloud_models: string[] }>({
    local_models: [],
    cloud_models: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/sign-in");
    }
  }, [authLoading, token, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      try {
        // Fetch Profile
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        // Fetch Models
        const modelsRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/models`);
        if (modelsRes.ok) {
          const modelsData = await modelsRes.json();
          setModels(modelsData);
        }
      } catch (error) {
        console.error("Failed to fetch settings data", error);
        toast.error("Failed to load settings data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (authLoading || (loading && token)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/chat">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your profile and view system configurations.</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Your personal account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    value={profile?.username || ""}
                    disabled
                    className="pl-9 bg-muted"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={profile?.email || ""}
                    disabled
                    className="pl-9 bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value="********"
                    disabled
                    className="pl-9 bg-muted"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Password cannot be viewed for security reasons.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Models Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Available Models
              </CardTitle>
              <CardDescription>AI models currently available in the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Local Models */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-green-500" />
                  Local Models (Privacy Focused)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {models.local_models.length > 0 ? (
                    models.local_models.map((model) => (
                      <Badge key={model} variant="outline" className="px-3 py-1">
                        {model}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">No local models detected</span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Cloud Models */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-blue-500" />
                  Cloud Models (Gemini)
                </h3>
                <div className="flex flex-wrap gap-2">
                   {models.cloud_models.length > 0 ? (
                    models.cloud_models.map((model) => (
                      <Badge key={model} variant="default" className="px-3 py-1 bg-blue-600 hover:bg-blue-700">
                        {model}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">No cloud models available</span>
                  )}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}