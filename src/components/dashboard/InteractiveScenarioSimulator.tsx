import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { formatCurrency } from '../../lib/utils';
import { Sliders, Sparkles, Send, RotateCcw } from 'lucide-react';

export const InteractiveScenarioSimulator: React.FC = () => {
  const { dashboard, updateDashboard, sendMessage } = useFinancial();
  const { currency, monthlyIncome } = dashboard;

  const [simIncome, setSimIncome] = useState(monthlyIncome);
  const [simSavingsRate, setSimSavingsRate] = useState(20);
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');

  const simulatedSavings = Math.round(simIncome * (simSavingsRate / 100));
  const simulatedNeeds = Math.round(simIncome * 0.5);
  const simulatedWants = Math.max(0, simIncome - simulatedNeeds - simulatedSavings);

  const handleApply = () => {
    updateDashboard({
      monthlyIncome: simIncome,
      budget: {
        ...dashboard.budget,
        income: simIncome,
        needs: { ...dashboard.budget.needs, amount: simulatedNeeds },
        wants: { ...dashboard.budget.wants, amount: simulatedWants },
        savings: { ...dashboard.budget.savings, amount: simulatedSavings, percentage: simSavingsRate }
      }
    });

    sendMessage(`I simulated a new budget: Monthly income of ${formatCurrency(simIncome, currency)} with a ${simSavingsRate}% savings rate (${formatCurrency(simSavingsRate * simIncome / 100, currency)}/mo). How should I invest this?`);
  };

  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-teal-400" />
          <CardTitle className="text-xs font-semibold text-slate-200">
            Interactive Scenario Sandbox
          </CardTitle>
        </div>
        <span className="text-[10px] text-teal-400 font-semibold bg-teal-500/15 px-1.5 py-0.5 rounded border border-teal-500/30">
          Sandbox
        </span>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-3">
        {/* Income Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Monthly Net Income:</span>
            <span className="font-bold text-white">{formatCurrency(simIncome, currency)}</span>
          </div>
          <Slider
            min={2000}
            max={20000}
            step={500}
            value={simIncome}
            onChange={setSimIncome}
          />
        </div>

        {/* Savings Rate Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Target Savings Rate:</span>
            <span className="font-bold text-emerald-400">{simSavingsRate}% ({formatCurrency(simulatedSavings, currency)}/mo)</span>
          </div>
          <Slider
            min={5}
            max={50}
            step={1}
            value={simSavingsRate}
            onChange={setSimSavingsRate}
          />
        </div>

        {/* Risk Profile Selection */}
        <div className="space-y-1">
          <div className="text-[11px] text-slate-400">Portfolio Strategy Profile:</div>
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['conservative', 'moderate', 'aggressive'] as const).map(p => (
              <button
                key={p}
                onClick={() => setRiskTolerance(p)}
                className={`py-1 text-[10px] font-semibold rounded capitalize transition-all ${
                  riskTolerance === p
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Simulated Outcome */}
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 space-y-1 text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Needs (50%):</span>
            <span className="font-semibold text-blue-400">{formatCurrency(simulatedNeeds, currency)}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Wants ({100 - 50 - simSavingsRate}%):</span>
            <span className="font-semibold text-amber-400">{formatCurrency(simulatedWants, currency)}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Wealth Accumulation:</span>
            <span className="font-bold text-emerald-400">+{formatCurrency(simulatedSavings, currency)}/mo</span>
          </div>
        </div>

        {/* Send to chat button */}
        <Button
          onClick={handleApply}
          size="sm"
          className="w-full bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center gap-1.5 text-xs font-semibold shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Apply Scenario to FinBot</span>
        </Button>
      </CardContent>
    </Card>
  );
};

