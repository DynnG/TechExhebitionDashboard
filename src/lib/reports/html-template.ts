import { Locale } from "../i18n/types";
import { localizeEvent, localizeRegionName } from "../i18n/event-localization";

export function generateBrandedHTMLReport(
  events: any[],
  reportTitle: string,
  region: string,
  locale: Locale = "en",
  timeLabel: string = "2026–2027"
): string {
  const isZh = locale === "zh";

  const currentDate = isZh
    ? `${new Date().getFullYear()}年${new Date().getMonth() + 1}月${new Date().getDate()}日`
    : new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  const displayRegion =
    region === "ALL" ? (isZh ? "全球" : "Global") : isZh ? localizeRegionName(region, "zh") : region;

  const localizedEvents = events.map((e) => (isZh ? localizeEvent(e, "zh") : e));

  // Category counts for legend
  const highPriorityCount = localizedEvents.filter((e) => e.priorityLevel === "HIGH" || e.fitScore >= 4).length;

  // Render Table Rows
  const tableRowsHTML = localizedEvents
    .map((evt, idx) => {
      let businessLines: string[] = [];
      try {
        businessLines = JSON.parse(evt.businessLines || "[]");
      } catch {
        businessLines = [evt.businessLines];
      }
      const primaryLOB = businessLines[0] || "Global AI Data";

      const isFeatured = evt.fitScore >= 4 || evt.priorityLevel === "HIGH";
      const rowClass = isFeatured ? 'class="featured"' : "";
      const numStr = String(idx + 1).padStart(2, "0");

      let priDot = "dL";
      let priClass = "pL";
      let priText = isZh ? "低" : "Low";
      if (evt.priorityLevel === "HIGH" || evt.fitScore >= 4) {
        priDot = "dH";
        priClass = "pH";
        priText = isZh ? "高优先级" : "HIGH";
      } else if (evt.priorityLevel === "MEDIUM" || evt.fitScore === 3) {
        priDot = "dM";
        priClass = "pM";
        priText = isZh ? "中优先级" : "Medium";
      }

      const websiteUrl = evt.officialWebsite || "#";
      const websiteDisplay = evt.officialWebsite
        ? evt.officialWebsite.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
        : isZh
        ? "未公开"
        : "Official Site";

      return `
        <tr ${rowClass}>
          <td><span class="td-num">${numStr}</span></td>
          <td>
            <span class="td-name">${evt.eventName}</span>
            ${isFeatured ? `<span class="td-anc">★ Detail Card ${numStr}</span>` : ""}
          </td>
          <td><strong>${evt.dates}</strong></td>
          <td>${evt.city}, ${evt.country}<br><span style="font-size:11px;color:var(--muted);">${evt.venue}</span></td>
          <td>${evt.organizer}</td>
          <td><span class="chip c-ai" style="font-size:10px">${primaryLOB}</span></td>
          <td><span class="b b-free">${evt.participationRec || (isZh ? "推荐参展" : "Recommend")}</span></td>
          <td><a href="${websiteUrl}" class="tl" target="_blank">${websiteDisplay}</a></td>
          <td>${evt.targetAudience ? evt.targetAudience.slice(0, 30) + "..." : "1,000+"}</td>
          <td><span class="pri ${priClass}"><span class="dot ${priDot}"></span> ${priText}</span></td>
        </tr>
      `;
    })
    .join("");

  // Render Full Detail Cards
  const cardsHTML = localizedEvents
    .map((evt, idx) => {
      let businessLines: string[] = [];
      try {
        businessLines = JSON.parse(evt.businessLines || "[]");
      } catch {
        businessLines = [evt.businessLines];
      }

      const numStr = String(idx + 1).padStart(2, "0");

      let priDot = "dL";
      let priClass = "pL";
      let priText = isZh ? "低" : "LOW PRIORITY";
      if (evt.priorityLevel === "HIGH" || evt.fitScore >= 4) {
        priDot = "dH";
        priClass = "pH";
        priText = isZh ? "高优先级 ⭐" : "HIGH PRIORITY ⭐";
      } else if (evt.priorityLevel === "MEDIUM" || evt.fitScore === 3) {
        priDot = "dM";
        priClass = "pM";
        priText = isZh ? "中优先级" : "MEDIUM PRIORITY";
      }

      // Determine categories for filtering
      const categoryTags = [
        "all",
        evt.priorityLevel.toLowerCase(),
        ...businessLines.map((b) => b.toLowerCase().replace(/[^a-z0-9]/g, "")),
      ].join(" ");

      const websiteUrl = evt.officialWebsite || "#";
      const websiteText = evt.officialWebsite ? evt.officialWebsite : isZh ? "未公开" : "Not publicly disclosed";

      return `
      <!-- CARD ${numStr} -->
      <div class="card" id="card${numStr}" data-cat="${categoryTags}">
        <div class="chead">
          <div class="cacc a-ai"></div>
          <div class="ctblock">
            <p class="cnum">Card ${numStr} · ${evt.dates}</p>
            <h2 class="cname">${evt.eventName}</h2>
            <div class="ctags">
              ${businessLines
                .map((bl) => `<span class="chip c-ai">${bl}</span>`)
                .join("")}
              <span class="pp ${priClass}"><span class="dot ${priDot}"></span> ${priText}</span>
            </div>
          </div>
          <div class="cmeta">
            <p class="cdate">${evt.dates}</p>
            <p class="cvenue">${evt.venue}<br>${evt.city}, ${evt.country}</p>
          </div>
        </div>
        <div class="cbody">
          <div class="cell">
            <p class="clbl">${isZh ? "主办方" : "Organizer"}</p>
            <p class="cval"><strong>${evt.organizer}</strong></p>
          </div>
          <div class="cell">
            <p class="clbl">${isZh ? "目标受众与规模" : "Target Audience & Scale"}</p>
            <p class="cval">${evt.targetAudience || (isZh ? "行业决策者、CXO 及专业买家" : "Industry decision-makers, CXOs, and buyers")}</p>
          </div>
          <div class="cell">
            <p class="clbl">${isZh ? "参展建议与模式" : "Participation Recommendation"}</p>
            <p class="cval"><span class="b b-free">${evt.participationRec}</span><br>${isZh ? "匹配度评分" : "Fit Score"}: <strong>${evt.fitScore} / 5</strong></p>
          </div>
          <div class="cell">
            <p class="clbl">${isZh ? "官方网站与报名" : "Official Website & Registration"}</p>
            <p class="cval"><a href="${websiteUrl}" class="tl" target="_blank">${websiteText}</a></p>
          </div>
          <div class="cell">
            <p class="clbl">${isZh ? "展会战略定位与描述" : "Description & Strategic Focus"}</p>
            <p class="cval">${evt.description || evt.relevanceToLifewood}</p>
          </div>
          <div class="cell">
            <p class="clbl">${isZh ? "展会地点与详细地址" : "Venue & Location Address"}</p>
            <p class="cval">${evt.address || `${evt.venue}, ${evt.city}, ${evt.country}`}</p>
          </div>
        </div>
        <div class="cangle">
          <div class="al">
            <p class="albl">${isZh ? "Lifewood 参展/对接策略" : "Lifewood's Participation Angle"}</p>
            <p class="atxt">${evt.participationRec} — ${isZh ? "对接 AI 训练数据需求方、多语言标注买家与企业数字化转型决策者。" : "Connect with AI training data clients, multilingual annotation buyers, and enterprise digital decision-makers."}</p>
          </div>
          <div class="ar">
            <p class="albl">${isZh ? "战略机遇与相关性" : "Strategic Opportunity"}</p>
            <p class="atxt">${evt.relevanceToLifewood}</p>
          </div>
        </div>
      </div>
      `;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="${isZh ? "zh-CN" : "en"}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lifewood — ${reportTitle}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet">
<style>
  :root {
    --ink: #0d0d0d;
    --bone: #f5f2ec;
    --cream: #fffef9;
    --forest: #133020;
    --sage: #046241;
    --moss: #52b788;
    --gold-lt: #ffb347;
    --muted: #6b6b6b;
    --border: #d8d2c8;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: var(--bone); color: var(--ink); line-height: 1.6; }

  /* HEADER */
  header { background: var(--forest); padding: 48px 56px 40px; position: relative; overflow: hidden; color: #fff; }
  header::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 80% 120% at 90% 50%, rgba(255,179,71,.18) 0%, transparent 70%); pointer-events:none; }
  .eyebrow { font-weight:600; font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:var(--gold-lt); margin-bottom:12px; }
  header h1 { font-family:'DM Serif Display',serif; font-size:clamp(28px,4vw,46px); color:var(--bone); line-height:1.15; max-width:720px; margin-bottom:14px; }
  header h1 em { color:var(--gold-lt); font-style:italic; }
  .h-sub { color:rgba(245,242,236,.75); font-size:14px; font-weight:300; max-width:640px; line-height:1.7; }
  .h-meta { display:flex; gap:14px; margin-top:28px; flex-wrap:wrap; }
  .mpill { background:rgba(255,255,255,.09); border:1px solid rgba(255,255,255,.15); border-radius:100px; padding:7px 18px; font-size:12.5px; color:rgba(245,242,236,.9); }
  .mpill strong { color:var(--gold-lt); font-weight:600; }

  /* LEGEND */
  .legend { background:var(--cream); border-bottom:1.5px solid var(--border); padding:15px 56px; display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .leg-lbl { font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-right:4px; }
  .chip { display:inline-flex; align-items:center; gap:4px; padding:4px 11px; border-radius:100px; font-size:11px; font-weight:500; color:#fff; white-space:nowrap; }
  .c-ai  { background:#133020; }
  .c-bpo { background:#046241; }
  .c-fin { background:#8b5cf6; }
  .c-ins { background:#c17110; }
  .c-gov { background:#2563eb; }

  /* SECTION WRAPPERS */
  .sw { padding:40px 56px 0; }
  .sec-head { display:flex; align-items:baseline; gap:14px; margin-bottom:6px; }
  .sec-title { font-family:'DM Serif Display',serif; font-size:24px; color:var(--forest); }
  .sec-sub { font-size:13px; color:var(--muted); font-weight:300; }
  .sec-rule { border:none; border-top:2px solid var(--forest); margin-bottom:20px; }

  /* TABLE */
  .tscroll { overflow-x:auto; border-radius:10px; border:1.5px solid var(--border); box-shadow:0 2px 16px rgba(0,0,0,.05); margin-bottom:10px; }
  table { width:100%; border-collapse:collapse; font-size:12.5px; background:var(--cream); min-width:1100px; }
  thead tr { background:var(--forest); color:#fff; }
  thead th { padding:13px 13px; text-align:left; font-weight:600; font-size:10.5px; letter-spacing:.08em; text-transform:uppercase; white-space:nowrap; }
  tbody tr { border-bottom:1px solid var(--border); transition:background .12s; }
  tbody tr:last-child { border-bottom:none; }
  tbody tr:hover { background:#f0f5f2; }
  td { padding:12px 13px; vertical-align:top; line-height:1.55; }
  .td-num { font-size:11px; font-weight:700; color:var(--sage); }
  .td-name { font-weight:600; color:var(--forest); min-width:200px; }
  .td-anc { font-size:10px; color:var(--sage); font-weight:600; display:block; margin-top:2px; }
  .featured { background:#f0f8f4 !important; }

  /* BADGES */
  .b { display:inline-block; padding:3px 10px; border-radius:4px; font-size:10.5px; font-weight:600; white-space:nowrap; }
  .b-free  { background:#d1fae5; color:#065f46; }
  .b-paid  { background:#fee2e2; color:#991b1b; }

  /* PRIORITY */
  .pri { display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:600; white-space:nowrap; }
  .dot { width:7px; height:7px; border-radius:50%; display:inline-block; flex-shrink:0; }
  .dH { background:#b91c1c; } .pH { color:#b91c1c; }
  .dM { background:#b45309; } .pM { color:#b45309; }
  .dL { background:#6b7280; } .pL { color:#6b7280; }

  .tbl-note { font-size:11px; color:var(--muted); padding:8px 4px 32px; font-style:italic; }
  .tbl-note strong { color:var(--forest); font-style:normal; }
  a.tl { color:var(--sage); font-weight:500; text-decoration:none; font-size:11.5px; }
  a.tl:hover { text-decoration:underline; }

  /* FILTER BAR */
  .fbar { background:var(--bone); padding:16px 56px; display:flex; gap:8px; flex-wrap:wrap; border-bottom:1.5px solid var(--border); }
  .fb { padding:8px 18px; border-radius:100px; border:1.5px solid var(--border); background:transparent; font-family:'DM Sans',sans-serif; font-size:12.5px; font-weight:600; cursor:pointer; color:var(--muted); transition:all .18s; }
  .fb:hover, .fb.active { background:var(--forest); border-color:var(--forest); color:#fff; }

  /* CARDS HEADING */
  .ctrow { padding:24px 56px 0; }
  .ctitle { font-family:'DM Serif Display',serif; font-size:24px; color:var(--forest); }
  .crule { border:none; border-top:2px solid var(--forest); margin:8px 56px 20px; }

  /* CARDS */
  main { padding:0 56px 60px; }
  .card { background:var(--cream); border:1.5px solid var(--border); border-radius:12px; overflow:hidden; margin-bottom:24px; transition:box-shadow .2s,transform .2s; }
  .card:hover { box-shadow:0 6px 30px rgba(0,0,0,.08); }
  .card.hidden { display:none !important; }

  .chead { display:grid; grid-template-columns:6px 1fr auto; align-items:start; padding:22px 24px 20px 0; border-bottom:1.5px solid var(--border); background:#fafaf7; }
  .cacc { width:6px; align-self:stretch; background:var(--sage); }

  .ctblock { padding:0 0 0 18px; }
  .cnum { font-size:11px; font-weight:700; letter-spacing:.15em; color:var(--sage); text-transform:uppercase; margin-bottom:4px; }
  .cname { font-family:'DM Serif Display',serif; font-size:20px; color:var(--ink); line-height:1.3; margin-bottom:8px; }
  .ctags { display:flex; gap:6px; flex-wrap:wrap; }
  .cmeta { padding:4px 20px; text-align:right; min-width:180px; }
  .cdate { font-size:13px; font-weight:700; color:var(--forest); white-space:nowrap; }
  .cvenue { font-size:11.5px; color:var(--muted); margin-top:3px; line-height:1.5; }

  .cbody { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); }
  .cell { padding:16px 20px; border-right:1.5px solid var(--border); border-bottom:1.5px solid var(--border); }
  .cell:last-child { border-right:none; }
  .clbl { font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); margin-bottom:5px; }
  .cval { font-size:13px; line-height:1.6; }
  .cval strong { font-weight:600; color:var(--forest); }

  .cangle { display:grid; grid-template-columns:1fr 1fr; border-top:2px solid var(--forest); background:#f0f5f2; }
  .al { padding:16px 20px; border-right:1.5px solid #c5d9ce; }
  .ar { padding:16px 20px; }
  .albl { font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--sage); margin-bottom:5px; }
  .atxt { font-size:12.5px; line-height:1.65; color:#133020; }

  .pp { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:700; }

  footer { background:var(--forest); color:rgba(245,242,236,.65); font-size:11.5px; text-align:center; padding:24px; line-height:1.7; }
  footer strong { color:var(--gold-lt); }

  @media(max-width:768px){
    header,.legend,.fbar,.sw,.ctrow,main{padding-left:20px;padding-right:20px;}
    .chead{grid-template-columns:6px 1fr;}
    .cmeta{grid-column:1/-1;padding:0 20px 12px 24px;text-align:left;}
    .cangle{grid-template-columns:1fr;}
    .al{border-right:none;border-bottom:1.5px solid #c5d9ce;}
    .crule{margin-left:20px;margin-right:20px;}
  }
</style>
</head>
<body>

<header>
  <p class="eyebrow">${isZh ? "战略科技展会情报报告" : "Strategic Intelligence Report"} · ${currentDate}</p>
  <h1>${displayRegion} ${isZh ? "科技展会" : "Tech Exhibitions"}<br><em>${isZh ? "Lifewood 战略参展与数据对接指南" : "Where Lifewood Should Be"}</em></h1>
  <p class="h-sub">${
    isZh
      ? "基于 Lifewood Data Technology 6 大核心业务线精准映射的全球/区域科技展会深度情报。提供完整展会清单与高价值展会参展策略卡片。"
      : "A curated, research-backed directory of AI, technology, finance, and investment exhibitions — mapped to Lifewood Data Technology's lines of business."
  }</p>
  <div class="h-meta">
    <span class="mpill">📅 ${isZh ? "时间范围" : "Time Range"}: <strong>${timeLabel}</strong></span>
    <span class="mpill">📍 ${isZh ? "目标区域" : "Region"}: <strong>${displayRegion}</strong></span>
    <span class="mpill">🗂️ ${isZh ? "展会总数" : "Total Events Tracked"}: <strong>${localizedEvents.length}</strong></span>
    <span class="mpill">⭐ ${isZh ? "高优先展会" : "High Fit Events"}: <strong>${highPriorityCount}</strong></span>
  </div>
</header>

<div class="legend">
  <span class="leg-lbl">${isZh ? "Lifewood 业务线" : "LOB Categories"}:</span>
  <span class="chip c-ai">● Global AI Data</span>
  <span class="chip c-bpo">● BPO & Tech Outsourcing</span>
  <span class="chip c-fin">● AIGC & Creative AI</span>
  <span class="chip c-ins">● Autonomous Driving & Edge</span>
  <span class="chip c-gov">● AEO / GEO Search</span>
</div>

<!-- ══════════════════════════════════════
     SUMMARY TABLE
══════════════════════════════════════ -->
<div class="sw">
  <div class="sec-head">
    <h2 class="sec-title">${isZh ? "全量展会清单汇总表" : "Complete Exhibition Directory"}</h2>
    <span class="sec-sub">${isZh ? `共 ${localizedEvents.length} 场展会 — 标注 ★ 带有下方详细深度情报卡片` : `All ${localizedEvents.length} events at a glance — highlighted rows have detail cards below`}</span>
  </div>
  <hr class="sec-rule">

  <div class="tscroll">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>${isZh ? "展会名称" : "Exhibition / Event Name"}</th>
          <th>${isZh ? "日期" : "Date"}</th>
          <th>${isZh ? "城市 / 场地" : "Venue / Location"}</th>
          <th>${isZh ? "主办方" : "Organizer"}</th>
          <th>${isZh ? "核心业务线" : "LOB Category"}</th>
          <th>${isZh ? "参展建议" : "Participation Rec"}</th>
          <th>${isZh ? "官方网站" : "Registration Link"}</th>
          <th>${isZh ? "受众与规模" : "Target Audience"}</th>
          <th>${isZh ? "优先级" : "Priority"}</th>
        </tr>
      </thead>
      <tbody>
        ${tableRowsHTML}
      </tbody>
    </table>
  </div>
  <p class="tbl-note">
    <strong>★ ${isZh ? "高亮行" : "Highlighted rows"}</strong> ${isZh ? "均包含下方的全量深度参展策略与战略机遇卡片。" : "are covered in full detail cards below with participation angles and strategic opportunities."}
  </p>
</div>

<!-- ─── FILTER BAR ─── -->
<div class="fbar">
  <button class="fb active" onclick="fc('all',this)">${isZh ? "全部展会卡片" : "All Detail Cards"}</button>
  <button class="fb" onclick="fc('high',this)">${isZh ? "⭐ 高优先级展会" : "⭐ High Priority"}</button>
  <button class="fb" onclick="fc('ai',this)">Global AI Data</button>
  <button class="fb" onclick="fc('bpo',this)">BPO / Tech</button>
  <button class="fb" onclick="fc('aigc',this)">AIGC</button>
  <button class="fb" onclick="fc('edge',this)">Autonomous & Edge</button>
</div>

<div class="ctrow"><h2 class="ctitle">${isZh ? "展会深度参展策略卡片" : "Full Strategic Exhibition Detail Cards"}</h2></div>
<hr class="crule">

<main id="cards">
  ${cardsHTML}
</main>

<footer>
  <p>© 2026 <strong>Lifewood Data Technology</strong>. ${isZh ? "版权所有 · 展会智能情报报告" : "All rights reserved. Strategic Intelligence Report"}</p>
  <p style="margin-top:4px;font-size:10.5px;">${isZh ? "机密文件 — 仅供内部决策与客户高管汇报展示" : "Confidential — Internal & Executive Client Presentation Only"}</p>
</footer>

<script>
  function fc(cat, btn) {
    document.querySelectorAll('.fb').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cards = document.querySelectorAll('.card');
    cards.forEach(c => {
      if (cat === 'all') {
        c.classList.remove('hidden');
      } else {
        const tags = (c.getAttribute('data-cat') || '').toLowerCase();
        if (tags.includes(cat.toLowerCase())) {
          c.classList.remove('hidden');
        } else {
          c.classList.add('hidden');
        }
      }
    });
  }
</script>

</body>
</html>`;
}
