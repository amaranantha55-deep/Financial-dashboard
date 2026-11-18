import React, { useState } from 'react';
import { LoanEmiData } from '../../types/finance';
import { useFinancial } from '../../context/FinancialContext';
import { calculateEMI } from '../../lib/mockResponses';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { formatCurrency } from '../../lib/utils';
import { Landmark, Sliders, ArrowRight, RefreshCw, Table, Download } from 'lucide-react';
import { AmortizationModal } from './AmortizationModal';
import { exportAmortizationCSV } from '../../lib/exportUtils';

interface EmiCalculatorCardProps {
  data: LoanEmiData;
}

export const EmiCalculatorCard: React.FC<EmiCalculatorCardProps> = ({ data }) => {
  const { dashboard, updateDashboard, sendMessage } = useFinancial();
  const currency = dashboard.currency;

  const [principal, setPrincipal] = useState<number>(data.principal);
  const [rate, setRate] = useState<number>(data.interestRate);
  const [tenure, setTenure] = useState<number>(data.tenureYears);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Recalculate dynamically
  const currentCalc = calculateEMI(principal, rate, tenure);

  const handleApplyToDashboard = () => {
    updateDashboard({ loan: currentCalc });
  };

  const handleAskFollowUp = () => {
    sendMessage(`What if I take a ${formatCurrency(principal, currency)} loan at ${rate}% for ${tenure} years? Can I prepay?`);
  };

  const principalRatio = Math.round((principal / currentCalc.totalPayment) * 100);
  const interestRatio = 100 - principalRatio;

  return (
    <>
      <Card className="mt-3 border-slate-700/80 bg-slate-900/90 shadow-lg overflow-hidden">
        <CardHeader className="p-4 pb-2 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-white">
                  Interactive Loan & EMI Simulator
                </CardTitle>
                <div className="text-[11px] text-slate-400">
                  Adjust sliders to simulate payoff schedules in real-time
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => exportAmortizationCSV(currentCalc, currency)}
                title="Export schedule to CSV"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <Badge variant="warning" className="text-[11px]">
                Live Tool
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* EMI Highlight Banner */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/30 p-3.5 rounded-xl border border-amber-500/30 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-amber-400/90 font-semibold">
                Monthly Repayment (EMI)
              </div>
              <div className="text-2xl font-extrabold text-white mt-0.5 flex items-baseline gap-1">
                {formatCurrency(currentCalc.emi, currency)}
                <span className="text-xs text-slate-400 font-normal">/ month</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-slate-400">Total Interest</div>
              <div className="text-sm font-bold text-amber-400">
                {formatCurrency(currentCalc.totalInterest, currency)}
              </div>
            </div>
          </div>

          {/* Sliders section */}
          <div className="space-y-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
            {/* Principal Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Loan Amount:</span>
                <span className="font-semibold text-slate-200">{formatCurrency(principal, currency)}</span>
              </div>
              <Slider
                min={5000}
                max={100000}
                step={1000}
                value={principal}
                onChange={setPrincipal}
              />
            </div>

            {/* Interest Rate Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Interest Rate:</span>
                <span className="font-semibold text-amber-400">{rate.toFixed(1)}% p.a.</span>
              </div>
              <Slider
                min={3.0}
                max={18.0}
                step={0.1}
                value={rate}
                onChange={setRate}
              />
            </div>

            {/* Tenure Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Loan Tenure:</span>
                <span className="font-semibold text-slate-200">{tenure} Years ({tenure * 12} Mos)</span>
              </div>
              <Slider
                min={1}
                max={15}
                step={1}
                value={tenure}
                onChange={setTenure}
              />
            </div>
          </div>

          {/* Principal vs Interest Visual Bar */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Principal: {principalRatio}% ({formatCurrency(principal, currency)})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Interest: {interestRatio}% ({formatCurrency(currentCalc.totalInterest, currency)})
              </span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden flex bg-slate-800">
              <div style={{ width: `${principalRatio}%` }} className="bg-emerald-500" />
              <div style={{ width: `${interestRatio}%` }} className="bg-amber-500" />
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700/60 transition-colors"
            >
              <Table className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Amortization Table</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleApplyToDashboard}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Update Dashboard</span>
              </button>

              <button
                onClick={handleAskFollowUp}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              >
                <span>Ask Follow-up</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Amortization Modal */}
      <AmortizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        loan={currentCalc}
        currency={currency}
      />
    </>
  );
};
