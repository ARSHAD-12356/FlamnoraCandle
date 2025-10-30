"use client"

import { useState, useEffect, useRef } from "react"
import { ShoppingCart, Search, Menu, X, LogOut, User, Moon, Sun } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import CartModal from "./cart-modal"
import ProductDetailsModal from "./product-details-modal"
import { useTheme } from "next-themes"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [mounted, setMounted] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()
  const { cart, addToCart } = useCart()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  // Handle mounting for theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Premium Candles", href: "/premium-candles" },
    { label: "Local Candles", href: "/local-candles" },
    { label: "About", href: "/#about", isScroll: true },
    { label: "Contact", href: "/#contact", isScroll: true },
  ]

  // Search functionality with debouncing
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        if (data.success) {
          setSearchResults(data.products || [])
        }
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    // Debounce search
    const timeoutId = setTimeout(searchProducts, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
        setSearchQuery("")
        setSearchResults([])
      }
    }

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSearchOpen])

  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showProductDetails, setShowProductDetails] = useState(false)

  // Listen for openCart event
  useEffect(() => {
    const handleOpenCart = () => {
      setIsCartOpen(true)
    }
    window.addEventListener('openCart', handleOpenCart)
    return () => window.removeEventListener('openCart', handleOpenCart)
  }, [])

  const handleProductClick = (product: any) => {
    setIsSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
    
    // Set the selected product and open details modal
    setSelectedProduct({...product, isPremium: true}) // You can enhance this to detect premium vs local
    setShowProductDetails(true)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsOpen(false)
  }

  const handleNavClick = (href: string, isScroll: boolean) => {
    if (isScroll) {
      const element = document.getElementById(href.substring(1))
      element?.scrollIntoView({ behavior: "smooth" })
      setIsOpen(false)
    }
  }

  // Hide navbar menu on login/signup pages
  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const showNavMenu = user && !isAuthPage

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <h1 className="font-serif text-2xl font-bold text-primary">
                Flamnora <span className="text-accent">✨</span>
              </h1>
            </Link>

            {/* Desktop Navigation - Only show if authenticated */}
            {showNavMenu && (
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  link.isScroll ? (
                    <button
                      key={link.href}
                      onClick={() => handleNavClick(link.href, true)}
                      className="text-foreground hover:text-primary transition-colors duration-300 text-sm font-medium cursor-pointer"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-foreground hover:text-primary transition-colors duration-300 text-sm font-medium"
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            )}

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              {showNavMenu && (
                <>
                  <div className="relative" ref={searchRef}>
                    <button
                      onClick={() => setIsSearchOpen(!isSearchOpen)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors duration-300"
                    >
                      <Search size={20} className="text-foreground" />
                    </button>

                    {/* Search Dropdown */}
                    {isSearchOpen && (
                      <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-background border border-border rounded-xl shadow-2xl z-50 animate-fade-in">
                        <div className="p-4 border-b border-border">
                          <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                            autoFocus
                          />
                        </div>

                        {/* Search Results */}
                        <div className="max-h-96 overflow-y-auto">
                          {isSearching ? (
                            <div className="p-8 text-center text-muted-foreground">
                              Searching...
                            </div>
                          ) : searchResults.length > 0 ? (
                            <div className="p-2">
                              {searchResults.map((product) => (
                                <button
                                  key={product.id}
                                  onClick={() => handleProductClick(product)}
                                  className="w-full p-3 hover:bg-muted rounded-lg transition-colors duration-200 text-left flex items-center gap-3"
                                >
                                  <img
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-foreground truncate">{product.name}</p>
                                    <p className="text-sm text-primary font-bold">{product.price}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : searchQuery.trim().length >= 2 ? (
                            <div className="p-8 text-center text-muted-foreground">
                              No products found
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors duration-300 relative"
                  >
                    <ShoppingCart size={20} className="text-foreground" />
                    {cart.length > 0 && (
                      <span className="absolute top-1 right-1 w-5 h-5 bg-accent rounded-full text-xs text-white flex items-center justify-center font-bold">
                        {cart.length}
                      </span>
                    )}
                  </button>
                </>
              )}

              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 hover:bg-muted rounded-lg transition-colors duration-300"
                    title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {mounted && theme === "dark" ? (
                      <Sun size={20} className="text-foreground" />
                    ) : (
                      <Moon size={20} className="text-foreground" />
                    )}
                  </button>
                  <Link
                    href="/dashboard"
                    className="p-2 hover:bg-muted rounded-lg transition-colors duration-300"
                    title="Dashboard"
                  >
                    <User size={20} className="text-foreground" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-muted rounded-lg transition-colors duration-300"
                    title="Logout"
                  >
                    <LogOut size={20} className="text-foreground" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors duration-300"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button - Only show if authenticated */}
              {showNavMenu && (
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors duration-300"
                >
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation - Only show if authenticated */}
            {isOpen && showNavMenu && (
            <div className="md:hidden pb-4 space-y-2 animate-fade-in">
              {navLinks.map((link) => (
                link.isScroll ? (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href, true)}
                    className="w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors duration-300"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Product Details Modal from Search */}
      {showProductDetails && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          isPremium={true}
          onClose={() => {
            setShowProductDetails(false)
            setSelectedProduct(null)
          }}
        />
      )}
    </>
  )
}
