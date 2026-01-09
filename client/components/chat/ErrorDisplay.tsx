"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, WifiOff, ServerCrash } from "lucide-react";

export interface ErrorDisplayProps {
  error: Error | string;
  onRetry?: () => void;
  title?: string;
  className?: string;
}

export function ErrorDisplay({ error, onRetry, title, className }: ErrorDisplayProps) {
  const errorMessage = typeof error === "string" ? error : error.message;
  const isNetworkError = errorMessage.toLowerCase().includes("network") || 
                         errorMessage.toLowerCase().includes("fetch") ||
                         errorMessage.toLowerCase().includes("connection");
  const isServerError = errorMessage.toLowerCase().includes("500") || 
                       errorMessage.toLowerCase().includes("502") ||
                       errorMessage.toLowerCase().includes("503");

  const getIcon = () => {
    if (isNetworkError) return <WifiOff className="h-4 w-4" />;
    if (isServerError) return <ServerCrash className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  const getDefaultTitle = () => {
    if (isNetworkError) return "Connection Error";
    if (isServerError) return "Server Error";
    return "Error";
  };

  return (
    <Alert variant="destructive" className={className}>
      {getIcon()}
      <AlertTitle>{title || getDefaultTitle()}</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{errorMessage}</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-2"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

export function MessageError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
      <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
      <div className="flex-1 space-y-2">
        <p className="text-sm text-destructive">{message}</p>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="h-7 text-xs"
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
