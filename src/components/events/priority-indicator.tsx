interface PriorityIndicatorProps {
  priority: string;
  className?: string;
}

export function PriorityIndicator({ priority, className = "" }: PriorityIndicatorProps) {
  let dotColor = "#9CAFA4";
  let textColor = "text-[#9CAFA4]";
  const normPriority = (priority || "").toLowerCase();

  if (normPriority === "high") {
    dotColor = "#C17110";
    textColor = "text-[#C17110]";
  } else if (normPriority === "medium") {
    dotColor = "#FFB347";
    textColor = "text-[#E89131]";
  }

  // Ensure sentence case: High, Medium, Low
  const displayLabel = priority
    ? priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()
    : "Low";

  return (
    <div className={`flex items-center gap-1.5 text-[12px] font-medium font-manrope ${className}`}>
      <span
        className="w-[7px] h-[7px] rounded-full inline-block shrink-0"
        style={{ backgroundColor: dotColor }}
      />
      <span className={textColor}>{displayLabel}</span>
    </div>
  );
}
