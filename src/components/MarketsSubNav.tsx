import React from 'react';
import { Globe, Clock, ChevronDown, Sparkles } from 'lucide-react';
import { AssetType } from '../types/market';

export type MarketTab = 'overview' | 'stocks' | 'crypto' | 'forex' | 'indices' | 'futures' | 'bonds';
export type RegionFilter = 'US' | 'Global' | 'Europe' | 'Asia';

interface MarketsSubNavProps {
  currentTab: MarketTab;
  onSelectTab: (tab: MarketTab) => void;
  currentRegion: RegionFilter;
  onSelectRegion: (region: RegionFilter) => void;
  currency: string;
  onChangeCurrency: (curr: string) => void;
}

export const MarketsSubNav: React.FC<MarketsSubNavProps> = ({
  currentTab,
  onSelectTab,
  currentRegion,
  onSelectRegion,
  currency,
  onChangeCurrency,
}) => {
  const tabs: { id: MarketTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'indices', label: 'Indices' },
    { id: 'futures', label: 'Futures & Commodities' },
    { id: 'bonds', label: 'Bonds & Rates' },
  ];

  const regions: { id: RegionFilter; label: string }[] = [
    { id: 'US', label: 'United States' },
    { id: 'Global', label: 'World' },
    { id: 'Europe', label: 'Europe' },
    { id: 'Asia', label: 'Asia-Pacific' },
  ];

  return (
    <div className="w-full bg-[#0C0D10] border-b border-[#2A2E39] px-4 lg:px-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 py-2.5">
        {/* Market Category Tabs (Segmented Navigation) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#1E222D] text-[#F0F3FA] border border-[#363A45] shadow-xs'
                    : 'text-[#787B86] hover:text-[#F0F3FA] hover:bg-[#1E222D]/50 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Region & Market Status Bar */}
        <div className="flex items-center gap-3 overflow-x-auto text-xs shrink-0">
          {/* Region selector */}
          <div className="flex items-center bg-[#131722] p-0.5 rounded-lg border border-[#2A2E39]">
            {regions.map((reg) => (
              <button
                key={reg.id}
                onClick={() => onSelectRegion(reg.id)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  currentRegion === reg.id
                    ? 'bg-[#2962FF] text-white shadow-xs'
                    : 'text-[#787B86] hover:text-[#F0F3FA]'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>

          {/* Market Status Live Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#131722] border border-[#2A2E39] text-[#787B86] text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981] animate-pulse" />
            <span className="text-[#dfe2f2]">US Markets Open</span>
            <span className="text-[#50535E]">·</span>
            <span>Closes in 2h 14m</span>
          </div>

          {/* Currency selector */}
          <div className="flex items-center gap-1">
            <select
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value)}
              className="bg-[#131722] border border-[#2A2E39] text-[#dfe2f2] text-[11px] font-mono px-2 py-1 rounded-md focus:outline-none focus:border-[#2962FF] cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
