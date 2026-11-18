import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'glow';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]",
          {
            'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 hover:shadow-emerald-500/20 shadow-emerald-900/30': variant === 'default',
            'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30': variant === 'destructive',
            'border border-slate-700/80 bg-slate-800/40 hover:bg-slate-800 hover:text-slate-100 text-slate-300': variant === 'outline',
            'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white': variant === 'secondary',
            'hover:bg-slate-800/60 hover:text-slate-100 text-slate-400': variant === 'ghost',
            'text-emerald-400 underline-offset-4 hover:underline p-0 h-auto': variant === 'link',
            'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400': variant === 'glow',
          },
          {
            'h-9 px-4 py-2': size === 'default',
            'h-8 rounded-md px-3 text-xs': size === 'sm',
            'h-11 rounded-xl px-6 text-base': size === 'lg',
            'h-9 w-9 p-0': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

