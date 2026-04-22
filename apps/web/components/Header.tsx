"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, ShoppingBag, User, Menu, X, Heart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: session } = useSession();
  const { items, setIsOpen } = useCartStore();

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const leftNavLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/shop?category=clothing", label: "Clothing" },
    { href: "/shop?category=handbags", label: "Handbags" },
  ];

  const rightNavLinks = [
    { href: "/shop?category=shoes", label: "Shoes" },
    { href: "/about", label: "Our Story" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-ivory/95 backdrop-blur-md shadow-sm py-4"
            : "bg-transparent py-6"
        }`}
        style={{ top: isScrolled ? 0 : "40px" }}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between">
            {/* Left Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-8">
              {leftNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-caption text-charcoal hover:text-gold transition-colors gold-underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Center Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl md:text-3xl font-light tracking-wide text-charcoal hover:text-gold transition-colors"
            >
              Maison Élise
            </Link>

            {/* Right Navigation - Desktop */}
            <div className="hidden lg:flex items-center gap-6">
              <nav className="flex items-center gap-8 mr-4">
                {rightNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-caption text-charcoal hover:text-gold transition-colors gold-underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:text-gold transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

                <Link
                  href="/wishlist"
                  className="p-2 hover:text-gold transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                </Link>

                {session ? (
                  <div className="relative group">
                    <button className="p-2 hover:text-gold transition-colors">
                      <User className="w-5 h-5" />
                    </button>
                    <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <div className="bg-white shadow-lg border border-sand/30 py-2 min-w-[180px]">
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-sm hover:bg-cream transition-colors"
                        >
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          className="block px-4 py-2 text-sm hover:bg-cream transition-colors"
                        >
                          Orders
                        </Link>
                        <button
                          onClick={() => signOut()}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-cream transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="p-2 hover:text-gold transition-colors"
                    aria-label="Account"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )}

                <button
                  onClick={() => setIsOpen(true)}
                  className="p-2 hover:text-gold transition-colors relative"
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-white text-xs rounded-full flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-white text-xs rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 bg-ivory p-6 animate-slide-in-right">
            <div className="flex justify-between items-center mb-8">
              <span className="font-serif text-2xl font-light">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {[
                ...leftNavLinks,
                ...rightNavLinks,
                { href: "/wishlist", label: "Wishlist" },
                ...(session
                  ? [
                      { href: "/account", label: "My Account" },
                      { href: "/account/orders", label: "Orders" },
                    ]
                  : [{ href: "/login", label: "Sign In" }]),
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-sans font-light py-2 border-b border-sand/30 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {session && (
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-lg font-sans font-light py-2 text-left text-red-600 hover:text-red-700 transition-colors"
                >
                  Sign Out
                </button>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Search Modal Trigger */}
      {isSearchOpen && (
        <SearchModal onClose={() => setIsSearchOpen(false)} />
      )}
    </>
  );
}

// Search Modal Component
function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-charcoal/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 top-0 bg-ivory p-6 animate-fade-slide-down">
        <div className="container-luxury">
          <div className="flex items-center gap-4">
            <Search className="w-6 h-6 text-muted" />
            <input
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-2xl font-serif font-light bg-transparent outline-none placeholder:text-muted"
              autoFocus
            />
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>
          {query && (
            <div className="mt-6 pt-6 border-t border-sand">
              <p className="text-muted text-sm mb-4">Popular searches</p>
              <div className="flex flex-wrap gap-3">
                {["Evening Dresses", "Leather Bags", "Designer Heels", "Silk Scarves"].map(
                  (term) => (
                    <Link
                      key={term}
                      href={`/shop?search=${term}`}
                      onClick={onClose}
                      className="px-4 py-2 bg-cream text-sm hover:bg-sand transition-colors"
                    >
                      {term}
                    </Link>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
