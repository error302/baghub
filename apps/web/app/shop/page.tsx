"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Filter, Grid3X3, List, SlidersHorizontal, ChevronDown, X, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/Loading";

// Mock products data
const mockProducts = [
  { id: "1", name: "Silk Evening Gown", slug: "silk-evening-gown", price: 2850, originalPrice: 3200, images: [{ url: "/images/products/gown.jpg" }], category: "Clothing", isSale: true },
  { id: "2", name: "Quilted Leather Handbag", slug: "quilted-leather-handbag", price: 1850, images: [{ url: "/images/products/bag1.jpg" }], category: "Handbags" },
  { id: "3", name: "Strappy Satin Heels", slug: "strappy-satin-heels", price: 985, images: [{ url: "/images/products/shoes1.jpg" }], category: "Shoes", isNew: true },
  { id: "4", name: "Cashmere Coat", slug: "cashmere-coat", price: 3200, images: [{ url: "/images/products/coat.jpg" }], category: "Clothing", isNew: true },
  { id: "5", name: "Pearl Clutch", slug: "pearl-clutch", price: 1250, images: [{ url: "/images/products/clutch.jpg" }], category: "Handbags" },
  { id: "6", name: "Leather Ankle Boots", slug: "leather-ankle-boots", price: 1450, originalPrice: 1700, images: [{ url: "/images/products/boots.jpg" }], category: "Shoes", isSale: true },
  { id: "7", name: "Silk Blouse", slug: "silk-blouse", price: 650, images: [{ url: "/images/products/blouse.jpg" }], category: "Clothing", isNew: true },
  { id: "8", name: "Tote Bag", slug: "tote-bag", price: 980, images: [{ url: "/images/products/tote.jpg" }], category: "Handbags" },
  { id: "9", name: "Wool Scarf", slug: "wool-scarf", price: 280, images: [{ url: "/images/products/scarf.jpg" }], category: "Accessories" },
  { id: "10", name: "Designer Sunglasses", slug: "designer-sunglasses", price: 450, images: [{ url: "/images/products/sunglasses.jpg" }], category: "Accessories" },
  { id: "11", name: "Evening Pumps", slug: "evening-pumps", price: 1100, images: [{ url: "/images/products/pumps.jpg" }], category: "Shoes", isNew: true },
  { id: "12", name: "Linen Dress", slug: "linen-dress", price: 890, images: [{ url: "/images/products/dress.jpg" }], category: "Clothing" },
];

const categories = [
  { id: "all", name: "All Products", count: 120 },
  { id: "clothing", name: "Clothing", count: 45 },
  { id: "handbags", name: "Handbags", count: 28 },
  { id: "shoes", name: "Shoes", count: 32 },
  { id: "accessories", name: "Accessories", count: 15 },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

const priceRanges = [
  { id: "under-500", label: "Under $500", min: 0, max: 500 },
  { id: "500-1000", label: "$500 - $1,000", min: 500, max: 1000 },
  { id: "1000-2000", label: "$1,000 - $2,000", min: 1000, max: 2000 },
  { id: "over-2000", label: "Over $2,000", min: 2000, max: Infinity },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  { id: "black", name: "Black", hex: "#1C1C1C" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "cream", name: "Cream", hex: "#EDE9E1" },
  { id: "navy", name: "Navy", hex: "#1B2845" },
  { id: "gold", name: "Gold", hex: "#B8965A" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [products, setProducts] = useState(mockProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Apply filters
  const applyFilters = useCallback(() => {
    setIsLoading(true);
    
    let filtered = [...mockProducts];

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Price filter
    if (selectedPriceRange) {
      const range = priceRanges.find(r => r.id === selectedPriceRange);
      if (range) {
        filtered = filtered.filter(p => p.price >= range.min && p.price <= range.max);
      }
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setTimeout(() => {
      setProducts(filtered);
      setIsLoading(false);
    }, 300);
  }, [selectedCategory, selectedPriceRange, selectedSizes, selectedColors, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (colorId: string) => {
    setSelectedColors(prev => 
      prev.includes(colorId) ? prev.filter(c => c !== colorId) : [...prev, colorId]
    );
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedPriceRange(null);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSortBy("featured");
  };

  const activeFiltersCount = [
    selectedCategory !== "all" ? 1 : 0,
    selectedPriceRange ? 1 : 0,
    selectedSizes.length,
    selectedColors.length,
  ].reduce((a, b) => a + b, 0);

  // Pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const FilterSidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`space-y-8 ${isMobile ? "p-6" : ""}`}>
      {/* Categories */}
      <div>
        <h3 className="font-serif text-lg font-light mb-4">Categories</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (isMobile) setIsMobileFilterOpen(false);
                }}
                className={`flex items-center justify-between w-full text-sm py-1 transition-colors ${
                  selectedCategory === cat.id ? "text-gold" : "text-charcoal hover:text-gold"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-muted text-xs">({cat.count})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-serif text-lg font-light mb-4">Price Range</h3>
        <ul className="space-y-2">
          {priceRanges.map((range) => (
            <li key={range.id}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 border ${selectedPriceRange === range.id ? "border-gold bg-gold" : "border-sand group-hover:border-gold"} flex items-center justify-center transition-colors`}>
                  {selectedPriceRange === range.id && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={selectedPriceRange === range.id}
                  onChange={() => setSelectedPriceRange(selectedPriceRange === range.id ? null : range.id)}
                  className="hidden"
                />
                <span className={`text-sm ${selectedPriceRange === range.id ? "text-charcoal" : "text-muted"}`}>
                  {range.label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-serif text-lg font-light mb-4">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`w-10 h-10 text-sm border transition-colors ${
                selectedSizes.includes(size)
                  ? "border-gold bg-gold text-white"
                  : "border-sand hover:border-gold"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-serif text-lg font-light mb-4">Colors</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => toggleColor(color.id)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColors.includes(color.id)
                  ? "border-gold scale-110"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {selectedColors.includes(color.id) && (
                <svg className="w-4 h-4 mx-auto text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <button
          onClick={clearFilters}
          className="text-sm text-muted hover:text-gold transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory">
      {/* Page Header */}
      <div className="bg-cream border-b border-sand">
        <div className="container-luxury py-8">
          <nav className="flex items-center gap-2 text-sm text-muted mb-4">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-charcoal">Shop</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl font-light">
            {selectedCategory === "all" ? "All Products" : categories.find(c => c.id === selectedCategory)?.name || "Shop"}
          </h1>
          <p className="text-muted mt-2">{products.length} products</p>
        </div>
      </div>

      <div className="container-luxury py-8">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b border-sand">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-sand hover:border-gold transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-gold text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            {/* View Toggle */}
            <div className="hidden md:flex items-center border border-sand">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-charcoal text-ivory" : "hover:bg-cream"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-charcoal text-ivory" : "hover:bg-cream"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted">Active:</span>
                {selectedCategory !== "all" && (
                  <span className="px-3 py-1 bg-cream text-sm flex items-center gap-2">
                    {categories.find(c => c.id === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory("all")}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-sand hover:border-gold transition-colors"
            >
              <span className="text-sm">Sort: {sortOptions.find(o => o.value === sortBy)?.label}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
            </button>
            
            {isSortOpen && (
              <>
                <div className="absolute inset-0" onClick={() => setIsSortOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg border border-sand z-20 animate-fade-in">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-cream transition-colors ${
                        sortBy === option.value ? "text-gold" : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Mobile Filter Drawer */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-80 bg-ivory animate-slide-in-right overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-sand">
                  <h2 className="font-serif text-xl">Filters</h2>
                  <button onClick={() => setIsMobileFilterOpen(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <FilterSidebar isMobile />
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <ProductGridSkeleton count={12} />
            ) : (
              <>
                <div className={`grid gap-4 md:gap-6 ${
                  viewMode === "grid" 
                    ? "grid-cols-2 md:grid-cols-3" 
                    : "grid-cols-1"
                }`}>
                  {paginatedProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      variant={viewMode === "list" ? "minimal" : "default"}
                    />
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="text-center py-16">
                    <Filter className="w-16 h-16 text-sand mx-auto mb-4" />
                    <h3 className="font-serif text-2xl mb-2">No products found</h3>
                    <p className="text-muted mb-6">Try adjusting your filters or browse all products</p>
                    <button onClick={clearFilters} className="btn btn-outline">
                      Clear All Filters
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-sand">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 disabled:opacity-30 hover:text-gold transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 text-sm transition-colors ${
                          currentPage === i + 1
                            ? "bg-gold text-white"
                            : "hover:bg-cream"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 disabled:opacity-30 hover:text-gold transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={12} />}>
      <ShopContent />
    </Suspense>
  );
}
