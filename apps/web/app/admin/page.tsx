import Link from "next/link";

const stats = [
  {
    name: "Total Revenue",
    value: "$12,426.00",
    change: "+12.5%",
    changeType: "positive",
  },
  { name: "Orders Today", value: "24", change: "+8.2%", changeType: "positive" },
  {
    name: "Active Customers",
    value: "1,429",
    change: "+23.1%",
    changeType: "positive",
  },
  { name: "Products", value: "156", change: "+3", changeType: "neutral" },
];

const recentOrders = [
  {
    id: "BH-2025-00042",
    customer: "Sarah Johnson",
    product: "Classic Leather Tote",
    amount: "$299.99",
    status: "pending",
    date: "2 min ago",
  },
  {
    id: "BH-2025-00041",
    customer: "Mike Chen",
    product: "Travel Backpack",
    amount: "$189.99",
    status: "shipped",
    date: "1 hour ago",
  },
  {
    id: "BH-2025-00040",
    customer: "Emily Davis",
    product: "Designer Handbag",
    amount: "$499.99",
    status: "delivered",
    date: "3 hours ago",
  },
  {
    id: "BH-2025-00039",
    customer: "John Smith",
    product: "Slim Wallet",
    amount: "$79.99",
    status: "processing",
    date: "5 hours ago",
  },
  {
    id: "BH-2025-00038",
    customer: "Lisa Wang",
    product: "Crossbody Bag",
    amount: "$129.99",
    status: "delivered",
    date: "1 day ago",
  },
];

const topProducts = [
  { name: "Classic Leather Tote", sales: 142, revenue: "$42,598.58" },
  { name: "Designer Handbag", sales: 98, revenue: "$48,999.02" },
  { name: "Travel Backpack", sales: 87, revenue: "$16,529.13" },
  { name: "Slim Wallet", sales: 203, revenue: "$16,239.97" },
  { name: "Crossbody Bag", sales: 76, revenue: "$9,879.24" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">{stat.name}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
            <p
              className={`text-sm mt-2 ${
                stat.changeType === "positive"
                  ? "text-green-600"
                  : stat.changeType === "negative"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {stat.change} vs last month
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-sm text-gray-600">
                <tr>
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {order.id}
                      </Link>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4 font-medium">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "processing"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top Products</h2>
            <Link
              href="/admin/products"
              className="text-sm text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.sales} sales
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">{product.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="bg-gray-900 text-white text-center py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="border border-gray-900 text-center py-3 rounded-lg hover:bg-gray-50 transition"
          >
            View Orders
          </Link>
          <Link
            href="/admin/analytics"
            className="border border-gray-900 text-center py-3 rounded-lg hover:bg-gray-50 transition"
          >
            Analytics
          </Link>
          <Link
            href="/admin/settings"
            className="border border-gray-900 text-center py-3 rounded-lg hover:bg-gray-50 transition"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}