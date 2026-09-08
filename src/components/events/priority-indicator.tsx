interface PriorityIndicatorProps {
  priority: string;
}

export function PriorityIndicator({ priority }: PriorityIndicatorProps) {
  let dotColor = "#9CAFA4";
  let textColor = "text-[#9CAFA4]";

  if (priority === "High") {
    dotColor = "#C17110";
    textColor = "text-[#C17110]";
  } else if (priority === "Medium") {
    dotColor = "#FFB347";
    textColor = "text-[#E89131]";
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold">
      <span
        className="w-2 h-2 rounded-full inline-block"
        style={{ backgroundColor: dotColor }}
      />
      <span className={textColor}>{priority}</span>
    </div>
  );
}
