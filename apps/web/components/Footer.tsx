"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: "New Arrivals", href: "/shop?sort=newest" },
      { label: "Clothing", href: "/shop?category=clothing" },
      { label: "Handbags", href: "/shop?category=handbags" },
      { label: "Shoes", href: "/shop?category=shoes" },
      { label: "Accessories", href: "/shop?category=accessories" },
      { label: "Sale", href: "/shop?sale=true" },
    ],
    help: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "FAQ", href: "/faq" },
      { label: "Track Order", href: "/account/orders" },
    ],
    company: [
      { label: "Our Story", href: "/about" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
  };

  return (
    <footer className="bg-charcoal text-ivory">
      {/* Newsletter Section */}
      <div className="border-b border-slate">
        <div className="container-luxury py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-serif text-3xl md:text-4xl font-light mb-3">
                Join the Maison
              </h3>
              <p className="text-cream/70 font-light">
                Subscribe to receive exclusive offers, early access to new collections,
                and insider styling tips.
              </p>
            </div>
            <form className="flex gap-0">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent border-b border-sand px-0 py-4 text-ivory placeholder:text-muted outline-none focus:border-gold transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gold text-white hover:bg-gold-light transition-colors flex items-center gap-2"
              >
                Subscribe
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-luxury py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <Link
              href="/"
              className="font-serif text-3xl font-light inline-block mb-6"
            >
              Maison Élise
            </Link>
            <p className="text-cream/70 text-sm font-light leading-relaxed mb-6 max-w-xs">
              Timeless elegance meets contemporary design. Curated luxury fashion for the
              modern sophisticate.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-10 h-10 border border-slate flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-caption text-gold mb-6">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/70 hover:text-ivory transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-caption text-gold mb-6">Help</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/70 hover:text-ivory transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-caption text-gold mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/70 hover:text-ivory transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate">
        <div className="container-luxury py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-cream/50">
            <p>&copy; {currentYear} Maison Élise. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-ivory transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-ivory transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-ivory transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
