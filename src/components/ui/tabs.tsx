import * as React from "react";
import { cn } from "../../lib/utils";

interface TabsProps {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className }) => {
  return (
    <div className={cn("w-full flex flex-col", className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child as React.ReactElement<any>, {
          activeValue: value,
          onSelect: onValueChange
        });
      })}
    </div>
  );
};

export const TabsList: React.FC<{
  children: React.ReactNode;
  className?: string;
  activeValue?: string;
  onSelect?: (val: string) => void;
}> = ({ children, className, activeValue, onSelect }) => {
  return (
    <div className={cn("inline-flex items-center justify-center rounded-lg bg-slate-900/90 p-1 border border-slate-800 text-slate-400 text-xs", className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child as React.ReactElement<any>, {
          isActive: child.props.value === activeValue,
          onClick: () => onSelect && onSelect(child.props.value)
        });
      })}
    </div>
  );
};

export const TabsTrigger: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}> = ({ children, className, isActive, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-slate-800 text-emerald-400 font-semibold shadow-sm" : "hover:text-slate-200 text-slate-400",
        className
      )}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
  activeValue?: string;
}> = ({ value, children, className, activeValue }) => {
  if (value !== activeValue) return null;
  return <div className={cn("mt-3 focus-visible:outline-none animate-fadeIn", className)}>{children}</div>;
};

