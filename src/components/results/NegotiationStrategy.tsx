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
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Target className="w-5 h-5 mr-2 text-blue-500" />
            Stratégie de négociation
          </CardTitle>
          <CardDescription>
            Plan d'action pour optimiser votre position contractuelle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-black/30 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Position</h3>
              <p className="text-sm text-gray-300">
                {isBalanced ? 'Négociation équilibrée' : `Vous êtes en position de ${negotiatingParty === parties.party_a ? 'défense' : 'force'}`}
              </p>
            </div>

            <div className="text-center p-6 bg-black/30 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Priorités</h3>
              <p className="text-sm text-gray-300">
                {priorityClauses.length} clauses à négocier en priorité
              </p>
            </div>

            <div className="text-center p-6 bg-black/30 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Objectif</h3>
              <p className="text-sm text-gray-300">
                Améliorer le score d'équilibre de {summary.balance_score} à {summary.balance_score + 20}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan de négociation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Points de négociation */}
        <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Points de négociation clés
            </CardTitle>
            <CardDescription>Focus sur les clauses les plus importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priorityClauses.slice(0, 3).map((clause, index) => (
                <div key={index} className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{clause.title}</h4>
                        <p className="text-xs text-gray-400">{clause.clause_number}</p>
                      </div>
                    </div>
                    <Badge className="bg-red-500">HAUTE PRIORITÉ</Badge>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{clause.problem}</p>
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-sm text-yellow-400 font-semibold mb-1">Objectif de négociation:</div>
                    <p className="text-sm text-gray-300">{clause.proposed_solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stratégie recommandée */}
        <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Brain className="w-5 h-5 mr-2 text-purple-500" />
              Approche recommandée
            </CardTitle>
            <CardDescription>Basée sur l'analyse des forces en présence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Positionnement */}
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-blue-400" />
                  Positionnement
                </h4>
                <p className="text-sm text-gray-300">
                  {isBalanced 
                    ? 'Les deux parties ont un pouvoir de négociation équivalent. Privilégiez une approche collaborative.'
                    : `En tant que ${negotiatingParty.name}, adoptez une stratégie ${
                        negotiatingParty === parties.party_a ? 'défensive' : 'offensive'
                      } pour compenser le déséquilibre de pouvoir.`
                  }
                </p>
              </div>

              {/* Tactiques */}
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                  Tactiques recommandées
                </h4>
                <ul className="space-y-2">
                  {summary.strategic_advice.slice(0, 3).map((conseil, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-black">{index + 1}</span>
                      </div>
                      <span className="text-gray-300">{conseil}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Concessions possibles */}
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <BarChart className="w-4 h-4 mr-2 text-green-400" />
                  Concessions possibles
                </h4>
                <p className="text-sm text-gray-300 mb-3">
                  Clauses à faible priorité que vous pouvez relâcher pour obtenir des concessions sur les points clés:
                </p>
                <div className="space-y-2">
                  {mediumClauses.slice(0, 2).map((clause, index) => (
                    <div key={index} className="text-sm text-gray-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
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
      <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Plan d'action détaillé
          </CardTitle>
          <CardDescription>Étapes à suivre pour une négociation réussie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Phase 1 : Préparation */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                  <span className="text-xs font-bold">1</span>
                </div>
                Phase 1 : Préparation (Avant la négociation)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Objectifs principaux:</div>
                  <ul className="space-y-1">
                    <li className="text-sm text-gray-300">• Définir vos limites (zones rouges)</li>
                    <li className="text-sm text-gray-300">• Identifier vos priorités (zones vertes)</li>
                    <li className="text-sm text-gray-300">• Préparer vos arguments pour chaque clause</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Actions concrètes:</div>
                  <ul className="space-y-1">
                    <li className="text-sm text-gray-300">• Étudier les alternatives contractuelles</li>
                    <li className="text-sm text-gray-300">• Préparer des contre-propositions</li>
                    <li className="text-sm text-gray-300">• Simuler différents scénarios</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phase 2 : Négociation */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center mr-2">
                  <span className="text-xs font-bold">2</span>
                </div>
                Phase 2 : Négociation (Pendant les discussions)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Stratégie d'ouverture:</div>
                  <ul className="space-y-1">
                    <li className="text-sm text-gray-300">• Commencer par les points faciles</li>
                    <li className="text-sm text-gray-300">• Établir un climat de confiance</li>
                    <li className="text-sm text-gray-300">• Présenter vos préoccupations principales</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Tactiques de négociation:</div>
                  <ul className="space-y-1">
                    <li className="text-sm text-gray-300">• Utiliser le "donnant-donnant"</li>
                    <li className="text-sm text-gray-300">• Se concentrer sur les intérêts, pas les positions</li>
                    <li className="text-sm text-gray-300">• Proposer des alternatives créatives</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phase 3 : Finalisation */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-2">
                  <span className="text-xs font-bold">3</span>
                </div>
                Phase 3 : Finalisation (Après accord)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Vérifications finales:</div>
                  <ul className="space-y-1">
                    <li className="text-sm text-gray-300">• Relecture complète du contrat modifié</li>
                    <li className="text-sm text-gray-300">• Vérification des changements apportés</li>
                    <li className="text-sm text-gray-300">• Confirmation des dates et délais</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Documentation:</div>
                  <ul className="space-y-1">
                    <li className="text-sm text-gray-300">• Sauvegarder toutes les versions</li>
                    <li className="text-sm text-gray-300">• Documenter les points d'accord</li>
                    <li className="text-sm text-gray-300">• Préparer le suivi post-signature</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conseils pratiques */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            Conseils pratiques de l'IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.strategic_advice.slice(3, 9).map((conseil, index) => (
              <div key={index} className="p-4 bg-black/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{index + 1}</span>
                  </div>
                  <h4 className="font-semibold text-white text-sm">Conseil {index + 1}</h4>
                </div>
                <p className="text-sm text-gray-300">{conseil}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}