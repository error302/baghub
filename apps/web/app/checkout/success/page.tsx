"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [orderDetails, setOrderDetails] = useState({
    orderId: `BH-2025-${Date.now().toString().slice(-5)}`,
    email: "customer@example.com",
  });

  useEffect(() => {
    // In a real app, you would fetch the order details from the session_id
    if (sessionId) {
      // Fetch order details from Stripe session
    }
  }, [sessionId]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>

        <p className="text-gray-600 mb-2">
          Your order has been placed successfully.
        </p>

        <p className="text-lg font-semibold mb-6">
          Order #{orderDetails.orderId}
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="font-semibold mb-3">What happens next?</h2>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              You will receive an order confirmation email at{" "}
              {orderDetails.email}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              Your order will be processed within 1-2 business days
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              You will receive tracking information once shipped
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account/orders"
            className="border border-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            View Order Details
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Need help? Contact our support at support@baghub.com
        </p>
      </div>
    </div>
  );
}