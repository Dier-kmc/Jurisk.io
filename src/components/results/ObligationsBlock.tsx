/* ===== src/components/results/ObligationsBlock.tsx ===== */
'use client';

import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

interface Obligation {
  id: string;
  text: string;
  clause?: string;
  deadline?: string;
  responsible?: string;
}

interface ObligationsBlockProps {
  obligations: Obligation[];
  title?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

const ObligationsBlock = ({
  obligations,
  title = 'OBLIGATIONS',
  collapsible = false,
  defaultExpanded = true,
  className,
}: ObligationsBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={clsx('bg-surface-1 rounded-xl border border-accent/30 overflow-hidden', className)}>
      {/* En-tête */}
      <div 
        className={clsx(
          'bg-accent/10 p-4 border-b border-accent/30',
          collapsible && 'cursor-pointer'
        )}
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mr-3">
              <FileText className="w-4 h-4 text-background" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <span className="ml-3 bg-accent/30 text-accent text-sm px-2 py-1 rounded-full">
              {obligations.length}
            </span>
          </div>
          
          {collapsible && (
            <div className="text-accent">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          )}
        </div>
      </div>

      {/* Contenu */}
      {isExpanded && (
        <div className="p-6">
          {obligations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted">Aucune obligation identifiée dans ce document.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {obligations.map((obligation) => (
                <div
                  key={obligation.id}
                  className="p-4 bg-surface-2 rounded-lg border-l-4 border-accent"
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <p className="text-foreground">{obligation.text}</p>
                      
                      <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted">
                        {obligation.clause && (
                          <span className="inline-flex items-center bg-surface-2 px-2 py-1 rounded">
                            <span className="text-accent mr-1">§</span>
                            Clause {obligation.clause}
                          </span>
                        )}
                        
                        {obligation.deadline && (
                          <span className="inline-flex items-center bg-surface-2 px-2 py-1 rounded">
                            <span className="text-accent mr-1">⏰</span>
                            {obligation.deadline}
                          </span>
                        )}
                        
                        {obligation.responsible && (
                          <span className="inline-flex items-center bg-surface-2 px-2 py-1 rounded">
                            <span className="text-risk-low mr-1">👤</span>
                            {obligation.responsible}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Résumé */}
          {obligations.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="font-semibold text-accent mb-2">Points d'attention</h4>
              <ul className="space-y-2 text-muted">
                <li className="flex items-start">
                  <span className="text-accent mr-2 mt-1">•</span>
                  Vérifier les délais et échéances
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2 mt-1">•</span>
                  S'assurer des ressources nécessaires
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2 mt-1">•</span>
                  Documenter les preuves d'exécution
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ObligationsBlock;