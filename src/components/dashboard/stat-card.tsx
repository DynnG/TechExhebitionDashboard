import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  accentColor?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#D8D2C8] shadow-xs flex items-start justify-between relative overflow-hidden group hover:shadow-md transition">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#666666] block mb-1">
          {title}
        </span>
        <div className="text-3xl font-extrabold text-[#133020] tracking-tight my-1">
          {value}
        </div>
        <p className="text-xs text-[#046241] font-medium">{subtitle}</p>
      </div>

      <div className="w-12 h-12 rounded-xl bg-[#FFB347]/15 border border-[#FFB347]/30 flex items-center justify-center text-[#133020] shrink-0">
        <Icon className="w-6 h-6 text-[#C17110]" />
      </div>
    </div>
  );
}
