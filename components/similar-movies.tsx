"use client";

import { Movie } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface SimilarMoviesProps {
  movies: Movie[];
}

export default function SimilarMovies({ movies }: SimilarMoviesProps) {
  if (!movies.length) {
    return <div>No similar movies found</div>;
  }

  return (
    <div className="grid gap-4">
      {movies.map((movie) => (
        <Link
          key={movie.movieId}
          href={`/movies/${movie.movieId}`}
          className="group flex gap-3"
        >
          <div className="relative w-16 h-24 flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={movie.posterUrl || `/placeholder.svg?height=96&width=64`}
              alt={movie.movieName}
              className="object-cover transition-transform group-hover:scale-105"
              fill
            />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium line-clamp-2 group-hover:text-primary">
              {movie.movieName}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Star className="h-3 w-3 fill-primary text-primary mr-1" />
              <span>4.5/5</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
