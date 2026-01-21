/* ===== src/components/ui/Alert.tsx ===== */
import { ReactNode } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

interface AlertProps {
  title?: string;
  children: ReactNode;
  /** Type d'alerte qui détermine le style et l'icône */
  type?: 'info' | 'success' | 'warning' | 'error';
  /** Variant visuel (alternatives de style pour le même type) */
  variant?: 'default' | 'subtle' | 'filled';
  onClose?: () => void;
  className?: string;
  icon?: ReactNode;
  /** Si `true`, rend le contenu en une ligne avec les icônes alignées */
  inline?: boolean;
}

const Alert = ({
  title,
  children,
  type = 'info',
  variant = 'default',
  onClose,
  className,
  icon,
  inline = false,
}: AlertProps) => {
  // Configuration des types - "error" remplace "danger" pour plus de standard
  const typeConfig = {
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
      icon: <Info className="w-5 h-5" />,
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      iconBg: 'bg-green-500/20',
      icon: <CheckCircle className="w-5 h-5" />,
    },
    warning: {
      bg: 'bg-yellow-600/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-600',
      iconBg: 'bg-yellow-500/20',
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      iconBg: 'bg-red-500/20',
      icon: <AlertCircle className="w-5 h-5" />,
    },
  };

  // Configuration des variants visuels
  const variantStyles = {
    default: '',
    subtle: 'bg-opacity-10 border-opacity-20',
    filled: {
      info: 'bg-blue-500 border-blue-600 text-white',
      success: 'bg-green-500 border-green-600 text-white',
      warning: 'bg-yellow-500 border-yellow-600 text-white',
      error: 'bg-red-500 border-red-600 text-white',
    },
  };

  const config = typeConfig[type];

  // Appliquer les styles de variant
  let variantStyle = '';
  if (variant === 'filled') {
    variantStyle = variantStyles.filled[type];
  } else if (variant === 'subtle') {
    variantStyle = variantStyles.subtle;
  }

  return (
    <div
      className={clsx(
        'rounded-lg border p-4',
        variant === 'filled' ? variantStyle : config.bg,
        variant === 'filled' ? variantStyle : config.border,
        inline && 'flex items-center justify-between',
        className
      )}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <div className={clsx('flex items-start', inline && 'items-center')}>
        <div className={clsx(
          'flex-shrink-0 rounded-lg p-2',
          variant === 'filled' 
            ? 'bg-white/20' 
            : config.iconBg,
          variant === 'filled' && 'text-white'
        )}>
          <div className={clsx(
            variant !== 'filled' && config.text
          )}>
            {icon || config.icon}
          </div>
        </div>
        
        <div className={clsx('ml-3 flex-1', inline && 'ml-4')}>
          {title && (
            <h3 className={clsx(
              'font-medium',
              variant === 'filled' ? 'text-white' : config.text,
              inline && 'mb-0'
            )}>
              {title}
            </h3>
          )}
          <div className={clsx(
            'text-sm',
            variant === 'filled' ? 'text-white/90' : 'text-gray-300',
            !inline && title && 'mt-1',
            inline && 'ml-2'
          )}>
            {children}
          </div>
        </div>
        
        {onClose && (
          <button
            type="button"
            className={clsx(
              "flex-shrink-0 hover:opacity-80 transition-opacity",
              variant === 'filled' 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-300',
              inline ? 'ml-4' : 'ml-4 mt-0.5'
            )}
            onClick={onClose}
            aria-label="Fermer l'alerte"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// Export avec alias pour compatibilité descendante
export { type AlertProps };
export default Alert;