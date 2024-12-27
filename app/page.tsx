"use client";

import Header from "@/components/header";
import MovieList from "@/components/movie-list";
import { useCity } from "@/contexts/CityContext";

export default function Home() {
  const cityContext = useCity();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {cityContext.isInitialLoad
            ? "Recommended Movies"
            : cityContext.selectedCity
            ? `Movies in ${cityContext.selectedCity}`
            : "Movies"}
        </h1>
        <MovieList />
      </main>
    </div>
  );
}
