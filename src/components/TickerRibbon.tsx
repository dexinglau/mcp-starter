import React from 'react';
import { MarketAsset } from '../types/market';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerRibbonProps {
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const TickerRibbon: React.FC<TickerRibbonProps> = ({ assets, onSelectAsset }) => {
  // Take a selection of key tickers for ribbon
  const ribbonAssets = assets.slice(0, 14);
  // Duplicate for seamless infinite marquee scroll
  const marqueeList = [...ribbonAssets, ...ribbonAssets];

  return (
    <div className="w-full bg-[#131722] border-b border-[#2A2E39] overflow-hidden select-none relative z-20">
      <div className="flex items-center animate-marquee py-1.5 hover:cursor-pointer">
        {marqueeList.map((asset, idx) => {
          const isPositive = asset.change >= 0;
          return (
            <div
              key={`${asset.symbol}-${idx}`}
              onClick={() => onSelectAsset(asset)}
              className="flex items-center gap-3 px-4 py-0.5 border-r border-[#2A2E39]/60 hover:bg-[#1E222D] transition-colors shrink-0 group"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs text-[#F0F3FA] group-hover:text-[#2962FF] transition-colors">
                  {asset.displaySymbol}
                </span>
                <span className="text-[10px] text-[#787B86] uppercase font-mono">
                  {asset.exchange}
                </span>
              </div>

              <div className="flex items-baseline gap-1.5 font-mono">
                <span className={`text-xs font-medium tabular-nums ${asset.lastTickDirection === 'up' ? 'text-[#089981] tick-up' : asset.lastTickDirection === 'down' ? 'text-[#F23645] tick-down' : 'text-[#F0F3FA]'}`}>
                  {asset.price < 5 ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>

                <span
                  className={`text-[11px] font-medium flex items-center tabular-nums ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {asset.changePercent.toFixed(2)}%
                </span>
              </div>

              {/* Mini SVG Sparkline */}
              <div className="w-12 h-3.5 hidden sm:block">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 48 14">
                  {(() => {
                    const min = Math.min(...asset.sparkline);
                    const max = Math.max(...asset.sparkline);
                    const range = max - min || 1;
                    const points = asset.sparkline
                      .map((val, i) => {
                        const x = (i / (asset.sparkline.length - 1)) * 48;
                        const y = 14 - ((val - min) / range) * 12 - 1;
                        return `${x},${y}`;
                      })
                      .join(' ');
                    return (
                      <polyline
                        fill="none"
                        stroke={isPositive ? '#089981' : '#F23645'}
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                      />
                    );
                  })()}
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
