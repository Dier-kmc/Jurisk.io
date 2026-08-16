'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomButton } from '@/components/ui/custom/CustomButton';
import { Target, Users, TrendingUp, Shield, Zap, Brain, Lightbulb, BarChart } from 'lucide-react';

import { Party, PartyAnalysis, Clause, Summary } from '@/types/contract';

interface NegotiationStrategyProps {
  parties: {
    party_a: Party;
    party_b: Party;
  };
  partyAnalysis: PartyAnalysis;
  clauses: Clause[];
  summary: Summary;
}

export default function NegotiationStrategy({ 
  parties, 
  partyAnalysis, 
  clauses, 
  summary 
}: NegotiationStrategyProps) {
  // Déterminer la partie négociante (celle qui a moins de pouvoir)
  const negotiatingParty = partyAnalysis.party_a.negotiation_power < partyAnalysis.party_b.negotiation_power 
    ? parties.party_a 
    : parties.party_b;

  const strongParty = partyAnalysis.party_a.negotiation_power > partyAnalysis.party_b.negotiation_power 
    ? parties.party_a 
    : parties.party_b;

  const isBalanced = partyAnalysis.party_a.negotiation_power === partyAnalysis.party_b.negotiation_power;

  // Clauses prioritaires pour négociation
  const priorityClauses = clauses.filter(c => c.priority === 'high');
  const mediumClauses = clauses.filter(c => c.priority === 'medium');

  return (
    <div className="space-y-6">
      {/* En-tête stratégique */}
      <Card className="bg-gradient-to-br from-surface-2 to-surface-1 border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Target className="w-5 h-5 mr-2 text-accent" />
            Stratégie de négociation
          </CardTitle>
          <CardDescription>
            Plan d'action pour optimiser votre position contractuelle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-surface-2 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-accent to-accent-bright rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-background" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Position</h3>
              <p className="text-sm text-muted">
                {isBalanced ? 'Négociation équilibrée' : `Vous êtes en position de ${negotiatingParty === parties.party_a ? 'défense' : 'force'}`}
              </p>
            </div>

            <div className="text-center p-6 bg-surface-2 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-accent to-accent-bright rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-background" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Priorités</h3>
              <p className="text-sm text-muted">
                {priorityClauses.length} clauses à négocier en priorité
              </p>
            </div>

            <div className="text-center p-6 bg-surface-2 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-risk-low to-accent-bright rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-background" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Objectif</h3>
              <p className="text-sm text-muted">
                Améliorer le score d'équilibre de {summary.balance_score} à {summary.balance_score + 20}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan de négociation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Points de négociation */}
        <Card className="bg-gradient-to-br from-surface-2 to-surface-1 border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Lightbulb className="w-5 h-5 mr-2 text-accent" />
              Points de négociation clés
            </CardTitle>
            <CardDescription>Focus sur les clauses les plus importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priorityClauses.slice(0, 3).map((clause, index) => (
                <div key={index} className="p-4 bg-surface-2 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-risk-high to-risk-medium flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{clause.title}</h4>
                        <p className="text-xs text-muted">{clause.clause_number}</p>
                      </div>
                    </div>
                    <Badge className="bg-risk-high">HAUTE PRIORITÉ</Badge>
                  </div>
                  <p className="text-sm text-muted mb-3">{clause.problem}</p>
                  <div className="bg-surface-2 rounded-lg p-3">
                    <div className="text-sm text-accent font-semibold mb-1">Objectif de négociation:</div>
                    <p className="text-sm text-muted">{clause.proposed_solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stratégie recommandée */}
        <Card className="bg-gradient-to-br from-surface-2 to-surface-1 border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Brain className="w-5 h-5 mr-2 text-accent" />
              Approche recommandée
            </CardTitle>
            <CardDescription>Basée sur l'analyse des forces en présence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Positionnement */}
              <div className="p-4 bg-surface-2 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-accent" />
                  Positionnement
                </h4>
                <p className="text-sm text-muted">
                  {isBalanced 
                    ? 'Les deux parties ont un pouvoir de négociation équivalent. Privilégiez une approche collaborative.'
                    : `En tant que ${negotiatingParty.name}, adoptez une stratégie ${
                        negotiatingParty === parties.party_a ? 'défensive' : 'offensive'
                      } pour compenser le déséquilibre de pouvoir.`
                  }
                </p>
              </div>

              {/* Tactiques */}
              <div className="p-4 bg-surface-2 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-accent" />
                  Tactiques recommandées
                </h4>
                <ul className="space-y-2">
                  {summary.strategic_advice.slice(0, 3).map((conseil, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-accent to-accent-bright flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-background">{index + 1}</span>
                      </div>
                      <span className="text-muted">{conseil}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Concessions possibles */}
              <div className="p-4 bg-surface-2 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 flex items-center">
                  <BarChart className="w-4 h-4 mr-2 text-risk-low" />
                  Concessions possibles
                </h4>
                <p className="text-sm text-muted mb-3">
                  Clauses à faible priorité que vous pouvez relâcher pour obtenir des concessions sur les points clés:
                </p>
                <div className="space-y-2">
                  {mediumClauses.slice(0, 2).map((clause, index) => (
                    <div key={index} className="text-sm text-muted flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-risk-low"></div>
                      {clause.title} ({clause.clause_number})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan d'action étape par étape */}
      <Card className="bg-gradient-to-br from-surface-2 to-surface-1 border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <TrendingUp className="w-5 h-5 mr-2 text-risk-low" />
            Plan d'action détaillé
          </CardTitle>
          <CardDescription>Étapes à suivre pour une négociation réussie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Phase 1 : Préparation */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-foreground flex items-center">
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center mr-2">
                  <span className="text-xs font-bold text-background">1</span>
                </div>
                Phase 1 : Préparation (Avant la négociation)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-surface-2 rounded-lg">
                  <div className="text-sm text-muted mb-2">Objectifs principaux:</div>
                  <ul className="space-y-1">
                    <li className="text-sm text-muted">• Définir vos limites (zones rouges)</li>
                    <li className="text-sm text-muted">• Identifier vos priorités (zones vertes)</li>
                    <li className="text-sm text-muted">• Préparer vos arguments pour chaque clause</li>
                  </ul>
                </div>
                <div className="p-4 bg-surface-2 rounded-lg">
                  <div className="text-sm text-muted mb-2">Actions concrètes:</div>
                  <ul className="space-y-1">
                    <li className="text-sm text-muted">• Étudier les alternatives contractuelles</li>
                    <li className="text-sm text-muted">• Préparer des contre-propositions</li>
                    <li className="text-sm text-muted">• Simuler différents scénarios</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phase 2 : Négociation */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-foreground flex items-center">
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center mr-2">
                  <span className="text-xs font-bold text-background">2</span>
                </div>
                Phase 2 : Négociation (Pendant les discussions)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-surface-2 rounded-lg">
                  <div className="text-sm text-muted mb-2">Stratégie d'ouverture:</div>
                  <ul className="space-y-1">
                    <li className="text-sm text-muted">• Commencer par les points faciles</li>
                    <li className="text-sm text-muted">• Établir un climat de confiance</li>
                    <li className="text-sm text-muted">• Présenter vos préoccupations principales</li>
                  </ul>
                </div>
                <div className="p-4 bg-surface-2 rounded-lg">
                  <div className="text-sm text-muted mb-2">Tactiques de négociation:</div>
                  <ul className="space-y-1">
                    <li className="text-sm text-muted">• Utiliser le "donnant-donnant"</li>
                    <li className="text-sm text-muted">• Se concentrer sur les intérêts, pas les positions</li>
                    <li className="text-sm text-muted">• Proposer des alternatives créatives</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phase 3 : Finalisation */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-foreground flex items-center">
                <div className="w-6 h-6 rounded-full bg-risk-low flex items-center justify-center mr-2">
                  <span className="text-xs font-bold text-background">3</span>
                </div>
                Phase 3 : Finalisation (Après accord)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-surface-2 rounded-lg">
                  <div className="text-sm text-muted mb-2">Vérifications finales:</div>
                  <ul className="space-y-1">
                    <li className="text-sm text-muted">• Relecture complète du contrat modifié</li>
                    <li className="text-sm text-muted">• Vérification des changements apportés</li>
                    <li className="text-sm text-muted">• Confirmation des dates et délais</li>
                  </ul>
                </div>
                <div className="p-4 bg-surface-2 rounded-lg">
                  <div className="text-sm text-muted mb-2">Documentation:</div>
                  <ul className="space-y-1">
                    <li className="text-sm text-muted">• Sauvegarder toutes les versions</li>
                    <li className="text-sm text-muted">• Documenter les points d'accord</li>
                    <li className="text-sm text-muted">• Préparer le suivi post-signature</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conseils pratiques */}
      <Card className="bg-gradient-to-br from-surface-2 to-surface-1 border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Brain className="w-5 h-5 mr-2 text-accent" />
            Conseils pratiques de l'IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.strategic_advice.slice(3, 9).map((conseil, index) => (
              <div key={index} className="p-4 bg-surface-2 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-accent to-accent-bright flex items-center justify-center">
                    <span className="text-xs font-bold text-background">{index + 1}</span>
                  </div>
                  <h4 className="font-semibold text-foreground text-sm">Conseil {index + 1}</h4>
                </div>
                <p className="text-sm text-muted">{conseil}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}