import React from 'react';
import { MarketAsset } from '../types/market';
import { X, Trash2, ArrowUpRight, TrendingUp, TrendingDown, Star } from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: string[];
  allAssets: MarketAsset[];
  onRemoveSymbol: (symbol: string) => void;
  onSelectAsset: (asset: MarketAsset) => void;
  onOpenSearch: () => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  allAssets,
  onRemoveSymbol,
  onSelectAsset,
  onOpenSearch,
}) => {
  if (!isOpen) return null;

  const watchlistAssets = watchlistSymbols
    .map((sym) => allAssets.find((a) => a.symbol === sym))
    .filter(Boolean) as MarketAsset[];

  // Average change %
  const avgChange = watchlistAssets.length
    ? watchlistAssets.reduce((sum, a) => sum + a.changePercent, 0) / watchlistAssets.length
    : 0;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="w-full max-w-md bg-[#131722] border-l border-[#2A2E39] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#2A2E39] flex items-center justify-between bg-[#171B26]">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#f7b928] fill-[#f7b928]" />
            <h2 className="text-sm font-bold text-[#F0F3FA] tracking-tight">
              My Watchlist ({watchlistSymbols.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="px-2.5 py-1 text-xs bg-[#1E222D] hover:bg-[#2A2E39] text-[#787B86] hover:text-[#F0F3FA] border border-[#2A2E39] rounded-md transition-colors cursor-pointer"
            >
              + Add Symbol
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#787B86] hover:text-[#F0F3FA] hover:bg-[#1E222D] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Watchlist Summary Pill */}
        {watchlistAssets.length > 0 && (
          <div className="px-4 py-2.5 bg-[#0C0D10] border-b border-[#2A2E39] flex items-center justify-between text-xs font-mono">
            <span className="text-[#787B86]">Basket Avg 1D:</span>
            <span
              className={`font-semibold tabular-nums flex items-center gap-1 ${
                avgChange >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
              }`}
            >
              {avgChange >= 0 ? '+' : ''}
              {avgChange.toFixed(2)}%
            </span>
          </div>
        )}

        {/* Watchlist Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#2A2E39]/50">
          {watchlistAssets.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#787B86] flex flex-col items-center justify-center h-48">
              <Star className="w-8 h-8 text-[#363A45] mb-2" />
              <span>Your watchlist is currently empty.</span>
              <button
                onClick={onOpenSearch}
                className="mt-3 px-3 py-1.5 bg-[#2962FF] hover:bg-[#1E53E5] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Search & Add Tickers
              </button>
            </div>
          ) : (
            watchlistAssets.map((asset) => {
              const isPositive = asset.change >= 0;
              return (
                <div
                  key={asset.symbol}
                  onClick={() => onSelectAsset(asset)}
                  className="p-3.5 hover:bg-[#1E222D] transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0C0D10] border border-[#2A2E39] flex items-center justify-center font-mono font-bold text-xs text-[#2962FF]">
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#F0F3FA] group-hover:text-[#2962FF] transition-colors">
                        {asset.displaySymbol}
                      </div>
                      <div className="text-[11px] text-[#787B86] truncate max-w-[120px]">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  {/* Price & actions */}
                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <div
                        className={`text-xs font-semibold tabular-nums ${
                          asset.lastTickDirection === 'up'
                            ? 'text-[#089981] tick-up'
                            : asset.lastTickDirection === 'down'
                            ? 'text-[#F23645] tick-down'
                            : 'text-[#F0F3FA]'
                        }`}
                      >
                        ${asset.price < 5 ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div
                        className={`text-[10px] font-medium tabular-nums ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSymbol(asset.symbol);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-[#787B86] hover:text-[#F23645] hover:bg-[#131722] rounded transition-all"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#0C0D10] border-t border-[#2A2E39] text-center text-[11px] text-[#787B86] font-mono">
          Prices update in real time with live market feed
        </div>
      </div>
    </div>
  );
};
