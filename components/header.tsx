"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Location } from "@/types";
import { getLocations } from "@/services/api";
import CitySelector from "./city-selector";
import { useCity } from "@/contexts/CityContext";
import { SignInDialog } from "./sign-in-dailog";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const cityContext = useCity();
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open && locations.length === 0) {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedLocations = await getLocations();
        setLocations(fetchedLocations);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setError("Failed to load cities. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCitySelect = (location: Location) => {
    cityContext.setSelectedCity(location.city);
    cityContext.setIsInitialLoad(false);
    setIsOpen(false);
  };

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
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    Hello, {user?.userName || "User"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" onClick={() => setIsSignInOpen(true)}>
                Sign In
              </Button>
            )}
          </div>
        </div>
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
      <SignInDialog open={isSignInOpen} onOpenChange={setIsSignInOpen} />
    </header>
  );
}
