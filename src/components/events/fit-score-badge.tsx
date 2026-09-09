interface FitScoreBadgeProps {
  score: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FitScoreBadge({ score, className = "", size = "md" }: FitScoreBadgeProps) {
  let bgClass = "bg-[#708E7C]"; // Fit 3: muted green
  if (score >= 5) bgClass = "bg-[#133020]"; // Fit 5: Dark Serpent
  else if (score === 4) bgClass = "bg-[#046241]"; // Fit 4: Castleton Green

  const sizeStyle =
    size === "lg"
      ? "w-9 h-9 rounded-[8px] text-base"
      : size === "sm"
      ? "w-6 h-6 rounded-[6px] text-xs"
      : "w-8 h-8 rounded-[8px] text-[15px]";

  return (
    <div
      title={`Fit score: ${score}/5`}
      className={`${sizeStyle} ${bgClass} text-white font-manrope font-semibold flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.1)] border border-white/20 shrink-0 select-none ${className}`}
    >
      {score}
    </div>
  );
}

