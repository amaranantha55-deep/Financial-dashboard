import React from 'react';
import { BudgetBreakdown } from '../../types/finance';
import { useFinancial } from '../../context/FinancialContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { formatCurrency } from '../../lib/utils';
import { exportBudgetCSV } from '../../lib/exportUtils';
import { PieChart, Home, Coffee, ShieldCheck, ArrowRight, Download } from 'lucide-react';

interface BudgetCardProps {
  data: BudgetBreakdown;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ data }) => {
  const { dashboard, updateDashboard, sendMessage } = useFinancial();
  const currency = dashboard.currency;

  const handleSyncToDashboard = () => {
    updateDashboard({ budget: data, monthlyIncome: data.income });
  };

  return (
    <Card className="mt-3 border-slate-700/80 bg-slate-900/90 shadow-lg overflow-hidden">
      <CardHeader className="p-4 pb-2 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-white">
                50 / 30 / 20 Budget Plan
              </CardTitle>
              <div className="text-[11px] text-slate-400">
                Monthly Net Income: <span className="font-semibold text-emerald-400">{formatCurrency(data.income, currency)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => exportBudgetCSV(data, currency)}
              title="Download Budget as CSV"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <Badge variant="success" className="text-[11px]">
              Balanced
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Progress bar split */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Allocation Distribution</span>
            <span className="text-slate-400 text-[11px]">100% of income</span>
          </div>
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-800 p-0.5 gap-0.5">
            <div 
              style={{ width: `${data.needs.percentage}%` }} 
              className="bg-blue-500 rounded-l-full transition-all duration-500"
              title={`Needs: ${data.needs.percentage}%`}
            />
            <div 
              style={{ width: `${data.wants.percentage}%` }} 
              className="bg-amber-500 transition-all duration-500"
              title={`Wants: ${data.wants.percentage}%`}
            />
            <div 
              style={{ width: `${data.savings.percentage}%` }} 
              className="bg-emerald-500 rounded-r-full transition-all duration-500"
              title={`Savings: ${data.savings.percentage}%`}
            />
          </div>
        </div>

        {/* 3 Pillar Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Needs */}
          <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-500/20">
            <div className="flex items-center justify-between text-blue-400 text-xs font-semibold mb-1">
              <span className="flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                Needs (50%)
              </span>
            </div>
            <div className="text-base font-bold text-white">
              {formatCurrency(data.needs.amount, currency)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Rent, food, utilities & bills
            </div>
          </div>

          {/* Wants */}
          <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20">
            <div className="flex items-center justify-between text-amber-400 text-xs font-semibold mb-1">
              <span className="flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5" />
                Wants (30%)
              </span>
            </div>
            <div className="text-base font-bold text-white">
              {formatCurrency(data.wants.amount, currency)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Dining, entertainment, shopping
            </div>
          </div>

          {/* Savings */}
          <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold mb-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Savings (20%)
              </span>
            </div>
            <div className="text-base font-bold text-white">
              {formatCurrency(data.savings.amount, currency)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Emergency fund, index funds
            </div>
          </div>
        </div>

        {/* Breakdown sub-items preview */}
        <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/60 space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
            <span>Key Itemized Expenses</span>
            <span className="text-[10px] text-slate-500">Monthly Est.</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {data.needs.items.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex justify-between text-slate-300">
                <span className="text-slate-400 truncate">{item.name}</span>
                <span className="font-medium">{formatCurrency(item.amount, currency)}</span>
              </div>
            ))}
            {data.wants.items.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex justify-between text-slate-300">
                <span className="text-slate-400 truncate">{item.name}</span>
                <span className="font-medium">{formatCurrency(item.amount, currency)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card CTA */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleSyncToDashboard}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
          >
            <span>Sync to Live Dashboard</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => sendMessage(`Suggest ways to cut $200 from my Wants bucket.`)}
            className="text-[11px] text-slate-400 hover:text-slate-200 underline"
          >
            How to cut $200?
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
