import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { translations, SupportedLocale, formatINR } from '../../lib/i18n';
import { calculateSipVsFd } from '../../lib/mockResponses';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface GrowthLineChartProps {
  monthlyAmount?: number;
  tenureYears?: number;
  sipCagr?: number;
  fdApy?: number;
  locale?: SupportedLocale;
  className?: string;
  showInvestedLine?: boolean;
}

export const GrowthLineChart: React.FC<GrowthLineChartProps> = ({
  monthlyAmount = 10000, // ₹10,000 / month
  tenureYears = 10,
  sipCagr = 12.5,
  fdApy = 6.8,
  locale = 'en',
  className,
  showInvestedLine = true,
}) => {
  const t = translations[locale];
  const sipData = calculateSipVsFd(monthlyAmount, tenureYears, sipCagr, fdApy);

  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1"
          role="tooltip"
        >
          <div className="font-semibold text-slate-200">{t.year} {label}</div>
          <div className="text-purple-400 font-bold">
            {t.chartSIP}: {formatINR(payload.find((p: any) => p.dataKey === 'sipValue')?.value, { locale })}
          </div>
          <div className="text-sky-400 font-bold">
            {t.chartFD}: {formatINR(payload.find((p: any) => p.dataKey === 'fdValue')?.value, { locale })}
          </div>
          {showInvestedLine && (
            <div className="text-slate-400 text-[10px] pt-0.5 border-t border-slate-800">
              {t.chartInvested}: {formatINR(payload.find((p: any) => p.dataKey === 'investedAmount')?.value, { locale })}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card 
      className={cn("bg-slate-900/90 border-slate-800 text-slate-100 shadow-md", className)}
      role="region"
      aria-label={`${t.sipVsFdTitle} Line Chart`}
    >
      <CardHeader className="p-4 pb-2 border-b border-slate-800/80 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-white">
              {t.sipVsFdTitle} — {t.growthLineChartTitle || 'Growth Trajectory'}
            </CardTitle>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {formatINR(monthlyAmount, { locale })}/mo • {tenureYears} {t.year} • SIP ({sipCagr}%) vs FD ({fdApy}%)
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div className="h-56 w-full" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={sipData.chartData} 
              margin={{ top: 10, right: 15, left: 10, bottom: 0 }}
            >
              <XAxis 
                dataKey="year" 
                stroke="#64748b" 
                tick={{ fontSize: 10 }}
                tickFormatter={(val) => `Y${val}`}
              />
              <YAxis 
                stroke="#64748b" 
                tick={{ fontSize: 9 }}
                tickFormatter={(val) => formatINR(val, { compact: true, showSymbol: true, locale })}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
                formatter={(value) => {
                  if (value === 'sipValue') return `${t.chartSIP} (~${sipCagr}%)`;
                  if (value === 'fdValue') return `${t.chartFD} (~${fdApy}%)`;
                  return t.chartInvested;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sipValue" 
                stroke="#a855f7" 
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#a855f7' }}
                activeDot={{ r: 5 }}
                name="sipValue"
              />
              <Line 
                type="monotone" 
                dataKey="fdValue" 
                stroke="#38bdf8" 
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#38bdf8' }}
                activeDot={{ r: 5 }}
                name="fdValue"
              />
              {showInvestedLine && (
                <Line 
                  type="monotone" 
                  dataKey="investedAmount" 
                  stroke="#64748b" 
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                  name="investedAmount"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Highlights */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800">
          <div className="bg-purple-950/20 p-2.5 rounded-lg border border-purple-500/20">
            <div className="text-[10px] text-purple-400 font-medium">{t.chartSIP} ({tenureYears}Y)</div>
            <div className="text-base font-extrabold text-white mt-0.5">
              {formatINR(sipData.sipMaturity, { locale })}
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
              +{formatINR(sipData.sipTotalWealthGain, { locale })} {t.wealthCreated}
            </div>
          </div>

          <div className="bg-sky-950/20 p-2.5 rounded-lg border border-sky-500/20">
            <div className="text-[10px] text-sky-400 font-medium">{t.chartFD} ({tenureYears}Y)</div>
            <div className="text-base font-extrabold text-slate-200 mt-0.5">
              {formatINR(sipData.fdMaturity, { locale })}
            </div>
            <div className="text-[10px] text-sky-400 font-semibold mt-0.5">
              +{formatINR(sipData.fdTotalWealthGain, { locale })} {t.wealthCreated}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

