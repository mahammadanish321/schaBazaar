"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  userType: "customer" | "farmer" | "aggregator"
  firstName: string
  lastName: string
  name: string
  mobile: string
  avatar?: string
  isVerified: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        if (parsedUser && parsedUser.email) {
          // Migrate old user data format to new format
          const migratedUser: User = {
            id: parsedUser.id || `user_${Date.now()}`,
            email: parsedUser.email,
            userType: parsedUser.userType || "customer",
            firstName: parsedUser.firstName || parsedUser.name?.split(" ")[0] || "User",
            lastName: parsedUser.lastName || parsedUser.name?.split(" ").slice(1).join(" ") || "",
            name: parsedUser.name || `${parsedUser.firstName || "User"} ${parsedUser.lastName || ""}`.trim(),
            mobile: parsedUser.mobile || "",
            avatar: parsedUser.avatar,
            isVerified: parsedUser.isVerified || false,
            createdAt: parsedUser.createdAt || new Date().toISOString(),
          }
          setUser(migratedUser)
          // Update localStorage with migrated data
          localStorage.setItem("user", JSON.stringify(migratedUser))
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    const enhancedUser: User = {
      ...userData,
      id: userData.id || `user_${Date.now()}`,
      name: userData.name || `${userData.firstName} ${userData.lastName}`.trim(),
      isVerified: userData.isVerified || false,
      createdAt: userData.createdAt || new Date().toISOString(),
    }
    setUser(enhancedUser)
    localStorage.setItem("user", JSON.stringify(enhancedUser))
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      if (userData.firstName || userData.lastName) {
        updatedUser.name = `${updatedUser.firstName} ${updatedUser.lastName}`.trim()
      }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
