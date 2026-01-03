import { SignInForm } from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | PrivGPT Studio",
  description: "Sign in to your PrivGPT Studio account to access unlimited AI conversations and leave reviews.",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <SignInForm />
      </div>
    </div>
  );
}