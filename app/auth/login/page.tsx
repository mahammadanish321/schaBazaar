"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, ArrowLeft, Leaf, AlertCircle, MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressData, setAddressData] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    type: "Home",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { login } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    setTimeout(() => {
      const userData = {
        id: `user_${Date.now()}`,
        email: formData.email,
        userType: "customer" as const,
        firstName: "John",
        lastName: "Doe",
        name: "John Doe",
        mobile: "9876543210",
        isVerified: true,
        createdAt: new Date().toISOString(),
        address: showAddressForm ? addressData : null,
      }
      login(userData)
      setIsLoading(false)
      router.push("/")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center section-padding">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Get Started</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">SacchaBazaar</h1>
          </div>
          <p className="text-muted-foreground text-sm">Welcome back to your agricultural marketplace</p>
        </div>

        <Card className="glass-card border-2 border-border/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    if (errors.email) setErrors({ ...errors, email: "" })
                  }}
                  className={`input-field h-12 ${errors.email ? "border-destructive" : ""}`}
                  required
                />
                {errors.email && (
                  <div className="flex items-center gap-1 text-destructive text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      if (errors.password) setErrors({ ...errors, password: "" })
                    }}
                    className={`input-field h-12 pr-12 ${errors.password ? "border-destructive" : ""}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1 text-destructive text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="address"
                    checked={showAddressForm}
                    onCheckedChange={(checked) => setShowAddressForm(checked as boolean)}
                  />
                  <Label htmlFor="address" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Add delivery address (optional)
                  </Label>
                </div>

                {showAddressForm && (
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/30">
                    <div>
                      <Label htmlFor="addressType" className="text-sm">
                        Address Type
                      </Label>
                      <Select
                        value={addressData.type}
                        onValueChange={(value) => setAddressData({ ...addressData, type: value })}
                      >
                        <SelectTrigger className="mt-1 h-10">
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
                      <Label htmlFor="street" className="text-sm">
                        Street Address
                      </Label>
                      <Textarea
                        id="street"
                        placeholder="Enter your street address"
                        value={addressData.street}
                        onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                        className="mt-1 min-h-[60px]"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="city" className="text-sm">
                          City
                        </Label>
                        <Input
                          id="city"
                          placeholder="City"
                          value={addressData.city}
                          onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                          className="mt-1 h-10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-sm">
                          State
                        </Label>
                        <Input
                          id="state"
                          placeholder="State"
                          value={addressData.state}
                          onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                          className="mt-1 h-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="pincode" className="text-sm">
                        Pincode
                      </Label>
                      <Input
                        id="pincode"
                        placeholder="Enter pincode"
                        value={addressData.pincode}
                        onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                        className="mt-1 h-10"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm font-medium cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit" className="btn-primary w-full h-12 text-base" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
