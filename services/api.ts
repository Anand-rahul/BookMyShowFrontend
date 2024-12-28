import {
  Movie,
  Theatre,
  BookingRequest,
  BookingResponse,
  Location,
  User,
  Seat,
  Show,
  PriceCategory,
  UserRegistrationRequest,
  UserSignInRequest,
} from "@/types";

const API_BASE_URL = "http://localhost:8080";

//let authToken: string | null = null; // Removed as auth is now handled by cookies

//const setAuthToken = (token: string) => {
//  authToken = token;
//  localStorage.setItem('authToken', token);
//}

//const clearAuthToken = () => {
//  authToken = null;
//  localStorage.removeItem('authToken');
//}

//const getAuthHeaders = () => {
//  return authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
//}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include", // This ensures cookies are sent with the request
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

export async function signUp(userData: UserRegistrationRequest): Promise<User> {
  const response = await fetch("http://localhost:8080/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to register user");
  }

  return response.json();
}

export async function signIn(credentials: UserSignInRequest): Promise<User> {
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include", // This ensures cookies are sent with the request
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Sign-in failed");
  }

  return response.json();
}

export async function signOut(): Promise<void> {
  await fetch("/api/auth/signout", {
    method: "POST",
    credentials: "include",
  });
}

export async function getMovies(): Promise<Movie[]> {
  return apiCall("/movies/all");
}

export async function getMoviesByLocation(city: string): Promise<Movie[]> {
  return apiCall(`/movies/${city}`);
}

export async function getTheatresByCity(city: string): Promise<Theatre[]> {
  return apiCall(`/theatres/fetch-by-city?city=${city}`);
}

export async function getSeatsForShow(showId: number): Promise<Seat[]> {
  return apiCall(`/shows/${showId}/seats`);
}

export async function createBooking(
  bookingRequest: BookingRequest
): Promise<BookingResponse> {
  return apiCall("/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingRequest),
  });
}

export async function getLocations(): Promise<Location[]> {
  return apiCall("/locations/all");
}

export async function getMovieById(movieId: number): Promise<Movie> {
  return apiCall(`/movies/id/${movieId}`);
}

export async function getSimilarMovies(movieId: number): Promise<Movie[]> {
  return apiCall(`/movies/${movieId}/similar`);
}

export async function getTheatresByMovieAndCity(
  city: string,
  movieName: string
): Promise<Theatre[]> {
  return apiCall(
    `/theatres/fetch-by-city?city=${encodeURIComponent(
      city
    )}&movie=${encodeURIComponent(movieName)}`
  );
}

export async function getShowDetails(
  showId: number
): Promise<{ show: Show; seats: Seat[]; priceCategories: PriceCategory[] }> {
  return apiCall(`/shows/${showId}/details`);
}

//export { setAuthToken, clearAuthToken }; // Removed as authToken is no longer used
