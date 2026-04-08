<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>My Materials</title>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f0f12;
    --surface: #17171c;
    --surface2: #1e1e25;
    --border: rgba(255,255,255,0.07);
    --border-hover: rgba(255,255,255,0.13);
    --text-primary: #f0effe;
    --text-secondary: #9190a4;
    --text-muted: #5c5b6e;
    --accent: #7c6ff7;
    --accent-soft: rgba(124,111,247,0.12);
    --accent-glow: rgba(124,111,247,0.25);
    --green: #3ecf8e;
    --green-soft: rgba(62,207,142,0.12);
    --amber: #f59e0b;
    --amber-soft: rgba(245,158,11,0.12);
    --blue: #38bdf8;
    --blue-soft: rgba(56,189,248,0.12);
    --red: #f87171;
    --red-soft: rgba(248,113,113,0.12);
    --teal: #2dd4bf;
    --teal-soft: rgba(45,212,191,0.12);
    --radius: 12px;
    --radius-sm: 8px;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text-primary);
    min-height: 100vh;
    padding: 36px 40px;
  }

  /* Header */
  .page-header {
    margin-bottom: 32px;
    animation: fadeUp 0.4s ease both;
  }
  .page-header h1 {
    font-family: 'Sora', sans-serif;
    font-size: 26px;
    font-weight: 600;
    letter-spacing: -0.4px;
    color: var(--text-primary);
  }
  .page-header p {
    font-size: 14px;
    color: var(--text-secondary);
    margin-top: 4px;
  }

  /* Stats row */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 24px;
    animation: fadeUp 0.4s 0.05s ease both;
  }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: border-color 0.2s;
  }
  .stat-card:hover { border-color: var(--border-hover); }
  .stat-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .stat-dot.green { background: var(--green); box-shadow: 0 0 6px var(--green); }
  .stat-dot.amber { background: var(--amber); box-shadow: 0 0 6px var(--amber); }
  .stat-dot.muted { background: var(--text-muted); }
  .stat-label { font-size: 12px; color: var(--text-secondary); margin-bottom: 2px; }
  .stat-value { font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 600; line-height: 1; }

  /* Toolbar */
  .toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 18px;
    align-items: center;
    animation: fadeUp 0.4s 0.1s ease both;
  }
  .search-wrap {
    flex: 1;
    position: relative;
  }
  .search-wrap svg {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 10px 14px 10px 40px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text-primary);
    outline: none;
    transition: border-color 0.2s;
  }
  .search-input::placeholder { color: var(--text-muted); }
  .search-input:focus { border-color: var(--accent); }

  .filter-select {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text-secondary);
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s;
    appearance: none;
    padding-right: 32px;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%235c5b6e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
  }
  .filter-select:focus { border-color: var(--accent); }

  /* Type filter pills */
  .type-filters {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 24px;
    animation: fadeUp 0.4s 0.12s ease both;
  }
  .pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
  }
  .pill:hover { border-color: var(--border-hover); color: var(--text-primary); }
  .pill.active {
    background: var(--accent-soft);
    border-color: var(--accent);
    color: var(--accent);
  }
  .pill .count {
    background: rgba(255,255,255,0.08);
    padding: 1px 7px;
    border-radius: 999px;
    font-size: 11px;
  }
  .pill.active .count { background: var(--accent-glow); }

  /* Grid */
  .materials-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    animation: fadeUp 0.4s 0.15s ease both;
  }

  /* Material card */
  .material-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.2s, background 0.2s;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    overflow: hidden;
  }
  .material-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: var(--radius) var(--radius) 0 0;
  }
  .material-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
    background: var(--surface2);
  }
  .material-card:hover::before { opacity: 1; }
  .material-card.type-note::before { background: var(--accent); }
  .material-card.type-presentation::before { background: var(--blue); }
  .material-card.type-video::before { background: var(--red); }
  .material-card.type-link::before { background: var(--amber); }
  .material-card.type-plan::before { background: var(--teal); }

  .card-badges {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 500;
  }
  .badge.note    { background: var(--accent-soft); color: var(--accent); }
  .badge.pres    { background: var(--blue-soft); color: var(--blue); }
  .badge.video   { background: var(--red-soft); color: var(--red); }
  .badge.link    { background: var(--amber-soft); color: var(--amber); }
  .badge.plan    { background: var(--teal-soft); color: var(--teal); }
  .badge.new     { background: var(--green-soft); color: var(--green); }

  .card-title {
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.4;
  }
  .card-desc {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.5;
    flex: 1;
  }
  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    border-top: 1px solid var(--border);
    font-size: 12px;
    color: var(--text-muted);
  }
  .card-meta-left { display: flex; flex-direction: column; gap: 4px; }
  .card-subject { font-weight: 500; color: var(--text-secondary); font-size: 12px; }

  .open-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 6px;
    background: var(--accent-soft);
    border: 1px solid var(--accent);
    color: var(--accent);
    font-size: 12px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s;
  }
  .open-btn:hover { background: rgba(124,111,247,0.22); }

  /* Empty state */
  .empty {
    grid-column: 1/-1;
    text-align: center;
    padding: 60px 20px;
    color: var(--text-muted);
    font-size: 14px;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Responsive */
  @media (max-width: 900px) {
    .materials-grid { grid-template-columns: repeat(2, 1fr); }
    body { padding: 24px 20px; }
  }
  @media (max-width: 580px) {
    .materials-grid { grid-template-columns: 1fr; }
    .stats-row { grid-template-columns: repeat(3,1fr); }
  }
</style>
</head>
<body>

<div class="page-header">
  <h1>My Materials</h1>
  <p>Notes, slides, videos, and resources shared by your teachers.</p>
</div>

<div class="stats-row">
  <div class="stat-card">
    <span class="stat-dot green"></span>
    <div>
      <div class="stat-label">Available</div>
      <div class="stat-value">6</div>
    </div>
  </div>
  <div class="stat-card">
    <span class="stat-dot amber"></span>
    <div>
      <div class="stat-label">Coming soon</div>
      <div class="stat-value">1</div>
    </div>
  </div>
  <div class="stat-card">
    <span class="stat-dot muted"></span>
    <div>
      <div class="stat-label">Subjects</div>
      <div class="stat-value">3</div>
    </div>
  </div>
</div>

<div class="toolbar">
  <div class="search-wrap">
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
    <input class="search-input" type="text" placeholder="Search by title, subject, class…" id="searchInput" oninput="filterCards()"/>
  </div>
  <select class="filter-select" id="subjectFilter" onchange="filterCards()">
    <option value="">All subjects</option>
    <option value="Mathematics">Mathematics</option>
    <option value="Science">Science</option>
    <option value="Physics">Physics</option>
  </select>
</div>

<div class="type-filters" id="typeFilters">
  <div class="pill active" data-type="all" onclick="setType('all', this)">
    All <span class="count">6</span>
  </div>
  <div class="pill" data-type="note" onclick="setType('note', this)">
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    Note / Doc <span class="count">1</span>
  </div>
  <div class="pill" data-type="presentation" onclick="setType('presentation', this)">
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
    Presentation <span class="count">1</span>
  </div>
  <div class="pill" data-type="video" onclick="setType('video', this)">
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
    Video <span class="count">1</span>
  </div>
  <div class="pill" data-type="link" onclick="setType('link', this)">
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
    External Link <span class="count">1</span>
  </div>
  <div class="pill" data-type="plan" onclick="setType('plan', this)">
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    Lesson Plan <span class="count">2</span>
  </div>
</div>

<div class="materials-grid" id="grid">

  <div class="material-card type-note" data-type="note" data-subject="Mathematics" data-title="Quadratic Equations Summary Notes">
    <div class="card-badges">
      <span class="badge note">
        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        Note / Doc
      </span>
      <span class="badge new">New</span>
    </div>
    <div class="card-title">Quadratic Equations – Summary Notes</div>
    <div class="card-desc">Comprehensive notes covering factoring, completing the square, and the quadratic formula.</div>
    <div class="card-footer">
      <div class="card-meta-left">
        <span class="card-subject">Grade 10 – A · Mathematics</span>
        <span>Shared 10 Jan 2025</span>
      </div>
      <button class="open-btn">
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Open
      </button>
    </div>
  </div>

  <div class="material-card type-presentation" data-type="presentation" data-subject="Mathematics" data-title="Algebra Unit Slide Deck">
    <div class="card-badges">
      <span class="badge pres">
        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        Presentation
      </span>
    </div>
    <div class="card-title">Algebra Unit – Slide Deck</div>
    <div class="card-desc">Presentation slides for Chapter 5 covering linear and quadratic expressions.</div>
    <div class="card-footer">
      <div class="card-meta-left">
        <span class="card-subject">Grade 10 – B · Mathematics</span>
        <span>Shared 12 Jan 2025</span>
      </div>
      <button class="open-btn">
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Open
      </button>
    </div>
  </div>

  <div class="material-card type-video" data-type="video" data-subject="Science" data-title="Chemical Reactions Explainer Video">
    <div class="card-badges">
      <span class="badge video">
        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
        Video
      </span>
    </div>
    <div class="card-title">Chemical Reactions – Explainer Video</div>
    <div class="card-desc">Embedded video walkthrough of oxidation and reduction reactions.</div>
    <div class="card-footer">
      <div class="card-meta-left">
        <span class="card-subject">Grade 9 – A · Science</span>
        <span>Shared 08 Jan 2025</span>
      </div>
      <button class="open-btn">
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        Watch
      </button>
    </div>
  </div>

  <div class="material-card type-link" data-type="link" data-subject="Physics" data-title="Khan Academy Newtons Laws">
    <div class="card-badges">
      <span class="badge link">
        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
        External Link
      </span>
    </div>
    <div class="card-title">Khan Academy – Newton's Laws</div>
    <div class="card-desc">Curated external resource for supplementary reading on forces and motion.</div>
    <div class="card-footer">
      <div class="card-meta-left">
        <span class="card-subject">Grade 10 – A · Physics</span>
        <span>Shared 15 Jan 2025</span>
      </div>
      <button class="open-btn">
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Visit
      </button>
    </div>
  </div>

  <div class="material-card type-plan" data-type="plan" data-subject="Physics" data-title="Lesson Plan Forces Motion">
    <div class="card-badges">
      <span class="badge plan">
        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Lesson Plan
      </span>
    </div>
    <div class="card-title">Lesson Plan – Forces & Motion</div>
    <div class="card-desc">Full lesson plan for the 60-minute introductory class on Newton's laws.</div>
    <div class="card-footer">
      <div class="card-meta-left">
        <span class="card-subject">Grade 10 – A · Physics</span>
        <span>Shared 14 Jan 2025</span>
      </div>
      <button class="open-btn">
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Open
      </button>
    </div>
  </div>

  <div class="material-card type-plan" data-type="plan" data-subject="Mathematics" data-title="Lesson Plan Quadratic Functions">
    <div class="card-badges">
      <span class="badge plan">
        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Lesson Plan
      </span>
    </div>
    <div class="card-title">Lesson Plan – Quadratic Functions</div>
    <div class="card-desc">Draft lesson plan for upcoming quadratic functions unit including practice activities.</div>
    <div class="card-footer">
      <div class="card-meta-left">
        <span class="card-subject">Grade 10 – B · Mathematics</span>
        <span>Shared 16 Jan 2025</span>
      </div>
      <button class="open-btn">
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Open
      </button>
    </div>
  </div>

  <div class="empty" id="emptyState" style="display:none">No materials match your search.</div>
</div>

<script>
  let activeType = 'all';

  function setType(type, el) {
    activeType = type;
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    filterCards();
  }

  function filterCards() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const sub = document.getElementById('subjectFilter').value;
    const cards = document.querySelectorAll('.material-card');
    let visible = 0;

    cards.forEach(card => {
      const matchType = activeType === 'all' || card.dataset.type === activeType;
      const matchSubject = !sub || card.dataset.subject === sub;
      const matchSearch = !q || card.dataset.title.toLowerCase().includes(q) || card.dataset.subject.toLowerCase().includes(q);
      const show = matchType && matchSubject && matchSearch;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    document.getElementById('emptyState').style.display = visible === 0 ? 'block' : 'none';
  }
</script>
</body>
</html>