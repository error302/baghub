import { NextResponse } from "next/server";

const products = [
  {
    id: "1",
    sku: "BAG-TOTE-001",
    slug: "classic-leather-tote",
    name: "Classic Leather Tote",
    description:
      "A timeless leather tote crafted from premium Italian leather. Perfect for everyday use with spacious interior and durable construction. Features a magnetic snap closure and adjustable shoulder strap.",
    price: 299.99,
    originalPrice: 349.99,
    category: { id: "1", name: "Totes", slug: "totes" },
    brand: { id: "1", name: "BagHub Originals", slug: "baghub-originals" },
    status: "active",
    isFeatured: true,
    images: [
      "/images/products/tote-1.jpg",
      "/images/products/tote-2.jpg",
      "/images/products/tote-3.jpg",
    ],
    variants: [
      { id: "v1", color: "Black", size: "Medium", stock: 15, priceDelta: 0 },
      { id: "v2", color: "Brown", size: "Medium", stock: 8, priceDelta: 0 },
      { id: "v3", color: "Tan", size: "Medium", stock: 12, priceDelta: 0 },
      { id: "v4", color: "Black", size: "Large", stock: 5, priceDelta: 20 },
      { id: "v5", color: "Brown", size: "Large", stock: 0, priceDelta: 20 },
    ],
    reviews: { average: 4.8, count: 127 },
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    sku: "BAG-HAND-001",
    slug: "designer-handbag",
    name: "Designer Handbag",
    description:
      "Elegant designer handbag with gold hardware and premium leather construction. Perfect for special occasions.",
    price: 499.99,
    originalPrice: null,
    category: { id: "2", name: "Handbags", slug: "handbags" },
    brand: { id: "2", name: "Luxe Collection", slug: "luxe-collection" },
    status: "active",
    isFeatured: true,
    images: ["/images/products/handbag-1.jpg"],
    variants: [
      { id: "v6", color: "Black", size: "One Size", stock: 10, priceDelta: 0 },
    ],
    reviews: { average: 4.9, count: 89 },
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    sku: "BAG-BACK-001",
    slug: "travel-backpack",
    name: "Travel Backpack",
    description:
      "Durable travel backpack with laptop compartment and multiple pockets for organization.",
    price: 189.99,
    originalPrice: 229.99,
    category: { id: "3", name: "Backpacks", slug: "backpacks" },
    brand: { id: "1", name: "BagHub Originals", slug: "baghub-originals" },
    status: "active",
    isFeatured: true,
    images: ["/images/products/backpack-1.jpg"],
    variants: [
      { id: "v7", color: "Navy", size: "One Size", stock: 25, priceDelta: 0 },
      { id: "v8", color: "Black", size: "One Size", stock: 20, priceDelta: 0 },
    ],
    reviews: { average: 4.7, count: 156 },
    createdAt: "2024-01-03T00:00:00Z",
  },
  {
    id: "4",
    sku: "BAG-WAL-001",
    slug: "slim-wallet",
    name: "Slim Wallet",
    description:
      "Minimalist wallet with RFID protection and multiple card slots.",
    price: 79.99,
    originalPrice: null,
    category: { id: "4", name: "Wallets", slug: "wallets" },
    brand: { id: "1", name: "BagHub Originals", slug: "baghub-originals" },
    status: "active",
    isFeatured: true,
    images: ["/images/products/wallet-1.jpg"],
    variants: [
      { id: "v9", color: "Black", size: "One Size", stock: 50, priceDelta: 0 },
      { id: "v10", color: "Brown", size: "One Size", stock: 35, priceDelta: 0 },
    ],
    reviews: { average: 4.6, count: 203 },
    createdAt: "2024-01-04T00:00:00Z",
  },
  {
    id: "5",
    sku: "BAG-LUG-001",
    slug: "weekend-duffel",
    name: "Weekend Duffel",
    description:
      "Perfect weekend getaway duffel with shoe compartment.",
    price: 159.99,
    originalPrice: null,
    category: { id: "5", name: "Luggage", slug: "luggage" },
    brand: { id: "1", name: "BagHub Originals", slug: "baghub-originals" },
    status: "active",
    isFeatured: false,
    images: ["/images/products/duffel-1.jpg"],
    variants: [
      { id: "v11", color: "Tan", size: "One Size", stock: 18, priceDelta: 0 },
    ],
    reviews: { average: 4.5, count: 67 },
    createdAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "6",
    sku: "BAG-HAND-002",
    slug: "crossbody-bag",
    name: "Crossbody Bag",
    description:
      "Compact crossbody bag perfect for essentials on the go.",
    price: 129.99,
    originalPrice: 149.99,
    category: { id: "2", name: "Handbags", slug: "handbags" },
    brand: { id: "1", name: "BagHub Originals", slug: "baghub-originals" },
    status: "active",
    isFeatured: false,
    images: ["/images/products/crossbody-1.jpg"],
    variants: [
      { id: "v12", color: "Black", size: "One Size", stock: 30, priceDelta: 0 },
    ],
    reviews: { average: 4.8, count: 94 },
    createdAt: "2024-01-06T00:00:00Z",
  },
  {
    id: "7",
    sku: "BAG-KID-001",
    slug: "kids-backpack",
    name: "Kids Backpack",
    description:
      "Fun and colorful backpack for kids with padded straps.",
    price: 49.99,
    originalPrice: null,
    category: { id: "6", name: "Kids", slug: "kids" },
    brand: { id: "1", name: "BagHub Originals", slug: "baghub-originals" },
    status: "active",
    isFeatured: false,
    images: ["/images/products/kids-1.jpg"],
    variants: [
      { id: "v13", color: "Blue", size: "Small", stock: 40, priceDelta: 0 },
      { id: "v14", color: "Pink", size: "Small", stock: 35, priceDelta: 0 },
    ],
    reviews: { average: 4.9, count: 78 },
    createdAt: "2024-01-07T00:00:00Z",
  },
  {
    id: "8",
    sku: "BAG-TOTE-002",
    slug: "canvas-tote",
    name: "Canvas Tote",
    description:
      "Durable canvas tote with reinforced handles.",
    price: 89.99,
    originalPrice: null,
    category: { id: "1", name: "Totes", slug: "totes" },
    brand: { id: "1", name: "BagHub Originals", slug: "baghub-originals" },
    status: "active",
    isFeatured: false,
    images: ["/images/products/canvas-1.jpg"],
    variants: [
      { id: "v15", color: "Natural", size: "One Size", stock: 22, priceDelta: 0 },
    ],
    reviews: { average: 4.4, count: 45 },
    createdAt: "2024-01-08T00:00:00Z",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "featured";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  let filteredProducts = [...products];

  // Filter by category
  if (category && category !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.slug === category
    );
  }

  // Sort products
  switch (sort) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "name":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      filteredProducts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    default:
      // Featured - show featured first, then by creation date
      filteredProducts.sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }

  // Paginate
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedProducts,
    meta: {
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit),
    },
  });
}