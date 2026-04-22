"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowRight, TrendingUp } from "lucide-react";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
}

export default function SearchModal({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches] = useState([
    "Evening Dresses",
    "Leather Handbags",
    "Designer Heels",
    "Silk Scarves",
  ]);

  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/products?search=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setResults(data.products?.slice(0, 6) || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, searchProducts]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/90 backdrop-blur-md animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="absolute inset-x-0 top-0 bg-ivory min-h-[60vh] max-h-[90vh] overflow-auto animate-fade-slide-down">
        <div className="container-luxury py-8">
          {/* Search Input */}
          <div className="flex items-center gap-4 pb-6 border-b border-sand">
            <Search className="w-6 h-6 text-gold" />
            <input
              type="text"
              placeholder="Search for products, categories, or styles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-2xl md:text-3xl font-serif font-light bg-transparent outline-none placeholder:text-muted"
              autoFocus
            />
            <button
              onClick={handleClose}
              className="p-2 hover:text-gold transition-colors"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="py-8">
            {query ? (
              // Search Results
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-caption text-muted">
                    {isLoading ? "Searching..." : `${results.length} results found`}
                  </h3>
                  <Link
                    href={`/shop?search=${encodeURIComponent(query)}`}
                    onClick={handleClose}
                    className="text-sm text-gold hover:text-gold-light transition-colors flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="space-y-3">
                        <div className="aspect-[3/4] bg-cream animate-shimmer" />
                        <div className="h-4 bg-cream w-3/4 animate-shimmer" />
                        <div className="h-4 bg-cream w-1/2 animate-shimmer" />
                      </div>
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/shop/${product.slug}`}
                        onClick={handleClose}
                        className="group"
                      >
                        <div className="relative aspect-[3/4] bg-cream mb-3 overflow-hidden">
                          <Image
                            src={product.image || "/placeholder-product.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <p className="text-caption text-muted">{product.category}</p>
                        <h4 className="font-sans text-sm font-medium group-hover:text-gold transition-colors line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="font-serif text-base mt-1">
                          ${product.price.toLocaleString()}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted mb-4">
                      No results found for &quot;{query}&quot;
                    </p>
                    <p className="text-sm text-muted">
                      Try checking your spelling or browse our categories
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Default View
              <div className="grid md:grid-cols-2 gap-12">
                {/* Recent Searches */}
                <div>
                  <h3 className="text-caption text-muted mb-6 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Trending Searches
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 bg-cream text-sm hover:bg-sand transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Categories */}
                <div>
                  <h3 className="text-caption text-muted mb-6">Popular Categories</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: "Clothing", count: 120 },
                      { name: "Handbags", count: 45 },
                      { name: "Shoes", count: 78 },
                      { name: "Accessories", count: 56 },
                    ].map((category) => (
                      <Link
                        key={category.name}
                        href={`/shop?category=${category.name.toLowerCase()}`}
                        onClick={handleClose}
                        className="p-4 bg-cream hover:bg-sand transition-colors group"
                      >
                        <span className="block font-sans font-medium group-hover:text-gold transition-colors">
                          {category.name}
                        </span>
                        <span className="text-sm text-muted">
                          {category.count} items
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
