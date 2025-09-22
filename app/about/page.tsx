"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Truck, Shield, QrCode, Heart, Leaf, Award } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const features = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Direct Farmer Connection",
    description:
      "Connect directly with local farmers, eliminating middlemen and ensuring fair prices for both farmers and customers.",
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Lightning Fast Delivery",
    description: "Get your fresh produce delivered within 20 minutes through our efficient logistics network.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Blockchain Transparency",
    description:
      "Every transaction is recorded on blockchain, ensuring complete transparency in pricing and supply chain.",
  },
  {
    icon: <QrCode className="w-8 h-8" />,
    title: "Product Traceability",
    description: "Track your products from farm to table using QR codes, knowing exactly where your food comes from.",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Fair Pricing",
    description:
      "Farmers get fair prices directly from customers, supporting sustainable agriculture and rural communities.",
  },
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "Organic & Fresh",
    description: "Access to certified organic produce and the freshest vegetables and fruits directly from farms.",
  },
]

const stats = [
  { number: "10,000+", label: "Happy Customers" },
  { number: "500+", label: "Partner Farmers" },
  { number: "50+", label: "Cities Covered" },
  { number: "99.9%", label: "Delivery Success" },
]

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container-max section-padding">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">SacchaBazaar</h1>
                <Badge variant="secondary">About Us</Badge>
              </div>
            </div>
            <Link href="/get-started">
              <Button className="btn-primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-padding py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-max text-center">
          <Badge variant="secondary" className="mb-4">
            <Award className="w-4 h-4 mr-2" />
            Smart India Hackathon 2025 Winner
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Revolutionizing Agriculture
            <span className="block text-primary">Through Technology</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto">
            SacchaBazaar is more than just a marketplace - we're building a sustainable future for agriculture by
            connecting farmers directly with consumers through cutting-edge technology.
          </p>
        </div>
      </section>

      {/* ...existing code... */}

      {/* Features Section */}
      <section className="section-padding py-16">
        <div className="container-max">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Our Key Features</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how SacchaBazaar is transforming the agricultural marketplace with innovative features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-modern p-6 hover:shadow-lg transition-all duration-300">
                <div className="text-primary mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding py-16 bg-muted/30">
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-foreground mb-6">Our Mission</h3>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              To create a transparent, efficient, and sustainable agricultural ecosystem that benefits farmers,
              consumers, and the environment. We believe in fair trade, quality produce, and the power of technology to
              solve real-world problems.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-foreground mb-2">For Farmers</h4>
                <p className="text-sm text-muted-foreground">
                  Fair prices, direct market access, and sustainable income
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-foreground mb-2">For Consumers</h4>
                <p className="text-sm text-muted-foreground">Fresh produce, transparent pricing, and fast delivery</p>
              </div>
              <div className="bg-card rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-foreground mb-2">For Environment</h4>
                <p className="text-sm text-muted-foreground">
                  Reduced food waste, sustainable farming, and local sourcing
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding py-16">
        <div className="container-max text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6">Meet Code_Knights</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            We are a passionate team of developers and innovators participating in Smart India Hackathon 2025, dedicated
            to solving agricultural challenges through technology.
          </p>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-border">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Code_Knights
              </Badge>
              <Badge variant="outline">Smart India Hackathon 2025</Badge>
            </div>
            <p className="text-muted-foreground">Building the future of agriculture, one line of code at a time.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding py-16 bg-primary/5">
        <div className="container-max text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h3>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who are already experiencing the future of agricultural marketplace
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="btn-primary px-8 py-4 text-lg">
                Join SacchaBazaar
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg bg-transparent">
                Explore Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
