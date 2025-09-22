"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Image from "next/image"

// Dummy data structure for demonstration
const productHistory = {
  id: 1,
  name: "Fresh Tomatoes",
  image: "/fresh-red-tomatoes.jpg",
  farmer: {
    name: "Rajesh Kumar",
    location: "Lucknow, UP",
    earnings: 4500,
  },
  sales: [
    {
      date: "2025-09-01",
      buyerType: "Aggregator",
      buyerName: "Amit Singh",
      amount: 1200,
      location: "Kanpur, UP",
    },
    {
      date: "2025-09-10",
      buyerType: "Customer",
      buyerName: "Priya Sharma",
      amount: 300,
      location: "Lucknow, UP",
    },
  ],
}

export default function ProductTrackingPage() {
  const router = useRouter()
  const params = useSearchParams()
  // In real app, fetch product history by params.get('id')

  return (
    <div className="container-max section-padding py-8">
      {/* Logo at the top */}
      <div className="flex justify-center mb-6">
        <Image src="/favicon.ico" alt="SacchaBazaar Logo" width={80} height={80} className="rounded-full shadow-lg" />
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Image src={productHistory.image} alt={productHistory.name} width={48} height={48} className="rounded" />
            {productHistory.name}
            <Badge variant="outline" className="ml-2">ID: {productHistory.id}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-1">Farmer Details</h3>
            <p>Name: {productHistory.farmer.name}</p>
            <p>Location: {productHistory.farmer.location}</p>
            <p>Earnings: ₹{productHistory.farmer.earnings}</p>
          </div>
          <Separator />
          <div className="mt-4">
            <h3 className="font-semibold text-lg mb-2">Sales History</h3>
            {productHistory.sales.map((sale, idx) => (
              <Card key={idx} className="mb-3">
                <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <p className="font-medium">{sale.buyerType}: {sale.buyerName}</p>
                    <p className="text-sm text-muted-foreground">Location: {sale.location}</p>
                  </div>
                  <div>
                    <p className="text-sm">Date: {sale.date}</p>
                    <Badge variant="secondary">Paid: ₹{sale.amount}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
