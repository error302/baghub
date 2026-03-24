import Link from "next/link";

const categories = [
  { name: "Handbags", slug: "handbags", image: "/images/categories/handbags.jpg" },
  { name: "Backpacks", slug: "backpacks", image: "/images/categories/backpacks.jpg" },
  { name: "Totes", slug: "totes", image: "/images/categories/totes.jpg" },
  { name: "Wallets", slug: "wallets", image: "/images/categories/wallets.jpg" },
  { name: "Luggage", slug: "luggage", image: "/images/categories/luggage.jpg" },
  { name: "Kids", slug: "kids", image: "/images/categories/kids.jpg" },
];

const featuredProducts = [
  {
    id: "1",
    name: "Classic Leather Tote",
    price: 299.99,
    image: "/images/products/tote-1.jpg",
    slug: "classic-leather-tote",
  },
  {
    id: "2",
    name: "Designer Handbag",
    price: 499.99,
    image: "/images/products/handbag-1.jpg",
    slug: "designer-handbag",
  },
  {
    id: "3",
    name: "Travel Backpack",
    price: 189.99,
    image: "/images/products/backpack-1.jpg",
    slug: "travel-backpack",
  },
  {
    id: "4",
    name: "Slim Wallet",
    price: 79.99,
    image: "/images/products/wallet-1.jpg",
    slug: "slim-wallet",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Premium Bags for Every Journey
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Discover our curated collection of handbags, backpacks, totes, and more.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-semibold group-hover:underline">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
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
          <div className="text-center mt-8">
            <Link
              href="/shop"
              className="inline-block border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-8">
            Subscribe to our newsletter for exclusive offers and new arrivals.
          </p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}