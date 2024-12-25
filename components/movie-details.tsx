"use client";

import Image from "next/image";
import { Movie } from "@/types";
import { Button } from "@/components/ui/button";
import { Star, Clock, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface MovieDetailsProps {
  movie: Movie;
}

export default function MovieDetails({ movie }: MovieDetailsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Movie Poster */}
      <div className="w-full md:w-80 flex-shrink-0">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          <Image
            src={movie.posterUrl || `/placeholder.svg?height=450&width=300`}
            alt={movie.movieName}
            className="object-cover"
            fill
            priority
          />
        </div>
        <div className="mt-4 space-y-3">
          <Button className="w-full" size="lg">
            Book Tickets
          </Button>
        </div>
      </div>

      {/* Movie Info */}
      <div className="flex-grow">
        <h1 className="text-4xl font-bold mb-4">{movie.movieName}</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-semibold">4.5/5</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-1" />
            <span>{movie.movieDurationInMinutes} mins</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-1" />
            <span>2024</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">About the movie</h2>
            <p className="text-muted-foreground">
              {movie.description || "No description available."}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Cast</h2>
            <div className="flex flex-wrap gap-2">
              {movie.cast?.map((actor, index) => (
                <Badge key={index} variant="secondary">
                  {actor}
                </Badge>
              )) || "Cast information not available"}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Genre</h2>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre, index) => (
                <Badge key={index} variant="outline">
                  {genre}
                </Badge>
              )) || movie.genre}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

