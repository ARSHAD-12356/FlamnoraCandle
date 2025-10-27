import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/dbConnect"
import Product from "@/models/Product"

export async function GET(request: NextRequest) {
  try {
    // Get search query parameter
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get("q") || ""

    if (!q) {
      return NextResponse.json({
        success: true,
        products: [],
      })
    }

    // Hardcoded products fallback (from components)
    const hardcodedProducts = [
      {
        id: "1",
        name: "Red Heart Candle",
        container: "Glass Jar",
        burnTime: "90 hrs",
        waxType: "Soy Wax",
        weight: "400g",
        price: "₹500",
        image: "/red-heart-candle-in-glass-jar.jpg",
        description: "A stunning red heart-shaped candle that brings warmth and romance to any space. Made with premium soy wax and infused with a delicate floral fragrance.",
        category: "premium",
      },
      {
        id: "2",
        name: "Ice Ocean Breeze Candle",
        container: "Glass Jar",
        burnTime: "80 hrs",
        waxType: "Soy Wax + Gel Wax",
        weight: "420g",
        price: "₹500",
        image: "/blue-ocean-breeze-candle-luxury.jpg",
        description: "Escape to a coastal paradise with our Ocean Breeze candle. The refreshing scent of sea salt and ocean air creates a calming atmosphere.",
        category: "premium",
      },
      {
        id: "3",
        name: "Ice Coffee Latte Candle",
        container: "Lined Glass Jar",
        burnTime: "85–90 hrs",
        waxType: "Soy Wax + Gel Wax",
        weight: "420g",
        price: "₹500",
        image: "/coffee-latte-scented-candle-luxury.jpg",
        description: "Indulge in the rich aroma of freshly brewed coffee and creamy latte. Perfect for coffee lovers who want to bring café vibes to their home.",
        category: "premium",
      },
      {
        id: "4",
        name: "Big Bubble Candle",
        container: "Glass",
        burnTime: "3–4 hrs",
        waxType: "Soy Wax",
        weight: "138g",
        price: "₹100",
        image: "/bubble-candle-handcrafted.jpg",
        description: "Our signature Big Bubble Candle features a unique bubble design that creates a mesmerizing visual effect as it burns. Perfect for decorative purposes.",
        category: "local",
      },
      {
        id: "5",
        name: "Small Bubble Candle",
        container: "Glass",
        burnTime: "1–2 hrs",
        waxType: "Soy Wax",
        weight: "80g",
        price: "₹1",
        image: "/small-bubble-candle-craft.jpg",
        description: "Compact and charming, our Small Bubble Candle is ideal for gifting or creating a cozy corner. Handcrafted with love and attention to detail.",
        category: "local",
      },
    ]

    // Try to connect to MongoDB
    let products: any[] = []
    try {
      await connectDB()
      
      // Search products in MongoDB with case-insensitive partial match
      const dbProducts = await Product.find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
          { waxType: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } },
        ],
      }).limit(10)

      products = dbProducts.map(p => ({
        id: p._id.toString(),
        name: p.name,
        container: p.container,
        burnTime: p.burnTime,
        waxType: p.waxType,
        weight: p.weight,
        price: p.price,
        image: p.image,
        description: p.description,
        category: p.category,
      }))
    } catch (dbError) {
      console.log("[Search API] MongoDB not available, using hardcoded products")
    }

    // If no MongoDB results, use hardcoded products
    if (products.length === 0) {
      products = hardcodedProducts.filter(p => {
        const query = q.toLowerCase()
        return (
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.waxType.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        )
      })
    }

    console.log("[Search API] Found products:", products.length, "for query:", q)

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
    })
  } catch (error) {
    console.error("[Search API] Error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to search products",
      products: [],
    }, { status: 500 })
  }
}

