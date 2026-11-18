import React, { useRef, useState } from 'react';
import { translations, SupportedLocale } from '../../lib/i18n';
import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface QuickReplyOption {
  id: string;
  label: string;
  labelHi?: string;
  icon?: React.ReactNode;
  badge?: string;
}

export interface QuickReplyChipsProps {
  options?: QuickReplyOption[];
  selectedId?: string;
  onSelect?: (option: QuickReplyOption) => void;
  locale?: SupportedLocale;
  className?: string;
  title?: string;
  variant?: 'default' | 'outline' | 'pill';
  size?: 'sm' | 'default' | 'lg';
}

export const defaultQuickReplies: QuickReplyOption[] = [
  { id: '1', label: 'Plan my 50/30/20 monthly budget', labelHi: 'मेरा 50/30/20 मासिक बजट बनाएं' },
  { id: '2', label: 'Calculate loan EMI for ₹25 Lakhs', labelHi: '₹25 लाख के होम लोन की EMI निकालें' },
  { id: '3', label: 'SIP vs Fixed Deposit (₹10,000/mo)', labelHi: 'SIP बनाम FD तुलना (₹10,000/माह)' },
  { id: '4', label: 'Build 6-month emergency safety fund', labelHi: '6 माह का आपातकालीन फंड कैसे बनाएं?' },
  { id: '5', label: 'Analyze my debt avalanche payoff', labelHi: 'क्रेडिट कार्ड ऋण चुकाने की योजना' },
];

export const QuickReplyChips: React.FC<QuickReplyChipsProps> = ({
  options = defaultQuickReplies,
  selectedId,
  onSelect,
  locale = 'en',
  className,
  title,
  variant = 'default',
  size = 'default',
}) => {
  const t = translations[locale];
  const [activeId, setActiveId] = useState<string | undefined>(selectedId);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayTitle = title || t.quickRepliesTitle;

  const handleSelect = (option: QuickReplyOption) => {
    setActiveId(option.id);
    if (onSelect) onSelect(option);
  };

  // Keyboard navigation across chips (ArrowLeft, ArrowRight, Home, End)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('button[data-chip="true"]');
    if (!buttons || buttons.length === 0) return;

    let targetIndex = index;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = (index + 1) % buttons.length;
      buttons[targetIndex].focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = (index - 1 + buttons.length) % buttons.length;
      buttons[targetIndex].focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      buttons[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      buttons[buttons.length - 1].focus();
    }
  };

  return (
    <div className={cn("space-y-2 select-none", className)}>
      {displayTitle && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{displayTitle}</span>
        </div>
      )}

      <div 
        ref={containerRef}
        role="toolbar"
        aria-label={displayTitle}
        className="flex flex-wrap gap-2"
      >
        {options.map((option, index) => {
          const isSelected = activeId === option.id;
          const labelText = locale === 'hi' && option.labelHi ? option.labelHi : option.label;

          return (
            <button
              key={option.id}
              data-chip="true"
              type="button"
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
              aria-label={labelText}
              onClick={() => handleSelect(option)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                "group inline-flex items-center gap-1.5 text-left font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-[0.97]",
                // Sizes
                size === 'sm' && "px-2.5 py-1 text-[11px] rounded-md",
                size === 'default' && "px-3.5 py-1.5 text-xs rounded-full",
                size === 'lg' && "px-4 py-2 text-sm rounded-xl font-semibold",
                // Variants & Active states
                isSelected
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40 border border-emerald-500"
                  : variant === 'outline'
                  ? "bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600"
                  : "bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 shadow-sm"
              )}
            >
              {option.icon ? (
                <span className="shrink-0">{option.icon}</span>
              ) : (
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                  isSelected ? "bg-white" : "bg-emerald-400 group-hover:bg-emerald-300"
                )} />
              )}

              <span>{labelText}</span>

              {option.badge && (
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-800/80 text-emerald-400 border border-emerald-500/30">
                  {option.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

