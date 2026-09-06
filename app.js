(function () {
  "use strict";

  const app = document.getElementById("app");
  const state = { search: "", sector: "All" };

  const TAB_DEFS = [
    { key: "whatItDoes", label: "What it does" },
    { key: "moat", label: "Differentiator / MOAT" },
    { key: "teardown", label: "Product teardown" },
    { key: "metrics", label: "Metrics" },
    { key: "improvements", label: "Improvements" },
    { key: "interview", label: "Interview questions" },
  ];

  function esc(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function caseNumber(index) {
    return "CF-" + String(index + 1).padStart(2, "0");
  }

  function topbar(showBack) {
    return `
      <div class="topbar">
        <div class="wordmark" data-nav="home">Case<span>Craft</span></div>
        <div class="topbar-meta">A researched library of business &amp; product case studies</div>
      </div>
    `;
  }

  function renderHome() {
    const q = state.search.trim().toLowerCase();
    const bySector = new Map();
    SECTORS.forEach((s) => bySector.set(s, []));

    CASE_STUDIES.forEach((cs, i) => {
      const matchesSearch =
        !q ||
        cs.name.toLowerCase().includes(q) ||
        cs.oneLiner.toLowerCase().includes(q) ||
        cs.sector.toLowerCase().includes(q);
      const matchesSector = state.sector === "All" || cs.sector === state.sector;
      if (matchesSearch && matchesSector) {
        if (!bySector.has(cs.sector)) bySector.set(cs.sector, []);
        bySector.get(cs.sector).push({ ...cs, _index: i });
      }
    });

    const totalShown = [...bySector.values()].reduce((a, b) => a + b.length, 0);

    const chipRow = ["All", ...SECTORS]
      .map(
        (s) =>
          `<div class="chip ${s === state.sector ? "active" : ""}" data-sector="${esc(s)}">${esc(s)}</div>`
      )
      .join("");

    let ledgerHtml = "";
    if (totalShown === 0) {
      ledgerHtml = `
        <div class="empty-state">
          <strong>No case files match that search.</strong>
          Try a different sector or clear the search box.
        </div>`;
    } else {
      for (const [sector, items] of bySector) {
        if (!items.length) continue;
        ledgerHtml += `
          <div class="sector-group">
            <div class="sector-heading">
              <h2>${esc(sector)}</h2>
              <span class="count">${items.length} ${items.length === 1 ? "case" : "cases"}</span>
            </div>
            <div class="ledger">
              ${items
                .map(
                  (cs) => `
                <div class="ledger-row" data-nav="case" data-slug="${esc(cs.slug)}">
                  <div class="ledger-num">${caseNumber(cs._index)}</div>
                  <div class="ledger-main">
                    <span class="name">${esc(cs.name)}</span>
                    <span class="oneliner">${esc(cs.oneLiner)}</span>
                  </div>
                  <div class="ledger-arrow">&rarr;</div>
                </div>`
                )
                .join("")}
            </div>
          </div>`;
      }
    }

    app.innerHTML = `
      <div class="shell">
        ${topbar()}
        <div class="index-intro">
          <h1>Detailed, researched case studies of the products shaping how things get built.</h1>
          <p>Pick a sector or search a product below. Every case file walks through what the product does, its differentiator, a teardown of its strategy, real metrics, where it could improve, and interview questions the case study raises.</p>
        </div>
        <div class="controls">
          <div class="search-slot">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input id="search-input" type="text" placeholder="Search a product, sector, or keyword&hellip;" value="${esc(state.search)}" />
          </div>
        </div>
        <div class="chip-row">${chipRow}</div>
        <div style="height:8px"></div>
        ${ledgerHtml}
        <footer class="sitefoot">
          <span>${CASE_STUDIES.length} case files across ${SECTORS.length} sectors</span>
          <span>Built with CaseCraft</span>
        </footer>
      </div>
    `;

    attachHomeEvents();
  }

  function attachHomeEvents() {
    app.querySelectorAll("[data-sector]").forEach((el) => {
      el.addEventListener("click", () => {
        state.sector = el.getAttribute("data-sector");
        renderHome();
      });
    });
    app.querySelectorAll("[data-nav='case']").forEach((el) => {
      el.addEventListener("click", () => {
        location.hash = "#/case/" + el.getAttribute("data-slug");
      });
    });
    const wordmark = app.querySelector("[data-nav='home']");
    if (wordmark) wordmark.addEventListener("click", () => { location.hash = "#/"; });

    const input = document.getElementById("search-input");
    if (input) {
      input.addEventListener("input", (e) => {
        state.search = e.target.value;
        const caret = e.target.selectionStart;
        renderHome();
        const newInput = document.getElementById("search-input");
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(caret, caret);
        }
      });
    }
  }

  function sectionBlock(heading, body) {
    return `<div class="section"><h3>${esc(heading)}</h3><p>${esc(body)}</p></div>`;
  }

  function renderTabContent(cs, tabKey) {
    switch (tabKey) {
      case "whatItDoes":
        return `<div class="block-list">${cs.whatItDoes.map((b) => sectionBlock(b.heading, b.body)).join("")}</div>`;
      case "moat":
        return `<div class="block-list">${cs.moat.map((b) => sectionBlock(b.heading, b.body)).join("")}</div>`;
      case "teardown":
        return `<div class="block-list">${cs.teardown.map((b) => sectionBlock(b.heading, b.body)).join("")}</div>`;
      case "metrics":
        return `
          <div class="metrics-grid">
            ${cs.metrics
              .map(
                (m) => `
              <div class="metric-cell">
                <span class="label">${esc(m.label)}</span>
                <span class="value">${esc(m.value)}</span>
                ${m.note ? `<span class="note">${esc(m.note)}</span>` : ""}
              </div>`
              )
              .join("")}
          </div>`;
      case "improvements":
        return `
          <div>
            ${cs.improvements
              .map(
                (imp) => `
              <div class="imp-item">
                <div class="title">${esc(imp.title)}</div>
                <p>${esc(imp.body)}</p>
              </div>`
              )
              .join("")}
          </div>`;
      case "interview":
        return `
          <div>
            ${cs.interview
              .map(
                (q) => `
              <div class="qa-item">
                <span class="qa-cat">${esc(q.category)}</span>
                <div class="qa-q">${esc(q.question)}</div>
                ${q.angle ? `<p class="qa-a"><span class="lbl">What a strong answer covers: </span>${esc(q.angle)}</p>` : ""}
              </div>`
              )
              .join("")}
          </div>`;
      default:
        return "";
    }
  }

  function renderCase(slug) {
    const index = CASE_STUDIES.findIndex((c) => c.slug === slug);
    const cs = CASE_STUDIES[index];
    if (!cs) {
      app.innerHTML = `<div class="shell">${topbar()}<div class="empty-state"><strong>Case file not found.</strong></div></div>`;
      return;
    }

    let activeTab = TAB_DEFS[0].key;

    function paint() {
      app.innerHTML = `
        <div class="shell">
          ${topbar()}
          <div class="back-link" data-nav="home">&larr; All case files</div>
          <div class="case-header">
            <div class="case-tagrow">
              <span class="sector-tag">${esc(cs.sector)}</span>
              <span class="case-num">${caseNumber(index)}</span>
            </div>
            <div class="case-title-row">
              <div class="case-logo">${esc(cs.logoLetter)}</div>
              <h1>${esc(cs.name)}</h1>
            </div>
            <p class="case-oneliner">${esc(cs.oneLiner)}</p>
            <div class="case-facts">
              <div class="case-fact"><span class="k">Founded</span><span class="v">${esc(cs.founded)}</span></div>
              <div class="case-fact"><span class="k">Headquarters</span><span class="v">${esc(cs.hq)}</span></div>
              <div class="case-fact"><span class="k">Founders</span><span class="v">${esc(cs.founders)}</span></div>
            </div>
          </div>
          <div class="folder">
            <div class="tabstrip">
              ${TAB_DEFS.map(
                (t) => `<div class="tab ${t.key === activeTab ? "active" : ""}" data-tab="${t.key}">${esc(t.label)}</div>`
              ).join("")}
            </div>
            <div class="folder-page">
              ${renderTabContent(cs, activeTab)}
            </div>
          </div>
          <footer class="sitefoot">
            <span>Case file ${caseNumber(index)} &middot; ${esc(cs.sector)}</span>
            <span>Built with CaseCraft</span>
          </footer>
        </div>
      `;

      app.querySelectorAll("[data-tab]").forEach((el) => {
        el.addEventListener("click", () => {
          activeTab = el.getAttribute("data-tab");
          paint();
          const page = app.querySelector(".folder-page");
          if (page) page.scrollIntoView({ block: "nearest" });
        });
      });
      const back = app.querySelector("[data-nav='home']");
      if (back) back.addEventListener("click", () => { location.hash = "#/"; });
      const wordmark = app.querySelector(".wordmark");
      if (wordmark) wordmark.addEventListener("click", () => { location.hash = "#/"; });
    }

    paint();
    window.scrollTo(0, 0);
  }

  function route() {
    const hash = location.hash || "#/";
    const caseMatch = hash.match(/^#\/case\/([\w-]+)/);
    if (caseMatch) {
      renderCase(caseMatch[1]);
    } else {
      renderHome();
    }
  }

  window.addEventListener("hashchange", route);
  window.addEventListener("DOMContentLoaded", route);
  route();
})();
