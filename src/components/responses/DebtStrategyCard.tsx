import React, { useState } from 'react';
import { DebtPayoffData } from '../../types/finance';
import { useFinancial } from '../../context/FinancialContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { formatCurrency } from '../../lib/utils';
import { CreditCard, Award, Zap, ArrowRight } from 'lucide-react';

interface DebtStrategyCardProps {
  data: DebtPayoffData;
}

export const DebtStrategyCard: React.FC<DebtStrategyCardProps> = ({ data }) => {
  const { dashboard, sendMessage } = useFinancial();
  const currency = dashboard.currency;
  const [selectedMethod, setSelectedMethod] = useState<'avalanche' | 'snowball'>('avalanche');

  const currentStrategy = selectedMethod === 'avalanche' ? data.avalanche : data.snowball;

  return (
    <Card className="mt-3 border-slate-700/80 bg-slate-900/90 shadow-lg overflow-hidden">
      <CardHeader className="p-4 pb-2 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-500/15 text-red-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-white">
                Debt Elimination Strategy
              </CardTitle>
              <div className="text-[11px] text-slate-400">
                Total Debt: <span className="font-semibold text-red-400">{formatCurrency(data.totalDebt, currency)}</span> across {data.accounts.length} accounts
              </div>
            </div>
          </div>
          <Badge variant="warning" className="text-[11px]">
            Action Plan
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Strategy Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setSelectedMethod('avalanche')}
            className={`py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              selectedMethod === 'avalanche'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Avalanche (Save Most $)</span>
          </button>
          <button
            onClick={() => setSelectedMethod('snowball')}
            className={`py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              selectedMethod === 'snowball'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Snowball (Fast Wins)</span>
          </button>
        </div>

        {/* Selected Strategy Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400">Debt-Free In</div>
            <div className="text-base font-extrabold text-emerald-400 mt-0.5">
              {currentStrategy.monthsToDebtFree} mos
            </div>
          </div>

          <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400">Total Interest</div>
            <div className="text-base font-extrabold text-amber-400 mt-0.5">
              {formatCurrency(currentStrategy.totalInterestPaid, currency)}
            </div>
          </div>

          <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400">Pure Savings</div>
            <div className="text-base font-extrabold text-sky-400 mt-0.5">
              {formatCurrency(currentStrategy.savingsVsMinimums, currency)}
            </div>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="bg-slate-950/40 rounded-lg p-2.5 border border-slate-800/60 space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-300 flex justify-between">
            <span>Accounts (Sorted by Priority)</span>
            <span className="text-[10px] text-slate-500">APR / Min Due</span>
          </div>
          <div className="space-y-1">
            {data.accounts.map(acc => (
              <div key={acc.id} className="flex items-center justify-between text-xs py-1 px-1.5 rounded bg-slate-900/60 border border-slate-800/50">
                <div>
                  <div className="font-medium text-slate-200">{acc.name}</div>
                  <div className="text-[10px] text-red-400 font-semibold">{acc.interestRate}% APR</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-200">{formatCurrency(acc.balance, currency)}</div>
                  <div className="text-[10px] text-slate-400">{formatCurrency(acc.minPayment, currency)}/mo</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400">
            Extra monthly payoff: <span className="font-bold text-emerald-400">+{formatCurrency(data.extraMonthlyPayment, currency)}</span>
          </span>
          <button
            onClick={() => sendMessage(`Show step-by-step month-by-month payoff schedule for ${selectedMethod}.`)}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
          >
            <span>Detailed Schedule</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

