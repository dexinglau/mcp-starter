import React from 'react';
import { MarketAsset } from '../types/market';
import { Flame, Droplet, Layers, TrendingUp, TrendingDown, Shield } from 'lucide-react';

interface BondsFuturesScreenProps {
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  onQuickTrade: (asset: MarketAsset) => void;
}

export const BondsFuturesScreen: React.FC<BondsFuturesScreenProps> = ({
  assets,
  onSelectAsset,
  onQuickTrade,
}) => {
  const futures = assets.filter((a) => a.type === 'futures');
  const bonds = assets.filter((a) => a.type === 'bond');

  // Yield curve maturities
  const yieldCurve = [
    { label: '1M', yield: 4.85 },
    { label: '3M', yield: 4.62 },
    { label: '6M', yield: 4.38 },
    { label: '2Y', yield: 3.98 },
    { label: '5Y', yield: 3.92 },
    { label: '10Y', yield: 4.02 },
    { label: '30Y', yield: 4.31 },
  ];

  return (
    <div className="space-y-6">
      {/* US Treasury Yield Curve Visualizer */}
      <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#F0F3FA] tracking-tight">
              US Treasury Yield Curve
            </h3>
            <p className="text-xs text-[#787B86] mt-0.5">
              Government Benchmark Sovereign Debt Yields
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#089981] bg-[#089981]/10 px-2 py-0.5 rounded border border-[#089981]/30">
              Un-inverted (Normalized 2Y/10Y)
            </span>
          </div>
        </div>

        {/* Yield Curve SVG Graph */}
        <div className="w-full bg-[#131722] border border-[#2A2E39] rounded-xl p-4">
          <div className="h-44 w-full">
            <svg viewBox="0 0 600 150" className="w-full h-full overflow-visible">
              {/* Horizontal Reference lines */}
              {[3.5, 4.0, 4.5, 5.0].map((val) => {
                const y = 150 - ((val - 3.0) / 2.5) * 120 - 15;
                return (
                  <g key={val}>
                    <line
                      x1="40"
                      y1={y}
                      x2="580"
                      y2={y}
                      stroke="#2A2E39"
                      strokeDasharray="2 2"
                    />
                    <text
                      x="35"
                      y={y + 3}
                      fill="#787B86"
                      fontSize="9"
                      textAnchor="end"
                      fontFamily="JetBrains Mono"
                    >
                      {val.toFixed(1)}%
                    </text>
                  </g>
                );
              })}

              {/* Yield points polyline */}
              {(() => {
                const points = yieldCurve.map((item, idx) => {
                  const x = 70 + idx * 80;
                  const y = 150 - ((item.yield - 3.0) / 2.5) * 120 - 15;
                  return { x, y, ...item };
                });

                const polylineStr = points.map((p) => `${p.x},${p.y}`).join(' ');

                return (
                  <g>
                    <polyline
                      fill="none"
                      stroke="#2962FF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={polylineStr}
                    />
                    {points.map((p, idx) => (
                      <g key={idx}>
                        <circle cx={p.x} cy={p.y} r="4" fill="#2962FF" stroke="#F0F3FA" strokeWidth="1.5" />
                        <text
                          x={p.x}
                          y={p.y - 10}
                          fill="#F0F3FA"
                          fontSize="10"
                          textAnchor="middle"
                          fontFamily="JetBrains Mono"
                          fontWeight="bold"
                        >
                          {p.yield.toFixed(2)}%
                        </text>
                        <text
                          x={p.x}
                          y={145}
                          fill="#787B86"
                          fontSize="10"
                          textAnchor="middle"
                          fontFamily="JetBrains Mono"
                        >
                          {p.label}
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>
      </div>

      {/* Commodities & Futures Grid */}
      <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl p-4 shadow-xs">
        <h3 className="text-base font-bold text-[#F0F3FA] mb-3 tracking-tight">
          Energy & Precious Metals Futures
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {futures.map((asset) => {
            const isPositive = asset.change >= 0;
            return (
              <div
                key={asset.symbol}
                onClick={() => onSelectAsset(asset)}
                className="bg-[#131722] hover:bg-[#1A1F2C] border border-[#2A2E39] hover:border-[#363A45] rounded-xl p-4 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#1E222D] border border-[#2A2E39] flex items-center justify-center font-bold text-xs text-[#2962FF] font-mono">
                      FUT
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#F0F3FA]">
                        {asset.displaySymbol}
                      </div>
                      <div className="text-[10px] text-[#787B86]">{asset.exchange} · {asset.name}</div>
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
                    ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-[#787B86]">
                    Net: {isPositive ? '+' : ''}{asset.change.toFixed(2)} pts · Vol: {asset.volume}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#2A2E39]/50">
                  <span className="text-[11px] font-mono text-[#787B86]">
                    Rating: <strong className="text-[#dfe2f2]">{asset.rating}</strong>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickTrade(asset);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold bg-[#2962FF] hover:bg-[#1E53E5] text-white rounded transition-colors"
                  >
                    Trade Contract
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
