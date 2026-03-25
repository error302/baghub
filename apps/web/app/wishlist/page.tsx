"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  inStock: boolean;
}

const initialWishlist: WishlistItem[] = [
  {
    id: "1",
    name: "Classic Leather Tote",
    price: 299.99,
    image: "/images/products/tote-1.jpg",
    slug: "classic-leather-tote",
    inStock: true,
  },
  {
    id: "2",
    name: "Designer Handbag",
    price: 499.99,
    image: "/images/products/handbag-1.jpg",
    slug: "designer-handbag",
    inStock: true,
  },
  {
    id: "3",
    name: "Travel Backpack",
    price: 189.99,
    image: "/images/products/backpack-1.jpg",
    slug: "travel-backpack",
    inStock: false,
  },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(initialWishlist);
  const addItem = useCartStore((state) => state.addItem);

  const removeFromWishlist = (id: string) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const addToCart = (item: WishlistItem) => {
    addItem({
      id: `${item.id}-default`,
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      color: "Default",
      size: "One Size",
    });
  };

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
        <p className="text-gray-600 mb-8">
          Save items you love to your wishlist and come back to them later.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div key={item.id} className="bg-white border rounded-lg overflow-hidden group">
            {/* Image */}
            <Link href={`/shop/${item.slug}`} className="block relative">
              <div className="aspect-square bg-gray-200 overflow-hidden">
                <div className="w-full h-full bg-gray-300 group-hover:scale-105 transition" />
              </div>
              {!item.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold">Out of Stock</span>
                </div>
              )}
            </Link>

            {/* Details */}
            <div className="p-4">
              <Link href={`/shop/${item.slug}`}>
                <h3 className="font-semibold mb-1 hover:text-gray-600">
                  {item.name}
                </h3>
              </Link>
              <p className="text-lg font-bold mb-4">${item.price.toFixed(2)}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(item)}
                  disabled={!item.inStock}
                  className={`flex-1 py-2 rounded-lg font-semibold text-sm ${
                    item.inStock
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="p-2 border rounded-lg hover:bg-gray-50"
                >
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Shopping */}
      <div className="text-center mt-12">
        <Link
          href="/shop"
          className="inline-block border border-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}