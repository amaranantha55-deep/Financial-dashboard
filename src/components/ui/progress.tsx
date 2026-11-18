import * as React from "react";
import { cn } from "../../lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  indicatorColor?: string;
}

export const Progress: React.FC<ProgressProps> = ({ 
  className, 
  value = 0, 
  indicatorColor = "bg-emerald-500", 
  ...props 
}) => {
  const percentage = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn("relative h-2.5 w-full overflow-hidden rounded-full bg-slate-800", className)}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-500 ease-out rounded-full", indicatorColor)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

