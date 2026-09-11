"use client";

import { useState, useEffect } from "react";
import { useLocaleStore } from "@/stores/locale-store";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function LangToggle() {
  const { locale, toggleLocale } = useLocaleStore();
  const [isHovered, setIsHovered] = useState(false);

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

  const handleSelect = (targetLang: "en" | "zh") => {
    if (locale !== targetLang) {
      toggleLocale();
      toast.success(
        targetLang === "en"
          ? "Language switched to English"
          : "语言已切换为 中文",
      );
    }
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{
        width: isHovered ? "auto" : "2.5rem",
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="relative flex items-center h-10 border rounded-full px-2.5 cursor-pointer shadow-xs overflow-hidden select-none transition-colors duration-300 bg-[#133020] border-[#046241] text-[#FFB347] dark:bg-[#061A10] dark:border-[#046241]/60 dark:text-[#34D399]"
    >
      {/* Globe Icon */}
      <motion.div
        animate={{
          rotate: isHovered ? 180 : 0,
          scale: isHovered ? [1, 1.15, 1] : 1,
        }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-center shrink-0"
      >
        <Globe className="w-5 h-5 text-[#FFB347] dark:text-[#34D399] transition-colors" />
      </motion.div>

      {/* Expanding Pill Content */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 ml-2 pr-1 text-xs font-bold whitespace-nowrap"
          >
            <button
              type="button"
              onClick={() => handleSelect("en")}
              className={`transition-colors hover:text-[#FFB347] cursor-pointer ${
                locale === "en"
                  ? "text-[#FFB347]"
                  : "text-white/80 dark:text-white/70"
              }`}
            >
              EN
            </button>
            <span className="text-[#046241] font-normal">|</span>
            <button
              type="button"
              onClick={() => handleSelect("zh")}
              className={`transition-colors hover:text-[#FFB347] cursor-pointer ${
                locale === "zh"
                  ? "text-[#FFB347]"
                  : "text-white/80 dark:text-white/70"
              }`}
            >
              中文
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
