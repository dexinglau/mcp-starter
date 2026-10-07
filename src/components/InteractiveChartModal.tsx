import React, { useState, useMemo } from 'react';
import { MarketAsset, PricePoint } from '../types/market';
import { TechnicalGauge } from './TechnicalGauge';
import { X, Star, Maximize2, Share2, Layers, Sliders, ChevronDown, Check, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

interface InteractiveChartModalProps {
  asset: MarketAsset;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
  onExecuteTrade: (params: {
    symbol: string;
    name: string;
    type: 'BUY' | 'SELL';
    shares: number;
    price: number;
  }) => void;
}

export const InteractiveChartModal: React.FC<InteractiveChartModalProps> = ({
  asset,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onExecuteTrade,
}) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1M' | '1Y'>('1M');
  const [chartType, setChartType] = useState<'candle' | 'line'>('candle');
  const [showVolume, setShowVolume] = useState(true);
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(false);
  const [showRSI, setShowRSI] = useState(true);

  // Hover crosshair point
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Paper Trade Order State
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderQuantity, setOrderQuantity] = useState<number>(10);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  // Active candle series
  const candles: PricePoint[] = useMemo(() => {
    if (asset.history && asset.history[timeframe]) {
      return asset.history[timeframe];
    }
    // Fallback: generate if missing
    return [];
  }, [asset, timeframe]);

  // Active hovered candle or current latest
  const activeCandle = hoveredIndex !== null && candles[hoveredIndex]
    ? candles[hoveredIndex]
    : candles[candles.length - 1];

  // Moving average calculators
  const sma20 = useMemo(() => {
    return candles.map((_, i) => {
      if (i < 19) return null;
      const slice = candles.slice(i - 19, i + 1);
      const sum = slice.reduce((acc, c) => acc + c.close, 0);
      return sum / 20;
    });
  }, [candles]);

  const sma50 = useMemo(() => {
    return candles.map((_, i) => {
      if (i < 49) return null;
      const slice = candles.slice(i - 49, i + 1);
      const sum = slice.reduce((acc, c) => acc + c.close, 0);
      return sum / 50;
    });
  }, [candles]);

  // RSI 14 calculator
  const rsi14 = useMemo(() => {
    if (candles.length < 15) return [];
    const rsiValues: (number | null)[] = [null];
    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= 14; i++) {
      const diff = candles[i].close - candles[i - 1].close;
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }
    let avgGain = gains / 14;
    let avgLoss = losses / 14;

    for (let i = 14; i < candles.length; i++) {
      if (i > 14) {
        const diff = candles[i].close - candles[i - 1].close;
        const currentGain = diff > 0 ? diff : 0;
        const currentLoss = diff < 0 ? -diff : 0;
        avgGain = (avgGain * 13 + currentGain) / 14;
        avgLoss = (avgLoss * 13 + currentLoss) / 14;
      }
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsi = 100 - 100 / (1 + rs);
      rsiValues[i] = Math.round(rsi);
    }
    return rsiValues;
  }, [candles]);

  // Dimension helpers for SVG chart rendering
  const chartWidth = 720;
  const chartHeight = 260;
  const rsiHeight = 70;
  const maxPrice = Math.max(...candles.map((c) => c.high), 1);
  const minPrice = Math.min(...candles.map((c) => c.low), 0);
  const priceRange = maxPrice - minPrice || 1;

  const maxVol = Math.max(...candles.map((c) => c.volume), 1);

  const getY = (val: number) => {
    return chartHeight - ((val - minPrice) / priceRange) * (chartHeight - 30) - 15;
  };

  const isPositive = asset.change >= 0;

  const handleExecuteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderQuantity <= 0) return;
    onExecuteTrade({
      symbol: asset.symbol,
      name: asset.name,
      type: orderType,
      shares: orderQuantity,
      price: asset.price,
    });
    setOrderSuccessMsg(
      `Order filled: ${orderType} ${orderQuantity} shares of ${asset.symbol} @ $${asset.price.toFixed(2)}`
    );
    setTimeout(() => setOrderSuccessMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#131722] border border-[#2A2E39] rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header Bar */}
        <div className="p-4 border-b border-[#2A2E39] flex flex-wrap items-center justify-between gap-3 bg-[#171B26]">
          {/* Symbol & Price Overview */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#1E222D] border border-[#2A2E39] flex items-center justify-center font-bold text-sm text-[#2962FF]">
                {asset.symbol.slice(0, 3)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-[#F0F3FA] font-sans">
                    {asset.displaySymbol}
                  </span>
                  <span className="text-xs text-[#787B86] font-mono uppercase bg-[#1E222D] px-1.5 py-0.5 rounded border border-[#2A2E39]">
                    {asset.exchange}
                  </span>
                  {asset.sector && (
                    <span className="text-xs text-[#787B86] hidden sm:inline">
                      · {asset.sector}
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#787B86] truncate max-w-xs">{asset.name}</div>
              </div>
            </div>

            {/* Price Readout */}
            <div className="flex items-baseline gap-2.5 font-mono pl-3 border-l border-[#2A2E39]">
              <span className="text-2xl font-bold tracking-tight text-[#F0F3FA] tabular-nums">
                {asset.price < 5 ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded tabular-nums ${
                  isPositive ? 'text-[#089981] bg-[#089981]/12' : 'text-[#F23645] bg-[#F23645]/12'
                }`}
              >
                {isPositive ? '+' : ''}
                {asset.change.toFixed(2)} ({isPositive ? '+' : ''}
                {asset.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(asset.symbol)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
                isWatchlisted
                  ? 'bg-[#f7b928]/10 border-[#f7b928]/30 text-[#f7b928]'
                  : 'bg-[#1E222D] border-[#2A2E39] text-[#787B86] hover:text-[#F0F3FA]'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-[#f7b928]' : ''}`} />
              <span className="hidden sm:inline">{isWatchlisted ? 'Watchlisted' : 'Add Watchlist'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#1E222D] hover:bg-[#262A35] text-[#787B86] hover:text-[#F0F3FA] border border-[#2A2E39] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left Chart & Right Controls */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#2A2E39]">
          {/* Main Chart Column (8 cols) */}
          <div className="lg:col-span-8 p-4 flex flex-col justify-between">
            {/* Chart Toolbar Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-[#2A2E39]">
              {/* Timeframes */}
              <div className="flex items-center bg-[#1E222D] p-0.5 rounded-lg border border-[#2A2E39]">
                {(['1D', '1M', '1Y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      timeframe === tf
                        ? 'bg-[#2962FF] text-white shadow-xs'
                        : 'text-[#787B86] hover:text-[#F0F3FA]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Chart type & indicators */}
              <div className="flex items-center gap-1.5 text-xs">
                {/* Candle vs Line */}
                <div className="flex items-center bg-[#1E222D] p-0.5 rounded-lg border border-[#2A2E39]">
                  <button
                    onClick={() => setChartType('candle')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      chartType === 'candle'
                        ? 'bg-[#131722] text-[#F0F3FA] border border-[#363A45]'
                        : 'text-[#787B86] hover:text-[#F0F3FA]'
                    }`}
                  >
                    Candles
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      chartType === 'line'
                        ? 'bg-[#131722] text-[#F0F3FA] border border-[#363A45]'
                        : 'text-[#787B86] hover:text-[#F0F3FA]'
                    }`}
                  >
                    Area
                  </button>
                </div>

                {/* Overlays Toggle */}
                <button
                  onClick={() => setShowSMA20(!showSMA20)}
                  className={`px-2 py-1 rounded-md border text-[11px] font-mono cursor-pointer transition-colors ${
                    showSMA20
                      ? 'bg-[#f7b928]/10 text-[#f7b928] border-[#f7b928]/40'
                      : 'bg-[#1E222D] text-[#787B86] border-[#2A2E39]'
                  }`}
                >
                  SMA 20
                </button>

                <button
                  onClick={() => setShowSMA50(!showSMA50)}
                  className={`px-2 py-1 rounded-md border text-[11px] font-mono cursor-pointer transition-colors ${
                    showSMA50
                      ? 'bg-[#2962FF]/10 text-[#2962FF] border-[#2962FF]/40'
                      : 'bg-[#1E222D] text-[#787B86] border-[#2A2E39]'
                  }`}
                >
                  SMA 50
                </button>

                <button
                  onClick={() => setShowRSI(!showRSI)}
                  className={`px-2 py-1 rounded-md border text-[11px] font-mono cursor-pointer transition-colors ${
                    showRSI
                      ? 'bg-[#9333ea]/10 text-[#c084fc] border-[#9333ea]/40'
                      : 'bg-[#1E222D] text-[#787B86] border-[#2A2E39]'
                  }`}
                >
                  RSI
                </button>
              </div>
            </div>

            {/* TradingView HUD Legend (O, H, L, C, Vol) */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#787B86] bg-[#1E222D]/60 p-2 rounded-md mb-2">
              <span className="text-[#F0F3FA] font-semibold">{activeCandle?.time || 'Live'}</span>
              <span>
                O: <strong className="text-[#dfe2f2]">{activeCandle?.open.toFixed(2)}</strong>
              </span>
              <span>
                H: <strong className="text-[#089981]">{activeCandle?.high.toFixed(2)}</strong>
              </span>
              <span>
                L: <strong className="text-[#F23645]">{activeCandle?.low.toFixed(2)}</strong>
              </span>
              <span>
                C: <strong className="text-[#dfe2f2]">{activeCandle?.close.toFixed(2)}</strong>
              </span>
              <span>
                Vol: <strong className="text-[#c3c5d8]">{(activeCandle?.volume / 1000).toFixed(0)}k</strong>
              </span>
              {showSMA20 && sma20[candles.length - 1] && (
                <span className="text-[#f7b928]">
                  SMA20: {sma20[candles.length - 1]?.toFixed(2)}
                </span>
              )}
            </div>

            {/* Interactive SVG Chart Container */}
            <div
              className="relative w-full bg-[#0C0D10] border border-[#2A2E39] rounded-xl p-3 overflow-hidden select-none cursor-crosshair"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-64 overflow-visible"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const mouseX = e.clientX - rect.left;
                  const ratio = mouseX / rect.width;
                  const index = Math.min(
                    candles.length - 1,
                    Math.max(0, Math.floor(ratio * candles.length))
                  );
                  setHoveredIndex(index);
                }}
              >
                {/* Horizontal Grid lines */}
                {[0.2, 0.4, 0.6, 0.8].map((pct, i) => {
                  const y = chartHeight * pct;
                  const priceLabel = maxPrice - pct * priceRange;
                  return (
                    <g key={i}>
                      <line
                        x1="0"
                        y1={y}
                        x2={chartWidth}
                        y2={y}
                        stroke="#2A2E39"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text
                        x={chartWidth - 5}
                        y={y - 4}
                        fill="#50535E"
                        fontSize="9"
                        textAnchor="end"
                        fontFamily="JetBrains Mono"
                      >
                        {priceLabel.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                {/* Volume Bars at bottom */}
                {showVolume &&
                  candles.map((c, i) => {
                    const barWidth = Math.max(3, chartWidth / candles.length - 3);
                    const x = (i / (candles.length - 1)) * (chartWidth - 30) + 15;
                    const vHeight = (c.volume / maxVol) * 45;
                    const isBull = c.close >= c.open;
                    return (
                      <rect
                        key={`vol-${i}`}
                        x={x - barWidth / 2}
                        y={chartHeight - vHeight}
                        width={barWidth}
                        height={vHeight}
                        fill={isBull ? '#089981' : '#F23645'}
                        opacity="0.25"
                      />
                    );
                  })}

                {/* Candlesticks or Area Line */}
                {chartType === 'candle' ? (
                  candles.map((c, i) => {
                    const x = (i / (candles.length - 1)) * (chartWidth - 30) + 15;
                    const isBull = c.close >= c.open;
                    const candleColor = isBull ? '#089981' : '#F23645';
                    const yOpen = getY(c.open);
                    const yClose = getY(c.close);
                    const yHigh = getY(c.high);
                    const yLow = getY(c.low);
                    const top = Math.min(yOpen, yClose);
                    const height = Math.max(2, Math.abs(yClose - yOpen));
                    const candleWidth = Math.max(4, chartWidth / candles.length - 4);

                    return (
                      <g key={`candle-${i}`}>
                        {/* Upper & Lower Wick */}
                        <line
                          x1={x}
                          y1={yHigh}
                          x2={x}
                          y2={yLow}
                          stroke={candleColor}
                          strokeWidth="1.2"
                        />
                        {/* Real Body */}
                        <rect
                          x={x - candleWidth / 2}
                          y={top}
                          width={candleWidth}
                          height={height}
                          fill={candleColor}
                          rx="1"
                        />
                      </g>
                    );
                  })
                ) : (
                  // Area line
                  (() => {
                    const points = candles.map((c, i) => ({
                      x: (i / (candles.length - 1)) * (chartWidth - 30) + 15,
                      y: getY(c.close),
                    }));
                    const polylineStr = points.map((p) => `${p.x},${p.y}`).join(' ');
                    const areaStr = `M ${points[0].x},${points[0].y} ` +
                      points.map((p) => `L ${p.x},${p.y}`).join(' ') +
                      ` L ${points[points.length - 1].x},${chartHeight} L ${points[0].x},${chartHeight} Z`;

                    return (
                      <g>
                        <defs>
                          <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2962FF" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#2962FF" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d={areaStr} fill="url(#chartAreaGrad)" />
                        <polyline
                          fill="none"
                          stroke="#2962FF"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={polylineStr}
                        />
                      </g>
                    );
                  })()
                )}

                {/* SMA 20 Overlay (Yellow line) */}
                {showSMA20 && (() => {
                  const validPoints: string[] = [];
                  sma20.forEach((val, i) => {
                    if (val !== null) {
                      const x = (i / (candles.length - 1)) * (chartWidth - 30) + 15;
                      const y = getY(val);
                      validPoints.push(`${x},${y}`);
                    }
                  });
                  return validPoints.length > 1 ? (
                    <polyline
                      fill="none"
                      stroke="#f7b928"
                      strokeWidth="1.5"
                      points={validPoints.join(' ')}
                    />
                  ) : null;
                })()}

                {/* Crosshair indicator */}
                {hoveredIndex !== null && (() => {
                  const x = (hoveredIndex / (candles.length - 1)) * (chartWidth - 30) + 15;
                  const c = candles[hoveredIndex];
                  const y = getY(c.close);
                  return (
                    <g>
                      <line
                        x1={x}
                        y1="0"
                        x2={x}
                        y2={chartHeight}
                        stroke="#8d90a2"
                        strokeDasharray="2 2"
                        strokeWidth="1"
                      />
                      <line
                        x1="0"
                        y1={y}
                        x2={chartWidth}
                        y2={y}
                        stroke="#8d90a2"
                        strokeDasharray="2 2"
                        strokeWidth="1"
                      />
                      <circle cx={x} cy={y} r="4" fill="#2962FF" stroke="#F0F3FA" strokeWidth="1.5" />
                    </g>
                  );
                })()}
              </svg>

              {/* Sub-Pane: RSI (14) */}
              {showRSI && (
                <div className="mt-2 pt-2 border-t border-[#2A2E39]">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#c084fc] mb-1">
                    <span>RSI (14) · {rsi14[hoveredIndex ?? (rsi14.length - 1)] ?? 54}</span>
                    <span className="text-[#787B86]">Oversold (30) / Overbought (70)</span>
                  </div>
                  <div className="h-14 w-full">
                    <svg viewBox={`0 0 ${chartWidth} ${rsiHeight}`} className="w-full h-full">
                      {/* Overbought line 70 */}
                      <line
                        x1="0"
                        y1={rsiHeight * 0.3}
                        x2={chartWidth}
                        y2={rsiHeight * 0.3}
                        stroke="#F23645"
                        strokeDasharray="2 2"
                        strokeWidth="1"
                        opacity="0.4"
                      />
                      {/* Oversold line 30 */}
                      <line
                        x1="0"
                        y1={rsiHeight * 0.7}
                        x2={chartWidth}
                        y2={rsiHeight * 0.7}
                        stroke="#089981"
                        strokeDasharray="2 2"
                        strokeWidth="1"
                        opacity="0.4"
                      />
                      {/* RSI Line */}
                      {(() => {
                        const rsiPoints: string[] = [];
                        rsi14.forEach((val, i) => {
                          if (val !== null) {
                            const x = (i / (candles.length - 1)) * (chartWidth - 30) + 15;
                            const y = rsiHeight - (val / 100) * rsiHeight;
                            rsiPoints.push(`${x},${y}`);
                          }
                        });
                        return (
                          <polyline
                            fill="none"
                            stroke="#c084fc"
                            strokeWidth="1.5"
                            points={rsiPoints.join(' ')}
                          />
                        );
                      })()}
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Key Statistics Grid */}
            <div className="mt-4 pt-3 border-t border-[#2A2E39]">
              <div className="text-xs font-semibold text-[#F0F3FA] mb-2 font-sans">
                Fundamental & Trading Metrics
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="bg-[#171B26] p-2.5 rounded-lg border border-[#2A2E39]/80">
                  <div className="text-[#787B86] text-[10px]">Market Cap</div>
                  <div className="font-semibold text-[#F0F3FA] mt-0.5">{asset.marketCap || '—'}</div>
                </div>
                <div className="bg-[#171B26] p-2.5 rounded-lg border border-[#2A2E39]/80">
                  <div className="text-[#787B86] text-[10px]">P/E Ratio</div>
                  <div className="font-semibold text-[#F0F3FA] mt-0.5">{asset.peRatio ? asset.peRatio.toFixed(1) : '—'}</div>
                </div>
                <div className="bg-[#171B26] p-2.5 rounded-lg border border-[#2A2E39]/80">
                  <div className="text-[#787B86] text-[10px]">52-Week Range</div>
                  <div className="font-semibold text-[#F0F3FA] mt-0.5">${asset.low52w.toFixed(1)} - ${asset.high52w.toFixed(1)}</div>
                </div>
                <div className="bg-[#171B26] p-2.5 rounded-lg border border-[#2A2E39]/80">
                  <div className="text-[#787B86] text-[10px]">Dividend Yield</div>
                  <div className="font-semibold text-[#F0F3FA] mt-0.5">{asset.dividendYield || '—'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Technical Gauge & Paper Trading (4 cols) */}
          <div className="lg:col-span-4 p-4 flex flex-col justify-between gap-4 bg-[#171B26]/50">
            {/* Technical Gauge */}
            <TechnicalGauge
              score={asset.technicalScore}
              rating={asset.rating}
              symbol={asset.symbol}
            />

            {/* Paper Trading Ticket */}
            <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#F0F3FA] tracking-tight">
                  Paper Trading Order
                </span>
                <span className="text-[10px] font-mono text-[#089981] bg-[#089981]/10 px-1.5 py-0.5 rounded border border-[#089981]/30">
                  Simulated Execution
                </span>
              </div>

              {/* Order Type Toggle: Buy / Sell */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#131722] rounded-lg border border-[#2A2E39] mb-3">
                <button
                  type="button"
                  onClick={() => setOrderType('BUY')}
                  className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    orderType === 'BUY'
                      ? 'bg-[#089981] text-white shadow-xs'
                      : 'text-[#787B86] hover:text-[#F0F3FA]'
                  }`}
                >
                  BUY (Long)
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('SELL')}
                  className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    orderType === 'SELL'
                      ? 'bg-[#F23645] text-white shadow-xs'
                      : 'text-[#787B86] hover:text-[#F0F3FA]'
                  }`}
                >
                  SELL (Short)
                </button>
              </div>

              {/* Quantity Selector */}
              <form onSubmit={handleExecuteOrder} className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-[#787B86] font-mono mb-1">
                    <span>Shares / Units:</span>
                    <span>Market: ${asset.price.toFixed(2)}</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#131722] border border-[#2A2E39] text-[#F0F3FA] text-sm font-mono px-3 py-2 rounded-lg focus:outline-none focus:border-[#2962FF]"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5">
                  {[5, 10, 25, 50, 100].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setOrderQuantity(qty)}
                      className={`flex-1 py-1 text-[11px] font-mono rounded border transition-colors cursor-pointer ${
                        orderQuantity === qty
                          ? 'bg-[#2962FF] text-white border-[#2962FF]'
                          : 'bg-[#131722] text-[#787B86] border-[#2A2E39] hover:text-[#F0F3FA]'
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </div>

                {/* Estimated Total */}
                <div className="bg-[#131722] p-2.5 rounded-lg border border-[#2A2E39] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#787B86]">Estimated Total:</span>
                  <span className="text-sm font-bold text-[#F0F3FA] tabular-nums">
                    ${(orderQuantity * asset.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer ${
                    orderType === 'BUY'
                      ? 'bg-[#089981] hover:bg-[#077d69] text-white'
                      : 'bg-[#F23645] hover:bg-[#c92432] text-white'
                  }`}
                >
                  Place {orderType} Order
                </button>

                {orderSuccessMsg && (
                  <div className="bg-[#089981]/15 text-[#089981] border border-[#089981]/40 text-xs p-2.5 rounded-lg font-mono flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>{orderSuccessMsg}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
