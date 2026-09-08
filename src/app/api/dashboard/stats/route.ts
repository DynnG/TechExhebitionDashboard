import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const totalEvents = await db.event.count({
      where: { status: "PUBLISHED" },
    });

    // Dynamic Forward Pipeline Count (events starting from current year onward)
    const now = new Date();
    const currentYear = now.getFullYear();

    const forwardPipelineCount = await db.event.count({
      where: {
        status: "PUBLISHED",
        startDate: {
          gte: new Date(`${currentYear}-01-01`),
        },
      },
    });

    const allEvents = await db.event.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        eventNumber: true,
        eventName: true,
        region: true,
        dates: true,
        city: true,
        country: true,
        fitScore: true,
        priorityLevel: true,
        businessLines: true,
        startDate: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Average Fit Score
    const totalFit = allEvents.reduce((acc, e) => acc + e.fitScore, 0);
    const avgFitScore = totalEvents > 0 ? (totalFit / totalEvents).toFixed(1) : "0.0";

    // Unique Regions
    const uniqueRegions = new Set(allEvents.map((e) => e.region)).size;

    // Dynamically generate rolling month counts (from current date onward dynamically)
    const monthCounts: Record<string, number> = {};
    const startDateCursor = new Date(currentYear, 0, 1);
    
    let maxDate = new Date(currentYear + 2, 11, 31);
    allEvents.forEach((evt) => {
      if (evt.startDate && new Date(evt.startDate) > maxDate) {
        maxDate = new Date(evt.startDate);
      }
    });

    const tempDate = new Date(startDateCursor);
    while (tempDate <= maxDate) {
      const key = tempDate.toLocaleString("en-US", { month: "short", year: "numeric" });
      monthCounts[key] = 0;
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    allEvents.forEach((evt) => {
      if (evt.startDate) {
        const d = new Date(evt.startDate);
        const key = d.toLocaleString("en-US", { month: "short", year: "numeric" });
        if (key in monthCounts) {
          monthCounts[key]++;
        }
      }
    });

    const eventsByMonth = Object.entries(monthCounts).map(([month, count]) => ({
      month,
      count,
      isGap: count < 5,
    }));

    // Events by Region
    const regionCounts: Record<string, number> = {};
    allEvents.forEach((evt) => {
      regionCounts[evt.region] = (regionCounts[evt.region] || 0) + 1;
    });

    const eventsByRegion = Object.entries(regionCounts).map(([region, count]) => ({
      region,
      count,
    }));

    // Business Line Distribution
    const blCounts: Record<string, number> = {};
    allEvents.forEach((evt) => {
      try {
        const lines: string[] = JSON.parse(evt.businessLines);
        lines.forEach((l) => {
          blCounts[l] = (blCounts[l] || 0) + 1;
        });
      } catch {
        blCounts[evt.businessLines] = (blCounts[evt.businessLines] || 0) + 1;
      }
    });

    const businessLineDist = Object.entries(blCounts).map(([name, count]) => ({
      name,
      count,
    }));

    // Fit Score Distribution
    const fitCounts: Record<string, number> = { Fit5: 0, Fit4: 0, Fit3: 0 };
    allEvents.forEach((evt) => {
      if (evt.fitScore === 5) fitCounts.Fit5++;
      if (evt.fitScore === 4) fitCounts.Fit4++;
      if (evt.fitScore === 3) fitCounts.Fit3++;
    });

    const fitScoreDist = [
      { name: "Fit 5 (Direct Fit)", count: fitCounts.Fit5, color: "#133020" },
      { name: "Fit 4 (Strong Fit)", count: fitCounts.Fit4, color: "#046241" },
      { name: "Fit 3 (Moderate Fit)", count: fitCounts.Fit3, color: "#708E7C" },
    ];

    // Coverage gaps (months with < 5 events, limited up to December 2027)
    const dec2027End = new Date("2027-12-31T23:59:59");
    const gaps = eventsByMonth.filter((m) => {
      const parts = m.month.split(" ");
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const mIdx = monthNames.indexOf(parts[0]);
      const year = parseInt(parts[1] || "2026", 10);
      const mDate = new Date(year, mIdx, 1);
      return m.count < 5 && mDate <= dec2027End;
    });

    return NextResponse.json({
      stats: {
        totalEvents,
        events2027: forwardPipelineCount,
        avgFitScore,
        uniqueRegions,
      },
      eventsByMonth,
      eventsByRegion,
      businessLineDist,
      fitScoreDist,
      gaps,
      recentEvents: allEvents.slice(0, 5),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats: " + error.message },
      { status: 500 }
    );
  }
}
