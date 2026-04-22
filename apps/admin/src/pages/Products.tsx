import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  ArrowUpDown,
  Download,
} from 'lucide-react'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/format'
import type { Product, ProductStatus } from '@/types'

// Mock data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'BAG-TOTE-001',
    slug: 'classic-leather-tote',
    name: 'Classic Leather Tote',
    description: 'A timeless leather tote perfect for everyday use.',
    category: { id: '1', name: 'Totes', slug: 'totes', sortOrder: 1, createdAt: '', updatedAt: '' },
    basePrice: 299.99,
    stockQty: 45,
    status: 'active',
    isFeatured: true,
    isNewArrival: false,
    images: [],
    variants: [],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
  } as Product,
  {
    id: '2',
    sku: 'BAG-HAND-001',
    slug: 'designer-handbag',
    name: 'Designer Handbag',
    description: 'Luxury designer handbag crafted with premium materials.',
    category: { id: '2', name: 'Handbags', slug: 'handbags', sortOrder: 2, createdAt: '', updatedAt: '' },
    basePrice: 499.99,
    stockQty: 12,
    status: 'active',
    isFeatured: true,
    isNewArrival: false,
    images: [],
    variants: [],
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-11T00:00:00Z',
  } as Product,
  {
    id: '3',
    sku: 'BAG-BACK-001',
    slug: 'travel-backpack',
    name: 'Travel Backpack',
    description: 'Durable backpack designed for travel and adventure.',
    category: { id: '3', name: 'Backpacks', slug: 'backpacks', sortOrder: 3, createdAt: '', updatedAt: '' },
    basePrice: 189.99,
    stockQty: 67,
    status: 'active',
    isFeatured: false,
    isNewArrival: true,
    images: [],
    variants: [],
    createdAt: '2025-01-03T00:00:00Z',
    updatedAt: '2025-01-12T00:00:00Z',
  } as Product,
  {
    id: '4',
    sku: 'BAG-WAL-001',
    slug: 'slim-wallet',
    name: 'Slim Wallet',
    description: 'Minimalist slim wallet with card slots.',
    category: { id: '4', name: 'Wallets', slug: 'wallets', sortOrder: 4, createdAt: '', updatedAt: '' },
    basePrice: 79.99,
    stockQty: 120,
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    images: [],
    variants: [],
    createdAt: '2025-01-04T00:00:00Z',
    updatedAt: '2025-01-13T00:00:00Z',
  } as Product,
  {
    id: '5',
    sku: 'BAG-LUG-001',
    slug: 'weekend-duffel',
    name: 'Weekend Duffel',
    description: 'Spacious weekend duffel bag.',
    category: { id: '5', name: 'Luggage', slug: 'luggage', sortOrder: 5, createdAt: '', updatedAt: '' },
    basePrice: 159.99,
    stockQty: 23,
    status: 'draft',
    isFeatured: false,
    isNewArrival: true,
    images: [],
    variants: [],
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-14T00:00:00Z',
  } as Product,
  {
    id: '6',
    sku: 'BAG-HAND-002',
    slug: 'crossbody-bag',
    name: 'Crossbody Bag',
    description: 'Elegant crossbody bag for everyday use.',
    category: { id: '2', name: 'Handbags', slug: 'handbags', sortOrder: 2, createdAt: '', updatedAt: '' },
    basePrice: 129.99,
    stockQty: 5,
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    images: [],
    variants: [],
    createdAt: '2025-01-06T00:00:00Z',
    updatedAt: '2025-01-14T00:00:00Z',
  } as Product,
]

const CATEGORIES = ['All Categories', 'Totes', 'Handbags', 'Backpacks', 'Wallets', 'Luggage']

export function Products() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || product.category?.name === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  const exportToCSV = () => {
    const headers = ['SKU', 'Name', 'Category', 'Price', 'Stock', 'Status']
    const rows = filteredProducts.map((p) => [
      p.sku,
      p.name,
      p.category?.name || '',
      p.basePrice.toString(),
      p.stockQty.toString(),
      p.status,
    ])
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `products-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const columns = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
          onChange={handleSelectAll}
          className="rounded border-border-default text-gold focus:ring-gold"
        />
      ),
      width: '48px',
      sortable: false,
      render: (row: Product) => (
        <input
          type="checkbox"
          checked={selectedProducts.includes(row.id)}
          onChange={() => handleSelectProduct(row.id)}
          className="rounded border-border-default text-gold focus:ring-gold"
        />
      ),
    },
    {
      key: 'product',
      header: 'Product',
      width: '40%',
      render: (row: Product) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cream rounded-elegant flex items-center justify-center flex-shrink-0">
            {row.images?.[0]?.url ? (
              <img src={row.images[0].url} alt={row.name} className="w-full h-full object-cover rounded-elegant" />
            ) : (
              <div className="w-5 h-5 bg-muted/20 rounded" />
            )}
          </div>
          <div className="min-w-0">
            <Link
              to={`/products/${row.id}`}
              className="text-sm font-medium text-charcoal hover:text-gold transition-colors truncate block"
            >
              {row.name}
            </Link>
            <p className="text-xs text-muted">{row.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row: Product) => <span className="text-sm text-muted">{row.category?.name}</span>,
    },
    {
      key: 'price',
      header: 'Price',
      render: (row: Product) => (
        <span className="text-sm font-medium">{formatCurrency(row.basePrice)}</span>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (row: Product) => (
        <span
          className={cn(
            'text-sm',
            row.stockQty === 0 && 'text-status-error font-medium',
            row.stockQty > 0 && row.stockQty <= 10 && 'text-status-warning font-medium',
            row.stockQty > 10 && 'text-charcoal'
          )}
        >
          {row.stockQty}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Product) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'actions',
      header: '',
      width: '48px',
      sortable: false,
      render: (row: Product) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/products/${row.id}`}
            className="p-1.5 text-muted hover:text-gold transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            className="p-1.5 text-muted hover:text-status-error transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <Link to="/products/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProductStatus | 'all')}
              className="form-input w-40"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-input w-48"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat === 'All Categories' ? 'all' : cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'btn-secondary',
                showFilters && 'bg-gold/5 border-gold'
              )}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between">
            <p className="text-sm text-muted">
              {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <button className="btn-secondary">Set Active</button>
              <button className="btn-secondary">Set Draft</button>
              <button className="btn-secondary text-status-error hover:bg-status-error/5">
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      <DataTable
        columns={columns}
        data={filteredProducts}
        keyExtractor={(row) => row.id}
        emptyMessage="No products found. Try adjusting your filters."
      />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          Showing {filteredProducts.length} of {MOCK_PRODUCTS.length} products
        </p>
        <div className="flex gap-2">
          <button className="btn-secondary" disabled>
            Previous
          </button>
          <button className="px-3 py-2 bg-gold text-white rounded-elegant text-sm font-medium">1</button>
          <button className="btn-secondary">2</button>
          <button className="btn-secondary">3</button>
          <button className="btn-secondary">Next</button>
        </div>
      </div>
    </div>
  )
}
