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

  // Auto-derive priority from fit score
  const handleFitScoreChange = (score: number) => {
    let priority = "High";
    if (score === 3) priority = "Medium";
    setFormData((prev) => ({
      ...prev,
      fitScore: score,
      priorityLevel: priority,
    }));
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
    setFormData((prev) => ({
      ...prev,
      startDate: newStart,
      dates: newDates,
    }));
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
    setFormData((prev) => ({
      ...prev,
      endDate: newEnd,
      dates: newDates,
    }));
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
      if (exists) {
        if (prev.businessLines.length === 1) return prev; // Keep at least one
        return {
          ...prev,
          businessLines: prev.businessLines.filter((b) => b !== name),
        };
      } else {
        return {
          ...prev,
          businessLines: [...prev.businessLines, name],
        };
      }
    });
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
  };

  // Quick NPD fill helper
  const setNPD = (field: string) => {
    setFormData((prev) => ({ ...prev, [field]: locale === "zh" ? "尚未公开披露" : "Not publicly disclosed" }));
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent, statusOverride?: string) => {
    e.preventDefault();
    setErrors({});

    // Validate mandatory groups
    const newErrors: Record<string, string> = {};
    if (!formData.eventName) newErrors.eventName = locale === "zh" ? "展会名称为必填项。" : "Event name is required.";
    if (!formData.country) newErrors.country = locale === "zh" ? "举办国家/地区为必填项。" : "Country is required.";
    if (!formData.city) newErrors.city = locale === "zh" ? "城市为必填项。" : "City is required.";
    if (!formData.dates) newErrors.dates = locale === "zh" ? "展期字符串为必填项。" : "Dates string is required.";
    if (!formData.venue) newErrors.venue = locale === "zh" ? "展馆场地为必填项。" : "Venue is required.";
    if (!formData.officialWebsite) newErrors.officialWebsite = locale === "zh" ? "官方网站为必填项。" : "Official website is required.";
    if (!formData.organizer) newErrors.organizer = locale === "zh" ? "主办机构为必填项。" : "Organizer is required.";
    if (!formData.strategicFocus) newErrors.strategicFocus = locale === "zh" ? "战略侧重点与定位为必填项。" : "Strategic focus is required.";
    if (!formData.relevanceToLifewood) newErrors.relevanceToLifewood = locale === "zh" ? "与 Lifewood 的战略相关性为必填项。" : "Relevance to Lifewood is required.";

    // Fit score enforcement
    if (formData.fitScore < 3) {
      newErrors.fitScore = locale === "zh" ? "只有战略契合度 3 分及以上的展会方可录入数据库。" : "Only events scoring Fit 3+ can be entered into the database.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(locale === "zh" ? "请填写所有必填字段。" : "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        status: statusOverride || (userRole === "INTERN" ? "PENDING_REVIEW" : "PUBLISHED"),
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
        toast.success(
          isEditing
            ? locale === "zh" ? "展会记录已成功更新！" : "Event updated successfully!"
            : userRole === "INTERN"
            ? locale === "zh" ? "展会已提交至主管队列待审核！" : "Event submitted for supervisor review!"
            : locale === "zh" ? "展会记录已成功发布！" : "Event published successfully!"
        );
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/events");
          router.refresh();
        }
      } else {
        toast.error(data.error || (locale === "zh" ? "保存展会失败" : "Failed to save event"));
      }
    } catch {
      toast.error(locale === "zh" ? "发生未知错误" : "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto font-manrope">
      {/* Duplicate Warning Bar */}
      <DuplicateWarning
        matches={duplicateMatches}
        onDismiss={() => setDuplicateMatches([])}
      />

      {/* GROUP A: Identity & Location */}
      <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#D8D2C8] pb-3 mb-5">
          <span className="w-6 h-6 rounded-full bg-[#133020] text-white text-xs font-bold flex items-center justify-center">
            A
          </span>
          <h3 className="text-base font-bold text-[#133020]">
            {locale === "zh" ? "组 A — 展会基本信息与举办地点 (必填)" : "Group A — Identity & Location (Mandatory)"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
              {locale === "zh" ? "所在大区 *" : "Region *"}
            </label>
            <LifewoodDropdown
              value={formData.region}
              onChange={(val) => setFormData({ ...formData, region: val })}
              options={REGIONS.map((r) => ({ value: r, label: locale === "zh" ? REGIONS_MAP[r] || r : r }))}
              aria-label="Select Region"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
              {locale === "zh" ? "展会名称 *" : "Event Name *"}
            </label>
            <input
              type="text"
              required
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              onBlur={handleNameBlur}
              placeholder={locale === "zh" ? "例如：GITEX ASIA 2026" : "e.g. GITEX ASIA 2026"}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241]"
            />
            {errors.eventName && <p className="text-[11px] text-[#B91C1C] mt-1">{errors.eventName}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
              {locale === "zh" ? "举办国家/地区 *" : "Country *"}
            </label>
            <input
              type="text"
              required
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder={locale === "zh" ? "例如：新加坡" : "e.g. Singapore"}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
              {locale === "zh" ? "举办城市 *" : "City *"}
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder={locale === "zh" ? "例如：新加坡" : "e.g. Singapore"}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
              {locale === "zh" ? "起始日期 (日历选择)" : "Start Date (Calendar Picker)"}
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleStartDatePicker(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241] cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
              {locale === "zh" ? "截止日期 (日历选择)" : "End Date (Calendar Picker)"}
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleEndDatePicker(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241] cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
              {locale === "zh" ? "展期字符串格式化显示 *" : "Formatted Event Date Display *"}
            </label>
            <input
              type="text"
              required
              value={formData.dates}
              onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
              placeholder={locale === "zh" ? "例如：2026年9月14日–17日 或 Q3 2027" : "Sep 14–17, 2026 or Q3 2027"}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241]"
            />
            <span className="text-[10px] text-[#666666] block mt-1">
              {locale === "zh"
                ? "根据日历选择自动生成，亦支持手动编辑 (例如：\"Apr 6–9, 2026\")"
                : "Auto-generated from calendar pickers or manually editable (e.g. \"Apr 6–9, 2026\")"}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
              {locale === "zh" ? "展馆场地名称 *" : "Venue Name *"}
            </label>
            <input
              type="text"
              required
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder={locale === "zh" ? "例如：新加坡滨海湾金沙会展中心" : "e.g. Marina Bay Sands Expo Centre"}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1 flex items-center gap-1">
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
              onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
              placeholder={locale === "zh" ? "例如：1 Harbour Road, Wan Chai, Hong Kong (用于谷歌地图导航链接)" : "e.g. 1 Harbour Road, Wan Chai, Hong Kong (Used for Google Maps location links)"}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241]"
            />
          </div>
        </div>
      </div>

      {/* GROUP B: Source & Organizer */}
      <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#D8D2C8] pb-3 mb-5">
          <span className="w-6 h-6 rounded-full bg-[#133020] text-white text-xs font-bold flex items-center justify-center">
            B
          </span>
          <h3 className="text-base font-bold text-[#133020]">
            {locale === "zh" ? "组 B — 信息来源与主办方 (必填)" : "Group B — Source & Organizer (Mandatory)"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
              {locale === "zh" ? "官方网站网址 *" : "Official Website URL *"}
            </label>
            <input
              type="url"
              required
              value={formData.officialWebsite}
              onChange={(e) => setFormData({ ...formData, officialWebsite: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
              {locale === "zh" ? "主办机构 *" : "Organizer Body *"}
            </label>
            <input
              type="text"
              required
              value={formData.organizer}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              placeholder={locale === "zh" ? "例如：HKTDC / KAOUN International" : "e.g. HKTDC / KAOUN International"}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
              {locale === "zh" ? "展会类别" : "Event Category"}
            </label>
            <input
              type="text"
              value={formData.eventCategory}
              onChange={(e) => setFormData({ ...formData, eventCategory: e.target.value })}
              placeholder={locale === "zh" ? "例如：企业级 AI 峰会与博览会" : "e.g. Enterprise AI Summit & Expo"}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241]"
            />
          </div>
        </div>
      </div>

      {/* GROUP C: Strategic Assessment */}
      <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#D8D2C8] pb-3 mb-5">
          <span className="w-6 h-6 rounded-full bg-[#133020] text-white text-xs font-bold flex items-center justify-center">
            C
          </span>
          <h3 className="text-base font-bold text-[#133020]">
            {locale === "zh" ? "组 C — 战略契合度评估与评分 (必填)" : "Group C — Strategic Assessment & Scoring (Mandatory)"}
          </h3>
        </div>

        <div className="space-y-5">
          {/* Business Lines Multi-select */}
          <div>
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-2">
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
                    className={`p-3 rounded-lg border text-left text-xs transition flex flex-col justify-between ${
                      selected
                        ? "bg-[#133020] text-white border-[#133020] shadow-xs font-semibold"
                        : "bg-[#F9F7F7] text-[#133020] border-[#D8D2C8] hover:border-[#046241]"
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
                {locale === "zh" ? "战略侧重点与定位 *" : "Strategic Focus / Purpose *"}
              </label>
              <textarea
                rows={3}
                required
                value={formData.strategicFocus}
                onChange={(e) => setFormData({ ...formData, strategicFocus: e.target.value })}
                placeholder={locale === "zh" ? "1–2 句话说明本次展会涵盖的核心内容与方向..." : "1–2 sentences on what this conference covers..."}
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
                {locale === "zh" ? "与 Lifewood 的战略相关性 (目标客户群体 + 提供的服务) *" : "Relevance to Lifewood (Buyer + Service) *"}
              </label>
              <textarea
                rows={3}
                required
                value={formData.relevanceToLifewood}
                onChange={(e) => setFormData({ ...formData, relevanceToLifewood: e.target.value })}
                placeholder={locale === "zh" ? "须明确说明场内的具体买家/客户及 Lifewood 可提供的服务..." : "Must state specific buyer in the room & Lifewood service offered..."}
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
                {locale === "zh" ? "目标受众 / 参会群体" : "Target Audience"}
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder={locale === "zh" ? "CTO、AI 工程师、数据总监、研发团队..." : "CTOs, AI Engineers, Data leads..."}
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
                {locale === "zh" ? "参会/参展建议" : "Participation Recommendation"}
              </label>
              <LifewoodDropdown
                value={formData.participationRec}
                onChange={(val) => setFormData({ ...formData, participationRec: val })}
                options={PARTICIPATION_OPTIONS.map((opt) => ({
                  value: opt,
                  label: locale === "zh" ? RECOMMENDATIONS_MAP[opt] || opt : opt,
                }))}
                aria-label="Select Participation Recommendation"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
                {locale === "zh" ? "战略契合度评分 (1–5 分，强制要求 3 分及以上) *" : "Fit Score (1–5, Minimum 3 Enforced) *"}
              </label>
              <div className="flex gap-2">
                {[5, 4, 3].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => handleFitScoreChange(score)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-bold transition ${
                      formData.fitScore === score
                        ? score === 5
                          ? "bg-[#133020] text-white border-[#133020]"
                          : score === 4
                          ? "bg-[#046241] text-white border-[#046241]"
                          : "bg-[#708E7C] text-white border-[#708E7C]"
                        : "bg-white text-[#133020] border-[#D8D2C8] hover:bg-[#F9F7F7]"
                    }`}
                  >
                    {locale === "zh"
                      ? score === 5
                        ? "5分 (直接匹配)"
                        : score === 4
                        ? "4分 (高度契合)"
                        : "3分 (中度契合)"
                      : `Fit ${score}`}
                  </button>
                ))}
              </div>
              {errors.fitScore && <p className="text-[11px] text-[#B91C1C] mt-1">{errors.fitScore}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* GROUP D: Commercial Detail with NPD Quick Fill Buttons */}
      <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-sm">
        <div className="flex items-center justify-between border-b border-[#D8D2C8] pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#133020] text-white text-xs font-bold flex items-center justify-center">
              D
            </span>
            <h3 className="text-base font-bold text-[#133020]">
              {locale === "zh" ? "组 D — 商业运营与商务细节 (尽力获取)" : "Group D — Commercial Detail (Best-Effort)"}
            </h3>
          </div>
          <span className="text-[11px] text-[#666666]">
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
                <label className="text-xs font-bold text-[#133020] uppercase tracking-wider">
                  {item.label}
                </label>
                <button
                  type="button"
                  onClick={() => setNPD(item.field)}
                  className="text-[10px] font-bold text-[#046241] hover:underline"
                >
                  {locale === "zh" ? "[未披露快捷填入]" : "[NPD Quick Fill]"}
                </button>
              </div>
              <input
                type="text"
                value={(formData as any)[item.field]}
                onChange={(e) => setFormData({ ...formData, [item.field]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241]"
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#133020] uppercase tracking-wider">
                {locale === "zh" ? "参展商及赞助合作详情" : "Exhibitor & Sponsorship Details"}
              </label>
              <button
                type="button"
                onClick={() => setNPD("exhibitorOpportunity")}
                className="text-[10px] font-bold text-[#046241] hover:underline"
              >
                {locale === "zh" ? "[未披露快捷填入]" : "[NPD Quick Fill]"}
              </button>
            </div>
            <textarea
              rows={2}
              value={formData.exhibitorOpportunity}
              onChange={(e) => setFormData({ ...formData, exhibitorOpportunity: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241]"
            />
          </div>
        </div>
      </div>

      {/* GROUP E: Provenance & Source Links */}
      <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#D8D2C8] pb-3 mb-5">
          <span className="w-6 h-6 rounded-full bg-[#133020] text-white text-xs font-bold flex items-center justify-center">
            E
          </span>
          <h3 className="text-base font-bold text-[#133020]">
            {locale === "zh" ? "组 E — 信息溯源与佐证链接 (必填)" : "Group E — Provenance & Source Links (Mandatory)"}
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-1">
              {locale === "zh" ? "关键备注 (同馆联展、届数、演讲征集截止等...)" : "Key Notes (Co-located shows, edition #, CFP deadline...)"}
            </label>
            <textarea
              rows={2}
              value={formData.keyNotes}
              onChange={(e) => setFormData({ ...formData, keyNotes: e.target.value })}
              placeholder={locale === "zh" ? "例如：与 InnoEX 2026 同期举办。演讲征集于 2025 年 12 月截止。" : "e.g. Co-located with InnoEX 2026. CFP closes Dec 2025."}
              className="w-full px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#133020] uppercase tracking-wider">
                {locale === "zh" ? "核实佐证链接 (至少 1 条) *" : "Verification Source Link(s) (Minimum 1) *"}
              </label>
              <button
                type="button"
                onClick={addSourceLink}
                className="text-xs text-[#046241] hover:underline font-bold flex items-center gap-1"
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
                    className="flex-1 px-3 py-2 rounded-lg border border-[#D8D2C8] bg-white text-xs text-[#133020] focus:border-[#046241]"
                  />
                  {formData.sourceLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSourceLink(idx)}
                      className="p-2 text-[#B91C1C] hover:bg-[#B91C1C]/10 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : router.push("/events"))}
          className="px-6 py-3 rounded-lg border border-[#D8D2C8] bg-white text-xs font-bold text-[#133020] hover:bg-[#F9F7F7]"
        >
          {locale === "zh" ? "取消" : "Cancel"}
        </button>

        {userRole === "INTERN" && (
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "DRAFT")}
            disabled={submitting}
            className="px-6 py-3 rounded-lg border border-[#133020] bg-white text-xs font-bold text-[#133020] hover:bg-[#F5EEDB]"
          >
            {locale === "zh" ? "保存草稿" : "Save as Draft"}
          </button>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 rounded-lg bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] text-xs font-bold shadow-md transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>
            {submitting
              ? locale === "zh" ? "保存中..." : "Saving..."
              : isEditing
              ? locale === "zh" ? "更新展会记录" : "Update Record"
              : userRole === "INTERN"
              ? locale === "zh" ? "提交主管审核" : "Submit for Review"
              : locale === "zh" ? "发布展会" : "Publish Event"}
          </span>
        </button>
      </div>
    </form>
  );
}
