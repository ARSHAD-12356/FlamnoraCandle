export default function About() {
  return (
    <section id="about" className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="animate-fade-in-up">
            <img
              src="/candle-making-workspace-aesthetic.jpg"
              alt="Flamnora workspace"
              className="w-full rounded-2xl shadow-lg"
            />
          </div>

          {/* Content */}
          <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">About Flamnora</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              At Flamnora, we believe every flame tells a story. Our handcrafted candles are made with premium soy wax
              and pure craftsmanship to bring warmth, fragrance, and tranquility to your space.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Each candle is carefully created with attention to detail, ensuring the highest quality and
              longest-lasting burn time. We're committed to sustainability and creating products that bring joy to your
              home.
            </p>
            <button className="bg-primary hover:bg-accent text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
