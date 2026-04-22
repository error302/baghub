import { cn } from '@/utils/cn'

type StatusType = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded'
  | 'draft'
  | 'active'
  | 'archived'
  | 'completed'
  | 'failed'

interface StatusBadgeProps {
  status: StatusType | string
  size?: 'sm' | 'md' | 'lg'
}

const statusStyles: Record<StatusType, { bg: string; text: string; border?: string }> = {
  // Order statuses
  pending: {
    bg: 'bg-status-warning-bg',
    text: 'text-status-warning',
    border: 'border-status-warning/20',
  },
  confirmed: {
    bg: 'bg-status-info-bg',
    text: 'text-status-info',
    border: 'border-status-info/20',
  },
  processing: {
    bg: 'bg-status-info-bg',
    text: 'text-status-info',
    border: 'border-status-info/20',
  },
  shipped: {
    bg: 'bg-gold/10',
    text: 'text-gold',
    border: 'border-gold/20',
  },
  delivered: {
    bg: 'bg-status-success-bg',
    text: 'text-status-success',
    border: 'border-status-success/20',
  },
  cancelled: {
    bg: 'bg-status-error-bg',
    text: 'text-status-error',
    border: 'border-status-error/20',
  },
  refunded: {
    bg: 'bg-status-error-bg',
    text: 'text-status-error',
    border: 'border-status-error/20',
  },
  // Product statuses
  draft: {
    bg: 'bg-cream',
    text: 'text-muted',
    border: 'border-muted/20',
  },
  active: {
    bg: 'bg-status-success-bg',
    text: 'text-status-success',
    border: 'border-status-success/20',
  },
  archived: {
    bg: 'bg-slate/10',
    text: 'text-slate',
    border: 'border-slate/20',
  },
  // Payment statuses
  completed: {
    bg: 'bg-status-success-bg',
    text: 'text-status-success',
    border: 'border-status-success/20',
  },
  failed: {
    bg: 'bg-status-error-bg',
    text: 'text-status-error',
    border: 'border-status-error/20',
  },
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase() as StatusType
  const styles = statusStyles[normalizedStatus] || {
    bg: 'bg-cream',
    text: 'text-muted',
    border: 'border-muted/20',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        styles.bg,
        styles.text,
        styles.border,
        sizeStyles[size]
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          size === 'sm' && 'w-1 h-1 mr-1',
          normalizedStatus === 'active' || normalizedStatus === 'delivered' || normalizedStatus === 'completed'
            ? 'bg-current'
            : 'bg-current/60'
        )}
      />
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  )
}

// Payment status badge variant
export function PaymentStatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase() as StatusType
  
  const paymentStyles: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'bg-status-warning-bg', text: 'text-status-warning' },
    processing: { bg: 'bg-status-info-bg', text: 'text-status-info' },
    completed: { bg: 'bg-status-success-bg', text: 'text-status-success' },
    failed: { bg: 'bg-status-error-bg', text: 'text-status-error' },
    refunded: { bg: 'bg-status-error-bg', text: 'text-status-error' },
  }
  
  const styles = paymentStyles[normalizedStatus] || { bg: 'bg-cream', text: 'text-muted' }
  
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        styles.bg,
        styles.text,
        sizeStyles[size]
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  )
}
