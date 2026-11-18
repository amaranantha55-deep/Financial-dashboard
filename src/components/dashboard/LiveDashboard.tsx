import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { 
  BudgetDonut,
  EmiCalculatorCard as ReusableEmiCard,
  SavingsGoalProgress as ReusableSavingsProgress,
  GrowthLineChart as ReusableGrowthLineChart,
  ComparisonTable as ReusableComparisonTable,
  RiskGauge as ReusableRiskGauge
} from '../reusable';
import { InteractiveScenarioSimulator } from './InteractiveScenarioSimulator';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  BarChart2, 
  Activity, 
  Layers, 
  TrendingUp, 
  Sliders, 
  X,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { formatINR } from '../../lib/i18n';

interface LiveDashboardProps {
  onCloseMobile?: () => void;
}

export const LiveDashboard: React.FC<LiveDashboardProps> = ({ onCloseMobile }) => {
  const { dashboard, toggleRightPanel, locale } = useFinancial();
  const [activeTab, setActiveTab] = useState('overview');

  const { monthlyIncome, creditScore, emergencyMonthsRunway } = dashboard;
  const isHi = locale === 'hi';

  return (
    <aside className="w-84 sm:w-96 h-full flex flex-col bg-slate-950/95 border-l border-slate-800/80 select-none overflow-hidden text-slate-200">
      {/* Header with Live Sync Indicator */}
      <div className="p-3.5 pb-2.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-2">
          <div className="relative">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-white uppercase tracking-wider">
                {isHi ? 'लाइव वित्तीय डैशबोर्ड' : 'Live Copilot Dashboard'}
              </span>
            </div>
            <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              {isHi ? 'चैट से रीयल-टाइम सिंक' : 'Synced in Real-Time with Chat'}
            </div>
          </div>
        </div>

        {onCloseMobile ? (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={toggleRightPanel}
            className="hidden lg:inline-flex p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Collapse dashboard"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Top Quick Metrics Strip */}
      <div className="grid grid-cols-3 gap-1.5 p-3 pb-2 border-b border-slate-800/60 bg-slate-950/40 text-center">
        <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
          <div className="text-[9px] text-slate-400 uppercase tracking-wider">
            {isHi ? 'मासिक आय' : 'Net Income'}
          </div>
          <div className="text-xs font-bold text-white mt-0.5">
            {formatINR(monthlyIncome, { locale })}
          </div>
        </div>

        <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
          <div className="text-[9px] text-slate-400 uppercase tracking-wider">
            {isHi ? 'क्रेडिट स्कोर' : 'Credit Score'}
          </div>
          <div className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center justify-center gap-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>{creditScore}</span>
          </div>
        </div>

        <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
          <div className="text-[9px] text-slate-400 uppercase tracking-wider">
            {isHi ? 'सुरक्षा कवच' : 'Safety Net'}
          </div>
          <div className="text-xs font-bold text-sky-400 mt-0.5">
            {emergencyMonthsRunway} {isHi ? 'माह' : 'mos'}
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="px-3 pt-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="overview">
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {isHi ? 'स्नैपशॉट' : 'Snapshot'}
              </span>
            </TabsTrigger>
            <TabsTrigger value="compounding">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {isHi ? 'धन वृद्धि' : 'Growth'}
              </span>
            </TabsTrigger>
            <TabsTrigger value="simulator">
              <span className="flex items-center gap-1">
                <Sliders className="w-3 h-3" />
                {isHi ? 'सैंडबॉक्स' : 'Sandbox'}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Scrollable Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
        {activeTab === 'overview' && (
          <div className="space-y-3.5 animate-fadeIn">
            {/* 1. Budget Donut with 50/30/20 Sliders */}
            <BudgetDonut
              monthlyIncome={monthlyIncome}
              initialNeeds={dashboard.budget.needs.percentage}
              initialWants={dashboard.budget.wants.percentage}
              initialSavings={dashboard.budget.savings.percentage}
              locale={locale}
              showControls={true}
              compact={true}
            />

            {/* 2. Loan EMI Calculator Card */}
            <ReusableEmiCard
              initialPrincipal={dashboard.loan.principal}
              initialRate={dashboard.loan.interestRate}
              initialTenureYears={dashboard.loan.tenureYears}
              locale={locale}
              showAmortizationChart={true}
            />

            {/* 3. Savings Goal Progress */}
            <ReusableSavingsProgress
              targetAmount={dashboard.savingsGoal.targetAmount}
              currentAmount={dashboard.savingsGoal.currentAmount}
              monthlyDeposit={dashboard.savingsGoal.monthlyDeposit}
              locale={locale}
            />
          </div>
        )}

        {activeTab === 'compounding' && (
          <div className="space-y-3.5 animate-fadeIn">
            {/* 10-Year Compounding Chart */}
            <ReusableGrowthLineChart
              monthlyAmount={dashboard.sipVsFd.monthlyInvestment}
              tenureYears={dashboard.sipVsFd.tenureYears}
              sipCagr={dashboard.sipVsFd.sipReturnRate}
              fdApy={dashboard.sipVsFd.fdInterestRate}
              locale={locale}
            />

            {/* Comparison Table */}
            <ReusableComparisonTable
              monthlyAmount={dashboard.sipVsFd.monthlyInvestment}
              tenureYears={dashboard.sipVsFd.tenureYears}
              sipCagr={dashboard.sipVsFd.sipReturnRate}
              fdApy={dashboard.sipVsFd.fdInterestRate}
              locale={locale}
            />
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="space-y-3.5 animate-fadeIn">
            {/* Risk Gauge */}
            <ReusableRiskGauge
              value="moderate"
              locale={locale}
            />

            {/* Interactive Scenario Simulator */}
            <InteractiveScenarioSimulator />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between text-[10px] text-slate-400 px-3">
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          {isHi ? 'रीयल-टाइम वित्तीय इंजन' : 'Reactive Financial Engine'}
        </span>
        <span className="text-slate-500 font-mono">₹ Indian Rupee</span>
      </div>
    </aside>
  );
};
