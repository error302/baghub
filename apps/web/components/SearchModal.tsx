"use client";

import { useState } from "react";
import Link from "next/link";

const products = [
  {
    id: "1",
    name: "Classic Leather Tote",
    slug: "classic-leather-tote",
    price: 299.99,
    category: "Totes",
  },
  {
    id: "2",
    name: "Designer Handbag",
    slug: "designer-handbag",
    price: 499.99,
    category: "Handbags",
  },
  {
    id: "3",
    name: "Travel Backpack",
    slug: "travel-backpack",
    price: 189.99,
    category: "Backpacks",
  },
  {
    id: "4",
    name: "Slim Wallet",
    slug: "slim-wallet",
    price: 79.99,
    category: "Wallets",
  },
  {
    id: "5",
    name: "Weekend Duffel",
    slug: "weekend-duffel",
    price: 159.99,
    category: "Luggage",
  },
  {
    id: "6",
    name: "Crossbody Bag",
    slug: "crossbody-bag",
    price: 129.99,
    category: "Handbags",
  },
  {
    id: "7",
    name: "Kids Backpack",
    slug: "kids-backpack",
    price: 49.99,
    category: "Kids",
  },
  {
    id: "8",
    name: "Canvas Tote",
    slug: "canvas-tote",
    price: 89.99,
    category: "Totes",
  },
];

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");

  const results = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Search Modal */}
      <div className="fixed inset-x-0 top-0 z-50 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 outline-none text-lg"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {query && results.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No products found for "{query}"
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded">
                      <div className="w-full h-full bg-gray-300 rounded" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.category}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${product.price.toFixed(2)}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Start typing to search products
              </div>
            )}
          </div>

          {/* Quick Links */}
          {!query && (
            <div className="p-4 border-t">
              <p className="text-sm text-gray-500 mb-2">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {["Totes", "Handbags", "Backpacks", "Wallets"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}