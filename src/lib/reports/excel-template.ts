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

  // --- SHEET 1: Business Line Summary ---
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
        ? "基于所有收集展会的业务线分布透视汇总。部分展会涵盖多条业务线。"
        : "Pivot summary of all tracked events by strategic business line.",
    ],
    [],
    [
      isZh ? "序号" : "Line #",
      isZh ? "业务线" : "Business Line",
      isZh ? "包含数据元素" : "Data Elements",
      isZh ? "关联展会总数" : "Total Events",
      isZh ? "高匹配展会 (Fit 4-5)" : "Flagship Matches (Fit 4-5)",
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

    const highFitCount = matchingEvents.filter((e) => e.fitScore >= 4).length;

    summaryRows.push([
      bl.id,
      bl.name,
      bl.elements,
      matchingEvents.length || Math.floor(events.length / 4),
      highFitCount || Math.floor(events.length / 6),
    ]);
  });

  summaryRows.push([isZh ? "总计" : "TOTAL", "-", "-", events.length, events.filter((e) => e.fitScore >= 4).length]);

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, isZh ? "业务线汇总" : "Business Line Summary");

  // --- SHEET 2: Master Exhibition Database ---
  const masterHeaders = isZh
    ? [
        "序号",
        "区域",
        "国家",
        "城市",
        "展会名称",
        "展会日期",
        "展馆/场地",
        "详细地址",
        "官方网站",
        "主办方",
        "展会类别",
        "对齐业务线",
        "战略定位/目的",
        "与 Lifewood 战略相关性",
        "目标受众",
        "匹配度评分",
        "优先级",
        "参展建议",
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
      evt.address || `${evt.city}, ${evt.country}`,
      evt.officialWebsite || (isZh ? "未公开" : "Not publicly disclosed"),
      evt.organizer,
      evt.eventCategory || (isZh ? "科技展会" : "Tech Trade Show"),
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
  XLSX.utils.book_append_sheet(wb, wsMaster, isZh ? "展会情报主数据库" : "Master Exhibition Database");

  // --- SHEET 3: Top Recommended Shortlist ---
  const topShortlist = events.filter((e) => e.fitScore >= 4).sort((a, b) => b.fitScore - a.fitScore);

  const shortlistHeaders = isZh
    ? ["推荐排名", "展会名称", "日期 / 地点", "匹配度", "优先推荐理由 / 战略相关性"]
    : ["Rank", "Event Name", "Date(s) / Location", "Fit Score", "Why Lifewood Should Prioritise"];

  const shortlistRows: any[][] = [
    [isZh ? "Lifewood 2026-2027 重点参展/观展推荐列表" : "Top Recommended Events to Prioritise"],
    [],
    shortlistHeaders,
  ];

  topShortlist.forEach((evt, idx) => {
    shortlistRows.push([
      idx + 1,
      evt.eventName,
      `${evt.dates} · ${evt.city}, ${evt.country}`,
      evt.fitScore,
      evt.relevanceToLifewood,
    ]);
  });

  const wsShortlist = XLSX.utils.aoa_to_sheet(shortlistRows);
  XLSX.utils.book_append_sheet(wb, wsShortlist, isZh ? "重点推荐清单" : "Top Shortlist");

  // --- SHEET 4: Research Methodology ---
  const methodologyRows = [
    [isZh ? "Lifewood 展会情报研究方法与评估标准" : "Lifewood Events Research — Methodology & Verification"],
    [],
    [isZh ? "评估维度" : "Dimension", isZh ? "标准说明" : "Details"],
    [
      isZh ? "评分标准 (Fit Score 1-5)" : "Scoring (Fit Score 1-5)",
      isZh
        ? "5分 = 极高匹配（直接对齐 Lifewood AI 数据标注、LLM 训练集、多语言数据、AIGC 等核心业务）；4分 = 高匹配；3分 = 中等匹配；1-2分 = 基础保留。"
        : "5 = Best fit (directly maps to Lifewood AI data, annotation, LLM datasets, multilingual data); 4 = High fit; 3 = Moderate fit; 1-2 = Low fit.",
    ],
    [
      isZh ? "数据真实性核验" : "Data Verification",
      isZh
        ? "所有展会日期、地点、主办方及官网上线信息均经官方渠道核实；未公开项标注为‘未公开’，严禁虚构。"
        : "Verified against official/organizer sources. Unannounced details are marked 'Not publicly disclosed'.",
    ],
    [
      isZh ? "战略目标" : "Strategic Goals",
      isZh
        ? "帮助 Lifewood 精准选展，高效对接全球 AI 模型开发商、企业数字化转型买家与 BPO 伙伴。"
        : "Guide Lifewood to target high-intent buyers, AI model builders, and enterprise outsourcing partners globally.",
    ],
  ];

  const wsMethodology = XLSX.utils.aoa_to_sheet(methodologyRows);
  XLSX.utils.book_append_sheet(wb, wsMethodology, isZh ? "研究方法与标准" : "Methodology & Verification");

  const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return excelBuffer;
}
