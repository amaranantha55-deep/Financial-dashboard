import React from 'react';
import { SipVsFdData } from '../../types/finance';
import { useFinancial } from '../../context/FinancialContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { formatCurrency } from '../../lib/utils';
import { TrendingUp, ShieldCheck, Flame, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface SipVsFdCardProps {
  data: SipVsFdData;
}

export const SipVsFdCard: React.FC<SipVsFdCardProps> = ({ data }) => {
  const { dashboard, updateDashboard, sendMessage } = useFinancial();
  const currency = dashboard.currency;

  const totalInvested = data.monthlyInvestment * data.tenureYears * 12;
  const wealthDifference = data.sipMaturity - data.fdMaturity;

  return (
    <Card className="mt-3 border-slate-700/80 bg-slate-900/90 shadow-lg overflow-hidden">
      <CardHeader className="p-4 pb-2 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-white">
                SIP vs Fixed Deposit Growth Comparison
              </CardTitle>
              <div className="text-[11px] text-slate-400">
                Investing <span className="font-semibold text-white">{formatCurrency(data.monthlyInvestment, currency)}/mo</span> over <span className="font-semibold text-white">{data.tenureYears} Years</span>
              </div>
            </div>
          </div>
          <Badge variant="purple" className="text-[11px]">
            10-Year Horizon
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Total Capital Invested Metric */}
        <div className="flex items-center justify-between bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400">Principal Outlay ({data.tenureYears * 12} contributions):</span>
          <span className="text-xs font-bold text-slate-200">{formatCurrency(totalInvested, currency)}</span>
        </div>

        {/* Side by side comparison cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* SIP Equity Option */}
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-1.5 py-0.5 rounded border border-purple-500/40">
                ~{data.sipReturnRate}% CAGR
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold text-purple-300 flex items-center gap-1 mb-1">
                <Flame className="w-3.5 h-3.5 text-purple-400" />
                Equity SIP (Mutual Funds)
              </div>
              <div className="text-xl font-extrabold text-white mt-1">
                {formatCurrency(data.sipMaturity, currency)}
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="w-3 h-3" />
                Net Gain: +{formatCurrency(data.sipTotalWealthGain, currency)}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-purple-500/20 text-[10px] text-slate-300 space-y-1">
              <div className="flex items-center gap-1 text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Beats 5.5% inflation comfortably
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Dollar-cost averaging benefits
              </div>
            </div>
          </div>

          {/* Fixed Deposit Option */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-1.5 py-0.5 rounded border border-slate-700">
                ~{data.fdInterestRate}% APY
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                Fixed Deposit (Bank FD / RD)
              </div>
              <div className="text-xl font-extrabold text-slate-200 mt-1">
                {formatCurrency(data.fdMaturity, currency)}
              </div>
              <div className="text-[11px] text-sky-400 font-semibold flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="w-3 h-3" />
                Net Gain: +{formatCurrency(data.fdTotalWealthGain, currency)}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-sky-400" />
                100% Guaranteed capital return
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-sky-400" />
                Zero market volatility risk
              </div>
            </div>
          </div>
        </div>

        {/* Wealth Delta Banner */}
        <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
          <span className="text-slate-300">
            SIP Outperformance Advantage:
          </span>
          <span className="font-extrabold text-emerald-400">
            +{formatCurrency(wealthDifference, currency)} extra wealth
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => updateDashboard({ sipVsFd: data })}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
          >
            <span>Show Chart in Live Dashboard</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => sendMessage(`What is the risk of a market downturn with SIP?`)}
            className="text-xs text-slate-400 hover:text-slate-200 underline"
          >
            Ask about market risk
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

