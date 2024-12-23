"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Location } from "@/types";
import { getLocations } from "@/services/api";

export default function Header() {
  const [selectedCity, setSelectedCity] = useState("Select City");
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchLocationsWithRetry = async (maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const fetchedLocations = await getLocations();
        console.log(fetchedLocations);
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
        console.log("Hello");
        await fetchLocationsWithRetry();
      } catch (error) {
        console.error("Failed to fetch locations after retries:", error);
        setError("Failed to load cities. Please try again later.");
        // Fallback data
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCitySelect = (location: Location) => {
    console.log(location.name);
    setSelectedCity(location.name);
    setIsOpen(false);
  };

  const filteredLocations = locations.filter((location) =>
    location?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {}, [searchQuery]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="BookMyShow"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
        <div className="flex items-center space-x-4 px-6 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for Movies, Events, Plays, Sports and Activities"
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(true)}
            className="min-w-[120px]"
          >
            {selectedCity}
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost">Sign In</Button>
        </div>
      </div>
      <nav className="container flex h-14 items-center justify-between mt-4">
        <div className="flex items-center space-x-6">
          <Link href="/movies" className="text-sm font-medium">
            Movies
          </Link>
          <Link href="/stream" className="text-sm font-medium">
            Stream
          </Link>
          <Link href="/events" className="text-sm font-medium">
            Events
          </Link>
          <Link href="/plays" className="text-sm font-medium">
            Plays
          </Link>
          <Link href="/sports" className="text-sm font-medium">
            Sports
          </Link>
          <Link href="/activities" className="text-sm font-medium">
            Activities
          </Link>
        </div>
      </nav>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select your city</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for your city"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 pt-4">
            {isLoading ? (
              <div className="col-span-full text-center py-4">
                Loading cities...
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-4">
                <p className="text-destructive mb-2">{error}</p>
                <Button onClick={() => handleOpenChange(true)}>Retry</Button>
              </div>
            ) : (
              filteredLocations.map((location) => (
                <button
                  key={location.id}
                  className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-accent"
                  onClick={() => handleCitySelect(location)}
                >
                  <Image
                    src={`/placeholder.svg?height=48&width=48`}
                    alt={location.name}
                    width={48}
                    height={48}
                    className="w-12 h-12"
                  />
                  <span className="text-sm font-medium">{location.name}</span>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
