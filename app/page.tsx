"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Plus, MapPin, ChevronDown, Mic, Bell, Star, Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import { CartSidebar } from "@/components/cart-sidebar"
import { QRScanner } from "@/components/qr-scanner"
import { NotificationPanel } from "@/components/notification-panel"
import { FloatingNavigation } from "@/components/floating-navigation"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useNotifications } from "@/contexts/notification-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

const mockProducts = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    price: 45,
    unit: "kg",
    farmer: "Rajesh Kumar",
    stock: 150,
    image: "/fresh-red-tomatoes.jpg",
    category: "vegetables",
    rating: 4.5,
    reviews: 23,
    organic: true,
  },
  {
    id: 2,
    name: "Organic Onions",
    price: 30,
    unit: "kg",
    farmer: "Priya Sharma",
    stock: 200,
    image: "/organic-white-onions.jpg",
    category: "vegetables",
    rating: 4.2,
    reviews: 18,
    organic: true,
  },
  {
    id: 3,
    name: "Fresh Spinach",
    price: 25,
    unit: "bunch",
    farmer: "Amit Singh",
    stock: 80,
    image: "/fresh-green-spinach-leaves.jpg",
    category: "vegetables",
    rating: 4.7,
    reviews: 31,
    organic: false,
  },
  {
    id: 4,
    name: "Organic Carrots",
    price: 35,
    unit: "kg",
    farmer: "Sunita Devi",
    stock: 120,
    image: "/organic-orange-carrots.jpg",
    category: "vegetables",
    rating: 4.3,
    reviews: 15,
    organic: true,
  },
  {
    id: 5,
    name: "Fresh Potatoes",
    price: 20,
    unit: "kg",
    farmer: "Ramesh Patel",
    stock: 300,
    image: "/fresh-brown-potatoes.jpg",
    category: "vegetables",
    rating: 4.1,
    reviews: 42,
    organic: false,
  },
  {
    id: 6,
    name: "Green Capsicum",
    price: 60,
    unit: "kg",
    farmer: "Meera Joshi",
    stock: 90,
    image: "/fresh-green-bell-peppers.jpg",
    category: "vegetables",
    rating: 4.4,
    reviews: 27,
    organic: true,
  },
  {
    id: 7,
    name: "Fresh Apples",
    price: 120,
    unit: "kg",
    farmer: "Vikram Singh",
    stock: 75,
    image: "/fresh-red-apples.png",
    category: "fruits",
    rating: 4.6,
    reviews: 35,
    organic: true,
  },
  {
    id: 8,
    name: "Organic Bananas",
    price: 40,
    unit: "dozen",
    farmer: "Lakshmi Devi",
    stock: 150,
    image: "/organic-yellow-bananas.jpg",
    category: "fruits",
    rating: 4.3,
    reviews: 28,
    organic: true,
  },
]

const categories = [
  { id: "all", name: "All", icon: "🛒" },
  { id: "vegetables", name: "Vegetables", icon: "🥬" },
  { id: "fruits", name: "Fruits", icon: "🍎" },
  { id: "grains", name: "Grains", icon: "🌾" },
  { id: "dairy", name: "Dairy", icon: "🥛" },
]

const featuredOffers = [
  {
    id: 1,
    title: "FRESH HARVEST",
    subtitle: "Farm to Table",
    description: "Get 20% off on organic vegetables",
    image: "/fresh-vegetables-market-display.jpg",
    color: "from-green-600 to-green-700",
  },
  {
    id: 2,
    title: "PREMIUM QUALITY",
    subtitle: "Certified Organic",
    description: "Premium organic produce delivered fresh",
    image: "/farmer-in-green-field-with-vegetables.jpg",
    color: "from-emerald-600 to-emerald-700",
  },
  {
    id: 3,
    title: "SEASONAL SPECIAL",
    subtitle: "Limited Time",
    description: "Fresh seasonal fruits at best prices",
    image: "/seasonal-fruits-basket.jpg",
    color: "from-orange-600 to-red-600",
  },
]

const quickCategories = [
  {
    id: "festive",
    title: "FESTIVE SPECIAL",
    subtitle: "Festival Essentials",
    image: "/festive-vegetables-and-fruits.jpg",
    color: "from-red-500 to-red-600",
  },
  {
    id: "organic",
    title: "ORGANIC CORNER",
    subtitle: "100% Organic",
    image: "/organic-vegetables-display.jpg",
    color: "from-green-500 to-green-600",
  },
  {
    id: "fresh",
    title: "FRESH PICKS",
    subtitle: "Daily Fresh",
    image: "/fresh-picked-vegetables.jpg",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "premium",
    title: "PREMIUM QUALITY",
    subtitle: "Best Selection",
    image: "/premium-quality-fruits.jpg",
    color: "from-purple-500 to-purple-600",
  },
]

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { cartItems, addToCart, updateQuantity, removeFromCart, getTotalItems } = useCart()
  const { unreadCount } = useNotifications()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0)
  const [serviceType, setServiceType] = useState<"quick" | "schedule">("quick")

  useEffect(() => {
    if (!user) {
      router.push("/get-started")
      return
    }
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % featuredOffers.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [user, router])

  const handleAddToCart = (product: any) => {
    addToCart(product, product.quantity || 1)
  }

  const handleBuyNow = (product: any) => {
    addToCart(product, product.quantity || 1)
    setIsCartOpen(true)
  }

  const handleUpdateQuantity = (id: number, quantity: number) => {
    updateQuantity(id, quantity)
  }

  const handleRemoveItem = (id: number) => {
    removeFromCart(id)
  }

  const handleCheckout = () => {
    setIsCartOpen(false)
    router.push("/checkout")
  }

  const filteredProducts = useMemo(() => {
    return selectedCategory === "all"
      ? mockProducts
      : mockProducts.filter((product) => product.category === selectedCategory)
  }, [selectedCategory])

  const totalCartItems = useMemo(() => getTotalItems(), [cartItems])

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with glass effect */}
      <header className="sticky top-0 z-40 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="container-max section-padding">
          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg font-bold text-foreground">SacchaBazaar</h1>
                {user && (
                  <Badge
                    variant="secondary"
                    className="text-xs capitalize bg-primary/10 text-primary border-primary/20"
                  >
                    {user.userType}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {serviceType === "quick" ? "Delivery in 20 minutes" : "Schedule your delivery"}
                </span>
                <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                  <MapPin className="w-3 h-3" />
                  <span>Baruipur Station Road</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-muted/50 rounded-lg p-1 mr-2">
                <Button
                  variant={serviceType === "quick" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setServiceType("quick")}
                  className={`h-8 px-3 text-xs font-medium transition-all ${
                    serviceType === "quick"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Quick
                </Button>
                <Button
                  variant={serviceType === "schedule" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setServiceType("schedule")}
                  className={`h-8 px-3 text-xs font-medium transition-all ${
                    serviceType === "schedule"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Schedule
                </Button>
              </div>

              {user ? (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="relative bg-background/50 hover:bg-primary/10 backdrop-blur-sm"
                    onClick={() => setIsNotificationOpen(true)}
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center p-0">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                  {user.userType === "farmer" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10"
                      onClick={() => router.push("/farmer/products")}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                  {user.userType === "aggregator" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10"
                      onClick={() => router.push("/aggregator/products")}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </>
              ) : (
                <Link href="/auth/login">
                  <Button size="sm" className="btn-primary">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar with glass effect */}
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={`Search ${serviceType === "quick" ? "for instant delivery" : "to schedule later"}...`}
                className="input-field h-12 pl-12 pr-12 bg-background/50 backdrop-blur-sm border-border/50"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-primary/10"
              >
                <Mic className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Service Type Indicator Banner */}
          {serviceType === "schedule" && (
            <div className="pb-4">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Schedule Service Selected</p>
                  <p className="text-xs text-muted-foreground">Choose your preferred delivery time during checkout</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
                >
                  Set Time
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Categories with glass effect */}
      <section className="bg-background/70 backdrop-blur-sm border-b border-border/50">
        <div className="container-max section-padding">
          <div className="flex items-center gap-6 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center gap-2 min-w-[60px] transition-all duration-200 ${
                  selectedCategory === category.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-200 backdrop-blur-sm ${
                    selectedCategory === category.id
                      ? "bg-primary/20 scale-110 border border-primary/30"
                      : "bg-background/50 hover:bg-background/80 border border-border/30"
                  }`}
                >
                  {category.icon}
                </div>
                <span className="text-xs font-medium">{category.name}</span>
                {selectedCategory === category.id && <div className="w-6 h-0.5 bg-primary rounded-full" />}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Banner with enhanced glass effect */}
      <section className="section-padding py-6">
        <div className="container-max">
          <div className="relative h-48 md:h-56 lg:h-64 rounded-2xl overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r ${featuredOffers[currentOfferIndex].color}`}>
              <Image
                src={featuredOffers[currentOfferIndex].image || "/placeholder.svg?height=400&width=800"}
                alt={featuredOffers[currentOfferIndex].title}
                fill
                className="object-cover opacity-20"
                sizes="(max-width: 768px) 100vw, 800px"
                priority={true}
              />
            </div>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
            <div className="relative z-10 p-6 h-full flex flex-col justify-center text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                  {featuredOffers[currentOfferIndex].subtitle}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{featuredOffers[currentOfferIndex].title}</h2>
              <p className="text-sm md:text-base opacity-90">{featuredOffers[currentOfferIndex].description}</p>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-1">
              {featuredOffers.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 backdrop-blur-sm ${
                    index === currentOfferIndex ? "bg-white w-6" : "bg-white/50 w-2"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories Grid with glass cards */}
      <section className="section-padding py-6">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickCategories.map((category) => (
              <div
                key={category.id}
                className={`relative h-32 md:h-36 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200 hover:scale-105 border border-border/30`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`}>
                  <Image
                    src={category.image || "/placeholder.svg?height=200&width=300"}
                    alt={category.title}
                    fill
                    className="object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px] group-hover:backdrop-blur-[1px] transition-all" />
                <div className="relative z-10 p-4 h-full flex flex-col justify-end text-white">
                  <h3 className="text-sm md:text-base font-bold leading-tight">{category.title}</h3>
                  <p className="text-xs opacity-90">{category.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Section with glass cards */}
      <section className="section-padding py-6 bg-background/50 backdrop-blur-sm">
        <div className="container-max">
          <h3 className="text-lg font-bold text-foreground mb-4">OFFERS FOR YOU</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border/50 hover:bg-card/90 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-primary/30">
                  <span className="text-lg">🎁</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Get a FREE Organic Box</p>
                  <p className="text-xs text-muted-foreground">On your first order above ₹249</p>
                </div>
              </div>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border/50 hover:bg-card/90 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-primary/30">
                  <span className="text-lg">🚚</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Enjoy FREE delivery</p>
                  <p className="text-xs text-muted-foreground">On your first 10 orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-padding py-6">
        <div className="container-max">
          <h3 className="text-lg font-bold text-foreground mb-4">
            {selectedCategory === "all" ? "Bestsellers" : categories.find((c) => c.id === selectedCategory)?.name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
            ))}
          </div>
        </div>
      </section>

      {/* Floating Navigation */}
      <FloatingNavigation onQRScannerOpen={() => setIsQRScannerOpen(true)} onCartOpen={() => setIsCartOpen(true)} />

      {/* Add bottom padding to account for floating nav */}
      <div className="h-24" />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Notification Panel */}
      <NotificationPanel isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />

      <QRScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanResult={(qrCode) => console.log("QR Code scanned:", qrCode)}
      />

      {/* Footer */}
      <footer className="bg-muted/30 backdrop-blur-sm border-t border-border/50 mt-12">
        <div className="container-max section-padding py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-foreground font-medium">Developed by Code_Knights</p>
              <p className="text-muted-foreground text-sm">Smart India Hackathon 2025</p>
            </div>
              {/* Removed Trusted by 10,000+ users and Award Winning */}
          </div>
        </div>
      </footer>
    </div>
  )
}
