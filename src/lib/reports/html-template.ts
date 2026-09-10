import { DOSSIER_FIELDS, DOSSIER_GROUPS, displayDate, dossierValues, parseStringList, safeDossierLink, type DossierEvent, type DossierKey, type Locale } from "../events/dossier";
import { REPORT_CSS, REPORT_SCRIPT } from "./report-assets";

export function escapeHTML(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

function fieldHTML(event: DossierEvent, key: DossierKey, locale: Locale): string {
  return dossierValues(event, key, locale).map(value => {
    const href = ["officialWebsite", "sourceLinks", "socialMedia", "contactEmail"].includes(key) ? safeDossierLink(value, key === "contactEmail") : null;
    return href ? '<a href="' + escapeHTML(href) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(value) + "</a>" : escapeHTML(value);
  }).join("<br>");
}

export function generateDossierCSV(events: DossierEvent[], locale: Locale = "en"): string {
  // Quote every cell, preserve line breaks, and neutralize spreadsheet formula prefixes.
  const cell = (value: string) => '"' + (/^[\s]*[=+\-@\t\r]/.test(value) ? "'" + value : value).replace(/"/g, '""') + '"';
  return "\uFEFF" + [
    DOSSIER_FIELDS.map(field => cell(field[locale])).join(","),
    ...events.map(event => DOSSIER_FIELDS.map(field => cell(dossierValues(event, field.key, locale).join("; "))).join(",")),
  ].join("\r\n");
}

export function generateBrandedHTMLReport(events: DossierEvent[], reportTitle: string, region: string, locale: Locale = "en"): string {
  const t = (en: string, zh: string) => locale === "en" ? en : zh;
  const safeTitle = escapeHTML(reportTitle);
  const validScores = events.map(event => event.fitScore).filter(score => Number.isFinite(score));
  const average = validScores.length ? (validScores.reduce((sum, value) => sum + value, 0) / validScores.length).toFixed(1) : "—";
  const regions = new Set(events.map(event => event.region.trim()).filter(Boolean));
  const highPriority = events.filter(event => event.priorityLevel.toLowerCase() === "high").length;
  const distribution = (values: string[]) => {
    const counts = new Map<string, number>();
    values.filter(value => !!value.trim()).forEach(value => counts.set(value, (counts.get(value) || 0) + 1));
    return Array.from(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name, count]) => "<li><span>" + escapeHTML(name) + "</span><strong>" + count + "</strong></li>").join("");
  };
  const starts = events.map(event => event.startDate ? new Date(event.startDate).getTime() : NaN).filter(Number.isFinite);
  const dateRange = starts.length ? displayDate(new Date(Math.min(...starts)), locale) + " – " + displayDate(new Date(Math.max(...starts)), locale) : t("No structured start dates available", "暂无结构化开始日期");
  const cards = events.map((event, index) => {
    const groups = DOSSIER_GROUPS.map(group => {
      const fields = DOSSIER_FIELDS.filter(field => field.group === group.key).map(field => {
        const wide = ["strategicFocus", "relevanceToLifewood", "keyNotes", "sourceLinks"].includes(field.key);
        return '<div class="field' + (wide ? " wide" : "") + '" data-field="' + field.key + '"><dt>' + escapeHTML(field[locale]) + "</dt><dd>" + fieldHTML(event, field.key, locale) + "</dd></div>";
      }).join("");
      const details = group.key === "commercial" || group.key === "provenance";
      return details ? "<details><summary>" + escapeHTML(group[locale]) + '</summary><dl class="fields">' + fields + "</dl></details>" : "<section><h3>" + escapeHTML(group[locale]) + '</h3><dl class="fields">' + fields + "</dl></section>";
    }).join("");
    return '<article class="dossier" data-record="' + index + '"><header class="dossier-header"><div class="topline"><span>#' + escapeHTML(event.eventNumber) + " · " + escapeHTML(event.region) + '</span><span class="score">' + t("Fit", "匹配") + " " + escapeHTML(event.fitScore) + ' / 5</span></div><h2>' + escapeHTML(event.eventName || t("Untitled exhibition", "未命名展会")) + '</h2><div class="chips">' + dossierValues(event, "businessLines", locale).map(line => '<span class="chip">' + escapeHTML(line) + "</span>").join("") + '</div></header><div class="dossier-body">' + groups + "</div></article>";
  }).join("");
  const rows = events.map(event => "<tr>" + DOSSIER_FIELDS.map(field => '<td data-field="' + field.key + '">' + fieldHTML(event, field.key, locale) + "</td>").join("") + "</tr>").join("");
  const generated = displayDate(new Date(), locale);
  return '<!DOCTYPE html><html lang="' + locale + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\'; style-src \'unsafe-inline\'; base-uri \'none\'; form-action \'none\'"><title>' + safeTitle + "</title><style>" + REPORT_CSS + '</style></head><body><main class="wrap">' +
    '<header class="masthead"><div class="brand">lifewood<span>活树</span></div><div class="edition">' + t("EXHIBITION INTELLIGENCE", "展会情报") + "<br>" + t("Prepared", "生成日期") + " · " + escapeHTML(generated) + '</div></header>' +
    '<section class="intro"><p class="eyebrow">' + t("Executive briefing / Published records", "执行简报 / 已发布记录") + "</p><h1>" + safeTitle + "</h1><p>" + t("An evidence-led view of the exhibition landscape. Every dossier below includes the complete 27-field record, with its strategic assessment, commercial details, and recorded sources.", "以证据为基础的展会情报概览。每份档案包含全部 27 个字段，涵盖战略评估、商务详情和记录来源。") + '</p><p class="small">' + t("Scope", "范围") + ": " + escapeHTML(region === "ALL" ? t("All regions", "所有地区") : region) + " · " + t("Start-date coverage", "开始日期范围") + ": " + escapeHTML(dateRange) + "</p></section>" +
    '<section class="summary" aria-label="' + t("Report summary", "报告摘要") + '">' + [[events.length, t("Published exhibitions", "已发布展会")], [regions.size, t("Regions represented", "覆盖地区")], [average, t("Average fit score / 5", "平均匹配评分 / 5")], [highPriority, t("High-priority exhibitions", "高优先级展会")]].map(([value, label]) => '<div class="metric"><strong>' + escapeHTML(value) + "</strong><span>" + escapeHTML(label) + "</span></div>").join("") + "</section>" +
    '<div class="breakdowns"><section class="breakdown"><h2>' + t("Regional coverage", "地区覆盖") + '</h2><ul class="distribution">' + (distribution(events.map(event => event.region)) || "<li>—</li>") + '</ul></section><section class="breakdown"><h2>' + t("Business-line alignment", "业务线分布") + '</h2><ul class="distribution">' + (distribution(events.flatMap(event => Array.from(new Set(parseStringList(event.businessLines))))) || "<li>—</li>") + '</ul><p class="small">' + t("An exhibition can align with more than one business line.", "一场展会可能对应多条业务线。") + "</p></section></div>" +
    '<div class="catalogue-heading"><h2>' + t("The exhibition dossiers", "展会完整档案") + '</h2><span class="small">' + events.length + " " + t("records · 27 fields per dossier", "条记录 · 每份档案 27 个字段") + '</span></div><div class="controls" data-interactive hidden><div class="switcher" role="group" aria-label="' + t("Report view", "报告视图") + '"><button type="button" data-view="cards" aria-pressed="true" aria-controls="cards">' + t("Card View", "卡片视图") + '</button><button type="button" data-view="table" aria-pressed="false" aria-controls="table-view">' + t("Table View", "表格视图") + '</button></div><div class="search"><label for="search">' + t("Search all dossier fields", "搜索全部档案字段") + '</label><input id="search" type="search" autocomplete="off"></div><button class="button" id="print" type="button">' + t("Print complete report", "打印完整报告") + '</button></div><p class="small no-print" data-interactive hidden>' + t("Matching records", "匹配记录") + ': <span id="result-status" role="status" aria-live="polite"></span> · ' + t("Printing includes every record in dossier format, regardless of the current view or search.", "打印将包含全部记录的档案格式，不受当前视图或搜索限制。") + '</p><p class="print-note">' + t("Complete report · all 27 fields for every exhibition", "完整报告 · 每场展会的全部 27 个字段") + "</p>" +
    '<div id="cards" class="cards">' + cards + '</div><div id="table-view" class="table-container" tabindex="0" role="region" aria-label="' + t("Complete dossier table, scroll horizontally", "完整档案表格，可水平滚动") + '" hidden><table class="data-table"><caption class="table-caption">' + t("All 27 dossier fields. Scroll horizontally to inspect each column.", "全部 27 个档案字段。水平滚动可查看各列。") + "</caption><thead><tr>" + DOSSIER_FIELDS.map(field => '<th scope="col">' + escapeHTML(field[locale]) + "</th>").join("") + "</tr></thead><tbody>" + rows + "</tbody></table></div>" +
    '<p id="no-results" class="empty"' + (events.length ? " hidden" : "") + ">" + t("No exhibitions match this view.", "此视图暂无匹配展会。") + '</p><nav class="pagination no-print" data-interactive hidden aria-label="' + t("Report pagination", "报告分页") + '"><label for="page-size">' + t("Records per page", "每页记录数") + ' <select id="page-size"><option>12</option><option>25</option><option>50</option><option>100</option></select></label><div><button class="button" id="previous" type="button">' + t("Previous", "上一页") + '</button> <span class="small" id="page-status" aria-live="polite"></span> <button class="button" id="next" type="button">' + t("Next", "下一页") + '</button></div></nav><footer class="footer"><span>Lifewood Data Technology · ' + t("Strategic Intelligence", "战略情报") + "</span><span>" + t("Standalone snapshot · Source content has not been translated", "独立快照 · 来源内容保留原文") + "</span></footer></main><script>" + REPORT_SCRIPT + "</script></body></html>";
}
