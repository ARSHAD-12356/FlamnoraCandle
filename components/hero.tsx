"use client"

import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Hero() {
  const { user } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  const slides = [
    {
      title: "Light Up Your World with Flamnora",
      subtitle: "Explore handcrafted candles made with love and luxury.",
      image: "/luxury-scented-candle-with-warm-glow-in-elegant-gl.jpg",
      description: "Premium soy wax candles",
    },
    {
      title: "Premium Scents for Every Moment",
      subtitle: "Discover our exclusive collection of luxury candles.",
      image: "/collection-of-beautiful-aromatic-candles-with-natu.jpg",
      description: "Handcrafted with passion",
    },
    {
      title: "Handcrafted with Passion",
      subtitle: "Each candle is made with the finest ingredients.",
      image: "/artisan-handmade-candle-with-premium-wax-and-essen.jpg",
      description: "Luxury ambiance",
    },
    {
      title: "Transform Your Space",
      subtitle: "Create the perfect ambiance with Flamnora candles.",
      image: "/elegant-candle-creating-warm-ambient-lighting-in-m.jpg",
      description: "Warm and inviting",
    },
    {
      title: "Aromatic Bliss",
      subtitle: "Experience the perfect blend of scents and warmth.",
      image: "/premium-luxury-candles-in-glass-jars-with-flickeri.jpg",
      description: "Pure relaxation",
    },
  ]

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      try {
        await Promise.all(
          slides.map(
            (slide) =>
              new Promise((resolve) => {
                const img = new Image()
                img.src = slide.image
                img.onload = resolve
              })
          )
        )
        setImagesLoaded(true)
      } catch (error) {
        console.error('Error loading images:', error)
      }
    }
    loadImages()
  }, [])

  // Auto-advance timer
  useEffect(() => {
    if (!imagesLoaded) return

    const timer = setInterval(() => {
      if (!isTransitioning) {
        const newIndex = (currentSlide + 1) % slides.length
        setIsTransitioning(true)
        setCurrentSlide(newIndex)
      }
    }, 6000) // Change slide every 6 seconds to match the longer transition

    return () => clearInterval(timer)
  }, [currentSlide, isTransitioning, imagesLoaded, slides.length])

  // Handle transition state
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning])

  const changeSlide = (newIndex: number) => {
    if (isTransitioning || !imagesLoaded) return
    setIsTransitioning(true)
    setCurrentSlide(newIndex)
  }

  const nextSlide = () => {
    const newIndex = (currentSlide + 1) % slides.length
    changeSlide(newIndex)
  }

  const prevSlide = () => {
    const newIndex = (currentSlide - 1 + slides.length) % slides.length
    changeSlide(newIndex)
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transform transition-all duration-1000 ease-out ${
            index === currentSlide 
              ? "opacity-100 scale-100 z-10" 
              : "opacity-0 scale-110 z-0"
          }`}
          style={{ 
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden'
          }}
        >
          <div 
            className={`w-full h-full absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] ease-out ${
              imagesLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              backgroundImage: `url(${slide.image})`,
              transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center text-white px-4 max-w-3xl mx-auto animate-fade-in-up">
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-balance">
          {slides[currentSlide].title}
        </h2>
        <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-100 text-balance">
          {slides[currentSlide].subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => {
              const element = document.getElementById("premium-candles")
              element?.scrollIntoView({ behavior: "smooth" })
            }}
            className="bg-primary hover:bg-accent text-primary-foreground px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm sm:text-base"
          >
            Shop Now
          </button>
          {!user && (
            <Link
              href="/login"
              className="bg-white/20 hover:bg-white/30 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg backdrop-blur-sm text-sm sm:text-base"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Carousel Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="sm:w-6 sm:h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => changeSlide(index)}
            disabled={isTransitioning}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white w-6 sm:w-8" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
