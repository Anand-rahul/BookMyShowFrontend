"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { use, useState, useEffect } from "react";
import { Location } from "@/types";
import { getLocations } from "@/services/api";
import CitySelector from "./city-selector";
import { useCity } from "@/contexts/CityContext";

export default function Header() {
  const cityContext = useCity();
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocationsWithRetry = async (maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const fetchedLocations = await getLocations();
        setLocations(fetchedLocations);
        return;
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        if (i === maxRetries - 1) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  };

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open && locations.length === 0) {
      setIsLoading(true);
      setError(null);
      try {
        await fetchLocationsWithRetry();
      } catch (error) {
        console.error("Failed to fetch locations after retries:", error);
        setError("Failed to load cities. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCitySelect = (location: Location) => {
    cityContext.setSelectedCity(location.city);
    cityContext.setIsInitialLoad(false);
    console.log("Selected city:", cityContext.selectedCity);
    setIsOpen(false);
  };
  useEffect(() => {
    console.log("in header  " + cityContext.selectedCity);
  }, [cityContext.isInitialLoad]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="BookMyShow"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex items-center space-x-4 flex-1 max-w-2xl mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                className="pl-10 w-full"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(true)}
              className="min-w-[120px] whitespace-nowrap"
            >
              {cityContext.selectedCity || "Select City"}
            </Button>
          </div>
          <div className="flex-shrink-0">
            <Button variant="ghost">Sign In</Button>
          </div>
        </div>
        <nav className="flex items-center justify-start h-12 -mb-px">
          <div className="flex space-x-8">
            {[
              "Movies",
              "Stream",
              "Events",
              "Plays",
              "Sports",
              "Activities",
            ].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm font-medium hover:text-primary transition-colors px-1 py-2"
              >
                {item}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <CitySelector
        open={isOpen}
        onOpenChange={handleOpenChange}
        onCitySelect={handleCitySelect}
        cities={locations}
        isLoading={isLoading}
        error={error}
        onRetry={() => handleOpenChange(true)}
      />
    </header>
  );
}
