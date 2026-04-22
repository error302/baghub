"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-ivory z-50 shadow-2xl transform transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-sand">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-gold" />
              <h2 className="font-serif text-xl font-light">
                Your Bag ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:text-gold transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <ShoppingBag className="w-16 h-16 text-sand mb-6" />
              <h3 className="font-serif text-2xl font-light mb-3">Your bag is empty</h3>
              <p className="text-muted text-center mb-8 max-w-xs">
                Discover our curated collection of luxury fashion and add your favorites.
              </p>
              <Link
                href="/shop"
                onClick={() => setIsOpen(false)}
                className="btn btn-primary"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-6 border-b border-sand/50 last:border-0"
                  >
                    {/* Image */}
                    <Link
                      href={`/shop/${item.id}`}
                      onClick={() => setIsOpen(false)}
                      className="relative w-24 h-32 bg-cream flex-shrink-0"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col">
                      <Link
                        href={`/shop/${item.id}`}
                        onClick={() => setIsOpen(false)}
                        className="font-sans text-sm font-medium hover:text-gold transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-caption text-muted mt-1">
                        {item.color} / Size {item.size}
                      </p>
                      <p className="font-serif text-lg mt-2">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border border-sand">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-cream transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-cream transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-muted hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-sand p-6 space-y-4 bg-cream/30">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-charcoal">Subtotal</span>
                  <span className="font-serif text-xl">
                    ${total.toLocaleString()}
                  </span>
                </div>

                <p className="text-sm text-muted">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-primary w-full"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Continue Shopping */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 text-center text-sm tracking-widest uppercase hover:text-gold transition-colors"
                >
                  Continue Shopping
                </button>

                {/* Clear Cart */}
                <button
                  onClick={clearCart}
                  className="w-full py-2 text-center text-xs text-muted hover:text-red-600 transition-colors"
                >
                  Clear Bag
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
