import { useState } from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Column<T> {
  key: string
  header: string
  width?: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  sortable?: boolean
  onSort?: (key: string, order: 'asc' | 'desc') => void
  isLoading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  keyExtractor: (row: T) => string
}

export function DataTable<T>({
  columns,
  data,
  sortable = true,
  onSort,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
  keyExtractor,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; order: 'asc' | 'desc' } | null>(null)

  const handleSort = (key: string) => {
    if (!sortable) return

    let newOrder: 'asc' | 'desc' = 'asc'
    if (sortConfig?.key === key && sortConfig.order === 'asc') {
      newOrder = 'desc'
    }
    setSortConfig({ key, order: newOrder })
    onSort?.(key, newOrder)
  }

  const getSortIcon = (key: string) => {
    if (!sortable) return null
    if (sortConfig?.key !== key) return <ChevronsUpDown className="w-3.5 h-3.5 text-muted/40" />
    if (sortConfig.order === 'asc') return <ChevronUp className="w-3.5 h-3.5 text-gold" />
    return <ChevronDown className="w-3.5 h-3.5 text-gold" />
  }

  if (isLoading) {
    return (
      <div className="card overflow-hidden">
        <div className="animate-pulse">
          <div className="h-10 bg-cream" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 border-b border-border-subtle last:border-0">
              <div className="flex h-full">
                {columns.map((col, j) => (
                  <div
                    key={j}
                    className="flex-1 px-4 flex items-center"
                    style={{ width: col.width }}
                  >
                    <div className="h-4 bg-cream rounded w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="card overflow-hidden">
        <div className="py-16 px-6 text-center">
          <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-muted">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-luxury">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'whitespace-nowrap',
                    column.width && 'w-[var(--width)]',
                    sortable && column.sortable !== false && 'cursor-pointer hover:bg-cream/50'
                  )}
                  style={column.width ? { width: column.width } : undefined}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    <span>{column.header}</span>
                    {column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'transition-colors duration-luxury',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(row)
                      : (row as Record<string, unknown>)[column.key] as string}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
