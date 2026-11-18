import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { 
  Menu, 
  BarChart2, 
  PanelRightClose, 
  PanelRightOpen, 
  Share2, 
  Trash2, 
  Moon, 
  Sun,
  Check,
  Sparkles,
  BookOpen,
  Globe,
  FileDown
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { exportPlanPDF } from '../../lib/exportUtils';

export const ChatHeader: React.FC = () => {
  const { 
    currentSession, 
    dashboard,
    toggleSidebar, 
    isRightPanelOpen, 
    toggleRightPanel, 
    toggleMobileSheet,
    theme, 
    toggleTheme,
    startNewChat,
    setCurrentView,
    locale,
    setLocale
  } = useFinancial();

  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getTopicColor = () => {
    switch (currentSession.topic) {
      case 'budgeting': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'savings': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'loans': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'investments': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'planning': return 'bg-teal-500/15 text-teal-400 border-teal-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <header className="h-14 px-3 sm:px-6 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between z-10 shrink-0">
      {/* Left: Mobile Drawer Trigger & Conversation Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 truncate">
          <h2 className="font-semibold text-sm sm:text-base text-slate-100 truncate">
            {currentSession.title}
          </h2>
          <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${getTopicColor()}`}>
            {currentSession.topic}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Share conversation */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="hidden sm:inline-flex text-slate-400 hover:text-slate-100 h-8 px-2"
          title="Share conversation"
        >
          {copiedLink ? (
            <span className="flex items-center gap-1 text-emerald-400 text-xs">
              <Check className="w-3.5 h-3.5" />
              <span>Link Copied</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </span>
          )}
        </Button>

        {/* Export Plan as PDF */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportPlanPDF(currentSession.title, currentSession.messages, dashboard, locale)}
          className="text-xs h-8 px-2.5 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-emerald-300 flex items-center gap-1"
          title="Export Plan as PDF"
        >
          <FileDown className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Export PDF</span>
        </Button>

        {/* Language Switcher */}
        <button
          onClick={() => setLocale(locale === 'en' ? 'hi' : 'en')}
          className="text-xs h-8 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700/80 flex items-center gap-1 font-semibold transition-colors"
          title="Switch language (English / Hindi)"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">{locale === 'en' ? 'EN' : 'हिन्दी 🇮🇳'}</span>
        </button>

        {/* Storybook Showcase Switcher */}
        <Button
          variant="glow"
          size="sm"
          onClick={() => setCurrentView('storybook')}
          className="text-xs h-8 px-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white shadow-rose-950/40 flex items-center gap-1.5 font-semibold"
          title="Open Storybook Component Showcase"
        >
          <BookOpen className="w-3.5 h-3.5 text-white" />
          <span className="hidden sm:inline">Storybook Demo</span>
        </Button>

        {/* Clear / Reset chat */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => startNewChat()}
          className="text-slate-400 hover:text-white h-8 w-8"
          title="Reset conversation"
        >
          <Trash2 className="w-4 h-4" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-slate-400 hover:text-white h-8 w-8"
          title="Toggle Light / Dark mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </Button>

        {/* Mobile: Bottom Sheet Toggle */}
        <button
          onClick={toggleMobileSheet}
          className="lg:hidden p-2 rounded-lg text-emerald-400 hover:bg-slate-800 border border-emerald-500/30 flex items-center gap-1 text-xs font-semibold"
          title="Open Live Dashboard"
        >
          <BarChart2 className="w-4 h-4" />
          <span className="hidden xs:inline">Dashboard</span>
        </button>

        {/* Desktop: Toggle Right Live Panel */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleRightPanel}
          className="hidden lg:flex items-center gap-1.5 text-xs text-slate-300 border-slate-700/80 hover:bg-slate-800 h-8 px-2.5 ml-1"
          title={isRightPanelOpen ? "Collapse Live Dashboard" : "Expand Live Dashboard"}
        >
          {isRightPanelOpen ? (
            <>
              <PanelRightClose className="w-4 h-4 text-emerald-400" />
              <span>Hide Dashboard</span>
            </>
          ) : (
            <>
              <PanelRightOpen className="w-4 h-4 text-emerald-400" />
              <span>Live Dashboard</span>
            </>
          )}
        </Button>
      </div>
    </header>
  );
};

