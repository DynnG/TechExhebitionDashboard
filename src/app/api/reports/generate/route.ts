import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateBrandedHTMLReport } from "@/lib/reports/html-template";
import { generateExcelReportBuffer } from "@/lib/reports/excel-template";
import { localizeEvent, localizeRegionName } from "@/lib/i18n/event-localization";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reportType, region, timeRange = "ALL", format, locale = "en" } = body;

    const where: any = { status: "PUBLISHED" };
    if (region && region !== "ALL") {
      where.region = region;
    }

    // Time Range Filtering
    if (timeRange && timeRange !== "ALL") {
      const year2026Start = new Date("2026-01-01T00:00:00Z");
      const year2026End = new Date("2026-12-31T23:59:59Z");
      const year2027Start = new Date("2027-01-01T00:00:00Z");
      const year2027End = new Date("2027-12-31T23:59:59Z");

      if (timeRange === "2026_Q1") {
        where.startDate = {
          gte: new Date("2026-01-01T00:00:00Z"),
          lte: new Date("2026-03-31T23:59:59Z"),
        };
      } else if (timeRange === "2026_Q2") {
        where.startDate = {
          gte: new Date("2026-04-01T00:00:00Z"),
          lte: new Date("2026-06-30T23:59:59Z"),
        };
      } else if (timeRange === "2026_Q3") {
        where.startDate = {
          gte: new Date("2026-07-01T00:00:00Z"),
          lte: new Date("2026-09-30T23:59:59Z"),
        };
      } else if (timeRange === "2026_Q4") {
        where.startDate = {
          gte: new Date("2026-10-01T00:00:00Z"),
          lte: new Date("2026-12-31T23:59:59Z"),
        };
      } else if (timeRange === "2026_H1") {
        where.startDate = {
          gte: new Date("2026-01-01T00:00:00Z"),
          lte: new Date("2026-06-30T23:59:59Z"),
        };
      } else if (timeRange === "2026_H2") {
        where.startDate = {
          gte: new Date("2026-07-01T00:00:00Z"),
          lte: new Date("2026-12-31T23:59:59Z"),
        };
      } else if (timeRange === "2026") {
        where.startDate = {
          gte: year2026Start,
          lte: year2026End,
        };
      } else if (timeRange === "2027") {
        where.startDate = {
          gte: year2027Start,
          lte: year2027End,
        };
      }
    }

    const rawEvents = await db.event.findMany({
      where,
      orderBy: { startDate: "asc" },
    });

    const isZh = locale === "zh";
    const events = isZh ? rawEvents.map((e) => localizeEvent(e, "zh")) : rawEvents;

    const displayRegion = region === "ALL" ? (isZh ? "全球" : "Global") : (isZh ? localizeRegionName(region, "zh") : region);
    
    // Time label for report title
    let timeLabel = "2026–2027";
    if (timeRange === "2026_Q1") timeLabel = isZh ? "2026 第一季度 (Q1)" : "2026 Q1 (Jan–Mar)";
    else if (timeRange === "2026_Q2") timeLabel = isZh ? "2026 第二季度 (Q2)" : "2026 Q2 (Apr–Jun)";
    else if (timeRange === "2026_Q3") timeLabel = isZh ? "2026 第三季度 (Q3)" : "2026 Q3 (Jul–Sep)";
    else if (timeRange === "2026_Q4") timeLabel = isZh ? "2026 第四季度 (Q4)" : "2026 Q4 (Oct–Dec)";
    else if (timeRange === "2026_H1") timeLabel = isZh ? "2026 上半年 (H1)" : "2026 H1 (Jan–Jun)";
    else if (timeRange === "2026_H2") timeLabel = isZh ? "2026 下半年 (H2)" : "2026 H2 (Jul–Dec)";
    else if (timeRange === "2026") timeLabel = isZh ? "2026 全年" : "2026 Full Year";
    else if (timeRange === "2027") timeLabel = isZh ? "2027 全年" : "2027 Full Year";

    const reportTitle = isZh
      ? `${displayRegion} 科技展会情报报告 (${timeLabel})`
      : `${region === "ALL" ? "Global" : region} Tech Exhibition Intelligence Report (${timeLabel})`;

    if (format === "xlsx") {
      const buffer = generateExcelReportBuffer(events, reportTitle, region, locale);
      return new Response(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="Lifewood_Exhibition_Report_${region.toLowerCase()}_${timeRange}.xlsx"`,
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
          "Content-Disposition": `attachment; filename="lifewood_exhibition_report_${region.toLowerCase()}_${timeRange}.csv"`,
        },
      });
    }

    // Default HTML format
    const htmlReport = generateBrandedHTMLReport(events, reportTitle, region, locale, timeLabel);
    return NextResponse.json({ html: htmlReport, count: events.length });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to generate report: " + error.message },
      { status: 500 }
    );
  }
}
