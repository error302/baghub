import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import AuthProvider from "@/components/AuthProvider";
import CartDrawer from "@/components/CartDrawer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BagHub - Premium Handbags & Bags",
  description: "Your destination for curated, premium bags online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <header className="border-b">
            <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold">
                BagHub
              </Link>
              <div className="flex items-center gap-6">
                <Link href="/shop" className="hover:text-gray-600">
                  Shop
                </Link>
                <Link href="/cart" className="hover:text-gray-600">
                  Cart
                </Link>
                <Link href="/account" className="hover:text-gray-600">
                  Account
                </Link>
              </div>
            </nav>
          </header>
          <main>{children}</main>
          <CartDrawer />
          <footer className="border-t mt-16 py-8">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>&copy; 2025 BagHub. All rights reserved.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}