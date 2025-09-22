"use client"

import { useState } from "react"
import { ShoppingCart, Heart, Star, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onBuyNow: (product: Product) => void
}

export function ProductCard({ product, onAddToCart, onBuyNow }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API call
    onAddToCart({ ...product, quantity })
    setIsAdding(false)
  }

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 group">
      <div className="aspect-square relative">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Stock badge */}
        {product.stock < 50 && (
          <Badge className="absolute top-2 right-2 font-bold bg-destructive text-destructive-foreground text-xs">
            {product.stock} left
          </Badge>
        )}

        {/* Organic badge */}
        {product.organic && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground font-bold text-xs">Organic</Badge>
        )}

        {/* Like button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-background/80 hover:bg-background w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
      </div>

      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Product name and rating */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight">{product.name}</h4>
            {product.rating && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{product.rating}</span>
              </div>
            )}
          </div>

          {/* Farmer name */}
          <p className="text-muted-foreground text-xs">by {product.farmer}</p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">₹{product.price}</span>
              <span className="text-xs text-muted-foreground">per {product.unit}</span>
            </div>

            {/* Quantity selector for larger screens */}
            <div className="hidden sm:flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-6 w-6 p-0 border-muted-foreground/20"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-xs font-medium w-6 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="h-6 w-6 p-0 border-muted-foreground/20"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <Button
              className="flex-1 h-8 text-xs font-medium bg-primary hover:bg-primary/90"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <div className="w-3 h-3 border border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Add
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-8 text-xs font-medium border-primary/20 text-primary hover:bg-primary/5 bg-transparent"
              onClick={() => onBuyNow({ ...product, quantity })}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
