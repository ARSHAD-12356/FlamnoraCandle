import ProductCard from "./product-card"

export default function PremiumCandles() {
  const products = [
    {
      id: 1,
      name: "Red Heart Candle",
      container: "Glass Jar",
      burnTime: "90 hrs",
      waxType: "Soy Wax",
      weight: "400g",
      price: "₹500",
      image: "/red-heart-candle-in-glass-jar.jpg",
      description:
        "A stunning red heart-shaped candle that brings warmth and romance to any space. Made with premium soy wax and infused with a delicate floral fragrance.",
    },
    {
      id: 2,
      name: "Ice Ocean Breeze Candle",
      container: "Glass Jar",
      burnTime: "80 hrs",
      waxType: "Soy Wax + Gel Wax",
      weight: "420g",
      price: "₹500",
      image: "/blue-ocean-breeze-candle-luxury.jpg",
      description:
        "Escape to a coastal paradise with our Ocean Breeze candle. The refreshing scent of sea salt and ocean air creates a calming atmosphere.",
    },
    {
      id: 3,
      name: "Ice Coffee Latte Candle",
      container: "Lined Glass Jar",
      burnTime: "85–90 hrs",
      waxType: "Soy Wax + Gel Wax",
      weight: "420g",
      price: "₹500",
      image: "/coffee-latte-scented-candle-luxury.jpg",
      description:
        "Indulge in the rich aroma of freshly brewed coffee and creamy latte. Perfect for coffee lovers who want to bring café vibes to their home.",
    },
  ]

  return (
    <section id="premium-candles" className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">Premium Candles</h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Handcrafted with premium soy wax and pure craftsmanship to bring warmth, fragrance, and tranquility to your
          space.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <ProductCard product={product} isPremium={true} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
