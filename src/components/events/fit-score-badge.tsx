interface FitScoreBadgeProps {
  score: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FitScoreBadge({ score, className = "", size = "md" }: FitScoreBadgeProps) {
  // Fit 5: Saffron pill (#FFB347, text #133020)
  // Fit 4: Earth Yellow pill (#FFC370, text #133020)
  // Fit 3: Castleton Green border outline (#046241)
  let badgeStyle = "border-2 border-[#046241] text-[#046241] bg-white font-bold";
  if (score >= 5) {
    badgeStyle = "bg-[#FFB347] text-[#133020] font-bold border border-[#FFB347]";
  } else if (score === 4) {
    badgeStyle = "bg-[#FFC370] text-[#133020] font-bold border border-[#FFC370]";
  }

  const sizeStyle =
    size === "lg"
      ? "w-9 h-9 rounded-[8px] text-base"
      : size === "sm"
      ? "w-6 h-6 rounded-[6px] text-xs"
      : "w-8 h-8 rounded-[8px] text-[14px]";

  return (
    <div
      title={`Fit score: ${score}/5`}
      className={`${sizeStyle} ${badgeStyle} font-manrope flex items-center justify-center shrink-0 select-none shadow-xs ${className}`}
    >
      {score}
    </div>
  );
}
