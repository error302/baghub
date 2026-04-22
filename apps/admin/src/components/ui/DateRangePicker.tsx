import { useState } from 'react'
import { Calendar, ChevronDown, X } from 'lucide-react'
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'
import { cn } from '@/utils/cn'

interface DateRange {
  from: Date
  to: Date
  label?: string
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  presets?: boolean
  className?: string
}

const PRESETS = [
  { label: 'Today', getValue: () => ({ from: new Date(), to: new Date() }) },
  { label: 'Yesterday', getValue: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }) },
  { label: 'Last 7 days', getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
  { label: 'Last 30 days', getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
  { label: 'This month', getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: 'This year', getValue: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }) },
]

export function DateRangePicker({
  value,
  onChange,
  presets = true,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempRange, setTempRange] = useState<DateRange>(value)
  const [view, setView] = useState<'from' | 'to'>('from')

  const handleApply = () => {
    onChange(tempRange)
    setIsOpen(false)
  }

  const handleClear = () => {
    const today = new Date()
    const newRange = { from: today, to: today }
    setTempRange(newRange)
    onChange(newRange)
    setIsOpen(false)
  }

  const handlePresetClick = (preset: typeof PRESETS[0]) => {
    const range = preset.getValue()
    setTempRange({ ...range, label: preset.label })
    onChange({ ...range, label: preset.label })
    setIsOpen(false)
  }

  const displayValue = value.label
    ? value.label
    : `${format(value.from, 'MMM d, yyyy')} - ${format(value.to, 'MMM d, yyyy')}`

  return (
    <div className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 border rounded-elegant text-sm transition-all duration-luxury',
          isOpen
            ? 'border-gold bg-gold/5'
            : 'border-border-default hover:border-gold/50'
        )}
      >
        <Calendar className="w-4 h-4 text-muted" />
        <span className="text-charcoal">{displayValue}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-muted transition-transform duration-luxury',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-elegant shadow-elegant border border-border-subtle z-50 animate-slide-in">
          {/* Presets */}
          {presets && (
            <div className="p-3 border-b border-border-subtle">
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Quick Select</p>
              <div className="flex flex-wrap gap-1">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetClick(preset)}
                    className="px-2 py-1 text-xs text-charcoal bg-cream rounded-elegant hover:bg-gold/10 transition-colors duration-luxury"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Range */}
          <div className="p-3">
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Custom Range</p>

            {/* From Date */}
            <div className="mb-3">
              <label className="block text-xs text-muted mb-1">From</label>
              <input
                type="date"
                value={format(tempRange.from, 'yyyy-MM-dd')}
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  setTempRange((prev) => ({ ...prev, from: date }))
                }}
                className="w-full px-3 py-2 text-sm border border-border-default rounded-elegant focus:outline-none focus:border-gold"
              />
            </div>

            {/* To Date */}
            <div className="mb-4">
              <label className="block text-xs text-muted mb-1">To</label>
              <input
                type="date"
                value={format(tempRange.to, 'yyyy-MM-dd')}
                min={format(tempRange.from, 'yyyy-MM-dd')}
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  setTempRange((prev) => ({ ...prev, to: date }))
                }}
                className="w-full px-3 py-2 text-sm border border-border-default rounded-elegant focus:outline-none focus:border-gold"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleClear}
                className="flex items-center gap-1 text-xs text-muted hover:text-status-error transition-colors"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 text-xs text-charcoal border border-border-default rounded-elegant hover:bg-cream transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="px-3 py-1.5 text-xs text-white bg-gold rounded-elegant hover:bg-gold-dark transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

// Simple date picker for single dates
interface DatePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 border rounded-elegant text-sm transition-all duration-luxury w-full',
          isOpen
            ? 'border-gold bg-gold/5'
            : 'border-border-default hover:border-gold/50'
        )}
      >
        <Calendar className="w-4 h-4 text-muted" />
        <span className="text-charcoal">
          {value ? format(value, 'MMM d, yyyy') : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-elegant shadow-elegant border border-border-subtle z-50 p-3 animate-slide-in">
          <input
            type="date"
            value={value ? format(value, 'yyyy-MM-dd') : ''}
            onChange={(e) => {
              onChange(e.target.value ? new Date(e.target.value) : null)
              setIsOpen(false)
            }}
            className="w-full px-3 py-2 text-sm border border-border-default rounded-elegant focus:outline-none focus:border-gold"
          />
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
