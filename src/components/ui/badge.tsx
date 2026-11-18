import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'info' | 'purple';
}

export const Badge: React.FC<BadgeProps> = ({ 
  className, 
  variant = 'default', 
  ...props 
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors border",
        {
          'bg-emerald-500/15 text-emerald-400 border-emerald-500/30': variant === 'default' || variant === 'success',
          'bg-slate-800 text-slate-300 border-slate-700': variant === 'secondary',
          'text-slate-400 border-slate-700/60': variant === 'outline',
          'bg-amber-500/15 text-amber-400 border-amber-500/30': variant === 'warning',
          'bg-sky-500/15 text-sky-400 border-sky-500/30': variant === 'info',
          'bg-purple-500/15 text-purple-400 border-purple-500/30': variant === 'purple',
        },
        className
      )}
      {...props}
    />
  );
};

