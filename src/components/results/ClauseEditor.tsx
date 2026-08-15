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
import { Textarea } from "@/components/ui/textarea";
import {
  Edit2,
  Save,
  Copy,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  FileText,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Clause } from "@/types/contract";

import { updateAnalysisClause } from "@/app/actions/analysis";

interface ClauseEditorProps {
  clause: Clause;
  analysisId: string;
}

export default function ClauseEditor({
  clause,
  analysisId,
}: ClauseEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(clause.proposed_solution);
  const [isSaving, setIsSaving] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "Rédiger une clause plus équilibrée",
    "Ajouter des conditions suspensives",
    "Prévoir des mécanismes de révision",
    "Inclure des pénalités proportionnées",
  ]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null,
  );

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const result = await updateAnalysisClause(
        analysisId,
        clause.clause_number,
        editedText,
      );

      if (result.success) {
        toast.success("Modification sauvegardée");
        setIsEditing(false);
      } else {
        toast.error("Erreur lors de la sauvegarde");
      }
    } catch (error) {
      toast.error("Erreur inattendue");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEditedText(clause.proposed_solution);
    setSelectedSuggestion(null);
    toast.info("Modifications annulées");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedText);
    toast.success("Texte copié dans le presse-papier");
  };

  const handleApplySuggestion = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    setEditedText((prev) => prev + "\n\n" + suggestion);
    toast.success("Suggestion appliquée");
  };

  const generateAlternative = () => {
    // Simulation de génération d'alternative
    const alternatives = [
      `Pour la clause ${clause.clause_number}, envisagez: "Les parties conviennent de... avec un préavis de 30 jours."`,
      `Alternative: "${clause.title} sera révisée annuellement par les parties."`,
      `Proposition: "En cas de litige, les parties s'engagent à privilégier la médiation avant toute action judiciaire."`,
    ];

    const randomAlternative =
      alternatives[Math.floor(Math.random() * alternatives.length)];
    setEditedText(randomAlternative);
    toast.success("Alternative générée");
  };

  return (
    <Card className="bg-gradient-to-br from-surface-2 to-surface-1 border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-foreground">
          <div className="flex items-center">
            <Edit2 className="w-4 h-4 mr-2 text-accent" />
            Éditeur de clause
          </div>
          <Badge
            className={
              clause.priority === "high"
                ? "bg-risk-high"
                : clause.priority === "medium"
                  ? "bg-risk-medium"
                  : "bg-risk-low"
            }
          >
            {clause.priority}
          </Badge>
        </CardTitle>
        <CardDescription>Modifiez la clause selon vos besoins</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Informations de la clause */}
          <div className="p-3 bg-surface-2 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted" />
              <span className="text-sm font-medium text-foreground">
                {clause.clause_number}
              </span>
            </div>
            <h4 className="font-semibold text-foreground mb-1">{clause.title}</h4>
            <p className="text-xs text-muted">
              {clause.problem.substring(0, 80)}...
            </p>
          </div>

          {/* Éditeur de texte */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
              <label className="text-sm font-medium text-muted">
                Solution proposée
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {isEditing ? (
                  <>
                    <CustomButton
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      disabled={isSaving}
                      className="h-7 text-xs text-muted hover:text-foreground"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Annuler
                    </CustomButton>
                    <CustomButton
                      variant="ghost"
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="h-7 text-xs text-risk-low hover:text-risk-low"
                    >
                      {isSaving ? (
                        <div className="w-3 h-3 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Save className="w-3 h-3 mr-1" />
                      )}
                      Sauvegarder
                    </CustomButton>
                  </>
                ) : (
                  <CustomButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-7 text-xs text-accent hover:text-accent"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Modifier
                  </CustomButton>
                )}
              </div>
            </div>

            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className={`min-h-[150px] bg-surface-2 border-border text-muted ${
                isEditing ? "border-accent/50" : ""
              }`}
              readOnly={!isEditing}
              placeholder="Modifiez la solution proposée..."
            />

            <div className="flex justify-between mt-2">
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 text-xs text-muted hover:text-foreground"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copier
              </CustomButton>

              {!isEditing && (
                <CustomButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-7 text-xs text-accent hover:text-accent"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Éditer cette clause
                </CustomButton>
              )}
            </div>
          </div>

          {/* Suggestions IA */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">
                  Suggestions IA
                </span>
              </div>
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={generateAlternative}
                className="h-7 text-xs text-accent hover:text-accent w-full sm:w-auto justify-center"
              >
                <Zap className="w-3 h-3 mr-1" />
                Générer une alternative
              </CustomButton>
            </div>

            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleApplySuggestion(suggestion)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    selectedSuggestion === suggestion
                      ? "bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30"
                      : "bg-surface-2 hover:bg-surface-2"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                        selectedSuggestion === suggestion
                          ? "bg-gradient-to-r from-accent to-accent-bright"
                          : "bg-surface-2"
                      }`}
                    >
                      {selectedSuggestion === suggestion ? (
                        <CheckCircle className="w-3 h-3 text-background" />
                      ) : (
                        <span className="text-xs text-muted">
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Validation juridique */}
          <div className="p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">
                Validation recommandée
              </span>
            </div>
            <p className="text-xs text-muted">
              Toute modification de clause doit être validée par un conseil
              juridique avant signature.
            </p>
          </div>

          {/* Historique des modifications */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-2">
              Historique des modifications
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Version originale</span>
                <span className="text-faint">Aujourd'hui</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Modification suggérée</span>
                <span className="text-faint">Juste maintenant</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
