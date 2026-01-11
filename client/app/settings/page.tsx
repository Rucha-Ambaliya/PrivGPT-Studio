"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Lock, Cpu, Cloud, Loader2, Edit2, Save, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SettingsPage() {
  const { token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<{ username: string; email: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "" });
  
  const [models, setModels] = useState<{ local_models: string[]; cloud_models: string[] }>({
    local_models: [],
    cloud_models: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/sign-in");
    }
  }, [authLoading, token, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      try {
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
          setFormData({ username: profileData.username || "" });
        }

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

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
        setProfile(prev => prev ? { ...prev, ...formData } : null);
        setIsEditing(false);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error", error);
      toast.error("An error occurred while updating profile");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    if (profile) {
      setFormData({ username: profile.username });
    }
    setIsEditing(false);
  };

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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your personal account details</CardDescription>
              </div>
              {!isEditing ? (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={cancelEdit} disabled={saving}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="sm" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    value={isEditing ? formData.username : profile?.username || ""}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={!isEditing}
                    className={`pl-9 ${!isEditing ? "bg-muted" : "bg-background"}`}
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
                {isEditing && (
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed directly.
                  </p>
                )}
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Available Models
              </CardTitle>
              <CardDescription>AI models currently available in the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
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