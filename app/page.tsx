"use client"

import { useState, useEffect } from "react"
import { Search, QrCode, Home, Grid3X3, ShoppingCart, User, Plus, MapPin, ChevronDown, Mic, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import { CartSidebar } from "@/components/cart-sidebar"
import { QRScanner } from "@/components/qr-scanner"
import { NotificationPanel } from "@/components/notification-panel"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useNotifications } from "@/contexts/notification-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % featuredOffers.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

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

  const filteredProducts =
    selectedCategory === "all" ? mockProducts : mockProducts.filter((product) => product.category === selectedCategory)

  const totalCartItems = getTotalItems()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container-max section-padding">
          <div className="flex items-center justify-between py-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg font-bold text-foreground">SacchaBazaar</h1>
                {user && (
                  <Badge variant="secondary" className="text-xs capitalize">
                    {user.userType}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Delivery in 20 minutes</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>Baruipur Station Road</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Button size="sm" variant="ghost" className="relative" onClick={() => setIsNotificationOpen(true)}>
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center p-0">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                  {user.userType === "farmer" && (
                    <Button size="sm" variant="outline" onClick={() => router.push("/farmer/products")}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                  {user.userType === "aggregator" && (
                    <Button size="sm" variant="outline" onClick={() => router.push("/aggregator/products")}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => router.push("/profile")}>
                    <User className="w-4 h-4" />
                  </Button>
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

          {/* Search Bar */}
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search 'organic vegetables', 'fresh fruits'..."
                className="input-field h-12 pl-12 pr-12 bg-muted/50"
              />
              <Button size="sm" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2">
                <Mic className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      <section className="bg-background border-b border-border">
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
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-200 ${
                    selectedCategory === category.id ? "bg-primary/10 scale-110" : "bg-muted/50 hover:bg-muted"
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

      {/* Featured Banner */}
      <section className="section-padding py-6">
        <div className="container-max">
          <div className="relative h-48 md:h-56 lg:h-64 rounded-2xl overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r ${featuredOffers[currentOfferIndex].color}`}>
              <img
                src={featuredOffers[currentOfferIndex].image || "/placeholder.svg"}
                alt={featuredOffers[currentOfferIndex].title}
                className="w-full h-full object-cover opacity-20"
              />
            </div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-center text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
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
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentOfferIndex ? "bg-white w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories Grid */}
      <section className="section-padding py-6">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickCategories.map((category) => (
              <div
                key={category.id}
                className={`relative h-32 md:h-36 rounded-2xl overflow-hidden cursor-pointer group transition-transform duration-200 hover:scale-105`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`}>
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                  />
                </div>
                <div className="relative z-10 p-4 h-full flex flex-col justify-end text-white">
                  <h3 className="text-sm md:text-base font-bold leading-tight">{category.title}</h3>
                  <p className="text-xs opacity-90">{category.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="section-padding py-6 bg-muted/30">
        <div className="container-max">
          <h3 className="text-lg font-bold text-foreground mb-4">OFFERS FOR YOU</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎁</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Get a FREE Organic Box</p>
                  <p className="text-xs text-muted-foreground">On your first order above ₹249</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="container-max section-padding">
          <div className="flex items-center justify-around py-2 relative">
            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 text-foreground hover:text-primary min-w-[60px]"
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">Home</span>
            </Button>

            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary min-w-[60px]"
              onClick={() => router.push("/categories")}
            >
              <Grid3X3 className="w-5 h-5" />
              <span className="text-xs font-medium">Categories</span>
            </Button>

            <div className="relative -top-6">
              <Button
                size="lg"
                className="rounded-full h-16 w-16 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                onClick={() => setIsQRScannerOpen(true)}
              >
                <QrCode className="w-8 h-8" />
              </Button>
            </div>

            <Button
              variant="ghost"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary relative min-w-[60px]"
              onClick={() => setIsCartOpen(true)}
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
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary min-w-[60px]"
              onClick={() => router.push("/profile")}
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Profile</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="h-20" />

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
    </div>
  )
}
