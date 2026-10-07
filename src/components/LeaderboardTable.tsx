import React, { useState, useMemo } from 'react';
import { MarketAsset } from '../types/market';
import { Star, TrendingUp, TrendingDown, ArrowUpDown, ExternalLink, BarChart2 } from 'lucide-react';

interface LeaderboardTableProps {
  assets: MarketAsset[];
  watchlist: string[];
  onToggleWatchlistSymbol: (symbol: string) => void;
  onSelectAsset: (asset: MarketAsset) => void;
  onQuickTrade: (asset: MarketAsset) => void;
  currentTypeFilter?: string;
}

export type TableFilter = 'most-active' | 'top-gainers' | 'top-losers' | '52w-highs' | 'all';

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  assets,
  watchlist,
  onToggleWatchlistSymbol,
  onSelectAsset,
  onQuickTrade,
  currentTypeFilter,
}) => {
  const [activeFilter, setActiveFilter] = useState<TableFilter>('most-active');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'volume' | 'changePercent' | 'price' | 'symbol'>('volume');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter and sort items
  const filteredAssets = useMemo(() => {
    let list = [...assets];

    // Filter by type if provided (e.g. 'stock', 'crypto')
    if (currentTypeFilter && currentTypeFilter !== 'overview') {
      list = list.filter((a) => {
        if (currentTypeFilter === 'stocks') return a.type === 'stock';
        if (currentTypeFilter === 'crypto') return a.type === 'crypto';
        if (currentTypeFilter === 'forex') return a.type === 'forex';
        if (currentTypeFilter === 'indices') return a.type === 'index';
        if (currentTypeFilter === 'futures') return a.type === 'futures';
        if (currentTypeFilter === 'bonds') return a.type === 'bond';
        return true;
      });
    }

    // Filter by category tab
    if (activeFilter === 'top-gainers') {
      list = list.filter((a) => a.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent);
    } else if (activeFilter === 'top-losers') {
      list = list.filter((a) => a.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent);
    } else if (activeFilter === '52w-highs') {
      list = list.filter((a) => a.price >= a.high52w * 0.95).sort((a, b) => b.changePercent - a.changePercent);
    } else if (activeFilter === 'most-active') {
      list = list.sort((a, b) => b.volumeNum - a.volumeNum);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.symbol.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          (a.sector && a.sector.toLowerCase().includes(q))
      );
    }

    return list;
  }, [assets, currentTypeFilter, activeFilter, searchQuery]);

  const handleSort = (field: 'volume' | 'changePercent' | 'price' | 'symbol') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getRatingBadge = (rating: MarketAsset['rating']) => {
    switch (rating) {
      case 'Strong Buy':
        return <span className="text-[11px] font-semibold text-[#089981] bg-[#089981]/12 px-2 py-0.5 rounded font-sans">Strong Buy</span>;
      case 'Buy':
        return <span className="text-[11px] font-semibold text-[#20a28a] bg-[#20a28a]/12 px-2 py-0.5 rounded font-sans">Buy</span>;
      case 'Neutral':
        return <span className="text-[11px] font-semibold text-[#787B86] bg-[#787B86]/12 px-2 py-0.5 rounded font-sans">Neutral</span>;
      case 'Sell':
        return <span className="text-[11px] font-semibold text-[#f23645] bg-[#f23645]/12 px-2 py-0.5 rounded font-sans">Sell</span>;
      case 'Strong Sell':
        return <span className="text-[11px] font-semibold text-[#93000a] bg-[#93000a]/20 px-2 py-0.5 rounded font-sans">Strong Sell</span>;
    }
  };

  return (
    <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl overflow-hidden shadow-xs mb-6">
      {/* Table Header Controls */}
      <div className="p-3.5 border-b border-[#2A2E39] flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'most-active', label: 'Most Active' },
            { id: 'top-gainers', label: 'Top Gainers' },
            { id: 'top-losers', label: 'Top Losers' },
            { id: '52w-highs', label: 'Near 52W High' },
            { id: 'all', label: 'All Instruments' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as TableFilter)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#131722] text-[#F0F3FA] border border-[#363A45]'
                  : 'text-[#787B86] hover:text-[#F0F3FA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input in table */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Filter table rows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#131722] border border-[#2A2E39] text-[#F0F3FA] placeholder-[#50535E] text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#2962FF] w-48 font-mono"
          />
          <span className="text-xs text-[#787B86] font-mono shrink-0">
            {filteredAssets.length} results
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2A2E39] text-[11px] uppercase font-semibold text-[#787B86] bg-[#131722]/80 select-none">
              <th className="py-2.5 px-3 w-10 text-center">★</th>
              <th
                onClick={() => handleSort('symbol')}
                className="py-2.5 px-4 cursor-pointer hover:text-[#F0F3FA] transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Symbol & Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('price')}
                className="py-2.5 px-4 text-right cursor-pointer hover:text-[#F0F3FA] transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Last Price</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('changePercent')}
                className="py-2.5 px-4 text-right cursor-pointer hover:text-[#F0F3FA] transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Chg % (1D)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-4 text-center hidden md:table-cell">Technical Rating</th>
              <th
                onClick={() => handleSort('volume')}
                className="py-2.5 px-4 text-right cursor-pointer hover:text-[#F0F3FA] transition-colors hidden sm:table-cell"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Volume</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-4 text-right hidden lg:table-cell">Market Cap</th>
              <th className="py-2.5 px-4 text-center hidden xl:table-cell">7D Trend</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2E39]/60 text-xs">
            {filteredAssets.map((asset) => {
              const isSaved = watchlist.includes(asset.symbol);
              const isPositive = asset.change >= 0;

              // Sparkline render
              const min = Math.min(...asset.sparkline);
              const max = Math.max(...asset.sparkline);
              const range = max - min || 1;
              const points = asset.sparkline
                .map((val, i) => {
                  const x = (i / (asset.sparkline.length - 1)) * 60;
                  const y = 18 - ((val - min) / range) * 14 - 2;
                  return `${x},${y}`;
                })
                .join(' ');

              return (
                <tr
                  key={asset.symbol}
                  className="hover:bg-[#262A35] transition-colors group cursor-pointer"
                >
                  {/* Watchlist toggle */}
                  <td
                    className="py-2.5 px-3 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlistSymbol(asset.symbol);
                    }}
                  >
                    <button
                      className="text-[#50535E] hover:text-[#f7b928] transition-colors p-1"
                      title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          isSaved ? 'fill-[#f7b928] text-[#f7b928]' : ''
                        }`}
                      />
                    </button>
                  </td>

                  {/* Symbol & Name */}
                  <td
                    className="py-2.5 px-4 font-sans"
                    onClick={() => onSelectAsset(asset)}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-[#131722] border border-[#2A2E39] flex items-center justify-center font-mono font-bold text-[10px] text-[#2962FF] shrink-0">
                        {asset.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#F0F3FA] group-hover:text-[#2962FF] transition-colors flex items-center gap-1.5">
                          <span>{asset.displaySymbol}</span>
                          <span className="text-[10px] font-mono text-[#787B86] uppercase font-normal">
                            {asset.exchange}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#787B86] truncate max-w-[170px]">
                          {asset.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td
                    className="py-2.5 px-4 text-right font-mono"
                    onClick={() => onSelectAsset(asset)}
                  >
                    <div
                      className={`font-semibold tabular-nums ${
                        asset.lastTickDirection === 'up'
                          ? 'text-[#089981] tick-up'
                          : asset.lastTickDirection === 'down'
                          ? 'text-[#F23645] tick-down'
                          : 'text-[#F0F3FA]'
                      }`}
                    >
                      {asset.price < 5
                        ? asset.price.toFixed(4)
                        : asset.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                    </div>
                    <div className="text-[10px] text-[#787B86] tabular-nums">
                      {isPositive ? '+' : ''}
                      {asset.change.toFixed(2)}
                    </div>
                  </td>

                  {/* Chg % */}
                  <td
                    className="py-2.5 px-4 text-right font-mono"
                    onClick={() => onSelectAsset(asset)}
                  >
                    <div
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-medium tabular-nums ${
                        isPositive
                          ? 'text-[#089981] bg-[#089981]/12'
                          : 'text-[#F23645] bg-[#F23645]/12'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {asset.changePercent.toFixed(2)}%
                    </div>
                  </td>

                  {/* Rating */}
                  <td
                    className="py-2.5 px-4 text-center hidden md:table-cell"
                    onClick={() => onSelectAsset(asset)}
                  >
                    {getRatingBadge(asset.rating)}
                  </td>

                  {/* Volume */}
                  <td
                    className="py-2.5 px-4 text-right font-mono text-[#c3c5d8] hidden sm:table-cell"
                    onClick={() => onSelectAsset(asset)}
                  >
                    {asset.volume}
                  </td>

                  {/* Market Cap */}
                  <td
                    className="py-2.5 px-4 text-right font-mono text-[#c3c5d8] hidden lg:table-cell"
                    onClick={() => onSelectAsset(asset)}
                  >
                    {asset.marketCap || '—'}
                  </td>

                  {/* Sparkline */}
                  <td
                    className="py-2.5 px-4 text-center hidden xl:table-cell"
                    onClick={() => onSelectAsset(asset)}
                  >
                    <div className="w-16 h-5 mx-auto">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 60 20">
                        <polyline
                          fill="none"
                          stroke={isPositive ? '#089981' : '#F23645'}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={points}
                        />
                      </svg>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickTrade(asset);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-[#2962FF] hover:bg-[#1E53E5] text-white rounded transition-colors cursor-pointer"
                      >
                        Trade
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAsset(asset);
                        }}
                        className="p-1 text-[#787B86] hover:text-[#F0F3FA] rounded hover:bg-[#1E222D] transition-colors"
                        title="Open interactive chart"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
