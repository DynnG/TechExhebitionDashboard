import { NextResponse } from "next/server";
import { liveScraperStore } from "@/lib/scraper/store";

export async function GET() {
  if (liveScraperStore.results && liveScraperStore.results.length > 0) {
    return NextResponse.json({
      results: liveScraperStore.results,
      total: liveScraperStore.results.length,
    });
  }

  // Initial demo results before user triggers live web crawl
  const initialResults = [
    {
      id: "scrape-101",
      eventName: "AI & Big Data Expo Global 2027",
      region: "Europe",
      country: "UK",
      city: "London",
      dates: "Dec 1–2, 2027",
      venue: "Olympia London",
      officialWebsite: "https://www.ai-expo.net/global/",
      organizer: "Encore Media Group",
      eventCategory: "Enterprise AI & Big Data Expo",
      businessLines: ["Global AI Data", "AIGC"],
      strategicFocus: "Next-Gen Enterprise AI, Data Platforms, MLOps, LLM fine-tuning and AI Data annotation.",
      relevanceToLifewood: "Direct match for Lifewood's Global AI Data annotation solutions targeting European enterprise AI deployment leads.",
      targetAudience: "Enterprise CTOs, Data Architects, Head of AI",
      estimatedAttendees: "7,000+",
      participationRec: "Exhibit",
      fitScore: 5,
      priorityLevel: "High",
      confidence: 0.94,
      status: "NEW",
    },
    {
      id: "scrape-102",
      eventName: "Autonomous Vehicle Technology Expo 2027",
      region: "Europe",
      country: "Germany",
      city: "Stuttgart",
      dates: "Jun 22–24, 2027",
      venue: "Messe Stuttgart",
      officialWebsite: "https://www.autonomousvehicletechnologyexpo.com",
      organizer: "UKi Media & Events",
      eventCategory: "Autonomous Vehicles & ADAS Summit",
      businessLines: ["Autonomous Driving", "EDGE Intelligence"],
      strategicFocus: "ADAS testing, LiDAR sensor fusion, computer vision data labeling, and autonomous driving software validation.",
      relevanceToLifewood: "Core platform for Lifewood's autonomous vehicle vision data annotation pipelines.",
      targetAudience: "Automotive OEM Software Leads, Autonomous Driving Engineers",
      estimatedAttendees: "5,500+",
      participationRec: "Attend",
      fitScore: 4,
      priorityLevel: "High",
      confidence: 0.92,
      status: "NEW",
    },
  ];

  return NextResponse.json({
    results: initialResults,
    total: initialResults.length,
  });
}
