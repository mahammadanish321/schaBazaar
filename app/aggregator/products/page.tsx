"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Edit, Trash2, Eye, Package, TrendingUp, Star, QrCode, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/contexts/auth-context"
import { downloadQRCode } from "@/lib/qr-utils"

// Mock aggregator products data
const mockAggregatorProducts = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    price: 50,
    unit: "kg",
    stock: 200,
    category: "vegetables",
    image: "/fresh-red-tomatoes.jpg",
    description: "Fresh organic tomatoes sourced from multiple farmers.",
    organic: true,
    active: true,
    views: 345,
    sales: 156,
    rating: 4.6,
    reviews: 34,
    createdAt: "2024-01-15",
    farmerSource: "Rajesh Kumar, Priya Sharma",
    qrCode: "TOMATO12345",
    hasQR: true,
  },
  {
    id: 2,
    name: "Organic Onions",
    price: 35,
    unit: "kg",
    stock: 300,
    category: "vegetables",
    image: "/organic-white-onions.jpg",
    description: "High quality onions aggregated from certified organic farms.",
    organic: true,
    active: true,
    views: 289,
    sales: 203,
    rating: 4.3,
    reviews: 28,
    createdAt: "2024-01-10",
    farmerSource: "Amit Singh, Sunita Devi",
    qrCode: "ONION67890",
    hasQR: true,
  },
]

interface Product {
  id?: number
  name: string
  price: number
  unit: string
  stock: number
  category: string
  image: string
  description: string
  organic: boolean
  active: boolean
  farmerSource?: string
}

export default function AggregatorProductsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [products, setProducts] = useState(mockAggregatorProducts)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    price: 0,
    unit: "kg",
    stock: 0,
    category: "vegetables",
    image: "",
    description: "",
    organic: false,
    active: true,
    farmerSource: "",
  })

  // Redirect if not aggregator
  if (user && user.userType !== "aggregator") {
    router.push("/")
    return null
  }

  const handleBack = () => {
    router.push("/profile")
  }

  const generateProductQR = (product: any) => {
    const qrCode = `${product.name.toUpperCase().replace(/\s+/g, "")}${Math.floor(Math.random() * 100000)}`
    return qrCode
  }

  const handleAddProduct = () => {
    const qrCode = generateProductQR(newProduct)
    const product = {
      ...newProduct,
      id: Date.now(),
      views: 0,
      sales: 0,
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString().split("T")[0],
      qrCode,
      hasQR: true,
    }
    setProducts([...products, product])
    setNewProduct({
      name: "",
      price: 0,
      unit: "kg",
      stock: 0,
      category: "vegetables",
      image: "",
      description: "",
      organic: false,
      active: true,
      farmerSource: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleDownloadQR = async (product: any) => {
    await downloadQRCode(product.qrCode, product.name)
  }

  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.active).length
  const totalViews = products.reduce((sum, p) => sum + p.views, 0)
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0)
  const lowStockProducts = products.filter((p) => p.stock < 50).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container-max section-padding">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Aggregator Products</h1>
                <p className="text-sm text-muted-foreground">Manage your aggregated product listings</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>Add a product you're aggregating from farmers</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="e.g., Fresh Tomatoes"
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                        placeholder="0"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Select
                        value={newProduct.unit}
                        onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                      >
                        <SelectTrigger className="input-field">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="gram">gram</SelectItem>
                          <SelectItem value="piece">piece</SelectItem>
                          <SelectItem value="bunch">bunch</SelectItem>
                          <SelectItem value="dozen">dozen</SelectItem>
                          <SelectItem value="liter">liter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                        placeholder="0"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                      >
                        <SelectTrigger className="input-field">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vegetables">Vegetables</SelectItem>
                          <SelectItem value="fruits">Fruits</SelectItem>
                          <SelectItem value="grains">Grains & Cereals</SelectItem>
                          <SelectItem value="dairy">Dairy Products</SelectItem>
                          <SelectItem value="spices">Spices & Herbs</SelectItem>
                          <SelectItem value="pulses">Pulses & Lentils</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="farmerSource">Farmer Sources</Label>
                    <Input
                      id="farmerSource"
                      value={newProduct.farmerSource}
                      onChange={(e) => setNewProduct({ ...newProduct, farmerSource: e.target.value })}
                      placeholder="e.g., Rajesh Kumar, Priya Sharma"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      placeholder="Describe your aggregated product..."
                      rows={3}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Product Image URL</Label>
                    <Input
                      id="image"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="input-field"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="organic"
                      checked={newProduct.organic}
                      onCheckedChange={(checked) => setNewProduct({ ...newProduct, organic: !!checked })}
                    />
                    <Label htmlFor="organic">Organic Product</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={newProduct.active}
                      onCheckedChange={(checked) => setNewProduct({ ...newProduct, active: checked })}
                    />
                    <Label htmlFor="active">List Product (Active)</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddProduct}
                    disabled={!newProduct.name || !newProduct.price}
                    className="btn-primary"
                  >
                    Add Product & Generate QR
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container-max section-padding py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="card-modern">
            <CardContent className="p-4 text-center">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </CardContent>
          </Card>
          <Card className="card-modern">
            <CardContent className="p-4 text-center">
              <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{activeProducts}</p>
              <p className="text-sm text-muted-foreground">Active Listings</p>
            </CardContent>
          </Card>
          <Card className="card-modern">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalViews}</p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </CardContent>
          </Card>
          <Card className="card-modern">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalSales}</p>
              <p className="text-sm text-muted-foreground">Items Sold</p>
            </CardContent>
          </Card>
          <Card className="card-modern">
            <CardContent className="p-4 text-center">
              <QrCode className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{products.filter((p) => p.hasQR).length}</p>
              <p className="text-sm text-muted-foreground">QR Codes</p>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Aggregated Product Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-foreground mb-2">No Products Listed</h3>
                <p className="text-muted-foreground mb-4">Start by adding your first aggregated product</p>
                <Button onClick={() => setIsAddDialogOpen(true)} className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <Card key={product.id} className={`border-border/50 ${!product.active ? "opacity-60" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-destructive/20 rounded-lg flex items-center justify-center">
                              <Badge className="bg-destructive text-destructive-foreground text-xs">Out of Stock</Badge>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-foreground">{product.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={product.active ? "default" : "secondary"} className="text-xs">
                                  {product.active ? "Active" : "Inactive"}
                                </Badge>
                                {product.organic && (
                                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                                    Organic
                                  </Badge>
                                )}
                                <Badge variant="outline" className="capitalize text-xs">
                                  {product.category}
                                </Badge>
                                {product.hasQR && (
                                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                                    <QrCode className="h-3 w-3 mr-1" />
                                    QR Generated
                                  </Badge>
                                )}
                              </div>
                              {product.farmerSource && (
                                <p className="text-xs text-muted-foreground mt-1">Sources: {product.farmerSource}</p>
                              )}
                            </div>

                            <div className="flex gap-2">
                              {product.hasQR && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownloadQR(product)}
                                  className="text-primary hover:text-primary"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Price:</span>
                              <p className="font-bold text-primary">
                                ₹{product.price}/{product.unit}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Stock:</span>
                              <p
                                className={`font-bold ${product.stock === 0 ? "text-destructive" : product.stock < 50 ? "text-orange-600" : "text-foreground"}`}
                              >
                                {product.stock} {product.unit}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Views:</span>
                              <p className="font-bold">{product.views}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Sales:</span>
                              <p className="font-bold">{product.sales}</p>
                            </div>
                            {product.qrCode && (
                              <div>
                                <span className="text-muted-foreground">QR Code:</span>
                                <p className="font-bold text-primary text-xs">{product.qrCode}</p>
                              </div>
                            )}
                          </div>

                          {product.rating > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-bold">{product.rating}</span>
                              <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
