import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatCurrency } from '../../lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { PieChart as PieIcon, ArrowRight } from 'lucide-react';

export const BudgetDonutWidget: React.FC = () => {
  const { dashboard, sendMessage } = useFinancial();
  const { budget, currency } = dashboard;

  const chartData = [
    { name: 'Needs (50%)', value: budget.needs.amount, color: '#3b82f6' },
    { name: 'Wants (30%)', value: budget.wants.amount, color: '#f59e0b' },
    { name: 'Savings (20%)', value: budget.savings.amount, color: '#10b981' },
  ];

  const total = budget.income;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const pct = Math.round((data.value / total) * 100);
      return (
        <div className="bg-slate-900 border border-slate-700 p-2 rounded-lg shadow-xl text-xs">
          <div className="font-semibold text-slate-200">{data.name}</div>
          <div className="text-emerald-400 font-bold">
            {formatCurrency(data.value, currency)} ({pct}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between">
        <div className="flex items-center gap-1.5">
          <PieIcon className="w-3.5 h-3.5 text-blue-400" />
          <CardTitle className="text-xs font-semibold text-slate-200">
            Monthly Budget Allocation
          </CardTitle>
        </div>
        <span className="text-[11px] font-bold text-emerald-400">
          {formatCurrency(total, currency)}/mo
        </span>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-2">
        {/* Donut Chart with center label */}
        <div className="relative h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Income</span>
            <span className="text-sm font-extrabold text-white">{formatCurrency(total, currency)}</span>
          </div>
        </div>

        {/* Legend row */}
        <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
          <div className="bg-slate-950/60 p-1.5 rounded-lg border border-blue-500/20">
            <div className="flex items-center justify-center gap-1 text-[10px] text-blue-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Needs
            </div>
            <div className="font-bold text-slate-200 text-xs mt-0.5">
              {formatCurrency(budget.needs.amount, currency)}
            </div>
          </div>

          <div className="bg-slate-950/60 p-1.5 rounded-lg border border-amber-500/20">
            <div className="flex items-center justify-center gap-1 text-[10px] text-amber-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Wants
            </div>
            <div className="font-bold text-slate-200 text-xs mt-0.5">
              {formatCurrency(budget.wants.amount, currency)}
            </div>
          </div>

          <div className="bg-slate-950/60 p-1.5 rounded-lg border border-emerald-500/20">
            <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Savings
            </div>
            <div className="font-bold text-slate-200 text-xs mt-0.5">
              {formatCurrency(budget.savings.amount, currency)}
            </div>
          </div>
        </div>

        {/* Quick action */}
        <button
          onClick={() => sendMessage(`How do I optimize my ${formatCurrency(budget.income, currency)} budget for 30% savings?`)}
          className="w-full text-center text-[10px] text-slate-400 hover:text-emerald-400 pt-1 flex items-center justify-center gap-1"
        >
          <span>Ask FinBot to rebalance for 30% savings</span>
          <ArrowRight className="w-2.5 h-2.5" />
        </button>
      </CardContent>
    </Card>
  );
};

