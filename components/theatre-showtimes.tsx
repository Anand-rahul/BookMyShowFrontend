"use client";

import { useState, useEffect } from "react";
import { Theatre, Show, Seat, PriceCategory } from "@/types";
import { useCity } from "@/contexts/CityContext";
import { getTheatresByMovieAndCity, getShowDetails } from "@/services/api";
import { Heart, Info, Utensils, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SeatCountDialog from "./seat-count-dialog";
import SeatingLayout from "./seating-layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TheatreShowtimesProps {
  movieName: string;
}

export default function TheatreShowtimes({ movieName }: TheatreShowtimesProps) {
  const { selectedCity } = useCity();
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [seatCountDialogOpen, setSeatCountDialogOpen] = useState(false);
  const [seatingDialogOpen, setSeatingDialogOpen] = useState(false);
  const [selectedSeatCount, setSelectedSeatCount] = useState(0);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [priceCategories, setPriceCategories] = useState<PriceCategory[]>([]);

  useEffect(() => {
    const fetchTheatres = async () => {
      if (!selectedCity) return;

      setIsLoading(true);
      setError(null);
      try {
        const data = await getTheatresByMovieAndCity(selectedCity, movieName);
        setTheatres(data);
      } catch (error) {
        console.error("Failed to fetch theatres:", error);
        setError("Failed to load theatre information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTheatres();
  }, [selectedCity, movieName]);

  const handleShowSelect = async (show: Show) => {
    setSelectedShow(show);
    setSeatCountDialogOpen(true);
    try {
      const showDetails = await getShowDetails(show.showId);
      // Map seats with their actual booking status based on bookedSeatIds
      const seatsWithStatus = showDetails.seats.map((seat) => ({
        ...seat,
        status: show.bookedSeatIds.includes(seat.seatId)
          ? "sold"
          : seat.seatCategory === "GOLD"
          ? "bestseller"
          : "available",
      }));
      setSeats(seatsWithStatus);
      setPriceCategories(showDetails.priceCategories);
    } catch (error) {
      console.error("Failed to fetch show details:", error);
      setError("Failed to load seat and price information");
    }
  };

  const handleSeatCountSelect = (count: number) => {
    setSelectedSeatCount(count);
    setSeatCountDialogOpen(false);
    setSeatingDialogOpen(true);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours > 12 ? hours - 12 : hours;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  if (isLoading) {
    return <div className="mt-8">Loading theatres...</div>;
  }

  if (error) {
    return <div className="mt-8 text-red-500">{error}</div>;
  }

  if (!selectedCity) {
    return (
      <div className="mt-8">Please select a city to view available shows</div>
    );
  }

  if (theatres.length === 0) {
    return <div className="mt-8">No shows available in {selectedCity}</div>;
  }

  return (
    <>
      <div className="mt-8 space-y-6">
        {theatres.map((theatre) => (
          <div key={theatre.theatreId} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{theatre.address}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Heart className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add to favorites</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Ticket className="h-4 w-4" />
                    <span>M-Ticket</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Utensils className="h-4 w-4" />
                    <span>Food & Beverage</span>
                  </div>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Theatre Information</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex flex-wrap gap-4">
              {theatre.shows.map((show) => (
                <Button
                  key={show.showId}
                  variant="outline"
                  className="min-w-[100px]"
                  onClick={() => handleShowSelect(show)}
                >
                  <div className="text-center">
                    <div className="font-semibold">
                      {formatTime(show.showStartTime)}
                    </div>
                    {show.screen.screenType && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {show.screen.screenType}
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              {theatre.cancellationAvailable ? (
                <span className="text-green-600">Cancellation Available</span>
              ) : (
                <span>Non-cancellable</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <SeatCountDialog
        open={seatCountDialogOpen}
        onOpenChange={setSeatCountDialogOpen}
        onSelectSeats={handleSeatCountSelect}
        priceCategories={priceCategories}
      />

      <Dialog open={seatingDialogOpen} onOpenChange={setSeatingDialogOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Select Your Seats</DialogTitle>
          </DialogHeader>
          <SeatingLayout
            seats={seats}
            maxSeats={selectedSeatCount}
            onSeatSelect={(selectedSeats) => {
              console.log("Selected seats:", selectedSeats);
              // Handle seat selection
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
