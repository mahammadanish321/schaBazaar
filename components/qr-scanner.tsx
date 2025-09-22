"use client"

import { useState, useRef, useEffect } from "react"
import { X, Camera, FishOff as FlashOff, Zap, RotateCcw, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface QRScannerProps {
  isOpen: boolean
  onClose: () => void
  onScanResult: (result: string) => void
}

interface ScannedProduct {
  id: number
  name: string
  price: number
  unit: string
  farmer: string
  stock: number
  image: string
  organic: boolean
  description: string
}

// Mock QR code results for demonstration
const mockQRResults: Record<string, ScannedProduct> = {
  QR001: {
    id: 101,
    name: "Premium Organic Tomatoes",
    price: 55,
    unit: "kg",
    farmer: "Rajesh Kumar",
    stock: 75,
    image: "/fresh-red-tomatoes.jpg",
    organic: true,
    description: "Fresh organic tomatoes grown without pesticides. Perfect for salads and cooking.",
  },
  QR002: {
    id: 102,
    name: "Farm Fresh Onions",
    price: 35,
    unit: "kg",
    farmer: "Priya Sharma",
    stock: 120,
    image: "/organic-white-onions.jpg",
    organic: false,
    description: "High quality onions directly from the farm. Great for all cooking needs.",
  },
  QR003: {
    id: 103,
    name: "Organic Green Spinach",
    price: 28,
    unit: "bunch",
    farmer: "Amit Singh",
    stock: 60,
    image: "/fresh-green-spinach-leaves.jpg",
    organic: true,
    description: "Fresh organic spinach leaves, rich in iron and vitamins.",
  },
}

export function QRScanner({ isOpen, onClose, onScanResult }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Start camera when scanner opens
  useEffect(() => {
    if (isOpen && !scannedProduct) {
      startCamera()
    }
    return () => {
      stopCamera()
    }
  }, [isOpen, scannedProduct])

  const startCamera = async () => {
    try {
      setScanError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsScanning(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setScanError("Unable to access camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const toggleFlash = async () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack && "applyConstraints" in videoTrack) {
        try {
          await videoTrack.applyConstraints({
            advanced: [{ torch: !flashEnabled } as any],
          })
          setFlashEnabled(!flashEnabled)
        } catch (error) {
          console.error("Flash not supported:", error)
        }
      }
    }
  }

  // Simulate QR code scanning (in real implementation, you'd use a QR scanning library)
  const simulateScan = () => {
    const qrCodes = Object.keys(mockQRResults)
    const randomQR = qrCodes[Math.floor(Math.random() * qrCodes.length)]
    const product = mockQRResults[randomQR]

    setScannedProduct(product)
    setIsScanning(false)
    stopCamera()
    onScanResult(randomQR)
  }

  const handleClose = () => {
    stopCamera()
    setScannedProduct(null)
    setScanError(null)
    setIsAddingToCart(false)
    onClose()
  }

  const handleAddToCart = async () => {
    if (scannedProduct) {
      setIsAddingToCart(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Adding to cart:", scannedProduct)
      setIsAddingToCart(false)
      handleClose()
    }
  }

  const resetScan = () => {
    setScannedProduct(null)
    setScanError(null)
    startCamera()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/90 z-50" onClick={handleClose} />

      {/* Scanner Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-background rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Camera className="h-4 w-4 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">QR Scanner</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Scanner Content */}
          <div className="p-4">
            {scanError ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Camera Access Required</h3>
                <p className="text-destructive text-sm mb-4">{scanError}</p>
                <Button onClick={startCamera} className="btn-primary">
                  Try Again
                </Button>
              </div>
            ) : scannedProduct ? (
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <CardTitle className="text-primary">Product Found!</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={scannedProduct.image || "/placeholder.svg"}
                        alt={scannedProduct.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      {scannedProduct.organic && (
                        <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs px-1">
                          Organic
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground text-sm leading-tight mb-1">{scannedProduct.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">by {scannedProduct.farmer}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          ₹{scannedProduct.price}/{scannedProduct.unit}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {scannedProduct.stock} in stock
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{scannedProduct.description}</p>
                  <div className="flex gap-2">
                    <Button className="flex-1 btn-primary" onClick={handleAddToCart} disabled={isAddingToCart}>
                      {isAddingToCart ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Adding...
                        </div>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={resetScan} className="px-3 bg-transparent">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Camera View */}
                <div className="relative aspect-square bg-black rounded-xl overflow-hidden">
                  {isScanning ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Starting camera...</p>
                      </div>
                    </div>
                  )}

                  {/* Scanning Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 relative">
                      {/* Scanning frame */}
                      <div className="absolute inset-0 border-2 border-primary/50 rounded-2xl">
                        {/* Corner indicators */}
                        <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-2xl"></div>
                        <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-2xl"></div>
                        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-2xl"></div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-2xl"></div>
                      </div>

                      {/* Scanning line animation */}
                      {isScanning && (
                        <div className="absolute inset-x-4 top-1/2 h-0.5 bg-primary animate-pulse shadow-lg shadow-primary/50"></div>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={toggleFlash}
                      className="rounded-full bg-background/80 hover:bg-background"
                    >
                      {flashEnabled ? <Zap className="h-4 w-4" /> : <FlashOff className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-center space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Point your camera at a QR code</p>
                    <p className="text-xs text-muted-foreground">
                      Make sure the QR code is clearly visible and well-lit
                    </p>
                  </div>
                  {/* Demo button for testing */}
                  <Button variant="outline" size="sm" onClick={simulateScan} className="text-xs bg-transparent">
                    🎯 Try Demo Scan
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
