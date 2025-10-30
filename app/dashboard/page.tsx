"use client"

import type React from "react"

import { useAuth, type Order } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import Navbar from "@/components/navbar"
import { Mail, Phone, MapPin, Package, Calendar, Edit2, Check, X, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Define proper types
interface OrderProduct {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export default function DashboardPage() {
  const { user, updateProfile } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [totalSpent, setTotalSpent] = useState(0)
  const [memberSince, setMemberSince] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    setFormData({
      name: user.name,
      phone: user.phone || "",
      address: user.address || "",
    })
    // initialize avatar preview from user profile if available
    setAvatarPreview((user as any).avatar || (user as any).photoURL || null)

    // Fetch real orders from MongoDB
    fetchOrders()
  }, [user, router])

  // Revoke object URL when avatarPreview changes to avoid memory leaks
  useEffect(() => {
    return () => {
      try {
        if (avatarPreview && avatarPreview.startsWith("blob:")) {
          URL.revokeObjectURL(avatarPreview)
        }
      } catch (e) {
        // ignore
      }
    }
  }, [avatarPreview])

  // Define image map outside of the function to prevent recreating on each render
  const PRODUCT_IMAGE_MAP: { [key: string]: string } = {
    'Ice Ocean Breeze Candle': '/blue-ocean-breeze-candle-luxury.jpg',
    'Bubble Candle': '/bubble-candle-handcrafted.jpg',
    'Coffee Latte Candle': '/coffee-latte-scented-candle-luxury.jpg',
    'Artisan Handmade Candle': '/artisan-handmade-candle-with-premium-wax-and-essen.jpg',
    'Red Heart Candle': '/red-heart-candle-in-glass-jar.jpg',
    'Small Bubble Candle': '/small-bubble-candle-craft.jpg'
  }

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      setLoading(true)
      const response = await fetch(`/api/orders?userId=${user.id}&email=${user.email}`)
      const data = await response.json()

      if (data.success) {
        const ordersWithImages = data.orders.map((order: any) => ({
          ...order,
          products: (order.products || []).map((product: OrderProduct) => ({
            ...product,
            image: PRODUCT_IMAGE_MAP[product.name] || '/placeholder.jpg'
          }))
        }))

        setOrders(ordersWithImages)
        setTotalSpent(data.totalSpent || 0)
        
        // Set member since from first order or current date
        if (ordersWithImages && ordersWithImages.length > 0) {
          const latestOrder = ordersWithImages[ordersWithImages.length - 1]
          const date = new Date(latestOrder.createdAt)
          setMemberSince(date.getFullYear().toString())
        } else {
          setMemberSince(new Date().getFullYear().toString())
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload: any = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      }
      
      // Only include the file if a new one was selected
      if (avatarFile) {
        payload.avatarFile = avatarFile
      }
      
      await updateProfile(payload)
      setIsEditing(false)
      
      // Clean up the preview URL if it was created
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview)
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      // You might want to show an error message to the user here
      alert('Failed to update profile. Please try again.')
    }
  }

  if (!user) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "paid":
        return "bg-green-100 text-green-800 border-green-300"
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "failed":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const stats = [
    { icon: Package, label: "Total Orders", value: orders.length, color: "from-blue-500 to-blue-600" },
    {
      icon: TrendingUp,
      label: "Total Spent",
      value: `₹${totalSpent.toFixed(2)}`,
      color: "from-purple-500 to-purple-600",
    },
    { icon: Star, label: "Member Since", value: memberSince || "2024", color: "from-amber-500 to-amber-600" },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">My Dashboard</h1>
            <p className="text-foreground/60 text-base sm:text-lg">
              Welcome back, <span className="font-semibold text-primary">{user.name}</span>!
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-xs sm:text-sm font-medium mb-1">{stat.label}</p>
                      <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                    </div>
                    <Icon size={40} className="opacity-20" />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Profile Section - Enhanced */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/90 dark:to-gray-800/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-3xl shadow-2xl p-6 sm:p-8 sticky top-24 hover:shadow-3xl transition-all duration-300">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary dark:text-primary">Profile</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-colors duration-300"
                      title="Edit profile"
                    >
                      <Edit2 size={18} className="text-primary dark:text-primary" />
                    </button>
                  )}
                </div>

                {/* Hidden file input always present so both view/edit can trigger it */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Validate file size (max 5MB)
                      if (file.size > 5 * 1024 * 1024) {
                        alert('File size must be less than 5MB');
                        return;
                      }

                      // Validate file type
                      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                      if (!validTypes.includes(file.type)) {
                        alert('Please select a valid image file (JPEG, PNG, GIF, or WEBP)');
                        return;
                      }

                      // Create preview immediately
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setAvatarPreview(ev.target?.result as string);
                      };
                      reader.readAsDataURL(file);

                      // Set the file but don't save it yet - wait for user to click Save
                      setAvatarFile(file);
                    }
                  }}
                />

                {!isEditing ? (
                  <div className="space-y-6">
                    {/* Profile Avatar - Enhanced */}
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        {avatarPreview || (user as any).avatar || (user as any).photoURL ? (
                          <img
                            src={avatarPreview || (user as any).avatar || (user as any).photoURL}
                            alt="avatar"
                            className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-xl"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center text-white font-serif text-3xl font-bold shadow-xl">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="absolute bottom-0 right-0 flex gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-primary p-2 rounded-full border-4 border-white shadow-lg text-white hover:opacity-90 transition-all duration-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                              <polyline points="17 21 17 13 7 13 7 21" />
                              <polyline points="7 3 7 8 15 8" />
                            </svg>
                          </button>
                          {avatarPreview && avatarFile && (
                            <button
                              type="button"
                              onClick={async () => {
                                await handleUpdateProfile({ preventDefault: () => {} } as any);
                                // Clear the file and preview after successful update
                                setAvatarFile(null);
                              }}
                              className="bg-green-500 p-2 rounded-full border-4 border-white shadow-lg text-white hover:opacity-90 transition-all duration-300"
                            >
                              <Check size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Profile Info - Enhanced */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 rounded-2xl p-4 border border-primary/10 hover:border-primary/30 dark:border-primary/20 dark:hover:border-primary/40 transition-all duration-300">
                        <p className="text-xs font-bold text-primary dark:text-primary uppercase tracking-widest mb-2">Name</p>
                        <p className="font-semibold text-foreground dark:text-white text-lg">{user.name}</p>
                      </div>

                      <div className="bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 rounded-2xl p-4 border border-primary/10 hover:border-primary/30 dark:border-primary/20 dark:hover:border-primary/40 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail size={14} className="text-primary dark:text-primary" />
                          <p className="text-xs font-bold text-primary dark:text-primary uppercase tracking-widest">Email</p>
                        </div>
                        <p className="font-medium text-foreground dark:text-white break-all text-sm">{user.email}</p>
                      </div>

                      {user.phone && (
                        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-4 border border-primary/10 hover:border-primary/30 transition-all duration-300">
                          <div className="flex items-center gap-2 mb-2">
                            <Phone size={14} className="text-primary" />
                            <p className="text-xs font-bold text-primary uppercase tracking-widest">Phone</p>
                          </div>
                          <p className="font-medium text-foreground">{user.phone}</p>
                        </div>
                      )}

                      {user.address && (
                        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-4 border border-primary/10 hover:border-primary/30 transition-all duration-300">
                          <div className="flex items-start gap-2 mb-2">
                            <MapPin size={14} className="text-primary mt-0.5" />
                            <p className="text-xs font-bold text-primary uppercase tracking-widest">Address</p>
                          </div>
                          <p className="font-medium text-foreground text-sm">{user.address}</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:shadow-lg text-primary-foreground py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Edit2 size={18} />
                      Edit Profile
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    {/* Avatar upload (edit) */}
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">Profile Picture</label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-black/10 border border-white/10">
                          {avatarPreview ? (
                            // preview image
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
                          ) : (user as any).avatar || (user as any).photoURL ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={(user as any).avatar || (user as any).photoURL} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white bg-gradient-to-br from-primary via-accent to-primary">{user.name.charAt(0).toUpperCase()}</div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-2 bg-primary text-white rounded-lg"
                          >
                            Choose
                          </button>
                          <button
                            type="button"
                            onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
                            className="px-3 py-2 bg-muted text-foreground rounded-lg"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background/80 text-foreground font-medium text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background/80 text-foreground font-medium text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wide">
                        Address
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background/80 text-foreground font-medium text-sm sm:text-base"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg text-primary-foreground py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 text-sm sm:text-base"
                      >
                        <Check size={18} />
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Orders Section - Enhanced */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-white/95 to-white/90 dark:from-gray-800/95 dark:to-gray-900/90 backdrop-blur-xl border border-white/50 dark:border-gray-600/50 rounded-3xl shadow-2xl p-6 sm:p-8 hover:shadow-3xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-primary/30 to-accent/30 dark:from-primary/40 dark:to-accent/40 rounded-xl shadow-lg">
                    <Package size={28} className="text-primary dark:text-primary" />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary dark:text-primary">Order History</h2>
                </div>

                {loading ? (
                  <div className="text-center py-16">
                    <Package size={56} className="mx-auto text-foreground/20 mb-4 animate-pulse" />
                    <p className="text-foreground/60 text-lg mb-4">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16">
                    <Package size={56} className="mx-auto text-foreground/20 mb-4" />
                    <p className="text-foreground/60 text-lg mb-4">No orders yet</p>
                    <Link
                      href="/"
                      className="inline-block text-primary hover:text-accent font-semibold hover:underline"
                    >
                      Start shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border-2 border-white/30 dark:border-gray-700/50 rounded-2xl p-4 sm:p-6 hover:border-primary/40 dark:hover:border-primary/50 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm shadow-lg group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                          <div>
                            <p className="font-serif font-bold text-lg text-primary group-hover:text-accent transition-colors">
                              {order.orderId || order.id}
                            </p>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/60 mt-2">
                              <Calendar size={16} />
                              {new Date(order.createdAt || order.orderDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="text-left sm:text-right">
                              <p className="text-xs sm:text-sm text-foreground/60 font-medium">Total Amount</p>
                              <p className="font-serif font-bold text-xl sm:text-2xl text-primary">
                                ₹{order.payment?.amount?.toFixed(2) || "0.00"}
                              </p>
                            </div>
                            <span
                              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold capitalize border ${getStatusColor(order.payment?.status || "pending")}`}
                            >
                              {order.payment?.status || "Pending"}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-white/20 pt-6">
                          <p className="text-xs sm:text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
                            Items Ordered
                          </p>
                          <ul className="space-y-3">
                            {(order.products || order.items || []).map((item: any, idx: number) => (
                              <li
                                key={idx}
                                className="flex items-center gap-4 bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 rounded-lg p-3 sm:p-4 border border-white/20 dark:border-gray-700/50 hover:border-primary/30 dark:hover:border-primary/40 transition-all duration-300"
                              >
                                {/* Product Image */}
                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-white/20 dark:border-gray-700/50 shadow-lg">
                                  <img
                                    src={item.image || '/placeholder.jpg'}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
                                
                                {/* Product Details */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <p className="font-medium text-foreground dark:text-white text-sm sm:text-base truncate">{item.name}</p>
                                      <p className="text-xs sm:text-sm text-foreground/60 dark:text-gray-400 mt-1">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-primary dark:text-primary text-sm sm:text-base whitespace-nowrap">
                                      ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                    </p>
                                  </div>
                                  
                                  {/* Additional Product Info */}
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {item.variant && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary">
                                        {item.variant}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
