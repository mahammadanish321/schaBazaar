// QR Code generation and download utilities

export function generateQRCode(productId: string): string {
  // Generate a unique QR code token
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  return `${productId}_${timestamp}_${random}`
}

export async function downloadQRCode(qrCode: string, productName: string): Promise<void> {
  try {
    // Helper function for rounded rectangles (if not available)
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function (
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
      ) {
        this.beginPath()
        this.moveTo(x + radius, y)
        this.lineTo(x + width - radius, y)
        this.quadraticCurveTo(x + width, y, x + width, y + radius)
        this.lineTo(x + width, y + height - radius)
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        this.lineTo(x + radius, y + height)
        this.quadraticCurveTo(x, y + height, x, y + height - radius)
        this.lineTo(x, y + radius)
        this.quadraticCurveTo(x, y, x + radius, y)
        this.closePath()
      }
    }

    // Create the QR code canvas with SacchaBazaar design
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("Canvas context not available")
    }

    // Set canvas size to match the design
    canvas.width = 400
    canvas.height = 600

    // Create gradient background (yellow/mustard like in the image)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#D4AF37") // Gold
    gradient.addColorStop(1, "#B8860B") // Dark goldenrod

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add SacchaBazaar branding at top
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText("SACCHABAZAAR", canvas.width / 2, 50)

    // Add "scan here" text
    ctx.font = "bold 32px Arial"
    ctx.fillText("scan", canvas.width / 2, 100)
    ctx.fillText("here", canvas.width / 2, 140)

    // Add QR CODE button background
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
    ctx.roundRect(canvas.width / 2 - 80, 160, 160, 40, 20)
    ctx.fill()

    // Add QR CODE text
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 16px Arial"
    ctx.fillText("QR CODE", canvas.width / 2, 185)

    // Add Product ID
    ctx.fillStyle = "#000000"
    ctx.font = "bold 18px Arial"
    ctx.fillText(`Product ID: #${qrCode}`, canvas.width / 2, 230)

    // Create QR code placeholder (white background)
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(canvas.width / 2 - 100, 260, 200, 200)

    // Add simple QR pattern (mock QR code)
    ctx.fillStyle = "#000000"
    const qrSize = 180
    const cellSize = qrSize / 21 // 21x21 grid for QR code
    const startX = canvas.width / 2 - qrSize / 2
    const startY = 270

    // Generate a simple pattern based on the QR code string
    for (let i = 0; i < 21; i++) {
      for (let j = 0; j < 21; j++) {
        const hash = qrCode.charCodeAt((i * 21 + j) % qrCode.length)
        if (hash % 2 === 0) {
          ctx.fillRect(startX + j * cellSize, startY + i * cellSize, cellSize, cellSize)
        }
      }
    }

    // Add corner squares (typical QR code pattern)
    const cornerSize = cellSize * 7
    // Top-left corner
    ctx.fillRect(startX, startY, cornerSize, cornerSize)
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(startX + cellSize, startY + cellSize, cornerSize - 2 * cellSize, cornerSize - 2 * cellSize)
    ctx.fillStyle = "#000000"
    ctx.fillRect(startX + 2 * cellSize, startY + 2 * cellSize, cornerSize - 4 * cellSize, cornerSize - 4 * cellSize)

    // Top-right corner
    ctx.fillStyle = "#000000"
    ctx.fillRect(startX + qrSize - cornerSize, startY, cornerSize, cornerSize)
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(
      startX + qrSize - cornerSize + cellSize,
      startY + cellSize,
      cornerSize - 2 * cellSize,
      cornerSize - 2 * cellSize,
    )
    ctx.fillStyle = "#000000"
    ctx.fillRect(
      startX + qrSize - cornerSize + 2 * cellSize,
      startY + 2 * cellSize,
      cornerSize - 4 * cellSize,
      cornerSize - 4 * cellSize,
    )

    // Bottom-left corner
    ctx.fillStyle = "#000000"
    ctx.fillRect(startX, startY + qrSize - cornerSize, cornerSize, cornerSize)
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(
      startX + cellSize,
      startY + qrSize - cornerSize + cellSize,
      cornerSize - 2 * cellSize,
      cornerSize - 2 * cellSize,
    )
    ctx.fillStyle = "#000000"
    ctx.fillRect(
      startX + 2 * cellSize,
      startY + qrSize - cornerSize + 2 * cellSize,
      cornerSize - 4 * cellSize,
      cornerSize - 4 * cellSize,
    )

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${productName.replace(/\s+/g, "_")}_QR_${qrCode}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    }, "image/png")
  } catch (error) {
    console.error("Error generating QR code:", error)
    alert("Error generating QR code. Please try again.")
  }
}


