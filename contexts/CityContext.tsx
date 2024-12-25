"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface CityContextType {
  selectedCity: string | null;
  isInitialLoad: boolean;
  setSelectedCity: (city: string) => void;
  setIsInitialLoad: (value: boolean) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const value = {
    selectedCity,
    isInitialLoad,
    setSelectedCity,
    setIsInitialLoad,
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
}
