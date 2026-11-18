import React from 'react';
import { SavingsGoalData } from '../../types/finance';
import { useFinancial } from '../../context/FinancialContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { formatCurrency } from '../../lib/utils';
import { PiggyBank, Target, CheckCircle2, Clock, Calendar } from 'lucide-react';

interface SavingsGoalCardProps {
  data: SavingsGoalData;
}

export const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({ data }) => {
  const { dashboard, sendMessage } = useFinancial();
  const currency = dashboard.currency;

  const percent = Math.round((data.currentAmount / data.targetAmount) * 100);
  const remaining = Math.max(0, data.targetAmount - data.currentAmount);

  return (
    <Card className="mt-3 border-slate-700/80 bg-slate-900/90 shadow-lg overflow-hidden">
      <CardHeader className="p-4 pb-2 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
              <PiggyBank className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-white">
                {data.title}
              </CardTitle>
              <div className="text-[11px] text-slate-400">
                Target: <span className="font-semibold text-white">{formatCurrency(data.targetAmount, currency)}</span>
              </div>
            </div>
          </div>
          <Badge variant="success" className="text-[11px]">
            {percent}% Achieved
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Fund Progress</span>
            <span className="font-bold text-emerald-400">
              {formatCurrency(data.currentAmount, currency)} of {formatCurrency(data.targetAmount, currency)}
            </span>
          </div>
          <Progress value={percent} className="h-3" />
        </div>

        {/* Key stats row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400">Monthly Dep.</div>
            <div className="text-xs font-bold text-white mt-0.5">
              {formatCurrency(data.monthlyDeposit, currency)}
            </div>
          </div>
          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400">Remaining</div>
            <div className="text-xs font-bold text-amber-400 mt-0.5">
              {formatCurrency(remaining, currency)}
            </div>
          </div>
          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400">Time Horizon</div>
            <div className="text-xs font-bold text-sky-400 mt-0.5">
              {data.projectedMonths} mos
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-1.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
          <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            Milestone Checklist
          </div>
          <div className="space-y-1">
            {data.milestones.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-0.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${m.reached ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className={m.reached ? 'text-slate-200 font-medium' : 'text-slate-400'}>{m.name}</span>
                </div>
                <span className="text-[10px] text-slate-500">{m.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            Projected completion: {data.targetDate}
          </span>
          <button
            onClick={() => sendMessage(`How much faster can I reach my emergency fund if I save $850/month?`)}
            className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium"
          >
            Boost to $850/mo
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

