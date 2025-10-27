"use client"

import { X, Trash2, Plus, Minus, CreditCard, Smartphone, Loader, Check, Truck } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useState, useEffect } from "react"

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart()
  const { user } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState<string>("upi")
  const [showCheckout, setShowCheckout] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Auto-show checkout when opened after Buy Now
  useEffect(() => {
    const handleBuyNowClick = () => {
      if (isOpen && cart.length > 0) {
        setShowCheckout(true)
      }
    }
    
    // Listen for buyNow event
    window.addEventListener('buyNow', handleBuyNowClick)
    
    return () => {
      window.removeEventListener('buyNow', handleBuyNowClick)
    }
  }, [isOpen, cart.length])

  if (!isOpen) return null

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: Smartphone, description: "Google Pay, PhonePe, Paytm" },
    { id: "credit", name: "Credit Card", icon: CreditCard, description: "Visa, Mastercard, Amex" },
    { id: "debit", name: "Debit Card", icon: CreditCard, description: "All Indian Banks" },
    { id: "netbanking", name: "Net Banking", icon: CreditCard, description: "All Banks" },
    { id: "cod", name: "Cash on Delivery", icon: Truck, description: "Pay when delivered" },
  ]

  const handleCheckout = async () => {
    console.log("Starting payment process...", { paymentMethod, cartTotal, cart })
    setIsProcessing(true)
    
    // Handle COD (Cash on Delivery) separately
    if (paymentMethod === "cod") {
      // Save COD order to database
      try {
        const orderResponse = await fetch("/api/orders/cod", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: user ? { userId: user.id, name: user.name, email: user.email } : { name: "Guest", email: "guest@example.com" },
            products: cart.map(item => ({
              productId: item.id,
              name: item.name,
              price: parseFloat(item.price.replace(/[^0-9.-]+/g, "")),
              quantity: item.quantity,
            })),
            paymentMethod: "cod",
            amount: cartTotal,
          }),
        })

        const orderData = await orderResponse.json()
        console.log("COD Order saved:", orderData)
      } catch (error) {
        console.error("Error saving COD order:", error)
        // Continue even if order save fails
      }

      // Simulate COD order processing
      setTimeout(() => {
        setPaymentSuccess(true)
        setShowSuccessModal(true)
        // Clear cart after successful order
        cart.forEach(item => removeFromCart(item.id))
        setTimeout(() => {
          setShowCheckout(false)
          setShowSuccessModal(false)
          onClose()
          setIsProcessing(false)
        }, 2000)
      }, 1000)
      return
    }
    
    try {
      const response = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: cartTotal,
          currency: "INR",
          paymentMethod,
          items: cart,
        }),
      })

      const data = await response.json()
      console.log("Payment API response:", data)

      if (data.success && data.order && data.order.id && data.razorpayKey) {
        const options = {
          key: data.razorpayKey,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "Flamnora",
          description: "Premium Candles",
          order_id: data.order.id,
          handler: async (response: any) => {
            console.log("Razorpay payment response:", response)
            // Verify payment
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user: user ? { userId: user.id, name: user.name, email: user.email } : { name: "Guest", email: "guest@example.com" },
                products: cart.map(item => ({
                  productId: item.id,
                  name: item.name,
                  price: parseFloat(item.price.replace(/[^0-9.-]+/g, "")),
                  quantity: item.quantity,
                })),
                paymentMethod: paymentMethod,
                amount: cartTotal,
              }),
            })

            const verifyData = await verifyResponse.json()
            console.log("Payment verification response:", verifyData)
            
            if (verifyData.success) {
              setPaymentSuccess(true)
              setShowSuccessModal(true)
              // Clear cart after successful payment
              cart.forEach(item => removeFromCart(item.id))
              setTimeout(() => {
                setShowCheckout(false)
                setShowSuccessModal(false)
                onClose()
              }, 2000)
            } else {
              alert("Payment verification failed")
            }
          },
          prefill: {
            method: paymentMethod,
          },
        }

        // Load Razorpay script
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.onload = () => {
          const razorpay = new (window as any).Razorpay(options)
          razorpay.open()
        }
        document.body.appendChild(script)
      } else {
        console.error("Payment order creation failed:", data)
        alert(data.error || "Payment initialization failed")
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment processing failed")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBackToCart = () => {
    setShowCheckout(false)
    setPaymentMethod("upi") // Reset to default
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-background rounded-lg shadow-2xl p-8 max-w-sm w-full text-center animate-zoom-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground">Your order has been placed successfully.</p>
          </div>
        </div>
      )}

      {/* Modal */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md sm:max-w-lg bg-background shadow-2xl z-50 flex flex-col animate-slide-in-from-right">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="font-serif text-2xl font-bold text-foreground">Shopping Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground text-lg mb-2">Your cart is empty</p>
              <p className="text-muted-foreground text-sm">Add some beautiful candles to get started!</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex gap-4 p-4 bg-muted rounded-lg">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="text-primary font-bold">{item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-background rounded transition-colors"
                    >
                      <Minus size={16} className="text-foreground" />
                    </button>
                    <span className="text-foreground font-semibold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-background rounded transition-colors"
                    >
                      <Plus size={16} className="text-foreground" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            {!showCheckout ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary">₹{cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-primary hover:bg-accent text-primary-foreground py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                >
                  Proceed to Checkout
                </button>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <p className="font-semibold text-foreground text-sm uppercase tracking-wide">Select Payment Method</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon
                      const isSelected = paymentMethod === method.id
                      return (
                        <button
                          key={method.id}
                          onClick={() => {
                            console.log("Payment method selected:", method.id)
                            setPaymentMethod(method.id)
                          }}
                          className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 text-left transform hover:scale-[1.02] active:scale-[0.98] ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                              : "border-border hover:border-primary/50 hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors duration-200 ${
                              isSelected ? "bg-primary/20" : "bg-muted"
                            }`}>
                              <Icon size={18} className={isSelected ? "text-primary" : "text-muted-foreground"} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground text-sm sm:text-base truncate">{method.name}</p>
                              <p className="text-xs text-foreground/60 truncate">{method.description}</p>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <Check size={12} className="text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-primary hover:bg-accent disabled:opacity-50 text-primary-foreground py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
                  >
                    {isProcessing ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        <span className="animate-pulse">Processing{paymentMethod === "cod" ? " Order" : " Payment"}...</span>
                      </>
                    ) : (
                      <>
                        <span>{paymentMethod === "cod" ? "Place Order (COD)" : `Pay with ${paymentMethod.toUpperCase()}`}</span>
                        {paymentMethod === "cod" ? <Truck size={16} /> : <CreditCard size={16} />}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleBackToCart}
                    className="w-full bg-muted hover:bg-muted/80 text-foreground py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Back to Cart
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}
