"use client";

import { useEffect, useState } from "react";
import { Movie } from "@/types";
import { getMovieById, getSimilarMovies } from "@/services/api";
import MovieDetails from "@/components/movie-details";
import SimilarMovies from "@/components/similar-movies";
import TheatreShowtimes from "@/components/theatre-showtimes";
import Header from "@/components/header";

export default function MoviePage({ params }: { params: { movieId: string } }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movieData = await getMovieById(parseInt(params.movieId));
        setMovie(movieData);
        // const similar = await getSimilarMovies(parseInt(params.movieId));
        // setSimilarMovies(similar);
      } catch (error) {
        setError("Failed to load movie details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [params.movieId]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div>Loading...</div>
        ) : error || !movie ? (
          <div>{error || "Movie not found"}</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow">
              <MovieDetails movie={movie} />
              <TheatreShowtimes movieName={movie.movieName} />
            </div>
            <div className="w-full lg:w-80">
              <h2 className="text-xl font-semibold mb-4">Similar Movies</h2>
              <SimilarMovies movies={similarMovies} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
