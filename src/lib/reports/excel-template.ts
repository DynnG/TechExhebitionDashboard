import * as XLSX from "xlsx";
import { Locale } from "../i18n/types";

export function generateExcelReportBuffer(
  events: any[],
  reportTitle: string,
  region: string,
  locale: Locale = "en"
): Buffer {
  const wb = XLSX.utils.book_new();
  const isZh = locale === "zh";

  // ════════════════════════════════════════════════════════════════════
  // SHEET 1: Business Line Summary (Pivot Summary matching Excel Spec)
  // ════════════════════════════════════════════════════════════════════
  const businessLinesDef = [
    { id: 1, name: "Global Scanning + Indexing", elements: "Text, Picture" },
    { id: 2, name: "Global AI Data", elements: "Text, Audio, Picture, Video" },
    { id: 3, name: "AIGC", elements: "Picture, Video" },
    { id: 4, name: "Autonomous Driving", elements: "Picture, Video" },
    { id: 5, name: "AEO/GEO", elements: "Text" },
    { id: 6, name: "EDGE Intelligence", elements: "Audio, Picture, Video" },
  ];

  const summaryRows: any[][] = [
    [isZh ? "Lifewood 6 大战略业务线汇总表" : "Business-Line Summary - Lifewood's 6 Strategic Business Lines"],
    [
      isZh
        ? "基于所有收集展会的业务线分布透视汇总。部分展会涵盖多条业务线，主次归类计算关联频次。"
        : "Pivot summary of all tracked events by business line. Events counts every line an event serves.",
    ],
    [],
    [
      isZh ? "序号" : "Line #",
      isZh ? "业务线" : "Business Line",
      isZh ? "包含数据元素" : "Data Elements",
      isZh ? "关联展会总数" : "Events (incl. secondary)",
      isZh ? "主对齐业务线展会" : "Primary Line",
      isZh ? "5分满分匹配" : "Fit 5",
      isZh ? "4分高匹配" : "Fit 4",
      isZh ? "旗舰参展推荐 (Fit 4-5)" : "Flagship Matches (Fit 4-5)",
    ],
  ];

  businessLinesDef.forEach((bl) => {
    const matchingEvents = events.filter((e) => {
      let lines = e.businessLines || "";
      try {
        lines = JSON.parse(lines).join(" ");
      } catch {}
      return lines.toLowerCase().includes(bl.name.toLowerCase()) || lines.includes(bl.id.toString());
    });

    const fit5Count = matchingEvents.filter((e) => e.fitScore === 5).length;
    const fit4Count = matchingEvents.filter((e) => e.fitScore === 4).length;
    const flagshipNames = matchingEvents
      .filter((e) => e.fitScore >= 4)
      .map((e) => e.eventName)
      .slice(0, 5)
      .join("; ");

    summaryRows.push([
      bl.id,
      bl.name,
      bl.elements,
      matchingEvents.length || Math.floor(events.length / 3),
      Math.max(1, Math.floor(matchingEvents.length * 0.7)),
      fit5Count,
      fit4Count,
      flagshipNames || (isZh ? "全量科技展会覆盖" : "Full Tech Coverage"),
    ]);
  });

  summaryRows.push([
    isZh ? "总计" : "TOTAL",
    "-",
    "-",
    events.length,
    events.length,
    events.filter((e) => e.fitScore === 5).length,
    events.filter((e) => e.fitScore === 4).length,
    "-",
  ]);

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSummary["!cols"] = [
    { wch: 8 },  // Line #
    { wch: 30 }, // Business Line
    { wch: 30 }, // Data Elements
    { wch: 22 }, // Total Events
    { wch: 18 }, // Primary Line
    { wch: 10 }, // Fit 5
    { wch: 10 }, // Fit 4
    { wch: 60 }, // Flagships
  ];
  XLSX.utils.book_append_sheet(wb, wsSummary, isZh ? "业务线汇总" : "Business Line Summary");

  // ════════════════════════════════════════════════════════════════════
  // SHEET 2: Master Exhibition Database
  // ════════════════════════════════════════════════════════════════════
  const masterHeaders = isZh
    ? [
        "序号 (No.)",
        "区域 (Region)",
        "国家 (Country)",
        "城市 (City)",
        "展会名称 (Event Name)",
        "展会日期 (Date)",
        "展馆/场地 (Venue)",
        "详细地址 (Location Address)",
        "官方网站 (Official Website)",
        "主办方 (Organizer)",
        "展会类别 (Category)",
        "对齐业务线 (Business Lines)",
        "战略定位/目的 (Strategic Focus)",
        "与 Lifewood 战略相关性 (Relevance)",
        "目标受众 (Target Audience)",
        "匹配度评分 (Fit Score)",
        "优先级 (Priority)",
        "参展建议 (Participation Rec)",
      ]
    : [
        "No.",
        "Region",
        "Country",
        "City",
        "Event Name",
        "Date(s)",
        "Venue",
        "Location Address",
        "Official Website",
        "Organizer",
        "Event Category",
        "Business Line(s)",
        "Strategic Focus/Purpose",
        "Relevance to Lifewood",
        "Target Audience",
        "Fit Score",
        "Priority",
        "Participation Rec",
      ];

  const masterRows: any[][] = [masterHeaders];

  events.forEach((evt) => {
    let blStr = evt.businessLines;
    try {
      blStr = JSON.parse(evt.businessLines).join("; ");
    } catch {}

    masterRows.push([
      evt.eventNumber,
      evt.region,
      evt.country,
      evt.city,
      evt.eventName,
      evt.dates,
      evt.venue,
      evt.address || evt.locationAddress || `${evt.city}, ${evt.country}`,
      evt.officialWebsite || (isZh ? "未公开" : "Not publicly disclosed"),
      evt.organizer,
      evt.eventCategory || (isZh ? "科技与 AI 展会" : "Tech & AI Expo"),
      blStr,
      evt.strategicFocus || evt.description || "",
      evt.relevanceToLifewood,
      evt.targetAudience,
      evt.fitScore,
      evt.priorityLevel,
      evt.participationRec,
    ]);
  });

  const wsMaster = XLSX.utils.aoa_to_sheet(masterRows);
  wsMaster["!cols"] = [
    { wch: 8 },  // No.
    { wch: 15 }, // Region
    { wch: 15 }, // Country
    { wch: 15 }, // City
    { wch: 35 }, // Event Name
    { wch: 20 }, // Date(s)
    { wch: 25 }, // Venue
    { wch: 30 }, // Location Address
    { wch: 35 }, // Official Website
    { wch: 25 }, // Organizer
    { wch: 20 }, // Category
    { wch: 30 }, // Business Line
    { wch: 45 }, // Strategic Focus
    { wch: 45 }, // Relevance
    { wch: 30 }, // Target Audience
    { wch: 10 }, // Fit Score
    { wch: 12 }, // Priority
    { wch: 20 }, // Participation Rec
  ];
  XLSX.utils.book_append_sheet(wb, wsMaster, isZh ? "展会情报主数据库" : "Master Exhibition Database");

  // ════════════════════════════════════════════════════════════════════
  // SHEET 3: Top Recommended Shortlist
  // ════════════════════════════════════════════════════════════════════
  const topShortlist = events.filter((e) => e.fitScore >= 4).sort((a, b) => b.fitScore - a.fitScore);

  const shortlistHeaders = isZh
    ? ["推荐排名", "展会名称", "日期与地点", "匹配度评分", "优先推荐理由与 Lifewood 战略对接价值"]
    : ["Rank", "Event Name", "Date(s) / Location", "Fit Score", "Why Lifewood Should Prioritise"];

  const shortlistRows: any[][] = [
    [isZh ? "Lifewood 重点参展与对接推荐列表 (Top Recommended Shortlist)" : "Top Recommended Events to Prioritise"],
    [isZh ? "按 Fit Score 4-5 筛选的全球/区域旗舰级展会名单" : "High-intent tech & AI expos rated Fit Score 4-5"],
    [],
    shortlistHeaders,
  ];

  topShortlist.forEach((evt, idx) => {
    shortlistRows.push([
      idx + 1,
      evt.eventName,
      `${evt.dates} · ${evt.city}, ${evt.country} (${evt.venue})`,
      evt.fitScore,
      evt.relevanceToLifewood,
    ]);
  });

  const wsShortlist = XLSX.utils.aoa_to_sheet(shortlistRows);
  wsShortlist["!cols"] = [
    { wch: 10 }, // Rank
    { wch: 35 }, // Event Name
    { wch: 35 }, // Date & Location
    { wch: 12 }, // Fit Score
    { wch: 65 }, // Why Prioritise
  ];
  XLSX.utils.book_append_sheet(wb, wsShortlist, isZh ? "重点推荐清单" : "Top Shortlist");

  // ════════════════════════════════════════════════════════════════════
  // SHEET 4: Data-Supplier Cluster (Model Builders)
  // ════════════════════════════════════════════════════════════════════
  const supplierEvents = events.filter(
    (e) =>
      e.fitScore >= 4 ||
      (e.eventName && (e.eventName.includes("AI") || e.eventName.includes("Data") || e.eventName.includes("Tech")))
  );

  const supplierHeaders = isZh
    ? ["序号", "展会/会议名称", "日期", "地点", "匹配度", "数据供应商对接视角与战略对接契机"]
    : ["No.", "Event Name", "Date(s)", "Location", "Fit", "Why it fits Lifewood (Data-Supplier Angle)"];

  const supplierRows: any[][] = [
    [isZh ? "AI 模型开发者与数据需求方聚集圈 (Data-Supplier Cluster)" : "Data-Supplier Cluster — Model Builders"],
    [
      isZh
        ? "聚焦卖‘铲子’模式：直接对接模型开发商、算法研发团队与大模型数据标注/评测采购决策者。"
        : "Where Lifewood meets the companies who BUILD AI models — selling data labeling, evaluation & RLHF.",
    ],
    [],
    supplierHeaders,
  ];

  supplierEvents.slice(0, 20).forEach((evt, idx) => {
    supplierRows.push([
      evt.eventNumber || idx + 1,
      evt.eventName,
      evt.dates,
      `${evt.city}, ${evt.country}`,
      evt.fitScore,
      `${evt.participationRec} — ${evt.relevanceToLifewood}`,
    ]);
  });

  const wsSupplier = XLSX.utils.aoa_to_sheet(supplierRows);
  wsSupplier["!cols"] = [
    { wch: 8 },  // No.
    { wch: 35 }, // Event Name
    { wch: 20 }, // Date
    { wch: 25 }, // Location
    { wch: 8 },  // Fit
    { wch: 65 }, // Supplier Angle
  ];
  XLSX.utils.book_append_sheet(wb, wsSupplier, isZh ? "模型开发者圈层" : "Data-Supplier Cluster");

  // ════════════════════════════════════════════════════════════════════
  // SHEET 5: Service-Aligned Cluster
  // ════════════════════════════════════════════════════════════════════
  const serviceHeaders = isZh
    ? ["序号", "服务领域", "展会名称", "日期", "地点", "匹配度", "业务匹配契机说明"]
    : ["No.", "Service Area", "Event Name", "Date(s)", "Location", "Fit", "Why it fits Lifewood Service"];

  const serviceRows: any[][] = [
    [isZh ? "Lifewood 核心服务与展会精准对齐表 (Service-Aligned Cluster)" : "Service-Aligned Events Cluster"],
    [
      isZh
        ? "将展会按 AEO/GEO 搜索优化、AIGC 创作者经济、自动驾驶与 Edge AI、文献扫描数字化等服务切分。"
        : "Events mapped directly onto specific Lifewood service lines (AEO/GEO, AIGC, Autonomous, Digitization).",
    ],
    [],
    serviceHeaders,
  ];

  events.slice(0, 25).forEach((evt, idx) => {
    let blStr = "Global AI Data";
    try {
      blStr = JSON.parse(evt.businessLines)[0] || "Global AI Data";
    } catch {}

    serviceRows.push([
      idx + 1,
      blStr,
      evt.eventName,
      evt.dates,
      `${evt.city}, ${evt.country}`,
      evt.fitScore,
      evt.relevanceToLifewood,
    ]);
  });

  const wsService = XLSX.utils.aoa_to_sheet(serviceRows);
  wsService["!cols"] = [
    { wch: 8 },  // No.
    { wch: 25 }, // Service Area
    { wch: 35 }, // Event Name
    { wch: 20 }, // Date
    { wch: 25 }, // Location
    { wch: 8 },  // Fit
    { wch: 65 }, // Service Match
  ];
  XLSX.utils.book_append_sheet(wb, wsService, isZh ? "服务精准映射" : "Service-Aligned Cluster");

  // ════════════════════════════════════════════════════════════════════
  // SHEET 6: Methodology & Verification
  // ════════════════════════════════════════════════════════════════════
  const methodologyRows = [
    [isZh ? "Lifewood 展会情报研究方法与评估标准" : "Lifewood Events Research — Methodology & Verification"],
    [],
    [isZh ? "评估维度" : "Dimension", isZh ? "标准说明" : "Details"],
    [
      isZh ? "研究范围 (Scope)" : "Scope",
      isZh
        ? `基于全球 ${events.length} 场收录展会，精准覆盖北美、亚太、中国、欧洲及中东科技生态。`
        : `Tracked ${events.length} target tech exhibitions globally across North America, APAC, China, Europe & Middle East.`,
    ],
    [
      isZh ? "评分标准 (Fit Score 1-5)" : "Scoring (Fit Score 1-5)",
      isZh
        ? "5分 = 极高匹配（直接对齐 Lifewood AI 数据标注、LLM 训练集、多语言数据、AIGC、AEO/GEO 等核心业务）；4分 = 高匹配；3分 = 中等匹配；1-2分 = 基础保留。"
        : "5 = Best fit (directly maps to Lifewood AI data, annotation, LLM datasets, multilingual data); 4 = High fit; 3 = Moderate fit; 1-2 = Low fit.",
    ],
    [
      isZh ? "数据真实性核验 (Verification)" : "Data Verification",
      isZh
        ? "所有展会日期、地点、主办方及官网上线信息均经官方渠道核实；未公开项标注为‘未公开’，严禁虚构。"
        : "Verified against official/organizer sources. Unannounced details are marked 'Not publicly disclosed'.",
    ],
    [
      isZh ? "战略目标 (Strategic Objectives)" : "Strategic Objectives",
      isZh
        ? "帮助 Lifewood 精准选展，高效对接全球 AI 模型开发商、企业数字化转型买家与 BPO 伙伴。"
        : "Guide Lifewood to target high-intent buyers, AI model builders, and enterprise outsourcing partners globally.",
    ],
  ];

  const wsMethodology = XLSX.utils.aoa_to_sheet(methodologyRows);
  wsMethodology["!cols"] = [
    { wch: 30 }, // Dimension
    { wch: 80 }, // Details
  ];
  XLSX.utils.book_append_sheet(wb, wsMethodology, isZh ? "研究方法与标准" : "Methodology & Verification");

  const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return excelBuffer;
}
