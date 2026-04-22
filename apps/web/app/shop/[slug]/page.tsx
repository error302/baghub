"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Heart, Share2, Truck, RotateCcw, Shield, ChevronLeft, ChevronRight, Star, Minus, Plus, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useCartStore } from "@/stores/cartStore";

// Mock product data
const mockProducts = [
  { id: "1", name: "Silk Evening Gown", slug: "silk-evening-gown", price: 2850, originalPrice: 3200, images: [{ url: "/images/products/gown.jpg" }, { url: "/images/products/gown-2.jpg" }, { url: "/images/products/gown-3.jpg" }], category: "Clothing", isSale: true, description: "An exquisite silk evening gown featuring delicate draping, a fitted bodice, and a flowing skirt that cascades elegantly to the floor. Crafted from the finest Italian silk.",
    details: [
      "100% Italian silk",
      "Fitted bodice with boning",
      "Floor-length skirt with train",
      "Concealed back zipper",
      "Fully lined",
      "Dry clean only",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Midnight Black", hex: "#1C1C1C" },
      { name: "Ivory", hex: "#F7F4EF" },
      { name: "Gold", hex: "#B8965A" },
    ],
  },
  { id: "2", name: "Quilted Leather Handbag", slug: "quilted-leather-handbag", price: 1850, images: [{ url: "/images/products/bag1.jpg" }, { url: "/images/products/bag1-2.jpg" }], category: "Handbags", description: "A timeless quilted leather handbag with gold-tone hardware and a chain strap. Perfect for day or evening.",
    details: [
      "Genuine Italian leather",
      "Gold-tone hardware",
      "Chain and leather strap",
      "Interior zip pocket",
      "Cotton lining",
      "Dimensions: 25 x 15 x 7 cm",
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Black", hex: "#1C1C1C" },
      { name: "Cognac", hex: "#8B6914" },
    ],
  },
  { id: "3", name: "Strappy Satin Heels", slug: "strappy-satin-heels", price: 985, images: [{ url: "/images/products/shoes1.jpg" }, { url: "/images/products/shoes1-2.jpg" }], category: "Shoes", isNew: true, description: "Elegant strappy heels crafted from lustrous satin. The perfect finishing touch for any formal occasion.",
    details: [
      "Satin upper",
      "Leather sole",
      "4-inch stiletto heel",
      "Adjustable ankle strap",
      "Cushioned insole",
      "Made in Italy",
    ],
    sizes: ["35", "36", "37", "38", "39", "40", "41"],
    colors: [
      { name: "Black", hex: "#1C1C1C" },
      { name: "Champagne", hex: "#F7E7CE" },
      { name: "Ruby Red", hex: "#E0115F" },
    ],
  },
];

const relatedProducts = [
  { id: "4", name: "Cashmere Coat", slug: "cashmere-coat", price: 3200, images: [{ url: "/images/products/coat.jpg" }], category: "Clothing", isNew: true },
  { id: "5", name: "Pearl Clutch", slug: "pearl-clutch", price: 1250, images: [{ url: "/images/products/clutch.jpg" }], category: "Handbags" },
  { id: "6", name: "Silk Blouse", slug: "silk-blouse", price: 650, images: [{ url: "/images/products/blouse.jpg" }], category: "Clothing", isNew: true },
  { id: "7", name: "Wool Scarf", slug: "wool-scarf", price: 280, images: [{ url: "/images/products/scarf.jpg" }], category: "Accessories" },
];

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState(mockProducts[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "details" | "shipping">("description");
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const found = mockProducts.find(p => p.slug === params.slug);
    if (found) {
      setProduct(found);
      setSelectedColor(found.colors[0]);
    }
    setTimeout(() => setIsLoading(false), 300);
  }, [params.slug]);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0].url,
      quantity,
      size: selectedSize,
      color: selectedColor.name,
    });
    
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Breadcrumbs */}
      <div className="border-b border-sand">
        <div className="container-luxury py-4">
          <nav className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category.toLowerCase()}`} className="hover:text-gold transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-charcoal">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="container-luxury py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-cream overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-center text-muted">
                <div className="text-center">
                  <span className="font-serif text-2xl">{product.name}</span>
                  <p className="text-sm mt-2">Image Placeholder</p>
                </div>
              </div>
              
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="px-3 py-1 bg-charcoal text-ivory text-xs tracking-widest uppercase">New</span>
                )}
                {product.isSale && product.originalPrice && (
                  <span className="px-3 py-1 bg-gold text-white text-xs tracking-widest uppercase">Sale</span>
                )}
              </div>

              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/80 text-sm">
                  {selectedImage + 1} / {product.images.length}
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 bg-cream border-2 transition-colors ${
                      selectedImage === index ? "border-gold" : "border-transparent hover:border-sand"
                    }`}
                  >
                    <div className="absolute inset-2 bg-sand/30" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <span className="text-caption text-muted">{product.category}</span>
              <h1 className="font-serif text-3xl md:text-4xl font-light mt-2 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-sm text-muted">4.9 (127 reviews)</span>
              </div>
              
              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl">${product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted line-through">${product.originalPrice.toLocaleString()}</span>
                    <span className="text-sm text-red-600">
                      Save ${(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-medium mb-3">
                Color: <span className="text-muted">{selectedColor.name}</span>
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor.name === color.name
                        ? "border-gold ring-2 ring-gold/30"
                        : "border-sand hover:border-gold"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Size</h3>
                <button className="text-sm text-gold hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-12 border text-sm transition-colors ${
                      selectedSize === size
                        ? "border-gold bg-gold text-white"
                        : "border-sand hover:border-gold"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-xs text-red-600 mt-2">Please select a size</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium mb-3">Quantity</h3>
              <div className="flex items-center border border-sand w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-cream transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-cream transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn btn-primary"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Bag
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-14 border transition-colors flex items-center justify-center ${
                  isWishlisted ? "border-red-500 text-red-500" : "border-sand hover:border-gold"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
              <button className="w-14 border border-sand hover:border-gold transition-colors flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Success Message */}
            {showAddedMessage && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 animate-fade-in">
                Added to bag successfully! <Link href="/cart" className="underline">View cart</Link>
              </div>
            )}

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 py-6 border-t border-sand">
              {[
                { icon: Truck, label: "Free Shipping", desc: "On orders $500+" },
                { icon: RotateCcw, label: "30-Day Returns", desc: "Hassle free" },
                { icon: Shield, label: "Secure Payment", desc: "100% secure" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gold" />
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-t border-sand pt-8">
              <div className="flex gap-8 border-b border-sand">
                {(["description", "details", "shipping"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm tracking-widest uppercase transition-colors relative ${
                      activeTab === tab ? "text-charcoal" : "text-muted hover:text-charcoal"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                    )}
                  </button>
                ))}
              </div>
              <div className="py-6">
                {activeTab === "description" && (
                  <p className="text-muted leading-relaxed">{product.description}</p>
                )}
                {activeTab === "details" && (
                  <ul className="space-y-2 text-muted">
                    {product.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === "shipping" && (
                  <div className="space-y-4 text-muted">
                    <p>Free standard shipping on all orders over $500.</p>
                    <p><strong>Standard Shipping:</strong> 5-7 business days</p>
                    <p><strong>Express Shipping:</strong> 2-3 business days</p>
                    <p><strong>International:</strong> 7-14 business days</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="border-t border-sand py-16">
        <div className="container-luxury">
          <h2 className="font-serif text-3xl font-light mb-8 text-center">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="minimal" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
