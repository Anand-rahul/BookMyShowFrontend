"use client";

import { useState, useEffect } from "react";
import { Theatre } from "@/types";
import { useCity } from "@/contexts/CityContext";
import { getTheatresByMovieAndCity } from "@/services/api";
import { Heart, Info, Utensils, Ticket } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TheatreShowtimesProps {
  movieName: string;
}

export default function TheatreShowtimes({ movieName }: TheatreShowtimesProps) {
  const { selectedCity } = useCity();
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return <div className="mt-8">Loading theatres...</div>;
  }

  if (error) {
    return <div className="mt-8 text-red-500">{error}</div>;
  }

  if (!selectedCity) {
    return <div className="mt-8">Please select a city to view available shows</div>;
  }

  if (theatres.length === 0) {
    return <div className="mt-8">No shows available in {selectedCity}</div>;
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours > 12 ? hours - 12 : hours;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
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
                onClick={() => {
                  // Handle show selection
                  console.log('Selected show:', show);
                }}
              >
                <div className="text-center">
                  <div className="font-semibold">{formatTime(show.showStartTime)}</div>
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
  );
}
