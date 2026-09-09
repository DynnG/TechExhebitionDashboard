interface FitScoreBadgeProps {
  score: number;
  className?: string;
}

export function FitScoreBadge({ score, className = "" }: FitScoreBadgeProps) {
  let bgClass = "bg-[#708E7C]"; // Fit 3: muted green
  if (score === 5) bgClass = "bg-[#133020]"; // Fit 5: Dark Serpent
  if (score === 4) bgClass = "bg-[#046241]"; // Fit 4: Castleton Green

  return (
    <div
      title={`Fit score: ${score}/5`}
      className={`w-8 h-8 rounded-[8px] ${bgClass} text-white font-manrope font-semibold text-[15px] flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.1)] border border-white/20 shrink-0 select-none ${className}`}
    >
      {score}
    </div>
  );
}
