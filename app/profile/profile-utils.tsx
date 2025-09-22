import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ShoppingBag,
  Heart,
  MapPin,
  Package,
  TrendingUp,
  Star,
  Award,
  Tractor,
  Users,
  BarChart3,
  Plus,
  QrCode,
} from "lucide-react"
import Link from "next/link"

// Customer Profile Component
export function renderCustomerProfile(profileData: any) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-modern">
          <CardContent className="p-4 text-center">
            <ShoppingBag className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{profileData.totalOrders}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card className="card-modern">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">₹{profileData.totalSpent.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </CardContent>
        </Card>
        <Card className="card-modern">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{profileData.favoriteProducts}</p>
            <p className="text-sm text-muted-foreground">Favorites</p>
          </CardContent>
        </Card>
        <Card className="card-modern">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{profileData.loyaltyPoints}</p>
            <p className="text-sm text-muted-foreground">Points</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profileData.recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.date} • {order.items} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{order.total}</p>
                  <Badge variant={order.status === "Delivered" ? "default" : "secondary"} className="text-xs">
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Saved Addresses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profileData.addresses.map((address: any) => (
              <div key={address.id} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{address.type}</Badge>
                      {address.isDefault && <Badge className="text-xs">Default</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{address.address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Farmer Profile Component
export function renderFarmerProfile(profileData: any) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-modern">
          <CardContent className="p-4 text-center">
            <Tractor className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{profileData.farmSize}</p>
            <p className="text-sm text-muted-foreground">Farm Size</p>
          </CardContent>
        </Card>
        <Card className="card-modern">
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{profileData.totalProducts}</p>
            <p className="text-sm text-muted-foreground">Products</p>
          </CardContent>
        </Card>
        <Card className="card-modern">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">₹{profileData.totalSales.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Sales</p>
          </CardContent>
        </Card>
        <Card className="card-modern">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{profileData.rating}</p>
            <p className="text-sm text-muted-foreground">{profileData.reviews} Reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link href="/farmer/products">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2 bg-transparent">
                <Package className="h-6 w-6" />
                <span className="text-sm">Manage Products</span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2 bg-transparent">
              <Plus className="h-6 w-6" />
              <span className="text-sm">Add Product</span>
            </Button>
            <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2 bg-transparent">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profileData.certifications.map((cert: string) => (
              <Badge key={cert} className="bg-primary/10 text-primary border-primary/20">
                {cert}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Top Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profileData.products.map((product: any) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Stock: {product.stock} • Price: ₹{product.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{product.sales} sold</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Earnings */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Earnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profileData.monthlyEarnings.map((month: any) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-sm font-medium">{month.month} 2024</span>
                <span className="font-bold text-primary">₹{month.earnings.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Aggregator Profile Component
export function renderAggregatorProfile(profileData: any) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-modern">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{profileData.partneredFarmers}</p>
            <p className="text-sm text-muted-foreground">Partner Farmers</p>
          </CardContent>
        </Card>
        <Card className="card-modern">
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{profileData.totalVolume.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Volume (kg)</p>
          </CardContent>
        </Card>
        <Card className="card-modern">
          <CardContent className="p-4 text-center">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{profileData.regionsServed}</p>
            <p className="text-sm text-muted-foreground">Regions Served</p>
          </CardContent>
        </Card>
        <Card className="card-modern">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{profileData.commission}%</p>
            <p className="text-sm text-muted-foreground">Commission Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for aggregators */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link href="/aggregator/products">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2 bg-transparent">
                <Package className="h-6 w-6" />
                <span className="text-sm">Manage Products</span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2 bg-transparent">
              <Plus className="h-6 w-6" />
              <span className="text-sm">Add Product</span>
            </Button>
            <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2 bg-transparent">
              <QrCode className="h-6 w-6" />
              <span className="text-sm">QR Codes</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Top Farmers */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top Partner Farmers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profileData.topFarmers.map((farmer: any, index: number) => (
              <div key={farmer.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <div>
                    <p className="font-medium">{farmer.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">{farmer.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{farmer.volume.toLocaleString()} kg</p>
                  <p className="text-xs text-muted-foreground">Volume</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Volume */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Monthly Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profileData.monthlyVolume.map((month: any) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-sm font-medium">{month.month} 2024</span>
                <span className="font-bold text-primary">{month.volume.toLocaleString()} kg</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
