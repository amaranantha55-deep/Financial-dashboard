import React, { useState, useEffect } from 'react';
import { translations, SupportedLocale } from '../../lib/i18n';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Shield, AlertCircle, Compass, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

export type RiskLevel = 'low' | 'moderate' | 'high';

export interface RiskGaugeProps {
  value?: RiskLevel;
  score?: number; // 0 to 100
  onChange?: (level: RiskLevel, score: number) => void;
  locale?: SupportedLocale;
  className?: string;
  interactive?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  value = 'moderate',
  score: controlledScore,
  onChange,
  locale = 'en',
  className,
  interactive = true,
}) => {
  const t = translations[locale];

  // Map level to score and vice-versa
  const levelToScore = (lvl: RiskLevel): number => {
    switch (lvl) {
      case 'low': return 25;
      case 'moderate': return 55;
      case 'high': return 85;
    }
  };

  const [currentLevel, setCurrentLevel] = useState<RiskLevel>(value);
  const [currentScore, setCurrentScore] = useState<number>(controlledScore ?? levelToScore(value));

  useEffect(() => {
    if (value) {
      setCurrentLevel(value);
      if (controlledScore === undefined) {
        setCurrentScore(levelToScore(value));
      }
    }
  }, [value]);

  useEffect(() => {
    if (controlledScore !== undefined) {
      setCurrentScore(controlledScore);
      if (controlledScore < 35) setCurrentLevel('low');
      else if (controlledScore <= 70) setCurrentLevel('moderate');
      else setCurrentLevel('high');
    }
  }, [controlledScore]);

  const handleSelectLevel = (lvl: RiskLevel) => {
    if (!interactive) return;
    const s = levelToScore(lvl);
    setCurrentLevel(lvl);
    setCurrentScore(s);
    if (onChange) onChange(lvl, s);
  };

  // Needle angle for semi-circle (from -90deg to +90deg)
  // score 0 -> -85deg, score 50 -> 0deg, score 100 -> +85deg
  const needleAngle = -85 + (currentScore / 100) * 170;

  const getTierInfo = () => {
    switch (currentLevel) {
      case 'low':
        return {
          title: t.lowRisk,
          color: 'text-emerald-400',
          badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          desc: t.lowRiskDesc,
          horizon: locale === 'hi' ? '1 से 3 वर्ष' : '1 to 3 Years',
          mix: locale === 'hi' ? '80% डेट/FD + 20% लार्जकैप' : '80% Debt / FD + 20% Large-Cap Equities'
        };
      case 'moderate':
        return {
          title: t.moderateRisk,
          color: 'text-amber-400',
          badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          desc: t.moderateRiskDesc,
          horizon: locale === 'hi' ? '3 से 7 वर्ष' : '3 to 7 Years',
          mix: locale === 'hi' ? '60% इंडेक्स/इक्विटी + 30% डेट + 10% गोल्ड' : '60% Equity Index + 30% Debt + 10% Gold'
        };
      case 'high':
        return {
          title: t.highRisk,
          color: 'text-red-400',
          badgeColor: 'bg-red-500/15 text-red-400 border-red-500/30',
          desc: t.highRiskDesc,
          horizon: locale === 'hi' ? '7+ वर्ष' : '7+ Years',
          mix: locale === 'hi' ? '85% इक्विटी (मिड/स्मॉलकैप) + 15% फ्लेक्सिकैप' : '85% Diversified Equity + 15% International'
        };
    }
  };

  const info = getTierInfo();

  return (
    <Card 
      className={cn("bg-slate-900/90 border-slate-800 text-slate-100 shadow-md", className)}
      role="region"
      aria-label={t.riskGaugeTitle}
    >
      <CardHeader className="p-4 pb-2 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/15 text-teal-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-white">
                {t.riskGaugeTitle}
              </CardTitle>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {t.riskGaugeSubtitle}
              </p>
            </div>
          </div>

          <Badge className={cn("text-[11px] font-bold border", info.badgeColor)}>
            {info.title}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Semi-Circle SVG Radial Gauge */}
        <div className="flex flex-col items-center justify-center relative pt-2">
          <svg 
            viewBox="0 0 240 135" 
            className="w-56 h-32 overflow-visible select-none"
            role="meter"
            aria-label={`${t.currentRiskScore}: ${info.title} (${currentScore}/100)`}
            aria-valuenow={currentScore}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {/* Arc segments: Low (Green), Moderate (Amber), High (Red) */}
            {/* Low Arc (180deg to 120deg) */}
            <path
              d="M 25 125 A 95 95 0 0 1 72.5 42.7"
              fill="none"
              stroke="#10b981"
              strokeWidth="16"
              strokeLinecap="round"
              className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity"
              onClick={() => handleSelectLevel('low')}
            />
            {/* Moderate Arc (120deg to 60deg) */}
            <path
              d="M 77.5 39.8 A 95 95 0 0 1 162.5 39.8"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="16"
              className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity"
              onClick={() => handleSelectLevel('moderate')}
            />
            {/* High Arc (60deg to 0deg) */}
            <path
              d="M 167.5 42.7 A 95 95 0 0 1 215 125"
              fill="none"
              stroke="#ef4444"
              strokeWidth="16"
              strokeLinecap="round"
              className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity"
              onClick={() => handleSelectLevel('high')}
            />

            {/* Pivot Needle Indicator */}
            <g transform={`translate(120, 125) rotate(${needleAngle})`} className="transition-transform duration-500 ease-out">
              <polygon points="-4,0 4,0 1.5,-85 -1.5,-85" fill="#f8fafc" />
              <circle cx="0" cy="0" r="8" fill="#10b981" stroke="#0f172a" strokeWidth="3" />
            </g>

            {/* Gauge Labels */}
            <text x="25" y="130" fill="#64748b" fontSize="9" fontWeight="600">0</text>
            <text x="115" y="16" fill="#64748b" fontSize="9" fontWeight="600">50</text>
            <text x="210" y="130" fill="#64748b" fontSize="9" fontWeight="600">100</text>
          </svg>

          {/* Current Score Pill */}
          <div className="text-center mt-[-10px]">
            <span className="text-xs font-semibold text-slate-400">
              {t.currentRiskScore}: <strong className={cn("text-sm", info.color)}>{currentScore}/100</strong>
            </span>
          </div>
        </div>

        {/* Interactive 3-Level Selector Buttons with keyboard support */}
        {interactive && (
          <div 
            className="grid grid-cols-3 gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800"
            role="radiogroup"
            aria-label="Risk Level Selection"
          >
            <button
              type="button"
              role="radio"
              aria-checked={currentLevel === 'low'}
              onClick={() => handleSelectLevel('low')}
              className={cn(
                "py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all",
                currentLevel === 'low'
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              )}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{locale === 'hi' ? 'कम' : 'Low'}</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={currentLevel === 'moderate'}
              onClick={() => handleSelectLevel('moderate')}
              className={cn(
                "py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all",
                currentLevel === 'moderate'
                  ? "bg-amber-600 text-white shadow-md shadow-amber-950/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              )}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{locale === 'hi' ? 'मध्यम' : 'Moderate'}</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={currentLevel === 'high'}
              onClick={() => handleSelectLevel('high')}
              className={cn(
                "py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all",
                currentLevel === 'high'
                  ? "bg-red-600 text-white shadow-md shadow-red-950/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              )}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{locale === 'hi' ? 'उच्च' : 'High'}</span>
            </button>
          </div>
        )}

        {/* Detailed Profile Recommendations */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
          <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
            {info.desc}
          </p>

          <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>{t.recommendedHorizon}:</span>
              <strong className="text-slate-200">{info.horizon}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>{t.suitableFor}:</span>
              <strong className="text-slate-200">{info.mix}</strong>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

