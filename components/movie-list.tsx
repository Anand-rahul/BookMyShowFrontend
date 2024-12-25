"use client";

import { useEffect, useState } from "react";
import { Movie } from "@/types";
import { getMovies, getMoviesByLocation } from "@/services/api";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useCity } from "@/contexts/CityContext";

export default function MovieList() {
  const cityContext = useCity();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let fetchedMovies;
      if (cityContext.isInitialLoad) {
        fetchedMovies = await getMovies();
      } else {
        fetchedMovies = await getMoviesByLocation(cityContext.selectedCity!);
      }
      console.log("Fetched movies:", fetchedMovies);
      setMovies(fetchedMovies);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setError("Failed to load movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [cityContext.selectedCity, cityContext.isInitialLoad]);

  if (isLoading) {
    return <div className="text-center py-8">Loading movies...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-8">
        No movies available
        {cityContext.selectedCity ? ` for ${cityContext.selectedCity}` : ""}.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <Link
          key={movie.movieId}
          href={`/movies/${movie.movieId}`}
          className="group"
        >
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
            <Image
              src={movie.posterUrl || `/placeholder.svg?height=450&width=300`}
              alt={movie.movieName}
              className="object-cover transition-transform group-hover:scale-105"
              fill
              priority
            />
          </div>
          <div className="mt-2 space-y-1">
            <h3 className="font-semibold line-clamp-1">{movie.movieName}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-primary text-primary mr-1" />
              <span>4.5/5</span>
              <span className="mx-1">•</span>
              <span>{movie.movieDurationInMinutes} mins</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
