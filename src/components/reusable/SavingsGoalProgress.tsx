import React, { useState } from 'react';
import { translations, SupportedLocale, formatINR } from '../../lib/i18n';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { 
  PiggyBank, 
  Target, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Milestone {
  id: string;
  name: string;
  targetAmount: number;
  reached: boolean;
  targetDate?: string;
}

export interface SavingsGoalProgressProps {
  title?: string;
  targetAmount?: number;
  currentAmount?: number;
  monthlyDeposit?: number;
  milestones?: Milestone[];
  locale?: SupportedLocale;
  className?: string;
  onDepositChange?: (newDeposit: number) => void;
}

export const SavingsGoalProgress: React.FC<SavingsGoalProgressProps> = ({
  title,
  targetAmount = 500000, // ₹5 Lakhs
  currentAmount = 320000, // ₹3.2 Lakhs
  monthlyDeposit = 25000, // ₹25,000/mo
  milestones,
  locale = 'en',
  className,
  onDepositChange,
}) => {
  const t = translations[locale];
  const [current, setCurrent] = useState<number>(currentAmount);
  const [deposit, setDeposit] = useState<number>(monthlyDeposit);

  const goalTitle = title || t.savingsGoalTitle;
  const percent = Math.min(100, Math.max(0, Math.round((current / targetAmount) * 100)));
  const remaining = Math.max(0, targetAmount - current);
  const monthsRemaining = deposit > 0 ? Math.ceil(remaining / deposit) : 0;

  // Default milestones if none provided
  const activeMilestones: Milestone[] = milestones || [
    {
      id: 'm1',
      name: locale === 'hi' ? 'प्रारंभिक आपातकालीन फंड (₹1 Lakh)' : 'Starter Emergency Cushion (₹1 Lakh)',
      targetAmount: 100000,
      reached: current >= 100000,
      targetDate: locale === 'hi' ? 'जनवरी 2026 (पूर्ण)' : 'Jan 2026 (Achieved)'
    },
    {
      id: 'm2',
      name: locale === 'hi' ? '3 महीने का खर्च सुरक्षा (₹2.5 Lakh)' : '3 Months Expense Runway (₹2.5 Lakh)',
      targetAmount: 250000,
      reached: current >= 250000,
      targetDate: locale === 'hi' ? 'सितंबर 2026 (पूर्ण)' : 'Sep 2026 (Achieved)'
    },
    {
      id: 'm3',
      name: locale === 'hi' ? '75% लक्ष्य मील का पत्थर (₹3.75 Lakh)' : '75% Goal Milestone (₹3.75 Lakh)',
      targetAmount: 375000,
      reached: current >= 375000,
      targetDate: locale === 'hi' ? `अगले ${Math.max(1, Math.ceil((375000 - current) / deposit))} महीने में` : `In ~${Math.max(1, Math.ceil((375000 - current) / deposit))} mos`
    },
    {
      id: 'm4',
      name: locale === 'hi' ? 'पूर्ण 6-माह सुरक्षा कवच (₹5.0 Lakh)' : 'Full 6-Month Safety Net (₹5.0 Lakh)',
      targetAmount: 500000,
      reached: current >= 500000,
      targetDate: locale === 'hi' ? `${monthsRemaining} महीने शेष` : `${monthsRemaining} mos remaining`
    }
  ];

  const handleDepositSlider = (val: number) => {
    setDeposit(val);
    if (onDepositChange) onDepositChange(val);
  };

  return (
    <Card 
      className={cn("bg-slate-900/90 border-slate-800 text-slate-100 shadow-md", className)}
      role="region"
      aria-label={`${goalTitle} Tracker`}
    >
      <CardHeader className="p-4 pb-2 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
              <PiggyBank className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-white">
                {goalTitle}
              </CardTitle>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {t.targetAmount}: <strong className="text-emerald-400">{formatINR(targetAmount, { locale })}</strong>
              </p>
            </div>
          </div>

          <Badge variant="success" className="text-[11px] flex items-center gap-1 font-bold">
            <Sparkles className="w-3 h-3" />
            <span>{percent}% {t.completed}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Progress Bar & Amount Row */}
        <div>
          <div className="flex justify-between items-baseline text-xs mb-1.5">
            <span className="text-slate-300 font-medium">
              {t.progressPercent}: <strong className="text-emerald-400">{percent}%</strong>
            </span>
            <span className="text-slate-200 font-bold">
              {formatINR(current, { locale })} / {formatINR(targetAmount, { locale })}
            </span>
          </div>

          <div 
            className="h-3 w-full rounded-full overflow-hidden bg-slate-800 relative"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${t.progressPercent} (${percent}%)`}
          >
            <div 
              style={{ width: `${percent}%` }}
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/30"
            />
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">{t.currentSaved}</div>
            <div className="text-sm sm:text-base font-bold text-white mt-0.5">
              {formatINR(current, { locale })}
            </div>
          </div>

          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-amber-500/20">
            <div className="text-[10px] text-amber-400 uppercase tracking-wider">{t.remainingAmount}</div>
            <div className="text-sm sm:text-base font-bold text-amber-400 mt-0.5">
              {formatINR(remaining, { locale })}
            </div>
          </div>

          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-sky-500/20">
            <div className="text-[10px] text-sky-400 uppercase tracking-wider">{t.projectedTimeline}</div>
            <div className="text-sm sm:text-base font-bold text-sky-400 mt-0.5 flex items-center justify-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{monthsRemaining} {t.monthsLeft}</span>
            </div>
          </div>
        </div>

        {/* Monthly Deposit Slider to Experiment */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="savings-deposit-slider" className="text-slate-300 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.monthlyContribution}:</span>
            </label>
            <span className="font-bold text-emerald-400 text-sm">
              +{formatINR(deposit, { locale })}/mo
            </span>
          </div>
          <Slider
            id="savings-deposit-slider"
            aria-label={t.monthlyContribution}
            aria-valuenow={deposit}
            aria-valuemin={1000}
            aria-valuemax={100000}
            min={5000}
            max={100000}
            step={2500}
            value={deposit}
            onChange={handleDepositSlider}
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>₹5,000/mo</span>
            <span>₹50,000/mo</span>
            <span>₹1,00,000/mo</span>
          </div>
        </div>

        {/* Timeline & Milestones Roadmap */}
        <div className="space-y-2 pt-1 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              {t.milestonesTitle}
            </span>
            <span className="text-[10px] text-slate-500">
              {activeMilestones.filter(m => m.reached).length}/{activeMilestones.length} {t.completed}
            </span>
          </div>

          <div 
            className="space-y-2 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800"
            role="list"
            aria-label={t.milestonesTitle}
          >
            {activeMilestones.map((milestone) => (
              <div 
                key={milestone.id}
                role="listitem"
                className={cn(
                  "flex items-center justify-between pl-7 relative text-xs py-1.5 px-2.5 rounded-lg border transition-all",
                  milestone.reached 
                    ? "bg-emerald-950/20 border-emerald-500/30 text-slate-200"
                    : "bg-slate-950/40 border-slate-800 text-slate-400"
                )}
              >
                {/* Node indicator */}
                <div 
                  className={cn(
                    "absolute left-2 w-2.5 h-2.5 rounded-full border-2",
                    milestone.reached 
                      ? "bg-emerald-400 border-emerald-600" 
                      : "bg-slate-900 border-slate-600"
                  )}
                  aria-hidden="true"
                />

                <div className="flex flex-col truncate pr-2">
                  <span className={cn("font-medium truncate", milestone.reached && "text-white")}>
                    {milestone.name}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {formatINR(milestone.targetAmount, { locale })}
                  </span>
                </div>

                <div className="shrink-0 text-right">
                  <span className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded",
                    milestone.reached 
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-slate-800 text-slate-400"
                  )}>
                    {milestone.targetDate || (milestone.reached ? t.completed : t.inProgress)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

