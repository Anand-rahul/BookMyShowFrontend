import {
  Movie,
  Theatre,
  BookingRequest,
  BookingResponse,
  Location,
  User,
  Seat,
} from "@/types";

const API_BASE_URL = "http://localhost:8080";

export async function getMovies(): Promise<Movie[]> {
  const response = await fetch(`${API_BASE_URL}/movies/all`);
  return response.json();
}

export async function getMoviesByLocation(city: string): Promise<Movie[]> {
  const response = await fetch(`${API_BASE_URL}/movies/${city}`);
  return response.json();
}

export async function getTheatresByCity(city: string): Promise<Theatre[]> {
  const response = await fetch(
    `${API_BASE_URL}/theatres/fetch-by-city?city=${city}`
  );
  return response.json();
}

export async function getAvailableSeats(showId: number): Promise<Seat[]> {
  const response = await fetch(`${API_BASE_URL}/shows/seats/${showId}`);
  return response.json();
}

export async function createBooking(
  bookingRequest: BookingRequest
): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingRequest),
  });
  return response.json();
}

export async function getLocations(): Promise<Location[]> {
  const response = await fetch(`${API_BASE_URL}/locations/all`);
  return response.json();
}

export async function getMovieById(movieId: number): Promise<Movie> {
  const response = await fetch(`${API_BASE_URL}/movies/id/${movieId}`);
  return response.json();
}

export async function getSimilarMovies(movieId: number): Promise<Movie[]> {
  const response = await fetch(`${API_BASE_URL}/movies/${movieId}/similar`);
  return response.json();
}

export async function getTheatresByMovieAndCity(
  city: string,
  movieName: string
): Promise<Theatre[]> {
  const response = await fetch(
    `${API_BASE_URL}/theatres/fetch-by-city?city=${encodeURIComponent(
      city
    )}&movie=${encodeURIComponent(movieName)}`
  );
  return response.json();
}
