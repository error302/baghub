"use client";

import { useState } from "react";
import Link from "next/link";

const orders = [
  {
    id: "BH-2025-00042",
    customer: { name: "Sarah Johnson", email: "sarah@example.com" },
    items: [{ name: "Classic Leather Tote", quantity: 1, price: 299.99 }],
    total: 323.99,
    status: "pending",
    payment: "paid",
    date: "2025-01-15T10:30:00Z",
    shippingAddress: "123 Main St, New York, NY 10001",
  },
  {
    id: "BH-2025-00041",
    customer: { name: "Mike Chen", email: "mike@example.com" },
    items: [{ name: "Travel Backpack", quantity: 1, price: 189.99 }],
    total: 205.19,
    status: "shipped",
    payment: "paid",
    date: "2025-01-15T09:15:00Z",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
    trackingNumber: "1Z999AA10123456784",
  },
  {
    id: "BH-2025-00040",
    customer: { name: "Emily Davis", email: "emily@example.com" },
    items: [{ name: "Designer Handbag", quantity: 1, price: 499.99 }],
    total: 539.99,
    status: "delivered",
    payment: "paid",
    date: "2025-01-14T16:45:00Z",
    shippingAddress: "789 Pine Rd, Chicago, IL 60601",
  },
  {
    id: "BH-2025-00039",
    customer: { name: "John Smith", email: "john@example.com" },
    items: [{ name: "Slim Wallet", quantity: 2, price: 79.99 }],
    total: 172.79,
    status: "processing",
    payment: "paid",
    date: "2025-01-14T14:20:00Z",
    shippingAddress: "321 Elm St, Houston, TX 77001",
  },
  {
    id: "BH-2025-00038",
    customer: { name: "Lisa Wang", email: "lisa@example.com" },
    items: [{ name: "Crossbody Bag", quantity: 1, price: 129.99 }],
    total: 140.39,
    status: "delivered",
    payment: "paid",
    date: "2025-01-13T11:00:00Z",
    shippingAddress: "654 Maple Dr, Seattle, WA 98101",
  },
  {
    id: "BH-2025-00037",
    customer: { name: "Robert Brown", email: "robert@example.com" },
    items: [{ name: "Weekend Duffel", quantity: 1, price: 159.99 }],
    total: 172.79,
    status: "cancelled",
    payment: "refunded",
    date: "2025-01-12T08:30:00Z",
    shippingAddress: "987 Cedar Ln, Miami, FL 33101",
  },
];

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-gray-100 text-gray-700" },
  {
    value: "processing",
    label: "Processing",
    color: "bg-yellow-100 text-yellow-700",
  },
  { value: "shipped", label: "Shipped", color: "bg-blue-100 text-blue-700" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700" },
];

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<
    (typeof orders)[0] | null
  >(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return (
      statusOptions.find((s) => s.value === status)?.color ||
      "bg-gray-100 text-gray-700"
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {orders.filter((o) => o.status === "pending").length} pending
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="all">All Status</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-sm text-gray-600">
              <tr>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {order.id}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.date)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.customer.name}</p>
                    <p className="text-sm text-gray-500">
                      {order.customer.email}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-sm">
                        {item.name} × {item.quantity}
                      </p>
                    ))}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => e.stopPropagation()}
                      className={`px-2 py-1 text-xs rounded-full border-0 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.payment === "paid"
                          ? "bg-green-100 text-green-700"
                          : order.payment === "refunded"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:underline text-sm">
                        View
                      </button>
                      {order.status === "processing" && (
                        <button className="text-green-600 hover:underline text-sm">
                          Ship
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-gray-900 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Order {selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-2">Customer</h3>
                <p>{selectedOrder.customer.name}</p>
                <p className="text-gray-600">{selectedOrder.customer.email}</p>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p className="text-gray-600">{selectedOrder.shippingAddress}</p>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-2">Items</h3>
                {selectedOrder.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">
                  ${selectedOrder.total.toFixed(2)}
                </span>
              </div>

              {/* Tracking */}
              {selectedOrder.trackingNumber && (
                <div>
                  <h3 className="font-semibold mb-2">Tracking</h3>
                  <p className="text-blue-600">
                    {selectedOrder.trackingNumber}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex gap-4">
              <button className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
                Update Status
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}