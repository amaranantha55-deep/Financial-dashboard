import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { PromptCard } from './PromptCard';
import { 
  PieChart, 
  Landmark, 
  PiggyBank, 
  TrendingUp, 
  Compass, 
  CreditCard,
  Sparkles,
  Bot
} from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { sendMessage, locale } = useFinancial();
  const isHi = locale === 'hi';

  const starterCards = isHi ? [
    {
      title: 'मासिक 50/30/20 बजट बनाएं',
      description: 'अपनी आय को ज़रूरतों, इच्छाओं और बचत के 50/30/20 नियम में विभाजित करें।',
      tag: 'बजट (Budget)',
      icon: PieChart,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
      borderColor: 'hover:border-blue-500/40',
      prompt: '₹1,00,000 की मासिक आय के लिए 50/30/20 बजट प्लान बनाएं।'
    },
    {
      title: 'ऋण (लोन) ईएमआई निकालें',
      description: 'मासिक किश्त, मूलधन बनाम ब्याज अनुपात और परिशोधन तालिका की गणना करें।',
      tag: 'लोन ईएमआई',
      icon: Landmark,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/15',
      borderColor: 'hover:border-amber-500/40',
      prompt: '₹25,00,000 के होम लोन हेतु 8.5% दर पर 15 वर्ष की ईएमआई निकालें।'
    },
    {
      title: 'मुझे कितनी बचत करनी चाहिए?',
      description: '6-माह के खर्चों के बराबर आपातकालीन सुरक्षा फंड का आकार निर्धारित करें।',
      tag: 'बचत फंड',
      icon: PiggyBank,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15',
      borderColor: 'hover:border-emerald-500/40',
      prompt: 'आपातकालीन फंड में कितनी राशि रखनी चाहिए और इसे कहाँ निवेश करें?'
    },
    {
      title: 'SIP बनाम बैंक FD',
      description: 'इंडेक्स फंड एसआईपी और बैंक फिक्स्ड डिपॉजिट में 10-वर्षीय धन वृद्धि की तुलना करें।',
      tag: 'निवेश तुलना',
      icon: TrendingUp,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/15',
      borderColor: 'hover:border-purple-500/40',
      prompt: 'SIP बनाम FD: अगले 10 वर्षों के लिए ₹10,000 मासिक कहाँ निवेश करें?'
    },
    {
      title: 'जोखिम प्रोफाइल एवं निवेश',
      description: 'अपनी जोखिम सहनशीलता के आधार पर सही संपत्ति आवंटन (इक्विटी + डेट + गोल्ड) चुनें।',
      tag: 'पोर्टफोलियो',
      icon: Compass,
      iconColor: 'text-teal-400',
      iconBg: 'bg-teal-500/15',
      borderColor: 'hover:border-teal-500/40',
      prompt: 'मेरा निवेश जोखिम प्रोफाइल (Risk Gauge) जांचें और सही पोर्टफोलियो बताएं।'
    },
    {
      title: 'ऋण मुक्ति रणनीति',
      description: 'क्रेडिट कार्ड व पर्सनल लोन चुकाने हेतु एवलांच बनाम स्नोबॉल विधि की तुलना करें।',
      tag: 'ऋण मुक्ति',
      icon: CreditCard,
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/15',
      borderColor: 'hover:border-red-500/40',
      prompt: 'क्रेडिट कार्ड ऋण चुकाने के लिए एवलांच बनाम स्नोबॉल रणनीति की तुलना करें।'
    },
  ] : [
    {
      title: 'Plan my monthly budget',
      description: 'Allocate your income using the 50/30/20 framework across Needs, Wants, and Savings.',
      tag: 'Budgeting',
      icon: PieChart,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
      borderColor: 'hover:border-blue-500/40',
      prompt: 'Plan my monthly budget based on a ₹1,00,000 net income.'
    },
    {
      title: 'Calculate my loan EMI',
      description: 'Simulate monthly payments, interest vs principal ratio, and stacked amortization schedule.',
      tag: 'Loans',
      icon: Landmark,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/15',
      borderColor: 'hover:border-amber-500/40',
      prompt: 'Calculate my loan EMI for ₹25,00,000 at 8.5% over 15 years.'
    },
    {
      title: 'How much should I save?',
      description: 'Calculate your emergency safety net runway and monthly contribution targets.',
      tag: 'Savings',
      icon: PiggyBank,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15',
      borderColor: 'hover:border-emerald-500/40',
      prompt: 'How much should I save in an emergency fund and where should I park it?'
    },
    {
      title: 'SIP vs FD',
      description: 'Compare 10-year compounding between Systematic Investment Plans and Bank FDs.',
      tag: 'Investments',
      icon: TrendingUp,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/15',
      borderColor: 'hover:border-purple-500/40',
      prompt: 'SIP vs FD: Where should I invest ₹10,000 monthly for the next 10 years?'
    },
    {
      title: 'Start investing & assess risk',
      description: 'Evaluate your risk tolerance and design a balanced asset allocation strategy.',
      tag: 'Planning',
      icon: Compass,
      iconColor: 'text-teal-400',
      iconBg: 'bg-teal-500/15',
      borderColor: 'hover:border-teal-500/40',
      prompt: 'Assess my investment risk tolerance and recommend an optimal asset allocation.'
    },
    {
      title: 'Reduce my debt',
      description: 'Evaluate Debt Avalanche vs Debt Snowball to eliminate high-interest liabilities.',
      tag: 'Debt Payoff',
      icon: CreditCard,
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/15',
      borderColor: 'hover:border-red-500/40',
      prompt: 'Help me reduce my debt. Compare Debt Avalanche vs Snowball for high-interest loans.'
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full select-none">
      {/* Hero Greeting */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FinBot 2.0 • AI Financial Intelligence</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
          {isHi ? 'नमस्ते, राहुल' : 'Welcome back, Alex'} <span className="inline-block animate-bounce">👋</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          {isHi 
            ? 'मैं आपका व्यक्तिगत वित्तीय सलाहकार हूँ। बजट, ऋण ईएमआई, बचत लक्ष्य या निवेश के बारे में कुछ भी पूछें।'
            : "I'm your personal wealth advisor. Ask me anything about budgeting, loan amortization, savings goals, or investment compounding."}
        </p>
      </div>

      {/* 6 Starter Prompt Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full">
        {starterCards.map((card, idx) => (
          <PromptCard
            key={idx}
            title={card.title}
            description={card.description}
            tag={card.tag}
            icon={card.icon}
            iconColor={card.iconColor}
            iconBg={card.iconBg}
            borderColor={card.borderColor}
            onClick={() => sendMessage(card.prompt)}
          />
        ))}
      </div>

      {/* Security & Disclaimer Note */}
      <div className="mt-8 text-center text-xs text-slate-500 flex items-center gap-2">
        <Bot className="w-3.5 h-3.5 text-slate-500" />
        <span>
          {isHi 
            ? 'FinBot शैक्षणिक वित्तीय सिमुलेशन प्रदान करता है। सभी संख्याएं दाईं ओर लाइव डैशबोर्ड में अपडेट होती हैं।'
            : 'FinBot provides algorithmic financial simulations for educational purposes. All numbers update your live dashboard.'}
        </span>
      </div>
    </div>
  );
};
