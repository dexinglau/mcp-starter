import React from 'react';
import { NEWS_ITEMS, TRADE_IDEAS, ECONOMIC_EVENTS } from '../data/mockMarkets';
import { NewsItem, TradeIdea, EconomicEvent } from '../types/market';
import { Newspaper, Calendar, Lightbulb, ThumbsUp, MessageSquare, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

interface NewsAndIdeasSectionProps {
  onSelectSymbol: (symbol: string) => void;
}

export const NewsAndIdeasSection: React.FC<NewsAndIdeasSectionProps> = ({ onSelectSymbol }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      {/* 1. Market News Feed (4 cols) */}
      <div className="lg:col-span-4 bg-[#1E222D] border border-[#2A2E39] rounded-xl p-4 flex flex-col justify-between shadow-xs">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-[#2962FF]" />
              <h3 className="text-sm font-bold text-[#F0F3FA] tracking-tight">
                Live Market News
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#089981] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#089981] animate-ping" />
              Real-Time
            </span>
          </div>

          <div className="divide-y divide-[#2A2E39]/60">
            {NEWS_ITEMS.map((item) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 group">
                <div className="flex items-center gap-2 text-[10px] text-[#787B86] font-mono mb-1">
                  <span className="text-[#dfe2f2] font-semibold">{item.source}</span>
                  <span>·</span>
                  <span>{item.time}</span>
                  <span>·</span>
                  <span
                    className={`font-semibold ${
                      item.sentiment === 'bullish'
                        ? 'text-[#089981]'
                        : item.sentiment === 'bearish'
                        ? 'text-[#F23645]'
                        : 'text-[#787B86]'
                    }`}
                  >
                    {item.sentiment}
                  </span>
                </div>

                <a
                  href="#news"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-semibold text-[#F0F3FA] group-hover:text-[#2962FF] transition-colors line-clamp-2 leading-relaxed"
                >
                  {item.title}
                </a>

                <div className="flex items-center gap-1.5 mt-2">
                  {item.relatedSymbols.map((sym) => (
                    <button
                      key={sym}
                      onClick={() => onSelectSymbol(sym)}
                      className="px-1.5 py-0.5 text-[10px] font-mono bg-[#131722] hover:bg-[#2A2E39] text-[#787B86] hover:text-[#F0F3FA] rounded border border-[#2A2E39] transition-colors cursor-pointer"
                    >
                      ${sym}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 mt-2 border-t border-[#2A2E39] text-center">
          <span className="text-xs text-[#2962FF] font-medium hover:underline cursor-pointer">
            View All Financial Feeds →
          </span>
        </div>
      </div>

      {/* 2. Economic Calendar (3 cols) */}
      <div className="lg:col-span-3 bg-[#1E222D] border border-[#2A2E39] rounded-xl p-4 flex flex-col justify-between shadow-xs">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2962FF]" />
              <h3 className="text-sm font-bold text-[#F0F3FA] tracking-tight">
                Economic Calendar
              </h3>
            </div>
            <span className="text-[10px] text-[#787B86] font-mono">EDT Time</span>
          </div>

          <div className="space-y-2.5">
            {ECONOMIC_EVENTS.map((event) => (
              <div
                key={event.id}
                className="bg-[#131722] border border-[#2A2E39] rounded-lg p-2.5"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-[#787B86] mb-1">
                  <span className="flex items-center gap-1 text-[#dfe2f2]">
                    <span>{event.flag}</span>
                    <span className="font-semibold">{event.currency}</span>
                  </span>
                  <span>{event.time}</span>
                </div>

                <div className="text-xs font-semibold text-[#F0F3FA] mb-2 leading-tight">
                  {event.title}
                </div>

                <div className="grid grid-cols-3 gap-1 text-[10px] font-mono bg-[#0C0D10] p-1.5 rounded border border-[#2A2E39]/60 text-center">
                  <div>
                    <div className="text-[#787B86]">Act</div>
                    <div className="text-[#089981] font-bold">{event.actual}</div>
                  </div>
                  <div>
                    <div className="text-[#787B86]">Fcst</div>
                    <div className="text-[#dfe2f2]">{event.forecast}</div>
                  </div>
                  <div>
                    <div className="text-[#787B86]">Prev</div>
                    <div className="text-[#787B86]">{event.previous}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 mt-2 border-t border-[#2A2E39] text-center">
          <span className="text-xs text-[#2962FF] font-medium hover:underline cursor-pointer">
            Full Economic Schedule →
          </span>
        </div>
      </div>

      {/* 3. Community Trade Ideas (5 cols) */}
      <div className="lg:col-span-5 bg-[#1E222D] border border-[#2A2E39] rounded-xl p-4 flex flex-col justify-between shadow-xs">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#f7b928]" />
              <h3 className="text-sm font-bold text-[#F0F3FA] tracking-tight">
                Community Trade Ideas
              </h3>
            </div>
            <span className="text-[10px] text-[#787B86] font-mono">Top Analysts</span>
          </div>

          <div className="space-y-3">
            {TRADE_IDEAS.map((idea) => {
              const isLong = idea.direction === 'long';
              return (
                <div
                  key={idea.id}
                  className="bg-[#131722] border border-[#2A2E39] rounded-lg p-3 hover:border-[#363A45] transition-all"
                >
                  {/* Author Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#2962FF]/20 text-[#2962FF] border border-[#2962FF]/40 flex items-center justify-center text-[10px] font-bold">
                        {idea.author.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#dfe2f2]">
                          {idea.author.name}
                        </span>
                        <span className="text-[10px] text-[#787B86] ml-1.5 font-mono">
                          {idea.publishedAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectSymbol(idea.symbol)}
                        className="font-mono text-xs font-bold text-[#2962FF] hover:underline cursor-pointer"
                      >
                        {idea.symbol}
                      </button>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase font-mono ${
                          isLong
                            ? 'bg-[#089981]/15 text-[#089981]'
                            : 'bg-[#F23645]/15 text-[#F23645]'
                        }`}
                      >
                        {idea.direction}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="text-xs font-semibold text-[#F0F3FA] mb-1">
                    {idea.title}
                  </div>
                  <p className="text-[11px] text-[#787B86] line-clamp-2 leading-relaxed mb-2.5">
                    {idea.description}
                  </p>

                  {/* Footer Boosts & Timeframe */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#787B86] pt-2 border-t border-[#2A2E39]/40">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[#089981]">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{idea.boosts} boosts</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{idea.comments}</span>
                      </span>
                    </div>
                    <span className="bg-[#1E222D] px-1.5 py-0.5 rounded text-[10px] border border-[#2A2E39]">
                      TF: {idea.timeframe}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 mt-2 border-t border-[#2A2E39] text-center">
          <span className="text-xs text-[#2962FF] font-medium hover:underline cursor-pointer">
            Explore 10,000+ Trade Ideas →
          </span>
        </div>
      </div>
    </div>
  );
};
