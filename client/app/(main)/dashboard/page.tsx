"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Loader2, Edit2, Save, X, CalendarIcon, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { DayPicker, DropdownProps } from "react-day-picker";
import "react-day-picker/dist/style.css";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

function isoToDate(value?: string) {
  return value ? new Date(value) : undefined;
}

function dateToISO(date?: Date) {
  return date ? format(date, "yyyy-MM-dd") : "";
}

const CalendarDropdown = (props: DropdownProps) => {
  const { value, onChange, children } = props;
  const options = React.Children.toArray(children) as React.ReactElement<React.OptionHTMLAttributes<HTMLOptionElement>>[];

  const handleChange = (newValue: string) => {
    const changeEvent = {
      target: { value: newValue },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange?.(changeEvent);
  };

  return (
    <Select value={value?.toString()} onValueChange={handleChange}>
      <SelectTrigger className="pr-1.5 focus:ring-0">
        <SelectValue>{options.find(o => o.props.value === value)?.props.children}</SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" className="max-h-[200px] overflow-y-auto">
        {options.map((option) => (
          <SelectItem key={option.props.value as string} value={option.props.value as string}>
            {option.props.children}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function SettingsPage() {
  const { token, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<{ 
    email: string;
    username: string; 
    gender: string;
    dob: string;
    phone: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ 
    username: "",
    gender: "",
    dob: "",
    phone: ""
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
          setFormData({ 
            username: profileData.username || "",
            gender: profileData.gender || "",
            dob: profileData.dob || "",
            phone: profileData.phone || "",
          });
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
      setFormData({ 
        username: profile.username || "",
        gender: profile.gender || "",
        dob: profile.dob || "",
        phone: profile.phone || "",
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/sign-in");
  };

  if (authLoading || (loading && token)) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your profile details.</p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-1">
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
                <Label htmlFor="gender">Gender</Label>
                {isEditing ? (
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="gender"
                      value={profile?.gender || ""}
                      disabled
                      className="pl-9 bg-muted"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                {isEditing ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!formData.dob && "text-muted-foreground"}`}
                      >
                        {formData.dob ? format(new Date(formData.dob), "dd-MM-yyyy") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" align="start">
                      <DayPicker
                        mode="single"
                        selected={isoToDate(formData.dob)}
                        onSelect={(date) => setFormData({ ...formData, dob: dateToISO(date) })}
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        captionLayout="dropdown"
                        disabled={{ after: new Date() }}
                        components={{
                          Dropdown: CalendarDropdown,
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div className="relative">
                    <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dob"
                      value={profile?.dob ? format(new Date(profile.dob), "dd-MM-yyyy") : ""}
                      disabled
                      className="pl-9 bg-muted"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type={isEditing ? "tel" : "text"}
                    value={isEditing ? formData.phone : profile?.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    placeholder="123-456-7890"
                    className={`pl-9 ${!isEditing ? "bg-muted" : "bg-background"}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}