import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import DiwaliOffer from "@/components/diwali-offer"
import Categories from "@/components/categories"
import PremiumCandles from "@/components/premium-candles"
import LocalCandles from "@/components/local-candles"
import About from "@/components/about"
import Reviews from "@/components/reviews"
import Newsletter from "@/components/newsletter"
import Footer from "@/components/footer"
import Contact from "@/components/contact"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <DiwaliOffer />
      <Categories />
      <PremiumCandles />
      <LocalCandles />
      <About />
      <Contact />
      <Reviews />
      <Newsletter />
      <Footer />
    </main>
  )
}
