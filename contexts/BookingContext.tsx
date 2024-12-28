"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Show, Seat, Theatre } from "@/types";

interface BookingContextType {
  selectedShow: Show | null;
  selectedSeats: Seat[];
  theatre: Theatre | null;
  setSelectedShow: (show: Show | null) => void;
  setSelectedSeats: (seats: Seat[]) => void;
  setTheatre: (theatre: Theatre | null) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [theatre, setTheatre] = useState<Theatre | null>(null);

  return (
    <BookingContext.Provider
      value={{
        selectedShow,
        selectedSeats,
        theatre,
        setSelectedShow,
        setSelectedSeats,
        setTheatre,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
