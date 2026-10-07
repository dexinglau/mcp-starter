import React, { useState } from 'react';
import { HeatmapSector, HeatmapItem, MarketAsset } from '../types/market';
import { HEATMAP_SECTORS, CRYPTO_HEATMAP } from '../data/mockMarkets';
import { Layers, Maximize2 } from 'lucide-react';

interface MarketHeatmapProps {
  onSelectSymbol: (symbol: string) => void;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({ onSelectSymbol }) => {
  const [heatmapType, setHeatmapType] = useState<'stocks' | 'crypto'>('stocks');
  const [hoveredItem, setHoveredItem] = useState<HeatmapItem | null>(null);

  const activeSectors: HeatmapSector[] = heatmapType === 'stocks' ? HEATMAP_SECTORS : CRYPTO_HEATMAP;

  // Compute cell color by performance
  const getCellColor = (changePercent: number) => {
    if (changePercent >= 3.0) return 'bg-[#089981] text-white';
    if (changePercent >= 1.5) return 'bg-[#10b981] text-white';
    if (changePercent > 0.2) return 'bg-[#089981]/80 text-white';
    if (changePercent >= -0.2 && changePercent <= 0.2) return 'bg-[#313441] text-[#dfe2f2]';
    if (changePercent <= -3.0) return 'bg-[#93000a] text-white';
    if (changePercent <= -1.5) return 'bg-[#f23645] text-white';
    return 'bg-[#f23645]/85 text-white';
  };

  return (
    <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl p-4 mb-6 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2962FF]" />
          <h2 className="text-base font-bold text-[#F0F3FA] tracking-tight">
            Market Heatmap
          </h2>
          <span className="text-xs text-[#787B86]">· Sized by Market Cap</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Heatmap Type Switcher */}
          <div className="flex items-center bg-[#131722] p-0.5 rounded-lg border border-[#2A2E39]">
            <button
              onClick={() => setHeatmapType('stocks')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                heatmapType === 'stocks'
                  ? 'bg-[#2962FF] text-white shadow-xs'
                  : 'text-[#787B86] hover:text-[#F0F3FA]'
              }`}
            >
              S&P 500 Stocks
            </button>
            <button
              onClick={() => setHeatmapType('crypto')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                heatmapType === 'crypto'
                  ? 'bg-[#2962FF] text-white shadow-xs'
                  : 'text-[#787B86] hover:text-[#F0F3FA]'
              }`}
            >
              Crypto Treemap
            </button>
          </div>

          {/* Color Scale Legend */}
          <div className="hidden md:flex items-center gap-1 text-[10px] font-mono text-[#787B86] bg-[#131722] px-2.5 py-1 rounded-md border border-[#2A2E39]">
            <span className="text-[#F23645]">-3%</span>
            <div className="w-2.5 h-2.5 rounded-xs bg-[#93000a]" />
            <div className="w-2.5 h-2.5 rounded-xs bg-[#f23645]" />
            <div className="w-2.5 h-2.5 rounded-xs bg-[#313441]" />
            <div className="w-2.5 h-2.5 rounded-xs bg-[#10b981]" />
            <div className="w-2.5 h-2.5 rounded-xs bg-[#089981]" />
            <span className="text-[#089981]">+3%</span>
          </div>
        </div>
      </div>

      {/* Heatmap Sectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeSectors.map((sector) => (
          <div
            key={sector.sector}
            className="bg-[#131722] border border-[#2A2E39] rounded-lg p-2.5 flex flex-col justify-between"
          >
            <div className="text-[11px] font-semibold text-[#c3c5d8] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{sector.sector}</span>
              <span className="text-[10px] text-[#787B86] font-mono">{sector.weight}% Wgt</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 flex-1 min-h-[110px]">
              {sector.items.map((item, idx) => {
                const isLarge = idx === 0 && sector.items.length > 2;
                return (
                  <div
                    key={item.symbol}
                    onClick={() => onSelectSymbol(item.symbol)}
                    onMouseEnter={() => setHoveredItem(item)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`${
                      isLarge ? 'col-span-2 py-3' : 'py-2'
                    } ${getCellColor(
                      item.changePercent
                    )} rounded-md px-2 flex flex-col justify-center items-center transition-transform hover:scale-[1.02] hover:z-10 cursor-pointer shadow-xs border border-black/20`}
                  >
                    <div className="font-bold text-xs font-mono tracking-tight text-center">
                      {item.symbol}
                    </div>
                    <div className="text-[10px] opacity-90 truncate max-w-[110px] text-center">
                      {item.name}
                    </div>
                    <div className="text-xs font-mono font-semibold tabular-nums mt-0.5">
                      {item.changePercent >= 0 ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Hover Information Banner */}
      <div className="mt-3 pt-2 border-t border-[#2A2E39] flex items-center justify-between text-xs text-[#787B86] font-mono">
        <div>
          {hoveredItem ? (
            <span className="text-[#F0F3FA]">
              <strong className="text-[#2962FF]">{hoveredItem.symbol}</strong> ({hoveredItem.name}) · Price: ${hoveredItem.price.toLocaleString()} · MktCap: {hoveredItem.marketCap} · Change:{' '}
              <span className={hoveredItem.changePercent >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}>
                {hoveredItem.changePercent >= 0 ? '+' : ''}{hoveredItem.changePercent.toFixed(2)}%
              </span>
            </span>
          ) : (
            <span>Hover over any tile to preview metrics · Click to open full chart</span>
          )}
        </div>
        <span className="hidden sm:inline">1D Performance</span>
      </div>
    </div>
  );
};
