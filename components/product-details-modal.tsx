"use client"

import { X, ShoppingCart, Heart, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"

interface ProductDetailsModalProps {
  product: any
  isPremium: boolean
  onClose: () => void
}

export default function ProductDetailsModal({ product, isPremium, onClose }: ProductDetailsModalProps) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const handleAddToCart = () => {
    addToCart({
      id: product.id || product.name,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    onClose()
  }

  const handleBuyNow = () => {
    // Check if user is signed in
    if (!user) {
      onClose()
      // Redirect to login page if not signed in
      router.push("/login")
      return
    }

    // User is signed in, proceed with Buy Now flow
    addToCart({
      id: product.id || product.name,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    onClose()
    // Dispatch custom event to open cart modal and show checkout
    window.dispatchEvent(new CustomEvent('openCart'))
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('buyNow'))
    }, 100)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border flex justify-between items-center p-6">
          <h2 className="font-serif text-2xl font-bold text-foreground">{product.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors duration-300">
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image */}
          <div className="rounded-xl overflow-hidden bg-muted h-80">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <p className="text-4xl font-bold text-primary">{product.price}</p>
            <button className="p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors duration-300">
              <Heart size={24} className="text-accent" />
            </button>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description ||
                `Experience the luxury of our ${product.name}. Handcrafted with premium ingredients and attention to detail, this candle brings warmth and elegance to any space. Perfect for creating the ideal ambiance in your home.`}
            </p>
          </div>

          {/* Specifications */}
          <div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-4">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              {isPremium ? (
                <>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Container</p>
                    <p className="font-semibold text-foreground">{product.container}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Burn Time</p>
                    <p className="font-semibold text-foreground">{product.burnTime}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Wax Type</p>
                    <p className="font-semibold text-foreground">{product.waxType}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Weight</p>
                    <p className="font-semibold text-foreground">{product.weight}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Burn Time</p>
                    <p className="font-semibold text-foreground">{product.burnTime}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Wax Type</p>
                    <p className="font-semibold text-foreground">{product.waxType}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">MOQ</p>
                    <p className="font-semibold text-foreground">{product.moq}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Weight</p>
                    <p className="font-semibold text-foreground">{product.weight}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-4">Benefits</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">✓</span>
                <span>Premium quality ingredients for long-lasting fragrance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">✓</span>
                <span>Handcrafted with attention to detail</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">✓</span>
                <span>Eco-friendly and sustainable materials</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">✓</span>
                <span>Perfect for gifting or personal use</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3.5 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <CreditCard size={20} />
              Buy Now
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-accent text-primary-foreground py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button
                onClick={onClose}
                className="flex-1 border-2 border-primary text-primary hover:bg-primary/10 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
