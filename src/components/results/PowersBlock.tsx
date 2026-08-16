/* ===== src/components/results/PowersBlock.tsx ===== */
'use client';

import { Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

// Mettez à jour le type pour inclure 'general' ou simplifiez-le
interface Power {
  id: string;
  text: string;
  clause?: string;
  type?: 'termination' | 'audit' | 'modification' | 'suspension' | 'general' | 'other';
}

interface PowersBlockProps {
  powers: Power[];
  title?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

const PowersBlock = ({
  powers,
  title = 'POUVOIRS',
  collapsible = false,
  defaultExpanded = true,
  className,
}: PowersBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getTypeBadge = (type?: Power['type']) => {
    if (!type) return null;
    
    const config = {
      termination: { label: 'Résiliation', color: 'bg-risk-high/20 text-risk-high' },
      audit: { label: 'Audit', color: 'bg-accent/20 text-accent' },
      modification: { label: 'Modification', color: 'bg-accent/20 text-accent' },
      suspension: { label: 'Suspension', color: 'bg-risk-medium/20 text-risk-medium' },
      general: { label: 'Général', color: 'bg-risk-low/20 text-risk-low' },
      other: { label: 'Autre', color: 'bg-faint/20 text-faint' },
    };
    
    const { label, color } = config[type] || config.other;
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  // ... reste du code inchangé
  return (
    <div className={clsx('bg-surface-1 rounded-xl border border-risk-low/30 overflow-hidden', className)}>
      {/* En-tête */}
      <div 
        className={clsx(
          'bg-risk-low/10 p-4 border-b border-risk-low/30',
          collapsible && 'cursor-pointer'
        )}
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-risk-low rounded-full flex items-center justify-center mr-3">
              <Shield className="w-4 h-4 text-background" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <span className="ml-3 bg-risk-low/30 text-risk-low text-sm px-2 py-1 rounded-full">
              {powers.length}
            </span>
          </div>
          
          {collapsible && (
            <div className="text-risk-low">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          )}
        </div>
      </div>
  
      {/* Contenu */}
      {isExpanded && (
        <div className="p-6">
          {powers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted">Aucun pouvoir identifié dans ce document.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {powers.map((power) => (
                <div
                  key={power.id}
                  className="p-4 bg-surface-2 rounded-lg border-l-4 border-risk-low"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-foreground flex-1">{power.text}</p>
                    {getTypeBadge(power.type)}
                  </div>
                  
                  <div className="mt-3 text-sm text-muted">
                    {power.clause && (
                      <span className="inline-flex items-center">
                        <span className="text-risk-low mr-1">§</span>
                        Clause {power.clause}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
  
          {/* Résumé */}
          {powers.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="font-semibold text-risk-low mb-2">Considérations</h4>
              <ul className="space-y-2 text-muted">
                <li className="flex items-start">
                  <span className="text-risk-low mr-2 mt-1">•</span>
                  Évaluer l'équilibre des pouvoirs entre parties
                </li>
                <li className="flex items-start">
                  <span className="text-risk-low mr-2 mt-1">•</span>
                  Vérifier les conditions d'exercice des pouvoirs
                </li>
                <li className="flex items-start">
                  <span className="text-risk-low mr-2 mt-1">•</span>
                  Documenter les procédures d'exercice
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PowersBlock