import { Instagram, Facebook, Paintbrush as Pinterest } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-foreground dark:bg-gray-800 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">
              Flamnora <span className="text-accent">✨</span>
            </h3>
            <p className="text-white/80 text-sm">Handcrafted with Love & Light.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="#" className="hover:text-white/100 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Returns
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white">
                <Pinterest size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-sm text-white/80">Copyright © 2025 Flamnora. All Rights Reserved.</p>
            <p className="text-sm bg-gradient-to-r from-pink-200 to-white px-6 py-2 rounded-full font-medium italic text-black shadow-lg hover:from-white hover:to-pink-200 transition-all">
              Developed by ArshXCoder
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
