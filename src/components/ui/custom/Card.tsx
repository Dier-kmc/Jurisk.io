/* ===== src/components/ui/Card.tsx ===== */
import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
}

const Card = ({
  children,
  className,
  hover = false,
  padding = 'md',
  border = true,
}: CardProps) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={clsx(
        'bg-gray-900/50 rounded-xl',
        border && 'border border-gray-800',
        paddingClasses[padding],
        hover && 'hover:border-gray-700 transition-colors',
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const CardHeader = ({ title, description, action, className }: CardHeaderProps) => {
  return (
    <div className={clsx('flex justify-between items-start mb-6', className)}>
      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        {description && (
          <p className="text-gray-400 mt-1">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

const CardContent = ({ children, className }: CardContentProps) => {
  return <div className={className}>{children}</div>;
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

const CardFooter = ({ children, className }: CardFooterProps) => {
  return (
    <div className={clsx('mt-6 pt-6 border-t border-gray-800', className)}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardContent, CardFooter };