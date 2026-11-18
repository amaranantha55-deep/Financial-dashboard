import React from 'react';
import { GlossaryItem } from '../../types/finance';
import { SupportedLocale } from '../../lib/i18n';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { BookOpen, HelpCircle, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface GlossaryCardProps {
  items: GlossaryItem[];
  locale?: SupportedLocale;
  title?: string;
  className?: string;
  compact?: boolean;
}

export const GlossaryCard: React.FC<GlossaryCardProps> = ({
  items,
  locale = 'en',
  title,
  className,
  compact = false
}) => {
  if (!items || items.length === 0) return null;
  const isHi = locale === 'hi';

  const defaultTitle = isHi 
    ? 'वित्तीय शब्दावली एवं अवधारणाएं (Financial Glossary)' 
    : 'Financial Glossary & Core Concepts';

  return (
    <Card 
      className={cn(
        "bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-indigo-950/30 border-indigo-500/30 text-slate-100 shadow-md",
        className
      )}
      role="region"
      aria-label={title || defaultTitle}
    >
      <CardHeader className="p-3.5 pb-2 border-b border-indigo-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                {title || defaultTitle}
                <Sparkles className="w-3 h-3 text-amber-400" />
              </CardTitle>
              {!compact && (
                <p className="text-[11px] text-slate-400">
                  {isHi ? 'भारतीय वित्तीय नियमों एवं अवधारणाओं की सरल व्याख्या' : 'Essential financial definitions for informed decision making'}
                </p>
              )}
            </div>
          </div>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {items.length} {items.length === 1 ? 'Term' : 'Terms'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 space-y-3">
        {items.map((item, idx) => (
          <div 
            key={idx}
            className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/30 transition-all space-y-1.5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {item.term}
              </span>
              <span className="text-xs font-semibold text-slate-200">
                {item.fullForm}
              </span>
              {item.hindiTerm && (
                <span className="text-xs text-amber-300/90 font-medium">
                  ({item.hindiTerm})
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {item.definition}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

