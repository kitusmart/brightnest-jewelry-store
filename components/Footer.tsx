import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#fbf7ed] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* 1. BRAND STORY */}
          <div className="space-y-6">
            <h2 className="text-2xl font-serif tracking-widest text-[#D4AF37]">BRIGHTNEST</h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Crafting timeless elegance for the modern woman. Our jewelry is designed to elevate your shine, every single day.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-[#D4AF37] hover:text-black transition"><Instagram size={20} /></Link>
              <Link href="#" className="text-[#D4AF37] hover:text-black transition"><Facebook size={20} /></Link>
              <Link href="#" className="text-[#D4AF37] hover:text-black transition"><Twitter size={20} /></Link>
            </div>
          </div>

          {/* 2. SHOP LINKS */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-900 mb-6">Collections</h3>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="/?category=necklaces" className="hover:text-[#D4AF37] transition">Necklaces</Link></li>
              <li><Link href="/?category=earrings" className="hover:text-[#D4AF37] transition">Earrings</Link></li>
              <li><Link href="/?category=rings" className="hover:text-[#D4AF37] transition">Rings</Link></li>
              <li><Link href="/?category=bangles" className="hover:text-[#D4AF37] transition">Bangles</Link></li>
            </ul>
          </div>

          {/* 3. CUSTOMER CARE */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-900 mb-6">Client Services</h3>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="/orders" className="hover:text-[#D4AF37] transition">My Orders</Link></li>
              <li><Link href="/policies" className="hover:text-[#D4AF37] transition">Shipping & Returns</Link></li>
              <li><Link href="/policies" className="hover:text-[#D4AF37] transition">Jewelry Care</Link></li>
              <li><Link href="#" className="hover:text-[#D4AF37] transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* 4. NEWSLETTER */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-900 mb-6">Join the Nest</h3>
            <p className="text-sm text-zinc-500">Subscribe for early access to new collections and styling tips.</p>
            <form className="flex gap-2 border-b border-zinc-200 pb-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-transparent text-sm w-full outline-none focus:placeholder-transparent"
              />
              <button type="submit" className="text-[#D4AF37] hover:text-black transition uppercase text-[10px] font-bold tracking-widest">Join</button>
            </form>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-[#fbf7ed] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
            © {new Date().getFullYear()} Brightnest Jewelry. All rights reserved.
          </p>
          <div className="flex gap-6 text-[10px] text-zinc-400 uppercase tracking-widest">
            <Link href="/policies" className="hover:text-black">Privacy Policy</Link>
            <Link href="/policies" className="hover:text-black">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}