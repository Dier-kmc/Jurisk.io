/* ===== src/components/pricing/PricingCard.tsx ===== */
'use client';

import { Check, X, Star, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { PricingPlan } from '@/lib/constants/plans';
import Button, { CustomButton } from '@/components/ui/custom/CustomButton';

interface PricingCardProps {
  plan: PricingPlan;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
}

const PricingCard = ({
  plan,
  selected = false,
  onSelect,
  className,
}: PricingCardProps) => {
  const isPopular = plan.popular;

  return (
    <div
      className={clsx(
        'relative rounded-2xl p-8 transition-all duration-300',
        isPopular
          ? 'bg-gray-900/20 border border-yellow-600/40'
          : 'bg-gray-900/20 border border-gray-300/30',
        selected && 'ring-1 ring-yellow-500',
        className
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-yellow-600 text-gray-300 font-bold px-6 py-1 rounded-full text-sm flex items-center">
            <Star size={12} className="mr-1" />
            {plan.badge || 'Populaire'}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        <div className="flex items-baseline mb-4">
          <span className="text-4xl font-bold text-white">
            {plan.price === 0 ? 'Gratuit' : `${plan.price}${plan.currency || '€'}`}
          </span>
          {plan.price > 0 && (
            <span className="text-gray-400 ml-2">/{plan.period}</span>
          )}
        </div>
        <p className="text-gray-400">{plan.description}</p>
      </div>

      <div className="mb-10 space-y-4">
        {plan.features.map((feature) => (
          <div
            key={feature.id}
            className={clsx(
              'flex items-center',
              feature.highlight && 'bg-yellow-600/10 p-3 rounded-lg'
            )}
          >
            {feature.included ? (
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
            )}
            <span
              className={clsx(
                feature.included ? 'text-gray-300' : 'text-gray-600',
                feature.highlight && 'font-medium text-yellow-600'
              )}
            >
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      <CustomButton
        variant={plan.ctaVariant}
        fullWidth
        size="lg"
        className={clsx(
          'transition-transform hover:scale-[1.02] border-gray-300/40',
          isPopular && 'shadow-lg shadow-yellow-500/20 border border-gray-300/70 bg-yellow-600/90'
        )}
        onClick={onSelect}
        leftIcon={isPopular && <Zap size={18} />}
      >
        {plan.ctaText}
      </CustomButton>

      {plan.limit && (
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-500">
            {plan.limit.uploads === Infinity ? (
              'Analyses illimitées'
            ) : (
              `${plan.limit.uploads} analyse${plan.limit.uploads > 1 ? 's' : ''}/mois`
            )}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Taille max: {plan.limit.fileSize} • Historique: {plan.limit.history}
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingCard;