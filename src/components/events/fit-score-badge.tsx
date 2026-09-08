interface FitScoreBadgeProps {
  score: number;
}

export function FitScoreBadge({ score }: FitScoreBadgeProps) {
  let bgClass = "bg-[#708E7C]";
  if (score === 5) bgClass = "bg-[#133020]";
  if (score === 4) bgClass = "bg-[#046241]";

  return (
    <div
      title={`Fit Score: ${score}/5`}
      className={`w-8 h-8 rounded-lg ${bgClass} text-white font-bold text-sm flex items-center justify-center shadow-sm border border-white/20 shrink-0`}
    >
      {score}
    </div>
  );
}
