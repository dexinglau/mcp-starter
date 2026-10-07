import React from 'react';
import { PaperTradePosition } from '../types/market';
import { X, Briefcase, RefreshCw, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface PortfolioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  positions: PaperTradePosition[];
  cashBalance: number;
  onClosePosition: (id: string) => void;
  onResetPortfolio: () => void;
}

export const PortfolioDrawer: React.FC<PortfolioDrawerProps> = ({
  isOpen,
  onClose,
  positions,
  cashBalance,
  onClosePosition,
  onResetPortfolio,
}) => {
  if (!isOpen) return null;

  // Calculate totals
  const totalInvested = positions.reduce((sum, p) => sum + p.currentValue, 0);
  const totalPortfolioValue = cashBalance + totalInvested;
  const totalUnrealizedPnl = positions.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="w-full max-w-lg bg-[#131722] border-l border-[#2A2E39] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#2A2E39] flex items-center justify-between bg-[#171B26]">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#2962FF]" />
            <h2 className="text-sm font-bold text-[#F0F3FA] tracking-tight">
              Paper Trading Portfolio
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onResetPortfolio}
              className="px-2.5 py-1 text-xs bg-[#1E222D] hover:bg-[#2A2E39] text-[#787B86] hover:text-[#F0F3FA] border border-[#2A2E39] rounded-md transition-colors cursor-pointer flex items-center gap-1"
              title="Reset portfolio to $100,000"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#787B86] hover:text-[#F0F3FA] hover:bg-[#1E222D] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Portfolio Stats Card */}
        <div className="p-4 bg-[#0C0D10] border-b border-[#2A2E39] grid grid-cols-2 gap-3 font-mono">
          <div className="bg-[#171B26] p-3 rounded-xl border border-[#2A2E39]">
            <div className="text-[10px] text-[#787B86] uppercase">Total Equity</div>
            <div className="text-base font-bold text-[#F0F3FA] mt-1 tabular-nums">
              ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div
              className={`text-[11px] font-semibold flex items-center gap-1 mt-0.5 ${
                totalUnrealizedPnl >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
              }`}
            >
              {totalUnrealizedPnl >= 0 ? '+' : ''}${totalUnrealizedPnl.toFixed(2)} P&L
            </div>
          </div>

          <div className="bg-[#171B26] p-3 rounded-xl border border-[#2A2E39]">
            <div className="text-[10px] text-[#787B86] uppercase">Available Cash</div>
            <div className="text-base font-bold text-[#F0F3FA] mt-1 tabular-nums">
              ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-[#787B86] mt-0.5">
              {positions.length} Open Position{positions.length === 1 ? '' : 's'}
            </div>
          </div>
        </div>

        {/* Open Positions List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#2A2E39]/50">
          {positions.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#787B86] flex flex-col items-center justify-center h-48">
              <Briefcase className="w-8 h-8 text-[#363A45] mb-2" />
              <span>No open positions.</span>
              <p className="mt-1 text-[#50535E]">
                Open any asset chart or click "Trade" in the screener to place orders.
              </p>
            </div>
          ) : (
            positions.map((pos) => {
              const isProfit = pos.pnl >= 0;
              return (
                <div key={pos.id} className="p-4 hover:bg-[#1E222D]/60 transition-colors font-mono">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#F0F3FA]">{pos.symbol}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            pos.type === 'BUY'
                              ? 'bg-[#089981]/15 text-[#089981]'
                              : 'bg-[#F23645]/15 text-[#F23645]'
                          }`}
                        >
                          {pos.type}
                        </span>
                        <span className="text-xs text-[#787B86]">{pos.shares} shs</span>
                      </div>
                      <div className="text-xs text-[#787B86] mt-0.5">
                        Avg: ${pos.entryPrice.toFixed(2)} · Last: ${pos.currentPrice.toFixed(2)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-sm font-bold tabular-nums ${
                          isProfit ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isProfit ? '+' : ''}${pos.pnl.toFixed(2)}
                      </div>
                      <div
                        className={`text-[11px] tabular-nums ${
                          isProfit ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isProfit ? '+' : ''}{pos.pnlPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#2A2E39]/40">
                    <span className="text-[#787B86]">
                      Value: ${pos.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={() => onClosePosition(pos.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-[#2A2E39] hover:bg-[#F23645] hover:text-white text-[#F0F3FA] rounded transition-colors cursor-pointer"
                    >
                      Close Position
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0C0D10] border-t border-[#2A2E39] text-center text-[11px] text-[#787B86] font-mono">
          Virtual trading environment for strategy evaluation
        </div>
      </div>
    </div>
  );
};
