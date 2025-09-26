"use client"

import { useState, useEffect } from "react"
import { Home, Grid3X3, QrCode, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"

interface FloatingNavigationProps {
  onQRScannerOpen: () => void
  onCartOpen: () => void
}

export function FloatingNavigation({ onQRScannerOpen, onCartOpen }: FloatingNavigationProps) {
  const router = useRouter()
  const { getTotalItems } = useCart()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const totalCartItems = getTotalItems()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const handleQRScannerClick = async () => {
    console.log("[v0] QR Scanner button clicked")

    try {
      // Check if camera API is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log("[v0] Camera API not supported")
        alert(
          "Camera access is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.",
        )
        return
      }

      console.log("[v0] Camera API supported, opening QR scanner")
      // Open scanner directly - let the QRScanner component handle permissions
      onQRScannerOpen()
    } catch (error) {
      console.error("[v0] QR Scanner error:", error)
      alert("An error occurred while trying to access the camera. Please try again.")
    }
  }

  return (
    <nav
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl px-2 py-2">
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center gap-1 text-foreground hover:text-primary hover:bg-primary/10 rounded-xl h-14 w-14 transition-all duration-200"
            onClick={() => router.push("/")}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl h-14 w-14 transition-all duration-200"
            onClick={() => router.push("/categories")}
          >
            <Grid3X3 className="w-5 h-5" />
            <span className="text-xs font-medium">Categories</span>
          </Button>

          {/* QR Scanner - Regular button style */}
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl h-14 w-14 transition-all duration-200"
            onClick={handleQRScannerClick}
            title="Scan QR Code - Camera access required"
          >
            <QrCode className="w-5 h-5" />
            <span className="text-xs font-medium">Scan QR</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl h-14 w-14 relative transition-all duration-200"
            onClick={onCartOpen}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {totalCartItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center p-0">
                  {totalCartItems}
                </Badge>
              )}
            </div>
            <span className="text-xs font-medium">Cart</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl h-14 w-14 transition-all duration-200"
            onClick={() => router.push("/profile")}
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Profile</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
