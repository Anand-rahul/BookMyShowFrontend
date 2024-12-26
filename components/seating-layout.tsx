"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Seat } from "@/types";

export interface SeatingLayoutProps {
    seats: Seat[];
    maxSeats: number;
    onSeatSelect: (selectedSeats: Seat[]) => void;
  }

export default function SeatingLayout({
  seats,
  maxSeats,
  onSeatSelect,
}: SeatingLayoutProps) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "sold") return;

    const isSelected = selectedSeats.find((s) => s.seatId === seat.seatId);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.seatId !== seat.seatId));
    } else if (selectedSeats.length < maxSeats) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const getSeatColor = (seat: Seat) => {
    if (selectedSeats.find((s) => s.seatId === seat.seatId)) {
      return "bg-primary text-primary-foreground hover:bg-primary/90";
    }
    switch (seat.status) {
      case "bestseller":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
      case "sold":
        return "bg-gray-100 text-gray-400 cursor-not-allowed";
      default:
        return "bg-white hover:bg-accent";
    }
  };

  // Group seats by price category
  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.priceCategory]) {
      acc[seat.priceCategory] = {};
    }
    const rowKey = `Row ${seat.row}`;
    if (!acc[seat.priceCategory][rowKey]) {
      acc[seat.priceCategory][rowKey] = [];
    }
    acc[seat.priceCategory][rowKey].push(seat);
    return acc;
  }, {} as Record<string, Record<string, Seat[]>>);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-8">
        {Object.entries(groupedSeats).map(([category, rows]) => (
          <div key={category} className="space-y-2">
            <h3 className="text-sm text-muted-foreground">
              Rs. {seats.find((s) => s.priceCategory === category)?.price} {category}
            </h3>
            <div className="space-y-2">
              {Object.entries(rows).map(([row, seats]) => (
                <div key={row} className="flex items-center gap-2">
                  <span className="w-6 text-sm text-muted-foreground">{row}</span>
                  <div className="flex gap-1">
                    {seats.map((seat) => (
                      <button
                        key={seat.seatId}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.status === "sold"}
                        className={cn(
                          "w-8 h-8 rounded border text-sm font-medium transition-colors",
                          getSeatColor(seat)
                        )}
                      >
                        {seat.seatNumber}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        All eyes this way please!
      </div>

      <div className="mt-6 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200" />
          <span className="text-sm">Bestseller</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white border" />
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-sm">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
          <span className="text-sm">Sold</span>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Button onClick={() => onSeatSelect(selectedSeats)}>
            Confirm {selectedSeats.length} Seats
          </Button>
        </div>
      )}
    </div>
  );
}

