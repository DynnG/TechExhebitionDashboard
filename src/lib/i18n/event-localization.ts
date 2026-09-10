import { Locale } from "./types";

export const BUSINESS_LINES_MAP: Record<string, string> = {
  "Global AI Data": "全球 AI 数据",
  "AIGC": "生成式人工智能 (AIGC)",
  "Global Scanning + Indexing": "全球扫描与索引",
  "Autonomous Driving": "自动驾驶",
  "AEO/GEO": "AEO/GEO 优化",
  "EDGE Intelligence": "边缘智能",
};

export const REGIONS_MAP: Record<string, string> = {
  "Asia": "亚洲",
  "Asia-Pacific": "亚太地区",
  "APAC": "亚太地区 (APAC)",
  "North America": "北美洲",
  "Europe": "欧洲",
  "Middle East": "中东",
  "South America": "南美洲",
  "Africa": "非洲",
  "Oceania": "大洋洲",
  "Global": "全球",
};

export const COUNTRIES_MAP: Record<string, string> = {
  "Hong Kong": "中国香港",
  "Singapore": "新加坡",
  "USA": "美国",
  "United States": "美国",
  "Germany": "德国",
  "UAE": "阿联酋",
  "United Arab Emirates": "阿联酋",
  "Malaysia": "马来西亚",
  "Philippines": "菲律宾",
  "Japan": "日本",
  "South Korea": "韩国",
  "Korea": "韩国",
  "United Kingdom": "英国",
  "UK": "英国",
  "France": "法国",
  "China": "中国",
  "Canada": "加拿大",
  "Australia": "澳大利亚",
  "India": "印度",
  "Thailand": "泰国",
  "Vietnam": "越南",
  "Indonesia": "印度尼西亚",
  "Saudi Arabia": "沙特阿拉伯",
  "Spain": "西班牙",
  "Italy": "意大利",
  "Netherlands": "荷兰",
  "Switzerland": "瑞士",
};

export const CITIES_MAP: Record<string, string> = {
  "Hong Kong": "香港",
  "Singapore": "新加坡",
  "San Diego": "圣地亚哥",
  "Berlin": "柏林",
  "Dubai": "迪拜",
  "Tokyo": "东京",
  "Seoul": "首尔",
  "London": "伦敦",
  "Paris": "巴黎",
  "Kuala Lumpur": "吉隆坡",
  "Manila": "马尼拉",
  "Las Vegas": "拉斯维加斯",
  "San Francisco": "旧金山",
  "New York": "纽约",
  "Austin": "奥斯汀",
  "Munich": "慕尼黑",
  "Frankfurt": "法兰克福",
  "Amsterdam": "阿姆斯特丹",
  "Barcelona": "巴塞罗那",
  "Riyadh": "利雅得",
  "Abu Dhabi": "阿布扎比",
  "Bangkok": "曼谷",
  "Jakarta": "雅加达",
  "Beijing": "北京",
  "Shanghai": "上海",
  "Shenzhen": "深圳",
  "Guangzhou": "广州",
  "Taipei": "台北",
  "Stuttgart": "斯图加特",
  "Chicago": "芝加哥",
  "Boston": "波士顿",
  "Seattle": "西雅图",
  "Toronto": "多伦多",
  "Sydney": "悉尼",
  "Melbourne": "墨尔本",
  "Zurich": "苏黎世",
  "Geneva": "日内瓦",
  "Madrid": "马德里",
  "Milan": "米兰",
  "Rome": "罗马",
  "Lisbon": "里斯本",
  "Vienna": "维也纳",
  "Brussels": "布鲁塞尔",
  "Stockholm": "斯德哥尔摩",
  "Copenhagen": "哥本哈根",
  "Helsinki": "赫尔辛基",
  "Oslo": "奥斯陆",
  "Dublin": "都柏林",
  "Warsaw": "华沙",
  "Prague": "布拉格",
  "Budapest": "布达佩斯",
  "Doha": "多哈",
  "Manama": "麦纳麦",
  "Kuwait City": "科威特城",
  "George Town": "乔治市",
  "Penang": "槟城",
  "Johor Bahru": "新山",
  "Cebu": "宿务",
  "Davao": "达沃",
  "Ho Chi Minh City": "胡志明市",
  "Hanoi": "河内",
  "Chiang Mai": "清迈",
  "Osaka": "大阪",
  "Nagoya": "名古屋",
  "Fukuoka": "福冈",
  "Incheon": "仁川",
  "Busan": "釜山",
};

export const RECOMMENDATIONS_MAP: Record<string, string> = {
  "Exhibit": "参展",
  "Attend": "参加",
  "Speak": "演讲",
  "Monitor": "观摩/跟进",
};

export const PRIORITIES_MAP: Record<string, string> = {
  "high": "高",
  "medium": "中",
  "low": "低",
  "High": "高",
  "Medium": "中",
  "Low": "低",
};

const MONTH_EN_TO_NUM: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
  January: 1, February: 2, March: 3, April: 4, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
};

export function localizeDateString(dateStr: string, locale: Locale): string {
  if (!dateStr || locale !== "zh") return dateStr;

  const trimmed = dateStr.trim();

  // "Confirmed 2026" -> "已确认 · 2026"
  const confMatch = trimmed.match(/^Confirmed\s+(\d{4})$/i);
  if (confMatch) {
    return `已确认 · ${confMatch[1]}`;
  }

  // "Apr 6–9, 2026" or "Apr 6-9, 2026"
  const rangeMatch = trimmed.match(/^([A-Za-z]{3,9})\s+(\d+)\s*[–-]\s*(\d+),\s*(\d{4})$/);
  if (rangeMatch) {
    const m = MONTH_EN_TO_NUM[rangeMatch[1]];
    if (m) {
      return `${rangeMatch[4]}年${m}月${rangeMatch[2]}日–${rangeMatch[3]}日`;
    }
  }

  // "Apr 6, 2026"
  const singleMatch = trimmed.match(/^([A-Za-z]{3,9})\s+(\d+),\s*(\d{4})$/);
  if (singleMatch) {
    const m = MONTH_EN_TO_NUM[singleMatch[1]];
    if (m) {
      return `${singleMatch[3]}年${m}月${singleMatch[2]}日`;
    }
  }

  // "Q3 2027"
  const qMatch = trimmed.match(/^Q(\d)\s+(\d{4})$/i);
  if (qMatch) {
    return `${qMatch[2]}年第${qMatch[1]}季度`;
  }

  if (trimmed === "Confirmed") return "已确认";
  if (trimmed === "TBD") return "待定";

  return dateStr;
}

export function localizeMonthYear(monthStr: string, locale: Locale): string {
  if (!monthStr || locale !== "zh") return monthStr;
  const parts = monthStr.split(" ");
  if (parts.length === 2 && MONTH_EN_TO_NUM[parts[0]]) {
    return `${parts[1]}年${MONTH_EN_TO_NUM[parts[0]]}月`;
  }
  return monthStr;
}

export function localizeBusinessLineName(name: string, locale: Locale): string {
  if (!name || locale !== "zh") return name;
  return BUSINESS_LINES_MAP[name] || name;
}

export function localizeRegionName(region: string, locale: Locale): string {
  if (!region || locale !== "zh") return region;
  return REGIONS_MAP[region] || region;
}

export function localizeCountryName(country: string, locale: Locale): string {
  if (!country || locale !== "zh") return country;
  return COUNTRIES_MAP[country] || country;
}

export function localizeCityName(city: string, locale: Locale): string {
  if (!city || locale !== "zh") return city;
  return CITIES_MAP[city] || city;
}

export function localizeRecommendation(rec: string, locale: Locale): string {
  if (!rec || locale !== "zh") return rec;
  return RECOMMENDATIONS_MAP[rec] || rec;
}

export function localizePriority(priority: string, locale: Locale): string {
  if (!priority || locale !== "zh") return priority;
  return PRIORITIES_MAP[priority] || priority;
}

export function localizeFitScoreName(name: string, locale: Locale): string {
  if (!name || locale !== "zh") return name;
  if (name.includes("High Fit")) return "高度契合 (80-100%)";
  if (name.includes("Medium Fit")) return "中度契合 (50-79%)";
  if (name.includes("Low Fit")) return "低度契合 (<50%)";
  return name;
}

// Known event translations database
interface KnownEventLocalization {
  eventNameZh: string;
  venueZh?: string;
  organizerZh?: string;
  categoryZh?: string;
  strategicFocusZh?: string;
  relevanceZh?: string;
  audienceZh?: string;
  attendeesZh?: string;
  keyNotesZh?: string;
  addressZh?: string;
  exhibitorOppZh?: string;
  boothCostZh?: string;
  regDeadlineZh?: string;
  contactPersonZh?: string;
}

const KNOWN_EVENTS: Record<string, KnownEventLocalization> = {
  "Hong Kong International Lighting Fair (Spring Edition) 2026": {
    eventNameZh: "香港国际春季灯饰展 2026",
    venueZh: "香港会议展览中心 (HKCEC)",
    addressZh: "香港湾仔博览道1号",
    organizerZh: "香港贸易发展局 (HKTDC)",
    categoryZh: "商业与智能照明博览会",
    strategicFocusZh: "智能照明物联网连接、嵌入式传感器以及楼宇管理产品目录索引编目。",
    relevanceZh: "与边缘智能（EDGE Intelligence）深度契合，适用于物联网传感器数据采集及智能建筑 OEM 的目录索引编目。",
    audienceZh: "建筑师、照明制造商、智慧城市采购主管",
    attendeesZh: "14,000+ 人",
    keyNotesZh: "与 2026 香港国际创科展同场举行。边缘视觉传感器生态合作的绝佳平台。",
    exhibitorOppZh: "标准展位起价 4,200 美元 / 9平方米",
    boothCostZh: "4,200 美元",
    regDeadlineZh: "2026年3月1日",
    contactPersonZh: "参展商联络处",
  },
  "InnoEX 2026 (Innovation & Technology Exhibition)": {
    eventNameZh: "香港国际创科展 InnoEX 2026",
    venueZh: "香港会议展览中心 (HKCEC)",
    addressZh: "香港湾仔博览道1号",
    organizerZh: "香港贸发局及创新科技及工业局",
    categoryZh: "企业级 AI 与智慧城市峰会",
    strategicFocusZh: "生成式 AI 落地部署、多语言大语言模型训练数据、智慧政务解决方案。",
    relevanceZh: "Lifewood 全球 AI 数据标注核心展示平台，重点面向亚太地区企业及公共部门的 AI 开发者与采购方。",
    audienceZh: "CTO、政府 AI 采购负责人、AI 初创团队创始人、数据科学家",
    attendeesZh: "30,000+ 人",
    keyNotesZh: "亚洲顶尖的人工智能训练数据集与 RLHF 人工反馈强化学习评测服务交流盛会。",
    exhibitorOppZh: "支持赞助商合作与 AI 专属展区展位",
    boothCostZh: "5,500 美元",
    regDeadlineZh: "2026年2月28日",
    contactPersonZh: "陈女士 (Sarah Chen)",
  },
  "GITEX ASIA x AI Everything Singapore 2026": {
    eventNameZh: "GITEX 亚洲 x 新加坡 AI Everything 峰会 2026",
    venueZh: "新加坡滨海湾金沙会展中心",
    addressZh: "新加坡海湾舫道10号，邮编 018956",
    organizerZh: "KAOUN 国际会展",
    categoryZh: "全球人工智能与科技博览会",
    strategicFocusZh: "亚太区域人工智能平台、大语言模型微调数据集、自动驾驶数据全流程管线。",
    relevanceZh: "Lifewood 在东南亚拓展 AI 数据标注与多语言数据服务的核心战略平台。",
    audienceZh: "全球科技高管、AI 大模型方案商、企业数字化转型主管",
    attendeesZh: "25,000+ 人",
    keyNotesZh: "GITEX 进军亚洲的首届盛会，开拓区域人工智能市场的战略必选展会。",
    exhibitorOppZh: "提供白银及黄金级赞助合作方案",
    boothCostZh: "8,000 美元",
    regDeadlineZh: "2026年6月15日",
    contactPersonZh: "黄先生 (Michael Wong)",
  },
  "brightonSEO San Diego 2026": {
    eventNameZh: "brightonSEO 圣地亚哥峰会 2026",
    venueZh: "圣地亚哥会展中心",
    addressZh: "美国加州圣地亚哥西港大道111号，邮编 92101",
    organizerZh: "Rough Agenda",
    categoryZh: "搜索营销与 AI 搜索峰会",
    strategicFocusZh: "答案引擎优化 (AEO)、生成式引擎优化 (GEO)、大语言模型引用溯源数据。",
    relevanceZh: "与 Lifewood 的 AEO/GEO 品牌生成引用与 AI 搜索内容评测服务精准匹配。",
    audienceZh: "SEO 负责人、AI 搜索战略专家、企业数字营销总监",
    attendeesZh: "3,500+ 人",
    keyNotesZh: "全球生成式引擎优化 (GEO) 领域顶级峰会，预期潜客转化率高。",
    exhibitorOppZh: "展位 + 主题演讲席位组合方案",
    boothCostZh: "6,000 美元",
    regDeadlineZh: "2026年8月30日",
    contactPersonZh: "纽曼先生 (Kelvin Newman)",
  },
  "Edge AI & Vision Summit Europe 2027": {
    eventNameZh: "欧洲边缘 AI 与机器视觉峰会 2027",
    venueZh: "柏林国际展览中心",
    addressZh: "德国柏林展览路22号，邮编 14055",
    organizerZh: "边缘 AI 视觉联盟",
    categoryZh: "嵌入式视觉与边缘 AI 博览会",
    strategicFocusZh: "计算机视觉视频标注、多传感器融合数据管线、端侧设备推理。",
    relevanceZh: "Lifewood 拓展欧洲边缘视觉数据集标注与自动驾驶计算机视觉数据服务的首选平台。",
    audienceZh: "嵌入式系统工程师、自动驾驶软件负责人、视觉 AI 产品经理",
    attendeesZh: "4,500+ 人",
    keyNotesZh: "聚焦工业物联网与智能网联汽车视频数据集精细化标注与治理。",
    exhibitorOppZh: "标准参展商展位",
    boothCostZh: "5,200 欧元",
    regDeadlineZh: "2027年1月15日",
    contactPersonZh: "韦伯先生 (Hans Weber)",
  },
  "HKTDC InnoEX 2026": {
    eventNameZh: "香港贸发局 InnoEX 创科展 2026",
    venueZh: "香港会议展览中心",
    organizerZh: "香港贸发局全球",
    categoryZh: "智慧城市与企业级 AI 展会",
  },
  "GITEX Global 2026": {
    eventNameZh: "GITEX 全球科技展 2026",
    venueZh: "迪拜国际会展中心",
    organizerZh: "GITEX 全球",
    categoryZh: "全球科技与 AI 峰会",
  },
  "brightonSEO US 2026": {
    eventNameZh: "brightonSEO 美国峰会 2026",
    venueZh: "圣地亚哥会展中心",
    organizerZh: "brightonSEO 全球",
    categoryZh: "搜索营销与 AI 搜索峰会",
  },
  "AI & Big Data Expo Global 2027": {
    eventNameZh: "全球 AI 与大数据博览会 2027",
    venueZh: "伦敦奥林匹亚展览中心",
    organizerZh: "Encore Media Group",
    categoryZh: "企业级 AI 与大数据博览会",
    strategicFocusZh: "下一代企业级 AI、数据平台、MLOps、大语言模型微调与数据标注。",
    relevanceZh: "与 Lifewood 全球 AI 数据标注方案高度契合，重点对接欧洲企业 AI 部署决策者。",
    audienceZh: "企业级 CTO、数据架构师、AI 团队负责人",
    attendeesZh: "7,000+ 人",
  },
  "Autonomous Vehicle Technology Expo 2027": {
    eventNameZh: "自动驾驶车辆技术博览会 2027",
    venueZh: "斯图加特展览中心",
    organizerZh: "UKi Media & Events",
    categoryZh: "自动驾驶与高级辅助驾驶 (ADAS) 峰会",
    strategicFocusZh: "ADAS 测试、激光雷达传感器融合、计算机视觉数据标注与自动驾驶算法验证。",
    relevanceZh: "Lifewood 自动驾驶视觉数据全流程标注核心合作平台。",
    audienceZh: "汽车整车厂软件主管、自动驾驶算法工程师",
    attendeesZh: "5,500+ 人",
  },
};

/**
 * Translates dynamic relevance strings, especially crawler outputs.
 * Example:
 * "Live Crawled: Direct match for Lifewood's Global AI Data offerings targeting regional enterprise buyers."
 * -> "实时抓取：与 Lifewood 全球 AI 数据服务高度匹配，可帮助拓展区域企业客户。"
 */
function translateDynamicRelevance(text: string): string {
  if (!text) return text;

  // Match crawler relevance template
  const crawledMatch = text.match(/Live Crawled:\s*Direct match for Lifewood's\s*(.*?)\s*offerings targeting regional enterprise buyers\.?/i);
  if (crawledMatch) {
    const rawBL = crawledMatch[1];
    const translatedBL = rawBL
      .split(/\s*&\s*|\s*,\s*/)
      .map((part) => BUSINESS_LINES_MAP[part.trim()] || part.trim())
      .join(" & ");
    return `实时抓取：与 Lifewood ${translatedBL} 服务高度匹配，可帮助拓展区域企业客户。`;
  }

  if (text.includes("Global AI Data annotation solutions targeting European enterprise")) {
    return "与 Lifewood 全球 AI 数据标注方案高度契合，重点对接欧洲企业 AI 部署决策者。";
  }

  if (text.includes("autonomous vehicle vision data annotation pipelines")) {
    return "Lifewood 自动驾驶视觉数据全流程标注核心合作平台。";
  }

  if (text.includes("Strategic enterprise buyer alignment")) {
    return "契合企业级买家战略需求";
  }

  if (text.includes("High alignment with Lifewood target buyers")) {
    return "与 Lifewood 目标买家群体高度契合";
  }

  return text;
}

/**
 * Translates dynamic audience strings.
 */
function translateDynamicAudience(text: string): string {
  if (!text) return text;
  if (text === "CTOs, AI Engineers, Data Directors") {
    return "CTO、AI 工程师、数据总监";
  }
  if (text === "Enterprise buyers") {
    return "企业级采购决策者";
  }
  if (text === "Enterprise buyers, AI leaders, procurement teams") {
    return "企业买家、AI 技术负责人、战略采购团队";
  }
  if (text.includes("Enterprise CTOs") || text.includes("Data Architects")) {
    return "企业级 CTO、数据架构师、AI 负责人";
  }
  if (text.includes("Automotive OEM") || text.includes("Autonomous Driving Engineers")) {
    return "汽车整车厂软件主管、自动驾驶工程师";
  }
  return text;
}

/**
 * Translates dynamic attendees count strings.
 */
function translateDynamicAttendees(text: string): string {
  if (!text) return text;
  if (text === "Not publicly disclosed" || text === "Not disclosed") {
    return "未公开披露";
  }
  if (text === "10,000+ Attendees") {
    return "10,000+ 参会者";
  }
  if (text.endsWith("+") && !text.includes("人")) {
    return `${text} 人`;
  }
  return text;
}

/**
 * Translates dynamic venue strings.
 * e.g. "Dubai Convention Center" -> "迪拜国际会展中心"
 */
function translateDynamicVenue(venue: string, cityZh?: string): string {
  if (!venue) return venue;
  if (venue.includes("Olympia London")) {
    return "伦敦奥林匹亚展览中心";
  }
  if (venue.includes("Messe Stuttgart")) {
    return "斯图加特展览中心";
  }
  if (venue.includes("Convention Center") && cityZh) {
    return `${cityZh}国际会展中心`;
  }
  return venue;
}

/**
 * Localizes a single event record.
 * Supports both Prisma/API camelCase properties and Crawler snake_case properties!
 */
export function localizeEvent<T extends Record<string, any>>(event: T, locale: Locale): T {
  if (!event || locale !== "zh") return event;

  const eventName = event.eventName || event.event_name || "";
  const known = KNOWN_EVENTS[eventName];

  const city = event.city || "";
  const cityZh = CITIES_MAP[city] || city;
  const country = event.country || "";
  const countryZh = COUNTRIES_MAP[country] || country;
  const region = event.region || "";
  const regionZh = REGIONS_MAP[region] || region;

  // Localize business lines
  const rawBL = event.businessLines || event.business_lines;
  let localizedBL: any = rawBL;
  if (Array.isArray(rawBL)) {
    localizedBL = rawBL.map((b) => BUSINESS_LINES_MAP[b] || b);
  } else if (typeof rawBL === "string") {
    try {
      const parsed = JSON.parse(rawBL);
      if (Array.isArray(parsed)) {
        localizedBL = JSON.stringify(parsed.map((b) => BUSINESS_LINES_MAP[b] || b));
      } else {
        localizedBL = BUSINESS_LINES_MAP[rawBL] || rawBL;
      }
    } catch {
      // Could be comma-separated
      localizedBL = rawBL
        .split(",")
        .map((s) => s.trim())
        .map((s) => BUSINESS_LINES_MAP[s] || s)
        .join(", ");
    }
  }

  // Priority
  const rawPriority = event.priorityLevel || event.priority_level;
  const localizedPriority = rawPriority ? PRIORITIES_MAP[rawPriority] || rawPriority : undefined;

  // Recommendation
  const rawRec = event.participationRec || event.participation_recommendation;
  const localizedRec = rawRec ? RECOMMENDATIONS_MAP[rawRec] || rawRec : undefined;

  // Dates
  const rawDates = event.dates;
  const localizedDates = rawDates ? localizeDateString(rawDates, "zh") : undefined;

  // Relevance
  const rawRelevance = event.relevanceToLifewood || event.relevance_lifewood;
  const localizedRelevance = known?.relevanceZh || (rawRelevance ? translateDynamicRelevance(rawRelevance) : undefined);

  // Audience
  const rawAudience = event.targetAudience || event.target_audience;
  const localizedAudience = known?.audienceZh || (rawAudience ? translateDynamicAudience(rawAudience) : undefined);

  // Attendees
  const rawAttendees = event.estimatedAttendees || event.estimated_attendees;
  const localizedAttendees = known?.attendeesZh || (rawAttendees ? translateDynamicAttendees(rawAttendees) : undefined);

  // Venue & Address
  const rawVenue = event.venue;
  const localizedVenue = known?.venueZh || (rawVenue ? translateDynamicVenue(rawVenue, cityZh) : undefined);
  const rawAddress = event.locationAddress || event.location_address;
  const localizedAddress = known?.addressZh || (rawAddress === "Not publicly disclosed" ? "未公开披露" : rawAddress);

  // Organizer
  const rawOrganizer = event.organizer;
  const localizedOrganizer = known?.organizerZh || (rawOrganizer === "Not disclosed" || rawOrganizer === "Not publicly disclosed" ? "未公开披露" : rawOrganizer);

  // Category
  const rawCategory = event.eventCategory || event.event_category;
  const localizedCategory = known?.categoryZh || rawCategory;

  // Strategic Focus
  const rawFocus = event.strategicFocus || event.strategic_focus;
  const localizedFocus = known?.strategicFocusZh || rawFocus;

  // Key Notes
  const rawNotes = event.keyNotes || event.key_notes;
  const localizedNotes = known?.keyNotesZh || rawNotes;

  // Exhibitor Opportunity & Booth Cost
  const rawOpp = event.exhibitorOpportunity || event.exhibitor_sponsor_opportunity;
  const localizedOpp = known?.exhibitorOppZh || (rawOpp === "Not publicly disclosed" ? "未公开披露" : rawOpp);
  const rawCost = event.boothCost || event.booth_sponsorship_cost;
  const localizedCost = known?.boothCostZh || (rawCost === "Not publicly disclosed" ? "未公开披露" : rawCost);
  const rawReg = event.registrationDeadline || event.registration_deadline;
  const localizedReg = known?.regDeadlineZh || (rawReg ? localizeDateString(rawReg, "zh") : undefined);
  const rawContact = event.contactPerson || event.contact_person;
  const localizedContact = known?.contactPersonZh || (rawContact === "Not publicly disclosed" ? "未公开披露" : rawContact);

  // Duplicate reason
  const rawDupReason = event.duplicate_reason;
  let localizedDupReason = rawDupReason;
  if (rawDupReason) {
    if (rawDupReason.includes("Already recorded") || rawDupReason.includes("Already in system")) {
      localizedDupReason = "该展会已收录在数据库中";
    }
  }

  // Create cloned object with localized overrides
  const result: any = { ...event };

  if (known?.eventNameZh) {
    if ("eventName" in result) result.eventName = known.eventNameZh;
    if ("event_name" in result) result.event_name = known.eventNameZh;
  }

  if (cityZh) result.city = cityZh;
  if (countryZh) result.country = countryZh;
  if (regionZh) result.region = regionZh;

  if (localizedDates) result.dates = localizedDates;
  if (localizedVenue) result.venue = localizedVenue;
  if (localizedAddress) {
    if ("locationAddress" in result) result.locationAddress = localizedAddress;
    if ("location_address" in result) result.location_address = localizedAddress;
  }
  if (localizedOrganizer) result.organizer = localizedOrganizer;
  if (localizedCategory) {
    if ("eventCategory" in result) result.eventCategory = localizedCategory;
    if ("event_category" in result) result.event_category = localizedCategory;
  }
  if (localizedBL) {
    if ("businessLines" in result) result.businessLines = localizedBL;
    if ("business_lines" in result) result.business_lines = localizedBL;
  }
  if (localizedFocus) {
    if ("strategicFocus" in result) result.strategicFocus = localizedFocus;
    if ("strategic_focus" in result) result.strategic_focus = localizedFocus;
  }
  if (localizedRelevance) {
    if ("relevanceToLifewood" in result) result.relevanceToLifewood = localizedRelevance;
    if ("relevance_lifewood" in result) result.relevance_lifewood = localizedRelevance;
  }
  if (localizedAudience) {
    if ("targetAudience" in result) result.targetAudience = localizedAudience;
    if ("target_audience" in result) result.target_audience = localizedAudience;
  }
  if (localizedAttendees) {
    if ("estimatedAttendees" in result) result.estimatedAttendees = localizedAttendees;
    if ("estimated_attendees" in result) result.estimated_attendees = localizedAttendees;
  }
  if (localizedRec) {
    if ("participationRec" in result) result.participationRec = localizedRec;
    if ("participation_recommendation" in result) result.participation_recommendation = localizedRec;
  }
  if (localizedPriority) {
    if ("priorityLevel" in result) result.priorityLevel = localizedPriority;
    if ("priority_level" in result) result.priority_level = localizedPriority;
  }
  if (localizedNotes) {
    if ("keyNotes" in result) result.keyNotes = localizedNotes;
    if ("key_notes" in result) result.key_notes = localizedNotes;
  }
  if (localizedOpp) {
    if ("exhibitorOpportunity" in result) result.exhibitorOpportunity = localizedOpp;
    if ("exhibitor_sponsor_opportunity" in result) result.exhibitor_sponsor_opportunity = localizedOpp;
  }
  if (localizedCost) {
    if ("boothCost" in result) result.boothCost = localizedCost;
    if ("booth_sponsorship_cost" in result) result.booth_sponsorship_cost = localizedCost;
  }
  if (localizedReg) {
    if ("registrationDeadline" in result) result.registrationDeadline = localizedReg;
    if ("registration_deadline" in result) result.registration_deadline = localizedReg;
  }
  if (localizedContact) {
    if ("contactPerson" in result) result.contactPerson = localizedContact;
    if ("contact_person" in result) result.contact_person = localizedContact;
  }
  if (localizedDupReason) {
    result.duplicate_reason = localizedDupReason;
  }

  return result;
}

/**
 * Localizes an array of events.
 */
export function localizeEvents<T extends Record<string, any>>(events: T[], locale: Locale): T[] {
  if (!events || !Array.isArray(events) || locale !== "zh") return events;
  return events.map((e) => localizeEvent(e, locale));
}
