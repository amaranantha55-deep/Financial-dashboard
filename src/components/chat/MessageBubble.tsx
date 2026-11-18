import React, { useState } from 'react';
import { Message } from '../../types/finance';
import { useFinancial } from '../../context/FinancialContext';
import { RichResponseContainer } from '../responses/RichResponseContainer';
import { ComponentRenderer } from './ComponentRenderer';
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Sparkles 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { GLOSSARY_DATABASE } from '../../lib/glossary';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { toggleLikeMessage, toggleDislikeMessage, sendMessage, locale } = useFinancial();
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const isBot = message.sender === 'bot';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleAudio = () => {
    setIsPlayingAudio(prev => !prev);
    if (!isPlayingAudio && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.content.replace(/[*#>`]/g, ''));
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  // Basic formatted markdown parser
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');

    return lines.map((line, idx) => {
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Headers ###
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-100 mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }

      // Blockquote >
      if (line.startsWith('> ')) {
        return (
          <div key={idx} className="border-l-2 border-emerald-500 bg-emerald-500/10 px-3 py-1.5 my-2 rounded-r text-xs text-emerald-200">
            {parseInlineMarkdown(line.replace('> ', ''))}
          </div>
        );
      }

      // Bullet points - or *
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 my-0.5 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <span className="leading-relaxed">{parseInlineMarkdown(line.substring(2))}</span>
          </div>
        );
      }

      // Numbered lists e.g. 1.
      const numberedMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numberedMatch) {
        return (
          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 my-0.5 ml-1">
            <span className="text-emerald-400 font-bold shrink-0">{numberedMatch[1]}.</span>
            <span className="leading-relaxed">{parseInlineMarkdown(numberedMatch[2])}</span>
          </div>
        );
      }

      // Normal paragraph
      return (
        <p key={idx} className="text-xs sm:text-sm leading-relaxed text-slate-200 my-1">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Financial jargon tooltip renderer
  const renderTextWithTooltips = (plainText: string) => {
    if (!plainText) return plainText;
    const regex = /\b(EMI|SIP|FD|CAGR|PPF|NPS)\b|50\/30\/20/gi;
    const tokens = plainText.split(regex);
    const matches = plainText.match(regex) || [];

    if (matches.length === 0) return plainText;

    const result: React.ReactNode[] = [];
    tokens.forEach((token, idx) => {
      if (token) result.push(token);
      if (idx < matches.length) {
        const match = matches[idx];
        const key = match.toUpperCase() === '50/30/20' ? '50/30/20' : match.toUpperCase();
        const entry = GLOSSARY_DATABASE[key];
        const glossaryItem = entry ? (locale === 'hi' ? entry.hi : entry.en) : null;

        if (glossaryItem) {
          result.push(
            <span
              key={`tooltip-${idx}`}
              tabIndex={0}
              className="relative group/term inline-block cursor-help border-b border-dotted border-emerald-400 text-emerald-300 font-semibold focus:outline-none"
            >
              {match}
              <span className="pointer-events-none opacity-0 group-hover/term:opacity-100 group-focus/term:opacity-100 transition-opacity duration-150 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 rounded-xl bg-slate-900 border border-emerald-500/50 text-slate-200 text-[11px] shadow-2xl z-50 text-left font-normal backdrop-blur-md">
                <span className="font-bold text-emerald-400 block text-xs">{glossaryItem.fullForm}</span>
                <span className="text-slate-300 block mt-1 leading-snug">{glossaryItem.definition}</span>
              </span>
            </span>
          );
        } else {
          result.push(match);
        }
      }
    });

    return result;
  };

  // Helper for bold and code
  const parseInlineMarkdown = (text: string) => {
    // Split by bold **
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {renderTextWithTooltips(part.slice(2, -2))}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono text-[11px]">
            {part.slice(1, -1)}
          </code>
        );
      }
      return <React.Fragment key={i}>{renderTextWithTooltips(part)}</React.Fragment>;
    });
  };

  return (
    <div
      className={cn(
        "flex w-full gap-3 py-3 px-3 sm:px-6 transition-colors",
        isBot ? "bg-transparent" : "justify-end"
      )}
    >
      {/* Bot Avatar */}
      {isBot && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 text-slate-950 mt-1">
          <Bot className="w-4 h-4 text-slate-950 stroke-[2.5]" />
        </div>
      )}

      {/* Message Content Container */}
      <div className={cn("flex flex-col max-w-[85%] sm:max-w-[78%]", isBot ? "items-start" : "items-end")}>
        {/* Author & Timestamp */}
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-[11px] font-semibold text-slate-400">
            {isBot ? 'FinBot' : 'You'}
          </span>
          <span className="text-[10px] text-slate-500">{message.timestamp}</span>
        </div>

        {/* Bubble */}
        <div
          className={cn(
            "p-3.5 sm:p-4 rounded-2xl shadow-sm text-left transition-all",
            isBot
              ? "bg-slate-900/90 border border-slate-800/90 text-slate-200 rounded-tl-sm w-full"
              : "bg-emerald-600 text-white rounded-tr-sm shadow-emerald-950/30"
          )}
        >
          {/* Main Text Content */}
          <div className="space-y-1">
            {renderFormattedText(message.content)}
            {message.isStreaming && (
              <span className="inline-block w-1.5 h-3.5 bg-emerald-400 ml-1 rounded-sm animate-pulse align-middle" />
            )}
          </div>

          {/* Structured Bot Components or Legacy Rich Cards */}
          {isBot && !message.isStreaming && (
            message.botResponse ? (
              <ComponentRenderer 
                response={message.botResponse} 
                locale={locale} 
                onSelectChip={(chip) => sendMessage(chip)} 
                onSendMessage={(msg) => sendMessage(msg)}
              />
            ) : (
              <RichResponseContainer message={message} />
            )
          )}
        </div>

        {/* Action bar for Bot responses */}
        {isBot && (
          <div className="flex items-center gap-1.5 mt-1.5 px-1 text-slate-500">
            <button
              onClick={handleCopy}
              title="Copy response"
              className="p-1 rounded hover:bg-slate-800 hover:text-slate-300 transition-colors text-xs flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={() => toggleLikeMessage(message.id)}
              title="Helpful"
              className={cn(
                "p-1 rounded hover:bg-slate-800 hover:text-slate-300 transition-colors",
                message.liked ? "text-emerald-400 font-bold" : "text-slate-500"
              )}
            >
              <ThumbsUp className="w-3.5 h-3.5 fill-current" />
            </button>

            <button
              onClick={() => toggleDislikeMessage(message.id)}
              title="Not helpful"
              className={cn(
                "p-1 rounded hover:bg-slate-800 hover:text-slate-300 transition-colors",
                message.disliked ? "text-red-400 font-bold" : "text-slate-500"
              )}
            >
              <ThumbsDown className="w-3.5 h-3.5 fill-current" />
            </button>

            <button
              onClick={handleToggleAudio}
              title={isPlayingAudio ? "Stop reading" : "Read aloud"}
              className={cn(
                "p-1 rounded hover:bg-slate-800 hover:text-slate-300 transition-colors",
                isPlayingAudio ? "text-emerald-400 animate-pulse" : "text-slate-500"
              )}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => sendMessage(`Could you elaborate further or provide an alternative approach?`)}
              title="Regenerate / Clarify"
              className="p-1 rounded hover:bg-slate-800 hover:text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isBot && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300 mt-1">
          <User className="w-4 h-4 text-emerald-400" />
        </div>
      )}
    </div>
  );
};

