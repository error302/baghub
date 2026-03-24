import Link from "next/link";

const products = [
  {
    id: "1",
    name: "Classic Leather Tote",
    price: 299.99,
    category: "totes",
    slug: "classic-leather-tote",
  },
  {
    id: "2",
    name: "Designer Handbag",
    price: 499.99,
    category: "handbags",
    slug: "designer-handbag",
  },
  {
    id: "3",
    name: "Travel Backpack",
    price: 189.99,
    category: "backpacks",
    slug: "travel-backpack",
  },
  {
    id: "4",
    name: "Slim Wallet",
    price: 79.99,
    category: "wallets",
    slug: "slim-wallet",
  },
  {
    id: "5",
    name: "Weekend Duffel",
    price: 159.99,
    category: "luggage",
    slug: "weekend-duffel",
  },
  {
    id: "6",
    name: "Crossbody Bag",
    price: 129.99,
    category: "handbags",
    slug: "crossbody-bag",
  },
  {
    id: "7",
    name: "Kids Backpack",
    price: 49.99,
    category: "kids",
    slug: "kids-backpack",
  },
  {
    id: "8",
    name: "Canvas Tote",
    price: 89.99,
    category: "totes",
    slug: "canvas-tote",
  },
];

const categories = [
  { name: "All", slug: "all" },
  { name: "Handbags", slug: "handbags" },
  { name: "Backpacks", slug: "backpacks" },
  { name: "Totes", slug: "totes" },
  { name: "Wallets", slug: "wallets" },
  { name: "Luggage", slug: "luggage" },
  { name: "Kids", slug: "kids" },
];

export default function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string };
}) {
  const selectedCategory = searchParams.category || "all";
  const sortBy = searchParams.sort || "featured";

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="md:w-64 shrink-0">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <nav className="space-y-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className={`block py-2 px-3 rounded-lg ${
                  selectedCategory === cat.slug
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Sort By</h2>
            <select
              className="w-full p-2 border rounded-lg"
              defaultValue={sortBy}
              onChange={(e) => {
                window.location.href = `/shop?category=${selectedCategory}&sort=${e.target.value}`;
              }}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              {selectedCategory === "all"
                ? "All Products"
                : categories.find((c) => c.slug === selectedCategory)?.name}
            </h1>
            <p className="text-gray-600">{sortedProducts.length} products</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="group"
              >
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gray-300 group-hover:scale-105 transition" />
                </div>
                <h3 className="font-semibold group-hover:text-gray-600">
                  {product.name}
                </h3>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}