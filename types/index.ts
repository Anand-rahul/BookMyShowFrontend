export interface User {
  id: number;
  userName: string;
  email: string;
  mobile?: string;
  password?: string; // We don't want to expose this in the frontend, but it's part of the backend model
}

export interface Movie {
  movieId: number;
  movieName: string;
  movieDurationInMinutes: number;
  locationIds: Location[];
  posterUrl: string;
  rating: number;
  votes: string;
  genre: string;
  genres?: string[];
  description: string;
  cast?: string[];
}

export interface Location {
  id: number;
  city: string;
  icon: string;
  popular: boolean;
}

export interface Theatre {
  theatreId: number;
  address: string;
  city: string;
  screens: Screen[];
  shows: Show[];
  cancellationAvailable: boolean;
}

export interface Screen {
  screenId: number;
  screenType: string;
  seats: Seat[];
}

export interface Seat {
  seatId: number;
  seatCategory: "SILVER" | "GOLD" | "PLATINUM";
  id: string;
  row: string;
  seatNumber: string;
  priceCategory: string;
  status: string;
  price: number;
}

export interface Show {
  showId: number;
  movie: Movie;
  screen: Screen;
  showStartTime: number;
  bookedSeatIds: number[];
}

export interface BookingRequest {
  showId: number;
  seatIds: number[];
  userId: number;
}

export interface BookingResponse {
  bookingId: number;
  showName: string;
  showLocation: number;
  seatCategory: string;
  bookedSeats: number[];
  userMobile: string;
  bookingStatus: string;
  showTime: string;
  movieDuration: number;
}

export interface PriceCategory {
  name: string;
  price: number;
  status: "filling" | "available";
}

export interface ShowDetails {
  seats: Seat[];
  priceCategories: PriceCategory[];
}
