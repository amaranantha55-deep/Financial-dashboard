import React, { useEffect } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { Sidebar } from '../sidebar/Sidebar';

export const MobileDrawer: React.FC = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useFinancial();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSidebarOpen]);

  if (!isSidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Drawer Content */}
      <div className="relative w-80 max-w-[85vw] h-full bg-slate-950 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
        <Sidebar onCloseMobile={() => setIsSidebarOpen(false)} />
      </div>
    </div>
  );
};

