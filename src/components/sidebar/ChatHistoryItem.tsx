import React, { useState } from 'react';
import { ChatSession } from '../../types/finance';
import { useFinancial } from '../../context/FinancialContext';
import { 
  MessageSquare, 
  Trash2, 
  Pin, 
  PieChart, 
  PiggyBank, 
  Landmark, 
  TrendingUp, 
  Target 
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChatHistoryItemProps {
  session: ChatSession;
  isActive: boolean;
}

export const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({ session, isActive }) => {
  const { selectSession, deleteSession, pinSession, setIsSidebarOpen } = useFinancial();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const getTopicIcon = () => {
    switch (session.topic) {
      case 'budgeting': return PieChart;
      case 'savings': return PiggyBank;
      case 'loans': return Landmark;
      case 'investments': return TrendingUp;
      case 'planning': return Target;
      default: return MessageSquare;
    }
  };

  const Icon = getTopicIcon();

  const handleClick = () => {
    selectSession(session.id);
    setIsSidebarOpen(false); // Close drawer on mobile
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-all duration-150 border",
        isActive
          ? "bg-slate-800/90 text-white border-slate-700 shadow-sm"
          : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border-transparent"
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-2">
        <Icon className={cn(
          "w-3.5 h-3.5 shrink-0",
          isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-400"
        )} />
        <div className="flex flex-col truncate">
          <span className="truncate font-medium leading-tight">
            {session.title}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 truncate">
            {session.timestamp}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {session.pinned ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              pinSession(session.id);
            }}
            title="Unpin"
            className="p-1 text-emerald-400 hover:text-slate-400 rounded transition-colors"
          >
            <Pin className="w-3 h-3 fill-current rotate-45" />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              pinSession(session.id);
            }}
            title="Pin conversation"
            className="p-1 text-slate-500 hover:text-slate-200 rounded transition-colors"
          >
            <Pin className="w-3 h-3" />
          </button>
        )}

        {showConfirmDelete ? (
          <div className="flex items-center gap-1 bg-red-950/80 p-0.5 rounded border border-red-500/40">
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteSession(session.id);
              }}
              className="text-[10px] text-red-400 font-bold px-1 hover:text-red-300"
            >
              Del
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirmDelete(false);
              }}
              className="text-[10px] text-slate-400 px-1 hover:text-slate-300"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirmDelete(true);
            }}
            title="Delete conversation"
            className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {session.pinned && !isActive && (
        <Pin className="w-2.5 h-2.5 text-emerald-500 fill-current rotate-45 absolute right-2 top-2 group-hover:hidden" />
      )}
    </div>
  );
};

