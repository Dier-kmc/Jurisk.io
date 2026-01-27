'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Target, Zap, Clock, Activity } from 'lucide-react';
import { Risk } from '@/types/contract';

interface RiskMatrixProps {
  risks: Risk[];
  detailed?: boolean;
}

export default function RiskMatrix({ risks, detailed = true }: RiskMatrixProps) {
  const getRiskLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high' | undefined) => {
    switch (priority) {
      case 'high': return 'border-red-500 text-red-500';
      case 'medium': return 'border-yellow-500 text-yellow-500';
      case 'low': return 'border-green-500 text-green-500';
      default: return 'border-gray-500 text-gray-500';
    }
  };

  // Grouper les risques par gravité
  const highRisks = risks.filter(r => r.severity === 'high');
  const mediumRisks = risks.filter(r => r.severity === 'medium');
  const lowRisks = risks.filter(r => r.severity === 'low');

  // Calculer les statistiques avec des valeurs par défaut
  const totalRisks = risks.length;
  const avgProbability = totalRisks > 0 
    ? risks.reduce((acc, r) => acc + (r.probability || 0), 0) / totalRisks 
    : 0;
  const avgImpact = totalRisks > 0 
    ? risks.reduce((acc, r) => acc + (r.impact_magnitude || 0), 0) / totalRisks 
    : 0;
  const highPriorityCount = risks.filter(r => r.priority === 'high').length;

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Activity className="w-5 h-5 mr-2 text-red-500" />
            Matrice des risques
          </CardTitle>
          <CardDescription>Analyse détaillée des risques identifiés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-900/50 rounded-lg">
              <div className="text-3xl font-bold text-white">{totalRisks}</div>
              <div className="text-sm text-gray-400">Risques totaux</div>
            </div>
            <div className="text-center p-4 bg-gray-900/50 rounded-lg">
              <div className="text-3xl font-bold text-red-500">{highRisks.length}</div>
              <div className="text-sm text-gray-400">Risques élevés</div>
            </div>
            <div className="text-center p-4 bg-gray-900/50 rounded-lg">
              <div className="text-3xl font-bold text-white">{Math.round(avgProbability)}%</div>
              <div className="text-sm text-gray-400">Probabilité moyenne</div>
            </div>
            <div className="text-center p-4 bg-gray-900/50 rounded-lg">
              <div className="text-3xl font-bold text-white">{highPriorityCount}</div>
              <div className="text-sm text-gray-400">Priorité haute</div>
            </div>
          </div>

          {/* Légende */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-300">Risque élevé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-300">Risque moyen</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-300">Risque faible</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-blue-400" />
              <span className="text-sm text-gray-300">{risks.filter(r => r.deadline === 'short').length} à court terme</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matrice détaillée */}
      {detailed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risques élevés */}
          {highRisks.length > 0 && (
            <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                  Risques élevés ({highRisks.length})
                </CardTitle>
                <CardDescription>Action immédiate requise</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {highRisks.map((risk, index) => (
                    <div key={risk.id || index} className="p-4 bg-black/30 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-red-500">URGENT</Badge>
                          <h4 className="font-semibold text-white">{risk.type}</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-red-400">{risk.probability || 0}% de probabilité</div>
                          <div className="text-xs text-gray-400">Impact: {risk.impact_magnitude || 0}/10</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">{risk.description}</p>
                      <div className="text-sm">
                        <div className="text-gray-400 mb-1">Clause concernée:</div>
                        <p className="text-gray-300">{risk.clause}</p>
                      </div>
                      <div className="mt-3 p-3 bg-red-500/10 rounded-lg">
                        <div className="text-sm text-red-400 font-semibold mb-1">Recommandation:</div>
                        <p className="text-sm text-gray-300">{risk.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Risques moyens */}
          {mediumRisks.length > 0 && (
            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Target className="w-5 h-5 mr-2 text-yellow-500" />
                  Risques moyens ({mediumRisks.length})
                </CardTitle>
                <CardDescription>Surveillance recommandée</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mediumRisks.map((risk, index) => (
                    <div key={risk.id || index} className="p-4 bg-black/30 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-500 text-black">MOYEN</Badge>
                          <h4 className="font-semibold text-white">{risk.type}</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-yellow-400">{risk.probability || 0}% de probabilité</div>
                          <div className="text-xs text-gray-400">Impact: {risk.impact_magnitude || 0}/10</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">{risk.description}</p>
                      <div className="text-sm">
                        <div className="text-gray-400 mb-1">Clause concernée:</div>
                        <p className="text-gray-300">{risk.clause}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Risques faibles */}
          {lowRisks.length > 0 && (
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 col-span-full">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Zap className="w-5 h-5 mr-2 text-green-500" />
                  Risques faibles ({lowRisks.length})
                </CardTitle>
                <CardDescription>Acceptables avec surveillance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lowRisks.map((risk, index) => (
                    <div key={risk.id || index} className="p-4 bg-black/30 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-green-500">FAIBLE</Badge>
                        <div className="text-sm text-green-400">{risk.probability || 0}%</div>
                      </div>
                      <h4 className="font-semibold text-white mb-2 text-sm">{risk.type}</h4>
                      <p className="text-xs text-gray-400 mb-3">
                        {risk.description.substring(0, 100)}
                        {risk.description.length > 100 && '...'}
                      </p>
                      <div className="text-xs text-gray-500">
                        Clause: {risk.clause.substring(0, 50)}
                        {risk.clause.length > 50 && '...'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Vue condensée (si non détaillée) */}
      {!detailed && (
        <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
          <CardContent className="p-6">
            <div className="space-y-4">
              {risks.slice(0, 5).map((risk, index) => (
                <div key={risk.id || index} className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRiskLevelColor(risk.severity)}`}>
                    <span className="font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{risk.type}</h4>
                      <Badge className={getPriorityColor(risk.priority)} variant="outline">
                        {risk.priority || 'non défini'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{risk.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Clause: {risk.clause}</span>
                      <span>Probabilité: {risk.probability || 0}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}