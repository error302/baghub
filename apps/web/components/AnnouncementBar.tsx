"use client";

import { useState } from "react";
import { X, Truck, ArrowRight } from "lucide-react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-charcoal text-ivory py-2.5 px-4 relative z-50">
      <div className="container-luxury flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm font-sans font-light tracking-wide">
          <Truck className="w-4 h-4 text-gold" />
          <span>Complimentary worldwide shipping on orders over $500</span>
          <a
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-gold hover:text-gold-light transition-colors ml-2 gold-underline"
          >
            Shop Now
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:text-gold transition-colors"
          aria-label="Close announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
