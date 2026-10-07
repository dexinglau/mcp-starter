import React, { useState, useEffect, useRef } from 'react';
import { MarketAsset, AssetType } from '../types/market';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface CommandPaletteModalProps {
  assets: MarketAsset[];
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: MarketAsset) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  assets,
  isOpen,
  onClose,
  onSelectAsset,
}) => {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredAssets = assets.filter((asset) => {
    const matchesType = selectedType === 'all' || asset.type === selectedType;
    if (!matchesType) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      asset.symbol.toLowerCase().includes(q) ||
      asset.name.toLowerCase().includes(q) ||
      (asset.sector && asset.sector.toLowerCase().includes(q))
    );
  });

  // Handle keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(filteredAssets.length - 1, prev + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredAssets[selectedIndex]) {
          onSelectAsset(filteredAssets[selectedIndex]);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredAssets, selectedIndex, onSelectAsset, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#131722] border border-[#2A2E39] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-100 flex flex-col">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-[#2A2E39] flex items-center gap-3 bg-[#171B26]">
          <Search className="w-5 h-5 text-[#787B86] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search symbol, company, crypto, or forex (e.g. NVDA, BTC, EURUSD)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-[#F0F3FA] placeholder-[#50535E] text-sm focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#787B86] hover:text-[#F0F3FA] hover:bg-[#1E222D]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 px-3 py-2 bg-[#0C0D10] border-b border-[#2A2E39] overflow-x-auto">
          {[
            { id: 'all', label: 'All Markets' },
            { id: 'stock', label: 'Stocks' },
            { id: 'crypto', label: 'Crypto' },
            { id: 'forex', label: 'Forex' },
            { id: 'index', label: 'Indices' },
            { id: 'futures', label: 'Futures' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedType(tab.id);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedType === tab.id
                  ? 'bg-[#2962FF] text-white shadow-xs'
                  : 'text-[#787B86] hover:text-[#F0F3FA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-[#2A2E39]/40 p-1">
          {filteredAssets.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#787B86]">
              No instruments found matching "{query}"
            </div>
          ) : (
            filteredAssets.map((asset, idx) => {
              const isSelected = idx === selectedIndex;
              const isPositive = asset.change >= 0;

              return (
                <div
                  key={asset.symbol}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                    isSelected ? 'bg-[#1E222D] border border-[#2962FF]/50' : 'hover:bg-[#1E222D]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0C0D10] border border-[#2A2E39] flex items-center justify-center font-mono font-bold text-xs text-[#2962FF]">
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#F0F3FA]">
                          {asset.displaySymbol}
                        </span>
                        <span className="text-[10px] font-mono text-[#787B86] uppercase bg-[#131722] px-1.5 py-0.5 rounded border border-[#2A2E39]">
                          {asset.exchange}
                        </span>
                        <span className="text-[11px] text-[#787B86] capitalize font-mono">
                          {asset.type}
                        </span>
                      </div>
                      <div className="text-xs text-[#787B86] truncate max-w-sm">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  {/* Price & Change */}
                  <div className="text-right font-mono">
                    <div className="font-semibold text-xs text-[#F0F3FA] tabular-nums">
                      ${asset.price < 5 ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-[11px] font-medium tabular-nums ${
                        isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-2.5 bg-[#0C0D10] border-t border-[#2A2E39] flex items-center justify-between text-[11px] text-[#787B86] font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>TradingView Symbol Directory</span>
        </div>
      </div>
    </div>
  );
};
