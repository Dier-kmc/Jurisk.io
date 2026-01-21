/* ===== src/components/results/RiskBlock.tsx ===== */
'use client';

import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { RiskItem } from '@/lib/utils/riskCalculator';
import Badge from '@/components/ui/custom/Badge';

interface RiskBlockProps {
  risks: RiskItem[];
  title?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

const RiskBlock = ({
  risks,
  title = 'RISQUES IDENTIFIÉS',
  collapsible = false,
  defaultExpanded = true,
  className,
}: RiskBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getSeverityColor = (severity: RiskItem['severity']) => {
    switch (severity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-orange-400';
      case 'low': return 'text-yellow-600';
      default: return 'text-gray-400';
    }
  };

  const getSeverityBadge = (severity: RiskItem['severity']) => {
    const labels = {
      high: 'Élevé',
      medium: 'Moyen',
      low: 'Faible',
    };
    
    const variants = {
      high: 'danger' as const,
      medium: 'warning' as const,
      low: 'default' as const,
    };
    
    return <Badge variant={variants[severity]}>{labels[severity]}</Badge>;
  };

  return (
    <div className={clsx('bg-gray-900/50 rounded-xl border border-red-500/30 overflow-hidden', className)}>
      {/* En-tête */}
      <div 
        className={clsx(
          'bg-red-500/20 p-4 border-b border-red-500/30',
          collapsible && 'cursor-pointer'
        )}
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <span className="ml-3 bg-red-500/30 text-red-300 text-sm px-2 py-1 rounded-full">
              {risks.length}
            </span>
          </div>
          
          {collapsible && (
            <div className="text-red-300">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          )}
        </div>
      </div>

      {/* Contenu */}
      {isExpanded && (
        <div className="p-6">
          {risks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Aucun risque identifié dans ce document.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {risks.map((risk) => (
                <div
                  key={risk.id}
                  className={clsx(
                    'p-4 rounded-lg border-l-4 transition-colors hover:bg-black/20',
                    risk.severity === 'high' && 'border-red-500 bg-red-500/10',
                    risk.severity === 'medium' && 'border-orange-500 bg-orange-500/10',
                    risk.severity === 'low' && 'border-yellow-500 bg-yellow-600/10'
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{risk.title}</h4>
                      <p className="text-gray-300 text-sm">{risk.description}</p>
                    </div>
                    {getSeverityBadge(risk.severity)}
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-gray-400">
                      {risk.clause && (
                        <span className="inline-flex items-center">
                          <span className="text-yellow-600 mr-1">§</span>
                          Clause {risk.clause}
                        </span>
                      )}
                    </div>
                    
                    {risk.probability && risk.impact && (
                      <div className="text-xs text-gray-500">
                        Probabilité: {(risk.probability * 100).toFixed(0)}% • 
                        Impact: {risk.impact}/10
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Résumé */}
          {risks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h4 className="font-semibold text-yellow-600 mb-2">Recommandations</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2 mt-1">→</span>
                  Prioriser la négociation des risques élevés
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2 mt-1">→</span>
                  Documenter les décisions pour chaque risque
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2 mt-1">→</span>
                  Consulter un expert pour les risques complexes
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RiskBlock;