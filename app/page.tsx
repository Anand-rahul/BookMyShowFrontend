import { Suspense } from "react";
import MovieList from "@/components/movie-list";
import { getMovies } from "@/services/api";
import { Movie } from "@/types";

export default async function Home() {
  let movies: Movie[];
  try {
    movies = await getMovies(); // Fetch movies at the top level
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    movies = []; // Fallback to an empty array if fetching fails
  }

  return (
    <main className="w-full min-h-screen bg-background flex items-center justify-center p-4">
      <section className="container max-w-6xl mx-auto py-8 space-y-8 px-4 border border-primary rounded-lg">
        <div className="text-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Recommended Movies
            </h2>
            <Suspense fallback={<div>Loading movies...</div>}>
              <MovieList movies={movies} />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
