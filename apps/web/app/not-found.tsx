import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved, deleted, or never existed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Go Home
          </Link>
          <Link
            href="/shop"
            className="border border-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Browse Shop
          </Link>
        </div>
        <div className="mt-12">
          <p className="text-gray-500 mb-4">Need help?</p>
          <Link href="/contact" className="text-gray-900 font-semibold hover:underline">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}