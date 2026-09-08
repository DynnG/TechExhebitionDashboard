import { BUSINESS_LINES } from "@/lib/constants/business-lines";

interface BusinessLineChipProps {
  name: string;
}

export function BusinessLineChip({ name }: BusinessLineChipProps) {
  const config = BUSINESS_LINES.find(
    (b) => b.name.toLowerCase() === name.toLowerCase()
  );

  const bgStyle = config ? { backgroundColor: config.colorHex } : { backgroundColor: "#046241" };

  return (
    <span
      style={bgStyle}
      className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium text-white shadow-xs tracking-tight"
    >
      {name}
    </span>
  );
}
