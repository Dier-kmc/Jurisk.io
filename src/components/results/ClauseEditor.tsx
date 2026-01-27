'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomButton } from '@/components/ui/custom/CustomButton';
import { Textarea } from '@/components/ui/textarea';
import { 
  Edit2, 
  Save, 
  Copy, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Sparkles,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { Clause } from '@/types/contract';

interface ClauseEditorProps {
  clause: Clause;
}

export default function ClauseEditor({ clause }: ClauseEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(clause.proposed_solution );
  const [suggestions, setSuggestions] = useState<string[]>([
    "Rédiger une clause plus équilibrée",
    "Ajouter des conditions suspensives",
    "Prévoir des mécanismes de révision",
    "Inclure des pénalités proportionnées"
  ]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const handleSave = () => {
    // Ici, vous pourriez envoyer la modification à votre API
    toast.success('Modification sauvegardée');
    setIsEditing(false);
  };

  const handleReset = () => {
    setEditedText(clause.proposed_solution);
    setSelectedSuggestion(null);
    toast.info('Modifications annulées');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedText);
    toast.success('Texte copié dans le presse-papier');
  };

  const handleApplySuggestion = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    setEditedText(prev => prev + '\n\n' + suggestion);
    toast.success('Suggestion appliquée');
  };

  const generateAlternative = () => {
    // Simulation de génération d'alternative
    const alternatives = [
      `Pour la clause ${clause.clause_number}, envisagez: "Les parties conviennent de... avec un préavis de 30 jours."`,
      `Alternative: "${clause.title} sera révisée annuellement par les parties."`,
      `Proposition: "En cas de litige, les parties s'engagent à privilégier la médiation avant toute action judiciaire."`
    ];
    
    const randomAlternative = alternatives[Math.floor(Math.random() * alternatives.length)];
    setEditedText(randomAlternative);
    toast.success('Alternative générée');
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <Edit2 className="w-4 h-4 mr-2 text-blue-500" />
            Éditeur de clause
          </div>
          <Badge className={
            clause.priority === 'high' ? 'bg-red-500' :
            clause.priority === 'medium' ? 'bg-yellow-500' :
            'bg-green-500'
          }>
            {clause.priority}
          </Badge>
        </CardTitle>
        <CardDescription>
          Modifiez la clause selon vos besoins
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Informations de la clause */}
          <div className="p-3 bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-white">{clause.clause_number}</span>
            </div>
            <h4 className="font-semibold text-white mb-1">{clause.title}</h4>
            <p className="text-xs text-gray-400">{clause.problem.substring(0, 80)}...</p>
          </div>

          {/* Éditeur de texte */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">
                Solution proposée
              </label>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <CustomButton
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="h-7 text-xs text-gray-400 hover:text-white"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Annuler
                    </CustomButton>
                    <CustomButton
                      variant="ghost"
                      size="sm"
                      onClick={handleSave}
                      className="h-7 text-xs text-green-400 hover:text-green-300"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Sauvegarder
                    </CustomButton>
                  </>
                ) : (
                  <CustomButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-7 text-xs text-blue-400 hover:text-blue-300"
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
              className={`min-h-[150px] bg-gray-900/50 border-gray-700 text-gray-300 ${
                isEditing ? 'border-blue-500/50' : ''
              }`}
              readOnly={!isEditing}
              placeholder="Modifiez la solution proposée..."
            />

            <div className="flex justify-between mt-2">
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 text-xs text-gray-400 hover:text-white"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copier
              </CustomButton>
              
              {!isEditing && (
                <CustomButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-7 text-xs text-blue-400 hover:text-blue-300"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Éditer cette clause
                </CustomButton>
              )}
            </div>
          </div>

          {/* Suggestions IA */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-white">Suggestions IA</span>
              </div>
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={generateAlternative}
                className="h-7 text-xs text-yellow-400 hover:text-yellow-300"
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
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                      : 'bg-gray-900/50 hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                      selectedSuggestion === suggestion
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : 'bg-gray-800'
                    }`}>
                      {selectedSuggestion === suggestion ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : (
                        <span className="text-xs text-gray-400">{index + 1}</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-300">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Validation juridique */}
          <div className="p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">Validation recommandée</span>
            </div>
            <p className="text-xs text-gray-300">
              Toute modification de clause doit être validée par un conseil juridique avant signature.
            </p>
          </div>

          {/* Historique des modifications */}
          <div className="pt-4 border-t border-gray-800">
            <h4 className="text-sm font-medium text-white mb-2">Historique des modifications</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Version originale</span>
                <span className="text-gray-500">Aujourd'hui</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Modification suggérée</span>
                <span className="text-gray-500">Juste maintenant</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}