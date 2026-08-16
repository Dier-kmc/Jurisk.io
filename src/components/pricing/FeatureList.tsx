/* ===== src/components/pricing/FeatureList.tsx ===== */
'use client';

import { Check, X, Zap, Shield, Clock, Users, FileCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { FEATURES, FEATURE_CATEGORIES } from '@/lib/constants/features';
import { PLANS } from '@/lib/constants/plans';

interface FeatureListProps {
  showComparison?: boolean;
  className?: string;
}

const FeatureList = ({ showComparison = true, className }: FeatureListProps) => {
  const freePlan = PLANS.find(p => p.id === 'free')!;
  const premiumPlan = PLANS.find(p => p.id === 'premium')!;

  const getFeatureIcon = (category: string) => {
    switch (category) {
      case 'analysis': return <FileCheck className="w-5 h-5" />;
      case 'security': return <Shield className="w-5 h-5" />;
      case 'productivity': return <Zap className="w-5 h-5" />;
      case 'export': return <Clock className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  return (
    <div className={className}>
      {showComparison ? (
        <>
          {/* En-tête de comparaison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div></div>
            <div className="text-center">
              <div className="text-lg font-bold text-white mb-2">{freePlan.name}</div>
              <div className="text-3xl font-bold text-white mb-1">
                {freePlan.price === 0 ? 'Gratuit' : `${freePlan.price}€`}
              </div>
              <div className="text-muted text-sm">/{freePlan.period}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white mb-2">{premiumPlan.name}</div>
              <div className="text-3xl font-bold text-white mb-1">{premiumPlan.price}€</div>
              <div className="text-muted text-sm">/{premiumPlan.period}</div>
            </div>
          </div>

          {/* Liste des fonctionnalités */}
          <div className="space-y-6">
            {FEATURE_CATEGORIES.map((category) => {
              const categoryFeatures = FEATURES.filter(f => f.category === category.id);
              
              return (
                <div key={category.id} className="bg-surface-1 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center mr-3`}>
                      {getFeatureIcon(category.id)}
                    </div>
                    <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {categoryFeatures.map((feature) => {
                      const freeIncluded = feature.plans.includes('free');
                      const premiumIncluded = feature.plans.includes('premium');
                      
                      return (
                        <div
                          key={feature.id}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-3 border-b border-border last:border-0"
                        >
                          <div className="md:col-span-1">
                            <div className="flex items-center">
                              <span className="text-xl mr-3">{feature.icon}</span>
                              <div>
                                <p className="font-medium text-white">{feature.title}</p>
                                <p className="text-sm text-muted">{feature.description}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="md:col-span-2 grid grid-cols-2 gap-6">
                            <div className="text-center">
                              {freeIncluded ? (
                                <Check className="w-6 h-6 text-risk-low mx-auto" />
                              ) : (
                                <X className="w-6 h-6 text-faint mx-auto" />
                              )}
                            </div>
                            <div className="text-center">
                              {premiumIncluded ? (
                                <Check className="w-6 h-6 text-risk-low mx-auto" />
                              ) : (
                                <X className="w-6 h-6 text-faint mx-auto" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Vue simple par catégorie */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURE_CATEGORIES.map((category) => {
            const categoryFeatures = FEATURES.filter(f => f.category === category.id);
            
            return (
              <div key={category.id} className="bg-surface-1 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center mr-3`}>
                    {getFeatureIcon(category.id)}
                  </div>
                  <h3 className={`text-lg font-semibold ${category.textColor}`}>
                    {category.name}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {categoryFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-start"
                    >
                      <span className={`mt-1 ${category.textColor}`}>•</span>
                      <div className="ml-2">
                        <p className="text-white">{feature.title}</p>
                        <p className="text-sm text-muted">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FeatureList;