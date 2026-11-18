import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { formatCurrency } from '../../lib/utils';
import { PiggyBank, Target, Calendar, CheckCircle2 } from 'lucide-react';

export const SavingsGoalWidget: React.FC = () => {
  const { dashboard, sendMessage } = useFinancial();
  const { savingsGoal, currency } = dashboard;

  const percent = Math.min(100, Math.round((savingsGoal.currentAmount / savingsGoal.targetAmount) * 100));

  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between">
        <div className="flex items-center gap-1.5">
          <PiggyBank className="w-3.5 h-3.5 text-emerald-400" />
          <CardTitle className="text-xs font-semibold text-slate-200">
            {savingsGoal.title}
          </CardTitle>
        </div>
        <span className="text-[11px] font-bold text-emerald-400">
          {percent}%
        </span>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-2.5">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Current Balance:</span>
            <span className="font-bold text-white">
              {formatCurrency(savingsGoal.currentAmount, currency)} / {formatCurrency(savingsGoal.targetAmount, currency)}
            </span>
          </div>
          <Progress value={percent} className="h-2.5" />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400">Monthly Contribution</div>
            <div className="font-bold text-slate-200 mt-0.5">
              +{formatCurrency(savingsGoal.monthlyDeposit, currency)}/mo
            </div>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400">Projected Target</div>
            <div className="font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{savingsGoal.projectedMonths} months</span>
            </div>
          </div>
        </div>

        {/* Milestones list */}
        <div className="space-y-1 text-xs">
          {savingsGoal.milestones.slice(0, 3).map((m, idx) => (
            <div key={idx} className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 truncate">
                <CheckCircle2 className={`w-3 h-3 ${m.reached ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span className={m.reached ? 'text-slate-300' : 'text-slate-500'}>{m.name}</span>
              </span>
              <span className="text-[10px] text-slate-500 shrink-0">{m.date}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => sendMessage(`How can I accelerate reaching my ${formatCurrency(savingsGoal.targetAmount, currency)} emergency fund goal?`)}
          className="w-full text-center text-[10px] text-slate-400 hover:text-emerald-400 pt-1"
        >
          Ask FinBot to calculate acceleration options
        </button>
      </CardContent>
    </Card>
  );
};

