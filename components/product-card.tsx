"use client"

import { ShoppingCart, Eye } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import ProductDetailsModal from "./product-details-modal"

interface ProductCardProps {
  product: any
  isPremium: boolean
}

export default function ProductCard({ product, isPremium }: ProductCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
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
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    // Check if user is signed in
    if (!user) {
      // Redirect to signup page if not signed in
      router.push("/signup")
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
    setShowDetails(false)
    // Dispatch custom event to open cart modal and show checkout
    window.dispatchEvent(new CustomEvent('openCart'))
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('buyNow'))
    }, 100)
  }

  return (
    <>
      <div className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
        {/* Image */}
        <div className="relative overflow-hidden h-64 bg-muted">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-serif text-xl font-bold text-foreground mb-3">{product.name}</h3>

          {/* Specs */}
          <div className="space-y-2 mb-4 text-sm text-muted-foreground">
            {isPremium ? (
              <>
                <p>
                  <span className="font-semibold text-foreground">Container:</span> {product.container}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Burn Time:</span> {product.burnTime}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Wax Type:</span> {product.waxType}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Weight:</span> {product.weight}
                </p>
              </>
            ) : (
              <>
                <p>
                  <span className="font-semibold text-foreground">Burn Time:</span> {product.burnTime}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Wax Type:</span> {product.waxType}
                </p>
                <p>
                  <span className="font-semibold text-foreground">MOQ:</span> {product.moq}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Weight:</span> {product.weight}
                </p>
              </>
            )}
          </div>

          {/* Price */}
          <p className="text-2xl font-bold text-primary mb-4">{product.price}</p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-2.5 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingCart size={20} />
              Buy Now
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 text-primary-foreground py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg ${
                  addedToCart ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-accent"
                }`}
              >
                <ShoppingCart size={18} />
                <span className="hidden sm:inline">{addedToCart ? "Added!" : "Add to Cart"}</span>
              </button>
              <button
                onClick={() => setShowDetails(true)}
                className="flex-1 border-2 border-primary text-primary hover:bg-primary/10 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Eye size={18} />
                <span className="hidden sm:inline">Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDetails && (
        <ProductDetailsModal product={product} isPremium={isPremium} onClose={() => setShowDetails(false)} />
      )}
    </>
  )
}
