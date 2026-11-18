import React, { useState, useEffect, useId } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { translations, SupportedLocale, formatINR } from '../../lib/i18n';
import { calculateEMI } from '../../lib/mockResponses';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Landmark, ArrowUpRight, BarChart2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EmiCalculatorCardProps {
  initialPrincipal?: number;
  initialRate?: number;
  initialTenureYears?: number;
  locale?: SupportedLocale;
  onChange?: (result: { emi: number; totalInterest: number; totalPayment: number }) => void;
  className?: string;
  showAmortizationChart?: boolean;
}

export const EmiCalculatorCard: React.FC<EmiCalculatorCardProps> = ({
  initialPrincipal = 500000, // 5 Lakhs INR default
  initialRate = 8.5,
  initialTenureYears = 5,
  locale = 'en',
  onChange,
  className,
  showAmortizationChart = true,
}) => {
  const [principal, setPrincipal] = useState<number>(initialPrincipal);
  const [rate, setRate] = useState<number>(initialRate);
  const [tenure, setTenure] = useState<number>(initialTenureYears);

  const t = translations[locale];
  const principalInputId = useId();
  const rateInputId = useId();
  const tenureInputId = useId();

  useEffect(() => {
    setPrincipal(initialPrincipal);
    setRate(initialRate);
    setTenure(initialTenureYears);
  }, [initialPrincipal, initialRate, initialTenureYears]);

  const emiCalc = calculateEMI(principal, rate, tenure);

  useEffect(() => {
    if (onChange) {
      onChange({
        emi: emiCalc.emi,
        totalInterest: emiCalc.totalInterest,
        totalPayment: emiCalc.totalPayment
      });
    }
  }, [principal, rate, tenure, onChange]);

  // Generate complete year-by-year stacked bar chart data
  const amortizationData = [];
  let balance = principal;
  for (let year = 1; year <= tenure; year++) {
    const yearlyInterest = balance * (rate / 100);
    const yearlyPayment = emiCalc.emi * 12;
    const yearlyPrincipal = Math.min(balance, yearlyPayment - yearlyInterest);
    balance = Math.max(0, balance - yearlyPrincipal);

    amortizationData.push({
      year: `${t.year} ${year}`,
      yearNumber: year,
      principalPaid: Math.round(yearlyPrincipal),
      interestPaid: Math.round(yearlyInterest),
      remainingBalance: Math.round(balance)
    });
  }

  const principalRatio = Math.round((principal / emiCalc.totalPayment) * 100);
  const interestRatio = 100 - principalRatio;

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1"
          role="tooltip"
        >
          <div className="font-semibold text-slate-200">{label}</div>
          <div className="text-emerald-400 font-bold">
            {t.principalPaid}: {formatINR(payload[0]?.value, { locale })}
          </div>
          <div className="text-amber-400 font-bold">
            {t.interestPaid}: {formatINR(payload[1]?.value, { locale })}
          </div>
          {payload[0]?.payload?.remainingBalance !== undefined && (
            <div className="text-slate-400 text-[10px] pt-0.5 border-t border-slate-800">
              {t.remainingBalance}: {formatINR(payload[0]?.payload?.remainingBalance, { locale })}
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
      aria-label={t.emiTitle}
    >
      <CardHeader className="p-4 pb-2 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-white">
                {t.emiTitle}
              </CardTitle>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {t.emiSubtitle}
              </p>
            </div>
          </div>
          <Badge variant="warning" className="text-[11px]">
            {tenure * 12} {t.tenureMonths}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Monthly EMI Hero Banner */}
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/30 p-4 rounded-xl border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
              {t.monthlyEmi}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5 flex items-baseline gap-1.5">
              <span>{formatINR(emiCalc.emi, { locale })}</span>
              <span className="text-xs text-slate-400 font-normal">/ month</span>
            </div>
          </div>

          <div className="flex gap-4 text-right">
            <div>
              <div className="text-[10px] text-slate-400">{t.totalInterest}</div>
              <div className="text-sm sm:text-base font-bold text-amber-400">
                {formatINR(emiCalc.totalInterest, { locale })}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">{t.totalPayment}</div>
              <div className="text-sm sm:text-base font-bold text-slate-200">
                {formatINR(emiCalc.totalPayment, { locale })}
              </div>
            </div>
          </div>
        </div>

        {/* Inputs & Sliders */}
        <div 
          className="space-y-3.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800"
          role="group"
          aria-label="Loan EMI Parameters"
        >
          {/* Loan Amount Input & Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor={principalInputId} className="text-slate-300 font-medium">
                {t.loanAmount}:
              </label>
              <span className="font-bold text-emerald-400 text-sm">
                {formatINR(principal, { locale })}
              </span>
            </div>
            <Slider
              id={principalInputId}
              aria-label={t.loanAmount}
              aria-valuenow={principal}
              aria-valuemin={10000}
              aria-valuemax={10000000}
              min={10000}
              max={5000000}
              step={10000}
              value={principal}
              onChange={setPrincipal}
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>₹10,000</span>
              <span>₹25 Lakh</span>
              <span>₹50 Lakh</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor={rateInputId} className="text-slate-300 font-medium">
                {t.interestRate}:
              </label>
              <span className="font-bold text-amber-400 text-sm">
                {rate.toFixed(1)}% p.a.
              </span>
            </div>
            <Slider
              id={rateInputId}
              aria-label={t.interestRate}
              aria-valuenow={rate}
              aria-valuemin={5}
              aria-valuemax={20}
              min={5.0}
              max={18.0}
              step={0.1}
              value={rate}
              onChange={setRate}
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>5.0%</span>
              <span>11.5%</span>
              <span>18.0%</span>
            </div>
          </div>

          {/* Tenure (Years) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor={tenureInputId} className="text-slate-300 font-medium">
                {t.tenureYears}:
              </label>
              <span className="font-bold text-sky-400 text-sm">
                {tenure} {t.year} ({tenure * 12} {t.tenureMonths})
              </span>
            </div>
            <Slider
              id={tenureInputId}
              aria-label={t.tenureYears}
              aria-valuenow={tenure}
              aria-valuemin={1}
              aria-valuemax={30}
              min={1}
              max={25}
              step={1}
              value={tenure}
              onChange={setTenure}
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1 {t.year}</span>
              <span>10 {t.year}</span>
              <span>25 {t.year}</span>
            </div>
          </div>
        </div>

        {/* Principal vs Interest Horizontal Ratio Bar */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              {t.principalRatio}: {principalRatio}% ({formatINR(principal, { locale })})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              {t.interestRatio}: {interestRatio}% ({formatINR(emiCalc.totalInterest, { locale })})
            </span>
          </div>
          <div 
            className="h-2.5 w-full rounded-full overflow-hidden flex bg-slate-800"
            role="progressbar"
            aria-label={`${t.principalRatio} to ${t.interestRatio} Ratio`}
            aria-valuenow={principalRatio}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div style={{ width: `${principalRatio}%` }} className="bg-emerald-500 transition-all duration-300" />
            <div style={{ width: `${interestRatio}%` }} className="bg-amber-500 transition-all duration-300" />
          </div>
        </div>

        {/* Amortization Stacked Bar Chart */}
        {showAmortizationChart && (
          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                {t.amortizationChartTitle}
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                {tenure} {t.year} Timeline
              </span>
            </div>

            <div className="h-48 w-full" aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={amortizationData} 
                  margin={{ top: 10, right: 10, left: 5, bottom: 0 }}
                >
                  <XAxis 
                    dataKey="yearNumber" 
                    stroke="#64748b" 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(val) => `Y${val}`}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fontSize: 9 }}
                    tickFormatter={(val) => formatINR(val, { compact: true, showSymbol: true, locale })}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
                    formatter={(value) => value === 'principalPaid' ? t.principalPaid : t.interestPaid}
                  />
                  <Bar 
                    dataKey="principalPaid" 
                    stackId="amortization" 
                    fill="#10b981" 
                    radius={[0, 0, 0, 0]}
                    name="principalPaid"
                  />
                  <Bar 
                    dataKey="interestPaid" 
                    stackId="amortization" 
                    fill="#f59e0b" 
                    radius={[4, 4, 0, 0]}
                    name="interestPaid"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

