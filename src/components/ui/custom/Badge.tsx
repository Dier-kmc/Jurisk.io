/* ===== src/components/ui/Badge.tsx ===== */
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) => {
  const variantClasses = {
    default: 'bg-surface-2 text-muted',
    success: 'bg-risk-low/15 text-risk-low',
    warning: 'bg-risk-medium/15 text-risk-medium',
    danger: 'bg-risk-high/15 text-risk-high',
    info: 'bg-white/5 text-muted',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;