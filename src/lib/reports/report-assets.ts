// Static assets only: database values never enter executable JavaScript or CSS.
export const REPORT_CSS = `
:root{color-scheme:light;--ink:#133020;--green:#046241;--accent:#FFB347;--paper:#F5EEDB;--surface:#F9F7F7;--line:#D8D2C8}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;font-size:14px;line-height:1.65}a{color:var(--green);text-underline-offset:3px;overflow-wrap:anywhere}button,input,select{font:inherit}button{cursor:pointer}button:disabled{opacity:.4;cursor:default}:focus-visible{outline:3px solid var(--green);outline-offset:3px}[hidden]{display:none!important}.wrap{max-width:1440px;margin:auto;padding:40px 32px}.masthead{border-top:5px solid var(--green);border-bottom:1px solid var(--line);padding:30px 0;display:flex;justify-content:space-between;gap:24px}.brand{font-size:30px;font-weight:800;letter-spacing:-1.5px}.brand span{font-size:14px;letter-spacing:3px;margin-left:12px;font-weight:500}.edition{text-align:right;font-size:11px;color:#59665d}.eyebrow{font-size:10px;letter-spacing:.15em;text-transform:uppercase;font-weight:750;color:var(--green);margin:0 0 12px}h1{font-family:Georgia,"Microsoft YaHei",serif;font-weight:400;font-size:clamp(30px,4.4vw,56px);letter-spacing:-.04em;line-height:1.1;max-width:1000px;margin:0 0 20px;overflow-wrap:anywhere}.intro{padding:40px 0 28px}.intro p{max-width:740px;color:#5d665f}.summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border:1px solid var(--line);border-radius:9px;overflow:hidden;background:#fff}.metric{padding:24px;border-right:1px solid var(--line)}.metric:last-child{border:0}.metric strong{font-size:34px;line-height:1.2;letter-spacing:-.05em;display:block;font-weight:650}.metric span{display:block;margin-top:10px;font-size:11px;color:#59665d}.metric:first-child{background:var(--ink);color:#fff}.metric:first-child span{color:#dce6de}.breakdowns{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:24px 0 32px}.breakdown{background:#fff;border:1px solid var(--line);padding:24px;border-radius:9px}.breakdown h2{font-size:15px;margin:0 0 16px}.distribution{list-style:none;padding:0;margin:0;display:grid;gap:9px}.distribution li{display:flex;justify-content:space-between;gap:20px;font-size:12px;border-bottom:1px solid #eeeae2;padding:5px 0;overflow-wrap:anywhere}.small{font-size:11px;color:#647067}.controls{background:#fff;border:1px solid var(--line);border-radius:9px;padding:16px;margin:28px 0;display:flex;gap:16px;align-items:center;flex-wrap:wrap}.switcher{display:flex;gap:4px;background:var(--surface);padding:4px;border-radius:7px}.button,.switcher button{border:1px solid var(--line);border-radius:6px;padding:9px 14px;min-height:40px;background:#fff;color:var(--ink);font-size:12px;font-weight:650}.switcher button{border:0;background:transparent}.switcher button[aria-pressed=true]{background:var(--ink);color:#fff}.search{flex:1;min-width:190px}.search label{display:block;font-size:10px;font-weight:700;margin-bottom:3px}.search input{width:100%;border:1px solid var(--line);border-radius:6px;padding:9px 12px;font-size:13px}.catalogue-heading{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;align-items:center;margin:32px 0 18px}.catalogue-heading h2{font-size:22px;margin:0;letter-spacing:-.03em}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.dossier{min-width:0;background:#fff;border:1px solid var(--line);border-top:3px solid var(--green);border-radius:9px;overflow:hidden;content-visibility:auto;contain-intrinsic-size:auto 700px}.dossier-header{padding:24px;border-bottom:1px solid var(--line)}.dossier h2{font-size:22px;letter-spacing:-.025em;line-height:1.3;margin:12px 0;overflow-wrap:anywhere}.topline{display:flex;justify-content:space-between;gap:12px;align-items:center;font-size:11px}.score{background:var(--accent);border-radius:5px;padding:5px 10px;white-space:nowrap;font-weight:750}.chips{display:flex;flex-wrap:wrap;gap:6px}.chip{background:#edf5ef;border:1px solid #cdded2;color:var(--green);font-size:10px;padding:3px 8px;border-radius:99px;overflow-wrap:anywhere}.dossier-body{padding:0 24px 24px}.dossier section{padding-top:20px}.dossier h3,.dossier summary{font-size:11px;font-weight:750;color:var(--green);margin:0 0 12px;text-transform:uppercase;letter-spacing:.06em}.dossier summary{cursor:pointer;padding:16px 0 0;min-height:40px}.dossier details{border-top:1px solid var(--line);margin-top:18px}.fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 20px;margin:0}.field{min-width:0;break-inside:avoid}.field.wide{grid-column:1/-1}dt{font-size:10px;font-weight:650;color:#647067;margin:0 0 4px}dd{font-size:12px;margin:0;overflow-wrap:anywhere;white-space:pre-wrap}.table-container{border:1px solid var(--line);border-radius:8px;max-height:75vh;overflow:auto;background:white}.data-table{border-collapse:separate;border-spacing:0;width:max-content;min-width:100%;table-layout:fixed}.data-table th,.data-table td{padding:14px;vertical-align:top;text-align:left;border-bottom:1px solid var(--line);border-right:1px solid var(--line);font-size:11px;min-width:200px;width:240px;max-width:360px;overflow-wrap:anywhere;white-space:pre-wrap}.data-table th{position:sticky;top:0;background:var(--ink);color:white;z-index:2;font-size:10px;letter-spacing:.03em}.data-table th:first-child,.data-table td:first-child{min-width:75px;width:75px;position:sticky;left:0;z-index:1;background:var(--surface)}.data-table th:first-child{z-index:3;background:var(--ink)}.data-table tr:nth-child(even) td{background:#faf9f6}.table-caption{padding:12px;text-align:left;font-size:11px;color:#647067;caption-side:bottom}.pagination{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin:24px 0}.pagination select{border:1px solid var(--line);border-radius:6px;padding:8px;background:#fff;font-size:12px}.pagination label{font-size:12px}.empty{text-align:center;padding:64px 24px;background:#fff;border:1px solid var(--line);border-radius:9px;font-size:15px}.footer{border-top:1px solid var(--line);padding-top:24px;margin-top:40px;display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;font-size:10px;color:#5d665f}.print-note{display:none}
@media(max-width:900px){.cards{grid-template-columns:1fr}.summary{grid-template-columns:repeat(2,minmax(0,1fr))}.metric{border-bottom:1px solid var(--line)}.metric:nth-child(2){border-right:0}.breakdowns{grid-template-columns:1fr}}
@media(max-width:520px){.wrap{padding:16px}.masthead{flex-direction:column}.edition{text-align:left}.fields{grid-template-columns:1fr}.metric{padding:18px}.metric strong{font-size:28px}.dossier-header,.dossier-body{padding-left:18px;padding-right:18px}.controls{align-items:stretch}.switcher{width:100%}.switcher button{flex:1}}
@media print{@page{margin:15mm}body{background:#fff;font-size:10pt}.wrap{max-width:none;padding:0}.controls,.pagination,.no-print,.table-container{display:none!important}.print-note{display:block;font-size:9pt}.intro{padding:18px 0}h1{font-size:27pt}.masthead{padding:12px 0}.summary{grid-template-columns:repeat(4,1fr)}.metric{padding:12px}.metric strong{font-size:22pt}.breakdowns{grid-template-columns:1fr 1fr;gap:12px}.breakdown{padding:12px}.cards,.cards[hidden]{display:block!important}.dossier,.dossier[hidden]{display:block!important;content-visibility:visible;margin:0 0 20px;break-inside:avoid;page-break-inside:avoid}.dossier-header{padding:14px}.dossier-body{padding:0 14px 14px}.dossier details:not([open])> :not(summary){display:block!important}.dossier details:not([open])>.fields{display:grid!important}.fields{grid-template-columns:1fr 1fr}h2,h3,summary{break-after:avoid}.field{break-inside:avoid}.empty[hidden]{display:none!important}.footer{font-size:8pt}.summary,.breakdown{break-inside:avoid}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
`;

export const REPORT_SCRIPT = `
(() => {
  'use strict';
  const cards = document.getElementById('cards');
  const table = document.getElementById('table-view');
  const entries = Array.from(cards.querySelectorAll('[data-record]'));
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const search = document.getElementById('search');
  const status = document.getElementById('result-status');
  const pageStatus = document.getElementById('page-status');
  const pageSize = document.getElementById('page-size');
  const previous = document.getElementById('previous');
  const next = document.getElementById('next');
  const buttons = Array.from(document.querySelectorAll('[data-view]'));
  const text = entries.map(entry => entry.textContent.toLocaleLowerCase());
  let view = 'cards';
  let page = 1;
  function update() {
    const query = search.value.trim().toLocaleLowerCase();
    const matches = text.map((value, index) => value.includes(query) ? index : -1).filter(index => index >= 0);
    const size = Number(pageSize.value);
    const pages = Math.max(1, Math.ceil(matches.length / size));
    page = Math.min(page, pages);
    const visible = new Set(matches.slice((page - 1) * size, page * size));
    entries.forEach((entry, index) => { entry.hidden = !visible.has(index); });
    rows.forEach((row, index) => { row.hidden = !visible.has(index); });
    cards.hidden = view !== 'cards' || matches.length === 0;
    table.hidden = view !== 'table' || matches.length === 0;
    document.getElementById('no-results').hidden = matches.length !== 0;
    status.textContent = matches.length + ' / ' + entries.length;
    pageStatus.textContent = page + ' / ' + pages;
    previous.disabled = page <= 1;
    next.disabled = page >= pages;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
  }
  buttons.forEach(button => button.addEventListener('click', () => { view = button.dataset.view; update(); }));
  search.addEventListener('input', () => { page = 1; update(); });
  pageSize.addEventListener('change', () => { page = 1; update(); });
  previous.addEventListener('click', () => { page--; update(); });
  next.addEventListener('click', () => { page++; update(); });
  document.getElementById('print').addEventListener('click', () => window.print());
  let closedDetails = [];
  window.addEventListener('beforeprint', () => {
    closedDetails = Array.from(document.querySelectorAll('details:not([open])'));
    closedDetails.forEach(detail => { detail.open = true; });
  });
  window.addEventListener('afterprint', () => { closedDetails.forEach(detail => { detail.open = false; }); });
  document.querySelectorAll('[data-interactive]').forEach(element => { element.hidden = false; });
  update();
})();
`;
