"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">500</h1>
        <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We're sorry, but something unexpected happened. Our team has been
          notified and is working to fix the issue.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Go Home
          </Link>
        </div>
        <div className="mt-12">
          <p className="text-gray-500 mb-4">Need immediate help?</p>
          <Link href="/contact" className="text-gray-900 font-semibold hover:underline">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}