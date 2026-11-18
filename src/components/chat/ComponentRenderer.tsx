import React, { useState } from 'react';
import { BotResponse, BotResponseComponent } from '../../types/finance';
import { SupportedLocale } from '../../lib/i18n';
import { useFinancial } from '../../context/FinancialContext';
import { 
  BudgetDonut,
  EmiCalculatorCard,
  SavingsGoalProgress,
  ComparisonTable,
  GrowthLineChart,
  RiskGauge,
  QuickReplyChips,
  InlineForm,
  GlossaryCard
} from '../reusable';
import { 
  Calculator, 
  CheckCircle2, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  FunctionSquare
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ComponentRendererProps {
  response: BotResponse;
  onSelectChip?: (chipText: string) => void;
  onSendMessage?: (msg: string) => void;
  locale?: SupportedLocale;
  className?: string;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  response,
  onSelectChip,
  onSendMessage,
  locale = 'en',
  className,
}) => {
  const [showAssumptions, setShowAssumptions] = useState(true);
  const financial = useFinancial();
  const triggerSend = onSendMessage || financial?.sendMessage;

  // Map component type string to actual React component
  const renderSingleComponent = (component: BotResponseComponent, index: number) => {
    const props = { ...component.props, locale: component.props.locale || locale };

    switch (component.type) {
      case 'BudgetDonut':
        return <BudgetDonut key={index} {...props} />;
      case 'EmiCalculatorCard':
        return <EmiCalculatorCard key={index} {...props} />;
      case 'SavingsGoalProgress':
        return <SavingsGoalProgress key={index} {...props} />;
      case 'ComparisonTable':
        return <ComparisonTable key={index} {...props} />;
      case 'GrowthLineChart':
        return <GrowthLineChart key={index} {...props} />;
      case 'RiskGauge':
        return <RiskGauge key={index} {...props} />;
      case 'QuickReplyChips':
        return <QuickReplyChips key={index} {...props} />;
      case 'InlineForm':
        return (
          <InlineForm 
            key={index} 
            onSubmitMessage={(msg) => {
              if (triggerSend) triggerSend(msg);
            }}
            {...props} 
          />
        );
      case 'GlossaryCard':
        return <GlossaryCard key={index} items={(props as any).items || response.glossary || []} {...props} />;
      default:
        console.warn(`[ComponentRenderer] Unknown component type: "${component.type}"`);
        return null;
    }
  };

  const isHi = locale === 'hi';

  return (
    <div className={cn("w-full space-y-3.5 mt-3", className)}>
      {/* Embedded Dynamic Interactive Components */}
      {response.components && response.components.length > 0 && (
        <div className="space-y-3">
          {response.components.map((comp, idx) => renderSingleComponent(comp, idx))}
        </div>
      )}

      {/* "Why this answer?" Explanatory Expander (Trust, Formulas & Assumptions) */}
      {(response.formula || (response.assumptions && response.assumptions.length > 0)) && (
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden text-xs shadow-sm">
          <button
            type="button"
            onClick={() => setShowAssumptions(prev => !prev)}
            className="w-full flex items-center justify-between p-2.5 text-left text-slate-300 hover:text-white hover:bg-slate-900/50 transition-colors"
            aria-expanded={showAssumptions}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-semibold text-xs text-amber-300/90">
                {isHi ? 'यह उत्तर कैसे आया? (Why this answer?)' : 'Why this answer? (Formulas & Assumptions)'}
              </span>
            </div>
            {showAssumptions ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {showAssumptions && (
            <div className="px-3 pb-3 pt-2 space-y-3 border-t border-slate-800/70 bg-slate-950/40">
              {/* Formula */}
              {response.formula && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    <Calculator className="w-3 h-3 text-emerald-400" />
                    <span>{isHi ? 'प्रयुक्त वित्तीय सूत्र (Formula Applied)' : 'Mathematical Formula Applied'}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-200 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80 break-words">
                    {response.formula}
                  </div>
                </div>
              )}

              {/* Assumptions */}
              {response.assumptions && response.assumptions.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-400">
                    <Info className="w-3 h-3 text-sky-400" />
                    <span>{isHi ? 'मॉडलिंग मान्यताएं (Key Assumptions)' : 'Key Assumptions'}</span>
                  </div>
                  <div className="space-y-1">
                    {response.assumptions.map((assumption, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{assumption}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regulatory disclaimer */}
              <div className="text-[10px] text-slate-500 italic border-t border-slate-800/60 pt-2">
                {isHi
                  ? 'फिनबॉट केवल शैक्षिक और वित्तीय मॉडलिंग उद्देश्यों के लिए है। यह सेबी (SEBI) पंजीकृत निवेश सलाह नहीं है।'
                  : 'FinBot provides algorithmic financial simulations for educational purposes only. Not SEBI-registered advisory.'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Financial Glossary Definitions Card */}
      {response.glossary && response.glossary.length > 0 && (
        <GlossaryCard items={response.glossary} locale={locale} />
      )}

      {/* Suggested Query Chips */}
      {response.chips && response.chips.length > 0 && (
        <div className="pt-2 border-t border-slate-800/60">
          <QuickReplyChips
            options={response.chips.map((c, i) => ({ id: `chip-${i}`, label: c }))}
            locale={locale}
            variant="default"
            onSelect={(opt) => onSelectChip && onSelectChip(opt.label)}
          />
        </div>
      )}
    </div>
  );
};

