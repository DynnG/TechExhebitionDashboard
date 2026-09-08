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
        status: "PUBLISHED",
        source: "SCRAPED",
        createdById: parseInt((session.user as any).id),
      },
    });

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to accept scraped event: " + error.message },
      { status: 500 }
    );
  }
}
