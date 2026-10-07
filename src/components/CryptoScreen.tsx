import React, { useState } from 'react';
import { MarketAsset } from '../types/market';
import { Zap, ShieldCheck, Flame, Cpu, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoScreenProps {
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  onQuickTrade: (asset: MarketAsset) => void;
}

export const CryptoScreen: React.FC<CryptoScreenProps> = ({
  assets,
  onSelectAsset,
  onQuickTrade,
}) => {
  const [cryptoCategory, setCryptoCategory] = useState<string>('all');
  const cryptoAssets = assets.filter((a) => a.type === 'crypto');

  return (
    <div className="space-y-6">
      {/* Top Crypto Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl p-3.5 shadow-xs">
          <div className="text-[11px] text-[#787B86] uppercase font-sans">Total Crypto Market Cap</div>
          <div className="text-xl font-bold text-[#F0F3FA] mt-1 tabular-nums">$2.78 Trillion</div>
          <div className="text-xs text-[#089981] font-semibold flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3" />
            +2.4% past 24h
          </div>
        </div>

        <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl p-3.5 shadow-xs">
          <div className="text-[11px] text-[#787B86] uppercase font-sans">24h Global Volume</div>
          <div className="text-xl font-bold text-[#F0F3FA] mt-1 tabular-nums">$94.8 Billion</div>
          <div className="text-xs text-[#787B86] mt-0.5">Spot & Perpetuals</div>
        </div>

        <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl p-3.5 shadow-xs">
          <div className="text-[11px] text-[#787B86] uppercase font-sans">Bitcoin Dominance</div>
          <div className="text-xl font-bold text-[#F0F3FA] mt-1 tabular-nums">55.4%</div>
          <div className="w-full bg-[#131722] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div className="bg-[#2962FF] h-full rounded-full" style={{ width: '55.4%' }} />
          </div>
        </div>

        <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl p-3.5 shadow-xs">
          <div className="text-[11px] text-[#787B86] uppercase font-sans">Crypto Fear & Greed</div>
          <div className="text-xl font-bold text-[#089981] mt-1 tabular-nums">68 · Greed</div>
          <div className="text-xs text-[#787B86] mt-0.5">Yesterday: 64 · Last Wk: 58</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Crypto' },
          { id: 'l1', label: 'Layer 1 Blockchains' },
          { id: 'defi', label: 'DeFi Tokens' },
          { id: 'ai', label: 'AI & Data' },
          { id: 'meme', label: 'Meme Coins' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCryptoCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              cryptoCategory === cat.id
                ? 'bg-[#2962FF] text-white'
                : 'bg-[#1E222D] text-[#787B86] hover:text-[#F0F3FA] border border-[#2A2E39]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Crypto Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {cryptoAssets.map((asset) => {
          const isPositive = asset.change >= 0;
          return (
            <div
              key={asset.symbol}
              onClick={() => onSelectAsset(asset)}
              className="bg-[#1E222D] hover:bg-[#262A35] border border-[#2A2E39] hover:border-[#363A45] rounded-xl p-4 transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#131722] border border-[#2A2E39] flex items-center justify-center font-mono font-bold text-xs text-[#2962FF]">
                    {asset.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#F0F3FA] group-hover:text-[#2962FF] transition-colors">
                      {asset.name}
                    </div>
                    <div className="text-[11px] text-[#787B86] font-mono">
                      {asset.displaySymbol} · {asset.exchange}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded font-mono ${
                    isPositive ? 'text-[#089981] bg-[#089981]/12' : 'text-[#F23645] bg-[#F23645]/12'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {asset.changePercent.toFixed(2)}%
                </span>
              </div>

              <div className="my-3 font-mono">
                <div className="text-xl font-bold text-[#F0F3FA] tabular-nums">
                  ${asset.price < 2 ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-[#787B86] mt-0.5">
                  24h Vol: {asset.volume} · MktCap: {asset.marketCap}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-[#2A2E39]/60">
                <span className="text-[10px] font-mono text-[#089981] bg-[#089981]/10 px-2 py-0.5 rounded">
                  {asset.rating}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickTrade(asset);
                  }}
                  className="px-3 py-1 bg-[#2962FF] hover:bg-[#1E53E5] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Trade Spot
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
