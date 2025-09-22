"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  TrendingUp,
  Star,
  AlertTriangle,
  QrCode,
  Download,
} from "lucide-react"
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
import { useNotifications } from "@/contexts/notification-context"

// Mock farmer products data

// Helper for image preview cleanup
const mockFarmerProducts = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    price: 45,
    unit: "kg",
    stock: 150,
    category: "vegetables",
    image: "/fresh-red-tomatoes.jpg",
    description: "Fresh organic tomatoes grown without pesticides. Perfect for salads and cooking.",
    organic: true,
    active: true,
    views: 234,
    sales: 89,
    rating: 4.5,
    reviews: 23,
    createdAt: "2024-01-15",
    qrCode: "TOMATO12345",
    hasQR: true,
  },
  {
    id: 2,
    name: "Organic Onions",
    price: 30,
    unit: "kg",
    stock: 200,
    category: "vegetables",
    image: "/organic-white-onions.jpg",
    description: "High quality onions directly from the farm. Great for all cooking needs.",
    organic: true,
    active: true,
    views: 189,
    sales: 156,
    rating: 4.2,
    reviews: 18,
    createdAt: "2024-01-10",
    qrCode: "ONION67890",
    hasQR: true,
  },
  {
    id: 3,
    name: "Fresh Spinach",
    price: 25,
    unit: "bunch",
    stock: 0,
    category: "vegetables",
    image: "/fresh-green-spinach-leaves.jpg",
    description: "Fresh green spinach leaves, rich in iron and vitamins.",
    organic: false,
    active: false,
    views: 145,
    sales: 67,
    rating: 4.7,
    reviews: 31,
    createdAt: "2024-01-05",
    qrCode: "SPINACH11111",
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
  images?: Array<{ file: File; preview: string }>
  organic: boolean
  active: boolean
  qrCode?: string
  hasQR?: boolean
}

function revokeImagePreviews(images: Array<{ file: File; preview: string }> = []) {
  images.forEach((img: { file: File; preview: string }) => {
    if (img.preview) URL.revokeObjectURL(img.preview);
  });
}

export default function FarmerProductsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [products, setProducts] = useState(mockFarmerProducts)
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
  })

  // Redirect if not farmer
  if (user && user.userType !== "farmer") {
  router.push("/")
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

    addNotification({
      type: "success",
      title: "Product Added & QR Generated",
      message: `QR code for ${newProduct.name} has been generated successfully`,
      actionUrl: "/farmer/products",
      actionText: "View Product",
    })

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
    })
    setIsAddDialogOpen(false)
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
  }

  const handleUpdateProduct = () => {
    if (editingProduct && typeof editingProduct.id !== "undefined") {
      setProducts(products.map((p) =>
        p.id === editingProduct.id ? { ...p, ...editingProduct } : p
      ))
      setEditingProduct(null)
    }
  }

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const handleToggleActive = (id: number) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, active: !p.active } : p)))
  }

  const handleDownloadQR = async (product: any) => {
    await downloadQRCode(product.qrCode, product.name)
    addNotification({
      type: "info",
      title: "QR Code Downloaded",
      message: `QR code for ${product.name} has been downloaded successfully`,
    })
  }

  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.active).length
  const totalViews = products.reduce((sum, p) => sum + p.views, 0)
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0)
  const lowStockProducts = products.filter((p) => p.stock < 20).length

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
                <h1 className="text-xl font-bold text-foreground">My Products</h1>
                <p className="text-sm text-muted-foreground">Manage your product listings</p>
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
                  <DialogDescription>Fill in the details to list your product</DialogDescription>
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
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      placeholder="Describe your product..."
                      rows={3}
                      className="input-field"
                    />
                  </div>

                  <div>
                      <Label htmlFor="imageUpload">Product Images (max 5)</Label>
                      <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          let currentImages = newProduct.images || [];
                          // Merge new files with existing images
                          const newImages = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
                          let mergedImages = [...currentImages, ...newImages];
                          if (mergedImages.length > 5) {
                            alert('You can upload a maximum of 5 images.');
                            mergedImages = mergedImages.slice(0, 5);
                          }
                          // Clean up previous previews only if replaced
                          revokeImagePreviews(currentImages);
                          setNewProduct({ ...newProduct, images: mergedImages });
                        }}
                        className="input-field"
                      />
                      {/* Show previews */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                        {newProduct.images && newProduct.images.map((img: { file: File; preview: string }, idx: number) => (
                          <img
                            key={idx}
                            src={img.preview}
                            alt={`Product Preview ${idx + 1}`}
                            style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '8px' }}
                          />
                        ))}
                      </div>
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
                    Add Product
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

        {/* Low Stock Alert */}
        {lowStockProducts > 0 && (
          <Card className="card-modern mb-6 border-destructive/20 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium">
                  {lowStockProducts} product{lowStockProducts > 1 ? "s" : ""} running low on stock
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-foreground mb-2">No Products Listed</h3>
                <p className="text-muted-foreground mb-4">Start by adding your first product to the marketplace</p>
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
                                {product.stock < 20 && product.stock > 0 && (
                                  <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                                    Low Stock
                                  </Badge>
                                )}
                                {product.hasQR && (
                                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                                    <QrCode className="h-3 w-3 mr-1" />
                                    QR Generated
                                  </Badge>
                                )}
                              </div>
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
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push(`/product-tracking/${product.id}`)}
                                  className="text-green-700 border-green-600 hover:bg-green-50"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Track Product
                                </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleToggleActive(product.id)}>
                                {product.active ? "Deactivate" : "Activate"}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-destructive hover:text-destructive"
                              >
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
                                className={`font-bold ${product.stock === 0 ? "text-destructive" : product.stock < 20 ? "text-orange-600" : "text-foreground"}`}
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

        {/* Edit Product Dialog */}
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update your product details</DialogDescription>
            </DialogHeader>

            {editingProduct && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-price">Price (₹)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-stock">Stock</Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    rows={3}
                    className="input-field"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-organic"
                    checked={editingProduct.organic}
                    onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, organic: !!checked })}
                  />
                  <Label htmlFor="edit-organic">Organic Product</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-active"
                    checked={editingProduct.active}
                    onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, active: checked })}
                  />
                  <Label htmlFor="edit-active">Active Listing</Label>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProduct} className="btn-primary">
                Update Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
