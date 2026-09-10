"use client";

import { useTranslation } from "@/lib/i18n/use-translation";

interface FitScoreBadgeProps {
  score: number;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showLevel?: boolean;
}

export function FitScoreBadge({ score, className = "", size = "md", showLevel = false }: FitScoreBadgeProps) {
  const { locale } = useTranslation();

  let bgClass = "bg-[#708E7C]"; // Fit 3: muted green
  if (score >= 5) bgClass = "bg-[#133020]"; // Fit 5: Dark Serpent
  else if (score === 4) bgClass = "bg-[#046241]"; // Fit 4: Castleton Green

  const sizeStyle =
    size === "xl"
      ? "w-10 h-10 rounded-[10px] text-lg font-bold"
      : size === "lg"
      ? "w-9 h-9 rounded-[8px] text-base"
      : size === "sm"
      ? "w-6 h-6 rounded-[6px] text-xs"
      : "w-8 h-8 rounded-[8px] text-[15px]";

  const levelLabel =
    score >= 5
      ? locale === "zh"
        ? "直接匹配"
        : "Direct Fit"
      : score === 4
      ? locale === "zh"
        ? "高度契合"
        : "Strong Fit"
      : locale === "zh"
      ? "中度契合"
      : "Moderate Fit";

  const badge = (
    <div
      title={
        locale === "zh"
          ? `战略适配度：${score}/5 (${levelLabel})`
          : `Fit score: ${score}/5 (${levelLabel})`
      }
      className={`${sizeStyle} ${bgClass} text-white font-manrope font-semibold flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.1)] border border-white/20 shrink-0 select-none ${className}`}
    >
      {score}
    </div>
  );

  if (!showLevel) return badge;

  return (
    <div className="inline-flex items-center gap-1.5">
      {badge}
      <span className="text-[11px] font-bold text-[#133020] whitespace-nowrap">
        {levelLabel}
      </span>
    </div>
  );
}
