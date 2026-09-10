import { Locale } from "../i18n/types";
import { localizeEvent, localizeRegionName } from "../i18n/event-localization";

export function generateBrandedHTMLReport(
  events: any[],
  reportTitle: string,
  region: string,
  locale: Locale = "en"
): string {
  const currentDate =
    locale === "zh"
      ? `${new Date().getFullYear()}年${new Date().getMonth() + 1}月${new Date().getDate()}日`
      : new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });

  const displayRegion = region === "ALL" ? (locale === "zh" ? "全球" : "Global") : localizeRegionName(region, locale);

  const localizedEvents = events.map((e) => (locale === "zh" ? localizeEvent(e, "zh") : e));

  const cardsHTML = localizedEvents
    .map((evt) => {
      let businessLines: string[] = [];
      try {
        businessLines = JSON.parse(evt.businessLines || "[]");
      } catch {
        businessLines = [evt.businessLines];
      }

      const eventNoLabel = locale === "zh" ? `展会 #${evt.eventNumber}` : `Event #${evt.eventNumber}`;
      const locationLabel = locale === "zh" ? "展会地点" : "Location";
      const relevanceLabel = locale === "zh" ? "与 Lifewood 战略相关性" : "Relevance to Lifewood";
      const actionLabel = locale === "zh" ? `参展建议：${evt.participationRec}` : `Action: ${evt.participationRec}`;
      const fitLabel =
        locale === "zh"
          ? `匹配度：${evt.fitScore}/5（${evt.priorityLevel} 优先级）`
          : `Fit Score: ${evt.fitScore}/5 (${evt.priorityLevel} Priority)`;

      return `
      <div style="background:#ffffff; border:1.5px solid #D8D2C8; border-radius:12px; margin-bottom:20px; overflow:hidden; position:relative; box-shadow:0 2px 16px rgba(0,0,0,0.05);">
        <div style="position:absolute; left:0; top:0; bottom:0; width:6px; background:#046241;"></div>
        <div style="padding:20px; padding-left:28px; border-bottom:1px solid #D8D2C8;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-size:12px; font-weight:700; color:#133020;">${eventNoLabel} • ${evt.region}</span>
            <span style="font-size:12px; font-weight:600; color:#046241;">${evt.dates}</span>
          </div>
          <h3 style="font-size:18px; font-weight:700; color:#133020; margin:0 0 10px 0;">${evt.eventName}</h3>
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
            ${businessLines
              .map(
                (bl) =>
                  `<span style="background:#046241; color:#ffffff; font-size:11px; font-weight:600; padding:3px 10px; border-radius:100px;">${bl}</span>`
              )
              .join("")}
          </div>
          <div style="font-size:12px; color:#666666;">
            <strong>${locationLabel}:</strong> ${evt.city}, ${evt.country} (${evt.venue})
          </div>
        </div>
        <div style="padding:15px; padding-left:28px; background:rgba(4,98,65,0.05); font-size:12px; color:#133020;">
          <strong style="color:#046241; display:block; margin-bottom:4px; font-size:10px; text-transform:uppercase; letter-spacing:0.05em;">${relevanceLabel}:</strong>
          ${evt.relevanceToLifewood}
          <div style="margin-top:10px;">
            <span style="background:#046241; color:#ffffff; padding:4px 10px; border-radius:4px; font-weight:700; font-size:11px;">${actionLabel}</span>
            <span style="margin-left:12px; font-weight:700; color:#C17110;">${fitLabel}</span>
          </div>
        </div>
      </div>
      `;
    })
    .join("");

  const subtitle =
    locale === "zh"
      ? "Lifewood 数据科技 — 战略科技展会智能情报报告"
      : "Lifewood Data Technology — Strategic Exhibition Intelligence Report";

  const badgeText =
    locale === "zh"
      ? `区域：${displayRegion} • 生成时间：${currentDate} • 总收录数：${events.length} 场`
      : `Region: ${region} • Generated on ${currentDate} • Total Records: ${events.length}`;

  const footerConfidential =
    locale === "zh"
      ? "机密文件 — 仅供内部与客户演示参考"
      : "Confidential — Internal & Client Use Only";

  return `
<!DOCTYPE html>
<html lang="${locale === "zh" ? "zh-CN" : "en"}">
<head>
  <meta charset="UTF-8">
  <title>${reportTitle}</title>
  <style>
    body { font-family: 'Manrope', -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif; background-color: #F5EEDB; color: #133020; margin: 0; padding: 40px; }
    .header { border-bottom: 2px solid #133020; padding-bottom: 20px; margin-bottom: 30px; }
    .title { font-size: 28px; font-weight: 800; color: #133020; margin: 0; }
    .subtitle { font-size: 14px; color: #666666; margin-top: 6px; }
    .badge { background: #FFB347; color: #133020; font-weight: 700; padding: 4px 12px; border-radius: 100px; font-size: 12px; display: inline-block; margin-top: 10px; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #D8D2C8; font-size: 11px; color: #666666; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="title">${reportTitle}</h1>
    <p class="subtitle">${subtitle}</p>
    <div class="badge">${badgeText}</div>
  </div>

  <div class="content">
    ${cardsHTML}
  </div>

  <div class="footer">
    <span>© 2026 Lifewood Data Technology. All rights reserved.</span>
    <span>${footerConfidential}</span>
  </div>
</body>
</html>
  `;
}
