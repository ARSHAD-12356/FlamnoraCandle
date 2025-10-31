import ProductCard from "./product-card"

export default function LocalCandles() {
  const products = [
    {
      id: 1,
      name: "Big Bubble Candle",
      burnTime: "3–4 hrs",
      waxType: "Soy Wax",
      moq: "20 Pcs",
      weight: "138g",
      price: "₹100",
      image: "/bubble-candle-handcrafted.jpg",
      description:
        "Our signature Big Bubble Candle features a unique bubble design that creates a mesmerizing visual effect as it burns. Perfect for decorative purposes.",
    },
    {
      id: 2,
      name: "Small Bubble Candle",
      burnTime: "1–2 hrs",
      waxType: "Soy Wax",
      moq: "30 Pcs",
      weight: "80g",
      price: "₹40",
      image: "/small-bubble-candle-craft.jpg",
      description:
        "Compact and charming, our Small Bubble Candle is ideal for gifting or creating a cozy corner. Handcrafted with love and attention to detail.",
    },
  ]

  return (
    <section id="local-candles" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">Local Candles</h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Affordable, handcrafted candles perfect for everyday charm and gifting.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {products.map((product, index) => (
            <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <ProductCard product={product} isPremium={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
