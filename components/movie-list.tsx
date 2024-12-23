import { Movie } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface MovieListProps {
  movies: Movie[];
}

export default function MovieList({ movies }: MovieListProps) {
  if (!Array.isArray(movies) || movies.length === 0) {
    return <div>No movies available at the moment.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center p-4">
      {movies.map((movie) => (
        <Link
          key={movie.movieId}
          href={`/movies/${movie.movieId}`}
          className="group"
        >
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
            <Image
              src={`/placeholder.svg?height=450&width=300`}
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
