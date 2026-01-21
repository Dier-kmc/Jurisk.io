// app/result/[id]/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Download, 
  Printer, 
  FileText, 
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  BarChart3,
  Shield,
  Target,
  TrendingUp,
  FileWarning,
  CheckSquare,
  Zap,
  Copy,
  ExternalLink,
  Brain,
  Cpu,
  Sparkles
} from 'lucide-react';
import RiskBlock from '@/components/results/RiskBlock';
import ObligationsBlock from '@/components/results/ObligationsBlock';
import PowersBlock from '@/components/results/PowersBlock';
import Button from '@/components/ui/custom/CustomButton';
import { RiskItem } from '@/lib/utils/riskCalculator';
import { formatDate, formatFileSize } from '@/lib/utils/formatData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

// Types pour les données réelles
interface ContractData {
  id: string;
  fileName: string;
  fileSize: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  errorMessage?: string;
}

interface AnalysisData {
  id: string;
  risks: string; // JSON stringifié
  obligations: string; // JSON stringifié
  powers: string; // JSON stringifié
  summary: string; // JSON stringifié
  modelUsed: string;
  processingTime: number;
  tokenCount: number;
  createdAt: string;
}

// Types parsés
interface ParsedRisk {
  type: string;
  description: string;
  gravite: 'faible' | 'moyenne' | 'elevee';
  clause: string;
  recommandation: string;
  impact: 'financier' | 'legal' | 'operationnel' | 'reputation';
}

interface ParsedObligation {
  partie: 'prestataire' | 'client' | 'les_deux';
  description: string;
  delai: string;
  penalites: string;
  couts: string;
}

interface ParsedPower {
  type: 'resiliation' | 'modification' | 'controle' | 'sanction' | 'audit';
  detenteur: 'prestataire' | 'client' | 'les_deux';
  description: string;
  limitations: string;
  abus_potentiel: boolean;
}

interface ParsedSummary {
  score_risque: number;
  score_clarte: number;
  points_cles: string[];
  conseils: string[];
  duree_contrat: string;
  renouvellement: string;
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState<ContractData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [parsedData, setParsedData] = useState<{
    risks: ParsedRisk[];
    obligations: ParsedObligation[];
    powers: ParsedPower[];
    summary: ParsedSummary;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAIInsights, setShowAIInsights] = useState(true);
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef(0);
  const isMountedRef = useRef(true);

  const fetchAnalysisData = useCallback(async () => {
    try {
      const response = await fetch(`/api/analysis/${params.id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur de chargement');
      }
      
      if (data.success) {
        const contractData = data.contract;
        const analysisData = data.analysis;
        
        if (isMountedRef.current) {
          setContract(contractData);
          setAnalysis(analysisData);
          
          if (contractData.status === 'PROCESSING') {
            const newProgress = Math.min(progressRef.current + 10, 90);
            setProgress(newProgress);
            progressRef.current = newProgress;
          } else if (contractData.status === 'COMPLETED') {
            setProgress(100);
            progressRef.current = 100;
          }
          
          if (contractData.status === 'COMPLETED' && analysisData) {
            try {
              const parsed = {
                risks: JSON.parse(analysisData.risks || '[]'),
                obligations: JSON.parse(analysisData.obligations || '[]'),
                powers: JSON.parse(analysisData.powers || '[]'),
                summary: JSON.parse(analysisData.summary || '{}')
              };
              setParsedData(parsed);
            } catch (parseError) {
              console.error('Erreur de parsing JSON:', parseError);
            }
          }
          
          if (contractData.status === 'COMPLETED' || contractData.status === 'FAILED') {
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
          }
        }
        
        return contractData.status;
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [params.id]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchAnalysisData();
    
    return () => {
      isMountedRef.current = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [fetchAnalysisData]);

  useEffect(() => {
    if (contract?.status === 'PROCESSING') {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      
      const interval = setInterval(() => {
        fetchAnalysisData();
      }, 3000);
      
      pollingIntervalRef.current = interval;
      
      const progressInterval = setInterval(() => {
        if (progressRef.current < 90) {
          const newProgress = Math.min(progressRef.current + 2, 90);
          setProgress(newProgress);
          progressRef.current = newProgress;
        }
      }, 2000);
      
      return () => {
        clearInterval(progressInterval);
      };
    }
  }, [contract?.status, fetchAnalysisData]);

  const convertRiskToRiskItem = (risk: ParsedRisk): RiskItem => {
    const severityMap = {
      'elevee': { probability: 0.9, impact: 9, color: 'bg-red-500' },
      'moyenne': { probability: 0.6, impact: 6, color: 'bg-yellow-500' },
      'faible': { probability: 0.3, impact: 3, color: 'bg-green-500' }
    };
    
    const severityData = severityMap[risk.gravite] || { probability: 0.5, impact: 5, color: 'bg-gray-500' };
    
    return {
      id: `${risk.type}-${Date.now()}-${Math.random()}`,
      title: risk.type,
      description: risk.description,
      severity: risk.gravite === 'elevee' ? 'high' : risk.gravite === 'moyenne' ? 'medium' : 'low',
      clause: risk.clause,
      probability: severityData.probability,
      impact: severityData.impact,
      color: severityData.color,
      recommandation: risk.recommandation,
      impactType: risk.impact
    };
  };

  const getRiskStats = () => {
    if (!parsedData) return null;
    
    const stats = {
      total: parsedData.risks.length,
      high: parsedData.risks.filter(r => r.gravite === 'elevee').length,
      medium: parsedData.risks.filter(r => r.gravite === 'moyenne').length,
      low: parsedData.risks.filter(r => r.gravite === 'faible').length
    };
    
    return stats;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportAnalysis = () => {
    if (!parsedData || !analysis) return;
    
    const exportData = {
      contract: contract?.fileName,
      analysisDate: new Date().toISOString(),
      summary: parsedData.summary,
      risks: parsedData.risks,
      obligations: parsedData.obligations,
      powers: parsedData.powers,
      metadata: {
        modelUsed: analysis.modelUsed,
        processingTime: analysis.processingTime,
        tokenCount: analysis.tokenCount
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analyse-contrat-${contract?.fileName}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
            L'IA analyse votre contrat
          </h2>
          <p className="text-gray-400 mb-6">Détection des risques et clauses importantes...</p>
          <div className="w-64 mx-auto">
            <Progress value={progress} className="h-2 bg-gray-800" />
          </div>
          <p className="text-sm text-gray-500 mt-4">{progress}%</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center max-w-md p-8 glass-card rounded-2xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3 text-white">Erreur d'analyse</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline" 
              onClick={() => router.push('/upload')}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Nouvelle analyse
            </Button>
            <Button 
              variant="primary"
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
            >
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center max-w-md p-8 glass-card rounded-2xl">
          <FileWarning className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3 text-white">Analyse non trouvée</h2>
          <p className="text-gray-400 mb-6">
            L'analyse demandée n'existe pas ou a expiré.
          </p>
          <Button 
            variant="primary" 
            onClick={() => router.push('/upload')}
            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
          >
            <ArrowLeft className="mr-2" />
            Nouvelle analyse
          </Button>
        </div>
      </div>
    );
  }

  if (contract.status === 'PROCESSING') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center max-w-2xl p-8 glass-card rounded-2xl">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <Cpu className="w-32 h-32 text-yellow-500 mx-auto relative animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Analyse en cours
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Notre IA examine chaque clause de votre contrat pour détecter les risques potentiels.
          </p>
          
          <div className="space-y-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 text-yellow-500 mr-2 animate-pulse" />
                  <span className="text-gray-300">Extraction du texte</span>
                </div>
                <span className="text-yellow-500 font-medium">✓</span>
              </div>
              <Progress value={100} className="h-2 bg-gray-800" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Brain className="w-5 h-5 text-yellow-500 mr-2 animate-pulse" />
                  <span className="text-gray-300">Analyse des clauses</span>
                </div>
                <span className="text-yellow-500 font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-gray-800" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-500">Génération du rapport</span>
                </div>
                <span className="text-gray-500 font-medium">0%</span>
              </div>
              <Progress value={0} className="h-2 bg-gray-800" />
            </div>
          </div>
          
          <div className="text-sm text-gray-500 space-y-2">
            <p>Statut: <span className="text-yellow-500">Traitement en cours</span></p>
            <p>Temps estimé: 30-60 secondes</p>
            <p>Modèle: {analysis?.modelUsed || 'meta-llama/llama-3.3-70b-instruct'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (contract.status === 'FAILED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center max-w-md p-8 glass-card rounded-2xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3 text-white">Échec de l'analyse</h2>
          <p className="text-gray-400 mb-6">
            {contract.errorMessage || 'Une erreur est survenue lors de l\'analyse.'}
          </p>
          <div className="space-y-4">
            <Button 
              variant="primary"
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
            >
              Réessayer l'analyse
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/upload')}
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Nouveau contrat
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (contract.status === 'PENDING') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center max-w-md p-8 glass-card rounded-2xl">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3 text-white">Analyse en attente</h2>
          <p className="text-gray-400 mb-6">
            Votre contrat est en file d'attente pour l'analyse.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Progress value={30} className="h-2 bg-gray-800" />
              </div>
              <span className="text-sm text-blue-500">30%</span>
            </div>
            <p className="text-sm text-gray-500">
              Position dans la file: #1 • Début prévu: Maintenant
            </p>
          </div>
        </div>
      </div>
    );
  }

  const riskStats = getRiskStats();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-lg bg-black/60 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white truncate max-w-xs md:max-w-md">
                    {contract.fileName}
                  </h1>
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <span>{formatFileSize(contract.fileSize)}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(new Date(contract.createdAt))}
                    </span>
                    {analysis && (
                      <>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {analysis.processingTime}s
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-400 hover:text-white"
                      onClick={() => setShowAIInsights(!showAIInsights)}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      {showAIInsights ? 'Cacher IA' : 'Afficher IA'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {showAIInsights ? 'Masquer les insights IA' : 'Afficher les insights IA'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="hidden md:flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-400 hover:text-white"
                  onClick={exportAnalysis}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-400 hover:text-white"
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Score et stats rapides */}
        {parsedData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Score de risque */}
            <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Shield className="w-5 h-5 mr-2 text-yellow-500" />
                  Score de risque
                </CardTitle>
                <CardDescription>Plus le score est bas, mieux c'est</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="relative inline-flex">
                    <div className="w-48 h-48 relative">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#1f2937"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="url(#gradient-risk)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${parsedData.summary.score_risque * 2.83} 283`}
                          transform="rotate(-90 50 50)"
                        />
                        <defs>
                          <linearGradient id="gradient-risk" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#ea580c" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {parsedData.summary.score_risque}
                        </span>
                        <span className="text-sm text-gray-400">/100</span>
                        <div className="mt-2">
                          <Badge className={
                            parsedData.summary.score_risque < 30 ? 'bg-green-500' :
                            parsedData.summary.score_risque < 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }>
                            {parsedData.summary.score_risque < 30 ? 'Faible risque' :
                             parsedData.summary.score_risque < 70 ? 'Risque modéré' :
                             'Risque élevé'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats des risques */}
            {riskStats && (
              <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                    Répartition des risques
                  </CardTitle>
                  <CardDescription>{riskStats.total} risques détectés</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-red-400">Élevés</span>
                        <span className="text-white">{riskStats.high}</span>
                      </div>
                      <Progress 
                        value={(riskStats.high / riskStats.total) * 100} 
                        className="h-2 bg-gray-800"
                        // indicatorClassName="bg-red-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-yellow-400">Moyens</span>
                        <span className="text-white">{riskStats.medium}</span>
                      </div>
                      <Progress 
                        value={(riskStats.medium / riskStats.total) * 100} 
                        className="h-2 bg-gray-800"
                        // indicatorClassName="bg-yellow-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-400">Faibles</span>
                        <span className="text-white">{riskStats.low}</span>
                      </div>
                      <Progress 
                        value={(riskStats.low / riskStats.total) * 100} 
                        className="h-2 bg-gray-800"
                        // indicatorClassName="bg-green-500"
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-4 bg-gray-800" />
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">{parsedData.obligations.length}</div>
                      <div className="text-xs text-gray-400">Obligations</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{parsedData.powers.length}</div>
                      <div className="text-xs text-gray-400">Pouvoirs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{parsedData.summary.score_clarte}</div>
                      <div className="text-xs text-gray-400">Clarté</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Insights IA */}
            {showAIInsights && (
              <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Brain className="w-5 h-5 mr-2 text-purple-500" />
                    Insights IA
                  </CardTitle>
                  <CardDescription>Recommandations intelligentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {parsedData.summary.conseils.slice(0, 3).map((conseil, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-300">{conseil}</p>
                      </div>
                    ))}
                    
                    <Separator className="bg-gray-800" />
                    
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Durée:</span>
                        <span className="text-white">{parsedData.summary.duree_contrat}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Renouvellement:</span>
                        <span className="text-white">{parsedData.summary.renouvellement}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="glass-card border border-gray-800 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-orange-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="risks" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-pink-600">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Risques ({parsedData?.risks.length || 0})
            </TabsTrigger>
            <TabsTrigger value="obligations" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600">
              <CheckSquare className="w-4 h-4 mr-2" />
              Obligations ({parsedData?.obligations.length || 0})
            </TabsTrigger>
            <TabsTrigger value="powers" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
              <Zap className="w-4 h-4 mr-2" />
              Pouvoirs ({parsedData?.powers.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {parsedData && (
              <>
                {/* Points critiques */}
                <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Target className="w-5 h-5 mr-2 text-red-500" />
                      Points critiques
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {parsedData.summary.points_cles.slice(0, 6).map((point, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-lg">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">{index + 1}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">{point}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top risques */}
                <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                      Top risques
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {parsedData.risks.slice(0, 5).map((risk, index) => (
                        <div key={index} className="p-4 bg-gray-900/50 rounded-lg border-l-4" style={{
                          borderLeftColor: risk.gravite === 'elevee' ? '#ef4444' : 
                                          risk.gravite === 'moyenne' ? '#f59e0b' : '#10b981'
                        }}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge className={
                                risk.gravite === 'elevee' ? 'bg-red-500' :
                                risk.gravite === 'moyenne' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }>
                                {risk.gravite.toUpperCase()}
                              </Badge>
                              <span className="text-sm font-medium text-white">{risk.type}</span>
                            </div>
                            <Badge variant="outline" className="text-xs border-gray-700">
                              {risk.impact}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300 mb-3">{risk.description}</p>
                          <div className="text-xs text-gray-400">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Clause: {risk.clause}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs text-yellow-500 hover:text-yellow-400"
                                onClick={() => copyToClipboard(risk.recommandation)}
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copier
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Matrice des parties */}
                <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                      Répartition des obligations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {['prestataire', 'client', 'les_deux'].map((partie) => {
                        const count = parsedData.obligations.filter(o => o.partie === partie).length;
                        const percentage = (count / parsedData.obligations.length) * 100;
                        return (
                          <div key={partie} className="space-y-2">
                            <div className="relative w-24 h-24 mx-auto">
                              <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  fill="none"
                                  stroke="#1f2937"
                                  strokeWidth="8"
                                />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  fill="none"
                                  stroke={
                                    partie === 'prestataire' ? '#3b82f6' :
                                    partie === 'client' ? '#10b981' :
                                    '#8b5cf6'
                                  }
                                  strokeWidth="8"
                                  strokeLinecap="round"
                                  strokeDasharray={`${percentage * 2.83} 283`}
                                  transform="rotate(-90 50 50)"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-white">{count}</div>
                                  <div className="text-xs text-gray-400 capitalize">
                                    {partie.replace('_', ' ')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Risques */}
          <TabsContent value="risks">
            {parsedData && (
              <RiskBlock 
                risks={parsedData.risks.map(convertRiskToRiskItem)}
                collapsible={false}
                // showFilters={true}
              />
            )}
          </TabsContent>

          {/* Obligations */}
          <TabsContent value="obligations">
            {parsedData && (
              <ObligationsBlock 
                obligations={parsedData.obligations.map((obl, index) => ({
                  id: `obl-${index}`,
                  text: obl.description,
                  clause: '',
                  deadline: obl.delai,
                  responsible: obl.partie,
                  penalites: obl.penalites,
                  couts: obl.couts
                }))}
                collapsible={false}
              />
            )}
          </TabsContent>

          {/* Pouvoirs */}
          <TabsContent value="powers">
            {parsedData && (
              <PowersBlock 
                powers={parsedData.powers.map((power, index) => ({
                  id: `power-${index}`,
                  text: power.description,
                  clause: '',
                  type: 'general' as const
                }))}
                collapsible={true}
                defaultExpanded={true}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Plan d'action */}
        {parsedData && parsedData.risks.length > 0 && (
          <Card className="mb-8 bg-gradient-to-br from-gray-900 to-black border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Plan d'action recommandé
              </CardTitle>
              <CardDescription>
                Étapes prioritaires basées sur l'analyse de risque
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parsedData.risks
                  .filter(r => r.gravite === 'elevee')
                  .slice(0, 3)
                  .map((risk, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-white">{risk.type}</h4>
                            <p className="text-sm text-gray-400">{risk.clause}</p>
                          </div>
                          <Badge className="bg-red-500">URGENT</Badge>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">{risk.description}</p>
                        <div className="bg-black/30 rounded-lg p-3">
                          <p className="text-sm text-yellow-400">
                            <span className="font-semibold">Recommandation: </span>
                            {risk.recommandation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              {parsedData.risks.filter(r => r.gravite === 'elevee').length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">Aucun risque urgent détecté</h4>
                  <p className="text-gray-400">Votre contrat semble présenter un niveau de risque acceptable.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Informations techniques */}
        {analysis && (
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Cpu className="w-5 h-5 mr-2 text-blue-500" />
                Informations techniques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-900/30 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Modèle IA</div>
                  <div className="font-medium text-white truncate" title={analysis.modelUsed}>
                    {analysis.modelUsed.split('/').pop()}
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-900/30 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Temps de traitement</div>
                  <div className="font-medium text-white">{analysis.processingTime}s</div>
                </div>
                <div className="text-center p-4 bg-gray-900/30 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Tokens utilisés</div>
                  <div className="font-medium text-white">{analysis.tokenCount?.toLocaleString() || 'N/A'}</div>
                </div>
                <div className="text-center p-4 bg-gray-900/30 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">ID d'analyse</div>
                  <div className="font-medium text-white text-sm truncate" title={analysis.id}>
                    {analysis.id.substring(0, 8)}...
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-6"
                      onClick={() => copyToClipboard(analysis.id)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions finales */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:text-white"
                onClick={() => router.push('/upload')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Nouvelle analyse
              </Button>
              
              <div className="hidden md:flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-400 hover:text-white"
                  onClick={exportAnalysis}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter JSON
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-400 hover:text-white"
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Analyse générée le {formatDate(new Date(analysis?.createdAt || contract.createdAt))}
              </div>
              
              <Button
                variant="primary"
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                onClick={() => router.push('/history')}
              >
                Voir l'historique
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
          
          {/* Note de bas de page */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              ⚠️ Cette analyse a été générée par une intelligence artificielle et ne constitue pas un avis juridique professionnel.
              Consultez un avocat pour toute décision importante.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}