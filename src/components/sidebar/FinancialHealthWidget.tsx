import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { ShieldCheck, DollarSign, Wallet } from 'lucide-react';
import { Badge } from '../ui/badge';

export const FinancialHealthWidget: React.FC = () => {
  const { dashboard, setCurrency } = useFinancial();

  const currencies = [
    { symbol: '$', label: 'USD' },
    { symbol: '₹', label: 'INR' },
    { symbol: '€', label: 'EUR' },
    { symbol: '£', label: 'GBP' },
  ];

  return (
    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">Financial Health</span>
        </div>
        <Badge variant="success" className="text-[10px] px-1.5 py-0">
          Tier A
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-left">
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
          <div className="text-[10px] text-slate-400">Credit Score</div>
          <div className="text-sm font-bold text-emerald-400 mt-0.5">
            {dashboard.creditScore}
            <span className="text-[10px] text-slate-400 font-normal ml-1">/ 850</span>
          </div>
        </div>

        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
          <div className="text-[10px] text-slate-400">Cash Runway</div>
          <div className="text-sm font-bold text-sky-400 mt-0.5">
            {dashboard.emergencyMonthsRunway}
            <span className="text-[10px] text-slate-400 font-normal ml-1">mos</span>
          </div>
        </div>
      </div>

      {/* Currency Selector */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <Wallet className="w-3 h-3 text-slate-400" />
          Currency
        </span>
        <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
          {currencies.map(c => (
            <button
              key={c.symbol}
              onClick={() => setCurrency(c.symbol)}
              className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded ${
                dashboard.currency === c.symbol
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {c.symbol}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

