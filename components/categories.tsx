import { ArrowRight } from "lucide-react"

export default function Categories() {
  const categories = [
    {
      title: "Premium Candles",
      description: "High-end, long-lasting candles in glass jars",
      image: "/premium-luxury-candles-in-glass-jars.jpg",
    },
    {
      title: "Local Candles",
      description: "Affordable, handcrafted candles for everyday charm",
      image: "/handcrafted-local-candles.jpg",
    },
  ]

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
          Explore Our Collections
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.title}
                className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>

              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <h3 className="font-serif text-3xl font-bold mb-2">{category.title}</h3>
                <p className="text-gray-100 mb-6">{category.description}</p>
                <button className="flex items-center gap-2 bg-primary hover:bg-accent text-primary-foreground px-6 py-2 rounded-lg font-semibold transition-all duration-300 w-fit hover:gap-3">
                  Explore <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
