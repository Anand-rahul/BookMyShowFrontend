"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { PriceCategory } from "@/types";
import { cn } from "@/lib/utils";

export interface SeatCountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectSeats: (count: number) => void;
  priceCategories: PriceCategory[];
}

export default function SeatCountDialog({
  open,
  onOpenChange,
  onSelectSeats,
  priceCategories,
}: SeatCountDialogProps) {
  const [selectedCount, setSelectedCount] = useState<number>(0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-center mb-6">
            How Many Seats?
          </h2>

          <div className="flex justify-center mb-8">
            <Image
              src="/scooter-illustration.svg"
              alt="Scooter illustration"
              width={120}
              height={120}
              className="opacity-80"
            />
          </div>

          <div className="grid grid-cols-5 gap-2 mb-8 justify-items-center sm:flex sm:flex-wrap sm:justify-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
              <Button
                key={number}
                variant="outline"
                className={cn(
                  "w-10 h-10 rounded-full p-0",
                  selectedCount === number &&
                    "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={() => setSelectedCount(number)}
              >
                {number}
              </Button>
            ))}
          </div>

          <div className="space-y-3 mb-6">
            {priceCategories.map((category) => (
              <div
                key={category.name}
                className="flex justify-between items-center text-sm"
              >
                <span>{category.name}</span>
                <div className="flex items-center gap-2">
                  <span>Rs. {category.price}</span>
                  <span className="text-green-500 text-xs">
                    {category.status === "available"
                      ? "Available"
                      : "Filling Fast"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Button
            className="w-full bg-[#1a2236] hover:bg-[#1a2236]/90"
            onClick={() => onSelectSeats(selectedCount)}
            disabled={!selectedCount}
          >
            Select Seats
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
