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
    default: 'bg-gray-800 text-gray-300',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-600/20 text-yellow-600',
    danger: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
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