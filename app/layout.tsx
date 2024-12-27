import { Inter } from 'next/font/google'
import "./globals.css"
import { CityProvider } from "@/contexts/CityContext"
import { AuthProvider } from "@/contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CityProvider>
            {children}
          </CityProvider>
        </AuthProvider>
      </body>
    </html>
  )
}