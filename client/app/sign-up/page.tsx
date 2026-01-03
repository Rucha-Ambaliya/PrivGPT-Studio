import { SignUpForm } from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | PrivGPT Studio",
  description: "Create your PrivGPT Studio account to access unlimited AI conversations and leave reviews.",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-lg">
        <SignUpForm />
      </div>
    </div>
  );
}