export interface ScraperStoreState {
  results: any[];
  status: "idle" | "running" | "completed" | "error";
  events_found: number;
  started_at: string | null;
  completed_at: string | null;
  lastRunTime: string | null;
}

export const liveScraperStore: ScraperStoreState = {
  results: [],
  status: "completed",
  events_found: 12,
  started_at: null,
  completed_at: null,
  lastRunTime: null,
};
