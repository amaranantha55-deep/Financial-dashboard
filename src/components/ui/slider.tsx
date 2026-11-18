import * as React from "react";
import { cn } from "../../lib/utils";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({
  className,
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled,
  ...props
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        style={{
          background: `linear-gradient(to right, #10b981 0%, #10b981 ${percentage}%, #1e293b ${percentage}%, #1e293b 100%)`
        }}
        {...props}
      />
    </div>
  );
};

