"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  Settings,
  LogOut,
  Camera,
  MapPin,
  Plus,
  Trash2,
  Home,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { renderCustomerProfile, renderFarmerProfile, renderAggregatorProfile } from "./profile-utils"

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
  const { user, logout } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState<string>("")
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    bio: "",
  })
  const [addresses, setAddresses] = useState<any[]>([])
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({
    type: "Home",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    setEditedProfile({
      name: user.name || "",
      email: user.email || "",
      mobile: user.mobile || "",
      bio: "",
    })

    const profileData = mockUserProfiles[user.userType]
    if (profileData && "addresses" in profileData) {
      setAddresses(profileData.addresses)
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    // Here you would typically save to backend
    console.log("Saving profile:", editedProfile)
    setIsEditing(false)
  }

  const handleAddAddress = () => {
    const fullAddress = `${newAddress.street}, ${newAddress.city}, ${newAddress.state} - ${newAddress.pincode}`
    const address = {
      id: Date.now(),
      type: newAddress.type,
      address: fullAddress,
      isDefault: addresses.length === 0,
    }
    setAddresses([...addresses, address])
    setNewAddress({
      type: "Home",
      street: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
    })
    setIsAddingAddress(false)
  }

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))
  }

  const handleSetDefaultAddress = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    )
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleBack = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with glass effect */}
      <header className="sticky top-0 z-40 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="container-max section-padding">
          <div className="flex items-center gap-4 py-4">
            <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-primary/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Profile</h1>
          </div>
        </div>
      </header>

      <div className="container-max section-padding py-6">
        {/* Profile Card with glass effect */}
        <Card className="glass-card mb-6 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={profileImage || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary border-primary/20">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border-border/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={editedProfile.name}
                              onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={editedProfile.email}
                              onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="mobile">Mobile</Label>
                            <Input
                              id="mobile"
                              value={editedProfile.mobile}
                              onChange={(e) => setEditedProfile({ ...editedProfile, mobile: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={editedProfile.bio}
                            onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90">
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
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
                        <p className="text-sm text-muted-foreground mt-2">Member since {profileData.joinDate}</p>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="glass-button">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card mb-6 border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Delivery Addresses
              </CardTitle>
              <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="addressType">Address Type</Label>
                      <Select
                        value={newAddress.type}
                        onValueChange={(value) => setNewAddress({ ...newAddress, type: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Home">Home</SelectItem>
                          <SelectItem value="Office">Office</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="street">Street Address</Label>
                      <Textarea
                        id="street"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="landmark">Landmark</Label>
                        <Input
                          id="landmark"
                          value={newAddress.landmark}
                          onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleAddAddress} className="flex-1 bg-primary hover:bg-primary/90">
                        Add Address
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingAddress(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="flex items-start gap-3 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30"
                >
                  <div className="flex-shrink-0 mt-1">
                    {address.type === "Home" ? (
                      <Home className="w-5 h-5 text-primary" />
                    ) : (
                      <Building2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{address.type}</span>
                      {address.isDefault && (
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{address.address}</p>
                    <div className="flex gap-2 mt-2">
                      {!address.isDefault && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSetDefaultAddress(address.id)}
                          className="text-xs h-7"
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-xs h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {addresses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No addresses added yet</p>
                  <p className="text-sm">Add your delivery address for better service</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Existing profile sections */}
        {user.userType === "customer" && renderCustomerProfile(profileData)}
        {user.userType === "farmer" && renderFarmerProfile(profileData)}
        {user.userType === "aggregator" && renderAggregatorProfile(profileData)}

        {/* Logout Card with glass effect */}
        <Card className="glass-card mt-6 border-border/50">
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
