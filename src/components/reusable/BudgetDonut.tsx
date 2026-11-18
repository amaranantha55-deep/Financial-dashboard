import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { translations, SupportedLocale, formatINR } from '../../lib/i18n';
import { Slider } from '../ui/slider';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { PieChart as PieIcon, RefreshCw, AlertTriangle, CheckCircle2, Home, Coffee, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BudgetDonutProps {
  monthlyIncome?: number;
  initialNeeds?: number;
  initialWants?: number;
  initialSavings?: number;
  locale?: SupportedLocale;
  onChange?: (values: { needs: number; wants: number; savings: number; total: number }) => void;
  className?: string;
  showControls?: boolean;
  compact?: boolean;
}

export const BudgetDonut: React.FC<BudgetDonutProps> = ({
  monthlyIncome = 100000,
  initialNeeds = 50,
  initialWants = 30,
  initialSavings = 20,
  locale = 'en',
  onChange,
  className,
  showControls = true,
  compact = false,
}) => {
  const [needs, setNeeds] = useState<number>(initialNeeds);
  const [wants, setWants] = useState<number>(initialWants);
  const [savings, setSavings] = useState<number>(initialSavings);
  const [income, setIncome] = useState<number>(monthlyIncome);

  const t = translations[locale];
  const totalPercentage = needs + wants + savings;
  const isBalanced = totalPercentage === 100;
  const isOver = totalPercentage > 100;

  useEffect(() => {
    setNeeds(initialNeeds);
    setWants(initialWants);
    setSavings(initialSavings);
  }, [initialNeeds, initialWants, initialSavings]);

  useEffect(() => {
    setIncome(monthlyIncome);
  }, [monthlyIncome]);

  useEffect(() => {
    if (onChange) {
      onChange({ needs, wants, savings, total: totalPercentage });
    }
  }, [needs, wants, savings, totalPercentage, onChange]);

  const handleReset = () => {
    setNeeds(50);
    setWants(30);
    setSavings(20);
  };

  // Calculate actual INR values
  const needsAmount = Math.round((income * needs) / 100);
  const wantsAmount = Math.round((income * wants) / 100);
  const savingsAmount = Math.round((income * savings) / 100);

  const chartData = [
    { name: t.needs, value: needs, amount: needsAmount, color: '#3b82f6' },
    { name: t.wants, value: wants, amount: wantsAmount, color: '#f59e0b' },
    { name: t.savings, value: savings, amount: savingsAmount, color: '#10b981' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div 
          className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-0.5"
          role="tooltip"
        >
          <div className="font-semibold text-slate-200">{item.name}</div>
          <div className="text-emerald-400 font-bold">{formatINR(item.amount, { locale })} ({item.value}%)</div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card 
      className={cn("bg-slate-900/90 border-slate-800 text-slate-100 shadow-md", className)}
      role="region"
      aria-label={`${t.budgetTitle} Widget`}
    >
      <CardHeader className="p-4 pb-2 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-white">
                {t.budgetTitle}
              </CardTitle>
              {!compact && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t.budgetSubtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge 
              variant={isBalanced ? 'success' : isOver ? 'warning' : 'info'}
              className="text-[11px] flex items-center gap-1"
            >
              {isBalanced ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{t.balanced} (100%)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  <span>{totalPercentage}% ({isOver ? t.overAllocated : t.underAllocated})</span>
                </>
              )}
            </Badge>

            <Button
              size="sm"
              variant="ghost"
              onClick={handleReset}
              className="h-7 px-2 text-[11px] text-slate-400 hover:text-white"
              title={t.reset503020}
              aria-label={t.reset503020}
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              <span>50/30/20</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Visual Donut Chart + Center Label */}
        <div className="relative h-48 w-full" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={54}
                outerRadius={78}
                paddingAngle={3}
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
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {t.monthlyIncome}
            </span>
            <span className="text-base font-extrabold text-white mt-0.5">
              {formatINR(income, { locale })}
            </span>
          </div>
        </div>

        {/* 3 Metric Cards with Indian Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Needs */}
          <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/30">
            <div className="flex items-center justify-between text-blue-400 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" />
                {t.needs} ({needs}%)
              </span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white mt-1">
              {formatINR(needsAmount, { locale })}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{t.needsDesc}</p>
          </div>

          {/* Wants */}
          <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30">
            <div className="flex items-center justify-between text-amber-400 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5" />
                {t.wants} ({wants}%)
              </span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white mt-1">
              {formatINR(wantsAmount, { locale })}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{t.wantsDesc}</p>
          </div>

          {/* Savings */}
          <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.savings} ({savings}%)
              </span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white mt-1">
              {formatINR(savingsAmount, { locale })}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{t.savingsDesc}</p>
          </div>
        </div>

        {/* Sliders for Interactive Editing */}
        {showControls && (
          <div 
            className="space-y-3.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800"
            role="group"
            aria-label="Budget Sliders Group"
          >
            {/* Needs Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <label htmlFor="budget-slider-needs" className="text-blue-400 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  {t.needs}: {needs}%
                </label>
                <span className="font-semibold text-slate-200">{formatINR(needsAmount, { locale })}</span>
              </div>
              <Slider
                id="budget-slider-needs"
                aria-label={`${t.needs} Percentage`}
                aria-valuenow={needs}
                aria-valuemin={0}
                aria-valuemax={100}
                min={0}
                max={100}
                step={1}
                value={needs}
                onChange={setNeeds}
              />
            </div>

            {/* Wants Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <label htmlFor="budget-slider-wants" className="text-amber-400 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {t.wants}: {wants}%
                </label>
                <span className="font-semibold text-slate-200">{formatINR(wantsAmount, { locale })}</span>
              </div>
              <Slider
                id="budget-slider-wants"
                aria-label={`${t.wants} Percentage`}
                aria-valuenow={wants}
                aria-valuemin={0}
                aria-valuemax={100}
                min={0}
                max={100}
                step={1}
                value={wants}
                onChange={setWants}
              />
            </div>

            {/* Savings Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <label htmlFor="budget-slider-savings" className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {t.savings}: {savings}%
                </label>
                <span className="font-semibold text-slate-200">{formatINR(savingsAmount, { locale })}</span>
              </div>
              <Slider
                id="budget-slider-savings"
                aria-label={`${t.savings} Percentage`}
                aria-valuenow={savings}
                aria-valuemin={0}
                aria-valuemax={100}
                min={0}
                max={100}
                step={1}
                value={savings}
                onChange={setSavings}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

