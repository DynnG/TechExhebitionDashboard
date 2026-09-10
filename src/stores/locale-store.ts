import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Locale } from "@/lib/i18n/types";

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale) => {
        if (typeof document !== "undefined") {
          document.documentElement.lang = locale;
          if (locale === "zh") {
            document.documentElement.classList.add("font-zh");
          } else {
            document.documentElement.classList.remove("font-zh");
          }
        }
        set({ locale });
      },
      toggleLocale: () =>
        set((state) => {
          const nextLocale: Locale = state.locale === "en" ? "zh" : "en";
          if (typeof document !== "undefined") {
            document.documentElement.lang = nextLocale;
            if (nextLocale === "zh") {
              document.documentElement.classList.add("font-zh");
            } else {
              document.documentElement.classList.remove("font-zh");
            }
          }
          return { locale: nextLocale };
        }),
    }),
    {
      name: "lifewood-locale-storage",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : ({} as any))),
    }
  )
);
