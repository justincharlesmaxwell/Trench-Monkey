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
  const el = $('agency-title');
  if (el) {
    const words = name.split(' ');
    if (words.length >= 2) {
      el.innerHTML = `<span style="color:#17a8f1">${escapeHtml(words[0])}</span> <span style="color:#ff9614">${escapeHtml(words.slice(1).join(' '))}</span>`;
    } else {
      el.innerHTML = `<span style="color:#094cb2">${escapeHtml(name)}</span>`;
    }
  }
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
    $('key-status').style.color  = '#ba1a1a';
    return;
  }

  if (key) setApiKey(key);
  setAgency(agency);
  setCurrency(cur);
  refreshAgencyUI();
  refreshCurrencyUI();

  $('key-status').textContent = 'Saved.';
  $('key-status').style.color = '#0f6e56';
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
      <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-xl mb-2 hover:bg-surface-container transition-all">
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-sm text-primary truncate">${escapeHtml(h.inputs.url)}</div>
          <div class="flex items-center gap-2 mt-1">
            <span class="bg-surface-container px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wider text-on-surface-variant">${escapeHtml(h.inputs.industry)}</span>
            <span class="text-xs text-on-surface-variant">${cur.symbol}${Number(h.inputs.budget).toLocaleString()} · ${date} ${time}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0 ml-3">
          <button class="history-load-btn px-3 py-2 text-xs bg-primary-fixed text-on-primary-container rounded-lg hover:bg-primary text-primary hover:text-on-primary transition-colors font-semibold" data-id="${h.id}">Load</button>
          <button class="history-del-btn flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container hover:bg-error-container text-on-surface-variant hover:text-error transition-colors" data-id="${h.id}" title="Delete">
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
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
      model: 'claude-opus-4-7',
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
  "search_trends": {
    "top_queries": [
      {"query": "search term", "direction": "rising", "insight": "1 sentence on what this tells us about consumer intent"}
    ],
    "seasonal_peaks": ["e.g. January sees high search intent around X — 1 sentence"],
    "emerging_topics": ["emerging topic 1", "emerging topic 2", "emerging topic 3"],
    "strategic_implication": "1-2 sentences on how to use these search trends in paid search and content strategy"
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
- search_trends.top_queries: 5-8 entries. direction must be exactly "rising", "stable", or "declining". Base on known search behaviour patterns for this industry.
- search_trends.seasonal_peaks: 2-4 entries describing when search volume peaks and why
- search_trends.emerging_topics: 3-5 short topic labels representing newer or growing search areas
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
  return '<div class="grid grid-cols-12 gap-1 mt-2">' + labels.map((l, i) => {
    const active = months.includes(i + 1);
    return `<div class="text-center py-1 rounded text-[10px] font-semibold ${active ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}">${l}</div>`;
  }).join('') + '</div>';
}

function accordion(icon, title, content) {
  return `
    <div class="group expanded rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden" onclick="toggleAccordion(this)">
      <div class="p-6 flex items-center justify-between cursor-pointer select-none">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-primary">${icon}</span>
          <h2 class="font-headline-md text-headline-md">${title}</h2>
        </div>
        <span class="material-symbols-outlined chevron text-on-surface-variant">expand_more</span>
      </div>
      <div class="collapse-content px-6 pb-6">
        <div class="pt-4 border-t border-outline-variant/30">${content}</div>
      </div>
    </div>`;
}

function showResult() {
  const d   = pitchData;
  const sym = pitchInputs.currencySymbol || '£';

  $('result-title').textContent = pitchInputs.url;
  $('result-meta').textContent  = `${pitchInputs.industry} · ${sym}${Number(pitchInputs.budget).toLocaleString()} · vs ${pitchInputs.competitors}`;

  const ct = d.creative_territory || {};

  const voicePills = (ct.brand_voice || []).map(v =>
    `<span class="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold uppercase tracking-wider">${escapeHtml(v)}</span>`
  ).join('');

  const keyMessages = (ct.key_messages || []).map(m => `
    <div class="p-4 bg-surface-container rounded-xl mb-2">
      <div class="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mb-1">${escapeHtml(m.segment)}</div>
      <div class="text-sm italic">"${escapeHtml(m.message)}"</div>
    </div>`).join('');

  const marketContent = `
    <p class="text-sm text-on-surface-variant mb-4 leading-relaxed">${escapeHtml(d.market_research.market_size)}</p>
    <p class="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant mb-2">Key trends</p>
    <ul class="list-disc list-inside space-y-1 mb-4 text-sm">${d.market_research.key_trends.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
    <p class="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant mb-2">Consumer shifts</p>
    <ul class="list-disc list-inside space-y-1 mb-4 text-sm">${d.market_research.consumer_shifts.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
    <div class="p-4 bg-surface-container rounded-lg border-l-4 border-primary text-sm">
      <span class="font-semibold">Opportunity:</span> ${escapeHtml(d.market_research.opportunity)}
    </div>`;

  const segmentsContent = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${d.audience_segments.map(s => `
        <div class="p-4 bg-surface-container rounded-xl">
          <div class="flex justify-between items-start mb-2">
            <span class="font-semibold text-sm">${escapeHtml(s.name)}</span>
            <span class="text-xs text-on-surface-variant font-semibold bg-surface-container px-2 py-0.5 rounded-full">${Math.round(s.size_pct)}%</span>
          </div>
          <p class="text-xs text-on-surface-variant leading-relaxed">${escapeHtml(s.description)}</p>
        </div>`).join('')}
    </div>`;

  const competitorsContent = `
    <div class="p-4 bg-surface-container rounded-lg mb-4 text-sm">
      <span class="font-semibold">Our recommended position:</span>
      <p class="mt-1 text-on-surface-variant">${escapeHtml(d.positioning.our_recommended_position)}</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${d.positioning.competitor_analysis.map(c => `
        <div class="p-4 bg-surface-container rounded-xl">
          <p class="font-semibold text-sm mb-3">${escapeHtml(c.name)}</p>
          <div class="space-y-2">
            <div><p class="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Position</p><p class="text-xs leading-relaxed">${escapeHtml(c.position)}</p></div>
            <div><p class="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Strength</p><p class="text-xs leading-relaxed">${escapeHtml(c.strength)}</p></div>
            <div><p class="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Gap</p><p class="text-xs leading-relaxed">${escapeHtml(c.weakness)}</p></div>
          </div>
        </div>`).join('')}
    </div>`;

  const creativeContent = ct.campaign_thought ? `
    <div class="p-5 bg-surface-container rounded-lg mb-4">
      <p class="text-lg font-semibold italic leading-relaxed">"${escapeHtml(ct.campaign_thought)}"</p>
    </div>
    ${voicePills ? `<p class="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant mb-2">Brand voice</p><div class="flex flex-wrap gap-2 mb-4">${voicePills}</div>` : ''}
    ${keyMessages ? `<p class="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant mb-2">Key messages by audience</p>${keyMessages}` : ''}` : '';

  const st = d.search_trends || {};
  const directionBadge = dir => {
    const cfg = {
      rising:   { cls: 'bg-green-100 text-green-800',  icon: 'trending_up' },
      stable:   { cls: 'bg-surface-container text-on-surface-variant', icon: 'trending_flat' },
      declining:{ cls: 'bg-error-container text-on-error-container', icon: 'trending_down' }
    };
    const { cls, icon } = cfg[dir] || cfg.stable;
    return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cls}"><span class="material-symbols-outlined text-[12px]">${icon}</span>${escapeHtml(dir)}</span>`;
  };

  const searchTrendsContent = st.top_queries ? `
    <p class="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant mb-2">Top search queries</p>
    <div class="space-y-2 mb-5">
      ${(st.top_queries || []).map(q => `
        <div class="p-3 bg-surface-container rounded-xl flex items-start gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-sm">${escapeHtml(q.query)}</span>
              ${directionBadge(q.direction)}
            </div>
            <p class="text-xs text-on-surface-variant leading-relaxed">${escapeHtml(q.insight)}</p>
          </div>
        </div>`).join('')}
    </div>
    <p class="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant mb-2">Emerging topics</p>
    <div class="flex flex-wrap gap-2 mb-5">
      ${(st.emerging_topics || []).map(t => `<span class="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold">${escapeHtml(t)}</span>`).join('')}
    </div>
    <p class="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant mb-2">Seasonal patterns</p>
    <ul class="list-disc list-inside space-y-1 text-sm mb-5">${(st.seasonal_peaks || []).map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>
    <div class="p-4 bg-surface-container rounded-lg border-l-4 border-primary text-sm">
      <span class="font-semibold">Strategic implication:</span> ${escapeHtml(st.strategic_implication)}
    </div>` : '';

  const triggersContent = `
    <div class="space-y-3">
      ${d.trigger_calendar.map(t => `
        <div class="p-4 bg-surface-container rounded-xl">
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span class="inline-block px-2 py-1 rounded text-[10px] font-bold uppercase priority-${escapeHtml(t.priority)}">${escapeHtml(t.month_labels)}</span>
            <span class="font-semibold text-sm">${escapeHtml(t.name)}</span>
            <span class="text-xs text-on-surface-variant capitalize">· ${escapeHtml(t.priority)} priority</span>
          </div>
          ${monthGrid(t.months)}
          <p class="text-xs text-on-surface-variant mt-2 leading-relaxed">${escapeHtml(t.rationale)}</p>
        </div>`).join('')}
    </div>`;

  const budgetContent = `
    <p class="text-xs text-on-surface-variant mb-4">Total: ${sym}${Number(pitchInputs.budget).toLocaleString()}</p>
    <div class="space-y-5">
      ${d.budget_split.map(b => `
        <div>
          <div class="flex justify-between items-end mb-1">
            <span class="text-sm font-semibold">${escapeHtml(b.channel)}</span>
            <span class="text-xs text-on-surface-variant">${Math.round(b.pct)}% · ${sym}${Math.round(b.amount).toLocaleString()}</span>
          </div>
          <div class="w-full h-2.5 bg-surface-container rounded-full overflow-hidden mb-1">
            <div class="h-full bg-primary rounded-full" style="width:${b.pct}%"></div>
          </div>
          <p class="text-xs text-on-surface-variant italic">${escapeHtml(b.rationale)}</p>
        </div>`).join('')}
    </div>`;

  $('result-content').innerHTML = `
    <div class="rounded-xl bg-surface-container-lowest shadow-sm p-6">
      <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mb-2" style="letter-spacing:0.07em;">About this brand</p>
      <p class="text-base text-on-surface leading-relaxed font-['Noto_Serif']">${escapeHtml(d.company_summary)}</p>
    </div>
    ${accordion('bar_chart', 'Market research', marketContent)}
    ${accordion('groups', 'Audience segments', segmentsContent)}
    ${accordion('compare', 'Competitor positioning', competitorsContent)}
    ${ct.campaign_thought ? accordion('auto_awesome', 'Creative territory', creativeContent) : ''}
    ${st.top_queries ? accordion('search', 'Search trend analysis', searchTrendsContent) : ''}
    ${accordion('calendar_month', 'Key trigger points', triggersContent)}
    ${accordion('payments', 'Budget split per channel', budgetContent)}
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

  // Palette
  const C = {
    navy:    '0F172A',
    blue:    '2563EB',
    blueMid: '3B82F6',
    blueLight: 'DBEAFE',
    white:   'FFFFFF',
    offWhite:'F8FAFC',
    slate:   '64748B',
    slateLight: 'F1F5F9',
    border:  'E2E8F0',
    green:   '16A34A',
    amber:   'D97706',
    red:     'DC2626',
    dark:    '1E293B',
  };

  // Slide canvas is 13.33 × 7.5 inches (LAYOUT_WIDE)
  const W = 13.33;

  function navyHeader(slide, title, subtitle) {
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 1.1, fill: { color: C.navy }, line: { color: C.navy } });
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 0.88, w: 0.5, h: 0.06, fill: { color: C.blue }, line: { color: C.blue } });
    slide.addText(title, { x: 0.6, y: 0.2, w: 10, h: 0.65, fontSize: 28, bold: true, color: C.white, fontFace: 'Calibri' });
    if (subtitle) {
      slide.addText(subtitle, { x: 0.6, y: 0.72, w: 12, h: 0.28, fontSize: 9, color: '94A3B8', fontFace: 'Calibri', italic: true });
    }
  }

  function label(slide, text, x, y, w) {
    slide.addText(text.toUpperCase(), { x, y, w: w || 6, h: 0.25, fontSize: 8, bold: true, color: C.slate, fontFace: 'Calibri', charSpacing: 1.5 });
  }

  function rule(slide, x, y, w) {
    slide.addShape(pptx.shapes.RECTANGLE, { x, y, w, h: 0.015, fill: { color: C.border }, line: { color: C.border } });
  }

  // ── SLIDE 1: Title (split layout) ────────────────────────────
  const s1 = pptx.addSlide();
  s1.background = { color: C.offWhite };

  s1.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 5.6, h: 7.5, fill: { color: C.navy }, line: { color: C.navy } });
  s1.addShape(pptx.shapes.RECTANGLE, { x: 5.6, y: 0, w: 0.07, h: 7.5, fill: { color: C.blue }, line: { color: C.blue } });

  s1.addText('NEW BUSINESS PITCH', { x: 0.55, y: 1.8, w: 4.7, h: 0.35, fontSize: 9, bold: true, color: C.blue, fontFace: 'Calibri', charSpacing: 3 });
  s1.addText(pitchInputs.url.replace(/https?:\/\//, ''), { x: 0.55, y: 2.2, w: 4.7, h: 1.9, fontSize: 34, bold: true, color: C.white, fontFace: 'Calibri', valign: 'top' });
  s1.addText(pitchInputs.industry, { x: 0.55, y: 4.2, w: 4.7, h: 0.4, fontSize: 14, color: 'CBD5E1', fontFace: 'Calibri' });
  s1.addText(`${sym}${Number(pitchInputs.budget).toLocaleString()} annual budget`, { x: 0.55, y: 4.6, w: 4.7, h: 0.35, fontSize: 12, color: '94A3B8', fontFace: 'Calibri' });
  s1.addText(agencyName, { x: 0.55, y: 6.95, w: 4.7, h: 0.3, fontSize: 10, color: '475569', fontFace: 'Calibri' });

  label(s1, 'About the prospect', 6.0, 2.1, 6.8);
  rule(s1, 6.0, 2.38, 6.8);
  s1.addText(d.company_summary, { x: 6.0, y: 2.5, w: 6.8, h: 3.8, fontSize: 15, color: C.dark, fontFace: 'Calibri', valign: 'top' });

  // ── SLIDE 2: Market Research ──────────────────────────────────
  const s2 = pptx.addSlide();
  s2.background = { color: C.offWhite };
  navyHeader(s2, 'Market Research', pitchInputs.industry);

  s2.addText(d.market_research.market_size, { x: 0.6, y: 1.2, w: 12.1, h: 0.75, fontSize: 13, color: C.slate, fontFace: 'Calibri', italic: true });

  label(s2, 'Key Trends', 0.6, 2.05);
  rule(s2, 0.6, 2.32, 5.85);
  s2.addText(d.market_research.key_trends.map(t => ({ text: t, options: { bullet: true } })),
    { x: 0.6, y: 2.42, w: 5.85, h: 3.0, fontSize: 12, color: C.dark, fontFace: 'Calibri', valign: 'top', paraSpaceAfter: 4 });

  label(s2, 'Consumer Shifts', 7.05, 2.05);
  rule(s2, 7.05, 2.32, 5.85);
  s2.addText(d.market_research.consumer_shifts.map(t => ({ text: t, options: { bullet: true } })),
    { x: 7.05, y: 2.42, w: 5.85, h: 3.0, fontSize: 12, color: C.dark, fontFace: 'Calibri', valign: 'top', paraSpaceAfter: 4 });

  s2.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 5.75, w: 12.1, h: 1.4, fill: { color: C.blue }, line: { color: C.blue } });
  s2.addText([
    { text: 'OPPORTUNITY  ', options: { bold: true, color: C.white, charSpacing: 1.5 } },
    { text: d.market_research.opportunity, options: { color: C.blueLight } }
  ], { x: 0.85, y: 5.82, w: 11.7, h: 1.26, fontSize: 13, fontFace: 'Calibri', valign: 'middle' });

  // ── SLIDE 3: Audience Segmentation ───────────────────────────
  const s3 = pptx.addSlide();
  s3.background = { color: C.offWhite };
  navyHeader(s3, 'Audience Segmentation');

  const cardW = 5.9, cardH = 2.72;
  const cardPos = [{ x: 0.6, y: 1.25 }, { x: 6.73, y: 1.25 }, { x: 0.6, y: 4.1 }, { x: 6.73, y: 4.1 }];
  d.audience_segments.slice(0, 4).forEach((seg, i) => {
    const { x, y } = cardPos[i];
    slide_addSegCard(s3, seg, x, y, cardW, cardH);
  });

  function slide_addSegCard(slide, seg, x, y, cW, cH) {
    slide.addShape(pptx.shapes.RECTANGLE, { x, y, w: cW, h: cH, fill: { color: C.white }, line: { color: C.border, pt: 1 } });
    slide.addShape(pptx.shapes.RECTANGLE, { x, y, w: cW, h: 0.07, fill: { color: C.blue }, line: { color: C.blue } });
    slide.addText(`${Math.round(seg.size_pct)}%`, { x: x + cW - 1.3, y: y + 0.12, w: 1.1, h: 0.6, fontSize: 30, bold: true, color: C.blue, fontFace: 'Calibri', align: 'right' });
    slide.addText(seg.name, { x: x + 0.2, y: y + 0.12, w: cW - 1.6, h: 0.6, fontSize: 16, bold: true, color: C.navy, fontFace: 'Calibri', valign: 'middle' });
    slide.addText(seg.description, { x: x + 0.2, y: y + 0.78, w: cW - 0.4, h: cH - 0.95, fontSize: 11, color: C.slate, fontFace: 'Calibri', valign: 'top' });
  }

  // ── SLIDE 4: Competitor Positioning ──────────────────────────
  const s4 = pptx.addSlide();
  s4.background = { color: C.offWhite };
  navyHeader(s4, 'Competitor Positioning');

  s4.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.2, w: 12.1, h: 1.0, fill: { color: C.blueLight }, line: { color: C.blueLight } });
  s4.addText([
    { text: 'OUR POSITION  ', options: { bold: true, color: C.blue, charSpacing: 1.5 } },
    { text: d.positioning.our_recommended_position, options: { color: C.navy } }
  ], { x: 0.85, y: 1.25, w: 11.7, h: 0.9, fontSize: 13, fontFace: 'Calibri', valign: 'middle' });

  const compHeader = [
    { text: 'COMPETITOR', options: { bold: true, color: C.white, fill: { color: C.navy } } },
    { text: 'POSITION',   options: { bold: true, color: C.white, fill: { color: C.navy } } },
    { text: 'STRENGTH',   options: { bold: true, color: C.white, fill: { color: C.navy } } },
    { text: 'GAP TO EXPLOIT', options: { bold: true, color: C.white, fill: { color: C.navy } } }
  ];
  const compBody = d.positioning.competitor_analysis.map((c, i) => {
    const bg = i % 2 === 0 ? C.white : C.slateLight;
    return [
      { text: c.name,     options: { bold: true, color: C.dark,  fill: { color: bg } } },
      { text: c.position, options: { color: C.slate, fill: { color: bg } } },
      { text: c.strength, options: { color: C.slate, fill: { color: bg } } },
      { text: c.weakness, options: { color: C.slate, fill: { color: bg } } }
    ];
  });
  s4.addTable([compHeader, ...compBody], {
    x: 0.6, y: 2.35, w: 12.1, colW: [2.2, 3.8, 3.0, 3.1],
    fontSize: 11, fontFace: 'Calibri', valign: 'top',
    border: { type: 'solid', color: C.border, pt: 0.5 }, rowH: 0.55
  });

  // ── SLIDE 5: Creative Territory (dark slide) ──────────────────
  const ct = d.creative_territory;
  if (ct && ct.campaign_thought) {
    const s5 = pptx.addSlide();
    s5.background = { color: C.navy };

    label(s5, 'Creative Territory', 0.6, 0.5, 12);
    s5.addText(`"${ct.campaign_thought}"`, {
      x: 0.6, y: 0.85, w: 12.1, h: 2.6,
      fontSize: 30, bold: true, italic: true, color: C.white, fontFace: 'Calibri', valign: 'middle'
    });

    label(s5, 'Brand Voice', 0.6, 3.65, 12);
    (ct.brand_voice || []).forEach((v, i) => {
      s5.addShape(pptx.shapes.RECTANGLE, { x: 0.6 + i * 2.3, y: 3.92, w: 2.1, h: 0.44, fill: { color: C.blue }, line: { color: C.blue } });
      s5.addText(v.toUpperCase(), { x: 0.6 + i * 2.3, y: 3.92, w: 2.1, h: 0.44, fontSize: 10, bold: true, color: C.white, fontFace: 'Calibri', align: 'center', valign: 'middle', charSpacing: 1 });
    });

    label(s5, 'Key Messages by Audience', 0.6, 4.55, 12);
    rule(s5, 0.6, 4.8, 12.1);
    const msgRows = (ct.key_messages || []).map((m, i) => {
      const bg = i % 2 === 0 ? '1E293B' : '0F172A';
      return [
        { text: m.segment,       options: { bold: true, color: C.white,  fill: { color: bg } } },
        { text: `"${m.message}"`, options: { italic: true, color: '94A3B8', fill: { color: bg } } }
      ];
    });
    if (msgRows.length) {
      s5.addTable(msgRows, { x: 0.6, y: 4.9, w: 12.1, colW: [3.5, 8.6], fontSize: 11, fontFace: 'Calibri', valign: 'top', border: { type: 'solid', color: '334155', pt: 0.5 }, rowH: 0.44 });
    }
  }

  // ── SLIDE 6: Search Trend Analysis ───────────────────────────
  const st = d.search_trends;
  if (st && st.top_queries && st.top_queries.length) {
    const s6 = pptx.addSlide();
    s6.background = { color: C.offWhite };
    navyHeader(s6, 'Search Trend Analysis', 'Based on known search behaviour patterns for this industry');

    const dirCfg = {
      rising:   { color: C.green,  icon: '▲' },
      declining:{ color: C.red,    icon: '▼' },
      stable:   { color: C.slate,  icon: '─' }
    };

    label(s6, 'Top Queries', 0.6, 1.2, 7.6);
    rule(s6, 0.6, 1.46, 7.6);
    (st.top_queries || []).slice(0, 6).forEach((q, i) => {
      const y = 1.56 + i * 0.72;
      const dc = dirCfg[q.direction] || dirCfg.stable;
      s6.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y, w: 7.6, h: 0.64, fill: { color: i % 2 === 0 ? C.white : C.slateLight }, line: { color: C.border, pt: 0.5 } });
      s6.addText(dc.icon, { x: 0.68, y: y + 0.08, w: 0.35, h: 0.48, fontSize: 13, bold: true, color: dc.color, fontFace: 'Calibri', valign: 'middle', align: 'center' });
      s6.addText(q.query, { x: 1.1, y: y + 0.06, w: 2.9, h: 0.28, fontSize: 12, bold: true, color: C.dark, fontFace: 'Calibri' });
      s6.addText(q.direction.toUpperCase(), { x: 1.1, y: y + 0.36, w: 2.0, h: 0.2, fontSize: 8, bold: true, color: dc.color, fontFace: 'Calibri', charSpacing: 1 });
      s6.addText(q.insight, { x: 4.05, y: y + 0.06, w: 4.1, h: 0.52, fontSize: 10, color: C.slate, fontFace: 'Calibri', valign: 'middle' });
    });

    label(s6, 'Emerging Topics', 8.55, 1.2, 4.3);
    rule(s6, 8.55, 1.46, 4.3);
    (st.emerging_topics || []).forEach((t, i) => {
      const ex = 8.55 + (i % 2) * 2.2, ey = 1.56 + Math.floor(i / 2) * 0.56;
      s6.addShape(pptx.shapes.RECTANGLE, { x: ex, y: ey, w: 2.05, h: 0.44, fill: { color: C.blueLight }, line: { color: C.blueLight } });
      s6.addText(t, { x: ex, y: ey, w: 2.05, h: 0.44, fontSize: 10, bold: true, color: C.blue, fontFace: 'Calibri', align: 'center', valign: 'middle' });
    });

    label(s6, 'Seasonal Patterns', 8.55, 3.4, 4.3);
    rule(s6, 8.55, 3.66, 4.3);
    (st.seasonal_peaks || []).forEach((p, i) => {
      s6.addText(`• ${p}`, { x: 8.55, y: 3.76 + i * 0.56, w: 4.3, h: 0.5, fontSize: 10, color: C.dark, fontFace: 'Calibri', valign: 'top' });
    });

    s6.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 6.1, w: 12.1, h: 1.05, fill: { color: C.blue }, line: { color: C.blue } });
    s6.addText([
      { text: 'STRATEGIC IMPLICATION  ', options: { bold: true, color: C.white, charSpacing: 1.5 } },
      { text: st.strategic_implication, options: { color: C.blueLight } }
    ], { x: 0.85, y: 6.16, w: 11.7, h: 0.93, fontSize: 12, fontFace: 'Calibri', valign: 'middle' });
  }

  // ── SLIDE 7: Trigger Calendar ─────────────────────────────────
  const s7 = pptx.addSlide();
  s7.background = { color: C.offWhite };
  navyHeader(s7, 'Key Trigger Points');

  const triggers   = d.trigger_calendar;
  const tH         = Math.min(0.64, 5.85 / triggers.length);
  const priorityCfg = {
    high:   { bar: C.red,   text: 'DC2626' },
    medium: { bar: C.amber, text: 'D97706' },
    low:    { bar: C.slate, text: C.slate }
  };

  triggers.forEach((t, i) => {
    const y    = 1.22 + i * (tH + 0.07);
    const pcfg = priorityCfg[t.priority] || priorityCfg.low;
    s7.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y, w: 12.1, h: tH, fill: { color: i % 2 === 0 ? C.white : C.slateLight }, line: { color: C.border, pt: 0.5 } });
    s7.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y, w: 0.07, h: tH, fill: { color: pcfg.bar }, line: { color: pcfg.bar } });
    s7.addText(t.month_labels, { x: 0.78, y: y + 0.04, w: 1.5, h: tH - 0.08, fontSize: 11, bold: true, color: pcfg.text, fontFace: 'Calibri', valign: 'middle' });
    s7.addText(t.name,         { x: 2.4,  y: y + 0.04, w: 4.0, h: tH - 0.08, fontSize: 13, bold: true, color: C.dark,     fontFace: 'Calibri', valign: 'middle' });
    s7.addText(t.rationale,    { x: 6.55, y: y + 0.04, w: 6.1, h: tH - 0.08, fontSize: 11,             color: C.slate,    fontFace: 'Calibri', valign: 'middle' });
  });

  // ── SLIDE 8: Budget Split (list + doughnut chart) ─────────────
  const s8 = pptx.addSlide();
  s8.background = { color: C.offWhite };
  navyHeader(s8, `Budget Split  ·  ${sym}${Number(pitchInputs.budget).toLocaleString()}`);

  const budgets = d.budget_split;
  const bH      = Math.min(0.74, 5.85 / budgets.length);

  budgets.forEach((b, i) => {
    const y = 1.22 + i * (bH + 0.04);
    s8.addText(b.channel, { x: 0.6, y, w: 3.5, h: 0.34, fontSize: 13, bold: true, color: C.dark, fontFace: 'Calibri' });
    s8.addText(`${Math.round(b.pct)}%  ·  ${sym}${Math.round(b.amount).toLocaleString()}`, { x: 3.5, y, w: 2.5, h: 0.34, fontSize: 11, color: C.slate, fontFace: 'Calibri', align: 'right' });
    s8.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: y + 0.37, w: 5.5, h: 0.15, fill: { color: C.border }, line: { color: C.border } });
    s8.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: y + 0.37, w: 5.5 * (b.pct / 100), h: 0.15, fill: { color: C.blue }, line: { color: C.blue } });
    if (bH > 0.56) {
      s8.addText(b.rationale, { x: 0.6, y: y + 0.55, w: 5.9, h: bH - 0.55, fontSize: 9, color: C.slate, fontFace: 'Calibri', italic: true, valign: 'top' });
    }
  });

  s8.addChart(pptx.charts.DOUGHNUT, [{
    name: 'Budget',
    labels: budgets.map(b => b.channel),
    values: budgets.map(b => Math.round(b.pct))
  }], {
    x: 7.0, y: 1.1, w: 5.9, h: 5.9,
    holeSize: 55,
    showLegend: true, legendPos: 'b', legendFontSize: 10, legendFontFace: 'Calibri',
    showLabel: false, showValue: false, showPercent: true,
    dataLabelFontSize: 10, dataLabelFontFace: 'Calibri',
    chartColors: ['2563EB','3B82F6','60A5FA','93C5FD','1D4ED8','BFDBFE','1E40AF'],
    showTitle: false,
  });

  // ── SLIDE 9: Close ────────────────────────────────────────────
  const s9 = pptx.addSlide();
  s9.background = { color: C.navy };
  s9.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 2.55, w: 1.1, h: 0.07, fill: { color: C.blue }, line: { color: C.blue } });
  s9.addText("Let's build it.", { x: 0.6, y: 2.7, w: 12.1, h: 2.0, fontSize: 62, bold: true, color: C.white, fontFace: 'Calibri' });
  s9.addText('Next steps: align on scope  ·  contract  ·  kick-off', { x: 0.6, y: 4.65, w: 12.1, h: 0.5, fontSize: 16, color: '94A3B8', fontFace: 'Calibri' });
  s9.addText(agencyName, { x: 0.6, y: 6.95, w: 12.1, h: 0.3, fontSize: 10, color: '475569', fontFace: 'Calibri' });

  const safeName = pitchInputs.url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '_').slice(0, 40);
  pptx.writeFile({ fileName: `pitch_${safeName}.pptx` });
}

// ------------------------------------------------------------
// Accordion toggle (used by result sections)
// ------------------------------------------------------------
function toggleAccordion(el) {
  el.classList.toggle('expanded');
}

// ------------------------------------------------------------
// Initialise
// ------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  refreshAgencyUI();
  refreshCurrencyUI();
  if (!getApiKey()) openSettings();
});
