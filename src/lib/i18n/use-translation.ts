"use client";

import { useCallback } from "react";
import { useLocaleStore } from "@/stores/locale-store";
import { DICTIONARIES, TranslationKey } from "./dictionaries";
import {
  localizeEvent as rawLocalizeEvent,
  localizeEvents as rawLocalizeEvents,
  localizeDateString as rawLocalizeDateString,
  localizeMonthYear as rawLocalizeMonthYear,
  localizeBusinessLineName as rawLocalizeBL,
  localizeRegionName as rawLocalizeRegion,
  localizeCountryName as rawLocalizeCountry,
  localizeCityName as rawLocalizeCity,
  localizeRecommendation as rawLocalizeRec,
  localizePriority as rawLocalizePriority,
} from "./event-localization";

export function useTranslation() {
  const { locale, setLocale, toggleLocale } = useLocaleStore();

  const t = useCallback(
    (key: TranslationKey | string, fallback?: string): string => {
      const dict = DICTIONARIES[locale] as Record<string, string>;
      if (dict && dict[key]) {
        return dict[key];
      }
      const enDict = DICTIONARIES.en as Record<string, string>;
      if (enDict && enDict[key]) {
        return enDict[key];
      }
      return fallback !== undefined ? fallback : key;
    },
    [locale]
  );

  const localizeEvent = useCallback(
    <T extends Record<string, any>>(event: T): T => {
      return rawLocalizeEvent(event, locale);
    },
    [locale]
  );

  const localizeEvents = useCallback(
    <T extends Record<string, any>>(events: T[]): T[] => {
      return rawLocalizeEvents(events, locale);
    },
    [locale]
  );

  const localizeDate = useCallback(
    (dateStr: string): string => {
      return rawLocalizeDateString(dateStr, locale);
    },
    [locale]
  );

  const localizeMonth = useCallback(
    (monthStr: string): string => {
      return rawLocalizeMonthYear(monthStr, locale);
    },
    [locale]
  );

  const localizeBusinessLine = useCallback(
    (blName: string): string => {
      return rawLocalizeBL(blName, locale);
    },
    [locale]
  );

  const localizeRegion = useCallback(
    (region: string): string => {
      return rawLocalizeRegion(region, locale);
    },
    [locale]
  );

  const localizeCountry = useCallback(
    (country: string): string => {
      return rawLocalizeCountry(country, locale);
    },
    [locale]
  );

  const localizeCity = useCallback(
    (city: string): string => {
      return rawLocalizeCity(city, locale);
    },
    [locale]
  );

  const localizeRec = useCallback(
    (rec: string): string => {
      return rawLocalizeRec(rec, locale);
    },
    [locale]
  );

  const localizePriorityValue = useCallback(
    (priority: string): string => {
      return rawLocalizePriority(priority, locale);
    },
    [locale]
  );

  return {
    locale,
    setLocale,
    toggleLocale,
    t,
    localizeEvent,
    localizeEvents,
    localizeDate,
    localizeMonth,
    localizeBusinessLine,
    localizeRegion,
    localizeCountry,
    localizeCity,
    localizeRec,
    localizePriority: localizePriorityValue,
  };
}
