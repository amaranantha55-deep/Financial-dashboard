import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 py-3 px-4 max-w-3xl animate-fadeIn">
      {/* Bot Avatar */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 text-slate-950">
        <Bot className="w-4 h-4 text-slate-950 stroke-[2.5]" />
      </div>

      {/* Bubble */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md">
        <div className="flex items-center gap-2">
          <div className="flex gap-1 items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 ml-1.5">
            <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" />
            FinBot is crunching financial data...
          </span>
        </div>
      </div>
    </div>
  );
};

