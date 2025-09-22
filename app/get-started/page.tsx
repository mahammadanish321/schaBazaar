"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Truck, Shield, QrCode, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const features = [
	{
		icon: <Users className="w-6 h-6" />,
		title: "Direct from Farmers",
		description: "Buy fresh produce directly from farmers, ensuring fair prices and quality",
	},
	{
		icon: <Truck className="w-6 h-6" />,
		title: "Fast Delivery",
		description: "Get your orders delivered within 20 minutes to your doorstep",
	},
	{
		icon: <Shield className="w-6 h-6" />,
		title: "Blockchain Transparency",
		description: "Complete transparency in pricing and supply chain through blockchain technology",
	},
	{
		icon: <QrCode className="w-6 h-6" />,
		title: "QR Code Tracking",
		description: "Track your products from farm to table with QR code technology",
	},
]

export default function GetStartedPage() {
	const router = useRouter()
	const videoRef = useRef<HTMLVideoElement>(null)
	const [videoLoaded, setVideoLoaded] = useState(false)
	const isMountedRef = useRef(true)

	useEffect(() => {
		const playVideo = async () => {
			if (videoRef.current && isMountedRef.current && videoLoaded) {
				try {
					await videoRef.current.play()
				} catch (error) {
					if (error instanceof Error && error.name !== "AbortError") {
						console.warn("Video play failed:", error)
					}
				}
			}
		}

		if (videoLoaded) {
			playVideo()
		}

		return () => {
			isMountedRef.current = false
		}
	}, [videoLoaded])

	return (
		<div className="min-h-screen relative overflow-hidden">
			{/* Background Video */}
			<div className="absolute inset-0 z-0">
				<video
					ref={videoRef}
					className="w-full h-full object-cover"
					autoPlay
					muted
					loop
					playsInline
					preload="metadata"
					onLoadedData={() => setVideoLoaded(true)}
					onError={(e) => {
						console.warn("Video error:", e)
					}}
				>
					<source src="/2876087-hd_1920_1080_30fps.mp4" type="video/mp4" />
				</video>
				<div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
			</div>

			{/* Content */}
			<div className="relative z-10 min-h-screen flex flex-col">
				{/* Header */}
				<header className="p-6 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<h1 className="text-2xl font-bold text-white">SacchaBazaar</h1>
						<Badge variant="secondary" className="bg-white/20 text-white border-white/30">
							Agricultural Marketplace
						</Badge>
					</div>

					<div className="flex items-center gap-3">
						<Link href="/auth/login">
							<Button
								variant="outline"
								className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
							>
								Sign In
							</Button>
						</Link>
						<Link href="/auth/register">
							<Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Sign Up</Button>
						</Link>
					</div>
				</header>

				{/* Hero Section */}
				<div className="flex-1 flex items-center justify-center px-6">
					<div className="max-w-4xl mx-auto text-center text-white">
						<div className="mb-8">
							<h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
								Fresh Produce
								<span className="block text-primary">Directly from Farmers</span>
							</h2>
							<p className="text-xl md:text-2xl text-white/90 mb-8 text-pretty max-w-2xl mx-auto">
								Connect with local farmers, get the freshest produce, and support sustainable agriculture with
								transparent pricing
							</p>
						</div>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
							<Button
								size="lg"
								className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl"
								onClick={() => router.push("/auth/register")}
							>
								Get Started
								<ArrowRight className="w-5 h-5 ml-2" />
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg rounded-xl"
								onClick={() => router.push("/about")}
							>
								Learn More About SacchaBazaar
							</Button>
						</div>
					</div>
				</div>

				{/* Features Section */}
				<div className="bg-black/20 backdrop-blur-sm border-t border-white/10 p-6">
					<div className="max-w-6xl mx-auto">
						<h3 className="text-2xl font-bold text-white text-center mb-8">Why Choose SacchaBazaar?</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{features.map((feature, index) => (
								<div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
									<div className="text-primary mb-4">{feature.icon}</div>
									<h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
									<p className="text-white/80 text-sm">{feature.description}</p>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Footer */}
				<footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 p-6">
					<div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
						<div className="text-center md:text-left">
							<p className="text-white/90 font-medium">Developed by Code_Knights</p>
							<p className="text-white/70 text-sm">Smart India Hackathon 2025</p>
						</div>
					</div>
				</footer>
			</div>
		</div>
	)
}
