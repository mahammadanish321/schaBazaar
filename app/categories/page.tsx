"use client"

import { useState } from "react"
import { ArrowLeft, Search, Filter, Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

// Mock categories data
const categories = [
  {
    id: "vegetables",
    name: "Vegetables",
    icon: "🥬",
    count: 45,
    image: "/fresh-vegetables-market-display.jpg",
  },
  {
    id: "fruits",
    name: "Fruits",
    icon: "🍎",
    count: 32,
    image: "/fresh-fruits-market-display.jpg",
  },
  {
    id: "grains",
    name: "Grains & Cereals",
    icon: "🌾",
    count: 28,
    image: "/grains-and-cereals-market.jpg",
  },
  {
    id: "dairy",
    name: "Dairy Products",
    icon: "🥛",
    count: 18,
    image: "/dairy-products-farm-fresh.jpg",
  },
  {
    id: "spices",
    name: "Spices & Herbs",
    icon: "🌶️",
    count: 24,
    image: "/indian-spices-and-herbs.jpg",
  },
  {
    id: "pulses",
    name: "Pulses & Lentils",
    icon: "🫘",
    count: 21,
    image: "/pulses-and-lentils-variety.jpg",
  },
]

// Mock products data with categories
const allProducts = [
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
    farmer: "Kashmir Orchards",
    stock: 85,
    image: "/fresh-red-apples.png",
    category: "fruits",
    rating: 4.6,
    reviews: 34,
    organic: true,
  },
  {
    id: 8,
    name: "Organic Bananas",
    price: 40,
    unit: "dozen",
    farmer: "Tamil Nadu Farms",
    stock: 150,
    image: "/organic-bananas-bunch.jpg",
    category: "fruits",
    rating: 4.3,
    reviews: 28,
    organic: true,
  },
  {
    id: 9,
    name: "Basmati Rice",
    price: 85,
    unit: "kg",
    farmer: "Punjab Grains",
    stock: 200,
    image: "/basmati-rice-grains.jpg",
    category: "grains",
    rating: 4.8,
    reviews: 56,
    organic: false,
  },
  {
    id: 10,
    name: "Organic Wheat",
    price: 35,
    unit: "kg",
    farmer: "Haryana Fields",
    stock: 300,
    image: "/organic-wheat-grains.jpg",
    category: "grains",
    rating: 4.4,
    reviews: 42,
    organic: true,
  },
]

export default function CategoriesPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [showOrganic, setShowOrganic] = useState(false)
  const [showInStock, setShowInStock] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])

  const handleBack = () => {
    router.push("/")
  }

  const handleAddToCart = (product: any) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item,
        )
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }]
    })
  }

  const handleBuyNow = (product: any) => {
    handleAddToCart(product)
    // Navigate to cart or checkout
  }

  // Filter and sort products
  const filteredProducts = allProducts
    .filter((product) => {
      if (selectedCategory && product.category !== selectedCategory) return false
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false
      if (showOrganic && !product.organic) return false
      if (showInStock && product.stock === 0) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const resetFilters = () => {
    setSelectedCategory(null)
    setSearchQuery("")
    setSortBy("name")
    setPriceRange([0, 200])
    setShowOrganic(false)
    setShowInStock(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack} className="text-primary-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-primary-foreground">
              {selectedCategory ? categories.find((c) => c.id === selectedCategory)?.name : "Categories"}
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Category Selection */}
        {!selectedCategory && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Browse Categories</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-0">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-3xl mb-2">{category.icon}</div>
                        <h3 className="font-bold text-lg">{category.name}</h3>
                        <p className="text-sm opacity-90">{category.count} products</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Products View */}
        {selectedCategory && (
          <div className="space-y-6">
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                {/* Filter Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Products</SheetTitle>
                      <SheetDescription>Refine your search with these filters</SheetDescription>
                    </SheetHeader>

                    <div className="space-y-6 mt-6">
                      {/* Price Range */}
                      <div>
                        <label className="text-sm font-medium mb-3 block">
                          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                        </label>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={200}
                          min={0}
                          step={5}
                          className="w-full"
                        />
                      </div>

                      {/* Organic Filter */}
                      <div className="flex items-center space-x-2">
                        <Checkbox id="organic" checked={showOrganic} onCheckedChange={setShowOrganic} />
                        <label htmlFor="organic" className="text-sm font-medium">
                          Organic Products Only
                        </label>
                      </div>

                      {/* In Stock Filter */}
                      <div className="flex items-center space-x-2">
                        <Checkbox id="instock" checked={showInStock} onCheckedChange={setShowInStock} />
                        <label htmlFor="instock" className="text-sm font-medium">
                          In Stock Only
                        </label>
                      </div>

                      <Button onClick={resetFilters} variant="outline" className="w-full bg-transparent">
                        Reset Filters
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* View Mode Toggle */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(showOrganic || showInStock || priceRange[0] > 0 || priceRange[1] < 200) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {showOrganic && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setShowOrganic(false)}>
                    Organic ×
                  </Badge>
                )}
                {showInStock && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setShowInStock(false)}>
                    In Stock ×
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 200) && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setPriceRange([0, 200])}>
                    ₹{priceRange[0]} - ₹{priceRange[1]} ×
                  </Badge>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{filteredProducts.length} products found</p>
              <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
                ← Back to Categories
              </Button>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length > 0 ? (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-primary mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={resetFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
