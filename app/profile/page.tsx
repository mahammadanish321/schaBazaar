"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Edit, Phone, Mail, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { renderCustomerProfile, renderFarmerProfile, renderAggregatorProfile } from "./profile-utils" // Assuming these functions are declared in a separate file

const mockUserProfiles = {
  customer: {
    totalOrders: 24,
    totalSpent: 12450,
    favoriteProducts: 8,
    loyaltyPoints: 1250,
    joinDate: "March 2024",
    addresses: [
      {
        id: 1,
        type: "Home",
        address: "A-101, Green Valley Apartments, Andheri West, Mumbai - 400058",
        isDefault: true,
      },
      {
        id: 2,
        type: "Office",
        address: "Office 205, Business Hub, Bandra Kurla Complex, Mumbai - 400051",
        isDefault: false,
      },
    ],
    recentOrders: [
      { id: 1, date: "2024-01-15", items: 5, total: 450, status: "Delivered" },
      { id: 2, date: "2024-01-10", items: 3, total: 280, status: "Delivered" },
      { id: 3, date: "2024-01-05", items: 7, total: 620, status: "In Transit" },
    ],
  },
  farmer: {
    farmSize: "5.2 acres",
    totalProducts: 12,
    totalSales: 45600,
    rating: 4.7,
    reviews: 89,
    joinDate: "January 2024",
    certifications: ["Organic", "Fair Trade"],
    products: [
      { id: 1, name: "Organic Tomatoes", stock: 150, price: 45, sales: 89 },
      { id: 2, name: "Fresh Onions", stock: 200, price: 30, sales: 156 },
      { id: 3, name: "Green Spinach", stock: 80, price: 25, sales: 67 },
    ],
    monthlyEarnings: [
      { month: "Jan", earnings: 15200 },
      { month: "Feb", earnings: 18400 },
      { month: "Mar", earnings: 12000 },
    ],
  },
  aggregator: {
    partneredFarmers: 45,
    totalVolume: 125000,
    regionsServed: 8,
    commission: 8.5,
    joinDate: "February 2024",
    topFarmers: [
      { name: "Rajesh Kumar", volume: 12500, rating: 4.7 },
      { name: "Sunita Devi", volume: 10800, rating: 4.5 },
      { name: "Ramesh Patel", volume: 9200, rating: 4.6 },
    ],
    monthlyVolume: [
      { month: "Jan", volume: 42000 },
      { month: "Feb", volume: 38500 },
      { month: "Mar", volume: 44500 },
    ],
  },
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuth() // Use auth context
  const [isEditing, setIsEditing] = useState(false)

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
          <p className="text-muted-foreground mb-4">You need to be logged in to view your profile</p>
          <Button onClick={() => router.push("/auth/login")}>Sign In</Button>
        </div>
      </div>
    )
  }

  const profileData = mockUserProfiles[user.userType]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleBack = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container-max section-padding">
          <div className="flex items-center gap-4 py-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Profile</h1>
          </div>
        </div>
      </header>

      <div className="container-max section-padding py-6">
        <Card className="card-modern mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder.svg" alt={user.name} />
                <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary border-primary/20">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                    <Badge className="mb-2 capitalize bg-primary/10 text-primary border-primary/20">
                      {user.userType}
                    </Badge>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      {user.mobile && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{user.mobile}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-2">Member since {profileData.joinDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {user.userType === "customer" && renderCustomerProfile(profileData)}
        {user.userType === "farmer" && renderFarmerProfile(profileData)}
        {user.userType === "aggregator" && renderAggregatorProfile(profileData)}

        <Card className="card-modern mt-6">
          <CardContent className="p-4">
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
