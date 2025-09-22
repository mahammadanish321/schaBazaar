"use client"
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface CartItem {
  id: number
  name: string
  price: number
  unit: string
  farmer: string
  image: string
  quantity: number
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemoveItem: (id: number) => void
  onCheckout: () => void
}

export function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartSidebarProps) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = totalPrice > 249 ? 0 : 25
  const finalTotal = totalPrice + deliveryFee

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-xl animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">My Cart</h2>
              {totalItems > 0 && <Badge className="bg-primary text-primary-foreground font-bold">{totalItems}</Badge>}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 px-4">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground">Add some fresh products to get started</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {cartItems.map((item) => (
                  <Card key={item.id} className="border-border/50">
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="relative">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-sm text-foreground line-clamp-1">{item.name}</h4>
                              <p className="text-xs text-muted-foreground">by {item.farmer}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-bold text-sm text-foreground">
                                  ₹{item.price}/{item.unit}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveItem(item.id)}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                className="h-6 w-6 p-0 border-muted-foreground/20"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="h-6 w-6 p-0 border-muted-foreground/20"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="font-bold text-sm text-primary">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-border bg-muted/30">
              <div className="p-4 space-y-3">
                {/* Bill Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className={`font-medium ${deliveryFee === 0 ? "text-green-600" : ""}`}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {deliveryFee === 0 && <p className="text-xs text-green-600">🎉 Free delivery on orders above ₹249</p>}
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total:</span>
                  <span className="font-bold text-xl text-primary">₹{finalTotal.toFixed(2)}</span>
                </div>
                <Button className="w-full font-bold text-base py-6 bg-primary hover:bg-primary/90" onClick={onCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
