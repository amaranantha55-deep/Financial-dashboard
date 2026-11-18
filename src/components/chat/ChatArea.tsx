import React, { useRef, useEffect } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { WelcomeScreen } from './WelcomeScreen';
import { ChatInput } from './ChatInput';

export const ChatArea: React.FC = () => {
  const { currentSession, isTyping } = useFinancial();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages or typing
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession.messages, isTyping]);

  const hasMessages = currentSession.messages.length > 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 min-w-0 relative">
      {/* Top Header */}
      <ChatHeader />

      {/* Main Chat Scroll Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
        {!hasMessages ? (
          <WelcomeScreen />
        ) : (
          <div className="py-4 space-y-1">
            {currentSession.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput />
    </div>
  );
};

