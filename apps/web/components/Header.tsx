"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import SearchModal from "@/components/SearchModal";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getItemCount, openCart } = useCartStore();
  const itemCount = getItemCount();

  return (
    <>
      <header className="border-b sticky top-0 bg-white z-30">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
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
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            BagHub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/shop" className="hover:text-gray-600">
              Shop
            </Link>
            <Link href="/shop?category=handbags" className="hover:text-gray-600">
              Handbags
            </Link>
            <Link href="/shop?category=backpacks" className="hover:text-gray-600">
              Backpacks
            </Link>
            <Link href="/shop?category=totes" className="hover:text-gray-600">
              Totes
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Account - Hidden on mobile */}
            <Link
              href="/account"
              className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg"
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>

            {/* Wishlist - Hidden on mobile */}
            <Link
              href="/wishlist"
              className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg"
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="p-2 hover:bg-gray-100 rounded-lg relative"
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="container mx-auto px-4 py-4 space-y-4">
              <Link
                href="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 hover:text-gray-600"
              >
                Shop All
              </Link>
              <Link
                href="/shop?category=handbags"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 hover:text-gray-600"
              >
                Handbags
              </Link>
              <Link
                href="/shop?category=backpacks"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 hover:text-gray-600"
              >
                Backpacks
              </Link>
              <Link
                href="/shop?category=totes"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 hover:text-gray-600"
              >
                Totes
              </Link>
              <Link
                href="/shop?category=wallets"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 hover:text-gray-600"
              >
                Wallets
              </Link>
              <div className="border-t pt-4 mt-4">
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 hover:text-gray-600"
                >
                  My Account
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 hover:text-gray-600"
                >
                  Wishlist
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 hover:text-gray-600"
                >
                  Order History
                </Link>
              </div>
              <div className="border-t pt-4 mt-4">
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 hover:text-gray-600"
                >
                  Contact Us
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 hover:text-gray-600"
                >
                  FAQ
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}