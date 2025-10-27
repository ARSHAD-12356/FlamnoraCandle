"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      message:
        "The Red Heart Candle is absolutely stunning! The scent is divine and it burns so evenly. Highly recommend!",
    },
    {
      name: "Priya Sharma",
      rating: 5,
      message: "Flamnora candles are my go-to gift. The quality is exceptional and the packaging is so elegant.",
    },
    {
      name: "Michael Chen",
      rating: 5,
      message:
        "Best candles I've ever purchased. The Ice Ocean Breeze scent transforms my entire room. Worth every penny!",
    },
    {
      name: "Emma Wilson",
      rating: 5,
      message: "Absolutely love the craftsmanship. Each candle feels premium and the burn time is incredible.",
    },
  ]

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
          Customer Reviews
        </h2>

        <div className="relative">
          {/* Review Card */}
          <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 animate-fade-in">
            <div className="flex gap-1 mb-4">
              {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                <Star key={i} size={20} className="fill-accent text-accent" />
              ))}
            </div>
            <p className="text-lg text-muted-foreground mb-6 italic">"{reviews[currentIndex].message}"</p>
            <p className="font-semibold text-foreground text-lg">— {reviews[currentIndex].name}</p>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevReview}
              className="p-3 rounded-full bg-primary hover:bg-accent text-primary-foreground transition-all duration-300 hover:shadow-lg"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextReview}
              className="p-3 rounded-full bg-primary hover:bg-accent text-primary-foreground transition-all duration-300 hover:shadow-lg"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-primary w-8" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
