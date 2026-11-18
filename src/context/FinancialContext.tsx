import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ChatSession, 
  LiveDashboardState, 
  Message, 
  TopicType 
} from '../types/finance';
import { 
  initialDashboardState, 
  initialSessions, 
  generateMockBotResponse,
  calculateEMI
} from '../lib/mockResponses';
import { SupportedLocale } from '../lib/i18n';
import { chatWithBot } from '../lib/chatService';

interface FinancialContextType {
  sessions: ChatSession[];
  currentSession: ChatSession;
  activeTopic: TopicType;
  dashboard: LiveDashboardState;
  isTyping: boolean;
  streamingMessageId: string | null;
  isRightPanelOpen: boolean;
  isSidebarOpen: boolean;
  isMobileSheetOpen: boolean;
  theme: 'dark' | 'light';
  currentView: 'chat' | 'storybook';
  locale: SupportedLocale;
  setCurrentView: (view: 'chat' | 'storybook') => void;
  setLocale: (locale: SupportedLocale) => void;
  sendMessage: (text: string) => Promise<void>;
  startNewChat: (topic?: TopicType) => void;
  selectSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  pinSession: (sessionId: string) => void;
  setActiveTopic: (topic: TopicType) => void;
  updateDashboard: (partial: Partial<LiveDashboardState>) => void;
  toggleRightPanel: () => void;
  setIsRightPanelOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setIsSidebarOpen: (open: boolean) => void;
  toggleMobileSheet: () => void;
  setIsMobileSheetOpen: (open: boolean) => void;
  toggleTheme: () => void;
  setCurrency: (symbol: string) => void;
  toggleLikeMessage: (messageId: string) => void;
  toggleDislikeMessage: (messageId: string) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const stored = localStorage.getItem('finbot_sessions');
      return stored ? JSON.parse(stored) : initialSessions;
    } catch {
      return initialSessions;
    }
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('finbot_current_session_id');
      if (stored) return stored;
    } catch {}
    return initialSessions[0]?.id || 'session-1';
  });

  const [activeTopic, setActiveTopic] = useState<TopicType>('all');

  const [dashboard, setDashboard] = useState<LiveDashboardState>(() => {
    try {
      const stored = localStorage.getItem('finbot_dashboard');
      return stored ? JSON.parse(stored) : initialDashboardState;
    } catch {
      return initialDashboardState;
    }
  });

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // mobile drawer
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState<boolean>(false); // mobile bottom sheet

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const stored = localStorage.getItem('finbot_theme');
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {}
    return 'dark';
  });

  const [currentView, setCurrentView] = useState<'chat' | 'storybook'>('chat');

  const [locale, setLocale] = useState<SupportedLocale>(() => {
    try {
      const stored = localStorage.getItem('finbot_locale');
      if (stored === 'en' || stored === 'hi') return stored as SupportedLocale;
    } catch {}
    return 'en';
  });

  // Active session object
  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0] || initialSessions[0];

  // Save states to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('finbot_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to save sessions to localStorage', e);
    }
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem('finbot_current_session_id', currentSessionId);
    } catch {}
  }, [currentSessionId]);

  useEffect(() => {
    try {
      localStorage.setItem('finbot_dashboard', JSON.stringify(dashboard));
    } catch {}
  }, [dashboard]);

  useEffect(() => {
    try {
      localStorage.setItem('finbot_theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('finbot_locale', locale);
    } catch {}
  }, [locale]);

  useEffect(() => {
    // Apply theme class to document body
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleRightPanel = () => setIsRightPanelOpen(prev => !prev);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const toggleMobileSheet = () => setIsMobileSheetOpen(prev => !prev);

  const setCurrency = (symbol: string) => {
    setDashboard(prev => ({ ...prev, currency: symbol }));
  };

  const updateDashboard = (partial: Partial<LiveDashboardState>) => {
    setDashboard(prev => ({ ...prev, ...partial }));
  };

  const selectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setActiveTopic(session.topic);
    }
  };

  const startNewChat = (topic: TopicType = 'all') => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Financial Analysis',
      timestamp: 'Just now',
      topic: topic,
      messages: []
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    setActiveTopic(topic);
    // On mobile close drawer
    setIsSidebarOpen(false);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      if (filtered.length === 0) {
        const fresh: ChatSession = {
          id: `session-${Date.now()}`,
          title: 'New Chat',
          timestamp: 'Just now',
          topic: 'all',
          messages: []
        };
        setCurrentSessionId(fresh.id);
        return [fresh];
      }
      if (currentSessionId === sessionId) {
        setCurrentSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  const pinSession = (sessionId: string) => {
    setSessions(prev =>
      prev.map(s => s.id === sessionId ? { ...s, pinned: !s.pinned } : s)
    );
  };

  const toggleLikeMessage = (messageId: string) => {
    setSessions(prev => prev.map(session => {
      if (session.id !== currentSessionId) return session;
      return {
        ...session,
        messages: session.messages.map(m => 
          m.id === messageId ? { ...m, liked: !m.liked, disliked: false } : m
        )
      };
    }));
  };

  const toggleDislikeMessage = (messageId: string) => {
    setSessions(prev => prev.map(session => {
      if (session.id !== currentSessionId) return session;
      return {
        ...session,
        messages: session.messages.map(m => 
          m.id === messageId ? { ...m, disliked: !m.disliked, liked: false } : m
        )
      };
    }));
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Update session title if first user message
    const isFirstMessage = currentSession.messages.length === 0;
    const updatedTitle = isFirstMessage 
      ? (text.length > 32 ? text.substring(0, 32) + '...' : text)
      : currentSession.title;

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          title: updatedTitle,
          messages: [...s.messages, userMessage]
        };
      }
      return s;
    }));

    // Start typing indicator briefly
    setIsTyping(true);
    await new Promise(res => setTimeout(res, 350));
    setIsTyping(false);

    const botMessageId = `msg-${Date.now() + 1}`;
    setStreamingMessageId(botMessageId);

    // Initial streaming bot message
    const initialBotMessage: Message = {
      id: botMessageId,
      sender: 'bot',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true
    };

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          messages: [...s.messages, initialBotMessage]
        };
      }
      return s;
    }));

    // Format recent chat history for Claude API
    const history = currentSession.messages.slice(-8).map(m => ({
      role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
      content: m.content
    }));

    // Stream word-by-word with chatWithBot (FastAPI SSE + fallback mockChat)
    const botResponse = await chatWithBot(
      text,
      (_token, accumulated) => {
        setSessions(prev => prev.map(s => {
          if (s.id === currentSessionId) {
            return {
              ...s,
              messages: s.messages.map(m => 
                m.id === botMessageId ? { ...m, content: accumulated } : m
              )
            };
          }
          return s;
        }));
      },
      { locale, history, tokenDelayMs: 18 }
    );

    // Finalize bot message with structured botResponse
    setStreamingMessageId(null);
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          messages: s.messages.map(m => 
            m.id === botMessageId 
              ? { 
                  ...m, 
                  content: botResponse.text, 
                  botResponse, 
                  followUps: botResponse.chips,
                  isStreaming: false 
                } 
              : m
          )
        };
      }
      return s;
    }));

    // Synchronize LiveDashboard with any calculation components in botResponse
    if (botResponse.components && botResponse.components.length > 0) {
      for (const comp of botResponse.components) {
        const typeLower = (comp.type || '').toLowerCase();
        const p = (comp.props || {}) as Record<string, any>;

        if (typeLower.includes('budget') && typeof p.income === 'number') {
          updateDashboard({
            monthlyIncome: p.income,
            budget: {
              income: p.income,
              needs: {
                amount: p.needs || Math.round(p.income * 0.5),
                percentage: 50,
                items: [
                  { name: 'Rent / Home Maintenance', amount: Math.round(p.income * 0.3), color: '#3b82f6' },
                  { name: 'Groceries & Bills', amount: Math.round(p.income * 0.2), color: '#60a5fa' }
                ]
              },
              wants: {
                amount: p.wants || Math.round(p.income * 0.3),
                percentage: 30,
                items: [
                  { name: 'Discretionary / Leisure', amount: Math.round(p.income * 0.3), color: '#f59e0b' }
                ]
              },
              savings: {
                amount: p.savings || Math.round(p.income * 0.2),
                percentage: 20,
                items: [
                  { name: 'SIP & Emergency Fund', amount: Math.round(p.income * 0.2), color: '#10b981' }
                ]
              }
            }
          });
        } else if (typeLower.includes('emi') && typeof p.principal === 'number' && typeof p.annualRate === 'number' && typeof p.tenureYears === 'number') {
          const calculated = calculateEMI(p.principal, p.annualRate, p.tenureYears);
          updateDashboard({ loan: calculated });
        } else if (typeLower.includes('savingsgoal')) {
          updateDashboard({
            savingsGoal: {
              title: p.title || 'Emergency Safety Net',
              category: 'Savings Goal',
              targetAmount: p.targetAmount || 300000,
              currentAmount: p.currentAmount || 180000,
              monthlyDeposit: p.monthlyDeposit || 15000,
              targetDate: p.targetDate || 'In Progress',
              projectedMonths: p.projectedMonths || 8,
              milestones: [
                { name: 'Starter Cushion', reached: true, date: 'Completed' },
                { name: 'Target Milestone', reached: false, date: 'Pending' }
              ]
            }
          });
        }
      }
    }
  };

  return (
    <FinancialContext.Provider value={{
      sessions,
      currentSession,
      activeTopic,
      dashboard,
      isTyping,
      streamingMessageId,
      isRightPanelOpen,
      isSidebarOpen,
      isMobileSheetOpen,
      theme,
      currentView,
      locale,
      setCurrentView,
      setLocale,
      sendMessage,
      startNewChat,
      selectSession,
      deleteSession,
      pinSession,
      setActiveTopic,
      updateDashboard,
      toggleRightPanel,
      setIsRightPanelOpen,
      toggleSidebar,
      setIsSidebarOpen,
      toggleMobileSheet,
      setIsMobileSheetOpen,
      toggleTheme,
      setCurrency,
      toggleLikeMessage,
      toggleDislikeMessage
    }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

