"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Eye, Leaf, Loader2, X } from "lucide-react";
import { DOSSIER_FIELDS, DOSSIER_GROUPS, dossierValues, safeDossierLink, type DossierEvent, type EventRecord, type Locale } from "@/lib/events/dossier";
import s from "./operations.module.css";

export function PageHeader({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return <header className={s.header}><div><p className={s.eyebrow}>{eyebrow}</p><h1 className={s.title}>{title}</h1><p className={s.description}>{description}</p></div>{children}</header>;
}

export function StatusPill({ status, locale }: { status: string; locale: Locale }) {
  const labels: Record<string, [string, string]> = { APPROVED: ["Approved", "已批准"], REJECTED: ["Rejected", "已拒绝"], PENDING: ["Pending approval", "待审批"], ATTENDED: ["Attended", "已参加"], FOR_REVIEW: ["Submission", "提交记录"], CORRECTION: ["Data edit", "数据更正"] };
  return <span className={`${s.pill} ${status === "PENDING" ? s.pending : status === "REJECTED" ? s.negative : s.positive}`}>{labels[status]?.[locale === "en" ? 0 : 1] ?? status}</span>;
}

export function EmptyState({ title, description, pills = [] }: { title: string; description: string; pills?: string[] }) {
  return <section className={s.empty} role="status"><div className={s.emptyIcon} aria-hidden="true"><Leaf size={42} strokeWidth={1.3} /><Check size={18} className="absolute bottom-4 right-4" /></div><h3>{title}</h3><p>{description}</p><div className={s.actions}>{pills.map(pill => <span className={`${s.pill} ${s.positive}`} key={pill}><Check size={12} aria-hidden="true" />{pill}</span>)}</div></section>;
}

export function LoadState({ locale, error, retry }: { locale: Locale; error?: boolean; retry?: () => void }) {
  return error ? <div className={s.error} role="alert"><span>{locale === "en" ? "We couldn’t load these records. Please try again." : "无法加载记录，请重试。"}</span><button className={s.button} onClick={retry}>{locale === "en" ? "Try again" : "重试"}</button></div> : <div className={s.loading} role="status"><Loader2 className="animate-spin motion-reduce:animate-none" size={20} />{locale === "en" ? "Loading records…" : "正在加载记录…"}</div>;
}

export function OperationDialog({ open, onClose, title, description, children, locale }: { open: boolean; onClose: () => void; title: string; description: string; children: ReactNode; locale: Locale }) {
  const returnFocus = useRef<HTMLElement | null>(null);
  return <Dialog.Root open={open} onOpenChange={value => { if (!value) onClose(); }}><Dialog.Portal><Dialog.Overlay className={s.overlay} /><Dialog.Content className={s.dialog} onOpenAutoFocus={() => { returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; }} onCloseAutoFocus={event => { event.preventDefault(); if (returnFocus.current?.isConnected) returnFocus.current.focus(); }}><div className={s.dialogHeader}><div><Dialog.Title className={s.cardTitle}>{title}</Dialog.Title><Dialog.Description className="mt-2 text-xs text-white/75">{description}</Dialog.Description></div><Dialog.Close asChild><button type="button" className={s.button} aria-label={locale === "en" ? "Close dialog" : "关闭对话框"}><X size={18} /></button></Dialog.Close></div><div className={s.dialogBody}>{children}</div></Dialog.Content></Dialog.Portal></Dialog.Root>;
}

export function DossierFields({ event, locale }: { event: DossierEvent; locale: Locale }) {
  return <>{DOSSIER_GROUPS.map(group => <section key={group.key}><h3 className={s.eyebrow}>{group[locale]}</h3><dl className={s.fields}>{DOSSIER_FIELDS.filter(field => field.group === group.key).map(field => <div className={s.field} key={field.key}><dt>{field[locale]}</dt><dd>{dossierValues(event, field.key, locale).map((value, index) => { const href = ["officialWebsite", "sourceLinks", "socialMedia", "contactEmail"].includes(field.key) ? safeDossierLink(value, field.key === "contactEmail") : null; return <div key={index}>{href ? <a href={href} target="_blank" rel="noopener noreferrer">{value}</a> : value}</div>; })}</dd></div>)}</dl></section>)}</>;
}

export function DossierDialog({ event, locale, onClose, context }: { event: EventRecord | null; locale: Locale; onClose: () => void; context?: ReactNode }) {
  return <OperationDialog open={!!event} onClose={onClose} locale={locale} title={locale === "en" ? "Exhibition dossier" : "展会档案"} description={event ? `#${event.eventNumber} · ${event.eventName}` : ""}>{context}{event && <DossierFields event={event} locale={locale} />}</OperationDialog>;
}

export function HistoryRecordCard({ event, locale, status, metadata, note, onInspect, actions }: { event: EventRecord; locale: Locale; status: string; metadata: Array<[string, string]>; note?: string; onInspect: () => void; actions?: ReactNode }) {
  return <article className={`${s.card} ${s.record}`}><div className={s.toolbar}><StatusPill status={status} locale={locale} /><span className={s.hint}>#{event.eventNumber} · {event.region}</span></div><button className={s.recordTitle} onClick={onInspect}>{event.eventName}</button><dl className={s.metadata}>{[[locale === "en" ? "Event dates" : "展会日期", dossierValues(event, "dates", locale)[0]], [locale === "en" ? "Location" : "地点", [event.city, event.country].filter(Boolean).join(", ") || "—"], ...metadata].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className={s.actions}><span className={s.pill}>{locale === "en" ? "Fit" : "匹配"} {event.fitScore} / 5</span><span className={s.pill}>{dossierValues(event, "businessLines", locale).join(" · ")}</span></div>{note && <p className={s.note}>{note}</p>}<footer className={s.recordFooter}><button className={s.button} onClick={onInspect}><Eye size={15} />{locale === "en" ? "View dossier" : "查看档案"}</button>{actions}</footer></article>;
}
