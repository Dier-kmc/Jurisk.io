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
      termination: { label: 'Résiliation', color: 'bg-red-500/20 text-red-400' },
      audit: { label: 'Audit', color: 'bg-blue-500/20 text-blue-400' },
      modification: { label: 'Modification', color: 'bg-yellow-600/20 text-yellow-600' },
      suspension: { label: 'Suspension', color: 'bg-orange-500/20 text-orange-400' },
      general: { label: 'Général', color: 'bg-green-500/20 text-green-400' },
      other: { label: 'Autre', color: 'bg-gray-500/20 text-gray-400' },
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
    <div className={clsx('bg-gray-900/50 rounded-xl border border-green-500/30 overflow-hidden', className)}>
      {/* En-tête */}
      <div 
        className={clsx(
          'bg-green-500/20 p-4 border-b border-green-500/30',
          collapsible && 'cursor-pointer'
        )}
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <span className="ml-3 bg-green-500/30 text-green-300 text-sm px-2 py-1 rounded-full">
              {powers.length}
            </span>
          </div>
          
          {collapsible && (
            <div className="text-green-300">
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
              <p className="text-gray-400">Aucun pouvoir identifié dans ce document.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {powers.map((power) => (
                <div
                  key={power.id}
                  className="p-4 bg-black/30 rounded-lg border-l-4 border-green-500"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-white flex-1">{power.text}</p>
                    {getTypeBadge(power.type)}
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-400">
                    {power.clause && (
                      <span className="inline-flex items-center">
                        <span className="text-green-400 mr-1">§</span>
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
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h4 className="font-semibold text-green-500 mb-2">Considérations</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  Évaluer l'équilibre des pouvoirs entre parties
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  Vérifier les conditions d'exercice des pouvoirs
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
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