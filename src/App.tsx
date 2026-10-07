import React, { useState, useEffect, useCallback } from 'react';
import { MarketAsset, PaperTradePosition } from './types/market';
import { INITIAL_ASSETS } from './data/mockMarkets';
import { TickerRibbon } from './components/TickerRibbon';
import { Header } from './components/Header';
import { MarketsSubNav, MarketTab, RegionFilter } from './components/MarketsSubNav';
import { IndicesBarometer } from './components/IndicesBarometer';
import { MarketHeatmap } from './components/MarketHeatmap';
import { LeaderboardTable } from './components/LeaderboardTable';
import { SectorsBarometer } from './components/SectorsBarometer';
import { NewsAndIdeasSection } from './components/NewsAndIdeasSection';
import { ForexScreen } from './components/ForexScreen';
import { CryptoScreen } from './components/CryptoScreen';
import { BondsFuturesScreen } from './components/BondsFuturesScreen';
import { InteractiveChartModal } from './components/InteractiveChartModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { PortfolioDrawer } from './components/PortfolioDrawer';
import { CommandPaletteModal } from './components/CommandPaletteModal';

export default function App() {
  const [assets, setAssets] = useState<MarketAsset[]>(INITIAL_ASSETS);
  const [isLiveUpdating, setIsLiveUpdating] = useState<boolean>(true);

  // Watchlist state
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['NVDA', 'AAPL', 'BTCUSD', 'SOLUSD', 'SPX', 'CL1!'];
  });

  // Paper portfolio state
  const [cashBalance, setCashBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tv_cash');
      if (saved) return Number(saved);
    } catch {}
    return 94250.0;
  });

  const [positions, setPositions] = useState<PaperTradePosition[]>(() => {
    try {
      const saved = localStorage.getItem('tv_positions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'pos-1',
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        type: 'BUY',
        shares: 25,
        entryPrice: 124.5,
        currentPrice: 132.85,
        totalCost: 3112.5,
        currentValue: 3321.25,
        pnl: 208.75,
        pnlPercent: 6.7,
        timestamp: '2 days ago',
      },
      {
        id: 'pos-2',
        symbol: 'SOLUSD',
        name: 'Solana',
        type: 'BUY',
        shares: 15,
        entryPrice: 142.0,
        currentPrice: 154.2,
        totalCost: 2130.0,
        currentValue: 2313.0,
        pnl: 183.0,
        pnlPercent: 8.59,
        timestamp: '1 day ago',
      },
    ];
  });

  // Modals & Drawers
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Navigations
  const [activeNavTab, setActiveNavTab] = useState<string>('markets');
  const [currentMarketTab, setCurrentMarketTab] = useState<MarketTab>('overview');
  const [currentRegion, setCurrentRegion] = useState<RegionFilter>('US');
  const [currency, setCurrency] = useState<string>('USD');

  // Save watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tv_watchlist', JSON.stringify(watchlist));
    } catch {}
  }, [watchlist]);

  // Save positions & cash
  useEffect(() => {
    try {
      localStorage.setItem('tv_positions', JSON.stringify(positions));
      localStorage.setItem('tv_cash', cashBalance.toString());
    } catch {}
  }, [positions, cashBalance]);

  // Keyboard shortcut Cmd/Ctrl + K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time market tick simulator
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      setAssets((prevAssets) => {
        // Pick 2 to 3 random assets to tick
        const tickCount = Math.floor(Math.random() * 2) + 2;
        const newAssets = [...prevAssets];

        for (let i = 0; i < tickCount; i++) {
          const randomIndex = Math.floor(Math.random() * newAssets.length);
          const asset = newAssets[randomIndex];
          const direction = Math.random() > 0.48 ? 1 : -1;
          const deltaPct = (Math.random() * 0.003 + 0.0005) * direction;

          const newPrice = Number(
            (asset.price * (1 + deltaPct)).toFixed(asset.price < 5 ? 4 : 2)
          );
          const newChange = Number((newPrice - asset.prevClose).toFixed(asset.price < 5 ? 4 : 2));
          const newChangePct = Number(((newChange / asset.prevClose) * 100).toFixed(2));
          const newHigh = Math.max(asset.high, newPrice);
          const newLow = Math.min(asset.low, newPrice);

          const updatedSparkline = [...asset.sparkline.slice(1), newPrice];

          newAssets[randomIndex] = {
            ...asset,
            price: newPrice,
            change: newChange,
            changePercent: newChangePct,
            high: newHigh,
            low: newLow,
            sparkline: updatedSparkline,
            lastTickDirection: direction > 0 ? 'up' : 'down',
          };
        }

        return newAssets;
      });
    }, 1600);

    return () => clearInterval(interval);
  }, [isLiveUpdating]);

  // Keep open positions updated with latest asset prices
  useEffect(() => {
    setPositions((prev) =>
      prev.map((pos) => {
        const liveAsset = assets.find((a) => a.symbol === pos.symbol);
        if (!liveAsset) return pos;
        const currentPrice = liveAsset.price;
        const currentValue = currentPrice * pos.shares;
        const pnl = pos.type === 'BUY'
          ? (currentPrice - pos.entryPrice) * pos.shares
          : (pos.entryPrice - currentPrice) * pos.shares;
        const pnlPercent = (pnl / pos.totalCost) * 100;

        return {
          ...pos,
          currentPrice,
          currentValue,
          pnl,
          pnlPercent,
        };
      })
    );
  }, [assets]);

  // Clear tick pulse highlights
  useEffect(() => {
    const timer = setTimeout(() => {
      setAssets((prev) =>
        prev.map((a) => (a.lastTickDirection ? { ...a, lastTickDirection: 'none' } : a))
      );
    }, 1200);
    return () => clearTimeout(timer);
  }, [assets]);

  // Watchlist actions
  const toggleWatchlistSymbol = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  // Trade execution action
  const handleExecuteTrade = (params: {
    symbol: string;
    name: string;
    type: 'BUY' | 'SELL';
    shares: number;
    price: number;
  }) => {
    const totalCost = params.shares * params.price;

    if (params.type === 'BUY' && totalCost > cashBalance) {
      alert('Insufficient simulated cash balance to execute trade.');
      return;
    }

    const newPosition: PaperTradePosition = {
      id: `pos-${Date.now()}`,
      symbol: params.symbol,
      name: params.name,
      type: params.type,
      shares: params.shares,
      entryPrice: params.price,
      currentPrice: params.price,
      totalCost,
      currentValue: totalCost,
      pnl: 0,
      pnlPercent: 0,
      timestamp: 'Just now',
    };

    setPositions((prev) => [newPosition, ...prev]);
    setCashBalance((prev) => prev - totalCost);
  };

  const handleClosePosition = (id: string) => {
    const pos = positions.find((p) => p.id === id);
    if (!pos) return;
    setCashBalance((prev) => prev + pos.currentValue);
    setPositions((prev) => prev.filter((p) => p.id !== id));
  };

  const handleResetPortfolio = () => {
    setCashBalance(100000.0);
    setPositions([]);
  };

  const handleSelectSymbolByName = (symbol: string) => {
    const found = assets.find((a) => a.symbol === symbol);
    if (found) {
      setSelectedAsset(found);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0D10] text-[#F0F3FA] flex flex-col font-sans selection:bg-[#2962FF] selection:text-white">
      {/* 1. Top Scrolling Live Ticker Marquee */}
      <TickerRibbon
        assets={assets}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
      />

      {/* 2. Primary Navigation Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleWatchlist={() => setIsWatchlistOpen(true)}
        onTogglePortfolio={() => setIsPortfolioOpen(true)}
        watchlistCount={watchlist.length}
        openPositionsCount={positions.length}
        isLiveUpdating={isLiveUpdating}
        onToggleLiveUpdating={() => setIsLiveUpdating(!isLiveUpdating)}
        cashBalance={cashBalance}
        activeNavTab={activeNavTab}
        onSelectNavTab={(tab) => {
          setActiveNavTab(tab);
          if (tab === 'heatmaps') setCurrentMarketTab('overview');
          if (tab === 'screeners') setCurrentMarketTab('stocks');
        }}
      />

      {/* 3. Sub-Navigation (Category & Region Tabs) */}
      <MarketsSubNav
        currentTab={currentMarketTab}
        onSelectTab={(tab) => setCurrentMarketTab(tab)}
        currentRegion={currentRegion}
        onSelectRegion={(reg) => setCurrentRegion(reg)}
        currency={currency}
        onChangeCurrency={(c) => setCurrency(c)}
      />

      {/* 4. Main Body Content Viewport */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 lg:px-6 py-6">
        {/* Dynamic Views by Tab */}
        {currentMarketTab === 'overview' && (
          <div>
            {/* Hero Key Benchmark Cards */}
            <IndicesBarometer
              assets={assets}
              onSelectAsset={(asset) => setSelectedAsset(asset)}
            />

            {/* TradingView Treemap Heatmap */}
            <MarketHeatmap onSelectSymbol={handleSelectSymbolByName} />

            {/* Screener Leaderboard Table */}
            <LeaderboardTable
              assets={assets}
              watchlist={watchlist}
              onToggleWatchlistSymbol={toggleWatchlistSymbol}
              onSelectAsset={(asset) => setSelectedAsset(asset)}
              onQuickTrade={(asset) => setSelectedAsset(asset)}
              currentTypeFilter="overview"
            />

            {/* Sectors Performance */}
            <SectorsBarometer onSelectSymbol={handleSelectSymbolByName} />

            {/* Live Financial News, Calendar & Trade Ideas */}
            <NewsAndIdeasSection onSelectSymbol={handleSelectSymbolByName} />
          </div>
        )}

        {currentMarketTab === 'stocks' && (
          <div>
            <div className="mb-4">
              <h1 className="text-xl font-bold text-[#F0F3FA] tracking-tight">
                US & Global Stock Market Screener
              </h1>
              <p className="text-xs text-[#787B86] mt-0.5">
                Real-time equities analysis, sector breakdowns, valuation metrics and volume breakouts.
              </p>
            </div>

            <MarketHeatmap onSelectSymbol={handleSelectSymbolByName} />

            <LeaderboardTable
              assets={assets}
              watchlist={watchlist}
              onToggleWatchlistSymbol={toggleWatchlistSymbol}
              onSelectAsset={(asset) => setSelectedAsset(asset)}
              onQuickTrade={(asset) => setSelectedAsset(asset)}
              currentTypeFilter="stocks"
            />

            <SectorsBarometer onSelectSymbol={handleSelectSymbolByName} />
          </div>
        )}

        {currentMarketTab === 'crypto' && (
          <div>
            <div className="mb-4">
              <h1 className="text-xl font-bold text-[#F0F3FA] tracking-tight">
                Cryptocurrency Market Overview
              </h1>
              <p className="text-xs text-[#787B86] mt-0.5">
                Real-time Bitcoin, Ethereum, Solana, and altcoin telemetry with Layer-1 metrics and dominance.
              </p>
            </div>

            <CryptoScreen
              assets={assets}
              onSelectAsset={(asset) => setSelectedAsset(asset)}
              onQuickTrade={(asset) => setSelectedAsset(asset)}
            />

            <div className="mt-6">
              <LeaderboardTable
                assets={assets}
                watchlist={watchlist}
                onToggleWatchlistSymbol={toggleWatchlistSymbol}
                onSelectAsset={(asset) => setSelectedAsset(asset)}
                onQuickTrade={(asset) => setSelectedAsset(asset)}
                currentTypeFilter="crypto"
              />
            </div>
          </div>
        )}

        {currentMarketTab === 'forex' && (
          <div>
            <div className="mb-4">
              <h1 className="text-xl font-bold text-[#F0F3FA] tracking-tight">
                Foreign Exchange (Forex) Currency Markets
              </h1>
              <p className="text-xs text-[#787B86] mt-0.5">
                Major pairs, cross rates, pip calculator, and currency strength barometer.
              </p>
            </div>

            <ForexScreen
              assets={assets}
              onSelectAsset={(asset) => setSelectedAsset(asset)}
            />

            <div className="mt-6">
              <LeaderboardTable
                assets={assets}
                watchlist={watchlist}
                onToggleWatchlistSymbol={toggleWatchlistSymbol}
                onSelectAsset={(asset) => setSelectedAsset(asset)}
                onQuickTrade={(asset) => setSelectedAsset(asset)}
                currentTypeFilter="forex"
              />
            </div>
          </div>
        )}

        {currentMarketTab === 'indices' && (
          <div>
            <div className="mb-4">
              <h1 className="text-xl font-bold text-[#F0F3FA] tracking-tight">
                Global World Indices
              </h1>
              <p className="text-xs text-[#787B86] mt-0.5">
                S&P 500, Nasdaq 100, Dow Jones, Russell 2000, DAX, Nikkei, and FTSE benchmarks.
              </p>
            </div>

            <IndicesBarometer
              assets={assets}
              onSelectAsset={(asset) => setSelectedAsset(asset)}
            />

            <LeaderboardTable
              assets={assets}
              watchlist={watchlist}
              onToggleWatchlistSymbol={toggleWatchlistSymbol}
              onSelectAsset={(asset) => setSelectedAsset(asset)}
              onQuickTrade={(asset) => setSelectedAsset(asset)}
              currentTypeFilter="indices"
            />
          </div>
        )}

        {(currentMarketTab === 'futures' || currentMarketTab === 'bonds') && (
          <div>
            <div className="mb-4">
              <h1 className="text-xl font-bold text-[#F0F3FA] tracking-tight">
                Futures, Commodities & Sovereign Yields
              </h1>
              <p className="text-xs text-[#787B86] mt-0.5">
                Crude oil, precious metals, and sovereign US Treasury yield curve structure.
              </p>
            </div>

            <BondsFuturesScreen
              assets={assets}
              onSelectAsset={(asset) => setSelectedAsset(asset)}
              onQuickTrade={(asset) => setSelectedAsset(asset)}
            />
          </div>
        )}
      </main>

      {/* 5. Footer */}
      <footer className="w-full bg-[#131722] border-t border-[#2A2E39] py-6 px-4 lg:px-6 text-xs text-[#787B86]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#F0F3FA]">TradingView Markets</span>
            <span>·</span>
            <span>Real-time Financial Intelligence & Technical Analysis</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Exchanges: NASDAQ · NYSE · CME · CBOE · BINANCE</span>
            <span>·</span>
            <span>Delayed Quotes for Non-Subscribers: Real-Time</span>
          </div>
        </div>
      </footer>

      {/* 6. Interactive Asset Detail / Workstation Modal */}
      {selectedAsset && (
        <InteractiveChartModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          isWatchlisted={watchlist.includes(selectedAsset.symbol)}
          onToggleWatchlist={toggleWatchlistSymbol}
          onExecuteTrade={handleExecuteTrade}
        />
      )}

      {/* 7. Watchlist Slide-out Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistSymbols={watchlist}
        allAssets={assets}
        onRemoveSymbol={toggleWatchlistSymbol}
        onSelectAsset={(asset) => {
          setSelectedAsset(asset);
          setIsWatchlistOpen(false);
        }}
        onOpenSearch={() => {
          setIsWatchlistOpen(false);
          setIsSearchOpen(true);
        }}
      />

      {/* 8. Paper Trading Portfolio Drawer */}
      <PortfolioDrawer
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
        positions={positions}
        cashBalance={cashBalance}
        onClosePosition={handleClosePosition}
        onResetPortfolio={handleResetPortfolio}
      />

      {/* 9. Global Symbol Command Palette Search */}
      <CommandPaletteModal
        assets={assets}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectAsset={(asset) => {
          setSelectedAsset(asset);
          setIsSearchOpen(false);
        }}
      />
    </div>
  );
}
