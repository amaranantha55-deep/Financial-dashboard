import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { formatCurrency } from '../../lib/utils';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

export const SipGrowthWidget: React.FC = () => {
  const { dashboard, sendMessage } = useFinancial();
  const { sipVsFd, currency } = dashboard;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
          <div className="font-semibold text-slate-300">Year {label} Compounding</div>
          <div className="text-purple-400 font-bold">
            SIP (12%): {formatCurrency(payload[0]?.value, currency)}
          </div>
          <div className="text-sky-400 font-bold">
            FD (6.5%): {formatCurrency(payload[1]?.value, currency)}
          </div>
          <div className="text-slate-400 text-[10px]">
            Invested: {formatCurrency(payload[2]?.value, currency)}
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
          <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          <CardTitle className="text-xs font-semibold text-slate-200">
            10-Year Compounding Growth
          </CardTitle>
        </div>
        <span className="text-[10px] text-purple-300 font-semibold bg-purple-500/15 px-1.5 py-0.5 rounded border border-purple-500/30">
          SIP vs FD
        </span>
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-2">
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sipVsFd.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSip" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorFd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="year" 
                stroke="#64748b" 
                tick={{ fontSize: 10 }}
                tickFormatter={(val) => `Yr ${val}`}
              />
              <YAxis 
                stroke="#64748b" 
                tick={{ fontSize: 9 }}
                tickFormatter={(val) => `${currency}${Math.round(val / 1000)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="sipValue" 
                stroke="#a855f7" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorSip)" 
                name="SIP"
              />
              <Area 
                type="monotone" 
                dataKey="fdValue" 
                stroke="#38bdf8" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorFd)" 
                name="FD"
              />
              <Area 
                type="monotone" 
                dataKey="investedAmount" 
                stroke="#475569" 
                strokeDasharray="3 3"
                strokeWidth={1}
                fill="none" 
                name="Invested"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-slate-300">SIP: {formatCurrency(sipVsFd.sipMaturity, currency)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span className="text-slate-300">FD: {formatCurrency(sipVsFd.fdMaturity, currency)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

