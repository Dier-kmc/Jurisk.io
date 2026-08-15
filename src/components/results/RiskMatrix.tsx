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
      case 'high': return 'bg-risk-high text-white';
      case 'medium': return 'bg-risk-medium text-background';
      case 'low': return 'bg-risk-low text-white';
      default: return 'bg-faint text-white';
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high' | undefined) => {
    switch (priority) {
      case 'high': return 'border-risk-high text-risk-high';
      case 'medium': return 'border-risk-medium text-risk-medium';
      case 'low': return 'border-risk-low text-risk-low';
      default: return 'border-faint text-faint';
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
      <Card className="bg-gradient-to-br from-surface-2 to-surface-1 border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Activity className="w-5 h-5 mr-2 text-risk-high" />
            Matrice des risques
          </CardTitle>
          <CardDescription>Analyse détaillée des risques identifiés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-surface-2 rounded-lg">
              <div className="text-3xl font-bold text-foreground">{totalRisks}</div>
              <div className="text-sm text-muted">Risques totaux</div>
            </div>
            <div className="text-center p-4 bg-surface-2 rounded-lg">
              <div className="text-3xl font-bold text-risk-high">{highRisks.length}</div>
              <div className="text-sm text-muted">Risques élevés</div>
            </div>
            <div className="text-center p-4 bg-surface-2 rounded-lg">
              <div className="text-3xl font-bold text-foreground">{Math.round(avgProbability)}%</div>
              <div className="text-sm text-muted">Probabilité moyenne</div>
            </div>
            <div className="text-center p-4 bg-surface-2 rounded-lg">
              <div className="text-3xl font-bold text-foreground">{highPriorityCount}</div>
              <div className="text-sm text-muted">Priorité haute</div>
            </div>
          </div>

          {/* Légende */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-risk-high"></div>
              <span className="text-sm text-muted">Risque élevé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-risk-medium"></div>
              <span className="text-sm text-muted">Risque moyen</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-risk-low"></div>
              <span className="text-sm text-muted">Risque faible</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-accent" />
              <span className="text-sm text-muted">{risks.filter(r => r.deadline === 'short').length} à court terme</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matrice détaillée */}
      {detailed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risques élevés */}
          {highRisks.length > 0 && (
            <Card className="bg-gradient-to-br from-risk-high/10 to-risk-high/5 border-risk-high/20">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <AlertTriangle className="w-5 h-5 mr-2 text-risk-high" />
                  Risques élevés ({highRisks.length})
                </CardTitle>
                <CardDescription>Action immédiate requise</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {highRisks.map((risk, index) => (
                    <div key={risk.id || index} className="p-4 bg-surface-2 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-risk-high">URGENT</Badge>
                          <h4 className="font-semibold text-foreground">{risk.type}</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-risk-high">{risk.probability || 0}% de probabilité</div>
                          <div className="text-xs text-muted">Impact: {risk.impact_magnitude || 0}/10</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted mb-3">{risk.description}</p>
                      <div className="text-sm">
                        <div className="text-muted mb-1">Clause concernée:</div>
                        <p className="text-muted">{risk.clause}</p>
                      </div>
                      <div className="mt-3 p-3 bg-risk-high/10 rounded-lg">
                        <div className="text-sm text-risk-high font-semibold mb-1">Recommandation:</div>
                        <p className="text-sm text-muted">{risk.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Risques moyens */}
          {mediumRisks.length > 0 && (
            <Card className="bg-gradient-to-br from-risk-medium/10 to-risk-medium/5 border-risk-medium/20">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Target className="w-5 h-5 mr-2 text-risk-medium" />
                  Risques moyens ({mediumRisks.length})
                </CardTitle>
                <CardDescription>Surveillance recommandée</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mediumRisks.map((risk, index) => (
                    <div key={risk.id || index} className="p-4 bg-surface-2 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-risk-medium text-background">MOYEN</Badge>
                          <h4 className="font-semibold text-foreground">{risk.type}</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-risk-medium">{risk.probability || 0}% de probabilité</div>
                          <div className="text-xs text-muted">Impact: {risk.impact_magnitude || 0}/10</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted mb-3">{risk.description}</p>
                      <div className="text-sm">
                        <div className="text-muted mb-1">Clause concernée:</div>
                        <p className="text-muted">{risk.clause}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Risques faibles */}
          {lowRisks.length > 0 && (
            <Card className="bg-gradient-to-br from-risk-low/10 to-risk-low/5 border-risk-low/20 col-span-full">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Zap className="w-5 h-5 mr-2 text-risk-low" />
                  Risques faibles ({lowRisks.length})
                </CardTitle>
                <CardDescription>Acceptables avec surveillance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lowRisks.map((risk, index) => (
                    <div key={risk.id || index} className="p-4 bg-surface-2 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-risk-low">FAIBLE</Badge>
                        <div className="text-sm text-risk-low">{risk.probability || 0}%</div>
                      </div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm">{risk.type}</h4>
                      <p className="text-xs text-muted mb-3">
                        {risk.description.substring(0, 100)}
                        {risk.description.length > 100 && '...'}
                      </p>
                      <div className="text-xs text-faint">
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
        <Card className="bg-gradient-to-br from-surface-2 to-surface-1 border-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              {risks.slice(0, 5).map((risk, index) => (
                <div key={risk.id || index} className="flex items-start gap-4 p-4 bg-surface-2 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRiskLevelColor(risk.severity)}`}>
                    <span className="font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-foreground">{risk.type}</h4>
                      <Badge className={getPriorityColor(risk.priority)} variant="outline">
                        {risk.priority || 'non défini'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted mb-2">{risk.description}</p>
                    <div className="flex justify-between text-xs text-faint">
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