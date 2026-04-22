import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Trash2,
  Eye,
  Copy,
  Plus,
  X,
  ChevronDown,
} from 'lucide-react'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { RichTextEditor, SimpleEditor } from '@/components/ui/RichTextEditor'
import { cn } from '@/utils/cn'
import type { Product, ProductStatus, ProductVariant, Category, Brand } from '@/types'

// Mock data - in production, fetch from API
const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Totes', slug: 'totes', sortOrder: 1, createdAt: '', updatedAt: '' },
  { id: '2', name: 'Handbags', slug: 'handbags', sortOrder: 2, createdAt: '', updatedAt: '' },
  { id: '3', name: 'Backpacks', slug: 'backpacks', sortOrder: 3, createdAt: '', updatedAt: '' },
  { id: '4', name: 'Wallets', slug: 'wallets', sortOrder: 4, createdAt: '', updatedAt: '' },
  { id: '5', name: 'Luggage', slug: 'luggage', sortOrder: 5, createdAt: '', updatedAt: '' },
]

const MOCK_BRANDS: Brand[] = [
  { id: '1', name: 'Maison Élise', slug: 'maison-elise', createdAt: '', updatedAt: '' },
  { id: '2', name: 'Heritage', slug: 'heritage', createdAt: '', updatedAt: '' },
  { id: '3', name: 'Luxe', slug: 'luxe', createdAt: '', updatedAt: '' },
]

export function ProductEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const [activeTab, setActiveTab] = useState<'general' | 'variants' | 'seo'>('general')
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    description: '',
    shortDescription: '',
    categoryId: '',
    brandId: '',
    basePrice: 0,
    comparePrice: undefined,
    costPrice: undefined,
    status: 'draft',
    isFeatured: false,
    isNewArrival: true,
    weight: undefined,
    tags: [],
    images: [],
    variants: [],
    seoTitle: '',
    seoDescription: '',
  })

  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [images, setImages] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    navigate('/products')
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }))
  }

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: `temp-${Date.now()}`,
      skuSuffix: '',
      color: '',
      size: '',
      material: '',
      priceDelta: 0,
      stockQty: 0,
      reservedQty: 0,
      images: [],
      lowStockThreshold: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setVariants([...variants, newVariant])
  }

  const updateVariant = (index: number, field: keyof ProductVariant, value: unknown) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/products')}
            className="p-2 hover:bg-cream rounded-elegant transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-charcoal" />
          </button>
          <div>
            <h1 className="page-title">{isNew ? 'New Product' : 'Edit Product'}</h1>
            <p className="page-subtitle">
              {isNew ? 'Create a new product for your store' : 'Update product details'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <>
              <button className="btn-secondary flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
              <button className="btn-secondary text-status-error hover:bg-status-error/5 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="btn-primary flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Product
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border-subtle">
        <div className="flex gap-6">
          {(['general', 'variants', 'seo'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'pb-4 text-sm font-medium capitalize transition-colors duration-luxury border-b-2',
                activeTab === tab
                  ? 'text-gold border-gold'
                  : 'text-muted border-transparent hover:text-charcoal'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <>
              {/* Basic Information */}
              <div className="card p-6">
                <h2 className="font-serif text-lg font-semibold text-charcoal mb-6">Basic Information</h2>
                <div className="space-y-5">
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">SKU *</label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="form-input"
                        placeholder="e.g., BAG-TOTE-001"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                        className="form-input"
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <RichTextEditor
                      value={formData.description || ''}
                      onChange={(value) => setFormData({ ...formData, description: value })}
                      placeholder="Enter product description..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Short Description</label>
                    <SimpleEditor
                      value={formData.shortDescription || ''}
                      onChange={(value) => setFormData({ ...formData, shortDescription: value })}
                      placeholder="Brief summary for product listings..."
                      maxLength={160}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="card p-6">
                <h2 className="font-serif text-lg font-semibold text-charcoal mb-6">Product Images</h2>
                <ImageUploader
                  images={images}
                  onChange={setImages}
                  maxImages={10}
                />
              </div>

              {/* Pricing */}
              <div className="card p-6">
                <h2 className="font-serif text-lg font-semibold text-charcoal mb-6">Pricing</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="form-label">Base Price *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">KES</span>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.basePrice || ''}
                        onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                        className="form-input pl-12"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Compare Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">KES</span>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.comparePrice || ''}
                        onChange={(e) => setFormData({ ...formData, comparePrice: parseFloat(e.target.value) || undefined })}
                        className="form-input pl-12"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cost Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">KES</span>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.costPrice || ''}
                        onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || undefined })}
                        className="form-input pl-12"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Organization */}
              <div className="card p-6">
                <h2 className="font-serif text-lg font-semibold text-charcoal mb-6">Organization</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="form-input"
                    >
                      <option value="">Select category</option>
                      {MOCK_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Brand</label>
                    <select
                      value={formData.brandId}
                      onChange={(e) => setFormData({ ...formData, brandId: e.target.value || undefined })}
                      className="form-input"
                    >
                      <option value="">Select brand</option>
                      {MOCK_BRANDS.map((brand) => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group mt-5">
                  <label className="form-label">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-cream text-sm text-charcoal rounded-elegant"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-muted hover:text-status-error"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="form-input flex-1"
                      placeholder="Add tag and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="btn-secondary"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Variants Tab */}
          {activeTab === 'variants' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-lg font-semibold text-charcoal">Product Variants</h2>
                <button
                  type="button"
                  onClick={addVariant}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Variant
                </button>
              </div>

              {variants.length === 0 ? (
                <div className="text-center py-12 bg-cream/30 rounded-elegant">
                  <p className="text-muted mb-2">No variants added yet</p>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="text-gold hover:text-gold-dark font-medium"
                  >
                    Add your first variant
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {variants.map((variant, index) => (
                    <div key={variant.id} className="border border-border-subtle rounded-elegant p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-charcoal">Variant {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-muted hover:text-status-error"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs text-muted mb-1 block">SKU Suffix</label>
                          <input
                            type="text"
                            value={variant.skuSuffix}
                            onChange={(e) => updateVariant(index, 'skuSuffix', e.target.value)}
                            className="form-input"
                            placeholder="-RED-M"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted mb-1 block">Color</label>
                          <input
                            type="text"
                            value={variant.color || ''}
                            onChange={(e) => updateVariant(index, 'color', e.target.value)}
                            className="form-input"
                            placeholder="Red"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted mb-1 block">Size</label>
                          <input
                            type="text"
                            value={variant.size || ''}
                            onChange={(e) => updateVariant(index, 'size', e.target.value)}
                            className="form-input"
                            placeholder="Medium"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted mb-1 block">Stock</label>
                          <input
                            type="number"
                            value={variant.stockQty}
                            onChange={(e) => updateVariant(index, 'stockQty', parseInt(e.target.value))}
                            className="form-input"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="text-xs text-muted mb-1 block">Price Adjustment</label>
                          <input
                            type="number"
                            step="0.01"
                            value={variant.priceDelta}
                            onChange={(e) => updateVariant(index, 'priceDelta', parseFloat(e.target.value))}
                            className="form-input"
                            placeholder="+/- amount"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted mb-1 block">Low Stock Threshold</label>
                          <input
                            type="number"
                            value={variant.lowStockThreshold}
                            onChange={(e) => updateVariant(index, 'lowStockThreshold', parseInt(e.target.value))}
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="card p-6">
              <h2 className="font-serif text-lg font-semibold text-charcoal mb-6">SEO Settings</h2>
              <div className="space-y-5">
                <div className="form-group">
                  <label className="form-label">SEO Title</label>
                  <input
                    type="text"
                    value={formData.seoTitle || ''}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    className="form-input"
                    placeholder="Page title for search engines"
                    maxLength={70}
                  />
                  <p className="text-xs text-muted mt-1">
                    {(formData.seoTitle || '').length}/70 characters
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">SEO Description</label>
                  <SimpleEditor
                    value={formData.seoDescription || ''}
                    onChange={(value) => setFormData({ ...formData, seoDescription: value })}
                    placeholder="Meta description for search engines..."
                    maxLength={160}
                    rows={4}
                  />
                </div>

                <div className="bg-cream/50 p-4 rounded-elegant">
                  <p className="text-xs text-muted mb-2">Search Engine Preview</p>
                  <p className="text-blue-600 text-lg font-medium mb-1">
                    {formData.seoTitle || formData.name || 'Product Title'}
                  </p>
                  <p className="text-green-700 text-xs mb-1">maisonelise.com/product/{formData.sku?.toLowerCase().replace(/-/g, '-') || 'product-url'}</p>
                  <p className="text-gray-500 text-sm">
                    {formData.seoDescription || formData.shortDescription || 'No description provided.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="card p-6">
            <h3 className="font-medium text-charcoal mb-4">Status</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-gold border-border-default rounded focus:ring-gold"
                />
                <span className="text-sm">Featured Product</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNewArrival}
                  onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                  className="w-4 h-4 text-gold border-border-default rounded focus:ring-gold"
                />
                <span className="text-sm">New Arrival</span>
              </label>
            </div>
          </div>

          {/* Shipping */}
          <div className="card p-6">
            <h3 className="font-medium text-charcoal mb-4">Shipping</h3>
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                step="0.01"
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || undefined })}
                className="form-input"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="card p-6">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full btn-primary mb-3"
            >
              {isSaving ? 'Saving...' : 'Save Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="w-full btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
