export interface BusinessLineConfig {
  id: string;
  name: string;
  colorHex: string;
  badgeBg: string;
  dataElements: string;
  description: string;
}

export const BUSINESS_LINES: BusinessLineConfig[] = [
  {
    id: "global-ai-data",
    name: "Global AI Data",
    colorHex: "#046241",
    badgeBg: "bg-[#046241]",
    dataElements: "Text, Audio, Picture, Video",
    description: "Training data, annotation/labeling, RLHF, evals, datasets, LLM fine-tuning",
  },
  {
    id: "aigc",
    name: "AIGC",
    colorHex: "#133020",
    badgeBg: "bg-[#133020]",
    dataElements: "Picture, Video",
    description: "Generative AI, AI video/creative, automated content production, marketing AI",
  },
  {
    id: "global-scanning",
    name: "Global Scanning + Indexing",
    colorHex: "#C17110",
    badgeBg: "bg-[#C17110]",
    dataElements: "Text, Picture",
    description: "Digitization, archives, records, manuscripts, OCR/HTR, metadata indexing",
  },
  {
    id: "autonomous-driving",
    name: "Autonomous Driving",
    colorHex: "#034E34",
    badgeBg: "bg-[#034E34]",
    dataElements: "Picture, Video",
    description: "ADAS, AV, LiDAR sensor fusion, computer vision annotation, in-cabin monitoring",
  },
  {
    id: "aeo-geo",
    name: "AEO/GEO",
    colorHex: "#E89131",
    badgeBg: "bg-[#E89131]",
    dataElements: "Text",
    description: "Answer-engine optimization, generative-engine optimization, AI search citation",
  },
  {
    id: "edge-intelligence",
    name: "EDGE Intelligence",
    colorHex: "#417256",
    badgeBg: "bg-[#417256]",
    dataElements: "Audio, Picture, Video",
    description: "Embedded vision, edge AI, IoT, industrial IoT, on-device inference data",
  },
];

export const REGIONS = [
  "Asia",
  "North America",
  "Europe",
  "Middle East",
  "South America",
  "Africa",
  "Oceania",
];

export const FIT_SCORES = [
  { level: 5, label: "5 - Direct Fit (Target Buyer in Room)", bg: "bg-[#133020] text-white" },
  { level: 4, label: "4 - Strong Fit (Large Relevant Audience)", bg: "bg-[#046241] text-white" },
  { level: 3, label: "3 - Moderate Fit (Partnership & Visibility)", bg: "bg-[#708E7C] text-white" },
];

export const PRIORITIES = [
  { name: "High", dotColor: "#C17110", textColor: "text-[#C17110]" },
  { name: "Medium", dotColor: "#FFB347", textColor: "text-[#E89131]" },
  { name: "Low", dotColor: "#9CAFA4", textColor: "text-[#9CAFA4]" },
];

export const PARTICIPATION_OPTIONS = [
  "Exhibit",
  "Attend",
  "Speak",
  "Monitor",
];
