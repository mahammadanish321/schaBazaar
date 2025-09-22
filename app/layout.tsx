import type React from "react"
import type { Metadata } from "next"
import { Roboto, Roboto_Mono } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { NotificationProvider } from "@/contexts/notification-context"
import "./globals.css"

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
})

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "SacchaBazaar - Agricultural Marketplace",
  description: "Connect farmers, aggregators, and customers in a seamless agricultural marketplace",
  keywords: "agriculture, marketplace, farmers, organic, fresh produce",
  authors: [{ name: "SacchaBazaar Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  generator: "v0.app",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans bg-background text-foreground">
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
