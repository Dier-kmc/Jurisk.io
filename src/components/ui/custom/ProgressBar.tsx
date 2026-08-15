/* ===== src/components/ui/ProgressBar.tsx ===== */
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'yellow' | 'green' | 'red' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProgressBar = ({
  value,
  max = 100,
  label,
  showValue = true,
  color = 'yellow',
  size = 'md',
  className,
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const colorClasses = {
    yellow: 'bg-accent',
    green: 'bg-risk-low',
    red: 'bg-risk-high',
    blue: 'bg-white/20',
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-muted">{label}</span>}
          {showValue && (
            <span className="text-sm font-medium text-gray-300">
              {value.toFixed(1)}/{max}
            </span>
          )}
        </div>
      )}
      <div className={`bg-white/10 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} rounded-full transition-all duration-300 ${sizeClasses[size]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;