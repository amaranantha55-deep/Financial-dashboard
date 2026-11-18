import React, { useState, useId } from 'react';
import { translations, SupportedLocale, formatINR } from '../../lib/i18n';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { 
  CheckCircle2, 
  Target, 
  RotateCcw, 
  Send, 
  Calculator, 
  Coins, 
  Percent, 
  Clock, 
  Wallet,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FinancialProfileFormData {
  fullName: string;
  email: string;
  primaryGoal: 'budgeting' | 'loan_payoff' | 'emergency_fund' | 'wealth_investing' | 'retirement';
  monthlySavingsTarget: number;
}

export interface EntityFormData {
  amount?: number;
  rate?: number;
  tenure?: number;
  income?: number;
}

export interface InlineFormProps {
  // Mode 1: Entity collection mode when entities are missing
  intent?: 'loan' | 'budget' | 'savings' | 'investment' | 'planning' | 'debt' | 'profile' | string;
  title?: string;
  missingFields?: string[];
  prefilledValues?: {
    amount?: number | null;
    rate?: number | null;
    tenure?: number | null;
    income?: number | null;
  };
  onSubmitEntities?: (entities: EntityFormData) => void;
  onSubmitMessage?: (generatedMessage: string) => void;

  // Mode 2: Profile collection mode
  initialData?: Partial<FinancialProfileFormData>;
  onSubmit?: (data: any) => void;
  onReset?: () => void;
  locale?: SupportedLocale;
  className?: string;
  compact?: boolean;
}

export const InlineForm: React.FC<InlineFormProps> = ({
  intent,
  title,
  missingFields,
  prefilledValues,
  onSubmitEntities,
  onSubmitMessage,
  initialData,
  onSubmit,
  onReset,
  locale = 'en',
  className,
  compact = false,
}) => {
  const t = translations[locale];
  const isHi = locale === 'hi';

  const isEntityCollection = Boolean(intent && intent !== 'profile');

  // State for Entity Collection Mode
  const [entities, setEntities] = useState<EntityFormData>({
    amount: prefilledValues?.amount ?? (intent === 'loan' ? 2500000 : intent === 'investment' ? 10000 : intent === 'savings' ? 500000 : intent === 'debt' ? 300000 : 1000000),
    rate: prefilledValues?.rate ?? (intent === 'loan' ? 8.5 : intent === 'investment' ? 12.0 : intent === 'debt' ? 24.0 : 8.0),
    tenure: prefilledValues?.tenure ?? (intent === 'loan' ? 15 : intent === 'investment' ? 10 : 5),
    income: prefilledValues?.income ?? 100000,
  });

  // State for Profile Mode
  const [profileData, setProfileData] = useState<FinancialProfileFormData>({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    primaryGoal: initialData?.primaryGoal || 'wealth_investing',
    monthlySavingsTarget: initialData?.monthlySavingsTarget || 20000,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Quick preset helpers for Indian amounts
  const handleAmountPreset = (amt: number) => {
    setEntities(prev => ({ ...prev, amount: amt }));
  };

  const handleIncomePreset = (inc: number) => {
    setEntities(prev => ({ ...prev, income: inc }));
  };

  // Build natural prompt string based on submitted entity values
  const constructQueryFromEntities = (): string => {
    switch (intent) {
      case 'loan':
        return isHi
          ? `₹${(entities.amount || 2500000).toLocaleString('en-IN')} के लोन पर ${entities.rate || 8.5}% दर से ${entities.tenure || 15} साल की ईएमआई निकालें`
          : `Calculate loan EMI for ₹${(entities.amount || 2500000).toLocaleString('en-IN')} at ${entities.rate || 8.5}% over ${entities.tenure || 15} years`;
      case 'budget':
        return isHi
          ? `₹${(entities.income || 100000).toLocaleString('en-IN')} की मासिक आय हेतु 50/30/20 बजट प्लान बनाएं`
          : `Plan my monthly 50/30/20 budget for ₹${(entities.income || 100000).toLocaleString('en-IN')} income`;
      case 'investment':
        return isHi
          ? `SIP बनाम FD: ₹${(entities.amount || 10000).toLocaleString('en-IN')} मासिक ${entities.rate || 12}% दर से ${entities.tenure || 10} वर्षों के लिए`
          : `SIP vs FD comparison for ₹${(entities.amount || 10000).toLocaleString('en-IN')}/mo at ${entities.rate || 12}% for ${entities.tenure || 10} years`;
      case 'savings':
        return isHi
          ? `₹${(entities.amount || 500000).toLocaleString('en-IN')} के आपातकालीन बचत फंड की योजना बनाएं`
          : `Emergency fund savings plan for ₹${(entities.amount || 500000).toLocaleString('en-IN')} target`;
      case 'debt':
        return isHi
          ? `₹${(entities.amount || 300000).toLocaleString('en-IN')} के कर्ज (${entities.rate || 24}% ब्याज) को एवलांच से चुकाएं`
          : `Debt avalanche payoff for ₹${(entities.amount || 300000).toLocaleString('en-IN')} at ${entities.rate || 24}%`;
      default:
        return isHi
          ? `₹${(entities.income || 100000).toLocaleString('en-IN')} के आधार पर वित्तीय योजना बनाएं`
          : `Comprehensive financial plan for ₹${(entities.income || 100000).toLocaleString('en-IN')} income`;
    }
  };

  const handleEntitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedQuery = constructQueryFromEntities();

    setIsSubmitted(true);
    if (onSubmitEntities) onSubmitEntities(entities);
    if (onSubmitMessage) onSubmitMessage(generatedQuery);
    if (onSubmit) onSubmit({ ...entities, generatedQuery });
  };

  // Render Entity Collection Mode
  if (isEntityCollection) {
    const defaultTitle = isHi 
      ? (intent === 'loan' ? 'ऋण ईएमआई (EMI) विवरण दर्ज करें' : intent === 'budget' ? 'मासिक आय एवं बजट विवरण दर्ज करें' : 'वित्तीय विवरण दर्ज करें')
      : (intent === 'loan' ? 'Loan EMI Calculator Details' : intent === 'budget' ? 'Monthly Income & Budget Details' : 'Financial Details Form');

    const showAmount = intent === 'loan' || intent === 'investment' || intent === 'savings' || intent === 'debt';
    const showRate = intent === 'loan' || intent === 'investment' || intent === 'debt';
    const showTenure = intent === 'loan' || intent === 'investment';
    const showIncome = intent === 'budget' || intent === 'planning';

    return (
      <Card 
        className={cn(
          "bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-emerald-500/30 text-slate-100 shadow-lg",
          className
        )}
        role="region"
        aria-label={title || defaultTitle}
      >
        <CardHeader className="p-4 pb-2 border-b border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  {title || defaultTitle}
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </CardTitle>
                <p className="text-[11px] text-slate-400">
                  {isHi 
                    ? 'सटीक गणना के लिए आवश्यक आंकड़े दर्ज करें (कोई अनुमान नहीं लगाया गया)' 
                    : 'Provide your exact parameters for zero-guesswork financial modeling'}
                </p>
              </div>
            </div>
            {missingFields && missingFields.length > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {missingFields.length} {isHi ? 'आवश्यक' : 'Required'}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {isSubmitted ? (
            <div className="py-4 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-white">
                {isHi ? 'विवरण सफलतापूर्वक सबमिट हुआ!' : 'Details Submitted Successfully!'}
              </p>
              <p className="text-xs text-slate-400">
                {isHi ? 'गणना मॉडल लोड किया जा रहा है...' : 'Generating your interactive calculation and charts...'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleEntitySubmit} className="space-y-4">
              {/* Income Field */}
              {showIncome && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                      {isHi ? 'मासिक इन-हैंड आय (Monthly Income)' : 'Net Monthly Income (₹)'}
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      ₹{(entities.income || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="10000"
                    step="5000"
                    value={entities.income || ''}
                    onChange={(e) => setEntities(prev => ({ ...prev, income: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400"
                    placeholder="e.g. 100000"
                    required
                  />
                  <div className="flex gap-2 pt-1">
                    {[50000, 75000, 100000, 150000].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => handleIncomePreset(inc)}
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded border transition-colors",
                          entities.income === inc
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold"
                            : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                        )}
                      >
                        ₹{(inc / 1000)}k
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Amount Field (Principal / Target / SIP / Debt) */}
              {showAmount && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      {intent === 'loan'
                        ? (isHi ? 'लोन मूलधन राशि (Loan Principal)' : 'Loan Principal Amount (₹)')
                        : intent === 'investment'
                        ? (isHi ? 'मासिक SIP राशि (Monthly Investment)' : 'Monthly SIP Amount (₹)')
                        : intent === 'savings'
                        ? (isHi ? 'बचत लक्ष्य (Target Savings Goal)' : 'Target Savings Goal (₹)')
                        : (isHi ? 'कुल कर्ज राशि (Total Debt)' : 'Total Debt Balance (₹)')}
                    </label>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      ₹{(entities.amount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="1000"
                    step={intent === 'investment' ? '500' : '10000'}
                    value={entities.amount || ''}
                    onChange={(e) => setEntities(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. 1000000"
                    required
                  />
                  {intent === 'loan' && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[1000000, 2500000, 5000000, 7500000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleAmountPreset(amt)}
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded border transition-colors",
                            entities.amount === amt
                              ? "bg-amber-500/20 border-amber-400 text-amber-300 font-bold"
                              : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                          )}
                        >
                          ₹{(amt / 100000)} Lakh
                        </button>
                      ))}
                    </div>
                  )}
                  {intent === 'investment' && (
                    <div className="flex gap-2 pt-1">
                      {[5000, 10000, 15000, 25000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleAmountPreset(amt)}
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded border transition-colors",
                            entities.amount === amt
                              ? "bg-amber-500/20 border-amber-400 text-amber-300 font-bold"
                              : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                          )}
                        >
                          ₹{(amt / 1000)}k/mo
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Rate & Tenure Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {showRate && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-sky-400" />
                      {intent === 'investment' 
                        ? (isHi ? 'अनुमानित रिटर्न (% CAGR)' : 'Expected Return (% p.a.)') 
                        : (isHi ? 'ब्याज दर (% Interest)' : 'Interest Rate (% p.a.)')}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="50"
                      value={entities.rate || ''}
                      onChange={(e) => setEntities(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-400"
                      placeholder="e.g. 8.5"
                      required
                    />
                  </div>
                )}

                {showTenure && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      {isHi ? 'समय-अवधि (Tenure in Years)' : 'Tenure (Years)'}
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      max="35"
                      value={entities.tenure || ''}
                      onChange={(e) => setEntities(prev => ({ ...prev, tenure: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                      placeholder="e.g. 15"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Submit Action */}
              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-500/20 transition-all mt-2"
              >
                <span>
                  {intent === 'loan' 
                    ? (isHi ? 'ईएमआई निकालें एवं चार्ट देखें' : 'Calculate EMI & Amortization')
                    : intent === 'budget' 
                    ? (isHi ? '50/30/20 बजट बनाएं' : 'Generate 50/30/20 Budget')
                    : intent === 'investment'
                    ? (isHi ? 'SIP बनाम FD तुलना देखें' : 'Compare SIP vs FD Wealth')
                    : intent === 'savings'
                    ? (isHi ? 'बचत लक्ष्य की गणना करें' : 'Calculate Savings Timeline')
                    : intent === 'debt'
                    ? (isHi ? 'ऋण मुक्ति योजना बनाएं' : 'Generate Debt Payoff Schedule')
                    : (isHi ? 'गणना सबमिट करें' : 'Submit & Calculate')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    );
  }

  // Fallback to Profile Questionnaire Form
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!profileData.fullName.trim()) errs.fullName = t.fieldRequired;
    if (!profileData.email.trim()) {
      errs.email = t.fieldRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errs.email = t.invalidEmail;
    }
    if (profileData.monthlySavingsTarget <= 0) {
      errs.monthlySavingsTarget = t.minAmount;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
      if (onSubmit) onSubmit(profileData);
    }
  };

  return (
    <Card 
      className={cn("bg-slate-900/90 border-slate-800 text-slate-100 shadow-md", className)}
      role="region"
      aria-label={t.inlineFormTitle}
    >
      <CardHeader className="p-4 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/15 text-teal-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-white">
              {t.inlineFormTitle}
            </CardTitle>
            {!compact && (
              <p className="text-[11px] text-slate-400 mt-0.5">
                {t.inlineFormSubtitle}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {isSubmitted ? (
          <div className="py-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white">
              {isHi ? 'प्रोफाइल सहेज ली गई!' : 'Profile Saved Successfully!'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleProfileSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-200">
                {t.fullName}
              </label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData(p => ({ ...p, fullName: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                placeholder="Rohan Sharma"
              />
              {errors.fullName && <p className="text-[10px] text-red-400">{errors.fullName}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-200">
                {t.email}
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                placeholder="rohan@example.com"
              />
              {errors.email && <p className="text-[10px] text-red-400">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-200">
                {t.monthlyBudgetGoal}
              </label>
              <input
                type="number"
                value={profileData.monthlySavingsTarget}
                onChange={(e) => setProfileData(p => ({ ...p, monthlySavingsTarget: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold py-2 rounded-lg text-xs mt-2"
            >
              {t.submitButton}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
