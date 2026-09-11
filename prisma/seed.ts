import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed default users
  const adminPassword = await bcrypt.hash("admin123", 10);
  const supervisorPassword = await bcrypt.hash("supervisor123", 10);
  const internPassword = await bcrypt.hash("intern123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@lifewood.com" },
    update: {
      role: "SUPERADMIN",
      name: "Superadmin User",
    },
    create: {
      email: "admin@lifewood.com",
      name: "Superadmin User",
      passwordHash: adminPassword,
      role: "SUPERADMIN",
    },
  });

  const supervisor = await prisma.user.upsert({
    where: { email: "supervisor@lifewood.com" },
    update: {
      role: "ADMIN",
      name: "Admin User",
    },
    create: {
      email: "supervisor@lifewood.com",
      name: "Admin User",
      passwordHash: supervisorPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "intern@lifewood.com" },
    update: {
      role: "USER",
      name: "User",
    },
    create: {
      email: "intern@lifewood.com",
      name: "User",
      passwordHash: internPassword,
      role: "USER",
    },
  });

  console.log("Seeded users: Superadmin (admin@lifewood.com), Admin (supervisor@lifewood.com), User (intern@lifewood.com).");

  // Seed sample exhibitions
  const sampleEvents = [
    {
      eventNumber: 1,
      region: "Asia",
      country: "Hong Kong",
      city: "Hong Kong",
      eventName: "Hong Kong International Lighting Fair (Spring Edition) 2026",
      dates: "Apr 6–9, 2026",
      startDate: new Date("2026-04-06"),
      endDate: new Date("2026-04-09"),
      venue: "Hong Kong Convention and Exhibition Centre (HKCEC)",
      locationAddress: "1 Harbour Road, Wan Chai, Hong Kong",
      officialWebsite: "https://www.hktdc.com/event/hklightingfairse/en",
      organizer: "Hong Kong Trade Development Council (HKTDC)",
      eventCategory: "Commercial & Smart Lighting Expo",
      businessLines: JSON.stringify(["EDGE Intelligence", "Global Scanning + Indexing"]),
      strategicFocus: "Smart lighting IoT connectivity, embedded sensors, and catalog indexing for building management.",
      relevanceToLifewood: "Direct relevance to Edge Intelligence for IoT sensor data collection and catalog indexing for smart building OEMs.",
      targetAudience: "Architects, lighting manufacturers, smart city procurement buyers",
      estimatedAttendees: "14,000+",
      exhibitorOpportunity: "Booth space starting at $4,200 per 9sqm",
      boothCost: "$4,200",
      registrationDeadline: "Mar 1, 2026",
      contactEmail: "lighting.fair@hktdc.org",
      contactPerson: "Exhibitor Relations Desk",
      socialMedia: "https://linkedin.com/company/hktdc",
      participationRec: "Attend",
      priorityLevel: "High",
      fitScore: 4,
      keyNotes: "Co-located with InnoEX 2026. Excellent stage for edge vision sensor partnership.",
      sourceLinks: JSON.stringify(["https://www.hktdc.com/event/hklightingfairse/en"]),
      status: "PUBLISHED",
      source: "MANUAL",
      createdById: admin.id,
    },
    {
      eventNumber: 2,
      region: "Asia",
      country: "Hong Kong",
      city: "Hong Kong",
      eventName: "InnoEX 2026 (Innovation & Technology Exhibition)",
      dates: "Apr 13–16, 2026",
      startDate: new Date("2026-04-13"),
      endDate: new Date("2026-04-16"),
      venue: "Hong Kong Convention and Exhibition Centre (HKCEC)",
      locationAddress: "1 Harbour Road, Wan Chai, Hong Kong",
      officialWebsite: "https://www.hktdc.com/event/innoex/en",
      organizer: "HKTDC & Innovation, Technology and Industry Bureau",
      eventCategory: "Enterprise AI & Smart City Summit",
      businessLines: JSON.stringify(["Global AI Data", "AIGC", "EDGE Intelligence"]),
      strategicFocus: "Generative AI deployment, multilingual LLM training data, smart government solutions.",
      relevanceToLifewood: "Core platform for Lifewood's Global AI Data annotation solutions targeting APAC enterprise and public sector AI builders.",
      targetAudience: "CTOs, Government AI procurement leads, AI startup founders, Data Scientists",
      estimatedAttendees: "30,000+",
      exhibitorOpportunity: "Sponsorship & Dedicated AI Zone booth available",
      boothCost: "$5,500",
      registrationDeadline: "Feb 28, 2026",
      contactEmail: "innoex@hktdc.org",
      contactPerson: "Sarah Chen",
      socialMedia: "https://linkedin.com/showcase/innoex",
      participationRec: "Exhibit",
      priorityLevel: "High",
      fitScore: 5,
      keyNotes: "Premier Asia event for AI training datasets and RLHF human evaluation services.",
      sourceLinks: JSON.stringify(["https://www.hktdc.com/event/innoex/en"]),
      status: "PUBLISHED",
      source: "MANUAL",
      createdById: admin.id,
    },
    {
      eventNumber: 3,
      region: "Asia",
      country: "Singapore",
      city: "Singapore",
      eventName: "GITEX ASIA x AI Everything Singapore 2026",
      dates: "Sep 15–17, 2026",
      startDate: new Date("2026-09-15"),
      endDate: new Date("2026-09-17"),
      venue: "Marina Bay Sands Expo & Convention Centre",
      locationAddress: "10 Bayfront Ave, Singapore 018956",
      officialWebsite: "https://www.gitexasia.com/",
      organizer: "KAOUN International",
      eventCategory: "Global AI & Tech Expo",
      businessLines: JSON.stringify(["Global AI Data", "AIGC", "Autonomous Driving", "AEO/GEO"]),
      strategicFocus: "APAC regional AI platform, LLM fine-tuning datasets, autonomous vehicle data pipelines.",
      relevanceToLifewood: "Premier stage for Lifewood's AI data annotation and multilingual data services in Southeast Asia.",
      targetAudience: "Global tech executives, AI model vendors, Enterprise transformation leads",
      estimatedAttendees: "25,000+",
      exhibitorOpportunity: "Silver & Gold sponsorship packages",
      boothCost: "$8,000",
      registrationDeadline: "Jun 15, 2026",
      contactEmail: "info@gitexasia.com",
      contactPerson: "Michael Wong",
      socialMedia: "https://linkedin.com/company/gitex-asia",
      participationRec: "Exhibit",
      priorityLevel: "High",
      fitScore: 5,
      keyNotes: "Inaugural edition of GITEX in Asia. Mandatory presence for regional AI market expansion.",
      sourceLinks: JSON.stringify(["https://www.gitexasia.com/"]),
      status: "PUBLISHED",
      source: "MANUAL",
      createdById: admin.id,
    },
    {
      eventNumber: 4,
      region: "North America",
      country: "USA",
      city: "San Diego",
      eventName: "brightonSEO San Diego 2026",
      dates: "Nov 12–13, 2026",
      startDate: new Date("2026-11-12"),
      endDate: new Date("2026-11-13"),
      venue: "San Diego Convention Center",
      locationAddress: "111 W Harbor Dr, San Diego, CA 92101",
      officialWebsite: "https://www.brightonseo.com/us",
      organizer: "Rough Agenda",
      eventCategory: "Search Marketing & AI Search Conference",
      businessLines: JSON.stringify(["AEO/GEO", "Global AI Data"]),
      strategicFocus: "Answer-Engine Optimization (AEO), Generative Engine Optimization (GEO), LLM citation data.",
      relevanceToLifewood: "Direct match for Lifewood's AEO/GEO brand citation and AI Search content evaluation services.",
      targetAudience: "Head of SEO, AI Search Strategists, Enterprise Digital Marketers",
      estimatedAttendees: "3,500+",
      exhibitorOpportunity: "Booth + Speaking slot option",
      boothCost: "$6,000",
      registrationDeadline: "Aug 30, 2026",
      contactEmail: "hey@brightonseo.com",
      contactPerson: "Kelvin Newman",
      socialMedia: "https://twitter.com/brightonseo",
      participationRec: "Speak",
      priorityLevel: "High",
      fitScore: 5,
      keyNotes: "World's top venue for Generative Engine Optimization. High lead conversion rate expected.",
      sourceLinks: JSON.stringify(["https://www.brightonseo.com/us"]),
      status: "PUBLISHED",
      source: "MANUAL",
      createdById: supervisor.id,
    },
    {
      eventNumber: 5,
      region: "Europe",
      country: "Germany",
      city: "Berlin",
      eventName: "Edge AI & Vision Summit Europe 2027",
      dates: "Mar 16–18, 2027",
      startDate: new Date("2027-03-16"),
      endDate: new Date("2027-03-18"),
      venue: "Messe Berlin",
      locationAddress: "Messedamm 22, 14055 Berlin, Germany",
      officialWebsite: "https://www.edge-ai-vision.com",
      organizer: "Edge AI Vision Alliance",
      eventCategory: "Embedded Vision & Edge AI Expo",
      businessLines: JSON.stringify(["EDGE Intelligence", "Autonomous Driving"]),
      strategicFocus: "Computer vision video labeling, sensor fusion data pipelines, on-device inference.",
      relevanceToLifewood: "Primary European platform for edge vision dataset labeling and autonomous vehicle computer vision data services.",
      targetAudience: "Embedded Systems Engineers, Autonomous Vehicle Software Leads, Vision AI Product Managers",
      estimatedAttendees: "4,500+",
      exhibitorOpportunity: "Exhibitor booth",
      boothCost: "€5,200",
      registrationDeadline: "Jan 15, 2027",
      contactEmail: "contact@edge-ai-vision.com",
      contactPerson: "Hans Weber",
      socialMedia: "https://linkedin.com/company/edge-ai-vision-alliance",
      participationRec: "Attend",
      priorityLevel: "Medium",
      fitScore: 4,
      keyNotes: "Focus on industrial IoT and automotive video dataset curation.",
      sourceLinks: JSON.stringify(["https://www.edge-ai-vision.com"]),
      status: "PUBLISHED",
      source: "MANUAL",
      createdById: supervisor.id,
    }
  ];

  for (const eventData of sampleEvents) {
    await prisma.event.upsert({
      where: { eventNumber: eventData.eventNumber },
      update: {},
      create: eventData,
    });
  }

  console.log("Seeded sample exhibition events successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
