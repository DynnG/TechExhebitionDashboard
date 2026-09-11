import type { Event, QueueItem } from "@prisma/client";

export type Locale = "en" | "zh";
export type EventRecord = Omit<Event, "startDate" | "endDate" | "attendedAt" | "createdAt" | "updatedAt"> & {
  startDate: string | null;
  endDate: string | null;
  attendedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
export type QueueRecord = Omit<QueueItem, "createdAt" | "resolvedAt"> & {
  createdAt: string;
  resolvedAt: string | null;
  event: EventRecord | null;
  submittedBy: { name: string; email: string; role: string } | null;
};

// The 27 numbered business fields in prisma/schema.prisma, in source order.
export const DOSSIER_FIELDS = [
  { key: "eventNumber", en: "No.", zh: "编号", group: "identity" },
  { key: "region", en: "Region", zh: "地区", group: "identity" },
  { key: "country", en: "Country", zh: "国家", group: "identity" },
  { key: "city", en: "City", zh: "城市", group: "identity" },
  { key: "eventName", en: "Event Name", zh: "展会名称", group: "identity" },
  { key: "dates", en: "Date(s)", zh: "日期", group: "identity" },
  { key: "venue", en: "Venue", zh: "场馆", group: "identity" },
  { key: "locationAddress", en: "Location Address", zh: "详细地址", group: "identity" },
  { key: "officialWebsite", en: "Official Website", zh: "官方网站", group: "source" },
  { key: "organizer", en: "Organizer", zh: "主办方", group: "source" },
  { key: "eventCategory", en: "Event Category", zh: "展会类别", group: "source" },
  { key: "businessLines", en: "Business Line(s)", zh: "业务线", group: "strategy" },
  { key: "strategicFocus", en: "Strategic Focus / Purpose", zh: "战略重点与目的", group: "strategy" },
  { key: "relevanceToLifewood", en: "Relevance to Lifewood", zh: "与活树的关联", group: "strategy" },
  { key: "targetAudience", en: "Target Audience", zh: "目标受众", group: "strategy" },
  { key: "estimatedAttendees", en: "Estimated Attendees", zh: "预计参会人数", group: "commercial" },
  { key: "exhibitorOpportunity", en: "Exhibitor / Sponsor Opportunity", zh: "参展与赞助机会", group: "commercial" },
  { key: "boothCost", en: "Booth or Sponsorship Cost", zh: "展位或赞助费用", group: "commercial" },
  { key: "registrationDeadline", en: "Registration Deadline", zh: "报名截止日期", group: "commercial" },
  { key: "contactEmail", en: "Contact Email", zh: "联系邮箱", group: "commercial" },
  { key: "contactPerson", en: "Contact Person", zh: "联系人", group: "commercial" },
  { key: "socialMedia", en: "LinkedIn / Social Media", zh: "领英与社交媒体", group: "commercial" },
  { key: "participationRec", en: "Participation Recommendation", zh: "参与建议", group: "strategy" },
  { key: "priorityLevel", en: "Priority Level", zh: "优先级", group: "strategy" },
  { key: "fitScore", en: "Fit Score (1–5)", zh: "匹配评分（1–5）", group: "strategy" },
  { key: "keyNotes", en: "Key Notes", zh: "关键备注", group: "provenance" },
  { key: "sourceLinks", en: "Source Links", zh: "来源链接", group: "provenance" },
] as const satisfies ReadonlyArray<{ key: keyof Event; en: string; zh: string; group: string }>;

export type DossierKey = (typeof DOSSIER_FIELDS)[number]["key"];
export type DossierEvent = Pick<Event, DossierKey> & { startDate?: Date | string | null; endDate?: Date | string | null };
export const DOSSIER_GROUPS = [
  { key: "identity", en: "Identity & location", zh: "身份与地点" },
  { key: "source", en: "Source & organizer", zh: "来源与主办方" },
  { key: "strategy", en: "Strategic assessment", zh: "战略评估" },
  { key: "commercial", en: "Commercial & contact details", zh: "商务与联系方式" },
  { key: "provenance", en: "Notes & provenance", zh: "备注与溯源" },
] as const;

export function parseStringList(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === "string" && !!item.trim());
    if (typeof parsed === "string") return parsed.trim() ? [parsed] : [];
    return [];
  } catch { return [value.trim()]; }
}

export function safeDossierLink(value: string, email = false): string | null {
  const trimmed = value.trim();
  if (/[\u0000-\u0020\u007f]/.test(trimmed)) return null;
  if (email && /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(trimmed)) return `mailto:${trimmed}`;
  try {
    const url = new URL(trimmed);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function displayDate(value: string | Date | null | undefined, locale: Locale): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString(locale === "en" ? "en-US" : "zh-CN", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export function dossierValues(event: DossierEvent, key: DossierKey, locale: Locale): string[] {
  const unknown = locale === "en" ? "Not publicly disclosed" : "未公开披露";
  if (key === "dates" && event.startDate && !/TBA|provisional|Q[1-4]|待定/i.test(event.dates)) {
    const start = displayDate(event.startDate, locale);
    const end = displayDate(event.endDate, locale);
    if (start !== "—") return [end !== "—" && end !== start ? `${start} – ${end}` : start];
  }
  const value = event[key];
  const values = key === "businessLines" || key === "sourceLinks" ? parseStringList(String(value ?? "")) : [String(value ?? "").trim()];
  return values.length ? values.map(item => !item || item === "Not publicly disclosed" ? unknown : item) : [unknown];
}

export function sessionRole(user: unknown): string {
  return user && typeof user === "object" && "role" in user && typeof user.role === "string" ? user.role : "USER";
}
