"use client";

import { useTranslation } from "@/lib/i18n/use-translation";

interface PriorityIndicatorProps {
  priority: string;
  className?: string;
}

export function PriorityIndicator({ priority, className = "" }: PriorityIndicatorProps) {
  const { locale } = useTranslation();

  let dotColor = "#9CAFA4";
  let textColor = "text-[#9CAFA4]";
  const normPriority = (priority || "").toLowerCase();

  const isHigh = normPriority === "high" || normPriority === "高";
  const isMed = normPriority === "medium" || normPriority === "中";

  if (isHigh) {
    dotColor = "#C17110";
    textColor = "text-[#C17110]";
  } else if (isMed) {
    dotColor = "#FFB347";
    textColor = "text-[#E89131]";
  }

  let displayLabel = "Low";
  if (locale === "zh") {
    displayLabel = isHigh ? "高" : isMed ? "中" : "低";
  } else {
    displayLabel = isHigh ? "High" : isMed ? "Medium" : "Low";
  }

  return (
    <div
      title={
        locale === "zh"
          ? `${displayLabel}优先级`
          : `${displayLabel} priority`
      }
      className={`flex items-center gap-1.5 text-[12px] font-medium font-manrope ${className}`}
    >
      <span
        className="w-[7px] h-[7px] rounded-full inline-block shrink-0"
        style={{ backgroundColor: dotColor }}
      />
      <span className={textColor}>{displayLabel}</span>
    </div>
  );
}
