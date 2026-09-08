import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const totalEvents = await db.event.count({
      where: { status: "PUBLISHED" },
    });

    const events2027 = await db.event.count({
      where: {
        status: "PUBLISHED",
        startDate: {
          gte: new Date("2027-01-01"),
          lte: new Date("2027-12-31"),
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

    // Events by Month (2026 - 2027)
    const monthCounts: Record<string, number> = {
      "Apr 2026": 0,
      "May 2026": 0,
      "Jun 2026": 0,
      "Jul 2026": 0,
      "Aug 2026": 0,
      "Sep 2026": 0,
      "Oct 2026": 0,
      "Nov 2026": 0,
      "Dec 2026": 0,
      "Jan 2027": 0,
      "Feb 2027": 0,
      "Mar 2027": 0,
    };

    allEvents.forEach((evt) => {
      if (evt.startDate) {
        const d = new Date(evt.startDate);
        const key = d.toLocaleString("en-US", { month: "short", year: "numeric" });
        if (key in monthCounts) {
          monthCounts[key]++;
        } else {
          monthCounts[key] = (monthCounts[key] || 0) + 1;
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

    // Coverage gaps (months with < 5 events)
    const gaps = eventsByMonth.filter((m) => m.count < 5);

    return NextResponse.json({
      stats: {
        totalEvents,
        events2027,
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
