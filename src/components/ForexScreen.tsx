import React, { useState } from 'react';
import { MarketAsset } from '../types/market';
import { Calculator, ArrowRightLeft, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface ForexScreenProps {
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const ForexScreen: React.FC<ForexScreenProps> = ({ assets, onSelectAsset }) => {
  const fxAssets = assets.filter((a) => a.type === 'forex');

  // Interactive Pip Value Calculator
  const [calcPair, setCalcPair] = useState<string>('EURUSD');
  const [lotSize, setLotSize] = useState<number>(100000); // Standard lot 100k
  const [pipsMoved, setPipsMoved] = useState<number>(25);

  const selectedAsset = fxAssets.find((a) => a.symbol === calcPair) || fxAssets[0];
  // Standard FX pip is 0.0001 (or 0.01 for JPY)
  const isJpy = selectedAsset?.symbol.includes('JPY');
  const pipUnit = isJpy ? 0.01 : 0.0001;
  const pipValuePerUnit = isJpy ? (pipUnit / (selectedAsset?.price || 148)) * lotSize : pipUnit * lotSize;
  const totalProfit = pipValuePerUnit * pipsMoved;

  // Currency Strength values (0 to 10)
  const currencyStrengths = [
    { currency: 'USD', score: 7.8, status: 'Strong', color: '#089981' },
    { currency: 'GBP', score: 6.4, status: 'Bullish', color: '#20A28A' },
    { currency: 'EUR', score: 5.1, status: 'Neutral', color: '#787B86' },
    { currency: 'AUD', score: 4.8, status: 'Neutral', color: '#787B86' },
    { currency: 'CAD', score: 4.2, status: 'Soft', color: '#F23645' },
    { currency: 'JPY', score: 2.6, status: 'Weak', color: '#93000A' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Forex Header Barometer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Currency Strength Meter */}
        <div className="md:col-span-2 bg-[#1E222D] border border-[#2A2E39] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#F0F3FA] tracking-tight">
              Relative Currency Strength Barometer
            </h3>
            <span className="text-[10px] font-mono text-[#787B86]">Real-time Relative Momentum</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {currencyStrengths.map((cs) => (
              <div
                key={cs.currency}
                className="bg-[#131722] border border-[#2A2E39] rounded-lg p-2.5 flex flex-col items-center"
              >
                <div className="font-bold text-sm text-[#F0F3FA] mb-1">{cs.currency}</div>
                <div
                  className="w-full bg-[#1C202C] h-2 rounded-full overflow-hidden my-1"
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${cs.score * 10}%`,
                      backgroundColor: cs.color,
                    }}
                  />
                </div>
                <div className="text-[11px] font-mono text-[#787B86] mt-1">{cs.score} / 10</div>
                <div
                  className="text-[10px] font-bold uppercase mt-0.5"
                  style={{ color: cs.color }}
                >
                  {cs.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pip Calculator Widget */}
        <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-1.5 mb-2">
            <Calculator className="w-4 h-4 text-[#2962FF]" />
            <h3 className="text-sm font-bold text-[#F0F3FA] tracking-tight">
              FX Pip Calculator
            </h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div>
              <label className="text-[10px] text-[#787B86]">Select Currency Pair</label>
              <select
                value={calcPair}
                onChange={(e) => setCalcPair(e.target.value)}
                className="w-full bg-[#131722] border border-[#2A2E39] text-[#F0F3FA] px-2 py-1.5 rounded-md mt-0.5"
              >
                {fxAssets.map((a) => (
                  <option key={a.symbol} value={a.symbol}>
                    {a.displaySymbol} (${a.price.toFixed(4)})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#787B86]">Units / Lot Size</label>
                <input
                  type="number"
                  value={lotSize}
                  onChange={(e) => setLotSize(Number(e.target.value))}
                  className="w-full bg-[#131722] border border-[#2A2E39] text-[#F0F3FA] px-2 py-1.5 rounded-md mt-0.5"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#787B86]">Pip Movement</label>
                <input
                  type="number"
                  value={pipsMoved}
                  onChange={(e) => setPipsMoved(Number(e.target.value))}
                  className="w-full bg-[#131722] border border-[#2A2E39] text-[#F0F3FA] px-2 py-1.5 rounded-md mt-0.5"
                />
              </div>
            </div>

            <div className="bg-[#131722] p-2 rounded-lg border border-[#2A2E39] flex justify-between items-center mt-2">
              <span className="text-[#787B86]">Gain / Loss:</span>
              <span className="text-sm font-bold text-[#089981] tabular-nums">
                ${totalProfit.toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FX Rates Matrix Cards */}
      <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl p-4 shadow-xs">
        <h3 className="text-sm font-bold text-[#F0F3FA] mb-3 tracking-tight">
          Major & Cross Currency Rates
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {fxAssets.map((asset) => {
            const isPositive = asset.change >= 0;
            const spread = (Math.random() * 0.8 + 0.6).toFixed(1);
            return (
              <div
                key={asset.symbol}
                onClick={() => onSelectAsset(asset)}
                className="bg-[#131722] hover:bg-[#1A1F2C] border border-[#2A2E39] hover:border-[#363A45] rounded-xl p-3.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#1E222D] border border-[#2A2E39] flex items-center justify-center font-bold text-xs text-[#2962FF] font-mono">
                      FX
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#F0F3FA]">
                        {asset.displaySymbol}
                      </div>
                      <div className="text-[10px] text-[#787B86]">{asset.name}</div>
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

                <div className="my-3 flex items-baseline justify-between font-mono">
                  <div className="text-xl font-bold text-[#F0F3FA] tabular-nums">
                    {asset.price.toFixed(4)}
                  </div>
                  <div className="text-xs text-[#787B86]">
                    Spread: <strong className="text-[#dfe2f2]">{spread} pips</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-[#2A2E39]/50 text-[#787B86]">
                  <span>Bid: {(asset.price - 0.0001).toFixed(4)}</span>
                  <span>Ask: {(asset.price + 0.0001).toFixed(4)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
