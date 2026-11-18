import React, { useEffect } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { LiveDashboard } from '../dashboard/LiveDashboard';
import { ChevronDown, X } from 'lucide-react';

export const MobileBottomSheet: React.FC = () => {
  const { isMobileSheetOpen, setIsMobileSheetOpen } = useFinancial();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileSheetOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsMobileSheetOpen]);

  if (!isMobileSheetOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsMobileSheetOpen(false)}
      />

      {/* Sheet Content */}
      <div className="relative w-full max-h-[85vh] bg-slate-950 rounded-t-2xl shadow-2xl z-10 flex flex-col border-t border-slate-800 animate-in slide-in-from-bottom duration-200 overflow-hidden">
        {/* Drag handle */}
        <div 
          onClick={() => setIsMobileSheetOpen(false)}
          className="w-full flex flex-col items-center py-2 cursor-pointer bg-slate-950 hover:bg-slate-900 border-b border-slate-800/60"
        >
          <div className="w-12 h-1.5 rounded-full bg-slate-700" />
          <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <ChevronDown className="w-3 h-3" />
            Tap or swipe down to close
          </span>
        </div>

        {/* Dashboard wrapper */}
        <div className="flex-1 overflow-hidden h-[75vh]">
          <LiveDashboard onCloseMobile={() => setIsMobileSheetOpen(false)} />
        </div>
      </div>
    </div>
  );
};

