import { NextResponse } from "next/server";

const products = [
  {
    id: "1",
    name: "Classic Leather Tote",
    slug: "classic-leather-tote",
    price: 299.99,
    category: { name: "Totes", slug: "totes" },
    brand: { name: "BagHub Originals" },
    image: "/images/products/tote-1.jpg",
  },
  {
    id: "2",
    name: "Designer Handbag",
    slug: "designer-handbag",
    price: 499.99,
    category: { name: "Handbags", slug: "handbags" },
    brand: { name: "Luxe Collection" },
    image: "/images/products/handbag-1.jpg",
  },
  {
    id: "3",
    name: "Travel Backpack",
    slug: "travel-backpack",
    price: 189.99,
    category: { name: "Backpacks", slug: "backpacks" },
    brand: { name: "BagHub Originals" },
    image: "/images/products/backpack-1.jpg",
  },
  {
    id: "4",
    name: "Slim Wallet",
    slug: "slim-wallet",
    price: 79.99,
    category: { name: "Wallets", slug: "wallets" },
    brand: { name: "BagHub Originals" },
    image: "/images/products/wallet-1.jpg",
  },
  {
    id: "5",
    name: "Weekend Duffel",
    slug: "weekend-duffel",
    price: 159.99,
    category: { name: "Luggage", slug: "luggage" },
    brand: { name: "BagHub Originals" },
    image: "/images/products/duffel-1.jpg",
  },
  {
    id: "6",
    name: "Crossbody Bag",
    slug: "crossbody-bag",
    price: 129.99,
    category: { name: "Handbags", slug: "handbags" },
    brand: { name: "BagHub Originals" },
    image: "/images/products/crossbody-1.jpg",
  },
  {
    id: "7",
    name: "Kids Backpack",
    slug: "kids-backpack",
    price: 49.99,
    category: { name: "Kids", slug: "kids" },
    brand: { name: "BagHub Originals" },
    image: "/images/products/kids-1.jpg",
  },
  {
    id: "8",
    name: "Canvas Tote",
    slug: "canvas-tote",
    price: 89.99,
    category: { name: "Totes", slug: "totes" },
    brand: { name: "BagHub Originals" },
    image: "/images/products/canvas-1.jpg",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";

  if (!query) {
    return NextResponse.json({ data: [], meta: { total: 0 } });
  }

  const results = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.category.name.toLowerCase().includes(query) ||
      p.brand.name.toLowerCase().includes(query)
  );

  return NextResponse.json({
    data: results,
    meta: { total: results.length, query },
  });
}