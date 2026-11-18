import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { Sparkles } from 'lucide-react';

interface FollowUpChipsProps {
  suggestions?: string[];
}

export const FollowUpChips: React.FC<FollowUpChipsProps> = ({ suggestions }) => {
  const { sendMessage } = useFinancial();

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="mt-3.5 pt-2 border-t border-slate-800/60">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-2">
        <Sparkles className="w-3 h-3 text-emerald-400" />
        <span>Suggested Follow-ups:</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => sendMessage(suggestion)}
            className="text-left text-xs bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 rounded-full px-3 py-1.5 transition-all duration-150 active:scale-95 flex items-center gap-1.5 shadow-sm"
          >
            <span>{suggestion}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

