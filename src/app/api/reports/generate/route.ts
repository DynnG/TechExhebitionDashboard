import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateBrandedHTMLReport } from "@/lib/reports/html-template";
import { generateExcelReportBuffer } from "@/lib/reports/excel-template";
import { localizeEvent, localizeRegionName } from "@/lib/i18n/event-localization";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reportType, region, format, locale = "en" } = body;

    const where: any = { status: "PUBLISHED" };
    if (region && region !== "ALL") {
      where.region = region;
    }

    const rawEvents = await db.event.findMany({
      where,
      orderBy: { startDate: "asc" },
    });

    const isZh = locale === "zh";
    const events = isZh ? rawEvents.map((e) => localizeEvent(e, "zh")) : rawEvents;

    const displayRegion = region === "ALL" ? (isZh ? "全球" : "Global") : (isZh ? localizeRegionName(region, "zh") : region);
    const reportTitle = isZh
      ? `${displayRegion} 科技展会情报报告 2026–2027`
      : `${region === "ALL" ? "Global" : region} Tech Exhibition Intelligence Report 2026–2027`;

    if (format === "xlsx") {
      const buffer = generateExcelReportBuffer(events, reportTitle, region, locale);
      return new Response(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="Lifewood_Exhibition_Report_${region.toLowerCase()}.xlsx"`,
        },
      });
    }

    if (format === "csv") {
      // CSV Generation
      const csvRows = [
        isZh
          ? [
              "序号",
              "展会名称",
              "区域",
              "国家",
              "城市",
              "展会日期",
              "展馆/场地",
              "主办方",
              "对齐业务线",
              "匹配度评分",
              "优先级",
              "参展建议",
              "与 Lifewood 战略相关性",
              "官方网站",
            ]
          : [
              "No.",
              "Event Name",
              "Region",
              "Country",
              "City",
              "Dates",
              "Venue",
              "Organizer",
              "Business Lines",
              "Fit Score",
              "Priority",
              "Participation",
              "Relevance to Lifewood",
              "Website",
            ],
      ];

      events.forEach((evt) => {
        let bl = evt.businessLines;
        try {
          bl = JSON.parse(evt.businessLines).join("; ");
        } catch {}

        csvRows.push([
          evt.eventNumber.toString(),
          `"${(evt.eventName || "").replace(/"/g, '""')}"`,
          evt.region,
          evt.country,
          evt.city,
          `"${(evt.dates || "").replace(/"/g, '""')}"`,
          `"${(evt.venue || "").replace(/"/g, '""')}"`,
          `"${(evt.organizer || "").replace(/"/g, '""')}"`,
          `"${bl}"`,
          evt.fitScore.toString(),
          evt.priorityLevel,
          evt.participationRec,
          `"${(evt.relevanceToLifewood || "").replace(/"/g, '""')}"`,
          evt.officialWebsite || "",
        ]);
      });

      const csvContent = "\uFEFF" + csvRows.map((r) => r.join(",")).join("\n");
      return new Response(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="lifewood_exhibition_report_${region.toLowerCase()}.csv"`,
        },
      });
    }

    // Default HTML format
    const htmlReport = generateBrandedHTMLReport(events, reportTitle, region, locale);
    return NextResponse.json({ html: htmlReport, count: events.length });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to generate report: " + error.message },
      { status: 500 }
    );
  }
}
