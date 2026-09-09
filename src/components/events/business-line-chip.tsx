import { BUSINESS_LINES } from "@/lib/constants/business-lines";

interface BusinessLineChipProps {
  name: string;
  className?: string;
}

export function BusinessLineChip({ name, className = "" }: BusinessLineChipProps) {
  const config = BUSINESS_LINES.find(
    (b) => b.name.toLowerCase() === name.toLowerCase()
  );

  const bgStyle = config ? { backgroundColor: config.colorHex } : { backgroundColor: "#046241" };

  return (
    <span
      style={bgStyle}
      className={`inline-block px-[11px] py-[3px] rounded-full text-[11px] font-medium font-manrope text-white shadow-2xs tracking-tight whitespace-nowrap ${className}`}
    >
      {name}
    </span>
  );
}
