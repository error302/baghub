import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Maison Élise | Luxury Fashion Boutique",
    template: "%s | Maison Élise",
  },
  description:
    "Discover timeless elegance at Maison Élise. Curated luxury fashion, handbags, shoes, and accessories. Free worldwide shipping on orders over $500.",
  keywords: [
    "luxury fashion",
    "designer clothing",
    "handbags",
    "shoes",
    "accessories",
    "Maison Élise",
    "boutique",
    "haute couture",
    "premium fashion",
    "elegant style",
  ],
  authors: [{ name: "Maison Élise" }],
  creator: "Maison Élise",
  publisher: "Maison Élise",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://maisonelise.com",
    siteName: "Maison Élise",
    title: "Maison Élise | Luxury Fashion Boutique",
    description:
      "Discover timeless elegance at Maison Élise. Curated luxury fashion, handbags, shoes, and accessories.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Maison Élise - Luxury Fashion Boutique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison Élise | Luxury Fashion Boutique",
    description:
      "Discover timeless elegance at Maison Élise. Curated luxury fashion, handbags, shoes, and accessories.",
    images: ["/images/og-image.jpg"],
    creator: "@maisonelise",
  },
  alternates: {
    canonical: "https://maisonelise.com",
  },
  category: "fashion",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Maison Élise",
  url: "https://maisonelise.com",
  logo: "https://maisonelise.com/images/logo.png",
  description: "Luxury fashion boutique offering curated designer clothing, handbags, shoes, and accessories.",
  sameAs: [
    "https://facebook.com/maisonelise",
    "https://instagram.com/maisonelise",
    "https://pinterest.com/maisonelise",
    "https://tiktok.com/@maisonelise",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-800-MAISON-ELISE",
    contactType: "customer service",
    availableLanguage: ["English", "French"],
    areaServed: "Worldwide",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Custom cursor implementation
              (function() {
                // Check if touch device
                const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
                if (isTouchDevice) return;
                
                // Create cursor elements
                const dot = document.createElement('div');
                dot.className = 'cursor-dot';
                const ring = document.createElement('div');
                ring.className = 'cursor-ring';
                
                document.body.appendChild(dot);
                document.body.appendChild(ring);
                
                let mouseX = 0;
                let mouseY = 0;
                let ringX = 0;
                let ringY = 0;
                
                // Track mouse position
                document.addEventListener('mousemove', (e) => {
                  mouseX = e.clientX;
                  mouseY = e.clientY;
                  dot.style.left = mouseX + 'px';
                  dot.style.top = mouseY + 'px';
                }, { passive: true });
                
                // Smooth ring animation
                function animateRing() {
                  ringX += (mouseX - ringX) * 0.15;
                  ringY += (mouseY - ringY) * 0.15;
                  ring.style.left = ringX + 'px';
                  ring.style.top = ringY + 'px';
                  requestAnimationFrame(animateRing);
                }
                animateRing();
                
                // Add hover effect to interactive elements
                const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select, [tabindex]:not([tabindex="-1"])');
                interactiveElements.forEach(el => {
                  el.addEventListener('mouseenter', () => {
                    dot.classList.add('hover');
                    ring.classList.add('hover');
                  });
                  el.addEventListener('mouseleave', () => {
                    dot.classList.remove('hover');
                    ring.classList.remove('hover');
                  });
                });
                
                // Handle dynamic content
                const observer = new MutationObserver(() => {
                  const newElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select, [tabindex]:not([tabindex="-1"])');
                  newElements.forEach(el => {
                    if (!el.dataset.cursorBound) {
                      el.dataset.cursorBound = 'true';
                      el.addEventListener('mouseenter', () => {
                        dot.classList.add('hover');
                        ring.classList.add('hover');
                      });
                      el.addEventListener('mouseleave', () => {
                        dot.classList.remove('hover');
                        ring.classList.remove('hover');
                      });
                    }
                  });
                });
                observer.observe(document.body, { childList: true, subtree: true });
              })();
            `,
          }}
        />
      </head>
      <body className="bg-ivory text-charcoal antialiased">
        <AuthProvider>
          <AnnouncementBar />
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <SearchModal />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
