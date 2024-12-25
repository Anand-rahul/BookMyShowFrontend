import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Movie } from "@/types";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movies/${movie.movieId}`} className="group">
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
          <span>{movie.rating}/10</span>
          <span className="mx-1">•</span>
          <span>{movie.votes.toLocaleString()} Votes</span>
        </div>
        <p className="text-sm text-muted-foreground">{movie.genre}</p>
      </div>
    </Link>
  );
}
