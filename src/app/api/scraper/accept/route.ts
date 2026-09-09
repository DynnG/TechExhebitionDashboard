import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // 1. Deduplication Guard: Check if event already exists in database
    const normalizedWebsite = body.officialWebsite
      ? body.officialWebsite.trim().replace(/\/+$/, "").toLowerCase()
      : "";
    const cleanName = (body.eventName || "").trim().toLowerCase();
    const cleanCity = (body.city || "").trim().toLowerCase();

    const allDbEvents = await db.event.findMany({
      select: {
        id: true,
        eventNumber: true,
        eventName: true,
        city: true,
        dates: true,
        officialWebsite: true,
      },
    });

    const existingMatch = allDbEvents.find((e) => {
      const exWebsite = e.officialWebsite
        ? e.officialWebsite.trim().replace(/\/+$/, "").toLowerCase()
        : "";
      if (
        normalizedWebsite &&
        normalizedWebsite !== "https://" &&
        exWebsite &&
        exWebsite !== "https://"
      ) {
        if (exWebsite === normalizedWebsite) return true;
      }
      const exName = (e.eventName || "").trim().toLowerCase();
      const exCity = (e.city || "").trim().toLowerCase();
      if (exName === cleanName) {
        if (!cleanCity || !exCity || cleanCity === exCity) return true;
      }
      return false;
    });

    if (existingMatch) {
      return NextResponse.json({
        success: true,
        isDuplicate: true,
        event: existingMatch,
        message: `Event "${existingMatch.eventName}" is already recorded in the database (#${existingMatch.eventNumber}).`,
      });
    }

    // Get next eventNumber
    const maxEvent = await db.event.findFirst({
      orderBy: { eventNumber: "desc" },
    });
    const nextNumber = (maxEvent?.eventNumber || 0) + 1;

    let businessLines = body.businessLines || ["Global AI Data"];
    if (typeof businessLines === "string") {
      businessLines = [businessLines];
    }

    const newEvent = await db.event.create({
      data: {
        eventNumber: nextNumber,
        region: body.region || "Asia",
        country: body.country || "TBD",
        city: body.city || "TBD",
        eventName: body.eventName,
        dates: body.dates || "Dates TBA",
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        venue: body.venue || "TBD",
        locationAddress: body.locationAddress || "",
        officialWebsite: body.officialWebsite || "https://",
        organizer: body.organizer || "TBD",
        eventCategory: body.eventCategory || "Tech Exhibition",
        businessLines: JSON.stringify(businessLines),
        strategicFocus: body.strategicFocus || "",
        relevanceToLifewood: body.relevanceToLifewood || "Scraped & verified event.",
        targetAudience: body.targetAudience || "Tech Executives",
        estimatedAttendees: body.estimatedAttendees || "Not publicly disclosed",
        exhibitorOpportunity: "Not publicly disclosed",
        boothCost: "Not publicly disclosed",
        registrationDeadline: "Not publicly disclosed",
        contactEmail: "Not publicly disclosed",
        contactPerson: "Not publicly disclosed",
        socialMedia: "Not publicly disclosed",
        participationRec: body.participationRec || "Exhibit",
        priorityLevel: body.priorityLevel || "High",
        fitScore: body.fitScore || 4,
        keyNotes: "Scraped via AI Scraper Microservice",
        sourceLinks: JSON.stringify([body.officialWebsite || "https://"]),
        status: "PENDING_REVIEW",
        source: "SCRAPED",
        createdById: parseInt((session.user as any).id || "1", 10),
      },
    });

    // Automatically transfer to Review Queue
    await db.queueItem.create({
      data: {
        type: "FOR_REVIEW",
        eventId: newEvent.id,
        submittedById: parseInt((session.user as any).id || "1", 10),
        reason: `Scraped website source: ${body.officialWebsite || "Extracted URL"} (AI Confidence: ${Math.round((body.confidence || 0.9) * 100)}%) - submitted for supervisor review & approval.`,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, event: newEvent, transferredToQueue: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to accept scraped event: " + error.message },
      { status: 500 }
    );
  }
}
