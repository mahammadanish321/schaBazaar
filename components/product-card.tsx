"use client"

import type React from "react"
import { useState, memo } from "react"
import { ShoppingCart, Heart, Star, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Product {
  id: number
  name: string
  price: number
  unit: string
  farmer: string
  stock: number
  image: string
  category: string
  rating?: number
  reviews?: number
  organic?: boolean
  quantity?: number // Added to fix type error
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onBuyNow: (product: Product) => void
}

export const ProductCard = memo(function ProductCard({ product, onAddToCart, onBuyNow }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    if (isAdding) return
    setIsAdding(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    onAddToCart({ ...product, quantity })
    setIsAdding(false)
  }

  const handleBuyNow = () => {
    onBuyNow({ ...product, quantity })
  }

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 group bg-card backdrop-blur-sm hover:scale-[1.02]">
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          priority={false}
        />

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Stock badge with improved styling */}
        {product.stock < 50 && (
          <Badge className="absolute top-3 right-3 font-bold bg-destructive text-destructive-foreground text-xs z-10 shadow-lg">
            {product.stock} left
          </Badge>
        )}

        {/* Organic badge with improved styling */}
        {product.organic && (
          <Badge className="absolute top-3 left-3 bg-green-600 text-white font-bold text-xs z-10 shadow-lg">
            Organic
          </Badge>
        )}

        {/* Like button with improved positioning */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/90 hover:bg-white w-9 h-9 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 shadow-lg"
          onClick={handleLikeToggle}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
        </Button>
      </div>

      <CardContent className="p-4 bg-card">
        <div className="space-y-3">
          {/* Product name and rating */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight flex-1">{product.name}</h4>
            {product.rating && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium text-muted-foreground">{product.rating}</span>
              </div>
            )}
          </div>

          {/* Farmer name */}
          <p className="text-muted-foreground text-xs">by {product.farmer}</p>

          {/* Price section with improved layout */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">₹{product.price}</span>
              <span className="text-xs text-muted-foreground">per {product.unit}</span>
            </div>

            {/* Quantity selector with improved styling */}
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-7 w-7 hover:bg-background"
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-medium w-8 text-center bg-background rounded px-2 py-1">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="h-7 w-7 hover:bg-background"
                disabled={quantity >= product.stock}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Action buttons with improved styling and layout */}
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 h-10 text-sm font-medium bg-primary hover:bg-primary/90 shadow-sm"
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
            >
              {isAdding ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-10 text-sm font-medium border-primary/30 text-primary hover:bg-primary/10 bg-transparent shadow-sm"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </Button>
          </div>

          {/* Stock indicator */}
          {product.stock === 0 && (
            <div className="text-center py-2">
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
})
