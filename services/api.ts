import { Movie, Theatre, BookingRequest, BookingResponse, Location, User, Seat, Show, PriceCategory, UserRegistrationRequest, UserSignInRequest } from "@/types"
import * as bcrypt from 'bcryptjs';

const API_BASE_URL = 'http://localhost:8080'

let authToken: string | null = null;

const setAuthToken = (token: string) => {
  authToken = token;
}

const clearAuthToken = () => {
  authToken = null;
}

const getAuthHeaders = () => {
  return authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

export async function signUp(userData: UserRegistrationRequest): Promise<User> {
  const response = await fetch('http://localhost:8080/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to register user');
  }

  return response.json();
}

export async function signIn(credentials: UserSignInRequest): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/username/${credentials.userName}`);
  
  if (!response.ok) {
    throw new Error('User not found');
  }

  const user: User = await response.json();

  // Verify password
  const isPasswordValid = await bcrypt.compare(credentials.password, user.password || '');

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  return user;
}

export async function signOut(): Promise<void> {
  clearAuthToken();
  // You might want to call a signout endpoint here if your backend requires it
}

export async function getMovies(): Promise<Movie[]> {
  return apiCall('/movies/all');
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

export async function createBooking(bookingRequest: BookingRequest): Promise<BookingResponse> {
  return apiCall('/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingRequest),
  });
}

export async function getLocations(): Promise<Location[]> {
  return apiCall('/locations/all');
}

export async function getMovieById(movieId: number): Promise<Movie> {
  return apiCall(`/movies/${movieId}`);
}

export async function getSimilarMovies(movieId: number): Promise<Movie[]> {
  return apiCall(`/movies/${movieId}/similar`);
}

export async function getTheatresByMovieAndCity(city: string, movieName: string): Promise<Theatre[]> {
  return apiCall(`/theatres/fetch-by-city?city=${encodeURIComponent(city)}&movie=${encodeURIComponent(movieName)}`);
}

export async function getShowDetails(showId: number): Promise<{ show: Show, seats: Seat[], priceCategories: PriceCategory[] }> {
  return apiCall(`/shows/${showId}/details`);
}

export { setAuthToken, clearAuthToken };

