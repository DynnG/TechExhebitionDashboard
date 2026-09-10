"use client";

import { useState } from "react";
import { REGIONS } from "@/lib/constants/business-lines";
import { FileSpreadsheet, Download, Eye, Sparkles, RefreshCw, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useLocaleStore } from "@/stores/locale-store";
import { LifewoodDropdown } from "@/components/shared/lifewood-dropdown";
import { localizeRegionName } from "@/lib/i18n/event-localization";

export default function ReportsPage() {
  const { locale } = useLocaleStore();
  const [reportType, setReportType] = useState("regional");
  const [region, setRegion] = useState("Asia");
  const [timeRange, setTimeRange] = useState("ALL");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [format, setFormat] = useState<"html" | "xlsx" | "csv">("html");

  const reportTypeOptions = [
    {
      value: "regional",
      label: locale === "zh" ? "区域汇总报告" : "Regional Summary Report",
    },
    {
      value: "businessLine",
      label: locale === "zh" ? "业务线汇总报告" : "Business Line Summary Report",
    },
    {
      value: "full",
      label: locale === "zh" ? "完整数据库导出" : "Full Database Export",
    },
  ];

  const regionOptions = [
    {
      value: "ALL",
      label: locale === "zh" ? "全部区域（全球汇总）" : "All Regions (Global Summary)",
    },
    ...REGIONS.map((r) => ({
      value: r,
      label: localizeRegionName(r, locale),
    })),
  ];

  const timeRangeOptions = [
    {
      value: "ALL",
      label: locale === "zh" ? "全部时间 (2026–2027 全量)" : "Full Coverage (2026–2027 All Dates)",
    },
    {
      value: "CUSTOM",
      label: locale === "zh" ? "📅 自定义日期范围 (自由选择)" : "📅 Custom Date Range (Select Dates)",
    },
    {
      value: "2026_Q1",
      label: locale === "zh" ? "2026 Q1 第一季度 (1月-3月)" : "2026 Q1 (Jan – Mar)",
    },
    {
      value: "2026_Q2",
      label: locale === "zh" ? "2026 Q2 第二季度 (4月-6月)" : "2026 Q2 (Apr – Jun)",
    },
    {
      value: "2026_Q3",
      label: locale === "zh" ? "2026 Q3 第三季度 (7月-9月)" : "2026 Q3 (Jul – Sep)",
    },
    {
      value: "2026_Q4",
      label: locale === "zh" ? "2026 Q4 第四季度 (10月-12月)" : "2026 Q4 (Oct – Dec)",
    },
    {
      value: "2026_H1",
      label: locale === "zh" ? "2026 H1 上半年 (1月-6月)" : "2026 H1 (Jan – Jun)",
    },
    {
      value: "2026_H2",
      label: locale === "zh" ? "2026 H2 下半年 (7月-12月)" : "2026 H2 (Jul – Dec)",
    },
    {
      value: "2026",
      label: locale === "zh" ? "2026 全年" : "Full Year 2026",
    },
    {
      value: "2027",
      label: locale === "zh" ? "2027 全年" : "Full Year 2027",
    },
  ];

  const formatOptions = [
    {
      value: "html",
      label: locale === "zh" ? "Lifewood 品牌定制 HTML（香港高管报告风格）" : "Lifewood Branded HTML (HK Report Style)",
    },
    {
      value: "xlsx",
      label: locale === "zh" ? "Lifewood 多标签页 Excel 工作簿 (.xlsx)" : "Lifewood Multi-Tab Excel Workbook (.xlsx)",
    },
    {
      value: "csv",
      label: locale === "zh" ? "原始 CSV 表格数据" : "Raw CSV Spreadsheet Data",
    },
  ];

  const [generatedHtml, setGeneratedHtml] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const payload = {
        reportType,
        region,
        timeRange,
        customStartDate,
        customEndDate,
        format,
        locale,
      };

      if (format === "xlsx") {
        // Download XLSX directly
        const res = await fetch("/api/reports/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Lifewood_Exhibition_Report_${region}_${timeRange}.xlsx`;
        a.click();
        toast.success(locale === "zh" ? "Excel 报告工作簿已成功下载！" : "Excel report workbook downloaded!");
      } else if (format === "csv") {
        // Download CSV directly
        const res = await fetch("/api/reports/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Lifewood_Exhibition_Report_${region}_${timeRange}.csv`;
        a.click();
        toast.success(locale === "zh" ? "CSV 报告已成功下载！" : "CSV report downloaded!");
      } else {
        // Generate HTML preview
        const res = await fetch("/api/reports/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          setGeneratedHtml(data.html);
          setCount(data.count);
          toast.success(
            locale === "zh" ? "香港风格品牌 HTML 报告已成功生成！" : "Branded HK-style HTML report generated successfully!"
          );
        } else {
          toast.error(data.error || (locale === "zh" ? "生成报告失败" : "Failed to generate report"));
        }
      }
    } catch {
      toast.error(locale === "zh" ? "生成报告出错" : "Error generating report");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadHtml = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Lifewood_Exhibition_Report_${region}_${timeRange}.html`;
    a.click();
    toast.success(locale === "zh" ? "HTML 报告已成功下载！" : "HTML report downloaded!");
  };

  return (
    <div className="space-y-8 font-manrope">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D8D2C8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-[#046241]" />
            <h2 className="text-2xl font-bold text-[#133020]">
              {locale === "en" ? "Executive Report Generator" : "执行报告生成器"}
            </h2>
          </div>
          <p className="text-xs text-[#333333] mt-0.5">
            {locale === "zh"
              ? "导出符合 Lifewood 品牌规范的香港高管风格 HTML 报告或 Excel 电子表格 (.xlsx)，支持自由选择自定义时间范围"
              : "Export Lifewood-branded HK executive HTML reports or multi-tab Excel workbooks (.xlsx) with custom date ranges"}
          </p>
        </div>
      </div>

      {/* Config Form */}
      <div className="bg-white p-10 rounded-xl border border-[#D8D2C8] shadow-xs space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div>
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-2">
              {locale === "zh" ? "报告类型" : "Report Type"}
            </label>
            <LifewoodDropdown
              value={reportType}
              onChange={(val) => setReportType(val)}
              options={reportTypeOptions}
              aria-label={locale === "zh" ? "报告类型" : "Report Type"}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-2">
              {locale === "zh" ? "选择区域" : "Region Selection"}
            </label>
            <LifewoodDropdown
              value={region}
              onChange={(val) => setRegion(val)}
              options={regionOptions}
              aria-label={locale === "zh" ? "选择区域" : "Region Selection"}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-2">
              {locale === "zh" ? "时间范围" : "Time Range / Period"}
            </label>
            <LifewoodDropdown
              value={timeRange}
              onChange={(val) => setTimeRange(val)}
              options={timeRangeOptions}
              aria-label={locale === "zh" ? "时间范围" : "Time Range"}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#133020] uppercase tracking-wider mb-2">
              {locale === "zh" ? "导出格式" : "Export Format"}
            </label>
            <LifewoodDropdown
              value={format}
              onChange={(val) => setFormat(val as any)}
              options={formatOptions}
              aria-label={locale === "zh" ? "导出格式" : "Export Format"}
            />
          </div>
        </div>

        {/* Custom Date Range Picker Inputs */}
        {timeRange === "CUSTOM" && (
          <div className="bg-[#F5EEDB] p-4 rounded-xl border border-[#D8D2C8] grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#133020] mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#046241]" />
                <span>{locale === "zh" ? "起始日期" : "Start Date"}</span>
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D8D2C8] rounded-lg text-xs font-medium text-[#133020] focus:outline-none focus:ring-2 focus:ring-[#046241]"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#133020] mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#046241]" />
                <span>{locale === "zh" ? "截止日期" : "End Date"}</span>
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D8D2C8] rounded-lg text-xs font-medium text-[#133020] focus:outline-none focus:ring-2 focus:ring-[#046241]"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#FFB347] hover:bg-[#FFC370] text-[#133020] font-bold text-xs rounded-lg transition shadow-md disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{locale === "zh" ? "生成中..." : "Generating..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{locale === "zh" ? "生成报告" : "Generate Report"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Section */}
      {generatedHtml && (
        <div className="bg-white p-6 rounded-xl border border-[#D8D2C8] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#D8D2C8] pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#046241]" />
              <div>
                <h3 className="text-sm font-bold text-[#133020]">
                  {locale === "zh" ? `实时报告预览（共 ${count} 条记录）` : `Live Report Preview (${count} Records)`}
                </h3>
                <p className="text-[11px] text-[#666666]">
                  {locale === "zh" ? "按官方香港报告视觉规范渲染" : "Rendered in official HK Report design language"}
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadHtml}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#133020] hover:bg-[#046241] text-white text-xs font-bold rounded-lg transition shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>{locale === "zh" ? "下载 HTML 文件" : "Download HTML File"}</span>
            </button>
          </div>

          <div className="border border-[#D8D2C8] rounded-xl overflow-hidden bg-[#F5EEDB] p-4 max-h-[600px] overflow-y-auto">
            <iframe
              srcDoc={generatedHtml}
              className="w-full min-h-[500px] rounded-lg border border-[#D8D2C8] bg-white shadow-inner"
              title="Report Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
