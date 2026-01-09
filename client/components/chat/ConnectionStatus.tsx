"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectionStatusProps {
  className?: string;
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [backendStatus, setBackendStatus] = useState<"online" | "offline" | "checking">("checking");

  useEffect(() => {
    // Check browser online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    // Check backend connectivity
    const checkBackend = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/models`,
          {
            method: "GET",
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);
        setBackendStatus(response.ok ? "online" : "offline");
      } catch (error) {
        setBackendStatus("offline");
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: <WifiOff className="h-3 w-3" />,
        text: "No Internet",
        variant: "destructive" as const,
      };
    }

    if (backendStatus === "checking") {
      return {
        icon: <Wifi className="h-3 w-3 animate-pulse" />,
        text: "Checking...",
        variant: "secondary" as const,
      };
    }

    if (backendStatus === "offline") {
      return {
        icon: <AlertCircle className="h-3 w-3" />,
        text: "Service Offline",
        variant: "destructive" as const,
      };
    }

    return {
      icon: <Wifi className="h-3 w-3" />,
      text: "Connected",
      variant: "default" as const,
    };
  };

  const status = getStatusInfo();

  return (
    <Badge
      variant={status.variant}
      className={cn("flex items-center gap-1.5 px-2 py-1", className)}
    >
      {status.icon}
      <span className="text-xs font-medium">{status.text}</span>
    </Badge>
  );
}
