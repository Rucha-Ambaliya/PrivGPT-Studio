"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  user_id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  profile_completed: boolean;
  chat_sessions_count: number;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user?: User) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("userInfo");
      
      if (storedToken) {
        setToken(storedToken);
        
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error("Failed to parse stored user info", error);
            localStorage.removeItem("userInfo");
          }
        }
      }
    } catch (error) {
      console.error("Failed to load auth data from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, userData?: User) => {
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
    
    if (userData) {
      localStorage.setItem("userInfo", JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      login, 
      logout, 
      isLoading, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}