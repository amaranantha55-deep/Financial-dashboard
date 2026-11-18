import React, { useEffect } from 'react';
import { FinancialProvider, useFinancial } from './context/FinancialContext';
import { Sidebar } from './components/sidebar/Sidebar';
import { ChatArea } from './components/chat/ChatArea';
import { LiveDashboard } from './components/dashboard/LiveDashboard';
import { MobileDrawer } from './components/mobile/MobileDrawer';
import { MobileBottomSheet } from './components/mobile/MobileBottomSheet';
import { StorybookDemo } from './components/storybook/StorybookDemo';

const AppContent: React.FC = () => {
  const { 
    isRightPanelOpen, 
    startNewChat, 
    toggleRightPanel, 
    currentView, 
    setCurrentView 
  } = useFinancial();

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + N: New Chat
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        startNewChat();
      }
      // Cmd/Ctrl + B: Toggle Dashboard
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleRightPanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startNewChat, toggleRightPanel]);

  if (currentView === 'storybook') {
    return <StorybookDemo onBackToChat={() => setCurrentView('chat')} />;
  }

  return (
    <div className="h-screen w-screen flex bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* 1. Desktop Left Sidebar */}
      <div className="hidden md:flex shrink-0 h-full">
        <Sidebar />
      </div>

      {/* 2. Center Chat Area */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        <ChatArea />
      </main>

      {/* 3. Desktop Collapsible Right Dashboard */}
      {isRightPanelOpen && (
        <div className="hidden lg:flex shrink-0 h-full transition-all duration-300 ease-in-out">
          <LiveDashboard />
        </div>
      )}

      {/* 4. Mobile Left Drawer */}
      <MobileDrawer />

      {/* 5. Mobile Right Bottom Sheet */}
      <MobileBottomSheet />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <FinancialProvider>
      <AppContent />
    </FinancialProvider>
  );
};

export default App;
