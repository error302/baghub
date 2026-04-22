import { useState } from 'react'
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { SalesChart } from '@/components/ui/charts/SalesChart'
import { DateRangePicker, type DateRange } from '@/components/ui/DateRangePicker'
import { Link } from 'react-router-dom'
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils/format'

// Mock data for demonstration
const STATS_DATA = {
  totalRevenue: { value: 245680, change: 12.5 },
  totalOrders: { value: 342, change: 8.2 },
  activeCustomers: { value: 1429, change: 23.1 },
  averageOrderValue: { value: 718, change: -3.4 },
}

const SALES_DATA = [
  { date: '2025-01-01', revenue: 3200, orders: 5 },
  { date: '2025-01-02', revenue: 4500, orders: 7 },
  { date: '2025-01-03', revenue: 3800, orders: 6 },
  { date: '2025-01-04', revenue: 5200, orders: 9 },
  { date: '2025-01-05', revenue: 4100, orders: 7 },
  { date: '2025-01-06', revenue: 6800, orders: 12 },
  { date: '2025-01-07', revenue: 5900, orders: 10 },
  { date: '2025-01-08', revenue: 7200, orders: 14 },
  { date: '2025-01-09', revenue: 4500, orders: 8 },
  { date: '2025-01-10', revenue: 3800, orders: 6 },
  { date: '2025-01-11', revenue: 5600, orders: 9 },
  { date: '2025-01-12', revenue: 6200, orders: 11 },
  { date: '2025-01-13', revenue: 4100, orders: 7 },
  { date: '2025-01-14', revenue: 7800, orders: 13 },
]

const RECENT_ORDERS = [
  {
    id: 'BH-2025-00045',
    customer: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    total: 299.99,
    status: 'pending' as const,
    date: '2025-01-14T14:30:00Z',
    items: 3,
  },
  {
    id: 'BH-2025-00044',
    customer: 'Michael Chen',
    email: 'm.chen@example.com',
    total: 499.99,
    status: 'shipped' as const,
    date: '2025-01-14T10:15:00Z',
    items: 1,
  },
  {
    id: 'BH-2025-00043',
    customer: 'Emily Davis',
    email: 'emily.d@example.com',
    total: 189.99,
    status: 'delivered' as const,
    date: '2025-01-13T16:45:00Z',
    items: 2,
  },
  {
    id: 'BH-2025-00042',
    customer: 'John Smith',
    email: 'john.smith@example.com',
    total: 749.99,
    status: 'processing' as const,
    date: '2025-01-13T09:20:00Z',
    items: 4,
  },
  {
    id: 'BH-2025-00041',
    customer: 'Lisa Wang',
    email: 'lisa.w@example.com',
    total: 129.99,
    status: 'confirmed' as const,
    date: '2025-01-12T14:00:00Z',
    items: 1,
  },
]

const TOP_PRODUCTS = [
  { name: 'Classic Leather Tote', sales: 142, revenue: 42598.58 },
  { name: 'Designer Handbag', sales: 98, revenue: 48999.02 },
  { name: 'Travel Backpack', sales: 87, revenue: 16529.13 },
  { name: 'Slim Wallet', sales: 203, revenue: 16239.97 },
  { name: 'Crossbody Bag', sales: 76, revenue: 9879.24 },
]

export function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date('2025-01-01'),
    to: new Date('2025-01-14'),
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening with your store.</p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={STATS_DATA.totalRevenue.value}
          type="currency"
          change={STATS_DATA.totalRevenue.change}
          icon={DollarSign}
        />
        <StatCard
          title="Total Orders"
          value={STATS_DATA.totalOrders.value}
          type="number"
          change={STATS_DATA.totalOrders.change}
          icon={ShoppingBag}
        />
        <StatCard
          title="Active Customers"
          value={STATS_DATA.activeCustomers.value}
          type="number"
          change={STATS_DATA.activeCustomers.change}
          icon={Users}
        />
        <StatCard
          title="Average Order Value"
          value={STATS_DATA.averageOrderValue.value}
          type="currency"
          change={STATS_DATA.averageOrderValue.change}
          icon={TrendingUp}
        />
      </div>

      {/* Charts & Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 card">
          <div className="p-6 border-b border-border-subtle">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-semibold text-charcoal">Sales Overview</h2>
                <p className="text-sm text-muted">Revenue and orders over time</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-gold rounded-full" />
                  <span className="text-xs text-muted">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-charcoal rounded-full" />
                  <span className="text-xs text-muted">Orders</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <SalesChart data={SALES_DATA} period="day" />
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <div className="p-6 border-b border-border-subtle">
            <h2 className="font-serif text-lg font-semibold text-charcoal">Top Products</h2>
            <p className="text-sm text-muted">Best selling items</p>
          </div>
          <div className="p-4">
            <div className="space-y-1">
              {TOP_PRODUCTS.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center gap-3 p-3 hover:bg-cream/30 rounded-elegant transition-colors duration-luxury"
                >
                  <span className="w-6 h-6 bg-cream rounded-full flex items-center justify-center text-xs font-semibold text-charcoal">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">{product.name}</p>
                    <p className="text-xs text-muted">{product.sales} sales</p>
                  </div>
                  <p className="text-sm font-semibold text-charcoal">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              ))}
            </div>
            <Link
              to="/products"
              className="block w-full mt-4 py-2 text-center text-sm text-gold hover:text-gold-dark font-medium border border-gold/20 rounded-elegant hover:bg-gold/5 transition-colors duration-luxury"
            >
              View all products
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-semibold text-charcoal">Recent Orders</h2>
            <p className="text-sm text-muted">Latest orders from your customers</p>
          </div>
          <Link
            to="/orders"
            className="text-sm text-gold hover:text-gold-dark font-medium flex items-center gap-1 transition-colors duration-luxury"
          >
            View all
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Items</th>
                <th>Date</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-sm font-medium text-gold hover:text-gold-dark transition-colors"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td>
                    <div>
                      <p className="text-sm font-medium text-charcoal">{order.customer}</p>
                      <p className="text-xs text-muted">{order.email}</p>
                    </div>
                  </td>
                  <td className="font-semibold">{formatCurrency(order.total)}</td>
                  <td>
                    <StatusBadge status={order.status} size="sm" />
                  </td>
                  <td className="text-muted">{order.items} items</td>
                  <td className="text-muted">{formatRelativeTime(order.date)}</td>
                  <td className="text-right">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-sm text-gold hover:text-gold-dark font-medium transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/products/new"
          className="flex flex-col items-center gap-3 p-6 bg-white border border-border-subtle rounded-elegant hover:shadow-elegant hover:border-gold/30 transition-all duration-luxury group"
        >
          <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center group-hover:bg-gold/10 transition-colors">
            <Package className="w-5 h-5 text-gold" />
          </div>
          <div className="text-center">
            <p className="font-medium text-charcoal">Add Product</p>
            <p className="text-xs text-muted">Create new item</p>
          </div>
        </Link>
        <Link
          to="/orders"
          className="flex flex-col items-center gap-3 p-6 bg-white border border-border-subtle rounded-elegant hover:shadow-elegant hover:border-gold/30 transition-all duration-luxury group"
        >
          <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center group-hover:bg-gold/10 transition-colors">
            <ShoppingBag className="w-5 h-5 text-gold" />
          </div>
          <div className="text-center">
            <p className="font-medium text-charcoal">View Orders</p>
            <p className="text-xs text-muted">Manage orders</p>
          </div>
        </Link>
        <Link
          to="/analytics"
          className="flex flex-col items-center gap-3 p-6 bg-white border border-border-subtle rounded-elegant hover:shadow-elegant hover:border-gold/30 transition-all duration-luxury group"
        >
          <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center group-hover:bg-gold/10 transition-colors">
            <TrendingUp className="w-5 h-5 text-gold" />
          </div>
          <div className="text-center">
            <p className="font-medium text-charcoal">Analytics</p>
            <p className="text-xs text-muted">View reports</p>
          </div>
        </Link>
        <Link
          to="/customers"
          className="flex flex-col items-center gap-3 p-6 bg-white border border-border-subtle rounded-elegant hover:shadow-elegant hover:border-gold/30 transition-all duration-luxury group"
        >
          <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center group-hover:bg-gold/10 transition-colors">
            <Users className="w-5 h-5 text-gold" />
          </div>
          <div className="text-center">
            <p className="font-medium text-charcoal">Customers</p>
            <p className="text-xs text-muted">View customers</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
