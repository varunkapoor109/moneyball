import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pickleball Moneyball",
  description: "Track and manage pickleball moneyball games",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
