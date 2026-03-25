"use client";

import Link from "next/link";

const orders = [
  {
    id: "BH-2025-00042",
    date: "January 15, 2025",
    status: "pending",
    total: 323.99,
    items: [
      {
        name: "Classic Leather Tote",
        quantity: 1,
        price: 299.99,
        image: "/images/products/tote-1.jpg",
      },
    ],
  },
  {
    id: "BH-2025-00038",
    date: "January 13, 2025",
    status: "delivered",
    total: 140.39,
    items: [
      {
        name: "Crossbody Bag",
        quantity: 1,
        price: 129.99,
        image: "/images/products/crossbody-1.jpg",
      },
    ],
    trackingNumber: "1Z999AA10123456784",
  },
  {
    id: "BH-2025-00035",
    date: "January 10, 2025",
    status: "delivered",
    total: 499.99,
    items: [
      {
        name: "Designer Handbag",
        quantity: 1,
        price: 499.99,
        image: "/images/products/handbag-1.jpg",
      },
    ],
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-gray-600 mb-8">
          You haven't placed any orders yet. Start shopping to see your orders
          here.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border rounded-lg overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{order.id}</p>
                <p className="text-sm text-gray-600">{order.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[order.status]
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <p className="font-bold">${order.total.toFixed(2)}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0">
                      <div className="w-full h-full bg-gray-300 rounded-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/shop/${item.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="font-semibold hover:text-gray-600"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tracking */}
              {order.trackingNumber && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Tracking:{" "}
                    <span className="text-blue-600 font-medium">
                      {order.trackingNumber}
                    </span>
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                >
                  View Details
                </Link>
                {order.status === "delivered" && (
                  <button className="px-4 py-2 border border-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                    Write Review
                  </button>
                )}
                {order.status === "delivered" && (
                  <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                    Buy Again
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Shopping */}
      <div className="text-center mt-12">
        <Link
          href="/shop"
          className="inline-block border border-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}