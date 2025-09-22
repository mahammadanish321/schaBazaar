"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Package, Truck, Clock, Home, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function OrderConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [orderId] = useState(searchParams.get("orderId") || "ORD123456789")

  // Mock order data - in real app, this would be fetched from API
  const orderData = {
    orderId,
    status: "confirmed",
    estimatedDelivery: "20-30 minutes",
    deliveryAddress: "A-101, Green Valley Apartments, Andheri West, Mumbai - 400058",
    paymentMethod: "Cash on Delivery",
    total: 285.0,
    items: [
      {
        id: 1,
        name: "Fresh Tomatoes",
        price: 45,
        unit: "kg",
        quantity: 2,
        farmer: "Rajesh Kumar",
        image: "/fresh-red-tomatoes.jpg",
      },
      {
        id: 2,
        name: "Organic Onions",
        price: 30,
        unit: "kg",
        quantity: 3,
        farmer: "Priya Sharma",
        image: "/organic-white-onions.jpg",
      },
    ],
  }

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please sign in</h2>
          <p className="text-muted-foreground mb-4">You need to be logged in to view order details</p>
          <Button onClick={() => router.push("/auth/login")} className="btn-primary">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-max section-padding py-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your order. We'll deliver fresh products to your doorstep.
            </p>
          </div>

          {/* Order Details */}
          <Card className="card-modern mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order Details</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Order ID:</span>
                    <p className="font-medium">{orderData.orderId}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Estimated Delivery:</span>
                    <p className="font-medium text-primary">{orderData.estimatedDelivery}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <span className="text-muted-foreground text-sm">Delivery Address:</span>
                  <p className="font-medium">{orderData.deliveryAddress}</p>
                </div>

                <div>
                  <span className="text-muted-foreground text-sm">Payment Method:</span>
                  <p className="font-medium">{orderData.paymentMethod}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="card-modern mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderData.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">by {item.farmer}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-muted-foreground">
                          ₹{item.price}/{item.unit} × {item.quantity}
                        </span>
                        <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total Paid:</span>
                  <span className="font-bold text-xl text-primary">₹{orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Timeline */}
          <Card className="card-modern mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Order Confirmed</p>
                    <p className="text-sm text-muted-foreground">Your order has been confirmed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Preparing Order</p>
                    <p className="text-sm text-muted-foreground">Fresh products being packed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Out for Delivery</p>
                    <p className="text-sm text-muted-foreground">Will be delivered soon</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="card-modern mb-6">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Call Support</p>
                    <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">help@sacchabazaar.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push("/")} className="flex-1 bg-transparent">
              <Home className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
            <Button onClick={() => router.push("/orders")} className="flex-1 btn-primary">
              <Clock className="h-4 w-4 mr-2" />
              Track Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
