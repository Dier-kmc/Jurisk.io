'use client';

import { Check, X, Star, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { CustomButton } from '@/components/ui/custom/CustomButton';
import { CreditPack } from '@/lib/constants/plans'; // Changé de PricingPlan à CreditPack

interface PricingCardProps {
  plan: CreditPack; // Changé de PricingPlan à CreditPack
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

  // Créer un objet CURRENCY_SYMBOLS si non disponible
  const CURRENCY_SYMBOLS: Record<string, string> = {
    EUR: "€",
    USD: "$",
    GBP: "£",
  };

  return (
    <div
      className={clsx(
        'relative rounded-xl p-8 transition-all duration-300 border',
        isPopular
          ? 'border-accent bg-accent/5'
          : 'border-white/[0.06] bg-surface-1',
        selected && 'ring-1 ring-accent',
        className
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-accent text-background font-bold px-6 py-1 rounded-full text-sm flex items-center">
            <Star size={12} className="mr-1" />
            {plan.badge || 'Populaire'}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        <div className="flex items-baseline mb-4">
          <span className="text-4xl font-bold text-white">
            {plan.price === 0 ? 'Gratuit' : `${plan.price}${CURRENCY_SYMBOLS[plan.currency] || plan.currency}`}
          </span>
          {/* Supprimé le /{plan.period} car non présent dans CreditPack */}
        </div>
        <p className="text-muted">{plan.description}</p>
      </div>

      <div className="mb-10 space-y-4">
        {plan.features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center"
          >
            <Check className="w-5 h-5 text-risk-low mr-3 flex-shrink-0" />
            <span className="text-muted">
              {feature}
            </span>
          </div>
        ))}
      </div>

      <CustomButton
        variant={isPopular ? "primary" : "outline"}
        fullWidth
        size="lg"
        className={clsx(
          'transition-transform hover:scale-[1.02]',
          isPopular && 'border-accent bg-accent text-background hover:bg-accent-bright'
        )}
        onClick={onSelect}
        leftIcon={isPopular && <Zap size={18} />}
      >
        {plan.price === 0 ? 'Commencer gratuitement' : 'Acheter maintenant'}
      </CustomButton>

      {/* Section limite modifiée pour correspondre à CreditPack */}
      <div className="mt-4 text-center">
        <div className="text-sm text-faint">
          {plan.credits} crédits
        </div>
        <div className="text-xs text-faint mt-1">
          Valable à vie • +3 crédits offerts/mois
        </div>
      </div>
    </div>
  );
};

export default PricingCard;