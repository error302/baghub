import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/utils/format'
import { cn } from '@/utils/cn'

interface SalesDataPoint {
  date: string
  revenue: number
  orders: number
}

interface SalesChartProps {
  data: SalesDataPoint[]
  period?: 'day' | 'week' | 'month' | 'year'
  showOrders?: boolean
  className?: string
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string }>
  label?: string
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-elegant border border-border-subtle rounded-elegant">
        <p className="text-xs text-muted mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium">
            {entry.dataKey === 'revenue' ? (
              <span className="text-gold">Revenue: {formatCurrency(entry.value)}</span>
            ) : (
              <span className="text-charcoal">Orders: {entry.value}</span>
            )}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function SalesChart({
  data,
  period = 'day',
  showOrders = true,
  className,
}: SalesChartProps) {
  // Transform data for display
  const chartData = data.map((item) => ({
    ...item,
    displayDate: formatDateDisplay(item.date, period),
  }))

  return (
    <div className={cn('h-[300px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B8965A" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#B8965A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#EDE9E1"
            vertical={false}
          />
          <XAxis
            dataKey="displayDate"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8A8278', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8A8278', fontSize: 12 }}
            tickFormatter={(value) => `KES ${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#B8965A"
            strokeWidth={2}
            fill="url(#colorRevenue)"
            dot={false}
            activeDot={{ r: 6, fill: '#B8965A', stroke: '#fff', strokeWidth: 2 }}
          />
          {showOrders && (
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#1C1C1C"
              strokeWidth={2}
              fill="none"
              dot={{ r: 3, fill: '#1C1C1C' }}
              activeDot={{ r: 5, fill: '#1C1C1C', stroke: '#fff', strokeWidth: 2 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function formatDateDisplay(date: string, period: 'day' | 'week' | 'month' | 'year'): string {
  const d = new Date(date)
  switch (period) {
    case 'day':
      return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
    case 'week':
      return `Week ${getWeekNumber(d)}`
    case 'month':
      return d.toLocaleDateString('en-US', { month: 'short' })
    case 'year':
      return d.getFullYear().toString()
    default:
      return date
  }
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

// Simple bar chart for category revenue
interface CategoryDataPoint {
  name: string
  value: number
}

interface CategoryChartProps {
  data: CategoryDataPoint[]
  className?: string
}

export function CategoryChart({ data, className }: CategoryChartProps) {
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = require('recharts')

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean
    payload?: Array<{ value: number }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-elegant border border-border-subtle rounded-elegant">
          <p className="text-xs text-muted mb-1">{label}</p>
          <p className="text-sm font-medium text-gold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={cn('h-[250px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EDE9E1" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8A8278', fontSize: 12 }}
            dy={10}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8A8278', fontSize: 12 }}
            tickFormatter={(value) => `KES ${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            fill="#B8965A"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
