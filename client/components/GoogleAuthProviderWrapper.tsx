"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';

export default function GoogleAuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {children} 
    </GoogleOAuthProvider>
  );
}