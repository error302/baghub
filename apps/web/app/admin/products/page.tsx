"use client";

import { useState } from "react";
import Link from "next/link";

const products = [
  {
    id: "1",
    sku: "BAG-TOTE-001",
    name: "Classic Leather Tote",
    category: "Totes",
    price: 299.99,
    stock: 45,
    status: "active",
    sales: 142,
  },
  {
    id: "2",
    sku: "BAG-HAND-001",
    name: "Designer Handbag",
    category: "Handbags",
    price: 499.99,
    stock: 12,
    status: "active",
    sales: 98,
  },
  {
    id: "3",
    sku: "BAG-BACK-001",
    name: "Travel Backpack",
    category: "Backpacks",
    price: 189.99,
    stock: 67,
    status: "active",
    sales: 87,
  },
  {
    id: "4",
    sku: "BAG-WAL-001",
    name: "Slim Wallet",
    category: "Wallets",
    price: 79.99,
    stock: 120,
    status: "active",
    sales: 203,
  },
  {
    id: "5",
    sku: "BAG-LUG-001",
    name: "Weekend Duffel",
    category: "Luggage",
    price: 159.99,
    stock: 23,
    status: "draft",
    sales: 45,
  },
  {
    id: "6",
    sku: "BAG-HAND-002",
    name: "Crossbody Bag",
    category: "Handbags",
    price: 129.99,
    stock: 5,
    status: "active",
    sales: 76,
  },
  {
    id: "7",
    sku: "BAG-KID-001",
    name: "Kids Backpack",
    category: "Kids",
    price: 49.99,
    stock: 89,
    status: "active",
    sales: 134,
  },
  {
    id: "8",
    sku: "BAG-TOTE-002",
    name: "Canvas Tote",
    category: "Totes",
    price: 89.99,
    stock: 0,
    status: "archived",
    sales: 22,
  },
];

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search products..."
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
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-sm text-gray-600">
              <tr>
                <th className="px-6 py-3">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Sales</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded">
                        <div className="w-full h-full bg-gray-300 rounded" />
                      </div>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="font-medium hover:text-blue-600"
                      >
                        {product.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4 font-medium">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`${
                        product.stock === 0
                          ? "text-red-600"
                          : product.stock < 10
                          ? "text-yellow-600"
                          : ""
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">{product.sales}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.status === "active"
                          ? "bg-green-100 text-green-700"
                          : product.status === "draft"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </Link>
                      <button className="text-red-600 hover:underline text-sm">
                        Delete
                      </button>
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
            Showing {filteredProducts.length} of {products.length} products
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
    </div>
  );
}