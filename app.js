// ============================================================
// Pitch Builder — single-file vanilla JS app
// ============================================================

const STORAGE_KEY  = 'pitch_builder_api_key';
const AGENCY_KEY   = 'pitch_builder_agency';
const CURRENCY_KEY = 'pitch_builder_currency';
const HISTORY_KEY  = 'pitch_builder_history';

const $ = id => document.getElementById(id);

const CURRENCIES = {
  GBP: { symbol: '£',  name: 'GBP' },
  USD: { symbol: '$',  name: 'USD' },
  EUR: { symbol: '€',  name: 'EUR' },
  AUD: { symbol: 'A$', name: 'AUD' },
};

let pitchData   = null;
let pitchInputs = null;

// ------------------------------------------------------------
// API key
// ------------------------------------------------------------
function getApiKey()    { return localStorage.getItem(STORAGE_KEY) || ''; }
function setApiKey(key) { localStorage.setItem(STORAGE_KEY, key); }

// ------------------------------------------------------------
// Agency name
// ------------------------------------------------------------
function getAgency()      { return localStorage.getItem(AGENCY_KEY) || 'Trench Monkey'; }
function setAgency(name)  { localStorage.setItem(AGENCY_KEY, name || 'Trench Monkey'); }

function refreshAgencyUI() {
  const name = getAgency();
  $('agency-title').textContent       = name;
  $('agency-name-inline').textContent = name;
  document.title                      = name;
}

// ------------------------------------------------------------
// Currency
// ------------------------------------------------------------
function getCurrencyCode() { return localStorage.getItem(CURRENCY_KEY) || 'GBP'; }
function getCurrency()     { return CURRENCIES[getCurrencyCode()] || CURRENCIES.GBP; }
function setCurrency(code) { localStorage.setItem(CURRENCY_KEY, code); }

function refreshCurrencyUI() {
  const sym = getCurrency().symbol;
  document.querySelectorAll('.currency-symbol').forEach(el => el.textContent = sym);
}

// ------------------------------------------------------------
// Settings modal
// ------------------------------------------------------------
function openSettings() {
  $('agency-name-input').value  = getAgency();
  $('api-key-input').value      = getApiKey();
  $('currency-select').value    = getCurrencyCode();
  $('key-status').textContent   = '';
  $('settings-modal').classList.remove('hidden');
}
function closeSettings() {
  $('settings-modal').classList.add('hidden');
}

$('settings-btn').addEventListener('click', openSettings);
$('close-settings-btn').addEventListener('click', closeSettings);
$('save-settings-btn').addEventListener('click', () => {
  const key    = $('api-key-input').value.trim();
  const agency = $('agency-name-input').value.trim();
  const cur    = $('currency-select').value;

  if (key && !key.startsWith('sk-ant-')) {
    $('key-status').textContent  = 'API key should start with "sk-ant-". Double-check before saving.';
    $('key-status').style.color  = 'var(--danger)';
    return;
  }

  if (key) setApiKey(key);
  setAgency(agency);
  setCurrency(cur);
  refreshAgencyUI();
  refreshCurrencyUI();

  $('key-status').textContent = 'Saved.';
  $('key-status').style.color = 'var(--success)';
  setTimeout(closeSettings, 600);
});

// ------------------------------------------------------------
// History
// ------------------------------------------------------------
function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}
function saveToHistory(inputs, data) {
  const history = getHistory();
  history.unshift({ id: Date.now(), timestamp: new Date().toISOString(), inputs, data });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 25)));
}
function deleteFromHistory(id) {
  const history = getHistory().filter(h => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function openHistory() {
  renderHistoryList();
  $('history-modal').classList.remove('hidden');
}
function closeHistory() {
  $('history-modal').classList.add('hidden');
}

function renderHistoryList() {
  const history = getHistory();
  const list    = $('history-list');
  const empty   = $('history-empty');

  if (!history.length) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  list.innerHTML = history.map(h => {
    const date = new Date(h.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const time = new Date(h.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const cur  = CURRENCIES[h.inputs.currencyCode] || CURRENCIES.GBP;
    return `
      <div class="history-item">
        <div class="history-item-main">
          <div class="history-url">${escapeHtml(h.inputs.url)}</div>
          <div class="history-meta">${escapeHtml(h.inputs.industry)} · ${cur.symbol}${Number(h.inputs.budget).toLocaleString()} · ${date} ${time}</div>
        </div>
        <div class="history-item-actions">
          <button class="btn-secondary history-load-btn" data-id="${h.id}">Load</button>
          <button class="btn-icon history-del-btn" data-id="${h.id}" title="Delete">✕</button>
        </div>
      </div>`;
  }).join('');

  list.querySelectorAll('.history-load-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = getHistory().find(h => h.id === Number(btn.dataset.id));
      if (item) { pitchInputs = item.inputs; pitchData = item.data; closeHistory(); showResult(); }
    });
  });
  list.querySelectorAll('.history-del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteFromHistory(Number(btn.dataset.id));
      renderHistoryList();
    });
  });
}

$('history-btn').addEventListener('click', openHistory);
$('close-history-btn').addEventListener('click', closeHistory);

['settings-modal', 'history-modal'].forEach(id => {
  $(id).addEventListener('click', e => { if (e.target === $(id)) $(id).classList.add('hidden'); });
});

// ------------------------------------------------------------
// Form handling
// ------------------------------------------------------------
$('generate-btn').addEventListener('click', startPitch);
$('new-btn').addEventListener('click', resetToForm);
$('export-btn').addEventListener('click', exportToSlides);

function resetToForm() {
  $('result-view').classList.add('hidden');
  $('loading-view').classList.add('hidden');
  $('form-view').classList.remove('hidden');
  $('form-error').classList.add('hidden');
  pitchData = null;
  $('result-content').innerHTML = '';
}

async function startPitch() {
  const url        = $('url').value.trim();
  const industry   = $('industry').value.trim();
  const competitors = $('competitors').value.trim();
  const budgetRaw  = $('budget').value.trim();
  const budget     = parseFloat(budgetRaw.replace(/[^0-9.]/g, ''));

  $('form-error').classList.add('hidden');

  if (!url || !industry || !competitors || !budget || isNaN(budget)) {
    showFormError('Please fill in all four fields with valid values.');
    return;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    showFormError('Please add your Anthropic API key in settings (⚙ top right).');
    return;
  }

  const currency = getCurrency();
  pitchInputs = { url, industry, competitors, budget, currencyCode: getCurrencyCode(), currencySymbol: currency.symbol };

  $('form-view').classList.add('hidden');
  $('loading-view').classList.remove('hidden');
  $('loading-step').textContent = 'Connecting to Claude...';

  try {
    pitchData = await callClaude(url, industry, competitors, budget, currency, apiKey);
    saveToHistory(pitchInputs, pitchData);
    $('loading-view').classList.add('hidden');
    showResult();
  } catch (err) {
    $('loading-view').classList.add('hidden');
    $('form-view').classList.remove('hidden');
    showFormError('Error generating pitch: ' + err.message);
  }
}

function showFormError(msg) {
  const el = $('form-error');
  el.textContent = msg;
  el.classList.remove('hidden');
}

// ------------------------------------------------------------
// Claude API call — streaming
// ------------------------------------------------------------
async function callClaude(url, industry, competitors, budget, currency, apiKey) {
  const prompt = buildPrompt(url, industry, competitors, budget, currency);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      stream: true,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    let detail = text;
    try { const j = JSON.parse(text); detail = j.error?.message || text; } catch (_) {}
    if (response.status === 401) throw new Error('Invalid API key. Open Settings (⚙) and paste a valid sk-ant-... key.');
    if (response.status === 403) throw new Error('API key rejected. Make sure your key has credit and is not restricted.');
    if (response.status === 429) throw new Error('Rate limited. Wait a moment and try again.');
    throw new Error(`API ${response.status} — ${detail.slice(0, 300)}`);
  }

  const loadingSteps = [
    'Researching the market...',
    'Analysing competitors...',
    'Segmenting the audience...',
    'Building the positioning...',
    'Crafting the creative territory...',
    'Modelling the budget...',
    'Finalising the pitch...',
  ];
  let stepIdx = 0;
  $('loading-step').textContent = loadingSteps[0];
  const stepInterval = setInterval(() => {
    stepIdx = Math.min(stepIdx + 1, loadingSteps.length - 1);
    $('loading-step').textContent = loadingSteps[stepIdx];
  }, 5000);

  const reader  = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = '';
  let buffer      = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;
        try {
          const event = JSON.parse(data);
          if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
            accumulated += event.delta.text;
          }
        } catch (_) {}
      }
    }
  } finally {
    clearInterval(stepInterval);
  }

  const clean = accumulated
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/, '')
    .replace(/```\s*$/, '')
    .trim();

  try {
    return JSON.parse(clean);
  } catch (e) {
    console.error('Raw response:', accumulated);
    throw new Error('Could not parse Claude\'s JSON response. Try generating again.');
  }
}

// ------------------------------------------------------------
// Prompt
// ------------------------------------------------------------
function buildPrompt(url, industry, competitors, budget, currency) {
  const sym = currency.symbol;
  return `You are a senior strategist at an advertising and marketing agency preparing a new business pitch. Generate a comprehensive pitch document for this prospect.

PROSPECT
Company URL: ${url}
Industry: ${industry}
Competitors: ${competitors}
Annual marketing budget: ${sym}${budget.toLocaleString()} ${currency.name}

Return ONLY a valid JSON object (no markdown, no preamble, no backticks) matching this exact schema:

{
  "company_summary": "2-3 sentence summary of who this company likely is based on the URL and industry context",
  "market_research": {
    "market_size": "1-2 sentences on market size, value, growth rate in this industry/region",
    "key_trends": ["trend 1", "trend 2", "trend 3", "trend 4"],
    "consumer_shifts": ["shift 1", "shift 2", "shift 3"],
    "opportunity": "1-2 sentences naming the single biggest opportunity for this specific brand"
  },
  "audience_segments": [
    {"name": "segment name", "size_pct": 30, "description": "who they are, what motivates them, where to reach them — 2 sentences"},
    {"name": "...", "size_pct": 25, "description": "..."},
    {"name": "...", "size_pct": 25, "description": "..."},
    {"name": "...", "size_pct": 20, "description": "..."}
  ],
  "positioning": {
    "our_recommended_position": "1-2 sentences on where this brand should position itself in the market",
    "competitor_analysis": [
      {"name": "competitor name exactly as provided", "position": "their positioning in 1 sentence", "strength": "main strength", "weakness": "main weakness or gap we can exploit"}
    ]
  },
  "creative_territory": {
    "campaign_thought": "the single big idea in one punchy sentence — the creative platform this brand should own",
    "brand_voice": ["tone word 1", "tone word 2", "tone word 3"],
    "key_messages": [
      {"segment": "segment name matching audience_segments exactly", "message": "the one message this segment must hear, in one sentence"}
    ]
  },
  "trigger_calendar": [
    {"name": "trigger name", "months": [1,2], "month_labels": "Jan-Feb", "rationale": "why this matters for this brand — 1 sentence", "priority": "high"}
  ],
  "budget_split": [
    {"channel": "Paid social", "pct": 30, "amount": ${Math.round(budget * 0.3)}, "rationale": "1 sentence on why this allocation"}
  ]
}

REQUIREMENTS
- audience_segments: exactly 4 segments, size_pct must sum to 100
- positioning.competitor_analysis: one entry per competitor listed in the input, in the same order
- creative_territory.key_messages: exactly 4 entries, one per audience segment, in the same order as audience_segments
- trigger_calendar: 5-8 entries spanning the year. months is an array of integers (1=Jan, 12=Dec). priority must be exactly "high", "medium", or "low"
- budget_split: 5-7 channels covering the realistic media mix for this industry. pct must sum to 100. amounts must sum to exactly ${sym}${budget.toLocaleString()}
- Be specific and tactical. Reference the named competitors. Avoid generic phrases like "leverage synergies" or "engage consumers".
- Return raw JSON only. No \`\`\`json fences. No explanation before or after.`;
}

// ------------------------------------------------------------
// Render results
// ------------------------------------------------------------
function escapeHtml(s) {
  if (s === undefined || s === null) return '';
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

function monthGrid(months) {
  const labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  return '<div class="cal-grid">' + labels.map((l, i) => {
    const active = months.includes(i + 1);
    return `<div class="cal-month${active ? ' active' : ''}">${l}</div>`;
  }).join('') + '</div>';
}

function showResult() {
  const d   = pitchData;
  const sym = pitchInputs.currencySymbol || '£';

  $('result-title').textContent = pitchInputs.url;
  $('result-meta').textContent  = `${pitchInputs.industry} · ${sym}${Number(pitchInputs.budget).toLocaleString()} · vs ${pitchInputs.competitors}`;

  const ct          = d.creative_territory || {};
  const voicePills  = (ct.brand_voice || []).map(v => `<span class="voice-pill">${escapeHtml(v)}</span>`).join('');
  const keyMessages = (ct.key_messages || []).map(m => `
    <div class="key-message">
      <div class="key-message-segment">${escapeHtml(m.segment)}</div>
      <div class="key-message-text">"${escapeHtml(m.message)}"</div>
    </div>`).join('');

  $('result-content').innerHTML = `
    <div class="summary-card">
      <div class="summary-label">About this brand</div>
      <div>${escapeHtml(d.company_summary)}</div>
    </div>

    <div class="section">
      <h3>Market research</h3>
      <div style="margin-bottom: 14px; line-height: 1.6;">${escapeHtml(d.market_research.market_size)}</div>
      <div class="kv-label">Key trends</div>
      <ul class="tight">${d.market_research.key_trends.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
      <div class="kv-label">Consumer shifts</div>
      <ul class="tight">${d.market_research.consumer_shifts.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
      <div class="callout callout-success"><strong>Opportunity:</strong> ${escapeHtml(d.market_research.opportunity)}</div>
    </div>

    <div class="section">
      <h3>Audience segmentation</h3>
      ${d.audience_segments.map(s => `
        <div class="segment">
          <div class="segment-head">
            <div class="segment-name">${escapeHtml(s.name)}</div>
            <div class="segment-pct">${Math.round(s.size_pct)}% of audience</div>
          </div>
          <div class="segment-desc">${escapeHtml(s.description)}</div>
        </div>`).join('')}
    </div>

    <div class="section">
      <h3>Positioning vs competitors</h3>
      <div class="callout callout-info"><strong>Our recommended position:</strong> ${escapeHtml(d.positioning.our_recommended_position)}</div>
      ${d.positioning.competitor_analysis.map(c => `
        <div class="competitor">
          <div class="competitor-name">${escapeHtml(c.name)}</div>
          <div class="comp-row"><div class="comp-row-label">Position</div><div class="comp-row-val">${escapeHtml(c.position)}</div></div>
          <div class="comp-row"><div class="comp-row-label">Strength</div><div class="comp-row-val">${escapeHtml(c.strength)}</div></div>
          <div class="comp-row"><div class="comp-row-label">Gap</div><div class="comp-row-val">${escapeHtml(c.weakness)}</div></div>
        </div>`).join('')}
    </div>

    ${ct.campaign_thought ? `
    <div class="section section-creative">
      <h3>Creative territory</h3>
      <div class="campaign-thought">"${escapeHtml(ct.campaign_thought)}"</div>
      ${voicePills ? `<div class="kv-label" style="margin-top:16px;">Brand voice</div><div class="voice-pills">${voicePills}</div>` : ''}
      ${keyMessages ? `<div class="kv-label" style="margin-top:16px;">Key messages by audience</div>${keyMessages}` : ''}
    </div>` : ''}

    <div class="section">
      <h3>Key trigger points across the year</h3>
      ${d.trigger_calendar.map(t => `
        <div class="trigger">
          <div class="trigger-head">
            <span class="month-badge ${escapeHtml(t.priority)}">${escapeHtml(t.month_labels)}</span>
            <span class="trigger-name">${escapeHtml(t.name)}</span>
            <span class="trigger-priority">· ${escapeHtml(t.priority)} priority</span>
          </div>
          ${monthGrid(t.months)}
          <div class="trigger-rationale">${escapeHtml(t.rationale)}</div>
        </div>`).join('')}
    </div>

    <div class="section">
      <h3>Budget split per channel</h3>
      <div class="muted small" style="margin-bottom: 14px;">Total: ${sym}${Number(pitchInputs.budget).toLocaleString()}</div>
      ${d.budget_split.map(b => `
        <div class="budget-row">
          <div class="budget-head">
            <div class="budget-label">${escapeHtml(b.channel)}</div>
            <div class="budget-track"><div class="budget-fill" style="width: ${b.pct}%"></div></div>
            <div class="budget-val">${Math.round(b.pct)}% · ${sym}${Math.round(b.amount).toLocaleString()}</div>
          </div>
          <div class="budget-rationale">${escapeHtml(b.rationale)}</div>
        </div>`).join('')}
    </div>
  `;

  $('result-view').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ------------------------------------------------------------
// PPTX Export
// ------------------------------------------------------------
function exportToSlides() {
  if (!pitchData || typeof PptxGenJS === 'undefined') return;

  const d          = pitchData;
  const sym        = pitchInputs.currencySymbol || '£';
  const agencyName = getAgency();
  const pptx       = new PptxGenJS();
  pptx.layout      = 'LAYOUT_WIDE';

  const DARK     = '1A1A1A';
  const MUTED    = '6B6B6B';
  const ACCENT   = '185FA5';
  const BG       = 'FAFAF7';
  const LIGHT_BG = 'F4F3EE';

  function addHeader(slide, title) {
    slide.addText(title, { x: 0.6, y: 0.4, w: 12, h: 0.7, fontSize: 24, bold: true, color: DARK, fontFace: 'Calibri' });
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.15, w: 0.4, h: 0.04, fill: { color: ACCENT }, line: { color: ACCENT } });
  }

  // --- Slide 1: Title
  const s1 = pptx.addSlide();
  s1.background = { color: BG };
  s1.addText(agencyName, { x: 0.6, y: 2.2, w: 12, h: 0.5, fontSize: 13, color: MUTED, fontFace: 'Calibri' });
  s1.addText('New Business Pitch', { x: 0.6, y: 2.65, w: 12, h: 0.5, fontSize: 14, color: MUTED, fontFace: 'Calibri' });
  s1.addText(pitchInputs.url, { x: 0.6, y: 3.1, w: 12, h: 1.2, fontSize: 44, bold: true, color: DARK, fontFace: 'Calibri' });
  s1.addText(`${pitchInputs.industry}  ·  ${sym}${Number(pitchInputs.budget).toLocaleString()} annual budget`, { x: 0.6, y: 4.3, w: 12, h: 0.5, fontSize: 16, color: MUTED, fontFace: 'Calibri' });
  s1.addText(d.company_summary, { x: 0.6, y: 5.0, w: 11, h: 1.5, fontSize: 14, color: DARK, fontFace: 'Calibri' });

  // --- Slide 2: Market research
  const s2 = pptx.addSlide();
  s2.background = { color: BG };
  addHeader(s2, 'Market research');
  s2.addText(d.market_research.market_size, { x: 0.6, y: 1.3, w: 12, h: 0.8, fontSize: 14, color: DARK, fontFace: 'Calibri', italic: true });
  s2.addText('Key trends', { x: 0.6, y: 2.2, w: 6, h: 0.4, fontSize: 13, bold: true, color: MUTED, fontFace: 'Calibri' });
  s2.addText(d.market_research.key_trends.map(t => ({ text: t, options: { bullet: true } })), { x: 0.6, y: 2.6, w: 6, h: 3, fontSize: 13, color: DARK, fontFace: 'Calibri', valign: 'top' });
  s2.addText('Consumer shifts', { x: 6.9, y: 2.2, w: 6, h: 0.4, fontSize: 13, bold: true, color: MUTED, fontFace: 'Calibri' });
  s2.addText(d.market_research.consumer_shifts.map(t => ({ text: t, options: { bullet: true } })), { x: 6.9, y: 2.6, w: 6, h: 3, fontSize: 13, color: DARK, fontFace: 'Calibri', valign: 'top' });
  s2.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 5.9, w: 12.1, h: 1.1, fill: { color: 'E1F5EE' }, line: { color: 'E1F5EE' } });
  s2.addText([{ text: 'Opportunity:  ', options: { bold: true, color: '04342C' } }, { text: d.market_research.opportunity, options: { color: '04342C' } }],
    { x: 0.85, y: 5.95, w: 11.6, h: 1, fontSize: 13, fontFace: 'Calibri', valign: 'middle' });

  // --- Slide 3: Audience segmentation
  const s3 = pptx.addSlide();
  s3.background = { color: BG };
  addHeader(s3, 'Audience segmentation');
  const cols = 2, gridX = 0.6, gridY = 1.4, gridW = 12.1, gridH = 5.6;
  const cellW = (gridW - 0.3) / cols, cellH = (gridH - 0.3) / 2;
  d.audience_segments.slice(0, 4).forEach((seg, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = gridX + col * (cellW + 0.3), y = gridY + row * (cellH + 0.3);
    s3.addShape(pptx.shapes.RECTANGLE, { x, y, w: cellW, h: cellH, fill: { color: LIGHT_BG }, line: { color: LIGHT_BG } });
    s3.addText(seg.name, { x: x + 0.2, y: y + 0.15, w: cellW - 1.2, h: 0.45, fontSize: 16, bold: true, color: DARK, fontFace: 'Calibri' });
    s3.addText(`${Math.round(seg.size_pct)}%`, { x: x + cellW - 1.1, y: y + 0.15, w: 0.9, h: 0.45, fontSize: 16, bold: true, color: ACCENT, fontFace: 'Calibri', align: 'right' });
    s3.addText(seg.description, { x: x + 0.2, y: y + 0.7, w: cellW - 0.4, h: cellH - 0.85, fontSize: 12, color: MUTED, fontFace: 'Calibri', valign: 'top' });
  });

  // --- Slide 4: Positioning vs competitors
  const s4 = pptx.addSlide();
  s4.background = { color: BG };
  addHeader(s4, 'Positioning vs competitors');
  s4.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.3, w: 12.1, h: 0.9, fill: { color: 'E6F1FB' }, line: { color: 'E6F1FB' } });
  s4.addText([{ text: 'Our recommended position:  ', options: { bold: true, color: '042C53' } }, { text: d.positioning.our_recommended_position, options: { color: '042C53' } }],
    { x: 0.85, y: 1.35, w: 11.6, h: 0.8, fontSize: 13, fontFace: 'Calibri', valign: 'middle' });
  const compRows = [[
    { text: 'Competitor', options: { bold: true, color: DARK, fill: { color: LIGHT_BG } } },
    { text: 'Position',   options: { bold: true, color: DARK, fill: { color: LIGHT_BG } } },
    { text: 'Strength',   options: { bold: true, color: DARK, fill: { color: LIGHT_BG } } },
    { text: 'Gap',        options: { bold: true, color: DARK, fill: { color: LIGHT_BG } } }
  ]];
  d.positioning.competitor_analysis.forEach(c => {
    compRows.push([
      { text: c.name,     options: { bold: true, color: DARK } },
      { text: c.position, options: { color: DARK } },
      { text: c.strength, options: { color: DARK } },
      { text: c.weakness, options: { color: DARK } }
    ]);
  });
  s4.addTable(compRows, { x: 0.6, y: 2.5, w: 12.1, colW: [2.2, 3.8, 3.05, 3.05], fontSize: 11, fontFace: 'Calibri', border: { type: 'solid', color: 'E6E4DD', pt: 0.5 }, valign: 'top' });

  // --- Slide 5: Creative territory
  const ct = d.creative_territory;
  if (ct) {
    const s5 = pptx.addSlide();
    s5.background = { color: BG };
    addHeader(s5, 'Creative territory');
    s5.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.3, w: 12.1, h: 1.2, fill: { color: LIGHT_BG }, line: { color: LIGHT_BG } });
    s5.addText(`"${ct.campaign_thought}"`, { x: 0.85, y: 1.35, w: 11.6, h: 1.1, fontSize: 18, bold: true, color: DARK, fontFace: 'Calibri', italic: true, valign: 'middle' });
    s5.addText('Brand voice', { x: 0.6, y: 2.7, w: 12, h: 0.4, fontSize: 13, bold: true, color: MUTED, fontFace: 'Calibri' });
    s5.addText((ct.brand_voice || []).join('  ·  '), { x: 0.6, y: 3.1, w: 12, h: 0.5, fontSize: 15, bold: true, color: ACCENT, fontFace: 'Calibri' });
    s5.addText('Key messages by audience', { x: 0.6, y: 3.8, w: 12, h: 0.4, fontSize: 13, bold: true, color: MUTED, fontFace: 'Calibri' });
    const msgRows = (ct.key_messages || []).map(m => [
      { text: m.segment,           options: { bold: true, color: DARK } },
      { text: `"${m.message}"`,    options: { color: MUTED, italic: true } }
    ]);
    if (msgRows.length) {
      s5.addTable(msgRows, { x: 0.6, y: 4.2, w: 12.1, colW: [3.5, 8.6], fontSize: 11, fontFace: 'Calibri', border: { type: 'solid', color: 'E6E4DD', pt: 0.5 }, valign: 'top' });
    }
  }

  // --- Slide 6: Trigger calendar
  const s6 = pptx.addSlide();
  s6.background = { color: BG };
  addHeader(s6, 'Key trigger points across the year');
  const triggers = d.trigger_calendar;
  const tHeight  = Math.min(0.6, 5.5 / triggers.length);
  triggers.forEach((t, i) => {
    const y = 1.3 + i * (tHeight + 0.15);
    s6.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y, w: 12.1, h: tHeight, fill: { color: LIGHT_BG }, line: { color: LIGHT_BG } });
    const priorityColor = t.priority === 'high' ? '993556' : t.priority === 'medium' ? '854F0B' : '6B6B6B';
    s6.addText(t.month_labels, { x: 0.75, y: y + 0.08, w: 1.4, h: tHeight - 0.16, fontSize: 11, bold: true, color: priorityColor, fontFace: 'Calibri', valign: 'middle' });
    s6.addText(t.name,         { x: 2.2,  y: y + 0.08, w: 4,   h: tHeight - 0.16, fontSize: 13, bold: true, color: DARK,          fontFace: 'Calibri', valign: 'middle' });
    s6.addText(t.rationale,    { x: 6.3,  y: y + 0.08, w: 6.3, h: tHeight - 0.16, fontSize: 11,             color: MUTED,         fontFace: 'Calibri', valign: 'middle' });
  });

  // --- Slide 7: Budget split
  const s7 = pptx.addSlide();
  s7.background = { color: BG };
  addHeader(s7, `Budget split per channel  ·  ${sym}${Number(pitchInputs.budget).toLocaleString()}`);
  const budgets = d.budget_split;
  const bRowH   = Math.min(0.75, 5.5 / budgets.length);
  budgets.forEach((b, i) => {
    const y = 1.3 + i * (bRowH + 0.05);
    s7.addText(b.channel, { x: 0.6, y, w: 2.5, h: 0.35, fontSize: 13, bold: true, color: DARK, fontFace: 'Calibri', valign: 'top' });
    const trackX = 3.2, trackW = 6.5;
    s7.addShape(pptx.shapes.RECTANGLE, { x: trackX, y: y + 0.08, w: trackW,                  h: 0.18, fill: { color: LIGHT_BG }, line: { color: LIGHT_BG } });
    s7.addShape(pptx.shapes.RECTANGLE, { x: trackX, y: y + 0.08, w: trackW * (b.pct / 100), h: 0.18, fill: { color: ACCENT },   line: { color: ACCENT } });
    s7.addText(`${Math.round(b.pct)}%  ·  ${sym}${Math.round(b.amount).toLocaleString()}`, { x: 9.8, y, w: 2.9, h: 0.35, fontSize: 12, color: DARK, fontFace: 'Calibri', align: 'right', valign: 'top' });
    s7.addText(b.rationale, { x: 0.6, y: y + 0.35, w: 12.1, h: bRowH - 0.35, fontSize: 10, color: MUTED, fontFace: 'Calibri', italic: true, valign: 'top' });
  });

  // --- Slide 8: Close
  const s8 = pptx.addSlide();
  s8.background = { color: DARK };
  s8.addText("Let's build it.", { x: 0.6, y: 3.0, w: 12, h: 1.5, fontSize: 54, bold: true, color: 'FFFFFF', fontFace: 'Calibri' });
  s8.addText('Next steps: align on scope, contract, kick-off.', { x: 0.6, y: 4.4, w: 12, h: 0.6, fontSize: 16, color: 'B4B2A9', fontFace: 'Calibri' });
  s8.addText(agencyName, { x: 0.6, y: 6.8, w: 12, h: 0.4, fontSize: 12, color: '6B6B6B', fontFace: 'Calibri' });

  const safeName = pitchInputs.url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '_').slice(0, 40);
  pptx.writeFile({ fileName: `pitch_${safeName}.pptx` });
}

// ------------------------------------------------------------
// Initialise
// ------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  refreshAgencyUI();
  refreshCurrencyUI();
  if (!getApiKey()) openSettings();
});
