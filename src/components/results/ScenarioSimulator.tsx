"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomButton } from "@/components/ui/custom/CustomButton";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Target,
  BarChart,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Scenario } from "@/types/contract";

interface ScenarioSimulatorProps {
  scenarios: Scenario[];
}

export default function ScenarioSimulator({
  scenarios,
}: ScenarioSimulatorProps) {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(0);
  const [simulationActive, setSimulationActive] = useState(false);
  console.log("scénarios", scenarios);

  const handleScenarioSelect = (index: number) => {
    setSelectedScenario(index);
    setSimulationActive(true);
  };

  const handleReset = () => {
    setSelectedScenario(null);
    setSimulationActive(false);
  };

  const currentScenario =
    selectedScenario !== null ? scenarios[selectedScenario] : null;

  // Calculer les statistiques
  const avgProbability =
    scenarios.reduce((acc, s) => acc + s.probability, 0) / scenarios.length;
  const highRiskScenarios = scenarios.filter((s) => s.probability > 70);
  const positiveScenarios = scenarios.filter((s) => s.global_impact > 5);

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <Card className="bg-gradient-to-br from-surface-2 to-surface-1 border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Activity className="w-5 h-5 mr-2 text-accent" />
            Simulateur de scénarios
          </CardTitle>
          <CardDescription>
            Explorez les différentes évolutions possibles du contrat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-surface-2 rounded-lg">
              <div className="text-3xl font-bold text-foreground">
                {scenarios.length}
              </div>
              <div className="text-sm text-muted">Scénarios identifiés</div>
            </div>
            <div className="text-center p-4 bg-surface-2 rounded-lg">
              <div className="text-3xl font-bold text-accent">
                {Math.round(avgProbability)}%
              </div>
              <div className="text-sm text-muted">Probabilité moyenne</div>
            </div>
            <div className="text-center p-4 bg-surface-2 rounded-lg">
              <div className="text-3xl font-bold text-risk-high">
                {highRiskScenarios.length}
              </div>
              <div className="text-sm text-muted">
                Scénarios à haut risque
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="border-border text-muted hover:text-foreground"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réinitialiser
            </CustomButton>
            <div className="text-sm text-muted">
              Sélectionnez un scénario pour simuler ses conséquences
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sélection des scénarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des scénarios */}
        <Card className="bg-gradient-to-br from-surface-2 to-surface-1 border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Zap className="w-5 h-5 mr-2 text-accent" />
              Scénarios disponibles
            </CardTitle>
            <CardDescription>
              Cliquez sur un scénario pour le simuler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scenarios.map((scenario, index) => (
                <button
                  key={index}
                  onClick={() => handleScenarioSelect(index)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                    selectedScenario === index
                      ? "bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30"
                      : "bg-surface-2 hover:bg-surface-2"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          scenario.probability > 70
                            ? "bg-risk-high"
                            : scenario.probability > 40
                              ? "bg-risk-medium"
                              : "bg-risk-low"
                        }`}
                      />
                      <h4 className="font-semibold text-foreground">
                        {scenario.scenario}
                      </h4>
                    </div>
                    <Badge
                      className={
                        scenario.probability > 70
                          ? "bg-risk-high"
                          : scenario.probability > 40
                            ? "bg-risk-medium"
                            : "bg-risk-low"
                      }
                    >
                      {scenario.probability}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted mb-3">
                    {(
                      scenario.consequences_party_a?.[0] ||
                      "Aucune conséquence majeure identifiée"
                    ).substring(0, 80)}
                    ...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-faint">
                      <TrendingUp className="w-3 h-3" />
                      Impact: {scenario.global_impact}/10
                    </div>
                    <div
                      className={`text-xs ${
                        scenario.global_impact > 7
                          ? "text-risk-high"
                          : scenario.global_impact > 4
                            ? "text-risk-medium"
                            : "text-risk-low"
                      }`}
                    >
                      {scenario.global_impact > 7
                        ? "Impact majeur"
                        : scenario.global_impact > 4
                          ? "Impact modéré"
                          : "Impact mineur"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Simulation du scénario sélectionné */}
        <Card className="bg-gradient-to-br from-surface-2 to-surface-1 border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Target className="w-5 h-5 mr-2 text-risk-low" />
              {simulationActive
                ? "Simulation en cours"
                : "Sélectionnez un scénario"}
            </CardTitle>
            <CardDescription>
              {simulationActive
                ? `Analyse détaillée du scénario: "${currentScenario?.scenario}"`
                : "Cliquez sur un scénario à gauche pour commencer la simulation"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {simulationActive && currentScenario ? (
              <div className="space-y-6">
                {/* En-tête du scénario */}
                <div className="p-4 bg-surface-2 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-foreground">
                      {currentScenario.scenario}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          currentScenario.probability > 70
                            ? "bg-risk-high"
                            : currentScenario.probability > 40
                              ? "bg-risk-medium"
                              : "bg-risk-low"
                        }
                      >
                        {currentScenario.probability}% de probabilité
                      </Badge>
                      <Badge
                        className={
                          currentScenario.global_impact > 7
                            ? "bg-risk-high"
                            : currentScenario.global_impact > 4
                              ? "bg-risk-medium"
                              : "bg-risk-low"
                        }
                      >
                        Impact: {currentScenario.global_impact}/10
                      </Badge>
                    </div>
                  </div>

                  {/* Barre de probabilité */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-muted mb-1">
                      <span>Probabilité d'occurrence</span>
                      <span>{currentScenario.probability}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-accent-bright transition-all duration-500"
                        style={{ width: `${currentScenario.probability}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Conséquences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-2 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-risk-low" />
                      Conséquences positives
                    </h4>
                    <ul className="space-y-2">
                      {(currentScenario.consequences_party_a || [])
                        .filter(
                          (c) =>
                            !c.toLowerCase().includes("négatif") &&
                            !c.toLowerCase().includes("risque"),
                        )
                        .slice(0, 3)
                        .map((consequence, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-risk-low mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-muted">
                              {consequence}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-surface-2 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <TrendingDown className="w-4 h-4 mr-2 text-risk-high" />
                      Risques identifiés
                    </h4>
                    <ul className="space-y-2">
                      {(currentScenario.consequences_party_b || [])
                        .filter(
                          (c) =>
                            c.toLowerCase().includes("risque") ||
                            c.toLowerCase().includes("négatif"),
                        )
                        .slice(0, 3)
                        .map((consequence, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-risk-high mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-muted">
                              {consequence}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                {/* Recommandations */}
                <div className="p-4 bg-surface-2 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-accent" />
                    Recommandations pour ce scénario
                  </h4>
                  <div className="space-y-3">
                    {(currentScenario.recommendations || []).map(
                      (recommendation, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-surface-2 rounded-lg"
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-accent to-accent-bright flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-background">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-sm text-muted">
                            {recommendation}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Actions préventives */}
                <div className="p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20">
                  <h4 className="font-semibold text-foreground mb-3">
                    Actions préventives recommandées
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Mettre en place des indicateurs de suivi",
                      "Prévoir des clauses de sauvegarde",
                      "Établir un plan de contingence",
                      "Programmer des revues régulières",
                    ].map((action, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                        <span className="text-muted">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart className="w-16 h-16 text-faint mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted mb-2">
                  Aucun scénario sélectionné
                </h3>
                <p className="text-faint">
                  Sélectionnez un scénario dans la liste pour voir la simulation
                  détaillée
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analyse comparative */}
      <Card className="bg-gradient-to-br from-surface-2 to-surface-1 border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <BarChart className="w-5 h-5 mr-2 text-accent" />
            Analyse comparative des scénarios
          </CardTitle>
          <CardDescription>
            Comparaison des impacts et probabilités
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted font-semibold">
                    Scénario
                  </th>
                  <th className="text-left py-3 px-4 text-muted font-semibold">
                    Probabilité
                  </th>
                  <th className="text-left py-3 px-4 text-muted font-semibold">
                    Impact global
                  </th>
                  <th className="text-left py-3 px-4 text-muted font-semibold">
                    Risque
                  </th>
                  <th className="text-left py-3 px-4 text-muted font-semibold">
                    Recommandation
                  </th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((scenario, index) => (
                  <tr
                    key={index}
                    className={`border-b border-border hover:bg-surface-2 cursor-pointer ${
                      selectedScenario === index ? "bg-accent/10" : ""
                    }`}
                    onClick={() => handleScenarioSelect(index)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-foreground">
                        {scenario.scenario}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-surface-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-accent to-accent-bright"
                            style={{ width: `${scenario.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-muted">
                          {scenario.probability}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div
                        className={`font-medium ${
                          scenario.global_impact > 7
                            ? "text-risk-high"
                            : scenario.global_impact > 4
                              ? "text-risk-medium"
                              : "text-risk-low"
                        }`}
                      >
                        {scenario.global_impact}/10
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          scenario.probability * scenario.global_impact > 500
                            ? "bg-risk-high"
                            : scenario.probability * scenario.global_impact >
                                200
                              ? "bg-risk-medium"
                              : "bg-risk-low"
                        }
                      >
                        {scenario.probability * scenario.global_impact > 500
                          ? "Élevé"
                          : scenario.probability * scenario.global_impact > 200
                            ? "Moyen"
                            : "Faible"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-muted">
                        {(
                          scenario.recommendations?.[0] ||
                          "Aucune recommandation"
                        ).substring(0, 60)}
                        ...
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
