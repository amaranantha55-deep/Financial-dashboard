export type TopicType = 'budgeting' | 'savings' | 'loans' | 'investments' | 'planning' | 'general' | 'all';

export type RichResponseType = 
  | 'budget' 
  | 'emi' 
  | 'savings' 
  | 'sip-vs-fd' 
  | 'debt' 
  | 'portfolio' 
  | 'risk'
  | 'form'
  | 'general';

export interface BudgetBreakdown {
  income: number;
  needs: { amount: number; percentage: number; items: { name: string; amount: number; color: string }[] };
  wants: { amount: number; percentage: number; items: { name: string; amount: number; color: string }[] };
  savings: { amount: number; percentage: number; items: { name: string; amount: number; color: string }[] };
}

export interface LoanEmiData {
  principal: number;
  interestRate: number; // annual %
  tenureYears: number;
  emi: number;
  totalInterest: number;
  totalPayment: number;
  amortizationSummary: {
    year: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
  }[];
}

export interface SavingsGoalData {
  title: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  monthlyDeposit: number;
  targetDate: string;
  projectedMonths: number;
  milestones: { name: string; reached: boolean; date: string }[];
}

export interface SipVsFdData {
  monthlyInvestment: number;
  tenureYears: number;
  sipReturnRate: number; // e.g., 12%
  fdInterestRate: number; // e.g., 6.5%
  inflationRate: number; // e.g., 5.5%
  sipMaturity: number;
  fdMaturity: number;
  sipTotalWealthGain: number;
  fdTotalWealthGain: number;
  chartData: {
    year: number;
    sipValue: number;
    fdValue: number;
    investedAmount: number;
  }[];
}

export interface DebtAccount {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minPayment: number;
  type: 'credit_card' | 'personal_loan' | 'auto_loan' | 'student_loan';
}

export interface DebtPayoffData {
  totalDebt: number;
  extraMonthlyPayment: number;
  accounts: DebtAccount[];
  snowball: {
    monthsToDebtFree: number;
    totalInterestPaid: number;
    savingsVsMinimums: number;
  };
  avalanche: {
    monthsToDebtFree: number;
    totalInterestPaid: number;
    savingsVsMinimums: number;
  };
}

export type FinancialIntent = 
  | 'budget' 
  | 'loan' 
  | 'savings' 
  | 'investment' 
  | 'planning' 
  | 'debt' 
  | 'out-of-scope';

export interface ExtractedEntities {
  amount?: number | null;
  rate?: number | null;
  tenure?: number | null;
  income?: number | null;
}

export interface GlossaryItem {
  term: string;
  fullForm: string;
  hindiTerm?: string;
  definition: string;
  locale?: 'en' | 'hi';
}

export interface BotResponseComponent {
  type: 
    | 'BudgetDonut' 
    | 'EmiCalculatorCard' 
    | 'SavingsGoalProgress' 
    | 'ComparisonTable' 
    | 'GrowthLineChart' 
    | 'RiskGauge' 
    | 'QuickReplyChips' 
    | 'InlineForm' 
    | 'GlossaryCard'
    | string;
  props: Record<string, any>;
}

export interface BotResponse {
  text: string;
  components: BotResponseComponent[];
  chips: string[];
  assumptions?: string[];
  formula?: string;
  intent?: FinancialIntent | string;
  language?: 'en' | 'hi';
  glossary?: GlossaryItem[];
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
  topic?: TopicType;
  botResponse?: BotResponse;
  richType?: RichResponseType;
  richData?: {
    budget?: BudgetBreakdown;
    emi?: LoanEmiData;
    savings?: SavingsGoalData;
    sipVsFd?: SipVsFdData;
    debt?: DebtPayoffData;
    [key: string]: any;
  };
  followUps?: string[];
  isStreaming?: boolean;
  liked?: boolean;
  disliked?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  topic: TopicType;
  messages: Message[];
  pinned?: boolean;
  metricsSnapshot?: {
    budgetTotal?: number;
    loanEmi?: number;
    savingsProgress?: number;
  };
}

export interface LiveDashboardState {
  currency: string;
  monthlyIncome: number;
  budget: BudgetBreakdown;
  loan: LoanEmiData;
  savingsGoal: SavingsGoalData;
  sipVsFd: SipVsFdData;
  debt: DebtPayoffData;
  creditScore: number;
  emergencyMonthsRunway: number;
}
