import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { calculateEMI } from '../../lib/mockResponses';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Slider } from '../ui/slider';
import { formatCurrency } from '../../lib/utils';
import { Landmark, ArrowRight, Sparkles } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const EmiBreakdownWidget: React.FC = () => {
  const { dashboard, updateDashboard, sendMessage } = useFinancial();
  const { loan, currency } = dashboard;

  const [principal, setPrincipal] = useState<number>(loan.principal);
  const [rate, setRate] = useState<number>(loan.interestRate);
  const [tenure, setTenure] = useState<number>(loan.tenureYears);

  // Recalculate
  const currentCalc = calculateEMI(principal, rate, tenure);

  const chartData = [
    { name: 'Principal Outlay', value: currentCalc.principal, color: '#10b981' },
    { name: 'Total Interest Due', value: currentCalc.totalInterest, color: '#f59e0b' },
  ];

  const handleUpdate = () => {
    updateDashboard({ loan: currentCalc });
  };

  const handleDiscussInChat = () => {
    sendMessage(`Analyze my updated loan scenario: ${formatCurrency(principal, currency)} at ${rate}% for ${tenure} years. Total interest is ${formatCurrency(currentCalc.totalInterest, currency)}.`);
  };

  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Landmark className="w-3.5 h-3.5 text-amber-400" />
          <CardTitle className="text-xs font-semibold text-slate-200">
            Loan EMI & Interest Split
          </CardTitle>
        </div>
        <span className="text-[11px] font-bold text-amber-400">
          {formatCurrency(currentCalc.emi, currency)}/mo
        </span>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-3">
        {/* Pie / Donut Chart */}
        <div className="relative h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={60}
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

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">EMI</span>
            <span className="text-sm font-extrabold text-white">{formatCurrency(currentCalc.emi, currency)}</span>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Principal
            </div>
            <div className="font-bold text-slate-200 mt-0.5">
              {formatCurrency(currentCalc.principal, currency)}
            </div>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Total Interest
            </div>
            <div className="font-bold text-amber-400 mt-0.5">
              {formatCurrency(currentCalc.totalInterest, currency)}
            </div>
          </div>
        </div>

        {/* Interactive Quick Sliders */}
        <div className="space-y-2 pt-1 border-t border-slate-800/60 text-xs">
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
              <span>Principal: {formatCurrency(principal, currency)}</span>
            </div>
            <Slider
              min={5000}
              max={80000}
              step={1000}
              value={principal}
              onChange={(val) => {
                setPrincipal(val);
                updateDashboard({ loan: calculateEMI(val, rate, tenure) });
              }}
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
              <span>Rate: {rate.toFixed(1)}% ({tenure} yrs)</span>
            </div>
            <Slider
              min={4.0}
              max={15.0}
              step={0.2}
              value={rate}
              onChange={(val) => {
                setRate(val);
                updateDashboard({ loan: calculateEMI(principal, val, tenure) });
              }}
            />
          </div>
        </div>

        {/* Discuss button */}
        <button
          onClick={handleDiscussInChat}
          className="w-full py-1 text-center text-[10px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center justify-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          <span>Discuss this loan in chat</span>
          <ArrowRight className="w-2.5 h-2.5" />
        </button>
      </CardContent>
    </Card>
  );
};

