import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateBrandedHTMLReport } from "@/lib/reports/html-template";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reportType, region, format } = body;

    const where: any = { status: "PUBLISHED" };
    if (region && region !== "ALL") {
      where.region = region;
    }

    const events = await db.event.findMany({
      where,
      orderBy: { startDate: "asc" },
    });

    const reportTitle = `${region === "ALL" ? "Global" : region} Tech Exhibition Intelligence Report 2026–2027`;

    if (format === "csv") {
      // CSV Generation
      const csvRows = [
        [
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
          `"${evt.eventName.replace(/"/g, '""')}"`,
          evt.region,
          evt.country,
          evt.city,
          `"${evt.dates}"`,
          `"${evt.venue.replace(/"/g, '""')}"`,
          `"${evt.organizer.replace(/"/g, '""')}"`,
          `"${bl}"`,
          evt.fitScore.toString(),
          evt.priorityLevel,
          evt.participationRec,
          `"${evt.relevanceToLifewood.replace(/"/g, '""')}"`,
          evt.officialWebsite,
        ]);
      });

      const csvContent = csvRows.map((r) => r.join(",")).join("\n");
      return new Response(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="lifewood_exhibition_report.csv"`,
        },
      });
    }

    // Default HTML format
    const htmlReport = generateBrandedHTMLReport(events, reportTitle, region);
    return NextResponse.json({ html: htmlReport, count: events.length });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to generate report: " + error.message },
      { status: 500 }
    );
  }
}
