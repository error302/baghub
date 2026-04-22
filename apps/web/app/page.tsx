"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowDown, Sparkles, Award, Truck, RotateCcw } from "lucide-react";
import ProductCard from "@/components/ProductCard";

// Mock data for demonstration
const featuredProduct = {
  id: "1",
  name: "Silk Evening Gown",
  slug: "silk-evening-gown",
  price: 2850,
  images: [{ url: "/images/products/gown.jpg" }],
  category: "Clothing",
  isNew: true,
};

const newArrivals = [
  {
    id: "2",
    name: "Quilted Leather Handbag",
    slug: "quilted-leather-handbag",
    price: 1850,
    images: [{ url: "/images/products/bag1.jpg" }],
    category: "Handbags",
    isNew: true,
  },
  {
    id: "3",
    name: "Strappy Satin Heels",
    slug: "strappy-satin-heels",
    price: 985,
    images: [{ url: "/images/products/shoes1.jpg" }],
    category: "Shoes",
    isNew: true,
  },
  {
    id: "4",
    name: "Cashmere Coat",
    slug: "cashmere-coat",
    price: 3200,
    images: [{ url: "/images/products/coat.jpg" }],
    category: "Clothing",
    isNew: true,
  },
  {
    id: "5",
    name: "Pearl Clutch",
    slug: "pearl-clutch",
    price: 1250,
    images: [{ url: "/images/products/clutch.jpg" }],
    category: "Handbags",
    isNew: true,
  },
];

const categories = [
  {
    name: "Clothing",
    description: "Elegant silhouettes",
    href: "/shop?category=clothing",
    icon: (
      <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M30 20 L20 30 L20 80 L40 80 L40 50 L60 50 L60 80 L80 80 L80 30 L70 20 Q50 25 30 20" />
        <circle cx="50" cy="15" r="8" />
        <path d="M40 25 L60 25" />
      </svg>
    ),
  },
  {
    name: "Handbags",
    description: "Timeless accessories",
    href: "/shop?category=handbags",
    icon: (
      <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M20 40 L25 80 L75 80 L80 40 Z" />
        <path d="M30 40 Q30 20 50 20 Q70 20 70 40" />
        <path d="M50 20 L50 25" />
      </svg>
    ),
  },
  {
    name: "Shoes",
    description: "Sophisticated steps",
    href: "/shop?category=shoes",
    icon: (
      <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M20 70 Q30 55 50 55 Q70 55 85 65 L85 75 L20 75 Z" />
        <path d="M50 55 L55 35 Q60 30 70 35 L75 55" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen grid lg:grid-cols-2">
        {/* Left - Dark Editorial */}
        <div className="relative bg-charcoal text-ivory flex items-center justify-center p-8 lg:p-16 order-2 lg:order-1">
          <div className="relative z-10 max-w-lg text-center lg:text-left">
            <span className="text-caption text-gold mb-6 block animate-fade-slide-up">
              Autumn Winter 2025
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[0.95] mb-8 animate-fade-slide-up delay-100">
              Timeless
              <br />
              Elegance
              <br />
              <span className="text-gold">Redefined</span>
            </h1>
            <p className="text-cream/80 text-lg font-light mb-10 max-w-md mx-auto lg:mx-0 animate-fade-slide-up delay-200">
              Discover our curated collection of haute couture pieces, meticulously crafted for the modern sophisticate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-slide-up delay-300">
              <Link href="/shop" className="btn btn-primary">
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/about" className="btn btn-outline text-ivory border-ivory hover:bg-ivory hover:text-charcoal">
                Our Story
              </Link>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute bottom-8 left-8 text-cream/40 text-sm">
            <span className="text-caption">Since 2015</span>
          </div>
          <div className="absolute bottom-8 right-8">
            <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent" />
          </div>
        </div>

        {/* Right - Featured Product */}
        <div className="relative bg-cream min-h-[60vh] lg:min-h-screen order-1 lg:order-2">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sand/20 to-transparent" />
          </div>
          <div className="relative h-full flex items-center justify-center p-8 lg:p-16">
            <div className="relative w-full max-w-md aspect-[3/4]">
              <div className="absolute inset-0 bg-sand/30" />
              <div className="absolute inset-0 flex items-center justify-center text-muted">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-gold/50" />
                  <p className="font-serif text-2xl">Featured Piece</p>
                  <p className="text-sm mt-2">Image Placeholder</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating Label */}
          <div className="absolute bottom-12 left-8 right-8 lg:left-16 lg:right-auto">
            <div className="bg-white p-6 shadow-lg max-w-xs">
              <span className="text-caption text-muted">Featured</span>
              <h3 className="font-serif text-2xl mt-1 mb-2">Silk Evening Gown</h3>
              <p className="font-serif text-gold text-xl">$2,850</p>
              <Link 
                href="/shop/silk-evening-gown" 
                className="inline-flex items-center gap-2 mt-4 text-sm hover:text-gold transition-colors gold-underline"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-12 border-b border-sand">
        <div className="container-luxury">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Award, label: "Artisan Crafted", desc: "Handmade excellence" },
              { icon: Truck, label: "Free Shipping", desc: "On orders $500+" },
              { icon: RotateCcw, label: "Easy Returns", desc: "30-day returns" },
              { icon: Sparkles, label: "Exclusive Design", desc: "Limited editions" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="space-y-2">
                <Icon className="w-6 h-6 mx-auto text-gold" />
                <p className="font-medium text-sm">{label}</p>
                <p className="text-sm text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="section-padding bg-ivory">
        <div className="container-luxury">
          <div className="text-center mb-16">
            <span className="text-caption text-muted mb-4 block">Curated Categories</span>
            <h2 className="font-serif text-4xl md:text-5xl font-light">
              Shop by Category
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative bg-cream p-12 md:p-16 flex flex-col items-center text-center hover:bg-sand/30 transition-colors duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-charcoal/30 group-hover:text-gold/60 transition-colors duration-500 mb-6">
                  {category.icon}
                </div>
                <h3 className="font-serif text-2xl font-light mb-2 group-hover:text-gold transition-colors">
                  {category.name}
                </h3>
                <p className="text-muted text-sm">{category.description}</p>
                <div className="mt-6 overflow-hidden">
                  <span className="inline-flex items-center gap-2 text-sm opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section-padding bg-charcoal text-ivory">
        <div className="container-luxury">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-caption text-gold mb-4 block">Just Arrived</span>
              <h2 className="font-serif text-4xl md:text-5xl font-light">
                New Arrivals
              </h2>
            </div>
            <Link 
              href="/shop?sort=newest" 
              className="inline-flex items-center gap-2 text-sm hover:text-gold transition-colors gold-underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} variant="minimal" />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Story Strip */}
      <section className="relative min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-cream">
          <div className="absolute inset-0 bg-gradient-to-r from-ivory/90 via-ivory/70 to-transparent z-10" />
        </div>
        <div className="container-luxury relative z-20">
          <div className="max-w-xl">
            <span className="text-caption text-muted mb-6 block">The Maison Élise Story</span>
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-6 leading-tight">
              Crafted with Passion,
              <br />
              Worn with Pride
            </h2>
            <p className="text-lg text-muted font-light mb-8 leading-relaxed">
              Each piece in our collection is a testament to the art of slow fashion. 
              We partner with master artisans across Europe, preserving traditional 
              techniques while embracing contemporary design sensibilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/about" className="btn btn-primary">
                Discover Our Story
              </Link>
              <Link href="/sustainability" className="btn btn-outline">
                Sustainability
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding bg-gold text-white">
        <div className="container-luxury text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-4">
            Join the Maison
          </h2>
          <p className="text-white/80 max-w-md mx-auto mb-8 font-light">
            Subscribe to receive exclusive offers, early access to new collections, 
            and insider styling tips from our fashion experts.
          </p>
          <form className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white/10 border border-white/30 text-white placeholder:text-white/50 outline-none focus:border-white transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-gold font-medium hover:bg-ivory transition-colors"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-white/60 mt-6">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </section>
    </div>
  );
}
