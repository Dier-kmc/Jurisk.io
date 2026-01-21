/* ===== src/components/results/VigilanceScore.tsx ===== */
'use client';

import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { clsx } from 'clsx';
import { RISK_LEVELS, getRiskLevelByScore } from '@/lib/constants/riskLevels';
import ProgressBar from '@/components/ui/custom/ProgressBar';

interface VigilanceScoreProps {
  score: number;
  max?: number;
  showLabel?: boolean;
  showDescription?: boolean;
  showProgress?: boolean;
  className?: string;
}

const VigilanceScore = ({
  score,
  max = 10,
  showLabel = true,
  showDescription = true,
  showProgress = true,
  className,
}: VigilanceScoreProps) => {
  const riskLevel = getRiskLevelByScore(score);
  const percentage = (score / max) * 100;

  const getTrendIcon = () => {
    if (score >= 7) return <TrendingUp className="w-5 h-5" />;
    if (score >= 4) return <Minus className="w-5 h-5" />;
    return <TrendingDown className="w-5 h-5" />;
  };

  return (
    <div className={clsx('bg-gray-300/10 p-6 rounded-xl', className)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center mr-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Score de vigilance</h3>
              {showLabel && (
                <p className="text-gray-400">Évaluation globale des risques identifiés</p>
              )}
            </div>
          </div>

          {showDescription && (
            <p className="text-gray-300 mt-2">
              {riskLevel.description}
            </p>
          )}
        </div>

        <div className="text-center min-w-[180px]">
          <div className="flex items-center justify-center mb-2">
            <div className={clsx(
              'text-5xl font-bold',
              riskLevel.id === 'critical' && 'text-red-300',
              riskLevel.id === 'high' && 'text-red-400',
              riskLevel.id === 'medium' && 'text-orange-400',
              riskLevel.id === 'low' && 'text-green-400'
            )}>
              {score.toFixed(1)}
            </div>
            <div className="ml-2 text-gray-400 text-lg">/{max}</div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-3">
            <span className={clsx(
              'text-sm font-semibold',
              riskLevel.id === 'critical' && 'text-red-300',
              riskLevel.id === 'high' && 'text-red-400',
              riskLevel.id === 'medium' && 'text-orange-400',
              riskLevel.id === 'low' && 'text-green-400'
            )}>
              {riskLevel.label}
            </span>
            <div className={clsx(
              riskLevel.id === 'critical' && 'text-red-300',
              riskLevel.id === 'high' && 'text-red-400',
              riskLevel.id === 'medium' && 'text-orange-400',
              riskLevel.id === 'low' && 'text-green-400'
            )}>
              {getTrendIcon()}
            </div>
          </div>

          {showProgress && (
            <div className="w-48 mx-auto">
              <ProgressBar
                value={score}
                max={max}
                color={
                  riskLevel.id === 'critical' || riskLevel.id === 'high' 
                    ? 'red' 
                    : riskLevel.id === 'medium' 
                    ? 'yellow' 
                    : 'green'
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Recommandations rapides */}
      {showDescription && (
        <div className="mt-6 pt-6 border-t border-gray-800">
          <h4 className="font-semibold text-yellow-600 mb-3">Actions recommandées</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {riskLevel.recommendations.slice(0, 3).map((rec, index) => (
              <div
                key={index}
                className="bg-black/30 p-3 rounded-lg text-sm text-gray-300"
              >
                <div className="flex items-start">
                  <span className="text-yellow-600 mr-2 mt-0.5">•</span>
                  {rec}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VigilanceScore;