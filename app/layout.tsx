import { Inter } from "next/font/google";
import "./globals.css";
import { CityProvider } from "@/contexts/CityContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CityProvider>
            <BookingProvider>
              {children}
              <Toaster />
            </BookingProvider>
          </CityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
