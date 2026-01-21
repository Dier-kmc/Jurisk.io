'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Filter, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import HistoryTable from '@/components/history/HistoryTable';
import HistoryFilters from '@/components/history/HistoryFilters';
import Button from '@/components/ui/custom/CustomButton';

interface HistoryItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  analysisDate: Date;
  riskScore: number;
  status: 'completed' | 'processing' | 'failed';
  pageCount?: number;
}

export default function HistoryPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Données de démonstration
  const demoHistory: HistoryItem[] = [
    {
      id: '1',
      fileName: 'Contrat de partenariat commercial',
      fileType: 'PDF',
      fileSize: 2456789,
      uploadDate: new Date('2024-03-14T14:32:00'),
      analysisDate: new Date('2024-03-14T14:35:00'),
      riskScore: 8.5,
      status: 'completed',
      pageCount: 15,
    },
    {
      id: '2',
      fileName: 'NDA avec TechSolutions Inc.',
      fileType: 'DOCX',
      fileSize: 1234567,
      uploadDate: new Date('2024-03-10T09:15:00'),
      analysisDate: new Date('2024-03-10T09:18:00'),
      riskScore: 4.5,
      status: 'completed',
      pageCount: 8,
    },
    {
      id: '3',
      fileName: 'Contrat de location de bureau',
      fileType: 'PDF',
      fileSize: 3456789,
      uploadDate: new Date('2024-03-05T16:48:00'),
      analysisDate: new Date('2024-03-05T16:52:00'),
      riskScore: 6.2,
      status: 'completed',
      pageCount: 12,
    },
    {
      id: '4',
      fileName: 'Contrat de sous-traitance',
      fileType: 'PDF',
      fileSize: 4567891,
      uploadDate: new Date('2024-03-01T11:20:00'),
      analysisDate: new Date('2024-03-01T11:25:00'),
      riskScore: 3.8,
      status: 'completed',
      pageCount: 18,
    },
    {
      id: '5',
      fileName: 'Addendum au contrat principal',
      fileType: 'PDF',
      fileSize: 567890,
      uploadDate: new Date('2024-02-28T10:15:00'),
      analysisDate: new Date('2024-02-28T10:17:00'),
      riskScore: 2.1,
      status: 'completed',
      pageCount: 3,
    },
  ];

  const stats = {
    total: demoHistory.length,
    highRisk: demoHistory.filter(h => h.riskScore >= 7).length,
    mediumRisk: demoHistory.filter(h => h.riskScore >= 4 && h.riskScore < 7).length,
    lowRisk: demoHistory.filter(h => h.riskScore < 4).length,
    avgScore: demoHistory.reduce((sum, h) => sum + h.riskScore, 0) / demoHistory.length,
  };

  const handleViewAnalysis = (id: string) => {
    router.push(`/result/${id}`);
  };

  const handleDownloadReport = (id: string) => {
    console.log(`Télécharger le rapport ${id}`);
    // Implémentation réelle ici
  };

  return (
    <div className="section-padding">
      <div className="container">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">Historique des analyses</h1>
            <p className="text-gray-400">
              Retrouvez tous vos contrats analysés et leurs résultats
            </p>
          </div>
          
          <Button
            variant="primary"
            leftIcon={<Plus size={20} />}
            onClick={() => router.push('/upload')}
          >
            Nouvelle analyse
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Analyses totales</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Score moyen</p>
                <p className="text-3xl font-bold">{stats.avgScore.toFixed(1)}/10</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Filter className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Risques élevés</p>
                <p className="text-3xl font-bold text-red-400">{stats.highRisk}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Faibles risques</p>
                <p className="text-3xl font-bold text-green-400">{stats.lowRisk}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="mb-8">
          <HistoryFilters
            onSearchChange={setSearch}
            onDateRangeChange={setDateRange}
            onRiskFilterChange={setRiskFilter}
          />
        </div>

        {/* Tableau d'historique */}
        <HistoryTable
          items={demoHistory}
          onView={handleViewAnalysis}
          onDownload={handleDownloadReport}
          className="mb-12"
        />

        {/* FAQ */}
        <div className="glass-card p-8">
          <h3 className="text-2xl font-bold mb-6">Questions fréquentes</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-2">Combien de temps mes analyses sont-elles conservées ?</h4>
              <p className="text-gray-400">
                En version gratuite, vos analyses sont conservées pendant 30 jours. En version Premium, l'historique est illimité.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-2">Puis-je exporter mes données ?</h4>
              <p className="text-gray-400">
                Oui, vous pouvez exporter chaque analyse au format PDF ou CSV. En version Premium, l'export Excel est également disponible.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-2">Comment supprimer une analyse ?</h4>
              <p className="text-gray-400">
                Cliquez sur le menu à trois points à droite de chaque analyse, puis sélectionnez "Supprimer". Cette action est irréversible.
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 mb-4">
              Besoin d'un historique illimité ou de fonctionnalités avancées ?
            </p>
            <Button variant="outline" onClick={() => router.push('/pricing')}>
              Découvrir Premium
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}