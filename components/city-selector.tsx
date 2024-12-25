"use client";

import { use, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Location } from "@/types";
import { Button } from "@/components/ui/button";

interface CitySelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCitySelect: (city: Location) => void;
  cities: Location[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export default function CitySelector({
  open,
  onOpenChange,
  onCitySelect,
  cities,
  isLoading,
  error,
  onRetry,
}: CitySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCities = cities.filter((city) =>
    city.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularCities = filteredCities.filter((city) => city.popular);
  const otherCities = filteredCities.filter((city) => !city.popular);
  // useEffect(() => {}, [filteredCities]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Select your city
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for your city"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-muted animate-pulse"
              >
                <div className="w-12 h-12 rounded-full bg-muted-foreground/20" />
                <div className="h-4 w-20 bg-muted-foreground/20 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                Retry
              </Button>
            )}
          </div>
        ) : searchQuery ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {filteredCities.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  onCitySelect(city);
                  onOpenChange(false);
                }}
                className="px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-center"
              >
                {city.city}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {popularCities.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-4">Popular Cities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {popularCities.map((city) => (
                    <button
                      key={city.id}
                      className="flex flex-col items-center justify-center space-y-2 p-4 rounded-lg hover:bg-accent transition-colors"
                      onClick={() => {
                        onCitySelect(city);
                        onOpenChange(false);
                      }}
                    >
                      <Image
                        src={city.icon || `/placeholder.svg?height=48&width=48`}
                        alt={city.city}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg?height=48&width=48";
                        }}
                      />
                      <span className="text-sm font-medium text-center">
                        {city.city}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {otherCities.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-4">Other Cities</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {otherCities.map((city) => (
                    <button
                      key={city.id}
                      className="px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-center"
                      onClick={() => {
                        onCitySelect(city);
                        onOpenChange(false);
                      }}
                    >
                      {city.city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
