import React, { useState } from 'react';
import { SupportedLocale, translations } from '../../lib/i18n';
import { 
  BudgetDonut,
  EmiCalculatorCard,
  SavingsGoalProgress,
  ComparisonTable,
  GrowthLineChart,
  RiskGauge,
  QuickReplyChips,
  InlineForm,
  GlossaryCard,
  RiskLevel
} from '../reusable';
import { getGlossaryItems } from '../../lib/glossary';
import { 
  BookOpen, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Copy, 
  Check, 
  Globe, 
  ArrowLeft, 
  Sliders, 
  Code, 
  Eye, 
  ShieldCheck,
  PieChart,
  Landmark,
  PiggyBank,
  Table as TableIcon,
  TrendingUp,
  Compass,
  MessageSquare,
  FileText,
  Layers,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

export type ComponentStoryId = 
  | 'budget-donut'
  | 'emi-calculator'
  | 'savings-goal'
  | 'comparison-table'
  | 'growth-chart'
  | 'risk-gauge'
  | 'quick-replies'
  | 'inline-form'
  | 'glossary-card'
  | 'all-components';

interface StorybookDemoProps {
  onBackToChat: () => void;
}

export const StorybookDemo: React.FC<StorybookDemoProps> = ({ onBackToChat }) => {
  const [activeStory, setActiveStory] = useState<ComponentStoryId>('budget-donut');
  const [locale, setLocale] = useState<SupportedLocale>('en');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'controls' | 'code' | 'a11y'>('controls');
  const [copiedCode, setCopiedCode] = useState(false);

  // Component Knobs / Prop states
  // 1. BudgetDonut Knobs
  const [budgetIncome, setBudgetIncome] = useState(100000);
  const [budgetNeeds, setBudgetNeeds] = useState(50);
  const [budgetWants, setBudgetWants] = useState(30);
  const [budgetSavings, setBudgetSavings] = useState(20);

  // 2. EmiCalculatorCard Knobs
  const [emiPrincipal, setEmiPrincipal] = useState(2500000); // 25 Lakhs
  const [emiRate, setEmiRate] = useState(8.5);
  const [emiTenure, setEmiTenure] = useState(15);
  const [showAmortization, setShowAmortization] = useState(true);

  // 3. SavingsGoalProgress Knobs
  const [savingsTarget, setSavingsTarget] = useState(600000); // 6 Lakhs
  const [savingsCurrent, setSavingsCurrent] = useState(380000);
  const [savingsDeposit, setSavingsDeposit] = useState(30000);

  // 4. SIP vs FD Knobs
  const [sipMonthly, setSipMonthly] = useState(15000);
  const [sipTenure, setSipTenure] = useState(10);
  const [sipCagr, setSipCagr] = useState(12.5);
  const [fdApy, setFdApy] = useState(6.8);

  // 5. RiskGauge Knobs
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('moderate');

  // 6. QuickReplyChips Knobs
  const [chipSize, setChipSize] = useState<'sm' | 'default' | 'lg'>('default');
  const [chipVariant, setChipVariant] = useState<'default' | 'outline' | 'pill'>('default');

  const t = translations[locale];

  const stories: { id: ComponentStoryId; name: string; icon: React.ComponentType<{ className?: string }>; tag: string }[] = [
    { id: 'budget-donut', name: 'BudgetDonut', icon: PieChart, tag: '50/30/20' },
    { id: 'emi-calculator', name: 'EmiCalculatorCard', icon: Landmark, tag: 'Amortization' },
    { id: 'savings-goal', name: 'SavingsGoalProgress', icon: PiggyBank, tag: 'Milestones' },
    { id: 'comparison-table', name: 'ComparisonTable', icon: TableIcon, tag: 'SIP vs FD' },
    { id: 'growth-chart', name: 'GrowthLineChart', icon: TrendingUp, tag: 'Recharts' },
    { id: 'risk-gauge', name: 'RiskGauge', icon: Compass, tag: 'Meter' },
    { id: 'quick-replies', name: 'QuickReplyChips', icon: MessageSquare, tag: 'Keyboard a11y' },
    { id: 'inline-form', name: 'InlineForm', icon: FileText, tag: 'Validated' },
    { id: 'glossary-card', name: 'GlossaryCard', icon: BookOpen, tag: 'Bilingual' },
    { id: 'all-components', name: 'Full Component Suite', icon: Layers, tag: 'Overview' },
  ];

  // Generate JSX Code Snippet based on active story
  const getCodeSnippet = (): string => {
    switch (activeStory) {
      case 'budget-donut':
        return `<BudgetDonut
  monthlyIncome={${budgetIncome}}
  initialNeeds={${budgetNeeds}}
  initialWants={${budgetWants}}
  initialSavings={${budgetSavings}}
  locale="${locale}"
  showControls={true}
  onChange={({ needs, wants, savings, total }) => {
    console.log('Budget updated:', { needs, wants, savings, total });
  }}
/>`;
      case 'emi-calculator':
        return `<EmiCalculatorCard
  initialPrincipal={${emiPrincipal}}
  initialRate={${emiRate}}
  initialTenureYears={${emiTenure}}
  showAmortizationChart={${showAmortization}}
  locale="${locale}"
  onChange={({ emi, totalInterest, totalPayment }) => {
    console.log('EMI:', emi, 'Total Interest:', totalInterest);
  }}
/>`;
      case 'savings-goal':
        return `<SavingsGoalProgress
  title="${locale === 'hi' ? 'आपातकालीन सुरक्षा फंड' : 'Emergency Safety Net'}"
  targetAmount={${savingsTarget}}
  currentAmount={${savingsCurrent}}
  monthlyDeposit={${savingsDeposit}}
  locale="${locale}"
  onDepositChange={(newDeposit) => console.log('Deposit:', newDeposit)}
/>`;
      case 'comparison-table':
        return `<ComparisonTable
  monthlyAmount={${sipMonthly}}
  tenureYears={${sipTenure}}
  sipCagr={${sipCagr}}
  fdApy={${fdApy}}
  locale="${locale}"
/>`;
      case 'growth-chart':
        return `<GrowthLineChart
  monthlyAmount={${sipMonthly}}
  tenureYears={${sipTenure}}
  sipCagr={${sipCagr}}
  fdApy={${fdApy}}
  showInvestedLine={true}
  locale="${locale}"
/>`;
      case 'risk-gauge':
        return `<RiskGauge
  value="${riskLevel}"
  interactive={true}
  locale="${locale}"
  onChange={(level, score) => console.log('Risk selected:', level, score)}
/>`;
      case 'quick-replies':
        return `<QuickReplyChips
  locale="${locale}"
  variant="${chipVariant}"
  size="${chipSize}"
  onSelect={(option) => console.log('Selected:', option)}
/>`;
      case 'inline-form':
        return `<InlineForm
  intent="loan"
  missingFields={['amount', 'rate', 'tenure']}
  locale="${locale}"
  onSubmitMessage={(msg) => console.log('Generated Query:', msg)}
/>`;
      case 'glossary-card':
        return `<GlossaryCard
  items={getGlossaryItems(['EMI', 'SIP', 'FD', 'CAGR', '50/30/20'], '${locale}')}
  locale="${locale}"
/>`;
      default:
        return `// Import all components
import {
  BudgetDonut,
  EmiCalculatorCard,
  SavingsGoalProgress,
  ComparisonTable,
  GrowthLineChart,
  RiskGauge,
  QuickReplyChips,
  InlineForm
} from './components/reusable';`;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      {/* Top Storybook Navigation Bar */}
      <header className="h-14 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={onBackToChat}
            className="text-xs text-slate-300 hover:text-white border-slate-700 h-8 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to FinBot Chat</span>
          </Button>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center shadow-md shadow-rose-500/20">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-white">
                  FinBot Storybook
                </span>
                <span className="text-[10px] bg-rose-500/15 text-rose-400 px-1.5 py-0.2 rounded font-mono font-semibold border border-rose-500/30">
                  v2.0
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Toolbar: Language Switcher + Viewport Toggles */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Button */}
          <button
            onClick={() => setLocale(prev => prev === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors"
            title="Toggle between English and Hindi"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{locale === 'en' ? 'English (EN)' : 'हिन्दी (HI 🇮🇳)'}</span>
          </button>

          {/* Viewport Toggles */}
          <div className="hidden sm:flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewport('desktop')}
              title="Desktop View (Full)"
              className={cn("p-1.5 rounded", viewport === 'desktop' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white")}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              title="Tablet View (768px)"
              className={cn("p-1.5 rounded", viewport === 'tablet' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white")}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              title="Mobile View (375px)"
              className={cn("p-1.5 rounded", viewport === 'mobile' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white")}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Storybook Layout: Sidebar + Canvas + Controls */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Component Stories List */}
        <nav className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0 select-none">
          <div className="p-3 border-b border-slate-800/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Component Stories ({stories.length})
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {stories.map((story) => {
              const Icon = story.icon;
              const isActive = activeStory === story.id;
              return (
                <button
                  key={story.id}
                  onClick={() => setActiveStory(story.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all text-left",
                    isActive
                      ? "bg-rose-500/15 text-rose-300 font-semibold border border-rose-500/40 shadow-sm"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-rose-400" : "text-slate-500")} />
                    <span className="truncate">{story.name}</span>
                  </div>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800 font-mono">
                    {story.tag}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500">
            Supports Hindi & English • Indian ₹ Formatting • ARIA & Keyboard Friendly
          </div>
        </nav>

        {/* Center & Bottom: Canvas & Knobs Panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-hidden">
          {/* Canvas Preview Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-start bg-slate-950/80 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
            <div 
              className={cn(
                "w-full transition-all duration-300",
                viewport === 'mobile' && "max-w-[375px]",
                viewport === 'tablet' && "max-w-[768px]",
                viewport === 'desktop' && "max-w-3xl"
              )}
            >
              {/* Story Canvas Component Rendering */}
              {activeStory === 'budget-donut' && (
                <BudgetDonut
                  monthlyIncome={budgetIncome}
                  initialNeeds={budgetNeeds}
                  initialWants={budgetWants}
                  initialSavings={budgetSavings}
                  locale={locale}
                />
              )}

              {activeStory === 'emi-calculator' && (
                <EmiCalculatorCard
                  initialPrincipal={emiPrincipal}
                  initialRate={emiRate}
                  initialTenureYears={emiTenure}
                  showAmortizationChart={showAmortization}
                  locale={locale}
                />
              )}

              {activeStory === 'savings-goal' && (
                <SavingsGoalProgress
                  targetAmount={savingsTarget}
                  currentAmount={savingsCurrent}
                  monthlyDeposit={savingsDeposit}
                  locale={locale}
                />
              )}

              {activeStory === 'comparison-table' && (
                <ComparisonTable
                  monthlyAmount={sipMonthly}
                  tenureYears={sipTenure}
                  sipCagr={sipCagr}
                  fdApy={fdApy}
                  locale={locale}
                />
              )}

              {activeStory === 'growth-chart' && (
                <GrowthLineChart
                  monthlyAmount={sipMonthly}
                  tenureYears={sipTenure}
                  sipCagr={sipCagr}
                  fdApy={fdApy}
                  showInvestedLine={true}
                  locale={locale}
                />
              )}

              {activeStory === 'risk-gauge' && (
                <RiskGauge
                  value={riskLevel}
                  locale={locale}
                  onChange={(lvl) => setRiskLevel(lvl)}
                />
              )}

              {activeStory === 'quick-replies' && (
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                  <div className="text-sm font-semibold text-white">Interactive Keyboard Toolbar</div>
                  <p className="text-xs text-slate-400">
                    Use <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">←</kbd> and <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">→</kbd> to navigate, and <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Enter</kbd> to activate.
                  </p>
                  <QuickReplyChips
                    locale={locale}
                    variant={chipVariant}
                    size={chipSize}
                  />
                </div>
              )}

              {activeStory === 'inline-form' && (
                <div className="space-y-6 w-full">
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {locale === 'hi' ? '1. इकाई संकलन मोड (लापता इकाइयाँ भरने हेतु)' : '1. Missing Entity Collection Mode (Zero-Guesswork)'}
                    </div>
                    <InlineForm
                      intent="loan"
                      missingFields={['amount', 'rate', 'tenure']}
                      locale={locale}
                      onSubmitMessage={(msg) => alert(`Form Submitted Query: "${msg}"`)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                      {locale === 'hi' ? '2. उपयोगकर्ता प्रोफाइल मोड' : '2. Financial Profile Questionnaire Mode'}
                    </div>
                    <InlineForm
                      intent="profile"
                      locale={locale}
                    />
                  </div>
                </div>
              )}

              {activeStory === 'glossary-card' && (
                <GlossaryCard
                  items={getGlossaryItems(['EMI', 'SIP', 'FD', 'CAGR', '50/30/20'], locale)}
                  locale={locale}
                />
              )}

              {activeStory === 'all-components' && (
                <div className="space-y-6">
                  <BudgetDonut monthlyIncome={budgetIncome} locale={locale} />
                  <EmiCalculatorCard initialPrincipal={emiPrincipal} locale={locale} />
                  <SavingsGoalProgress locale={locale} />
                  <GrowthLineChart locale={locale} />
                  <ComparisonTable locale={locale} />
                  <RiskGauge locale={locale} />
                  <QuickReplyChips locale={locale} />
                  <InlineForm intent="loan" missingFields={['amount', 'rate', 'tenure']} locale={locale} />
                  <GlossaryCard items={getGlossaryItems(['EMI', 'SIP'], locale)} locale={locale} />
                </div>
              )}
            </div>
          </main>

          {/* Bottom Controls / Code / a11y Panel */}
          <section className="h-60 bg-slate-900 border-t border-slate-800 flex flex-col shrink-0">
            {/* Panel Header Tabs */}
            <div className="flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('controls')}
                  className={cn(
                    "px-3 py-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all",
                    activeTab === 'controls' 
                      ? "border-rose-500 text-white" 
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  )}
                >
                  <Sliders className="w-3.5 h-3.5 text-rose-400" />
                  <span>Controls & Knobs</span>
                </button>

                <button
                  onClick={() => setActiveTab('code')}
                  className={cn(
                    "px-3 py-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all",
                    activeTab === 'code' 
                      ? "border-rose-500 text-white" 
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  )}
                >
                  <Code className="w-3.5 h-3.5 text-rose-400" />
                  <span>JSX Code</span>
                </button>

                <button
                  onClick={() => setActiveTab('a11y')}
                  className={cn(
                    "px-3 py-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all",
                    activeTab === 'a11y' 
                      ? "border-rose-500 text-white" 
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  )}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Accessibility (a11y)</span>
                </button>
              </div>

              {activeTab === 'code' && (
                <button
                  onClick={handleCopyCode}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy JSX'}</span>
                </button>
              )}
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-4 text-xs">
              {activeTab === 'controls' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Language Knob (Global) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400">Locale (Language):</label>
                    <select
                      value={locale}
                      onChange={(e) => setLocale(e.target.value as SupportedLocale)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
                    >
                      <option value="en">en (English)</option>
                      <option value="hi">hi (हिन्दी 🇮🇳)</option>
                    </select>
                  </div>

                  {/* Story-specific Knobs */}
                  {activeStory === 'budget-donut' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400">Monthly Income (₹):</label>
                        <input
                          type="number"
                          step={5000}
                          value={budgetIncome}
                          onChange={(e) => setBudgetIncome(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400">Needs (%):</label>
                        <input
                          type="number"
                          value={budgetNeeds}
                          onChange={(e) => setBudgetNeeds(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400">Wants (%):</label>
                        <input
                          type="number"
                          value={budgetWants}
                          onChange={(e) => setBudgetWants(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
                        />
                      </div>
                    </>
                  )}

                  {activeStory === 'emi-calculator' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400">Loan Principal (₹):</label>
                        <input
                          type="number"
                          step={50000}
                          value={emiPrincipal}
                          onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400">Interest Rate (%):</label>
                        <input
                          type="number"
                          step={0.1}
                          value={emiRate}
                          onChange={(e) => setEmiRate(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400">Tenure (Years):</label>
                        <input
                          type="number"
                          value={emiTenure}
                          onChange={(e) => setEmiTenure(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
                        />
                      </div>
                    </>
                  )}

                  {activeStory === 'risk-gauge' && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Risk Level:</label>
                      <select
                        value={riskLevel}
                        onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200"
                      >
                        <option value="low">Low (Conservative)</option>
                        <option value="moderate">Moderate (Balanced)</option>
                        <option value="high">High (Aggressive)</option>
                      </select>
                    </div>
                  )}

                  {(activeStory === 'comparison-table' || activeStory === 'growth-chart') && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400">Monthly SIP/FD (₹):</label>
                        <input
                          type="number"
                          step={1000}
                          value={sipMonthly}
                          onChange={(e) => setSipMonthly(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400">SIP CAGR (%):</label>
                        <input
                          type="number"
                          step={0.5}
                          value={sipCagr}
                          onChange={(e) => setSipCagr(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400">FD APY (%):</label>
                        <input
                          type="number"
                          step={0.1}
                          value={fdApy}
                          onChange={(e) => setFdApy(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
                        />
                      </div>
                    </>
                  )}

                  {activeStory === 'quick-replies' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400">Chip Size:</label>
                        <select
                          value={chipSize}
                          onChange={(e) => setChipSize(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
                        >
                          <option value="sm">Small (sm)</option>
                          <option value="default">Default</option>
                          <option value="lg">Large (lg)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400">Chip Variant:</label>
                        <select
                          value={chipVariant}
                          onChange={(e) => setChipVariant(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
                        >
                          <option value="default">Default Solid</option>
                          <option value="outline">Outline</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'code' && (
                <pre className="font-mono text-xs text-emerald-300 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto">
                  {getCodeSnippet()}
                </pre>
              )}

              {activeTab === 'a11y' && (
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Accessibility Standards Compliance (WCAG 2.1 AA)</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs pl-1">
                    <li><strong className="text-slate-200">Semantic ARIA Roles:</strong> Uses <code>role="slider"</code>, <code>role="progressbar"</code>, <code>role="meter"</code>, <code>role="toolbar"</code>, and <code>role="table"</code> with corresponding min/max/current values.</li>
                    <li><strong className="text-slate-200">Keyboard Navigation:</strong> All sliders and chips are navigable using <kbd>Arrow</kbd> keys, <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>Tab</kbd>, and <kbd>Enter</kbd>.</li>
                    <li><strong className="text-slate-200">Screen Reader Labels:</strong> Distinct <code>aria-label</code> and <code>htmlFor</code> association on every input and metric card.</li>
                    <li><strong className="text-slate-200">Indian Rupee Currency Formatting:</strong> Number grouping adheres to Indian Lakh/Crore commas (<code>en-IN</code>) with localized Hindi numbers.</li>
                    <li><strong className="text-slate-200">High Contrast & Visible Focus:</strong> Distinct focus rings (<code>focus-visible:ring-2</code>) on all active elements.</li>
                  </ul>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

