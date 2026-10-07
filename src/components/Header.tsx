import React from 'react';
import { Search, Bookmark, Briefcase, Activity, Radio, ChevronDown, Bell } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onToggleWatchlist: () => void;
  onTogglePortfolio: () => void;
  watchlistCount: number;
  openPositionsCount: number;
  isLiveUpdating: boolean;
  onToggleLiveUpdating: () => void;
  cashBalance: number;
  activeNavTab: string;
  onSelectNavTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onToggleWatchlist,
  onTogglePortfolio,
  watchlistCount,
  openPositionsCount,
  isLiveUpdating,
  onToggleLiveUpdating,
  cashBalance,
  activeNavTab,
  onSelectNavTab,
}) => {
  const navItems = [
    { id: 'markets', label: 'Markets' },
    { id: 'supercharts', label: 'Supercharts' },
    { id: 'screeners', label: 'Screeners' },
    { id: 'community', label: 'Community' },
    { id: 'news', label: 'News' },
    { id: 'heatmaps', label: 'Heatmaps' },
  ];

  return (
    <header className="w-full bg-[#131722] border-b border-[#2A2E39] px-4 lg:px-6 h-14 flex items-center justify-between z-30 sticky top-0">
      {/* Zone 1: TradingView Brand */}
      <div className="flex items-center gap-6">
        <div
          onClick={() => onSelectNavTab('markets')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {/* Authentic TradingView Logo mark */}
          <div className="w-8 h-8 rounded bg-[#1E222D] border border-[#2A2E39] flex items-center justify-center group-hover:border-[#2962FF] transition-colors shadow-sm">
            <svg viewBox="0 0 36 28" fill="none" className="w-5 h-4">
              <path
                d="M4 14L14 4V24L4 14Z"
                fill="#2962FF"
              />
              <path
                d="M22 4V24L32 14L22 4Z"
                fill="#F0F3FA"
              />
              <circle cx="18" cy="14" r="3.5" fill="#089981" />
            </svg>
          </div>
          <span className="font-bold text-base tracking-tight text-[#F0F3FA] group-hover:text-white transition-colors">
            TradingView
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeNavTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectNavTab(item.id)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer relative ${
                  isActive
                    ? 'text-[#F0F3FA]'
                    : 'text-[#787B86] hover:text-[#F0F3FA]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-[-13px] left-3 right-3 h-[2px] bg-[#2962FF]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Zone 3: Search & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Bar Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 bg-[#1E222D] hover:bg-[#2A2E39] text-[#787B86] hover:text-[#F0F3FA] border border-[#2A2E39] hover:border-[#363A45] rounded-full px-3.5 py-1.5 text-xs transition-all w-36 sm:w-64 justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 shrink-0 text-[#787B86]" />
            <span className="truncate">Search NVDA, BTC...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-[#131722] text-[#787B86] rounded border border-[#2A2E39]">
            ⌘K
          </kbd>
        </button>

        {/* Live Simulation Pulse */}
        <button
          onClick={onToggleLiveUpdating}
          title={isLiveUpdating ? 'Pause live market feed' : 'Resume live market feed'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono border transition-all cursor-pointer ${
            isLiveUpdating
              ? 'bg-[#089981]/10 text-[#089981] border-[#089981]/30 hover:bg-[#089981]/20'
              : 'bg-[#1E222D] text-[#787B86] border-[#2A2E39] hover:text-[#F0F3FA]'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isLiveUpdating ? 'bg-[#089981] animate-ping' : 'bg-[#787B86]'}`} />
          <span className="hidden md:inline">{isLiveUpdating ? 'LIVE' : 'PAUSED'}</span>
        </button>

        {/* Paper Portfolio Indicator */}
        <button
          onClick={onTogglePortfolio}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1E222D] hover:bg-[#2A2E39] border border-[#2A2E39] text-xs font-mono tabular-nums transition-colors cursor-pointer text-[#F0F3FA]"
          title="Paper Trading Account"
        >
          <Briefcase className="w-3.5 h-3.5 text-[#2962FF]" />
          <span className="hidden sm:inline text-[#787B86]">Paper:</span>
          <span className="font-medium text-[#F0F3FA]">
            ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          {openPositionsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-[#2962FF] text-white text-[10px] rounded-full font-bold">
              {openPositionsCount}
            </span>
          )}
        </button>

        {/* Watchlist Drawer Toggle */}
        <button
          onClick={onToggleWatchlist}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E222D] hover:bg-[#2A2E39] border border-[#2A2E39] text-xs font-medium text-[#F0F3FA] transition-colors cursor-pointer relative"
          title="Toggle Watchlist"
        >
          <Bookmark className="w-3.5 h-3.5 text-[#F0F3FA]" />
          <span className="hidden md:inline">Watchlist</span>
          {watchlistCount > 0 && (
            <span className="px-1.5 py-0.2 bg-[#2A2E39] text-[#b6c4ff] text-[10px] rounded-full font-mono font-semibold border border-[#363A45]">
              {watchlistCount}
            </span>
          )}
        </button>

        {/* User Avatar */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2962FF] to-[#66DABF] flex items-center justify-center text-xs font-bold text-white shadow-sm ring-1 ring-[#363A45] cursor-pointer">
          TV
        </div>
      </div>
    </header>
  );
};
