"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, ArrowLeft, Leaf, User, Tractor, Building, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    userType: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { login } = useAuth()
  const router = useRouter()

  const userTypes = [
    { value: "customer", label: "Customer", icon: User, description: "Buy fresh produce directly from farmers" },
    { value: "farmer", label: "Farmer", icon: Tractor, description: "Sell your harvest to customers" },
    { value: "aggregator", label: "Aggregator", icon: Building, description: "Manage supply chain and distribution" },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required"
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    if (!formData.userType) newErrors.userType = "Please select your role"

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
        userType: formData.userType as "customer" | "farmer" | "aggregator",
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        mobile: formData.mobile,
        isVerified: false,
        createdAt: new Date().toISOString(),
      }
      login(userData)
      setIsLoading(false)
      router.push("/")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center section-padding py-8">
      <div className="w-full max-w-lg animate-fade-in-up">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">SacchaBazaar</h1>
          </div>
          <p className="text-muted-foreground text-sm">Join the agricultural marketplace community</p>
        </div>

        <Card className="card-modern border-2">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold">Create Account</CardTitle>
            <CardDescription>Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">I am a</Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value) => {
                    setFormData({ ...formData, userType: value })
                    if (errors.userType) setErrors({ ...errors, userType: "" })
                  }}
                >
                  <SelectTrigger className={`input-field h-12 ${errors.userType ? "border-destructive" : ""}`}>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="py-3">
                        <div className="flex items-center gap-3">
                          <type.icon className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.userType && (
                  <div className="flex items-center gap-1 text-destructive text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors.userType}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => {
                      setFormData({ ...formData, firstName: e.target.value })
                      if (errors.firstName) setErrors({ ...errors, firstName: "" })
                    }}
                    className={`input-field h-12 ${errors.firstName ? "border-destructive" : ""}`}
                    required
                  />
                  {errors.firstName && (
                    <div className="flex items-center gap-1 text-destructive text-xs">
                      <AlertCircle className="w-3 h-3" />
                      {errors.firstName}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => {
                      setFormData({ ...formData, lastName: e.target.value })
                      if (errors.lastName) setErrors({ ...errors, lastName: "" })
                    }}
                    className={`input-field h-12 ${errors.lastName ? "border-destructive" : ""}`}
                    required
                  />
                  {errors.lastName && (
                    <div className="flex items-center gap-1 text-destructive text-xs">
                      <AlertCircle className="w-3 h-3" />
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>

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
                <Label htmlFor="mobile" className="text-sm font-medium">
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={formData.mobile}
                  onChange={(e) => {
                    setFormData({ ...formData, mobile: e.target.value })
                    if (errors.mobile) setErrors({ ...errors, mobile: "" })
                  }}
                  className={`input-field h-12 ${errors.mobile ? "border-destructive" : ""}`}
                  required
                />
                {errors.mobile && (
                  <div className="flex items-center gap-1 text-destructive text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors.mobile}
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
                    placeholder="Create a password"
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
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value })
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" })
                    }}
                    className={`input-field h-12 pr-12 ${errors.confirmPassword ? "border-destructive" : ""}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-1 text-destructive text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <Button type="submit" className="btn-primary w-full h-12 text-base" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
