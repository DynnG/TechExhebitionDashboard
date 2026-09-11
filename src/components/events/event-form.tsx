"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { REGIONS, BUSINESS_LINES, PARTICIPATION_OPTIONS } from "@/lib/constants/business-lines";
import { DuplicateWarning } from "./duplicate-warning";
import { Plus, Trash2, CheckCircle2, AlertCircle, Sparkles, Save, Info, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { LifewoodDropdown } from "@/components/shared/lifewood-dropdown";
import { useLocaleStore } from "@/stores/locale-store";
import { REGIONS_MAP, BUSINESS_LINES_MAP, RECOMMENDATIONS_MAP } from "@/lib/i18n/event-localization";

interface EventFormProps {
  initialData?: any;
  isEditing?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EventForm({ initialData, isEditing = false, onSuccess, onCancel }: EventFormProps) {
  const router = useRouter();
  const { locale } = useLocaleStore();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "INTERN";

  // Parse initial businessLines & sourceLinks
  let parsedBL: string[] = ["Global AI Data"];
  if (initialData?.businessLines) {
    try {
      parsedBL = JSON.parse(initialData.businessLines);
    } catch {
      parsedBL = Array.isArray(initialData.businessLines)
        ? initialData.businessLines
        : [initialData.businessLines];
    }
  }

  let parsedLinks: string[] = ["https://"];
  if (initialData?.sourceLinks) {
    try {
      parsedLinks = JSON.parse(initialData.sourceLinks);
    } catch {
      parsedLinks = Array.isArray(initialData.sourceLinks)
        ? initialData.sourceLinks
        : [initialData.sourceLinks];
    }
  }

  const [formData, setFormData] = useState({
    region: initialData?.region || "Asia",
    country: initialData?.country || "",
    city: initialData?.city || "",
    eventName: initialData?.eventName || "",
    dates: initialData?.dates || "",
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split("T")[0] : "",
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split("T")[0] : "",
    venue: initialData?.venue || "",
    locationAddress: initialData?.locationAddress || "",
    officialWebsite: initialData?.officialWebsite || "https://",
    organizer: initialData?.organizer || "",
    eventCategory: initialData?.eventCategory || "",
    businessLines: parsedBL,
    strategicFocus: initialData?.strategicFocus || "",
    relevanceToLifewood: initialData?.relevanceToLifewood || "",
    targetAudience: initialData?.targetAudience || "",
    estimatedAttendees: initialData?.estimatedAttendees || "Not publicly disclosed",
    exhibitorOpportunity: initialData?.exhibitorOpportunity || "Not publicly disclosed",
    boothCost: initialData?.boothCost || "Not publicly disclosed",
    registrationDeadline: initialData?.registrationDeadline || "Not publicly disclosed",
    contactEmail: initialData?.contactEmail || "Not publicly disclosed",
    contactPerson: initialData?.contactPerson || "Not publicly disclosed",
    socialMedia: initialData?.socialMedia || "Not publicly disclosed",
    participationRec: initialData?.participationRec || "Exhibit",
    fitScore: initialData?.fitScore || 4,
    priorityLevel: initialData?.priorityLevel || "High",
    keyNotes: initialData?.keyNotes || "",
    sourceLinks: parsedLinks,
  });

  const [duplicateMatches, setDuplicateMatches] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Field change handler that clears validation error for that field
  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (apiError) setApiError(null);
  };

  // Auto-derive priority from fit score
  const handleFitScoreChange = (score: number) => {
    let priority = "High";
    if (score === 3) priority = "Medium";
    setFormData((prev) => ({
      ...prev,
      fitScore: score,
      priorityLevel: priority,
    }));
    if (errors.fitScore) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.fitScore;
        return next;
      });
    }
  };

  const handleStartDatePicker = (dateStr: string) => {
    const newStart = dateStr;
    let newDates = formData.dates;
    if (newStart && formData.endDate) {
      const s = new Date(newStart);
      const e = new Date(formData.endDate);
      const sMonth = s.toLocaleString("en-US", { month: "short" });
      const eMonth = e.toLocaleString("en-US", { month: "short" });
      const year = s.getFullYear();
      if (sMonth === eMonth) {
        newDates = `${sMonth} ${s.getDate()}–${e.getDate()}, ${year}`;
      } else {
        newDates = `${sMonth} ${s.getDate()} – ${eMonth} ${e.getDate()}, ${year}`;
      }
    } else if (newStart) {
      const s = new Date(newStart);
      const sMonth = s.toLocaleString("en-US", { month: "short" });
      newDates = `${sMonth} ${s.getDate()}, ${s.getFullYear()}`;
    }
    handleFieldChange("startDate", newStart);
    handleFieldChange("dates", newDates);
  };

  const handleEndDatePicker = (dateStr: string) => {
    const newEnd = dateStr;
    let newDates = formData.dates;
    if (formData.startDate && newEnd) {
      const s = new Date(formData.startDate);
      const e = new Date(newEnd);
      const sMonth = s.toLocaleString("en-US", { month: "short" });
      const eMonth = e.toLocaleString("en-US", { month: "short" });
      const year = s.getFullYear();
      if (sMonth === eMonth) {
        newDates = `${sMonth} ${s.getDate()}–${e.getDate()}, ${year}`;
      } else {
        newDates = `${sMonth} ${s.getDate()} – ${eMonth} ${e.getDate()}, ${year}`;
      }
    }
    handleFieldChange("endDate", newEnd);
    handleFieldChange("dates", newDates);
  };

  // Real-time duplicate check on blur of eventName
  const handleNameBlur = async () => {
    if (!formData.eventName || formData.eventName.trim().length < 3 || isEditing) return;
    try {
      const res = await fetch(`/api/events/search?q=${encodeURIComponent(formData.eventName)}`);
      const data = await res.json();
      if (data.matches && data.matches.length > 0) {
        setDuplicateMatches(data.matches);
      }
    } catch {
      // Ignore search errors
    }
  };

  // Toggle business line check box
  const toggleBusinessLine = (name: string) => {
    setFormData((prev) => {
      const exists = prev.businessLines.includes(name);
      let updatedBL: string[] = [];
      if (exists) {
        if (prev.businessLines.length === 1) return prev; // Keep at least one
        updatedBL = prev.businessLines.filter((b) => b !== name);
      } else {
        updatedBL = [...prev.businessLines, name];
      }
      return { ...prev, businessLines: updatedBL };
    });
    if (errors.businessLines) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.businessLines;
        return next;
      });
    }
  };

  // Source links management
  const addSourceLink = () => {
    setFormData((prev) => ({
      ...prev,
      sourceLinks: [...prev.sourceLinks, "https://"],
    }));
  };

  const removeSourceLink = (index: number) => {
    if (formData.sourceLinks.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      sourceLinks: prev.sourceLinks.filter((_, i) => i !== index),
    }));
  };

  const updateSourceLink = (index: number, val: string) => {
    setFormData((prev) => {
      const newLinks = [...prev.sourceLinks];
      newLinks[index] = val;
      return { ...prev, sourceLinks: newLinks };
    });
    if (errors.sourceLinks) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.sourceLinks;
        return next;
      });
    }
  };

  // Quick NPD fill helper
  const setNPD = (field: string) => {
    handleFieldChange(field, locale === "zh" ? "尚未公开披露" : "Not publicly disclosed");
  };

  // Validation function
  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventName || !formData.eventName.trim()) {
      newErrors.eventName = locale === "zh" ? "展会名称为必填项。" : "Event name is required.";
    }

    if (!formData.country || !formData.country.trim()) {
      newErrors.country = locale === "zh" ? "举办国家/地区为必填项。" : "Country is required.";
    }

    if (!formData.city || !formData.city.trim()) {
      newErrors.city = locale === "zh" ? "城市为必填项。" : "City is required.";
    }

    if (!formData.dates || !formData.dates.trim()) {
      newErrors.dates = locale === "zh" ? "展期字符串为必填项。" : "Dates string is required.";
    }

    if (!formData.venue || !formData.venue.trim()) {
      newErrors.venue = locale === "zh" ? "展馆场地为必填项。" : "Venue is required.";
    }

    if (!formData.officialWebsite || !formData.officialWebsite.trim() || formData.officialWebsite === "https://") {
      newErrors.officialWebsite = locale === "zh" ? "官方网站为必填项。" : "Official website URL is required.";
    } else {
      try {
        const url = new URL(formData.officialWebsite);
        if (!url.protocol.startsWith("http")) {
          newErrors.officialWebsite = locale === "zh" ? "请提供有效的网站 URL (必须以 http:// 或 https:// 开头)。" : "Please provide a valid website URL starting with http:// or https://.";
        }
      } catch {
        newErrors.officialWebsite = locale === "zh" ? "官方网站 URL 格式不正确。" : "Invalid official website URL format.";
      }
    }

    if (!formData.organizer || !formData.organizer.trim()) {
      newErrors.organizer = locale === "zh" ? "主办机构为必填项。" : "Organizer is required.";
    }

    if (!formData.businessLines || formData.businessLines.length === 0) {
      newErrors.businessLines = locale === "zh" ? "请至少选择 1 个 Lifewood 对应业务线。" : "Please select at least 1 Lifewood business line.";
    }

    if (!formData.strategicFocus || !formData.strategicFocus.trim()) {
      newErrors.strategicFocus = locale === "zh" ? "战略侧重点与定位为必填项。" : "Strategic focus is required.";
    }

    if (!formData.relevanceToLifewood || !formData.relevanceToLifewood.trim()) {
      newErrors.relevanceToLifewood = locale === "zh" ? "与 Lifewood 的战略相关性为必填项。" : "Relevance to Lifewood is required.";
    }

    if (formData.fitScore < 3) {
      newErrors.fitScore = locale === "zh" ? "只有战略契合度 3 分及以上的展会方可录入数据库。" : "Only events scoring Fit 3+ can be entered into the database.";
    }

    const validLinks = formData.sourceLinks.filter((l) => l && l.trim() !== "" && l !== "https://");
    if (validLinks.length === 0) {
      newErrors.sourceLinks = locale === "zh" ? "请提供至少 1 条核实佐证链接。" : "Please provide at least 1 verification source link.";
    } else {
      for (const link of validLinks) {
        try {
          const u = new URL(link);
          if (!u.protocol.startsWith("http")) {
            newErrors.sourceLinks = locale === "zh" ? "佐证链接必须是有效的 HTTP/HTTPS URL。" : "Source links must be valid HTTP/HTTPS URLs.";
            break;
          }
        } catch {
          newErrors.sourceLinks = locale === "zh" ? "佐证链接包含无效的 URL 格式。" : "Source links contain an invalid URL format.";
          break;
        }
      }
    }

    return newErrors;
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent, statusOverride?: string) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(
        locale === "zh"
          ? "表单未通过校验，请检查标注有错误的字段。"
          : "Form validation failed. Please check highlighted errors."
      );
      setTimeout(() => {
        const errorElement = document.getElementById("form-error-summary");
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 50);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        status: statusOverride || (isEditing ? initialData?.status || "PUBLISHED" : "PENDING_REVIEW"),
      };

      const url = isEditing ? `/api/events/${initialData.id}` : "/api/events";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (isEditing) {
          toast.success(locale === "zh" ? "展会记录已成功更新！" : "Event updated successfully!");
          if (onSuccess) {
            onSuccess();
          } else {
            router.push(`/events/${initialData.id}`);
            router.refresh();
          }
        } else {
          toast.success(
            locale === "zh"
              ? "展会已成功提交至更正与审核队列！"
              : "Event successfully submitted to the review queue!"
          );
          if (onSuccess) {
            onSuccess();
          }
          router.push("/queues");
          router.refresh();
        }
      } else {
        const errMsg = data.error || (locale === "zh" ? "保存展会失败" : "Failed to save event");
        setApiError(errMsg);
        toast.error(errMsg);
      }
    } catch (err: any) {
      const errMsg = err?.message || (locale === "zh" ? "发生未知网络错误" : "An unexpected error occurred.");
      setApiError(errMsg);
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const getInputClass = (fieldName: string) => {
    const base =
      "w-full px-3 py-2 rounded-lg border text-xs text-[#133020] dark:text-white bg-white dark:bg-[#1A3D2A] transition duration-150";
    if (errors[fieldName]) {
      return `${base} border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-500 dark:ring-rose-500/30`;
    }
    return `${base} border-[#D8D2C8] dark:border-[#235338] focus:border-[#046241] focus:outline-none focus:ring-1 focus:ring-[#046241]`;
  };

  const renderFieldError = (fieldName: string) => {
    if (!errors[fieldName]) return null;
    return (
      <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 mt-1.5 flex items-center gap-1 animate-in fade-in">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>{errors[fieldName]}</span>
      </p>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto font-manrope relative" noValidate>
      <div id="event-form-top" />

      {/* Top Error Summary Box */}
      {Object.keys(errors).length > 0 && (
        <div
          id="form-error-summary"
          className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-500/60 dark:border-rose-700/60 text-rose-800 dark:text-rose-200 space-y-2 shadow-sm animate-in fade-in duration-200"
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>
              {locale === "zh"
                ? `表单有 ${Object.keys(errors).length} 处填写不合规，请修改后重试：`
                : `Form has ${Object.keys(errors).length} validation error(s). Please fix before submitting:`}
            </span>
          </div>
          <ul className="list-disc list-inside text-xs space-y-1 font-medium pl-1">
            {Object.entries(errors).map(([key, msg]) => (
              <li key={key} className="leading-relaxed">
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Top API Response Error Banner */}
      {apiError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-500/60 dark:border-rose-700/60 text-rose-800 dark:text-rose-200 flex items-start gap-3 shadow-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">
              {locale === "zh" ? "服务器返回错误" : "Server Submission Error"}
            </h4>
            <p className="text-xs font-medium mt-0.5">{apiError}</p>
          </div>
        </div>
      )}

      {/* Duplicate Warning Bar */}
      <DuplicateWarning
        matches={duplicateMatches}
        onDismiss={() => setDuplicateMatches([])}
      />

      {/* GROUP A: Identity & Location */}
      <div className="bg-white dark:bg-[#133020] p-6 rounded-xl border border-[#D8D2C8] dark:border-[#1E4830] shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#D8D2C8] dark:border-[#1E4830] pb-3 mb-5">
          <span className="w-6 h-6 rounded-full bg-[#133020] dark:bg-[#FFB347] text-white dark:text-[#133020] text-xs font-bold flex items-center justify-center">
            A
          </span>
          <h3 className="text-base font-bold text-[#133020] dark:text-white">
            {locale === "zh" ? "组 A — 展会基本信息与举办地点 (必填)" : "Group A — Identity & Location (Mandatory)"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1">
              {locale === "zh" ? "所在大区 *" : "Region *"}
            </label>
            <LifewoodDropdown
              value={formData.region}
              onChange={(val) => handleFieldChange("region", val)}
              options={REGIONS.map((r) => ({ value: r, label: locale === "zh" ? REGIONS_MAP[r] || r : r }))}
              aria-label="Select Region"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1">
              {locale === "zh" ? "展会名称 *" : "Event Name *"}
            </label>
            <input
              type="text"
              required
              value={formData.eventName}
              onChange={(e) => handleFieldChange("eventName", e.target.value)}
              onBlur={handleNameBlur}
              placeholder={locale === "zh" ? "例如：GITEX ASIA 2026" : "e.g. GITEX ASIA 2026"}
              className={getInputClass("eventName")}
            />
            {renderFieldError("eventName")}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1">
              {locale === "zh" ? "举办国家/地区 *" : "Country *"}
            </label>
            <input
              type="text"
              required
              value={formData.country}
              onChange={(e) => handleFieldChange("country", e.target.value)}
              placeholder={locale === "zh" ? "例如：新加坡" : "e.g. Singapore"}
              className={getInputClass("country")}
            />
            {renderFieldError("country")}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1">
              {locale === "zh" ? "举办城市 *" : "City *"}
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => handleFieldChange("city", e.target.value)}
              placeholder={locale === "zh" ? "例如：新加坡" : "e.g. Singapore"}
              className={getInputClass("city")}
            />
            {renderFieldError("city")}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1">
              {locale === "zh" ? "起始日期 (日历选择)" : "Start Date (Calendar Picker)"}
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleStartDatePicker(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] dark:border-[#235338] bg-white dark:bg-[#1A3D2A] text-xs text-[#133020] dark:text-white focus:border-[#046241] cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1">
              {locale === "zh" ? "截止日期 (日历选择)" : "End Date (Calendar Picker)"}
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleEndDatePicker(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] dark:border-[#235338] bg-white dark:bg-[#1A3D2A] text-xs text-[#133020] dark:text-white focus:border-[#046241] cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1">
              {locale === "zh" ? "展期字符串格式化显示 *" : "Formatted Event Date Display *"}
            </label>
            <input
              type="text"
              required
              value={formData.dates}
              onChange={(e) => handleFieldChange("dates", e.target.value)}
              placeholder={locale === "zh" ? "例如：2026年9月14日–17日 或 Q3 2027" : "Sep 14–17, 2026 or Q3 2027"}
              className={getInputClass("dates")}
            />
            {renderFieldError("dates")}
            <span className="text-[10px] text-[#666666] dark:text-slate-400 block mt-1">
              {locale === "zh"
                ? "根据日历选择自动生成，亦支持手动编辑 (例如：\"Apr 6–9, 2026\")"
                : "Auto-generated from calendar pickers or manually editable (e.g. \"Apr 6–9, 2026\")"}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1">
              {locale === "zh" ? "展馆场地名称 *" : "Venue Name *"}
            </label>
            <input
              type="text"
              required
              value={formData.venue}
              onChange={(e) => handleFieldChange("venue", e.target.value)}
              placeholder={locale === "zh" ? "例如：新加坡滨海湾金沙会展中心" : "e.g. Marina Bay Sands Expo Centre"}
              className={getInputClass("venue")}
            />
            {renderFieldError("venue")}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#046241]" />
              <span>
                {locale === "zh"
                  ? "详细地址与地图导航地址 (可选 — 街道/区/邮编)"
                  : "Full Location & Map Address (Optional — Street, District, Postal Code)"}
              </span>
            </label>
            <textarea
              rows={2}
              value={formData.locationAddress}
              onChange={(e) => handleFieldChange("locationAddress", e.target.value)}
              placeholder={locale === "zh" ? "例如：1 Harbour Road, Wan Chai, Hong Kong (用于谷歌地图导航链接)" : "e.g. 1 Harbour Road, Wan Chai, Hong Kong (Used for Google Maps location links)"}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] dark:border-[#235338] bg-white dark:bg-[#1A3D2A] text-xs text-[#133020] dark:text-white focus:border-[#046241]"
            />
          </div>
        </div>
      </div>

      {/* GROUP B: Source & Organizer */}
      <div className="bg-white dark:bg-[#133020] p-6 rounded-xl border border-[#D8D2C8] dark:border-[#1E4830] shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#D8D2C8] dark:border-[#1E4830] pb-3 mb-5">
          <span className="w-6 h-6 rounded-full bg-[#133020] dark:bg-[#FFB347] text-white dark:text-[#133020] text-xs font-bold flex items-center justify-center">
            B
          </span>
          <h3 className="text-base font-bold text-[#133020] dark:text-white">
            {locale === "zh" ? "组 B — 信息来源与主办方 (必填)" : "Group B — Source & Organizer (Mandatory)"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1">
              {locale === "zh" ? "官方网站网址 *" : "Official Website URL *"}
            </label>
            <input
              type="url"
              required
              value={formData.officialWebsite}
              onChange={(e) => handleFieldChange("officialWebsite", e.target.value)}
              placeholder="https://..."
              className={getInputClass("officialWebsite")}
            />
            {renderFieldError("officialWebsite")}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1">
              {locale === "zh" ? "主办机构 *" : "Organizer Body *"}
            </label>
            <input
              type="text"
              required
              value={formData.organizer}
              onChange={(e) => handleFieldChange("organizer", e.target.value)}
              placeholder={locale === "zh" ? "例如：HKTDC / KAOUN International" : "e.g. HKTDC / KAOUN International"}
              className={getInputClass("organizer")}
            />
            {renderFieldError("organizer")}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1">
              {locale === "zh" ? "展会类别" : "Event Category"}
            </label>
            <input
              type="text"
              value={formData.eventCategory}
              onChange={(e) => handleFieldChange("eventCategory", e.target.value)}
              placeholder={locale === "zh" ? "例如：企业级 AI 峰会与博览会" : "e.g. Enterprise AI Summit & Expo"}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] dark:border-[#235338] bg-white dark:bg-[#1A3D2A] text-xs text-[#133020] dark:text-white focus:border-[#046241]"
            />
          </div>
        </div>
      </div>

      {/* GROUP C: Strategic Assessment */}
      <div className="bg-white dark:bg-[#133020] p-6 rounded-xl border border-[#D8D2C8] dark:border-[#1E4830] shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#D8D2C8] dark:border-[#1E4830] pb-3 mb-5">
          <span className="w-6 h-6 rounded-full bg-[#133020] dark:bg-[#FFB347] text-white dark:text-[#133020] text-xs font-bold flex items-center justify-center">
            C
          </span>
          <h3 className="text-base font-bold text-[#133020] dark:text-white">
            {locale === "zh" ? "组 C — 战略契合度评估与评分 (必填)" : "Group C — Strategic Assessment & Scoring (Mandatory)"}
          </h3>
        </div>

        <div className="space-y-5">
          {/* Business Lines Multi-select */}
          <div>
            <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-2">
              {locale === "zh" ? "Lifewood 对应业务线 (至少选择 1 项) *" : "Lifewood Business Line(s) (Select at least 1) *"}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {BUSINESS_LINES.map((b) => {
                const selected = formData.businessLines.includes(b.name);
                const displayName = locale === "zh" ? BUSINESS_LINES_MAP[b.name] || b.name : b.name;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => toggleBusinessLine(b.name)}
                    className={`p-3 rounded-lg border text-left text-xs transition flex flex-col justify-between cursor-pointer ${
                      selected
                        ? "bg-[#133020] dark:bg-[#046241] text-white border-[#133020] dark:border-[#046241] shadow-xs font-semibold"
                        : "bg-[#F9F7F7] dark:bg-[#1A3D2A] text-[#133020] dark:text-slate-200 border-[#D8D2C8] dark:border-[#235338] hover:border-[#046241]"
                    }`}
                  >
                    <span>{displayName}</span>
                    <span className="text-[10px] opacity-75 mt-1 block font-normal">
                      {b.dataElements}
                    </span>
                  </button>
                );
              })}
            </div>
            {renderFieldError("businessLines")}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1">
                {locale === "zh" ? "战略侧重点与定位 *" : "Strategic Focus / Purpose *"}
              </label>
              <textarea
                rows={3}
                required
                value={formData.strategicFocus}
                onChange={(e) => handleFieldChange("strategicFocus", e.target.value)}
                placeholder={locale === "zh" ? "1–2 句话说明本次展会涵盖的核心内容与方向..." : "1–2 sentences on what this conference covers..."}
                className={getInputClass("strategicFocus")}
              />
              {renderFieldError("strategicFocus")}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1">
                {locale === "zh" ? "与 Lifewood 的战略相关性 (目标客户群体 + 提供的服务) *" : "Relevance to Lifewood (Buyer + Service) *"}
              </label>
              <textarea
                rows={3}
                required
                value={formData.relevanceToLifewood}
                onChange={(e) => handleFieldChange("relevanceToLifewood", e.target.value)}
                placeholder={locale === "zh" ? "须明确说明场内的具体买家/客户及 Lifewood 可提供的服务..." : "Must state specific buyer in the room & Lifewood service offered..."}
                className={getInputClass("relevanceToLifewood")}
              />
              {renderFieldError("relevanceToLifewood")}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1">
                {locale === "zh" ? "目标受众 / 参会群体" : "Target Audience"}
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => handleFieldChange("targetAudience", e.target.value)}
                placeholder={locale === "zh" ? "CTO、AI 工程师、数据总监、研发团队..." : "CTOs, AI Engineers, Data leads..."}
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] dark:border-[#235338] bg-white dark:bg-[#1A3D2A] text-xs text-[#133020] dark:text-white focus:border-[#046241]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1">
                {locale === "zh" ? "参会/参展建议" : "Participation Recommendation"}
              </label>
              <LifewoodDropdown
                value={formData.participationRec}
                onChange={(val) => handleFieldChange("participationRec", val)}
                options={PARTICIPATION_OPTIONS.map((opt) => ({
                  value: opt,
                  label: locale === "zh" ? RECOMMENDATIONS_MAP[opt] || opt : opt,
                }))}
                aria-label="Select Participation Recommendation"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1">
                {locale === "zh" ? "战略契合度评分 (1–5 分，强制要求 3 分及以上) *" : "Fit Score (1–5, Minimum 3 Enforced) *"}
              </label>
              <div className="flex gap-2">
                {[5, 4, 3].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => handleFitScoreChange(score)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                      formData.fitScore === score
                        ? score === 5
                          ? "bg-[#133020] text-white border-[#133020]"
                          : score === 4
                          ? "bg-[#046241] text-white border-[#046241]"
                          : "bg-[#708E7C] text-white border-[#708E7C]"
                        : "bg-white dark:bg-[#1A3D2A] text-[#133020] dark:text-slate-200 border-[#D8D2C8] dark:border-[#235338] hover:bg-[#F9F7F7]"
                    }`}
                  >
                    {locale === "zh"
                      ? score === 5
                        ? "5分 (匹配)"
                        : score === 4
                        ? "4分 (高度)"
                        : "3分 (中度)"
                      : `Fit ${score}`}
                  </button>
                ))}
              </div>
              {renderFieldError("fitScore")}
            </div>
          </div>
        </div>
      </div>

      {/* GROUP D: Commercial Detail with NPD Quick Fill Buttons */}
      <div className="bg-white dark:bg-[#133020] p-6 rounded-xl border border-[#D8D2C8] dark:border-[#1E4830] shadow-sm">
        <div className="flex items-center justify-between border-b border-[#D8D2C8] dark:border-[#1E4830] pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#133020] dark:bg-[#FFB347] text-white dark:text-[#133020] text-xs font-bold flex items-center justify-center">
              D
            </span>
            <h3 className="text-base font-bold text-[#133020] dark:text-white">
              {locale === "zh" ? "组 D — 商业运营与商务细节 (尽力获取)" : "Group D — Commercial Detail (Best-Effort)"}
            </h3>
          </div>
          <span className="text-[11px] text-[#666666] dark:text-slate-400">
            {locale === "zh" ? "若尚未公开披露，可点击 [未披露快捷填入]" : "Use [NPD] button if details are unannounced"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: locale === "zh" ? "预计参会人数" : "Estimated Attendees", field: "estimatedAttendees" },
            { label: locale === "zh" ? "展位 / 赞助费用" : "Booth or Sponsorship Cost", field: "boothCost" },
            { label: locale === "zh" ? "报名 / 申请截止日期" : "Registration Deadline", field: "registrationDeadline" },
            { label: locale === "zh" ? "联系电子邮箱" : "Contact Email", field: "contactEmail" },
            { label: locale === "zh" ? "联系人及职位" : "Contact Person / Title", field: "contactPerson" },
            { label: locale === "zh" ? "LinkedIn / 社交媒体链接" : "LinkedIn / Social Media URL", field: "socialMedia" },
          ].map((item) => (
            <div key={item.field}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider">
                  {item.label}
                </label>
                <button
                  type="button"
                  onClick={() => setNPD(item.field)}
                  className="text-[10px] font-bold text-[#046241] dark:text-[#FFB347] hover:underline cursor-pointer"
                >
                  {locale === "zh" ? "[未披露快捷填入]" : "[NPD Quick Fill]"}
                </button>
              </div>
              <input
                type="text"
                value={(formData as any)[item.field]}
                onChange={(e) => handleFieldChange(item.field, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] dark:border-[#235338] bg-white dark:bg-[#1A3D2A] text-xs text-[#133020] dark:text-white focus:border-[#046241]"
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider">
                {locale === "zh" ? "参展商及赞助合作详情" : "Exhibitor & Sponsorship Details"}
              </label>
              <button
                type="button"
                onClick={() => setNPD("exhibitorOpportunity")}
                className="text-[10px] font-bold text-[#046241] dark:text-[#FFB347] hover:underline cursor-pointer"
              >
                {locale === "zh" ? "[未披露快捷填入]" : "[NPD Quick Fill]"}
              </button>
            </div>
            <textarea
              rows={2}
              value={formData.exhibitorOpportunity}
              onChange={(e) => handleFieldChange("exhibitorOpportunity", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] dark:border-[#235338] bg-white dark:bg-[#1A3D2A] text-xs text-[#133020] dark:text-white focus:border-[#046241]"
            />
          </div>
        </div>
      </div>

      {/* GROUP E: Provenance & Source Links */}
      <div className="bg-white dark:bg-[#133020] p-6 rounded-xl border border-[#D8D2C8] dark:border-[#1E4830] shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#D8D2C8] dark:border-[#1E4830] pb-3 mb-5">
          <span className="w-6 h-6 rounded-full bg-[#133020] dark:bg-[#FFB347] text-white dark:text-[#133020] text-xs font-bold flex items-center justify-center">
            E
          </span>
          <h3 className="text-base font-bold text-[#133020] dark:text-white">
            {locale === "zh" ? "组 E — 信息溯源与佐证链接 (必填)" : "Group E — Provenance & Source Links (Mandatory)"}
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider mb-1">
              {locale === "zh" ? "关键备注 (同馆联展、届数、演讲征集截止等...)" : "Key Notes (Co-located shows, edition #, CFP deadline...)"}
            </label>
            <textarea
              rows={2}
              value={formData.keyNotes}
              onChange={(e) => handleFieldChange("keyNotes", e.target.value)}
              placeholder={locale === "zh" ? "例如：与 InnoEX 2026 同期举办。演讲征集于 2025 年 12 月截止。" : "e.g. Co-located with InnoEX 2026. CFP closes Dec 2025."}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] dark:border-[#235338] bg-white dark:bg-[#1A3D2A] text-xs text-[#133020] dark:text-white focus:border-[#046241]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#133020] dark:text-slate-200 uppercase tracking-wider">
                {locale === "zh" ? "核实佐证链接 (至少 1 条) *" : "Verification Source Link(s) (Minimum 1) *"}
              </label>
              <button
                type="button"
                onClick={addSourceLink}
                className="text-xs text-[#046241] dark:text-[#FFB347] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{locale === "zh" ? "添加链接" : "Add Link"}</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.sourceLinks.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="url"
                    required
                    value={link}
                    onChange={(e) => updateSourceLink(idx, e.target.value)}
                    placeholder="https://..."
                    className={getInputClass("sourceLinks")}
                  />
                  {formData.sourceLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSourceLink(idx)}
                      className="p-2 text-rose-600 hover:bg-rose-500/10 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {renderFieldError("sourceLinks")}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : router.push("/events"))}
          className="px-6 py-3 rounded-lg border border-[#D8D2C8] dark:border-[#1E4830] bg-white dark:bg-[#1A3D2A] text-xs font-bold text-[#133020] dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
        >
          {locale === "zh" ? "取消" : "Cancel"}
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 rounded-lg bg-[#FFB347] hover:bg-[#FFC370] active:scale-[0.98] text-[#133020] text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>
            {submitting
              ? locale === "zh" ? "正在提交..." : "Submitting..."
              : isEditing
              ? locale === "zh" ? "更新展会记录" : "Update Record"
              : locale === "zh" ? "提交至更正/审核队列" : "Submit to Review Queue"}
          </span>
        </button>
      </div>
    </form>
  );
}
