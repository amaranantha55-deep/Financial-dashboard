import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { TopicShortcuts } from './TopicShortcuts';
import { ChatHistoryItem } from './ChatHistoryItem';
import { FinancialHealthWidget } from './FinancialHealthWidget';
import { Button } from '../ui/button';
import { 
  Plus, 
  Sparkles, 
  Search, 
  Bot, 
  ChevronLeft, 
  History,
  X,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { sessions, currentSession, startNewChat, activeTopic, setCurrentView } = useFinancial();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sessions by search or active topic
  const filteredSessions = sessions.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = activeTopic === 'all' || s.topic === activeTopic;
    return matchesSearch && matchesTopic;
  });

  const pinnedSessions = filteredSessions.filter(s => s.pinned);
  const recentSessions = filteredSessions.filter(s => !s.pinned);

  return (
    <aside className="w-72 h-full flex flex-col bg-slate-950/95 border-r border-slate-800/80 select-none text-slate-200">
      {/* Top Header & Brand */}
      <div className="p-3.5 pb-2 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950">
            <Bot className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white font-sans">
                FinBot
              </span>
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-semibold">
                AI Copilot
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Wealth & Financial Intelligence
            </div>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* New Chat & Storybook Buttons */}
      <div className="p-3 pb-1 space-y-1.5">
        <Button
          onClick={() => {
            startNewChat();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full justify-between bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 font-semibold"
          size="default"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-emerald-700/60 rounded text-emerald-200 border border-emerald-500/30">
            ⌘N
          </kbd>
        </Button>

        <button
          onClick={() => {
            setCurrentView('storybook');
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-all"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-rose-400" />
            <span>Component Storybook</span>
          </div>
          <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono px-1 rounded">
            Demo
          </span>
        </button>
      </div>

      {/* Topic Shortcuts */}
      <TopicShortcuts />

      {/* Search in Chat History */}
      <div className="px-3 py-1">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {/* Pinned Section */}
        {pinnedSessions.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              <span>Pinned</span>
            </div>
            {pinnedSessions.map(session => (
              <ChatHistoryItem
                key={session.id}
                session={session}
                isActive={session.id === currentSession.id}
              />
            ))}
          </div>
        )}

        {/* Recent Chats Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <span className="flex items-center gap-1">
              <History className="w-3 h-3" />
              Recent Chats
            </span>
            <span>{recentSessions.length}</span>
          </div>

          {recentSessions.length === 0 ? (
            <div className="text-center py-4 text-xs text-slate-500">
              No matching chats
            </div>
          ) : (
            recentSessions.map(session => (
              <ChatHistoryItem
                key={session.id}
                session={session}
                isActive={session.id === currentSession.id}
              />
            ))
          )}
        </div>
      </div>

      {/* Sidebar Footer with Financial Health & User Profile */}
      <div className="p-3 border-t border-slate-800/80 space-y-2.5 bg-slate-950">
        <FinancialHealthWidget />

        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
              AM
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight">Alex Mercer</div>
              <div className="text-[10px] text-emerald-400">Premium Member</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

