"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { retryWithBackoff, isRetryableError } from "@/lib/retry-utils";

interface UseApiCallOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  showToast?: boolean;
  retryable?: boolean;
  maxRetries?: number;
}

export function useApiCall<T = any>(options: UseApiCallOptions = {}) {
  const {
    onSuccess,
    onError,
    showToast = true,
    retryable = true,
    maxRetries = 3,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (apiCall: () => Promise<T>) => {
      setIsLoading(true);
      setError(null);

      try {
        let result: T;

        if (retryable) {
          result = await retryWithBackoff(apiCall, {
            maxRetries,
            shouldRetry: isRetryableError,
            onRetry: (error, attempt) => {
              if (showToast) {
                toast.info(`Retrying... (Attempt ${attempt}/${maxRetries})`);
              }
              console.log(`Retry attempt ${attempt}:`, error);
            },
          });
        } else {
          result = await apiCall();
        }

        setData(result);
        if (onSuccess) onSuccess(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        
        if (onError) {
          onError(error);
        }
        
        if (showToast) {
          toast.error(error.message || "An error occurred");
        }
        
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onError, showToast, retryable, maxRetries]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    isLoading,
    error,
    data,
    reset,
  };
}
