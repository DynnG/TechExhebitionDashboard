export function generateBrandedHTMLReport(
  events: any[],
  reportTitle: string,
  region: string
): string {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const cardsHTML = events
    .map((evt) => {
      let businessLines: string[] = [];
      try {
        businessLines = JSON.parse(evt.businessLines || "[]");
      } catch {
        businessLines = [evt.businessLines];
      }

      return `
      <div style="background:#ffffff; border:1.5px solid #D8D2C8; border-radius:12px; margin-bottom:20px; overflow:hidden; position:relative; box-shadow:0 2px 16px rgba(0,0,0,0.05);">
        <div style="position:absolute; left:0; top:0; bottom:0; width:6px; background:#046241;"></div>
        <div style="padding:20px; padding-left:28px; border-bottom:1px solid #D8D2C8;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-size:12px; font-weight:700; color:#133020;">Event #${evt.eventNumber} • ${evt.region}</span>
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
            <strong>Location:</strong> ${evt.city}, ${evt.country} (${evt.venue})
          </div>
        </div>
        <div style="padding:15px; padding-left:28px; background:rgba(4,98,65,0.05); font-size:12px; color:#133020;">
          <strong style="color:#046241; display:block; margin-bottom:4px; font-size:10px; text-transform:uppercase; letter-spacing:0.05em;">Relevance to Lifewood:</strong>
          ${evt.relevanceToLifewood}
          <div style="margin-top:10px;">
            <span style="background:#046241; color:#ffffff; padding:4px 10px; border-radius:4px; font-weight:700; font-size:11px;">Action: ${evt.participationRec}</span>
            <span style="margin-left:12px; font-weight:700; color:#C17110;">Fit Score: ${evt.fitScore}/5 (${evt.priorityLevel} Priority)</span>
          </div>
        </div>
      </div>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${reportTitle}</title>
  <style>
    body { font-family: 'Manrope', system-ui, sans-serif; background-color: #F5EEDB; color: #133020; margin: 0; padding: 40px; }
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
    <p class="subtitle">Lifewood Data Technology — Strategic Exhibition Intelligence Report</p>
    <div class="badge">Region: ${region} • Generated on ${currentDate} • Total Records: ${events.length}</div>
  </div>

  <div class="content">
    ${cardsHTML}
  </div>

  <div class="footer">
    <span>© 2026 Lifewood Data Technology. All rights reserved.</span>
    <span>Confidential — Internal & Client Use Only</span>
  </div>
</body>
</html>
  `;
}
