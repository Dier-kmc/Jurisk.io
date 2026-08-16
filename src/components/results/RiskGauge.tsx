interface RiskGaugeProps {
  value: number;
  label: string;
  invert?: boolean;
}

export function RiskGauge({ value, label, invert = false }: RiskGaugeProps) {
  const v = Math.max(0, Math.min(100, value));
  const color = invert
    ? v >= 66 ? "stroke-risk-low" : v >= 33 ? "stroke-risk-medium" : "stroke-risk-high"
    : v >= 66 ? "stroke-risk-high" : v >= 33 ? "stroke-risk-medium" : "stroke-risk-low";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
          <circle cx="40" cy="40" r="34" fill="none" strokeWidth="6" className="stroke-white/10" />
          <circle
            cx="40" cy="40" r="34" fill="none" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${(v / 100) * 213.6} 213.6`} className={color} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-foreground tnum">
          {Math.round(v)}
        </span>
      </div>
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted">{label}</span>
    </div>
  );
}