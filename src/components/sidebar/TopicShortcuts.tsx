import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { TopicType } from '../../types/finance';
import { 
  PieChart, 
  PiggyBank, 
  Landmark, 
  TrendingUp, 
  Target, 
  LayoutGrid 
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const topics: { id: TopicType; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { id: 'all', label: 'All Topics', icon: LayoutGrid, color: 'text-slate-400 hover:text-slate-200' },
  { id: 'budgeting', label: 'Budgeting', icon: PieChart, color: 'text-blue-400 hover:text-blue-300' },
  { id: 'savings', label: 'Savings', icon: PiggyBank, color: 'text-emerald-400 hover:text-emerald-300' },
  { id: 'loans', label: 'Loans & EMI', icon: Landmark, color: 'text-amber-400 hover:text-amber-300' },
  { id: 'investments', label: 'Investments', icon: TrendingUp, color: 'text-purple-400 hover:text-purple-300' },
  { id: 'planning', label: 'Planning', icon: Target, color: 'text-teal-400 hover:text-teal-300' },
];

export const TopicShortcuts: React.FC = () => {
  const { activeTopic, setActiveTopic, startNewChat } = useFinancial();

  const handleTopicClick = (topicId: TopicType) => {
    setActiveTopic(topicId);
    if (topicId !== 'all') {
      startNewChat(topicId);
    }
  };

  return (
    <div className="space-y-1.5 px-3 py-2">
      <div className="flex items-center justify-between px-2 mb-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Topics & Domains
        </span>
        <span className="text-[10px] text-slate-500 font-mono">5 areas</span>
      </div>

      <div className="grid grid-cols-1 gap-1">
        {topics.map((item) => {
          const Icon = item.icon;
          const isActive = activeTopic === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTopicClick(item.id)}
              className={cn(
                "group flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 text-left",
                isActive
                  ? "bg-slate-800 text-slate-100 font-semibold shadow-sm border border-slate-700/60"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className={cn(
                  "p-1 rounded-md transition-colors",
                  isActive ? "bg-slate-700/80 text-emerald-400" : "bg-slate-900/60 " + item.color
                )}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span>{item.label}</span>
              </div>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

