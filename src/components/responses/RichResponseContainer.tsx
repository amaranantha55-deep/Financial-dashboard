import React from 'react';
import { Message } from '../../types/finance';
import { useFinancial } from '../../context/FinancialContext';
import { 
  BudgetDonut, 
  EmiCalculatorCard as ReusableEmiCard, 
  SavingsGoalProgress as ReusableSavingsProgress, 
  ComparisonTable as ReusableComparisonTable, 
  GrowthLineChart as ReusableGrowthLineChart, 
  RiskGauge as ReusableRiskGauge, 
  InlineForm as ReusableInlineForm,
  QuickReplyChips
} from '../reusable';
import { DebtStrategyCard } from './DebtStrategyCard';

interface RichResponseContainerProps {
  message: Message;
}

export const RichResponseContainer: React.FC<RichResponseContainerProps> = ({ message }) => {
  const { richType, richData, followUps } = message;
  const { locale, sendMessage } = useFinancial();

  const chipOptions = followUps?.map((f, i) => ({
    id: `chip-${i}`,
    label: f,
  })) || [];

  return (
    <div className="w-full space-y-3 mt-2">
      {/* 1. Budget Donut Component */}
      {richType === 'budget' && richData?.budget && (
        <BudgetDonut
          monthlyIncome={richData.budget.income}
          initialNeeds={richData.budget.needs.percentage}
          initialWants={richData.budget.wants.percentage}
          initialSavings={richData.budget.savings.percentage}
          locale={locale}
          showControls={true}
        />
      )}

      {/* 2. Loan EMI Calculator Card with Stacked Bar Chart */}
      {richType === 'emi' && richData?.emi && (
        <ReusableEmiCard
          initialPrincipal={richData.emi.principal}
          initialRate={richData.emi.interestRate}
          initialTenureYears={richData.emi.tenureYears}
          locale={locale}
          showAmortizationChart={true}
        />
      )}

      {/* 3. SIP vs FD Growth Line Chart & Comparison Table */}
      {richType === 'sip-vs-fd' && richData?.sipVsFd && (
        <div className="space-y-3">
          <ReusableGrowthLineChart
            monthlyAmount={richData.sipVsFd.monthlyInvestment}
            tenureYears={richData.sipVsFd.tenureYears}
            sipCagr={richData.sipVsFd.sipReturnRate}
            fdApy={richData.sipVsFd.fdInterestRate}
            locale={locale}
          />
          <ReusableComparisonTable
            monthlyAmount={richData.sipVsFd.monthlyInvestment}
            tenureYears={richData.sipVsFd.tenureYears}
            sipCagr={richData.sipVsFd.sipReturnRate}
            fdApy={richData.sipVsFd.fdInterestRate}
            locale={locale}
          />
        </div>
      )}

      {/* 4. Savings Goal Progress with Milestone Timeline */}
      {richType === 'savings' && richData?.savings && (
        <ReusableSavingsProgress
          title={richData.savings.title}
          targetAmount={richData.savings.targetAmount}
          currentAmount={richData.savings.currentAmount}
          monthlyDeposit={richData.savings.monthlyDeposit}
          locale={locale}
        />
      )}

      {/* 5. Risk Gauge */}
      {richType === 'risk' && (
        <ReusableRiskGauge
          value={richData?.riskLevel || 'moderate'}
          locale={locale}
        />
      )}

      {/* 6. Inline Form */}
      {richType === 'form' && (
        <ReusableInlineForm
          locale={locale}
          onSubmit={(data) => {
            sendMessage(`I submitted my financial profile: ${data.fullName}, primary focus: ${data.primaryGoal}, monthly savings target: ₹${data.monthlySavingsTarget.toLocaleString('en-IN')}`);
          }}
        />
      )}

      {/* 7. Debt Payoff Strategy */}
      {richType === 'debt' && richData?.debt && (
        <DebtStrategyCard data={richData.debt} />
      )}

      {/* 8. Quick Reply Suggestion Chips */}
      {chipOptions.length > 0 && (
        <div className="pt-2 border-t border-slate-800/60">
          <QuickReplyChips
            options={chipOptions}
            locale={locale}
            variant="default"
            onSelect={(chip) => sendMessage(chip.label)}
          />
        </div>
      )}
    </div>
  );
};
