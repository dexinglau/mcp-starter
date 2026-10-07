import React, { useState } from 'react';
import { MarketAsset } from '../types/market';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

interface IndicesBarometerProps {
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const IndicesBarometer: React.FC<IndicesBarometerProps> = ({ assets, onSelectAsset }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '1Y'>('1D');

  // Pick top 4 benchmark assets
  const keySymbols = ['SPX', 'NDX', 'DJI', 'BTCUSD'];
  const keyAssets = keySymbols
    .map((sym) => assets.find((a) => a.symbol === sym))
    .filter(Boolean) as MarketAsset[];

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-[#F0F3FA] tracking-tight">
            Major Indices & Benchmarks
          </h2>
          <span className="text-xs text-[#787B86] font-mono">Live Session</span>
        </div>

        <div className="flex items-center bg-[#1E222D] p-0.5 rounded-lg border border-[#2A2E39]">
          {(['1D', '5D', '1M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-0.5 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                timeframe === tf
                  ? 'bg-[#2962FF] text-white shadow-xs'
                  : 'text-[#787B86] hover:text-[#F0F3FA]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {keyAssets.map((asset) => {
          const isPositive = asset.change >= 0;
          const rangeDelta = asset.high - asset.low || 1;
          const currentPosPercent = Math.min(
            100,
            Math.max(0, ((asset.price - asset.low) / rangeDelta) * 100)
          );

          // Build SVG area path
          const min = Math.min(...asset.sparkline);
          const max = Math.max(...asset.sparkline);
          const range = max - min || 1;
          const points = asset.sparkline.map((val, i) => {
            const x = (i / (asset.sparkline.length - 1)) * 160;
            const y = 45 - ((val - min) / range) * 35 - 5;
            return { x, y };
          });

          const polylineStr = points.map((p) => `${p.x},${p.y}`).join(' ');
          const areaPathStr = `M ${points[0].x},${points[0].y} ` +
            points.map((p) => `L ${p.x},${p.y}`).join(' ') +
            ` L ${points[points.length - 1].x},50 L ${points[0].x},50 Z`;

          const gradientId = `grad-${asset.symbol}`;
          const colorStroke = isPositive ? '#089981' : '#F23645';

          return (
            <div
              key={asset.symbol}
              onClick={() => onSelectAsset(asset)}
              className="bg-[#1E222D] hover:bg-[#262A35] border border-[#2A2E39] hover:border-[#363A45] rounded-xl p-3.5 transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
            >
              {/* Header: Name & Symbol */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#F0F3FA] group-hover:text-[#2962FF] transition-colors">
                      {asset.displaySymbol}
                    </span>
                    <span className="text-[10px] text-[#787B86] uppercase font-mono">
                      {asset.exchange}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#787B86] truncate max-w-[150px]">
                    {asset.name}
                  </div>
                </div>

                <div
                  className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded font-mono ${
                    isPositive
                      ? 'text-[#089981] bg-[#089981]/12'
                      : 'text-[#F23645] bg-[#F23645]/12'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
                    {asset.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Price & Sparkline Area */}
              <div className="my-2.5 flex items-end justify-between gap-2">
                <div>
                  <div
                    className={`text-xl font-bold font-mono tracking-tight tabular-nums ${
                      asset.lastTickDirection === 'up'
                        ? 'tick-up text-[#089981]'
                        : asset.lastTickDirection === 'down'
                        ? 'tick-down text-[#F23645]'
                        : 'text-[#F0F3FA]'
                    }`}
                  >
                    {asset.price < 10
                      ? asset.price.toFixed(3)
                      : asset.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                  </div>
                  <div className="text-[11px] font-mono text-[#787B86]">
                    {isPositive ? '+' : ''}
                    {asset.change.toFixed(2)} pts
                  </div>
                </div>

                {/* SVG Area Chart */}
                <div className="w-32 h-11 shrink-0 overflow-hidden">
                  <svg viewBox="0 0 160 50" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colorStroke} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={colorStroke} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={areaPathStr} fill={`url(#${gradientId})`} />
                    <polyline
                      fill="none"
                      stroke={colorStroke}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={polylineStr}
                    />
                  </svg>
                </div>
              </div>

              {/* Day Range Bar */}
              <div className="pt-2 border-t border-[#2A2E39]/70">
                <div className="flex items-center justify-between text-[10px] text-[#787B86] font-mono mb-1">
                  <span>L: {asset.low.toFixed(1)}</span>
                  <span>Day's Range</span>
                  <span>H: {asset.high.toFixed(1)}</span>
                </div>
                <div className="w-full h-1 bg-[#131722] rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 bg-[#2962FF] rounded-full"
                    style={{
                      left: '0%',
                      width: `${currentPosPercent}%`,
                    }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white rounded-full"
                    style={{ left: `${currentPosPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
