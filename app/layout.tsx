import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex flex-col min-h-screen items-center justify-center border-4 border-primary`}
      >
        <Header />
        <main className="w-full flex-grow flex items-center justify-center bg-background">
          {children}
        </main>
      </body>
    </html>
  );
}
