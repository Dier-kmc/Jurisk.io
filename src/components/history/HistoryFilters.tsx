/* ===== src/components/history/HistoryFilters.tsx ===== */
'use client';

import { Search, Filter, Calendar, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import Button from '@/components/ui/custom/CustomButton';

interface HistoryFiltersProps {
  onSearchChange?: (search: string) => void;
  onDateRangeChange?: (range: { start: Date | null; end: Date | null }) => void;
  onRiskFilterChange?: (filter: 'all' | 'high' | 'medium' | 'low') => void;
  className?: string;
}

const HistoryFilters = ({
  onSearchChange,
  onDateRangeChange,
  onRiskFilterChange,
  className,
}: HistoryFiltersProps) => {
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearchChange?.(value);
  };

  const handleRiskFilter = (filter: 'all' | 'high' | 'medium' | 'low') => {
    setRiskFilter(filter);
    onRiskFilterChange?.(filter);
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const newDate = value ? new Date(value) : null;
    const newRange = { ...dateRange, [type]: newDate };
    setDateRange(newRange);
    onDateRangeChange?.(newRange);
  };

  const clearFilters = () => {
    setSearch('');
    setDateRange({ start: null, end: null });
    setRiskFilter('all');
    onSearchChange?.('');
    onDateRangeChange?.({ start: null, end: null });
    onRiskFilterChange?.('all');
  };

  return (
    <div className={clsx('bg-gray-900/50 rounded-xl p-6', className)}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Filtrer les analyses</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Filter size={16} className="mr-2" />
          {showAdvanced ? 'Filtres simples' : 'Filtres avancés'}
        </Button>
      </div>

      {/* Recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom de fichier, date, ou score..."
            className="bg-gray-800 border border-gray-700 rounded-lg py-3 pl-12 pr-4 w-full focus:border-yellow-500 focus:outline-none"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filtres rapides */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            className={clsx(
              'px-4 py-2 rounded-lg transition-colors flex items-center',
              riskFilter === 'all'
                ? 'bg-yellow-600 text-gray-900 font-medium'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            )}
            onClick={() => handleRiskFilter('all')}
          >
            Tous les risques
          </button>
          <button
            className={clsx(
              'px-4 py-2 rounded-lg transition-colors flex items-center',
              riskFilter === 'high'
                ? 'bg-red-500 text-white font-medium'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            )}
            onClick={() => handleRiskFilter('high')}
          >
            <TrendingUp size={16} className="mr-2" />
            Risques élevés
          </button>
          <button
            className={clsx(
              'px-4 py-2 rounded-lg transition-colors flex items-center',
              riskFilter === 'medium'
                ? 'bg-orange-500 text-white font-medium'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            )}
            onClick={() => handleRiskFilter('medium')}
          >
            Risques modérés
          </button>
          <button
            className={clsx(
              'px-4 py-2 rounded-lg transition-colors flex items-center',
              riskFilter === 'low'
                ? 'bg-green-500 text-white font-medium'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            )}
            onClick={() => handleRiskFilter('low')}
          >
            <TrendingDown size={16} className="mr-2" />
            Faibles risques
          </button>
        </div>
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="border-t border-gray-800 pt-6">
          <h4 className="font-semibold mb-4 flex items-center">
            <Calendar size={16} className="mr-2" />
            Plage de dates
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Date de début</label>
              <input
                type="date"
                className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 w-full focus:border-yellow-500 focus:outline-none"
                onChange={(e) => handleDateChange('start', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Date de fin</label>
              <input
                type="date"
                className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 w-full focus:border-yellow-500 focus:outline-none"
                onChange={(e) => handleDateChange('end', e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold mb-4">Statut de l'analyse</h4>
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center">
                <input type="checkbox" className="rounded bg-gray-800 border-gray-700 text-yellow-600 focus:ring-yellow-500" />
                <span className="ml-2 text-gray-300">Terminé</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="rounded bg-gray-800 border-gray-700 text-yellow-600 focus:ring-yellow-500" />
                <span className="ml-2 text-gray-300">En cours</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="rounded bg-gray-800 border-gray-700 text-yellow-600 focus:ring-yellow-500" />
                <span className="ml-2 text-gray-300">Échec</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-800">
        <Button
          variant="ghost"
          onClick={clearFilters}
        >
          Effacer tous les filtres
        </Button>
        
        <div className="text-sm text-gray-400">
          Filtres actifs: {riskFilter !== 'all' ? 1 : 0}
          {(dateRange.start || dateRange.end) && ' + Date'}
        </div>
      </div>
    </div>
  );
};

export default HistoryFilters;