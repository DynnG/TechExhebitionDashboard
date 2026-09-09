import { LucideIcon } from "lucide-react";
import { BorderGlow } from "@/components/shared/border-glow";
import { motion } from "framer-motion";

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
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="p-5 flex items-start justify-between relative overflow-hidden font-manrope hover:bg-emerald-900/5 dark:hover:bg-white/5 transition-colors duration-200"
      >
        {/* Editorial top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FFB347] via-[#FFB347]/50 to-transparent" />

        <div className="space-y-1">
          <span className="text-[11px] font-semibold tracking-normal text-emerald-800/70 dark:text-slate-400 block">
            {title}
          </span>
          <div className="text-[30px] font-extrabold text-emerald-950 dark:text-white tracking-tight leading-none my-1.5 flex items-baseline gap-1">
            <span>{value}</span>
          </div>
          <p className="text-[11.5px] text-emerald-700 dark:text-emerald-400 font-medium leading-none">
            {subtitle}
          </p>
        </div>

        <div className="w-11 h-11 rounded-[10px] bg-[#F5EEDB] dark:bg-black/20 border border-[#D8D2C8] dark:border-white/10 flex items-center justify-center text-emerald-950 dark:text-slate-100 shrink-0">
          <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
      </motion.div>
    </BorderGlow>
  );
}
