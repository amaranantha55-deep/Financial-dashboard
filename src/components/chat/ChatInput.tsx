import React, { useState, useRef, useEffect } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Paperclip, 
  CornerDownLeft,
  DollarSign,
  PieChart,
  Landmark,
  TrendingUp
} from 'lucide-react';
import { Button } from '../ui/button';

export const ChatInput: React.FC = () => {
  const { sendMessage, isTyping, locale } = useFinancial();
  const isHi = locale === 'hi';
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    sendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSimulateVoice = () => {
    setIsListening(prev => !prev);
    if (!isListening) {
      // Simulate recognized speech after 1.5s
      setTimeout(() => {
        setInput(isHi ? '₹25,00,000 के लोन हेतु 8.5% पर 15 वर्ष की मासिक ईएमआई निकालें' : 'Calculate my monthly loan EMI for ₹25,00,000 at 8.5% over 15 years');
        setIsListening(false);
      }, 1500);
    }
  };

  const quickPills = isHi ? [
    { label: '50/30/20 बजट (₹1 Lakh)', prompt: 'Plan my monthly budget based on a ₹1,00,000 income.' },
    { label: 'होम लोन EMI (₹25 Lakh)', prompt: 'Calculate loan EMI for ₹25,00,000 at 8.5% for 15 years.' },
    { label: 'SIP बनाम FD (₹10,000/माह)', prompt: 'SIP vs FD: Invest ₹10,000 monthly for 10 years.' },
    { label: 'आपातकालीन सुरक्षा फंड', prompt: 'How much should I save for a 6-month safety net?' },
    { label: 'जोखिम प्रोफाइल (Risk Gauge)', prompt: 'Assess my investment risk tolerance.' },
  ] : [
    { label: '50/30/20 Budget (₹1 Lakh)', prompt: 'Plan my monthly budget based on a ₹1,00,000 income.' },
    { label: 'Loan EMI (₹25 Lakh @ 8.5%)', prompt: 'Calculate loan EMI for ₹25,00,000 at 8.5% for 15 years.' },
    { label: 'SIP vs FD (₹10,000/mo)', prompt: 'SIP vs FD: Invest ₹10,000 monthly for 10 years.' },
    { label: 'Emergency Safety Net', prompt: 'How much should I save for a 6-month safety net?' },
    { label: 'Risk Profiler', prompt: 'Assess my investment risk tolerance.' },
  ];

  return (
    <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Quick action helper pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Quick:
          </span>
          {quickPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(pill.prompt)}
              className="text-[11px] whitespace-nowrap bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-800 px-2.5 py-1 rounded-full transition-all shrink-0 hover:border-emerald-500/30"
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="relative flex items-end bg-slate-900/90 border border-slate-800 focus-within:border-emerald-500/60 focus-within:ring-1 focus-within:ring-emerald-500/30 rounded-2xl p-2 shadow-inner transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening... Speak your financial question..." : "Ask FinBot about your budget, loans, savings, or investments..."}
            className="flex-1 bg-transparent border-0 resize-none px-3 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none max-h-36 overflow-y-auto leading-relaxed"
          />

          <div className="flex items-center gap-1.5 pb-0.5">
            {/* Simulated Voice input */}
            <button
              type="button"
              onClick={handleSimulateVoice}
              title={isListening ? "Listening..." : "Voice input"}
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {isListening ? <Mic className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send button */}
            <Button
              size="icon"
              disabled={!input.trim() || isTyping}
              onClick={handleSend}
              className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-30 disabled:pointer-events-none transition-transform active:scale-95 shadow-md shadow-emerald-950/40"
              title="Send message (Enter)"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Keyboard shortcut hint & disclaimer */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="hidden sm:inline">
            Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">Shift+Enter</kbd> for newline
          </span>
          <span className="text-[10px] text-slate-400 italic">
            {isHi 
              ? 'फिनबॉट केवल शैक्षिक और वित्तीय मॉडलिंग उद्देश्यों के लिए है। यह सेबी (SEBI) पंजीकृत सलाह नहीं है।'
              : 'FinBot provides educational financial calculations. Not SEBI-registered financial advisory.'}
          </span>
        </div>
      </div>
    </div>
  );
};

