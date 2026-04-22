import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  GripVertical,
  Image as ImageIcon,
} from 'lucide-react'
import { DataTable } from '@/components/ui/DataTable'
import { SimpleEditor } from '@/components/ui/RichTextEditor'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { cn } from '@/utils/cn'
import type { Category } from '@/types'

const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Totes',
    slug: 'totes',
    description: 'Spacious and stylish tote bags for everyday use',
    sortOrder: 1,
    productCount: 24,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-10',
  },
  {
    id: '2',
    name: 'Handbags',
    slug: 'handbags',
    description: 'Elegant handbags for every occasion',
    sortOrder: 2,
    productCount: 42,
    createdAt: '2025-01-02',
    updatedAt: '2025-01-11',
  },
  {
    id: '3',
    name: 'Backpacks',
    slug: 'backpacks',
    description: 'Durable backpacks for travel and daily use',
    sortOrder: 3,
    productCount: 18,
    createdAt: '2025-01-03',
    updatedAt: '2025-01-12',
  },
  {
    id: '4',
    name: 'Wallets',
    slug: 'wallets',
    description: 'Premium leather wallets and card holders',
    sortOrder: 4,
    productCount: 31,
    createdAt: '2025-01-04',
    updatedAt: '2025-01-13',
  },
  {
    id: '5',
    name: 'Luggage',
    slug: 'luggage',
    description: 'Travel in style with our luggage collection',
    sortOrder: 5,
    productCount: 12,
    createdAt: '2025-01-05',
    updatedAt: '2025-01-14',
  },
]

export function Categories() {
  const [isEditing, setIsEditing] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryImages, setCategoryImages] = useState<string[]>([])

  const filteredCategories = MOCK_CATEGORIES.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAdd = () => {
    setEditingCategory({
      name: '',
      slug: '',
      description: '',
      sortOrder: MOCK_CATEGORIES.length + 1,
    })
    setCategoryImages([])
    setIsEditing(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory({ ...category })
    setCategoryImages(category.imageUrl ? [category.imageUrl] : [])
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    setEditingCategory(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingCategory(null)
    setCategoryImages([])
  }

  const columns = [
    {
      key: 'sort',
      header: '',
      width: '40px',
      sortable: false,
      render: () => (
        <button className="p-1 text-muted hover:text-charcoal cursor-move">
          <GripVertical className="w-4 h-4" />
        </button>
      ),
    },
    {
      key: 'name',
      header: 'Category',
      width: '30%',
      render: (row: Category) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cream rounded-elegant flex items-center justify-center flex-shrink-0">
            {row.imageUrl ? (
              <img
                src={row.imageUrl}
                alt={row.name}
                className="w-full h-full object-cover rounded-elegant"
              />
            ) : (
              <ImageIcon className="w-5 h-5 text-muted" />
            )}
          </div>
          <div>
            <p className="font-medium text-charcoal">{row.name}</p>
            <p className="text-xs text-muted">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (row: Category) => (
        <p className="text-sm text-muted line-clamp-2">{row.description || 'No description'}</p>
      ),
    },
    {
      key: 'products',
      header: 'Products',
      width: '100px',
      render: (row: Category) => (
        <span className="text-sm font-medium">{row.productCount || 0}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '100px',
      sortable: false,
      render: (row: Category) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 text-muted hover:text-gold transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-muted hover:text-status-error transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">
              {editingCategory?.id ? 'Edit Category' : 'New Category'}
            </h1>
            <p className="page-subtitle">
              {editingCategory?.id ? 'Update category details' : 'Create a new category'}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary">
              Save Category
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="space-y-5">
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input
                    type="text"
                    value={editingCategory?.name || ''}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                      })
                    }
                    className="form-input"
                    placeholder="Enter category name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Slug</label>
                  <input
                    type="text"
                    value={editingCategory?.slug || ''}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, slug: e.target.value })
                    }
                    className="form-input"
                    placeholder="category-slug"
                  />
                  <p className="text-xs text-muted mt-1">
                    URL-friendly version of the name
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <SimpleEditor
                    value={editingCategory?.description || ''}
                    onChange={(value) =>
                      setEditingCategory({ ...editingCategory, description: value })
                    }
                    placeholder="Describe this category..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-medium text-charcoal mb-4">Category Image</h3>
              <ImageUploader
                images={categoryImages}
                onChange={setCategoryImages}
                maxImages={1}
              />
            </div>
          </div>

          <div>
            <div className="card p-6">
              <h3 className="font-medium text-charcoal mb-4">Settings</h3>
              <div className="form-group">
                <label className="form-label">Sort Order</label>
                <input
                  type="number"
                  value={editingCategory?.sortOrder || 0}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      sortOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className="form-input"
                  min={0}
                />
                <p className="text-xs text-muted mt-1">Lower numbers appear first</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">Organize your products into categories</p>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredCategories}
        keyExtractor={(row) => row.id}
        sortable={false}
        emptyMessage="No categories found."
      />
    </div>
  )
}
