#!/usr/bin/env node
/*
 * Cypress UVP Test Dashboard — prototype generator.
 *
 * Scans cypress/e2e/*.cy.js (spec inventory) and allure-results/*.json
 * (latest run results), then emits a single self-contained dashboard/index.html.
 *
 *   node dashboard/build.js
 */

const fs   = require("fs");
const path = require("path");

const ROOT          = path.resolve(__dirname, "..");
const SPECS_DIR     = path.join(ROOT, "cypress", "e2e");
const RESULTS_DIR   = path.join(ROOT, "allure-results");
const OUTPUT_HTML   = path.join(__dirname, "index.html");

// --------------------------------------------------------------------------
// 1. Spec inventory — parse describe/it titles out of each .cy.js file.
// --------------------------------------------------------------------------
function listSpecs() {
  if (!fs.existsSync(SPECS_DIR)) return [];
  return fs.readdirSync(SPECS_DIR)
    .filter(f => f.endsWith(".cy.js"))
    .map(name => {
      const full = path.join(SPECS_DIR, name);
      const src  = fs.readFileSync(full, "utf8");
      const stat = fs.statSync(full);
      return {
        file:        name,
        path:        path.relative(ROOT, full),
        sizeKb:      +(stat.size / 1024).toFixed(1),
        modified:    stat.mtime.toISOString(),
        describes:   extractTitles(src, /describe\s*\(\s*['"`]([^'"`]+)['"`]/g),
        its:         extractTitles(src, /\bit\s*\(\s*['"`]([^'"`]+)['"`]/g),
      };
    })
    .sort((a, b) => a.file.localeCompare(b.file));
}

function extractTitles(src, regex) {
  const out = [];
  let m;
  while ((m = regex.exec(src)) !== null) out.push(m[1]);
  return out;
}

// --------------------------------------------------------------------------
// 2. Allure run results — parse *-result.json (one per test).
// --------------------------------------------------------------------------
function loadResults() {
  if (!fs.existsSync(RESULTS_DIR)) return [];
  return fs.readdirSync(RESULTS_DIR)
    .filter(f => f.endsWith("-result.json"))
    .map(name => {
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(RESULTS_DIR, name), "utf8"));
        const pkgLabel = (raw.labels || []).find(l => l.name === "package");
        const suite    = (raw.labels || []).find(l => l.name === "suite");
        return {
          uuid:     raw.uuid,
          name:     raw.name || raw.fullName || "(unnamed)",
          status:   raw.status   || "unknown",
          start:    raw.start    || 0,
          stop:     raw.stop     || 0,
          duration: Math.max(0, (raw.stop || 0) - (raw.start || 0)),
          spec:     pkgLabel ? pkgLabel.value.replace(/^cypress\.e2e\./, "").replace(/\.cy\.js$/, ".cy.js") : "(unknown)",
          suite:    suite ? suite.value : null,
          message:  raw.statusDetails && raw.statusDetails.message ? raw.statusDetails.message : "",
          trace:    raw.statusDetails && raw.statusDetails.trace   ? raw.statusDetails.trace   : "",
          steps:    flattenSteps(raw.steps || []),
        };
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => (b.start || 0) - (a.start || 0));
}

function flattenSteps(steps, depth = 0, acc = []) {
  for (const s of steps) {
    acc.push({
      name:     s.name,
      status:   s.status,
      depth,
      duration: Math.max(0, (s.stop || 0) - (s.start || 0)),
    });
    if (s.steps && s.steps.length) flattenSteps(s.steps, depth + 1, acc);
  }
  return acc;
}

// --------------------------------------------------------------------------
// 3. Aggregate stats & merge.
// --------------------------------------------------------------------------
function aggregate(specs, results) {
  const bySpec = {};
  for (const s of specs) bySpec[s.file] = { ...s, tests: [], stats: zeroStats() };

  for (const r of results) {
    const key = r.spec;
    if (!bySpec[key]) {
      bySpec[key] = { file: key, path: `cypress/e2e/${key}`, sizeKb: 0, modified: null, describes: [], its: [], tests: [], stats: zeroStats() };
    }
    bySpec[key].tests.push(r);
    bySpec[key].stats.total++;
    bySpec[key].stats[r.status] = (bySpec[key].stats[r.status] || 0) + 1;
    bySpec[key].stats.duration += r.duration;
  }

  const overall = zeroStats();
  for (const s of Object.values(bySpec)) {
    overall.total    += s.stats.total;
    overall.passed   += s.stats.passed   || 0;
    overall.failed   += s.stats.failed   || 0;
    overall.broken   += s.stats.broken   || 0;
    overall.skipped  += s.stats.skipped  || 0;
    overall.unknown  += s.stats.unknown  || 0;
    overall.duration += s.stats.duration;
  }

  return { specs: Object.values(bySpec).sort((a, b) => a.file.localeCompare(b.file)), overall };
}

function zeroStats() {
  return { total: 0, passed: 0, failed: 0, broken: 0, skipped: 0, unknown: 0, duration: 0 };
}

// --------------------------------------------------------------------------
// 4. Render.
// --------------------------------------------------------------------------
function render(payload) {
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");
  return TEMPLATE.replace("__DATA__", json).replace("__GENERATED_AT__", new Date().toISOString());
}

const TEMPLATE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Cypress UVP — Test Dashboard</title>
<style>
  :root {
    --bg:#0f1115; --panel:#171a21; --panel-2:#1e222b; --border:#2a2f3a;
    --text:#e6e8ee; --muted:#8b93a7; --accent:#7c9cff;
    --pass:#34d399; --fail:#f87171; --skip:#fbbf24; --broken:#c084fc;
  }
  * { box-sizing: border-box; }
  body { margin:0; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
         background:var(--bg); color:var(--text); font-size:14px; }
  header { padding:18px 28px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  header h1 { font-size:18px; margin:0; font-weight:600; letter-spacing:.2px; }
  header .meta { color:var(--muted); font-size:12px; }
  .container { display:grid; grid-template-columns: 320px 1fr; min-height: calc(100vh - 61px); }
  aside { border-right:1px solid var(--border); background:var(--panel); padding:16px 0; overflow-y:auto; }
  main  { padding:24px 28px; overflow-y:auto; }

  .stats { display:grid; grid-template-columns: repeat(5, 1fr); gap:12px; margin-bottom:24px; }
  .stat { background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:14px 16px; }
  .stat .k { color:var(--muted); font-size:11px; text-transform:uppercase; letter-spacing:.6px; }
  .stat .v { font-size:22px; font-weight:600; margin-top:4px; }
  .stat.pass .v { color:var(--pass); }
  .stat.fail .v { color:var(--fail); }
  .stat.skip .v { color:var(--skip); }

  .bar { display:flex; height:8px; border-radius:99px; overflow:hidden; background:var(--panel-2); margin-top:8px; }
  .bar > span { display:block; height:100%; }
  .bar .pass { background:var(--pass); }
  .bar .fail { background:var(--fail); }
  .bar .skip { background:var(--skip); }
  .bar .broken { background:var(--broken); }

  .spec-item { padding:10px 16px; border-left:3px solid transparent; cursor:pointer; }
  .spec-item:hover { background:var(--panel-2); }
  .spec-item.active { background:var(--panel-2); border-left-color:var(--accent); }
  .spec-item .name { font-weight:500; }
  .spec-item .sub  { color:var(--muted); font-size:12px; margin-top:2px; display:flex; gap:10px; }
  .pill { display:inline-block; padding:1px 6px; border-radius:99px; font-size:11px; font-weight:600; }
  .pill.pass { background: rgba(52, 211, 153, .15); color: var(--pass); }
  .pill.fail { background: rgba(248, 113, 113, .15); color: var(--fail); }
  .pill.skip { background: rgba(251, 191, 36, .15); color: var(--skip); }
  .pill.unknown { background: rgba(139, 147, 167, .15); color: var(--muted); }
  .pill.broken { background: rgba(192, 132, 252, .15); color: var(--broken); }

  .toolbar { display:flex; gap:8px; align-items:center; margin-bottom:16px; flex-wrap:wrap; }
  .toolbar input[type=search] { flex:1; min-width:200px; background:var(--panel); border:1px solid var(--border); color:var(--text);
                                padding:8px 12px; border-radius:8px; outline:none; }
  .toolbar input[type=search]:focus { border-color:var(--accent); }
  .filter-btn { background:var(--panel); border:1px solid var(--border); color:var(--text); padding:6px 12px; border-radius:8px; cursor:pointer; font-size:12px; }
  .filter-btn.active { background:var(--accent); border-color:var(--accent); color:#0c0f17; }

  .test-row { background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:12px 16px; margin-bottom:8px; }
  .test-row .top { display:flex; align-items:center; gap:12px; }
  .test-row .name { font-weight:500; flex:1; }
  .test-row .duration { color:var(--muted); font-size:12px; }
  .test-row.failed { border-color: rgba(248, 113, 113, .35); }
  .test-row details { margin-top:10px; }
  .test-row summary { color:var(--muted); cursor:pointer; font-size:12px; }
  .test-row pre { background:#0a0c11; border:1px solid var(--border); padding:10px; overflow:auto; border-radius:8px;
                  font-size:12px; line-height:1.5; margin:8px 0 0 0; max-height:240px; }
  .steps { margin-top:8px; }
  .step { font-size:12px; color:var(--muted); padding:2px 0; display:flex; gap:8px; align-items:center; }
  .step.failed { color: var(--fail); }
  .step.passed::before { content:"✓"; color:var(--pass); width:14px; display:inline-block; }
  .step.failed::before { content:"✕"; color:var(--fail); width:14px; display:inline-block; }
  .step.skipped::before { content:"○"; color:var(--skip); width:14px; display:inline-block; }

  .section-title { font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:.6px; padding:0 16px 8px 16px; margin-top:8px; }
  .empty { color:var(--muted); padding:40px 0; text-align:center; }
  h2 { font-size:16px; margin: 0 0 4px 0; font-weight:600; }
  .spec-path { color:var(--muted); font-size:12px; margin-bottom:18px; }
  .group-header { color:var(--muted); font-size:11px; text-transform:uppercase; letter-spacing:.5px; margin:18px 0 8px 0; }
</style>
</head>
<body>
<header>
  <div>
    <h1>Cypress UVP — Test Dashboard</h1>
    <div class="meta">Prototype · generated <span id="generated"></span></div>
  </div>
  <div class="meta">Specs: <strong id="spec-count">0</strong> · Tests: <strong id="test-count">0</strong></div>
</header>

<div class="container">
  <aside>
    <div class="section-title">Specs</div>
    <div id="spec-list"></div>
  </aside>
  <main>
    <div id="overview"></div>
    <div id="detail"></div>
  </main>
</div>

<script>
const DATA = __DATA__;
const GENERATED_AT = "__GENERATED_AT__";
document.getElementById("generated").textContent = new Date(GENERATED_AT).toLocaleString();
document.getElementById("spec-count").textContent = DATA.specs.length;
document.getElementById("test-count").textContent = DATA.overall.total;

function fmtDuration(ms) {
  if (!ms) return "—";
  if (ms < 1000) return ms + "ms";
  if (ms < 60_000) return (ms / 1000).toFixed(1) + "s";
  const m = Math.floor(ms / 60000), s = Math.round((ms % 60000) / 1000);
  return m + "m " + s + "s";
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}

function statusPill(status) {
  const cls = ["passed","failed","skipped","broken"].includes(status) ? status.replace("passed","pass").replace("failed","fail").replace("skipped","skip") : "unknown";
  return '<span class="pill ' + cls + '">' + status + '</span>';
}

function renderOverview() {
  const o = DATA.overall;
  const passPct   = o.total ? (o.passed   / o.total) * 100 : 0;
  const failPct   = o.total ? (o.failed   / o.total) * 100 : 0;
  const skipPct   = o.total ? (o.skipped  / o.total) * 100 : 0;
  const brokenPct = o.total ? (o.broken   / o.total) * 100 : 0;

  document.getElementById("overview").innerHTML = \`
    <h2>Overview</h2>
    <div class="spec-path">Latest run aggregated across all specs · click a spec on the left to drill in</div>
    <div class="stats">
      <div class="stat"><div class="k">Total tests</div><div class="v">\${o.total}</div></div>
      <div class="stat pass"><div class="k">Passed</div><div class="v">\${o.passed}</div></div>
      <div class="stat fail"><div class="k">Failed</div><div class="v">\${o.failed}</div></div>
      <div class="stat skip"><div class="k">Skipped</div><div class="v">\${o.skipped}</div></div>
      <div class="stat"><div class="k">Total duration</div><div class="v">\${fmtDuration(o.duration)}</div></div>
    </div>
    <div class="bar" title="Pass / Fail / Skip / Broken">
      <span class="pass" style="width:\${passPct}%"></span>
      <span class="fail" style="width:\${failPct}%"></span>
      <span class="skip" style="width:\${skipPct}%"></span>
      <span class="broken" style="width:\${brokenPct}%"></span>
    </div>
    <div class="group-header">Spec inventory</div>
    <div id="spec-grid"></div>
  \`;

  const grid = document.getElementById("spec-grid");
  grid.innerHTML = DATA.specs.map((s, i) => \`
    <div class="test-row" style="cursor:pointer" onclick="selectSpec(\${i})">
      <div class="top">
        <div class="name">\${escapeHtml(s.file)}</div>
        <div class="duration">\${s.its.length} it() blocks · \${s.stats.total} runs · \${fmtDuration(s.stats.duration)}</div>
        \${s.stats.failed ? '<span class="pill fail">'+s.stats.failed+' failed</span>' : ''}
        \${s.stats.passed ? '<span class="pill pass">'+s.stats.passed+' passed</span>' : ''}
        \${s.stats.skipped ? '<span class="pill skip">'+s.stats.skipped+' skipped</span>' : ''}
        \${!s.stats.total ? '<span class="pill unknown">no run data</span>' : ''}
      </div>
    </div>
  \`).join("");
}

function renderSpecList() {
  const el = document.getElementById("spec-list");
  el.innerHTML = DATA.specs.map((s, i) => {
    const overall = s.stats.failed ? "fail" : (s.stats.total ? "pass" : "unknown");
    return \`
      <div class="spec-item" data-i="\${i}" onclick="selectSpec(\${i})">
        <div class="name">\${escapeHtml(s.file)}</div>
        <div class="sub">
          <span class="pill \${overall}">\${overall === "unknown" ? "no data" : overall}</span>
          <span>\${s.its.length} tests</span>
          \${s.stats.duration ? '<span>'+fmtDuration(s.stats.duration)+'</span>' : ''}
        </div>
      </div>
    \`;
  }).join("");
}

let selectedFilter = "all";
let selectedIndex  = null;

function selectSpec(i) {
  selectedIndex = i;
  document.querySelectorAll(".spec-item").forEach(el => el.classList.toggle("active", +el.dataset.i === i));
  renderDetail();
}

function renderDetail() {
  if (selectedIndex == null) { document.getElementById("detail").innerHTML = ""; return; }
  const s = DATA.specs[selectedIndex];
  const search = (document.getElementById("search")?.value || "").toLowerCase();
  const tests = s.tests.filter(t => {
    if (selectedFilter !== "all" && t.status !== selectedFilter) return false;
    if (search && !t.name.toLowerCase().includes(search)) return false;
    return true;
  });

  document.getElementById("detail").innerHTML = \`
    <div style="border-top:1px solid var(--border); margin:28px 0; padding-top:24px;"></div>
    <h2>\${escapeHtml(s.file)}</h2>
    <div class="spec-path">\${escapeHtml(s.path)} · \${s.sizeKb} KB</div>

    <div class="stats">
      <div class="stat"><div class="k">Total runs</div><div class="v">\${s.stats.total}</div></div>
      <div class="stat pass"><div class="k">Passed</div><div class="v">\${s.stats.passed||0}</div></div>
      <div class="stat fail"><div class="k">Failed</div><div class="v">\${s.stats.failed||0}</div></div>
      <div class="stat skip"><div class="k">Skipped</div><div class="v">\${s.stats.skipped||0}</div></div>
      <div class="stat"><div class="k">Duration</div><div class="v">\${fmtDuration(s.stats.duration)}</div></div>
    </div>

    <div class="toolbar">
      <input id="search" type="search" placeholder="Filter tests by name…" oninput="renderDetail()" value="\${escapeHtml(search)}">
      \${["all","passed","failed","skipped","broken"].map(f =>
        '<button class="filter-btn '+(selectedFilter===f?'active':'')+'" onclick="setFilter(\\''+f+'\\')">'+f+'</button>'
      ).join("")}
    </div>

    \${s.describes.length ? '<div class="group-header">Describe blocks</div>'+
      s.describes.map(d => '<div style="color:var(--muted); font-size:13px; margin:2px 0;">▸ '+escapeHtml(d)+'</div>').join("") : ""}

    <div class="group-header">Test results (\${tests.length})</div>
    \${tests.length === 0 ? '<div class="empty">No tests match the current filter.</div>' :
      tests.map(t => renderTest(t)).join("")}

    \${!s.tests.length ? '<div class="group-header">Static it() blocks (no run data)</div>'+
      s.its.map(name => '<div class="test-row"><div class="top"><div class="name">'+escapeHtml(name)+'</div><span class="pill unknown">not run</span></div></div>').join("") : ""}
  \`;
}

function renderTest(t) {
  return \`
    <div class="test-row \${t.status}">
      <div class="top">
        \${statusPill(t.status)}
        <div class="name">\${escapeHtml(t.name)}</div>
        <div class="duration">\${fmtDuration(t.duration)}</div>
      </div>
      \${t.message ? '<details open><summary>Error</summary><pre>'+escapeHtml(t.message)+(t.trace ? "\\n\\n"+escapeHtml(t.trace) : "")+'</pre></details>' : ''}
      \${t.steps && t.steps.length ? '<details><summary>Steps ('+t.steps.length+')</summary><div class="steps">'+
        t.steps.map(st => '<div class="step '+st.status+'" style="padding-left:'+(st.depth*14)+'px">'+escapeHtml(st.name)+' <span style="color:var(--muted)">· '+fmtDuration(st.duration)+'</span></div>').join("")+
        '</div></details>' : ''}
    </div>
  \`;
}

function setFilter(f) { selectedFilter = f; renderDetail(); }

renderOverview();
renderSpecList();
</script>
</body>
</html>
`;

// --------------------------------------------------------------------------
// 5. Go.
// --------------------------------------------------------------------------
function main() {
  const specs   = listSpecs();
  const results = loadResults();
  const data    = aggregate(specs, results);

  fs.writeFileSync(OUTPUT_HTML, render(data));

  console.log(`Dashboard written: ${path.relative(process.cwd(), OUTPUT_HTML)}`);
  console.log(`  specs   : ${data.specs.length}`);
  console.log(`  tests   : ${data.overall.total} (passed ${data.overall.passed}, failed ${data.overall.failed}, skipped ${data.overall.skipped})`);
  console.log(`  duration: ${(data.overall.duration / 1000).toFixed(1)}s`);
}

main();
