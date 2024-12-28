"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { signIn, signOut } from "@/services/api";
import { User, UserSignInRequest } from "@/types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: UserSignInRequest) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: UserSignInRequest) => {
    try {
      const user = await signIn(credentials);
      setIsAuthenticated(true);
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut();
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
