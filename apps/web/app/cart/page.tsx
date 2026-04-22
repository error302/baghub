"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ArrowLeft, Gift, Truck, AlertCircle } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [showRemovedMessage, setShowRemovedMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = total;
  const shipping = subtotal > 500 ? 0 : 25;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const finalTotal = subtotal + shipping - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "MAISON10") {
      setPromoApplied(true);
    }
  };

  const handleRemove = (itemId: string, itemName: string) => {
    removeItem(itemId);
    setShowRemovedMessage(itemName);
    setTimeout(() => setShowRemovedMessage(null), 3000);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-lg">Loading your bag...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory">
        <div className="container-luxury py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="w-20 h-20 text-sand mx-auto mb-6" />
            <h1 className="font-serif text-3xl font-light mb-4">Your bag is empty</h1>
            <p className="text-muted mb-8">
              Discover our curated collection of luxury fashion and add your favorites to your bag.
            </p>
            <Link href="/shop" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Page Header */}
      <div className="bg-cream border-b border-sand">
        <div className="container-luxury py-8">
          <nav className="flex items-center gap-2 text-sm text-muted mb-4">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-charcoal">Shopping Bag</span>
          </nav>
          <h1 className="font-serif text-4xl font-light">Your Bag ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</h1>
        </div>
      </div>

      {/* Removed Message */}
      {showRemovedMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-charcoal text-ivory px-6 py-3 z-50 animate-fade-in shadow-lg">
          &quot;{showRemovedMessage}&quot; removed from bag
        </div>
      )}

      <div className="container-luxury py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 pb-6 border-b border-sand">
                  {/* Image */}
                  <Link href={`/shop/${item.id}`} className="relative w-32 h-40 bg-cream flex-shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-sand" />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/shop/${item.id}`} className="font-serif text-lg hover:text-gold transition-colors">
                          {item.name}
                        </Link>
                        <p className="text-sm text-muted mt-1">{item.color} / Size {item.size}</p>
                      </div>
                      <p className="font-serif text-xl">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>

                    {/* Quantity and Remove */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border border-sand">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-10 h-10 flex items-center justify-center hover:bg-cream transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-cream transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id, item.name)}
                        className="flex items-center gap-2 text-sm text-muted hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
              <Link href="/shop" className="inline-flex items-center gap-2 text-sm hover:text-gold transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-sm text-muted hover:text-red-600 transition-colors"
              >
                Clear Bag
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-cream p-8">
              <h2 className="font-serif text-2xl font-light mb-6">Order Summary</h2>
              
              {/* Promo Code */}
              <div className="mb-6 pb-6 border-b border-sand">
                <label className="text-sm font-medium mb-2 block">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-3 border border-sand bg-white outline-none focus:border-gold transition-colors text-sm"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-6 py-3 border border-charcoal text-sm hover:bg-charcoal hover:text-ivory transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-green-600 text-sm mt-2">Promo code applied: -10%</p>
                )}
                <p className="text-xs text-muted mt-2">Try &quot;MAISON10&quot; for 10% off</p>
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Truck className="w-4 h-4" />
                  {subtotal >= 500 ? (
                    <span>You qualify for free shipping!</span>
                  ) : (
                    <span>Add ${(500 - subtotal).toFixed(0)} more for free shipping</span>
                  )}
                </div>
              </div>

              <div className="border-t border-sand mt-6 pt-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-serif text-2xl">${finalTotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted mt-1">Including VAT</p>
              </div>

              <Link href="/checkout" className="btn btn-primary w-full mt-6">
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 text-xs text-muted">
                  <Gift className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Complimentary gift wrapping available at checkout</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-muted">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
