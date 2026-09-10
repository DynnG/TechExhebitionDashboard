"use client";

import { BUSINESS_LINES } from "@/lib/constants/business-lines";
import { useTranslation } from "@/lib/i18n/use-translation";
import { BUSINESS_LINES_MAP } from "@/lib/i18n/event-localization";

interface BusinessLineChipProps {
  name: string;
  className?: string;
}

export function BusinessLineChip({ name, className = "" }: BusinessLineChipProps) {
  const { locale } = useTranslation();

  // Look for match by English name or Chinese name
  const config = BUSINESS_LINES.find((b) => {
    const zhName = BUSINESS_LINES_MAP[b.name] || "";
    return (
      b.name.toLowerCase() === name.toLowerCase() ||
      zhName.toLowerCase() === name.toLowerCase() ||
      name.includes(b.name) ||
      (zhName && name.includes(zhName))
    );
  });

  const bgStyle = config ? { backgroundColor: config.colorHex } : { backgroundColor: "#046241" };

  // Translate name if Chinese locale
  const displayName =
    locale === "zh"
      ? BUSINESS_LINES_MAP[name] || (config ? BUSINESS_LINES_MAP[config.name] || name : name)
      : config
      ? config.name
      : name;

  return (
    <span
      style={bgStyle}
      className={`inline-block px-[11px] py-[3px] rounded-full text-[11px] font-medium font-manrope text-white shadow-2xs tracking-tight whitespace-nowrap ${className}`}
    >
      {displayName}
    </span>
  );
}
