import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "BagHub - Premium Handbags & Bags",
    template: "%s | BagHub",
  },
  description:
    "Your destination for curated, premium bags online. Shop handbags, backpacks, totes, wallets, and luggage from top brands.",
  keywords: [
    "handbags",
    "backpacks",
    "totes",
    "wallets",
    "luggage",
    "bags",
    "designer bags",
    "luxury bags",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "BagHub",
    title: "BagHub - Premium Handbags & Bags",
    description:
      "Your destination for curated, premium bags online. Shop handbags, backpacks, totes, wallets, and luggage from top brands.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BagHub - Premium Handbags & Bags",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BagHub - Premium Handbags & Bags",
    description:
      "Your destination for curated, premium bags online. Shop handbags, backpacks, totes, wallets, and luggage from top brands.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BagHub",
  url: "https://baghub.com",
  logo: "https://baghub.com/images/logo.png",
  description: "Premium handbags & bags e-commerce platform",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-800-BAGHUB",
    contactType: "customer service",
    availableLanguage: ["English"],
  },
  sameAs: [
    "https://facebook.com/baghub",
    "https://twitter.com/baghub",
    "https://instagram.com/baghub",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <CartDrawer />
          <CookieConsent />
          <footer className="border-t mt-16 py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-lg mb-4">BagHub</h3>
                  <p className="text-gray-600 text-sm">
                    Your destination for curated, premium bags online.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Shop</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                      <a href="/shop?category=handbags" className="hover:text-gray-900">
                        Handbags
                      </a>
                    </li>
                    <li>
                      <a href="/shop?category=backpacks" className="hover:text-gray-900">
                        Backpacks
                      </a>
                    </li>
                    <li>
                      <a href="/shop?category=totes" className="hover:text-gray-900">
                        Totes
                      </a>
                    </li>
                    <li>
                      <a href="/shop?category=wallets" className="hover:text-gray-900">
                        Wallets
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Support</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                      <a href="/contact" className="hover:text-gray-900">
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <a href="/faq" className="hover:text-gray-900">
                        FAQ
                      </a>
                    </li>
                    <li>
                      <a href="/shipping" className="hover:text-gray-900">
                        Shipping Info
                      </a>
                    </li>
                    <li>
                      <a href="/returns" className="hover:text-gray-900">
                        Returns
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                      <a href="/privacy" className="hover:text-gray-900">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="/terms" className="hover:text-gray-900">
                        Terms of Service
                      </a>
                    </li>
                    <li>
                      <a href="/cookies" className="hover:text-gray-900">
                        Cookie Policy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t pt-8 text-center text-gray-600 text-sm">
                <p>&copy; 2025 BagHub. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}