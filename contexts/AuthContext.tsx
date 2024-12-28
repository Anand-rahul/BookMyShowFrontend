"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { setAuthToken, clearAuthToken } from "@/services/api";
import { User } from "@/types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  googleLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        if (response.ok) {
          const data = await response.json();
          if (data.isAuthenticated && data.user) {
            setIsAuthenticated(true);
            setUser(data.user);
            setAuthToken(data.token);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, []);

  const login = (token: string, user: User) => {
    setAuthToken(token);
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearAuthToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  const googleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, googleLogin }}
    >
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
