const fs   = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

// ── Module configuration ───────────────────────────────────────────────────
const MODULES = [
  { file: "raBuyer-report.html",     label: "Range Architecture",  color: "#3B82F6", light: "#EFF6FF" },
  { file: "sanityflow2-report.html", label: "OEM Sanity Flow",     color: "#10B981", light: "#ECFDF5" },
  { file: "oemSanity-report.html",   label: "OEM Sanity",          color: "#F59E0B", light: "#FFFBEB" },
  { file: "replen-report.html",      label: "Replenishment",       color: "#8B5CF6", light: "#F5F3FF" },
];

// ── Coverage metadata per module ──────────────────────────────────────────
const COVERAGE_META = {
  "Range Architecture": {
    totalExpected: 11,
    areas: [
      { name: "Replen Column Visibility",     count: 4 },
      { name: "Eye View & Tabs",              count: 3 },
      { name: "Filter Validation",            count: 1 },
      { name: "Download & Upload",            count: 2 },
      { name: "Cluster RA (Hidden)",          count: 1 },
    ],
  },
  "OEM Sanity Flow": {
    totalExpected: 34,
    areas: [
      { name: "Login & Authentication",       count: 2 },
      { name: "Buyer Upload Flow",            count: 6 },
      { name: "Cluster Verification",         count: 5 },
      { name: "Vendor Submission",            count: 7 },
      { name: "Design Approval",              count: 6 },
      { name: "PO & Cost Management",         count: 5 },
      { name: "Sample & Dispatch",            count: 3 },
    ],
  },
  "OEM Sanity": {
    totalExpected: 25,
    areas: [
      { name: "Design Creation Flow",         count: 6 },
      { name: "Cost & HSN Management",        count: 5 },
      { name: "Approval Workflow",            count: 5 },
      { name: "Vendor Collaboration",         count: 5 },
      { name: "Buyer Review",                 count: 4 },
    ],
  },
  "Replenishment": {
    totalExpected: 88,
    areas: [
      { name: "RA Integration",               count: 18 },
      { name: "Navigation",                   count: 3  },
      { name: "File Upload & Status",         count: 10 },
      { name: "Error Handling",               count: 3  },
      { name: "ADD Button",                   count: 2  },
      { name: "Detail View",                  count: 7  },
      { name: "Edit & Delete",                count: 8  },
      { name: "DP Generation",                count: 2  },
      { name: "SAP Design",                   count: 12 },
      { name: "Replenished Tab",              count: 6  },
      { name: "Design Detail – Purchase Tab", count: 6  },
    ],
  },
};

// ── Extract data from each HTML report ────────────────────────────────────
function extractData(htmlFile) {
  const html = fs.readFileSync(path.join("reports", htmlFile), "utf8");
  const m = html.match(/window\.REPORT_DATA\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
  if (!m) throw new Error("Cannot find REPORT_DATA in " + htmlFile);
  return JSON.parse(m[1]);
}

// ── Load all module data ───────────────────────────────────────────────────
const modules = MODULES.map(mod => {
  const data = extractData(mod.file);
  const tests = data.tests || [];
  const passed  = tests.filter(t => t.status === "passed").length;
  const failed  = tests.filter(t => t.status === "failed" || t.status === "broken").length;
  const skipped = tests.filter(t => t.status === "skipped").length;
  return { ...mod, tests, passed, failed, skipped, total: tests.length };
});

// ── Overall combined stats ─────────────────────────────────────────────────
const overall = {
  total:   modules.reduce((s, m) => s + m.total,   0),
  passed:  modules.reduce((s, m) => s + m.passed,  0),
  failed:  modules.reduce((s, m) => s + m.failed,  0),
  skipped: modules.reduce((s, m) => s + m.skipped, 0),
};

const pct = (v, t) => t === 0 ? "0.00%" : ((v / t) * 100).toFixed(2) + "%";

// ── Timestamp ─────────────────────────────────────────────────────────────
const now = new Date();
const generatedAt = now.toLocaleString("en-IN", {
  day: "2-digit", month: "long", year: "numeric",
  hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata",
});

// ── Status badge helper ────────────────────────────────────────────────────
function badge(status) {
  const map = {
    passed:  { bg: "#D1FAE5", color: "#065F46", label: "PASSED"  },
    failed:  { bg: "#FEE2E2", color: "#991B1B", label: "FAILED"  },
    broken:  { bg: "#FEE2E2", color: "#991B1B", label: "FAILED"  },
    skipped: { bg: "#F3F4F6", color: "#6B7280", label: "SKIPPED" },
  };
  const s = map[status] || map.skipped;
  return `<span style="background:${s.bg};color:${s.color};padding:2px 8px;border-radius:9999px;font-size:10px;font-weight:700;letter-spacing:0.05em">${s.label}</span>`;
}

// ── Module test table ──────────────────────────────────────────────────────
function moduleTable(mod) {
  const rows = mod.tests.map((t, i) => `
    <tr style="background:${i % 2 === 0 ? "#FAFAFA" : "#FFFFFF"}">
      <td style="padding:8px 10px;color:#6B7280;font-size:11px;width:36px">${String(i + 1).padStart(2, "0")}</td>
      <td style="padding:8px 10px;font-size:11px;color:#1F2937;line-height:1.4">${t.name}</td>
      <td style="padding:8px 10px;text-align:center;width:90px">${badge(t.status)}</td>
    </tr>`).join("");

  return `
    <table style="width:100%;border-collapse:collapse;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;font-family:inherit">
      <thead>
        <tr style="background:${mod.color}">
          <th style="padding:10px;color:#fff;font-size:11px;text-align:left;width:36px">#</th>
          <th style="padding:10px;color:#fff;font-size:11px;text-align:left">Test Case</th>
          <th style="padding:10px;color:#fff;font-size:11px;text-align:center;width:90px">Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

// ── Read chart.min.js ──────────────────────────────────────────────────────
const chartJs = fs.readFileSync("reports/chart.min.js", "utf8");

// ── Build full HTML ────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>UVP Automation Report</title>
<script>${chartJs}</script>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F8FAFC; color: #1F2937; }

  /* ── Cover page ── */
  .cover {
    background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 60%, #60A5FA 100%);
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; padding: 60px 40px; color: #fff;
    page-break-after: always;
  }
  .cover-logo { font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.7; margin-bottom: 24px; }
  .cover-title { font-size: 38px; font-weight: 800; text-align: center; line-height: 1.2; margin-bottom: 12px; }
  .cover-sub   { font-size: 16px; opacity: 0.8; margin-bottom: 48px; }
  .cover-date  { font-size: 13px; opacity: 0.65; margin-top: 48px; }

  /* Overall stat pills */
  .cover-stats { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; }
  .cstat {
    background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
    border-radius: 16px; padding: 20px 32px; text-align: center; min-width: 120px;
  }
  .cstat-num  { font-size: 36px; font-weight: 800; }
  .cstat-lbl  { font-size: 12px; opacity: 0.75; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.1em; }

  /* Module summary cards row */
  .module-cards { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-top: 48px; }
  .mcard {
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25);
    border-radius: 12px; padding: 16px 24px; min-width: 150px; text-align: center;
  }
  .mcard-name  { font-size: 12px; opacity: 0.75; margin-bottom: 8px; }
  .mcard-num   { font-size: 22px; font-weight: 700; }
  .mcard-sub   { font-size: 11px; opacity: 0.65; margin-top: 4px; }

  /* ── Charts page ── */
  .charts-page {
    padding: 40px; page-break-after: always; background: #fff; min-height: 100vh;
  }
  .page-title { font-size: 22px; font-weight: 700; color: #1E3A8A; margin-bottom: 6px; }
  .page-sub   { font-size: 13px; color: #6B7280; margin-bottom: 32px; }
  .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
  .chart-card {
    background: #F8FAFC; border: 1px solid #E5E7EB; border-radius: 12px;
    padding: 24px; text-align: center;
  }
  .chart-title { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 16px; }

  /* Module summary table on charts page */
  .summary-table { width: 100%; border-collapse: collapse; margin-top: 32px; }
  .summary-table th {
    background: #1E3A8A; color: #fff; padding: 10px 14px;
    font-size: 12px; text-align: left; letter-spacing: 0.04em;
  }
  .summary-table td { padding: 10px 14px; font-size: 12px; border-bottom: 1px solid #E5E7EB; }
  .summary-table tr:nth-child(even) td { background: #F9FAFB; }
  .summary-table tr:last-child td { font-weight: 700; background: #EFF6FF; }

  /* Progress bar */
  .prog-wrap { background: #E5E7EB; border-radius: 9999px; height: 8px; overflow: hidden; }
  .prog-fill  { height: 100%; border-radius: 9999px; }

  /* ── Coverage page ── */
  .coverage-page { padding: 22px 40px; background: #fff; page-break-before: always; }
  .cov-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 0; align-items: start; }
  .cov-card { background: #F8FAFC; border: 1px solid #E5E7EB; border-radius: 10px; padding: 12px 16px; }
  .cov-card-title { font-size: 11px; font-weight: 700; color: #374151; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.06em; }
  .area-row { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
  .area-label { font-size: 10px; color: #374151; width: 160px; flex-shrink: 0; }
  .area-bar-wrap { flex: 1; background: #E5E7EB; border-radius: 9999px; height: 5px; overflow: hidden; }
  .area-bar-fill { height: 100%; border-radius: 9999px; }
  .area-count { font-size: 10px; color: #6B7280; width: 22px; text-align: right; flex-shrink: 0; }
  .cov-summary-table { width: 100%; border-collapse: collapse; }
  .cov-summary-table th { background: #1E3A8A; color: #fff; padding: 6px 10px; font-size: 10px; text-align: left; }
  .cov-summary-table td { padding: 6px 10px; font-size: 10px; border-bottom: 1px solid #E5E7EB; }
  .cov-summary-table tr:nth-child(even) td { background: #F9FAFB; }
  .cov-summary-table tr:last-child td { font-weight: 700; background: #EFF6FF; }
  .cov-badge { padding: 2px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; }

  /* ── Module sections ── */
  .module-section { padding: 40px; background: #fff; min-height: 100vh; page-break-before: always; }
  .mod-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
  .mod-dot    { width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0; }
  .mod-title  { font-size: 20px; font-weight: 700; color: #1F2937; }
  .mod-stats  { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
  .mod-stat {
    background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 10px;
    padding: 14px 20px; min-width: 110px; text-align: center;
  }
  .mod-stat-num { font-size: 28px; font-weight: 800; }
  .mod-stat-lbl { font-size: 11px; color: #6B7280; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.07em; }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>

<!-- ═══════════════════════════════════════════════════════ COVER PAGE -->
<div class="cover">
  <div class="cover-logo">UVP Platform · Quality Engineering</div>
  <div class="cover-title">Sanity Test Report</div>
  <div class="cover-sub">End-to-End Sanity Coverage — All Modules</div>

  <div class="cover-stats">
    <div class="cstat">
      <div class="cstat-num">${overall.total}</div>
      <div class="cstat-lbl">Total</div>
    </div>
    <div class="cstat" style="background:rgba(16,185,129,0.25);border-color:rgba(16,185,129,0.4)">
      <div class="cstat-num" style="color:#6EE7B7">${overall.passed}</div>
      <div class="cstat-lbl">Passed</div>
    </div>
    <div class="cstat" style="background:rgba(239,68,68,0.2);border-color:rgba(239,68,68,0.35)">
      <div class="cstat-num" style="color:#FCA5A5">${overall.failed}</div>
      <div class="cstat-lbl">Failed</div>
    </div>
    <div class="cstat" style="background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.2)">
      <div class="cstat-num" style="color:#D1D5DB">${overall.skipped}</div>
      <div class="cstat-lbl">Skipped</div>
    </div>
    <div class="cstat" style="background:rgba(251,191,36,0.2);border-color:rgba(251,191,36,0.4)">
      <div class="cstat-num" style="color:#FDE68A">${pct(overall.passed, overall.total)}</div>
      <div class="cstat-lbl">Pass Rate</div>
    </div>
  </div>

  <div class="module-cards">
    ${modules.map(m => `
    <div class="mcard">
      <div class="mcard-name">${m.label}</div>
      <div class="mcard-num">${m.total}</div>
      <div class="mcard-sub">${m.passed} passed · ${m.failed} failed</div>
    </div>`).join("")}
  </div>

  <div class="cover-date">Generated on ${generatedAt} IST</div>
</div>

<!-- ═══════════════════════════════════════════════════════ CHARTS PAGE -->
<div class="charts-page">
  <div class="page-title">Executive Summary</div>
  <div class="page-sub">Consolidated test results across all UVP modules</div>

  <div class="charts-grid">
    <!-- Overall donut chart -->
    <div class="chart-card">
      <div class="chart-title">Overall Pass / Fail Distribution</div>
      <canvas id="donutChart" width="280" height="280"></canvas>
    </div>

    <!-- Module comparison bar chart -->
    <div class="chart-card">
      <div class="chart-title">Test Results by Module</div>
      <canvas id="barChart" width="280" height="280"></canvas>
    </div>
  </div>

  <!-- Module summary table -->
  <table class="summary-table" style="margin-top:32px">
    <thead>
      <tr>
        <th>Module</th>
        <th style="text-align:center">Total</th>
        <th style="text-align:center">Passed</th>
        <th style="text-align:center">Failed</th>
        <th style="text-align:center">Skipped</th>
        <th style="text-align:center">Pass Rate</th>
        <th style="min-width:120px">Progress</th>
      </tr>
    </thead>
    <tbody>
      ${modules.map(m => `
      <tr>
        <td>
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${m.color};margin-right:8px;vertical-align:middle"></span>
          <strong>${m.label}</strong>
        </td>
        <td style="text-align:center">${m.total}</td>
        <td style="text-align:center;color:#059669;font-weight:600">${m.passed}</td>
        <td style="text-align:center;color:${m.failed > 0 ? "#DC2626" : "#6B7280"};font-weight:${m.failed > 0 ? "700" : "400"}">${m.failed}</td>
        <td style="text-align:center;color:#6B7280">${m.skipped}</td>
        <td style="text-align:center;font-weight:600;color:${m.failed === 0 ? "#059669" : "#D97706"}">${pct(m.passed, m.total)}</td>
        <td>
          <div class="prog-wrap">
            <div class="prog-fill" style="width:${pct(m.passed, m.total)};background:${m.color}"></div>
          </div>
        </td>
      </tr>`).join("")}
      <tr>
        <td><strong>TOTAL</strong></td>
        <td style="text-align:center"><strong>${overall.total}</strong></td>
        <td style="text-align:center;color:#059669;font-weight:700">${overall.passed}</td>
        <td style="text-align:center;color:${overall.failed > 0 ? "#DC2626" : "#6B7280"};font-weight:700">${overall.failed}</td>
        <td style="text-align:center;color:#6B7280">${overall.skipped}</td>
        <td style="text-align:center;font-weight:700;color:#1E3A8A">${pct(overall.passed, overall.total)}</td>
        <td>
          <div class="prog-wrap">
            <div class="prog-fill" style="width:${pct(overall.passed, overall.total)};background:#1E3A8A"></div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<!-- ═══════════════════════════════════════════════════════ COVERAGE PAGE -->
<div class="coverage-page">
  <div class="page-title">Test Coverage</div>
  <div class="page-sub" style="margin-bottom:14px">Automation coverage breakdown by module and functional area</div>

  <!-- Overall coverage highlight bar -->
  <div style="background:linear-gradient(135deg,#1E3A8A,#3B82F6);border-radius:12px;padding:14px 24px;color:#fff;display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
    <div>
      <div style="font-size:11px;opacity:0.75;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px">Overall Automation Coverage</div>
      <div style="font-size:30px;font-weight:800">${pct(overall.total, modules.reduce((s,m) => s + (COVERAGE_META[m.label]?.totalExpected || m.total), 0))}</div>
      <div style="font-size:11px;opacity:0.7;margin-top:3px">${overall.total} automated out of ${modules.reduce((s,m) => s + (COVERAGE_META[m.label]?.totalExpected || m.total), 0)} total expected test cases</div>
    </div>
    <canvas id="coverageDonut" width="130" height="130"></canvas>
  </div>

  <!-- Per-module coverage summary table -->
  <table class="cov-summary-table" style="margin-bottom:16px">
    <thead>
      <tr>
        <th>Module</th>
        <th style="text-align:center">Automated</th>
        <th style="text-align:center">Total Expected</th>
        <th style="text-align:center">Not Automated</th>
        <th style="text-align:center">Coverage %</th>
        <th>Coverage Bar</th>
        <th style="text-align:center">Status</th>
      </tr>
    </thead>
    <tbody>
      ${modules.map(m => {
        const meta = COVERAGE_META[m.label] || { totalExpected: m.total, areas: [] };
        const notAuto = meta.totalExpected - m.total;
        const covPct  = pct(m.total, meta.totalExpected);
        const isFullCov = notAuto === 0;
        return `
        <tr>
          <td><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${m.color};margin-right:7px;vertical-align:middle"></span><strong>${m.label}</strong></td>
          <td style="text-align:center;color:#059669;font-weight:600">${m.total}</td>
          <td style="text-align:center">${meta.totalExpected}</td>
          <td style="text-align:center;color:${notAuto > 0 ? "#DC2626" : "#6B7280"}">${notAuto}</td>
          <td style="text-align:center;font-weight:700;color:${isFullCov ? "#059669" : "#D97706"}">${covPct}</td>
          <td style="min-width:120px">
            <div class="prog-wrap"><div class="prog-fill" style="width:${covPct};background:${m.color}"></div></div>
          </td>
          <td style="text-align:center">
            <span class="cov-badge" style="background:${isFullCov ? "#D1FAE5" : "#FEF3C7"};color:${isFullCov ? "#065F46" : "#92400E"}">
              ${isFullCov ? "FULL" : "PARTIAL"}
            </span>
          </td>
        </tr>`;
      }).join("")}
      <tr>
        <td><strong>TOTAL</strong></td>
        <td style="text-align:center;color:#059669;font-weight:700">${overall.total}</td>
        <td style="text-align:center;font-weight:700">${modules.reduce((s,m) => s + (COVERAGE_META[m.label]?.totalExpected || m.total), 0)}</td>
        <td style="text-align:center;font-weight:700;color:#DC2626">${modules.reduce((s,m) => s + ((COVERAGE_META[m.label]?.totalExpected || m.total) - m.total), 0)}</td>
        <td style="text-align:center;font-weight:700;color:#1E3A8A">${pct(overall.total, modules.reduce((s,m) => s + (COVERAGE_META[m.label]?.totalExpected || m.total), 0))}</td>
        <td><div class="prog-wrap"><div class="prog-fill" style="width:${pct(overall.total, modules.reduce((s,m) => s + (COVERAGE_META[m.label]?.totalExpected || m.total), 0))};background:#1E3A8A"></div></div></td>
        <td></td>
      </tr>
    </tbody>
  </table>

  <!-- Per-module functional area breakdown (2-column grid) -->
  <div class="cov-grid">
    ${modules.map(m => {
      const meta = COVERAGE_META[m.label] || { totalExpected: m.total, areas: [] };
      const maxCount = Math.max(...meta.areas.map(a => a.count), 1);
      return `
      <div class="cov-card">
        <div class="cov-card-title" style="color:${m.color}">${m.label}</div>
        <div style="font-size:11px;color:#6B7280;margin-bottom:12px">${m.total} automated · ${meta.totalExpected} expected · ${pct(m.total, meta.totalExpected)} coverage</div>
        ${meta.areas.map(a => `
          <div class="area-row">
            <div class="area-label">${a.name}</div>
            <div class="area-bar-wrap">
              <div class="area-bar-fill" style="width:${Math.round((a.count/maxCount)*100)}%;background:${m.color}80"></div>
            </div>
            <div class="area-count">${a.count}</div>
          </div>`).join("")}
      </div>`;
    }).join("")}
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════ MODULE SECTIONS -->
${modules.map(mod => `
<div class="module-section">
  <div class="mod-header">
    <div class="mod-dot" style="background:${mod.color}"></div>
    <div>
      <div class="mod-title">${mod.label}</div>
      <div style="font-size:12px;color:#6B7280;margin-top:2px">${mod.total} test cases</div>
    </div>
  </div>

  <div class="mod-stats">
    <div class="mod-stat">
      <div class="mod-stat-num" style="color:#1E3A8A">${mod.total}</div>
      <div class="mod-stat-lbl">Total</div>
    </div>
    <div class="mod-stat">
      <div class="mod-stat-num" style="color:#059669">${mod.passed}</div>
      <div class="mod-stat-lbl">Passed</div>
    </div>
    <div class="mod-stat">
      <div class="mod-stat-num" style="color:${mod.failed > 0 ? "#DC2626" : "#9CA3AF"}">${mod.failed}</div>
      <div class="mod-stat-lbl">Failed</div>
    </div>
    <div class="mod-stat">
      <div class="mod-stat-num" style="color:#6B7280">${mod.skipped}</div>
      <div class="mod-stat-lbl">Skipped</div>
    </div>
    <div class="mod-stat" style="background:${mod.light};border-color:${mod.color}40">
      <div class="mod-stat-num" style="color:${mod.color}">${pct(mod.passed, mod.total)}</div>
      <div class="mod-stat-lbl">Pass Rate</div>
    </div>
  </div>

  <div style="margin-bottom:16px">
    <div class="prog-wrap" style="height:10px">
      <div class="prog-fill" style="width:${pct(mod.passed, mod.total)};background:${mod.color}"></div>
    </div>
  </div>

  ${moduleTable(mod)}
</div>`).join("")}

<script>
// ── Donut chart – overall ──────────────────────────────────────────────────
new Chart(document.getElementById("donutChart"), {
  type: "doughnut",
  data: {
    labels: ["Passed", "Failed", "Skipped"],
    datasets: [{
      data: [${overall.passed}, ${overall.failed}, ${overall.skipped}],
      backgroundColor: ["#10B981", "#EF4444", "#9CA3AF"],
      borderColor: ["#fff","#fff","#fff"],
      borderWidth: 3,
    }]
  },
  options: {
    responsive: false,
    animation: false,
    plugins: {
      legend: { position: "bottom", labels: { font: { size: 12 }, padding: 16 } }
    },
    cutout: "62%",
  }
});

// ── Coverage donut – automated vs not automated ───────────────────────────
const totalExpected = ${modules.reduce((s,m) => s + (COVERAGE_META[m.label]?.totalExpected || m.total), 0)};
new Chart(document.getElementById("coverageDonut"), {
  type: "doughnut",
  data: {
    labels: ["Automated", "Not Automated"],
    datasets: [{
      data: [${overall.total}, ${modules.reduce((s,m) => s + ((COVERAGE_META[m.label]?.totalExpected || m.total) - m.total), 0)}],
      backgroundColor: ["rgba(255,255,255,0.9)", "rgba(255,255,255,0.25)"],
      borderColor: ["rgba(255,255,255,0.6)", "rgba(255,255,255,0.1)"],
      borderWidth: 2,
    }]
  },
  options: {
    responsive: false, animation: false,
    plugins: { legend: { display: false } },
    cutout: "68%",
  }
});

// ── Bar chart – per module ─────────────────────────────────────────────────
new Chart(document.getElementById("barChart"), {
  type: "bar",
  data: {
    labels: ${JSON.stringify(modules.map(m => m.label))},
    datasets: [
      {
        label: "Passed",
        data: ${JSON.stringify(modules.map(m => m.passed))},
        backgroundColor: "#10B981",
        borderRadius: 4,
      },
      {
        label: "Failed",
        data: ${JSON.stringify(modules.map(m => m.failed))},
        backgroundColor: "#EF4444",
        borderRadius: 4,
      },
      {
        label: "Skipped",
        data: ${JSON.stringify(modules.map(m => m.skipped))},
        backgroundColor: "#9CA3AF",
        borderRadius: 4,
      }
    ]
  },
  options: {
    responsive: false,
    animation: false,
    plugins: {
      legend: { position: "bottom", labels: { font: { size: 12 }, padding: 16 } }
    },
    scales: {
      x: { stacked: false, grid: { display: false }, ticks: { font: { size: 10 } } },
      y: { beginAtZero: true, grid: { color: "#F3F4F6" }, ticks: { font: { size: 10 }, stepSize: 10 } }
    }
  }
});
</script>
</body>
</html>`;

// ── Write HTML ─────────────────────────────────────────────────────────────
fs.writeFileSync("reports/uvp-combined-report.html", html);

// ── Generate PDF via puppeteer ─────────────────────────────────────────────
(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page    = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });
  await page.goto("file://" + path.resolve("reports/uvp-combined-report.html"), {
    waitUntil: "networkidle0",
  });
  // Wait for Chart.js to render
  await new Promise(r => setTimeout(r, 1500));
  await page.pdf({
    path: "reports/uvp-combined-report.pdf",
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  await browser.close();

  console.log("\n✓ Combined report generated:");
  console.log("  → reports/uvp-combined-report.html");
  console.log("  → reports/uvp-combined-report.pdf");
  console.log(`\n  Modules   : ${modules.length}`);
  console.log(`  Total     : ${overall.total}`);
  console.log(`  Passed    : ${overall.passed} (${pct(overall.passed, overall.total)})`);
  console.log(`  Failed    : ${overall.failed}`);
  console.log(`  Skipped   : ${overall.skipped}`);
  modules.forEach(m => {
    console.log(`\n  [${m.label}]`);
    console.log(`    Total ${m.total} | Passed ${m.passed} | Failed ${m.failed} | Skipped ${m.skipped}`);
  });
})();
