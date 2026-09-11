import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const region = searchParams.get("region");
    const businessLine = searchParams.get("businessLine");
    const fitScore = searchParams.get("fitScore");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const isAttendedParam = searchParams.get("isAttended");

    const sortBy = searchParams.get("sortBy") || "NUMBER_ASC";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (isAttendedParam === "true") {
      where.isAttended = true;
    } else if (isAttendedParam === "false") {
      where.isAttended = false;
    }

    if (region && region !== "ALL") {
      const regionsList = region.split(",").map((r) => r.trim()).filter(Boolean);
      if (regionsList.length > 0) {
        where.region = { in: regionsList };
      }
    }

    if (priority && priority !== "ALL") {
      const prioritiesList = priority.split(",").map((p) => p.trim()).filter(Boolean);
      if (prioritiesList.length > 0) {
        where.priorityLevel = { in: prioritiesList };
      }
    }

    if (fitScore && fitScore !== "ALL") {
      const scores = fitScore
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n));
      if (scores.length > 0) {
        where.fitScore = { in: scores };
      }
    }

    if (status && status !== "ALL") {
      where.status = status;
    } else {
      where.status = "PUBLISHED";
    }

    if (search && search.trim() !== "") {
      const query = search.trim();
      where.OR = [
        { eventName: { contains: query } },
        { city: { contains: query } },
        { country: { contains: query } },
        { venue: { contains: query } },
        { organizer: { contains: query } },
      ];
    }

    // Determine sorting order
    let orderBy: any = { eventNumber: "asc" };
    if (sortBy === "NUMBER_DESC") orderBy = { eventNumber: "desc" };
    else if (sortBy === "NAME_ASC") orderBy = { eventName: "asc" };
    else if (sortBy === "NAME_DESC") orderBy = { eventName: "desc" };
    else if (sortBy === "DATE_ASC") orderBy = { startDate: "asc" };
    else if (sortBy === "DATE_DESC") orderBy = { startDate: "desc" };
    else if (sortBy === "FIT_DESC") orderBy = { fitScore: "desc" };

    // Fetch events
    let events = await db.event.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        createdBy: {
          select: { name: true, role: true },
        },
      },
    });

    // Client side filter for JSON string businessLines array (supports multi-select comma-separated list)
    if (businessLine && businessLine !== "ALL") {
      const blList = businessLine.split(",").map((b) => b.trim().toLowerCase()).filter(Boolean);
      events = events.filter((evt) => {
        try {
          const lines: string[] = JSON.parse(evt.businessLines).map((l: string) => l.toLowerCase());
          return lines.some((l) => blList.some((b) => l.includes(b) || b.includes(l)));
        } catch {
          const raw = evt.businessLines.toLowerCase();
          return blList.some((b) => raw.includes(b));
        }
      });
    }

    const totalCount = await db.event.count({ where });

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch events: " + error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Fit score validation rule (minimum score 3 enforced)
    if (body.fitScore < 3) {
      return NextResponse.json(
        { error: "Only events scoring Fit 3+ can be entered into the database." },
        { status: 400 }
      );
    }

    // Get max eventNumber
    const maxEvent = await db.event.findFirst({
      orderBy: { eventNumber: "desc" },
    });
    const nextNumber = (maxEvent?.eventNumber || 0) + 1;

    const userId = parseInt((session.user as any).id);
    const userRole = (session.user as any).role || "INTERN";

    // Manually added events go through the review queue (PENDING_REVIEW)
    const initialStatus = body.status === "DRAFT" ? "DRAFT" : "PENDING_REVIEW";

    const newEvent = await db.event.create({
      data: {
        eventNumber: nextNumber,
        region: body.region,
        country: body.country,
        city: body.city,
        eventName: body.eventName,
        dates: body.dates,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        venue: body.venue,
        locationAddress: body.locationAddress || "",
        officialWebsite: body.officialWebsite,
        organizer: body.organizer,
        eventCategory: body.eventCategory,
        businessLines: JSON.stringify(body.businessLines || []),
        strategicFocus: body.strategicFocus,
        relevanceToLifewood: body.relevanceToLifewood,
        targetAudience: body.targetAudience,
        estimatedAttendees: body.estimatedAttendees || "Not publicly disclosed",
        exhibitorOpportunity: body.exhibitorOpportunity || "Not publicly disclosed",
        boothCost: body.boothCost || "Not publicly disclosed",
        registrationDeadline: body.registrationDeadline || "Not publicly disclosed",
        contactEmail: body.contactEmail || "Not publicly disclosed",
        contactPerson: body.contactPerson || "Not publicly disclosed",
        socialMedia: body.socialMedia || "Not publicly disclosed",
        participationRec: body.participationRec,
        priorityLevel: body.priorityLevel || "Medium",
        fitScore: body.fitScore,
        keyNotes: body.keyNotes || "",
        sourceLinks: JSON.stringify(body.sourceLinks || []),
        status: initialStatus,
        source: "MANUAL",
        createdById: userId,
      },
    });

    // Automatically submit to Queue for review if pending review
    if (initialStatus === "PENDING_REVIEW") {
      await db.queueItem.create({
        data: {
          type: "FOR_REVIEW",
          eventId: newEvent.id,
          submittedById: userId,
          reason: `Manually added exhibition record #${newEvent.eventNumber} awaiting review`,
          status: "PENDING",
        },
      });
    }

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create event: " + error.message },
      { status: 500 }
    );
  }
}
