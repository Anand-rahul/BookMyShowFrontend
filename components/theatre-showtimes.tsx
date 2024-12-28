"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getTheatresByMovieAndCity } from "@/services/api";
import { Theatre, Show, Seat, PriceCategory } from "@/types";
import { useCity } from "@/contexts/CityContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { useToast } from "@/components/ui/use-toast";
import SeatCountDialog from "./seat-count-dialog";
import { SeatingLayoutDialog } from "./seating-layout-dailog";

interface TheatreShowtimesProps {
  movieName: string;
}

export default function TheatreShowtimes({ movieName }: TheatreShowtimesProps) {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [priceCategories, setPriceCategories] = useState<PriceCategory[]>([]);
  const [seatCountDialogOpen, setSeatCountDialogOpen] = useState(false);
  const [seatingLayoutDialogOpen, setSeatingLayoutDialogOpen] = useState(false);
  const [maxSeats, setMaxSeats] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cityContext = useCity();
  const { isAuthenticated } = useAuth();
  const { setSelectedShow, setSelectedSeats, setTheatre } = useBooking();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTheatres = async () => {
      if (cityContext.selectedCity) {
        setIsLoading(true);
        setError(null);
        try {
          const fetchedTheatres = await getTheatresByMovieAndCity(
            cityContext.selectedCity,
            movieName
          );
          setTheatres(fetchedTheatres);
        } catch (error) {
          console.error("Failed to fetch theatres:", error);
          setError("Failed to load theatres. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTheatres();
  }, [cityContext.selectedCity, movieName]);

  const formatShowTime = (time: number): string => {
    const timeString = time.toString().padStart(4, "0");
    const hours = parseInt(timeString.slice(0, 2));
    const minutes = parseInt(timeString.slice(2));

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    return date
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();
  };

  const handleShowSelect = async (show: Show, theatre: Theatre) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book tickets.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSelectedShow(show);
      setTheatre(theatre);

      const mockPriceCategories: PriceCategory[] = [
        { name: "Premium", price: 200, status: "available" },
        { name: "Economy", price: 100, status: "available" },
      ];

      const seatsWithStatus = show.screen.seats.map((seat) => ({
        ...seat,
        status: show.bookedSeatIds.includes(seat.seatId)
          ? "sold"
          : seat.seatCategory === "GOLD"
          ? "bestseller"
          : "available",
      }));

      setSeats(seatsWithStatus);
      setPriceCategories(mockPriceCategories);
      setSeatCountDialogOpen(true);
    } catch (error) {
      console.error("Failed to process show selection:", error);
      toast({
        title: "Error",
        description: "Failed to load seat information. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSeatCountSelect = (count: number) => {
    setMaxSeats(count);
    setSeatCountDialogOpen(false);
    setSeatingLayoutDialogOpen(true);
  };

  const handleSeatSelect = (selectedSeats: Seat[]) => {
    setSelectedSeats(selectedSeats);
    router.push(`/booking-confirmation`);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading theatres...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (theatres.length === 0) {
    return (
      <div className="text-center py-8">
        No theatres available for this movie in the selected city.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Showtimes</h2>
      {theatres.map((theatre) => (
        <div
          key={theatre.theatreId}
          className="mb-6 p-4 bg-card rounded-lg border-2 border-border shadow-sm"
        >
          <h3 className="text-xl font-medium mb-2">
            {theatre.name || "Theatre"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {theatre.address}
          </p>
          <div className="flex flex-wrap gap-3">
            {theatre.shows.map((show) => (
              <Button
                key={show.showId}
                variant="outline"
                className="min-w-[100px] font-medium"
                onClick={() => handleShowSelect(show, theatre)}
              >
                {formatShowTime(show.showStartTime)}
              </Button>
            ))}
          </div>
        </div>
      ))}

      <SeatCountDialog
        open={seatCountDialogOpen}
        onOpenChange={setSeatCountDialogOpen}
        onSelectSeats={handleSeatCountSelect}
        priceCategories={priceCategories}
      />

      <SeatingLayoutDialog
        open={seatingLayoutDialogOpen}
        onOpenChange={setSeatingLayoutDialogOpen}
        seats={seats}
        maxSeats={maxSeats}
        onSeatSelect={handleSeatSelect}
      />
    </div>
  );
}
