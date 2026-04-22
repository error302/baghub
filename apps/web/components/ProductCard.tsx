"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: { url: string; alt?: string }[];
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

interface ProductCardProps {
  product: Product;
  variant?: "default" | "minimal" | "featured";
}

export default function ProductCard({
  product,
  variant = "default",
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || "/placeholder-product.jpg",
      quantity: 1,
      size: "M",
      color: "Default",
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  if (variant === "minimal") {
    return (
      <Link
        href={`/shop/${product.slug}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[3/4] bg-cream mb-4 overflow-hidden">
          <Image
            src={product.images[0]?.url || "/placeholder-product.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.isNew && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-charcoal text-ivory text-xs tracking-widest uppercase">
              New
            </span>
          )}
          {product.isSale && product.originalPrice && (
            <span className="absolute top-4 right-4 px-3 py-1 bg-gold text-white text-xs tracking-widest uppercase">
              Sale
            </span>
          )}
        </div>
        <div className="text-center">
          <h3 className="font-sans text-sm font-light text-charcoal mb-1 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-2">
            <span className="font-serif text-lg">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/shop/${product.slug}`}
        className="group block relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[3/4] bg-cream overflow-hidden">
          <Image
            src={product.images[0]?.url || "/placeholder-product.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-white text-charcoal text-sm tracking-widest uppercase hover:bg-gold hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Bag
              </button>
              <button
                onClick={handleWishlist}
                className={`w-12 flex items-center justify-center transition-colors ${
                  isWishlisted ? "bg-gold text-white" : "bg-white text-charcoal hover:bg-gold hover:text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <span className="text-caption text-muted">{product.category}</span>
          <h3 className="font-serif text-2xl font-light mt-2 mb-2 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <p className="font-sans text-lg">
            ${product.price.toLocaleString()}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] bg-cream mb-4 overflow-hidden">
        <Image
          src={product.images[0]?.url || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-3 py-1 bg-charcoal text-ivory text-xs tracking-widest uppercase">
              New
            </span>
          )}
        </div>
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {product.isSale && product.originalPrice && (
            <span className="px-3 py-1 bg-gold text-white text-xs tracking-widest uppercase">
              Sale
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 bg-white/95 backdrop-blur-sm text-charcoal text-xs tracking-widest uppercase hover:bg-gold hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Quick Add
          </button>
          <button
            onClick={handleWishlist}
            className={`w-10 flex items-center justify-center transition-colors ${
              isWishlisted ? "bg-gold text-white" : "bg-white/95 backdrop-blur-sm text-charcoal hover:bg-gold hover:text-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/5 transition-colors duration-300" />
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <span className="text-caption text-muted">{product.category}</span>
        <h3 className="font-sans text-sm font-light text-charcoal group-hover:text-gold transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-serif text-base">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
