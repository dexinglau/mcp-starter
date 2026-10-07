import React from 'react';
import { PieChart, TrendingUp, TrendingDown } from 'lucide-react';

interface SectorPerf {
  name: string;
  change: number;
  topStock: string;
  topStockChange: number;
}

const SECTOR_DATA: SectorPerf[] = [
  { name: 'Technology', change: 2.14, topStock: 'NVDA', topStockChange: 3.63 },
  { name: 'Communication Services', change: 1.48, topStock: 'META', topStockChange: 1.94 },
  { name: 'Consumer Discretionary', change: 0.92, topStock: 'AMZN', topStockChange: 1.45 },
  { name: 'Healthcare', change: 0.74, topStock: 'LLY', topStockChange: 1.70 },
  { name: 'Industrials', change: 0.35, topStock: 'CAT', topStockChange: 0.82 },
  { name: 'Consumer Staples', change: 0.18, topStock: 'COST', topStockChange: 0.45 },
  { name: 'Utilities', change: 0.05, topStock: 'NEE', topStockChange: 0.20 },
  { name: 'Materials', change: -0.22, topStock: 'LIN', topStockChange: -0.15 },
  { name: 'Financials', change: -0.42, topStock: 'JPM', topStockChange: -0.55 },
  { name: 'Real Estate', change: -0.68, topStock: 'PLD', topStockChange: -0.72 },
  { name: 'Energy', change: -1.35, topStock: 'XOM', topStockChange: -1.45 },
];

interface SectorsBarometerProps {
  onSelectSymbol: (symbol: string) => void;
}

export const SectorsBarometer: React.FC<SectorsBarometerProps> = ({ onSelectSymbol }) => {
  return (
    <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl p-4 mb-6 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-[#2962FF]" />
          <h2 className="text-base font-bold text-[#F0F3FA] tracking-tight">
            S&P 500 Sectors Barometer
          </h2>
          <span className="text-xs text-[#787B86]">· Daily Relative Performance</span>
        </div>
        <span className="text-xs text-[#787B86] font-mono">11 Sectors Tracked</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {SECTOR_DATA.map((sector) => {
          const isPositive = sector.change >= 0;
          const barWidth = Math.min(100, Math.abs(sector.change) * 35);

          return (
            <div
              key={sector.name}
              className="bg-[#131722] border border-[#2A2E39] rounded-lg p-2.5 flex flex-col justify-between hover:border-[#363A45] transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#dfe2f2] truncate">
                  {sector.name}
                </span>
                <span
                  className={`text-xs font-bold font-mono tabular-nums ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {sector.change.toFixed(2)}%
                </span>
              </div>

              {/* Performance Bar */}
              <div className="w-full bg-[#1C202C] h-1.5 rounded-full overflow-hidden mb-2 relative">
                <div
                  className={`h-full rounded-full ${
                    isPositive ? 'bg-[#089981]' : 'bg-[#F23645]'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              {/* Top Stock in Sector */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#787B86] pt-1 border-t border-[#2A2E39]/50">
                <span>Leader:</span>
                <button
                  onClick={() => onSelectSymbol(sector.topStock)}
                  className="text-[#2962FF] hover:underline font-bold cursor-pointer"
                >
                  {sector.topStock} ({sector.topStockChange >= 0 ? '+' : ''}{sector.topStockChange.toFixed(2)}%)
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
