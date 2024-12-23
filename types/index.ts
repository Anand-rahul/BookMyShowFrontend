export interface User {
  id: number;
  mobile: string;
  userName: string;
  emailId: string;
  password: string;
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
}

export interface Location {
  id: number;
  name: string;
  icon: string;
}

export interface Theatre {
  theatreId: number;
  address: string;
  city: string;
  screens: Screen[];
  shows: Show[];
}

export interface Screen {
  screenId: number;
  seats: Seat[];
}

export interface Seat {
  seatId: number;
  row: number;
  seatCategory: "SILVER" | "GOLD" | "PLATINUM";
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
