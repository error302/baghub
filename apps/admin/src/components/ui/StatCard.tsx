import { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatCurrency, formatNumber } from '@/utils/format'

interface StatCardProps {
  title: string
  value: number
  type?: 'currency' | 'number' | 'percentage'
  change?: number
  changeLabel?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
}

export function StatCard({
  title,
  value,
  type = 'number',
  change,
  changeLabel = 'vs last month',
  icon: Icon,
  trend,
}: StatCardProps) {
  const formattedValue =
    type === 'currency'
      ? formatCurrency(value)
      : type === 'percentage'
      ? `${formatNumber(value, 1)}%`
      : formatNumber(value, 0)

  const trendValue = trend || (change && change > 0 ? 'up' : change && change < 0 ? 'down' : 'neutral')

  return (
    <div className="card p-6 group hover:shadow-elegant transition-shadow duration-luxury">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted font-medium">{title}</p>
          <p className="font-serif text-3xl font-semibold text-charcoal mt-2">
            {formattedValue}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={cn(
                  'text-xs font-medium',
                  trendValue === 'up' && 'text-status-success',
                  trendValue === 'down' && 'text-status-error',
                  trendValue === 'neutral' && 'text-muted'
                )}
              >
                {change > 0 ? '+' : ''}
                {change}%
              </span>
              <span className="text-xs text-muted">{changeLabel}</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-cream rounded-elegant flex items-center justify-center group-hover:bg-gold/5 transition-colors duration-luxury">
          <Icon className="w-5 h-5 text-gold" />
        </div>
      </div>
    </div>
  )
}
