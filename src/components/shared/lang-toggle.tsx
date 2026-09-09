"use client";

import { useEffect } from "react";
import { useLocaleStore } from "@/stores/locale-store";
import { Globe } from "lucide-react";

export function LangToggle() {
  const { locale, toggleLocale } = useLocaleStore();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      if (locale === "zh") {
        document.documentElement.classList.add("font-zh");
      } else {
        document.documentElement.classList.remove("font-zh");
      }
    }
  }, [locale]);

  return (
    <button
      onClick={toggleLocale}
      title="Switch Language"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D8D2C8] bg-white text-xs font-semibold text-[#133020] hover:bg-[#F9F7F7] transition shadow-sm"
    >
      <Globe className="w-3.5 h-3.5 text-[#046241]" />
      <span className={locale === "en" ? "text-[#046241] font-bold" : "text-[#666666]"}>EN</span>
      <span className="text-[#CCCCCC]">|</span>
      <span className={locale === "zh" ? "text-[#046241] font-bold" : "text-[#666666]"}>中文</span>
    </button>
  );
}
