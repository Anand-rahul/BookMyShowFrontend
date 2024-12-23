"use client";

import { useState } from "react";
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

/*export interface City {
  id: number;
  name: string;
  icon:string;
} */
const popularCities: Location[] = [
  {
    id: 1,
    name: "Mumbai",
    icon: "/cities/mumbai.svg",
  },
  // Add more cities...
];

interface CitySelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCitySelect: (city: Location) => void;
}

export default function CitySelector({
  open,
  onOpenChange,
  onCitySelect,
}: CitySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCities = popularCities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 pt-4">
          {filteredCities.map((city) => (
            <button
              key={city.id}
              className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-accent"
              onClick={() => {
                onCitySelect(city);
                onOpenChange(false);
              }}
            >
              <Image
                src={city.icon}
                alt={city.name}
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <span className="text-sm font-medium">{city.name}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
