import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

interface PromptCardProps {
  title: string;
  description: string;
  tag: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  borderColor: string;
  onClick: () => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  title,
  description,
  tag,
  icon: Icon,
  iconColor,
  iconBg,
  borderColor,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between p-4 rounded-xl text-left bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5",
        borderColor
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", iconBg, iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
          <Badge variant="secondary" className="text-[10px] bg-slate-800 text-slate-300 border-slate-700">
            {tag}
          </Badge>
        </div>

        <h3 className="font-semibold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">
          {title}
        </h3>

        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs font-medium text-slate-500 group-hover:text-emerald-400 transition-colors">
        <span>Ask FinBot</span>
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </button>
  );
};

