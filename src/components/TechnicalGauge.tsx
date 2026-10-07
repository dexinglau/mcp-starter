import React from 'react';

interface TechnicalGaugeProps {
  score: number; // 0 - 100
  rating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  symbol?: string;
}

export const TechnicalGauge: React.FC<TechnicalGaugeProps> = ({ score, rating, symbol }) => {
  // Angle from -90 deg (Strong Sell) to +90 deg (Strong Buy)
  // score 0 -> -90, score 50 -> 0, score 100 -> +90
  const angle = (score / 100) * 180 - 90;

  // Rating color
  const getRatingColor = () => {
    switch (rating) {
      case 'Strong Buy':
      case 'Buy':
        return '#089981';
      case 'Neutral':
        return '#787B86';
      case 'Sell':
      case 'Strong Sell':
        return '#F23645';
      default:
        return '#2962FF';
    }
  };

  // Realistic sub-breakdowns based on score
  const maBuy = Math.min(15, Math.round((score / 100) * 15));
  const maSell = Math.max(0, 15 - maBuy - (score > 40 && score < 60 ? 2 : 1));
  const maNeutral = 15 - maBuy - maSell;

  const oscBuy = Math.min(11, Math.round((score / 100) * 8));
  const oscNeutral = Math.max(2, 11 - oscBuy - (score < 40 ? 4 : 2));
  const oscSell = Math.max(0, 11 - oscBuy - oscNeutral);

  return (
    <div className="bg-[#1E222D] border border-[#2A2E39] rounded-xl p-4 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#F0F3FA] tracking-wide">
          Technical Analysis {symbol ? `· ${symbol}` : ''}
        </span>
        <span className="text-[10px] text-[#787B86] font-mono">1D Interval</span>
      </div>

      {/* Speedometer Gauge SVG */}
      <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
          {/* Background Arc Segments */}
          {/* Strong Sell (Dark Red) */}
          <path
            d="M 20 100 A 80 80 0 0 1 43.4 43.4"
            fill="none"
            stroke="#93000a"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Sell (Red) */}
          <path
            d="M 45 40 A 80 80 0 0 1 85 22"
            fill="none"
            stroke="#F23645"
            strokeWidth="12"
          />
          {/* Neutral (Grey) */}
          <path
            d="M 87 21 A 80 80 0 0 1 113 21"
            fill="none"
            stroke="#787B86"
            strokeWidth="12"
          />
          {/* Buy (Light Green) */}
          <path
            d="M 115 22 A 80 80 0 0 1 155 40"
            fill="none"
            stroke="#20A28A"
            strokeWidth="12"
          />
          {/* Strong Buy (Emerald Green) */}
          <path
            d="M 156.6 43.4 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#089981"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Pivot Center Point */}
          <circle cx="100" cy="100" r="7" fill="#F0F3FA" />
          <circle cx="100" cy="100" r="3" fill="#1E222D" />

          {/* Needle */}
          <g transform={`rotate(${angle}, 100, 100)`}>
            <polygon points="98,100 102,100 100,24" fill="#F0F3FA" />
          </g>
        </svg>
      </div>

      {/* Current Rating Label */}
      <div className="mt-2 text-center">
        <span
          className="text-sm font-bold tracking-tight font-sans"
          style={{ color: getRatingColor() }}
        >
          {rating.toUpperCase()}
        </span>
        <div className="text-[11px] text-[#787B86] mt-0.5 font-mono">
          Score: {score}/100
        </div>
      </div>

      {/* Sub-meters: Oscillators & Moving Averages */}
      <div className="w-full grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#2A2E39] text-[11px] font-mono">
        <div className="bg-[#131722] p-2 rounded-lg border border-[#2A2E39]/70 text-center">
          <div className="text-[#787B86] text-[10px] uppercase font-sans font-medium mb-1">
            Oscillators
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#089981]">{oscBuy} Buy</span>
            <span className="text-[#787B86]">{oscNeutral} Neu</span>
            <span className="text-[#F23645]">{oscSell} Sell</span>
          </div>
        </div>

        <div className="bg-[#131722] p-2 rounded-lg border border-[#2A2E39]/70 text-center">
          <div className="text-[#787B86] text-[10px] uppercase font-sans font-medium mb-1">
            Moving Averages
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#089981]">{maBuy} Buy</span>
            <span className="text-[#787B86]">{maNeutral} Neu</span>
            <span className="text-[#F23645]">{maSell} Sell</span>
          </div>
        </div>
      </div>
    </div>
  );
};
