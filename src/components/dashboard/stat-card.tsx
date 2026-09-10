import { LucideIcon } from "lucide-react";
import { BorderGlow } from "@/components/shared/border-glow";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  accentColor?: string;
  glowColor?: "green" | "saffron";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  glowColor = "green",
}: StatCardProps) {
  return (
    <BorderGlow glowColor={glowColor} borderRadius="12px" className="w-full">
      <div className="p-5 min-h-[124px] flex items-start justify-between relative overflow-hidden font-manrope">
        {/* Editorial top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FFB347] via-[#FFB347]/40 to-transparent" />

        <div className="space-y-1">
          <span className="text-[11px] font-semibold tracking-normal text-[#666666] block">
            {title}
          </span>
          <div className="text-[32px] font-extrabold text-[#133020] tracking-tight leading-none my-1.5 flex items-baseline gap-1">
            <span>{value}</span>
          </div>
          <p className="text-[11.5px] text-[#046241] font-medium leading-none">
            {subtitle}
          </p>
        </div>

        <div className="w-11 h-11 rounded-[10px] bg-[#F5EEDB] border border-[#D8D2C8] flex items-center justify-center text-[#133020] shrink-0">
          <Icon className="w-5 h-5 text-[#C17110]" />
        </div>
      </div>
    </BorderGlow>
  );
}
