"use client";

import { ModalPortal } from "@/components/shared/modal-portal";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";

interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  eventName?: string;
  description?: string;
  isDeleting?: boolean;
}

export function DeleteEventModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  eventName,
  description,
  isDeleting = false,
}: DeleteEventModalProps) {
  const { locale } = useTranslation();

  const modalTitle =
    title ||
    (locale === "zh" ? "确认删除展会记录" : "Confirm Event Deletion");

  const modalDescription =
    description ||
    (locale === "zh"
      ? "此操作不可逆。该展会记录将从系统数据库中永久删除。"
      : "This action cannot be undone. This event record will be permanently deleted from the database.");

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md">
      <div className="p-6 font-manrope space-y-5 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#666666] hover:text-[#133020] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition disabled:opacity-50"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/40 flex items-center justify-center shrink-0 text-rose-600 dark:text-rose-400 shadow-sm">
            <Trash2 className="w-6 h-6" />
          </div>

          <div className="space-y-1 pt-0.5 pr-6">
            <h3 className="text-lg font-bold text-[#133020] dark:text-white tracking-tight leading-tight">
              {modalTitle}
            </h3>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold uppercase tracking-wider">
              {locale === "zh" ? "警告：不可恢复" : "Warning: Irreversible action"}
            </p>
          </div>
        </div>

        {/* Event Name Preview (if passed) */}
        {eventName && (
          <div className="p-3.5 rounded-xl bg-[#F9F7F7] dark:bg-[#1A3D2A] border border-[#D8D2C8] dark:border-[#235338]">
            <span className="text-[10px] font-bold text-[#666666] dark:text-slate-400 uppercase tracking-wider block mb-1">
              {locale === "zh" ? "目标展会" : "Target Exhibition"}
            </span>
            <p className="text-sm font-semibold text-[#133020] dark:text-white line-clamp-2">
              {eventName}
            </p>
          </div>
        )}

        {/* Description Body */}
        <div className="flex items-start gap-2.5 text-xs text-[#666666] dark:text-slate-300 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{modalDescription}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#D8D2C8] dark:border-[#1E4830]">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#133020] dark:text-slate-200 border border-[#D8D2C8] dark:border-[#1E4830] hover:bg-black/5 dark:hover:bg-white/5 transition disabled:opacity-50 cursor-pointer"
          >
            {locale === "zh" ? "取消" : "Cancel"}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] transition-all shadow-md shadow-rose-600/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{locale === "zh" ? "正在删除..." : "Deleting..."}</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>{locale === "zh" ? "确认删除" : "Delete Event"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}
