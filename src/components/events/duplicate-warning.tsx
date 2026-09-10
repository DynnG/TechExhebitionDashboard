import Link from "next/link";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { useLocaleStore } from "@/stores/locale-store";

interface DuplicateWarningProps {
  matches: any[];
  onDismiss: () => void;
}

export function DuplicateWarning({ matches, onDismiss }: DuplicateWarningProps) {
  const { locale } = useLocaleStore();
  if (!matches || matches.length === 0) return null;

  return (
    <div className="p-4 bg-[#FFB347]/15 border-l-4 border-[#C17110] rounded-r-lg mb-4 text-xs text-[#133020]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 font-bold text-[#C17110] text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {locale === "zh"
              ? `发现潜在重复展会 (${matches.length})`
              : `Possible Duplicate Event Found (${matches.length})`}
          </span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-[#666666] hover:text-[#133020] font-semibold text-xs cursor-pointer"
        >
          {locale === "zh" ? "仍要继续" : "Continue Anyway"}
        </button>
      </div>

      <p className="mt-1 text-[#666666]">
        {locale === "zh"
          ? "数据库中已存在同名或高度相似的展会。保存前请核实，避免产生重复记录："
          : "An event with a matching name already exists in the database. Please verify before saving to avoid duplicate records:"}
      </p>

      <ul className="mt-2 space-y-1.5">
        {matches.map((m) => (
          <li key={m.id} className="flex items-center justify-between bg-white/80 p-2 rounded border border-[#D8D2C8]">
            <span className="font-semibold text-[#133020]">
              #{m.eventNumber} — {m.eventName} ({m.city}, {m.country} • {m.dates})
            </span>
            <Link
              href={`/events/${m.id}`}
              target="_blank"
              className="text-[#046241] hover:underline font-semibold flex items-center gap-1 shrink-0"
            >
              <span>{locale === "zh" ? "查看详情" : "View Record"}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
