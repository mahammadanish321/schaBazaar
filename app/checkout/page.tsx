"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, MapPin, CreditCard, Truck, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"

const deliverySlots = [
  { id: "morning", label: "Morning (8 AM - 12 PM)", available: true },
  { id: "afternoon", label: "Afternoon (12 PM - 4 PM)", available: true },
  { id: "evening", label: "Evening (4 PM - 8 PM)", available: false },
]

const paymentMethods = [
  { id: "cod", label: "Cash on Delivery", icon: "💵", available: true },
  { id: "upi", label: "UPI Payment", icon: "📱", available: true },
  { id: "card", label: "Credit/Debit Card", icon: "💳", available: true },
  { id: "wallet", label: "Digital Wallet", icon: "👛", available: true },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { cartItems, getTotalPrice, getDeliveryFee, getFinalTotal, clearCart } = useCart()
  const [selectedAddress, setSelectedAddress] = useState("home")
  const [selectedSlot, setSelectedSlot] = useState("morning")
  const [selectedPayment, setSelectedPayment] = useState("cod")
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderNotes, setOrderNotes] = useState("")

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    } else if (cartItems.length === 0) {
      router.push("/")
    }
  }, [user, cartItems, router])

  if (!user || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">{!user ? "Please sign in" : "Your cart is empty"}</h2>
          <p className="text-muted-foreground mb-4">
            {!user ? "You need to be logged in to checkout" : "Add some products to continue"}
          </p>
          <Button onClick={() => router.push(!user ? "/auth/login" : "/")} className="btn-primary">
            {!user ? "Sign In" : "Continue Shopping"}
          </Button>
        </div>
      </div>
    )
  }

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const orderData = {
      items: cartItems,
      address: selectedAddress,
      deliverySlot: selectedSlot,
      paymentMethod: selectedPayment,
      notes: orderNotes,
      total: getFinalTotal(),
      orderId: `ORD${Date.now()}`,
    }

    console.log("Order placed:", orderData)
    clearCart()
    router.push(`/order-confirmation?orderId=${orderData.orderId}`)
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container-max section-padding">
          <div className="flex items-center gap-4 py-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Checkout</h1>
              <p className="text-sm text-muted-foreground">{totalItems} items in your cart</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container-max section-padding py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                      <RadioGroupItem value="home" id="home" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="home" className="font-medium cursor-pointer">
                          Home
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          A-101, Green Valley Apartments, Andheri West, Mumbai - 400058
                        </p>
                        <Badge className="mt-2 text-xs">Default</Badge>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                      <RadioGroupItem value="office" id="office" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="office" className="font-medium cursor-pointer">
                          Office
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Office 205, Business Hub, Bandra Kurla Complex, Mumbai - 400051
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  + Add New Address
                </Button>
              </CardContent>
            </Card>

            {/* Delivery Time */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Delivery Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedSlot} onValueChange={setSelectedSlot}>
                  <div className="space-y-3">
                    {deliverySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`flex items-center space-x-3 p-3 border rounded-lg ${
                          slot.available ? "border-border" : "border-border bg-muted/30"
                        }`}
                      >
                        <RadioGroupItem value={slot.id} id={slot.id} disabled={!slot.available} />
                        <div className="flex-1">
                          <Label
                            htmlFor={slot.id}
                            className={`font-medium cursor-pointer ${!slot.available ? "text-muted-foreground" : ""}`}
                          >
                            {slot.label}
                          </Label>
                          {!slot.available && <p className="text-xs text-muted-foreground mt-1">Not available today</p>}
                        </div>
                        {slot.available && selectedSlot === slot.id && (
                          <Badge className="bg-primary/10 text-primary border-primary/20">Selected</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`flex items-center space-x-3 p-3 border rounded-lg ${
                          method.available ? "border-border" : "border-border bg-muted/30"
                        }`}
                      >
                        <RadioGroupItem value={method.id} id={method.id} disabled={!method.available} />
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-lg">{method.icon}</span>
                          <Label
                            htmlFor={method.id}
                            className={`font-medium cursor-pointer ${!method.available ? "text-muted-foreground" : ""}`}
                          >
                            {method.label}
                          </Label>
                        </div>
                        {method.available && selectedPayment === method.id && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Special Instructions (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any special instructions for delivery..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={3}
                  className="input-field"
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="card-modern sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">by {item.farmer}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">
                              ₹{item.price}/{item.unit} × {item.quantity}
                            </span>
                            <span className="font-medium text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Bill Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                      <span className="font-medium">₹{getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span className={`font-medium ${getDeliveryFee() === 0 ? "text-green-600" : ""}`}>
                        {getDeliveryFee() === 0 ? "FREE" : `₹${getDeliveryFee()}`}
                      </span>
                    </div>
                    {getDeliveryFee() === 0 && (
                      <p className="text-xs text-green-600">🎉 Free delivery on orders above ₹249</p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-xl text-primary">₹{getFinalTotal().toFixed(2)}</span>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-primary" />
                      <span className="font-medium">Delivery in 20-30 minutes</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Fresh products delivered to your doorstep</p>
                  </div>

                  <Button
                    className="w-full font-bold text-base py-6 btn-primary"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Placing Order...
                      </div>
                    ) : (
                      `Place Order • ₹${getFinalTotal().toFixed(2)}`
                    )}
                  </Button>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="h-3 w-3" />
                    <span>By placing order, you agree to our terms & conditions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
