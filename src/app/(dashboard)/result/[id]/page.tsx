'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  AlertTriangle, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  BarChart3,
  Shield,
  Target,
  TrendingUp,
  Users,
  Scale,
  Zap,
  Copy,
  Download,
  Printer,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  FileWarning,
  Brain,
  Cpu,
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Types
import { ContractAnalysis } from '@/types/contract';

// Composants UI
import Button from '@/components/ui/custom/CustomButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Composants personnalisés
import NegotiationStrategy from '@/components/results/NegotiationStrategy';
import ScenarioSimulator from '@/components/results/ScenarioSimulator';

// Utilitaires
import { formatDate, formatFileSize } from '@/lib/utils/formatData';
import RiskMatrix from '@/components/results/RiskMatrix';
import ClauseEditor from '@/components/results/ClauseEditor';

interface AnalysisData {
  contract: {
    id: string;
    fileName: string;
    fileSize: number;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    createdAt: string;
    updatedAt: string;
    errorMessage?: string;
    fileUrl?: string;
    mimeType: string;
  };
  analysis: ContractAnalysis | null;
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  
  // États
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDetailedView, setShowDetailedView] = useState(true);
  const [exporting, setExporting] = useState(false);
  
  // Fetch des données
  const fetchAnalysis = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analysis/${params.id}`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setData({
          contract: result.contract,
          analysis: result.analysis
        });
      } else {
        throw new Error(result.error || 'Erreur inconnue');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
      toast.error('Erreur lors du chargement de l\'analyse');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchAnalysis();
    
    // Polling si en cours de traitement
    if (data?.contract.status === 'PROCESSING') {
      const interval = setInterval(fetchAnalysis, 5000);
      return () => clearInterval(interval);
    }
  }, [fetchAnalysis, data?.contract.status]);

  // Fonctions utilitaires
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PROCESSING': return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'FAILED': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'PENDING': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'PROCESSING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'FAILED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'PENDING': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const handleExport = async () => {
    if (!data?.analysis) return;
    
    setExporting(true);
    try {
      const exportData = {
        metadata: {
          fileName: data.contract.fileName,
          analysisDate: new Date().toISOString(),
          contractId: data.contract.id,
        },
        summary: data.analysis.summary,
        parties: data.analysis.identified_parties,
        risks: data.analysis.risks,
        obligations: data.analysis.obligations,
        powers: data.analysis.powers,
        criticalClauses: data.analysis.critical_clauses,
        partyAnalysis: data.analysis.party_analysis,
        scenarios: data.analysis.probable_scenarios
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analyse-contrat-${data.contract.fileName.replace(/\.[^/.]+$/, '')}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Analyse exportée avec succès');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Erreur lors de l\'export');
    } finally {
      setExporting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papier');
  };

  // Écrans de chargement/erreur
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <Brain className="w-24 h-24 text-yellow-500 animate-spin mx-auto relative" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Analyse en cours
          </h2>
          <p className="text-gray-400 mb-6">Préparation du rapport détaillé...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center max-w-md p-8 glass-card rounded-2xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3 text-white">Erreur</h2>
          <p className="text-gray-400 mb-6">{error || 'Données non disponibles'}</p>
          <div className="space-y-4">
            <Button 
              variant="primary" 
              onClick={() => router.push('/upload')}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
            >
              Nouvelle analyse
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full border-gray-700 text-gray-300 hover:text-white"
            >
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { contract, analysis } = data;

  // Écrans selon le statut
  if (contract.status === 'PROCESSING') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center max-w-2xl p-8 glass-card rounded-2xl">
          <Cpu className="w-32 h-32 text-yellow-500 mx-auto mb-8 animate-pulse" />
          <h1 className="text-3xl font-bold mb-4 text-white">Analyse en cours</h1>
          <p className="text-gray-400 mb-8">
            Notre IA examine votre contrat sous tous les angles...
          </p>
          <div className="space-y-4">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300"
                style={{ width: '60%' }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              Détection des risques • Analyse des clauses • Évaluation des parties
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (contract.status === 'FAILED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center max-w-md p-8 glass-card rounded-2xl">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3 text-white">Échec de l'analyse</h2>
          <p className="text-gray-400 mb-6">{contract.errorMessage || 'Erreur technique'}</p>
          <Button 
            variant="primary" 
            onClick={() => router.push('/upload')}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
          >
            Nouvelle analyse
          </Button>
        </div>
      </div>
    );
  }

  if (contract.status === 'PENDING') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center max-w-md p-8 glass-card rounded-2xl">
          <Clock className="w-16 h-16 text-blue-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-bold mb-3 text-white">Analyse en attente</h2>
          <p className="text-gray-400 mb-6">Votre contrat est dans la file d'attente</p>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full border-gray-700 text-gray-300 hover:text-white"
          >
            Actualiser
          </Button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center max-w-md p-8 glass-card rounded-2xl">
          <FileWarning className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3 text-white">Aucune analyse disponible</h2>
          <p className="text-gray-400 mb-6">L'analyse n'a pas pu être générée</p>
          <Button 
            variant="primary" 
            onClick={() => router.push('/upload')}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
          >
            Nouvelle analyse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-black/60 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white truncate max-w-xs lg:max-w-md">
                    {contract.fileName}
                  </h1>
                  <div className="flex items-center flex-wrap gap-2 text-xs text-gray-400">
                    <Badge className={getStatusColor(contract.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(contract.status)}
                        {contract.status === 'COMPLETED' ? 'Terminé' : 
                         contract.status === 'PROCESSING' ? 'En cours' : 
                         contract.status === 'FAILED' ? 'Échoué' : 'En attente'}
                      </span>
                    </Badge>
                    <span>{formatFileSize(contract.fileSize)}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(new Date(contract.createdAt))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDetailedView(!showDetailedView)}
                      className="border-gray-700 text-gray-400 hover:text-white"
                    >
                      {showDetailedView ? (
                        <EyeOff className="w-4 h-4 mr-2" />
                      ) : (
                        <Eye className="w-4 h-4 mr-2" />
                      )}
                      {showDetailedView ? 'Vue simple' : 'Vue détaillée'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {showDetailedView ? 'Afficher moins de détails' : 'Afficher tous les détails'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={exporting}
                className="border-gray-700 text-gray-400 hover:text-white"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Exporter
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="border-gray-700 text-gray-400 hover:text-white"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Bannière résumé */}
        <Card className="mb-8 bg-gradient-to-r from-gray-900/50 to-black/50 border-gray-800">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Score global */}
              <div className="text-center">
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  {analysis.summary.global_risk_score}
                </div>
                <div className="text-sm text-gray-400">Score de risque</div>
                <div className="mt-2">
                  <Badge className={
                    analysis.summary.global_risk_score < 30 ? 'bg-green-500' :
                    analysis.summary.global_risk_score < 70 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }>
                    {analysis.summary.global_risk_score < 30 ? 'Faible risque' :
                     analysis.summary.global_risk_score < 70 ? 'Risque modéré' :
                     'Risque élevé'}
                  </Badge>
                </div>
              </div>
              
              {/* Équilibre */}
              <div className="text-center">
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {analysis.summary.balance_score}
                </div>
                <div className="text-sm text-gray-400">Équilibre contractuel</div>
                <div className="mt-2">
                  <Badge className={
                    analysis.summary.balance_score > 70 ? 'bg-green-500' :
                    analysis.summary.balance_score > 40 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }>
                    {analysis.summary.balance_score > 70 ? 'Équilibré' :
                     analysis.summary.balance_score > 40 ? 'Déséquilibré' :
                     'Très déséquilibré'}
                  </Badge>
                </div>
              </div>
              
              {/* Clarté */}
              <div className="text-center">
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {analysis.summary.clarity_score}
                </div>
                <div className="text-sm text-gray-400">Clarté du contrat</div>
                <div className="mt-2">
                  <Badge className={
                    analysis.summary.clarity_score > 80 ? 'bg-green-500' :
                    analysis.summary.clarity_score > 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }>
                    {analysis.summary.clarity_score > 80 ? 'Très clair' :
                     analysis.summary.clarity_score > 50 ? 'Acceptable' :
                     'Confus'}
                  </Badge>
                </div>
              </div>
              
              {/* Partie avantagée */}
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-white">
                  {analysis.party_analysis.party_a.negotiation_power === analysis.party_analysis.party_b.negotiation_power ? 'Égalité' :
                   analysis.party_analysis.party_a.negotiation_power > analysis.party_analysis.party_b.negotiation_power ? 
                   analysis.identified_parties.party_a.name : analysis.identified_parties.party_b.name}
                </div>
                <div className="text-sm text-gray-400">Partie avantagée</div>
                <div className="mt-2">
                  <Badge className={
                    analysis.party_analysis.party_a.negotiation_power === analysis.party_analysis.party_b.negotiation_power ? 'bg-blue-500' :
                    analysis.party_analysis.party_a.negotiation_power > analysis.party_analysis.party_b.negotiation_power ? 'bg-yellow-500' : 'bg-purple-500'
                  }>
                    {analysis.party_analysis.party_a.negotiation_power === analysis.party_analysis.party_b.negotiation_power ? 'Équilibre' : 'Avantage'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onglets principaux */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="glass-card border border-gray-800 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-orange-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="parties" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600">
              <Users className="w-4 h-4 mr-2" />
              Parties ({analysis.identified_parties.party_a.name} & {analysis.identified_parties.party_b.name})
            </TabsTrigger>
            <TabsTrigger value="risks" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-pink-600">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Risques ({analysis.risks.length})
            </TabsTrigger>
            <TabsTrigger value="clauses" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
              <FileText className="w-4 h-4 mr-2" />
              Clauses critiques ({analysis.critical_clauses.length})
            </TabsTrigger>
            <TabsTrigger value="strategy" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600">
              <Target className="w-4 h-4 mr-2" />
              Stratégie
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Analyse des parties */}
              <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Scale className="w-5 h-5 mr-2 text-blue-500" />
                    Analyse comparative
                  </CardTitle>
                  <CardDescription>Rapport de force entre les parties</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[analysis.party_analysis.party_a, analysis.party_analysis.party_b].map((party, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              index === 0 ? 'bg-yellow-500' : 'bg-purple-500'
                            }`} />
                            <h4 className="font-semibold text-white">
                              {party.party_name}
                            </h4>
                          </div>
                          <Badge className={
                            party.negotiation_power === 'strong' ? 'bg-green-500' :
                            party.negotiation_power === 'medium' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }>
                            Pouvoir {party.negotiation_power}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                            <div className="text-2xl font-bold text-white">{party.risk_score}</div>
                            <div className="text-xs text-gray-400">Risque</div>
                          </div>
                          <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                            <div className="text-2xl font-bold text-white">{party.opportunity_score}</div>
                            <div className="text-xs text-gray-400">Opportunité</div>
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-green-500" />
                            <span className="text-gray-300">Avantages :</span>
                          </div>
                          <ul className="space-y-1 ml-6">
                            {party.advantages.slice(0, 3).map((advantage, i) => (
                              <li key={i} className="text-gray-400 text-xs">• {advantage}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                    
                    <Separator className="bg-gray-800" />
                    
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-2">Recommandation</div>
                      <p className="text-sm text-white">
                        {analysis.party_analysis.party_a.negotiation_power === analysis.party_analysis.party_b.negotiation_power ? 
                          'Négociation équilibrée possible' :
                          `La partie ${analysis.party_analysis.party_a.negotiation_power > analysis.party_analysis.party_b.negotiation_power ? 
                           analysis.party_analysis.party_a.party_name : analysis.party_analysis.party_b.party_name} 
                           détient un avantage de négociation`
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scénarios probables */}
              <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    Scénarios probables
                  </CardTitle>
                  <CardDescription>Évolution possible du contrat</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.probable_scenarios.map((scenario, index) => (
                      <div key={index} className="p-4 bg-gray-900/50 rounded-lg border-l-4" style={{
                        borderLeftColor: scenario.probability > 70 ? '#ef4444' : 
                                        scenario.probability > 40 ? '#f59e0b' : '#10b981'
                      }}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-white">{scenario.scenario}</h4>
                          <Badge className={
                            scenario.probability > 70 ? 'bg-red-500' :
                            scenario.probability > 40 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }>
                            {scenario.probability}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400 mb-1">Pour {analysis.identified_parties.party_a.name} :</div>
                            <ul className="space-y-1">
                              {scenario.consequences_party_a.slice(0, 2).map((cons, i) => (
                                <li key={i} className="text-gray-300 text-xs">• {cons}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Pour {analysis.identified_parties.party_b.name} :</div>
                            <ul className="space-y-1">
                              {scenario.consequences_party_b.slice(0, 2).map((cons, i) => (
                                <li key={i} className="text-gray-300 text-xs">• {cons}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Points clés et conseils */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                    Points clés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.summary.key_points.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-black">{index + 1}</span>
                        </div>
                        <span className="text-gray-300 text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Brain className="w-5 h-5 mr-2 text-purple-500" />
                    Conseils stratégiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.summary.strategic_advice.map((conseil, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-300 text-sm">{conseil}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Matrice des risques */}
            {showDetailedView && <RiskMatrix risks={analysis.risks} />}
          </TabsContent>

          {/* Analyse des parties */}
          <TabsContent value="parties" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(analysis.party_analysis).map(([key, party]: [string, any]) => {
                const partieInfo = key === 'party_a' ? analysis.identified_parties.party_a : analysis.identified_parties.party_b;
                
                return (
                  <Card key={key} className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <Users className="w-5 h-5 mr-2" />
                        {partieInfo.name}
                      </CardTitle>
                      <CardDescription>
                        {partieInfo.role} • {partieInfo.legal_status}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Scores */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                            <div className="text-3xl font-bold text-white">{party.risk_score}</div>
                            <div className="text-xs text-gray-400">Risque</div>
                          </div>
                          <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                            <div className="text-3xl font-bold text-white">{party.opportunity_score}</div>
                            <div className="text-xs text-gray-400">Opportunité</div>
                          </div>
                          <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                            <div className="text-xl font-bold text-white capitalize">{party.negotiation_power}</div>
                            <div className="text-xs text-gray-400">Négociation</div>
                          </div>
                        </div>

                        {/* Risques majeurs */}
                        <div>
                          <h4 className="font-semibold text-white mb-3 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                            Risques majeurs
                          </h4>
                          <ul className="space-y-2">
                            {party.major_risks.map((risque: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">{risque}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Avantages */}
                        <div>
                          <h4 className="font-semibold text-white mb-3 flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-green-500" />
                            Avantages
                          </h4>
                          <ul className="space-y-2">
                            {party.advantages.map((advantage: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">{advantage}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Recommandations */}
                        <div>
                          <h4 className="font-semibold text-white mb-3 flex items-center">
                            <Target className="w-4 h-4 mr-2 text-blue-500" />
                            Recommandations spécifiques
                          </h4>
                          <ul className="space-y-2">
                            {party.specific_recommendations.map((reco: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 p-3 bg-gray-900/30 rounded-lg">
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs text-blue-400">{index + 1}</span>
                                </div>
                                <span className="text-gray-300 text-sm">{reco}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Risques */}
          <TabsContent value="risks">
            <RiskMatrix risks={analysis.risks} detailed={showDetailedView} />
          </TabsContent>

          {/* Clauses critiques */}
          <TabsContent value="clauses">
            <div className="space-y-6">
              {analysis.critical_clauses.map((clause, index) => (
                <Card key={index} className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={
                            clause.priority === 'high' ? 'bg-red-500' :
                            clause.priority === 'medium' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }>
                            {clause.priority === 'high' ? 'Haute priorité' :
                             clause.priority === 'medium' ? 'Priorité moyenne' :
                             'Priorité basse'}
                          </Badge>
                          <h3 className="text-lg font-semibold text-white">{clause.clause_number} - {clause.title}</h3>
                        </div>
                        <p className="text-gray-300 mb-4">{clause.problem}</p>
                        
                        <div className="mb-4">
                          <div className="text-sm text-gray-400 mb-1">Impact juridique :</div>
                          <p className="text-sm text-gray-300">{clause.legal_impact}</p>
                        </div>
                        
                        <div className="bg-gray-900/50 rounded-lg p-4">
                          <div className="text-sm text-gray-400 mb-1">Solution proposée :</div>
                          <p className="text-sm text-white">{clause.proposed_solution}</p>
                        </div>
                      </div>
                      
                      {showDetailedView && (
                        <div className="lg:w-64 flex-shrink-0">
                          <ClauseEditor clause={clause} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(`${clause.clause_number}: ${clause.proposed_solution}`)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copier la solution
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copier dans le presse-papier</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <div className="text-xs text-gray-500">
                        Clause critique #{index + 1}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Stratégie de négociation */}
          <TabsContent value="strategy">
            <NegotiationStrategy 
              parties={analysis.identified_parties}
              partyAnalysis={analysis.party_analysis}
              clauses={analysis.critical_clauses}
              summary={analysis.summary}
            />
            
            {showDetailedView && (
              <ScenarioSimulator scenarios={analysis.probable_scenarios} />
            )}
          </TabsContent>
        </Tabs>

        {/* Échéancier des risques */}
        <Card className="mt-8 bg-gradient-to-br from-gray-900 to-black border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Clock className="w-5 h-5 mr-2 text-yellow-500" />
              Échéancier des risques
            </CardTitle>
            <CardDescription>Planification des actions dans le temps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-white flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                  Immédiat (0-30 jours)
                </h4>
                <ul className="space-y-2">
                  {analysis.summary.risk_timeline.immediate.map((risque, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      {risque}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-white flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                  Court terme (1-3 mois)
                </h4>
                <ul className="space-y-2">
                  {analysis.summary.risk_timeline.short_term.map((risque, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      {risque}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-white flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                  Long terme (+3 mois)
                </h4>
                <ul className="space-y-2">
                  {analysis.summary.risk_timeline.long_term.map((risque, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      {risque}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avertissement légal */}
        <div className="mt-8 p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white mb-2">Avertissement légal important</h4>
              <p className="text-sm text-gray-300">
                Cette analyse a été générée par une intelligence artificielle et constitue une aide à la décision. 
                Elle ne remplace pas un avis juridique professionnel. Consultez un avocat qualifié avant de signer 
                tout contrat ou de prendre des décisions importantes basées sur cette analyse.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-8 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              Analyse générée le {formatDate(new Date())} • ContractScope AI
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/upload')}
                className="border-gray-700 text-gray-400 hover:text-white"
              >
                Nouvelle analyse
              </Button>
              
              <Link href="/history">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  Voir l'historique
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}