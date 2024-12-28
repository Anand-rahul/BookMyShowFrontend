"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import Header from "@/components/header";

export default function BookingConfirmationPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { selectedShow, selectedSeats, theatre } = useBooking();

  useEffect(() => {
    if (!isAuthenticated || !selectedShow || !theatre) {
      router.push("/");
    }
  }, [isAuthenticated, selectedShow, theatre, router]);

  const handleMakePayment = () => {
    // Implement payment logic here
    console.log("Processing payment...");
  };

  if (!selectedShow || !theatre) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Booking Confirmation</h1>
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {selectedShow.movie.movieName}
          </h2>
          <p className="mb-2">
            <strong>Theatre:</strong> {theatre.name}
          </p>
          <p className="mb-2">
            <strong>Address:</strong> {theatre.address}
          </p>
          <p className="mb-2">
            <strong>Date:</strong>{" "}
            {new Date(selectedShow.showStartTime).toLocaleDateString()}
          </p>
          <p className="mb-2">
            <strong>Time:</strong>{" "}
            {new Date(selectedShow.showStartTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="mb-4">
            <strong>Screen:</strong> {selectedShow.screen.screenNumber}
          </p>

          <h3 className="text-xl font-semibold mb-2">Selected Seats:</h3>
          <ul className="mb-4">
            {selectedSeats.map((seat) => (
              <li key={seat.seatId}>
                {seat.seatNumber} - {seat.seatCategory} (₹{seat.price})
              </li>
            ))}
          </ul>

          <div className="border-t pt-4 mt-4">
            <p className="text-xl font-semibold">
              Total: ₹
              {selectedSeats.reduce((total, seat) => total + seat.price, 0)}
            </p>
          </div>

          <Button onClick={handleMakePayment} className="mt-6 w-full">
            Make Payment
          </Button>
        </div>
      </main>
    </div>
  );
}
