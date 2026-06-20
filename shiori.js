/* ================================================================
   shiori.js — Tabi OS Shiori Page
   Modules: themeManager / linkGenerator / shioriRenderer / imageExporter
   ================================================================ */
'use strict';

function trackEvent(eventName, params = {}) {
  if (typeof gtag === "function") {
    gtag("event", eventName, params);
  }
}

/* ────────────────────────────────────────────────────────────────
   1. themeManager
──────────────────────────────────────────────────────────────── */
const themeManager = {

  getStoryGradient(title, concept) {
    const txt = ((title || '') + ' ' + (concept || '')).toLowerCase();
    if (/海|島|宮古|石垣|沖縄|マリン|珊瑚|サンゴ|beach|ocean/.test(txt))
      return 'linear-gradient(160deg, #B8DCF5 0%, #94C8EC 30%, #C8E8F8 65%, #E4F4FC 100%)';
    if (/京都|奈良|鎌倉|寺|神社|和|抹茶|着物|茶道/.test(txt))
      return 'linear-gradient(160deg, #FAF0E2 0%, #F0E0C4 30%, #E8D0A8 65%, #FDF6EC 100%)';
    if (/北海道|森|山|自然|高原|緑|湖|キャンプ/.test(txt))
      return 'linear-gradient(160deg, #DCF0DC 0%, #C4E4C4 30%, #B4DAB8 65%, #E8F5E8 100%)';
    if (/東京|大阪|夜|都市|夜景|ネオン|渋谷|新宿/.test(txt))
      return 'linear-gradient(160deg, #E8E0F8 0%, #D8D0F0 30%, #CAC0E8 65%, #F0ECF8 100%)';
    if (/韓国|ソウル|釜山|仁川/.test(txt))
      return 'linear-gradient(160deg, #FCE8EE 0%, #F8D0DC 30%, #F0C0CC 65%, #FFF0F4 100%)';
    if (/台湾|台北|高雄/.test(txt))
      return 'linear-gradient(160deg, #FFF0D8 0%, #FCDCA8 30%, #F8CC90 65%, #FFF8EC 100%)';
    // Default: warm peach-cream
    return 'linear-gradient(160deg, #FAF0E8 0%, #F0E0D0 30%, #E8D4C0 65%, #FDF8F2 100%)';
  },

  getDayBg(dayNum) {
    const bgs = [
      'rgba(228, 240, 255, 0.80)',
      'rgba(255, 243, 228, 0.80)',
      'rgba(228, 255, 240, 0.80)',
      'rgba(248, 228, 255, 0.80)',
      'rgba(255, 248, 228, 0.80)'
    ];
    return bgs[(dayNum - 1) % bgs.length];
  }
};

/* ────────────────────────────────────────────────────────────────
   2. linkGenerator
──────────────────────────────────────────────────────────────── */
const linkGenerator = {
  maps(place, area) {
    const q = (area && !place.includes(area)) ? `${place} ${area}` : place;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  },
  instagram(place) {
    return `https://www.google.com/search?q=${encodeURIComponent(place + ' Instagram')}`;
  },
  tabelog(place) {
    return `https://www.google.com/search?q=${encodeURIComponent(place + ' 食べログ')}`;
  }
};

const personalityCatalog = {
  PAVL: { name:'旅演出家', tagline:'旅全体の世界観を作り込むタイプ' },
  PAVS: { name:'景色収集家', tagline:'絶景・映えスポットを賢くコレクションするタイプ' },
  PAEL: { name:'感性探訪家', tagline:'土地の文化・アートに深くひたるタイプ' },
  PAES: { name:'路地開拓士', tagline:'まだ知られていない場所を計画的に開拓するタイプ' },
  PCVL: { name:'余白貴族', tagline:'何もしない時間も旅の楽しみなエレガントタイプ' },
  PCVS: { name:'カフェ漂流家', tagline:'カフェや美術館をスマートに巡るカルチャーサーファー' },
  PCEL: { name:'癒し滞在家', tagline:'最高の宿で心身をリセットするヒーリングタイプ' },
  PCES: { name:'静かな放浪家', tagline:'静かなローカルの時間に没頭するインドア旅人' },
  FAVL: { name:'夜更かし演出家', tagline:'直感とトキメキで夜の旅を彩るタイプ' },
  FAVS: { name:'映え放浪家', tagline:'直感で最高の映えを逃さない天性のセンサー' },
  FAEL: { name:'自由探検家', tagline:'好奇心のままに飛び込むハプニング大歓迎タイプ' },
  FAES: { name:'気まぐれ開拓士', tagline:'身軽さと直感でローカルを開拓する冒険者タイプ' },
  FCVL: { name:'月夜の漂流家', tagline:'気ままにラグジュアリーを楽しむ大人の自由人' },
  FCVS: { name:'余白収集家', tagline:'風の吹くままに余白を愛するノマドタイプ' },
  FCEL: { name:'空気感旅行家', tagline:'目に見えない空気感や情緒を味わうポエトリーな旅人' },
  FCES: { name:'風まかせ人', tagline:'最もニュートラルで自然体な究極の旅人' }
};

const defaultPackingItems = [
  "財布",
  "スマートフォン",
  "充電器",
  "モバイルバッテリー",
  "着替え",
  "ハンカチ",
];

const packingList = {
  key: 'tabios_packing_list',
  items: [],

  init(data) {
    this.key = `tabios_packing_${this._hash(this._tripKey(data))}`;
    this.items = this.load();
    this.render();
    this.bind();
  },

  load() {
    try {
      const stored = JSON.parse(localStorage.getItem(this.key) || 'null');
      if (Array.isArray(stored)) return stored;
    } catch(e) {}
    return defaultPackingItems.map(text => ({
      id: this._id(),
      text,
      checked: false
    }));
  },

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.items));
  },

  bind() {
    const form = document.getElementById('packingForm');
    const list = document.getElementById('packingList');
    if (form && !form.dataset.bound) {
      form.dataset.bound = 'true';
      form.addEventListener('submit', e => {
        e.preventDefault();
        this.add();
      });
    }
    if (list && !list.dataset.bound) {
      list.dataset.bound = 'true';
      list.addEventListener('change', e => {
        const checkbox = e.target.closest('[data-packing-check]');
        if (!checkbox) return;
        this.toggle(checkbox.dataset.packingCheck, checkbox.checked);
      });
      list.addEventListener('click', e => {
        const button = e.target.closest('[data-packing-delete]');
        if (!button) return;
        this.remove(button.dataset.packingDelete);
      });
    }
  },

  add() {
    const input = document.getElementById('packingInput');
    const text = input?.value.trim() || '';
    if (!text) return;
    this.items.push({ id: this._id(), text, checked: false });
    input.value = '';
    this.save();
    this.render();
  },

  toggle(id, checked) {
    this.items = this.items.map(item =>
      item.id === id ? { ...item, checked } : item
    );
    this.save();
    this.render();
  },

  remove(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.save();
    this.render();
  },

  render() {
    const list = document.getElementById('packingList');
    if (!list) return;
    list.innerHTML = this.items.map(item => `
      <li class="packing-item ${item.checked ? 'is-checked' : ''}">
        <input class="packing-check" type="checkbox" ${item.checked ? 'checked' : ''} data-packing-check="${this._esc(item.id)}" aria-label="${this._esc(item.text)}をチェック">
        <span class="packing-text">${this._esc(item.text)}</span>
        <button class="packing-delete" type="button" data-packing-delete="${this._esc(item.id)}" aria-label="${this._esc(item.text)}を削除">×</button>
      </li>
    `).join('');
  },

  _tripKey(data) {
    return [
      data?.trip_title || '',
      data?.trip_meta?.start_date || data?.trip_meta?.arrival_datetime || '',
      data?.trip_meta?.destination || data?.destination || ''
    ].join('|') || 'default';
  },

  _id() {
    return `item_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  },

  _hash(value) {
    let hash = 0;
    const text = String(value);
    for (let i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  },

  _esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

const defaultTripTodos = [
  "往復の交通手段を予約する",
  "宿泊先を予約する",
  "夕食・人気店を予約する",
  "チケットや体験予約を確認する",
  "当日の移動手段を確認する"
];

const TODO_STORAGE_KEY = "tabiosTripTodos";
const MEMO_STORAGE_KEY = "tabiosFreeMemo";
let currentBookmarkId = '';
let tripTodoItems = [];
let tripTodoSeed = [];

function getBookmarkId(data) {
  const raw = data?.bookmark_id || data?.trip_id || data?.id || packingList._tripKey(data);
  if (!raw) return '';
  return packingList._hash(raw);
}

function createDefaultTripTodos() {
  return defaultTripTodos.map((text, index) => ({
    id: `todo-default-${index + 1}`,
    text,
    checked: false
  }));
}

function getTodoStorageKey(bookmarkId) {
  return bookmarkId ? `${TODO_STORAGE_KEY}:${bookmarkId}` : TODO_STORAGE_KEY;
}

function loadTripTodos(bookmarkId) {
  try {
    const stored = JSON.parse(localStorage.getItem(getTodoStorageKey(bookmarkId)) || 'null');
    if (Array.isArray(stored)) {
      return stored.map((item, index) => normalizeTripTodo(item, index));
    }
  } catch(e) {}

  if (Array.isArray(tripTodoSeed) && tripTodoSeed.length) {
    return tripTodoSeed.map((item, index) => normalizeTripTodo(item, index));
  }
  return createDefaultTripTodos();
}

function saveTripTodos(bookmarkId) {
  localStorage.setItem(getTodoStorageKey(bookmarkId), JSON.stringify(tripTodoItems));
}

function renderTripTodos() {
  const list = document.getElementById('tripTodoList');
  if (!list) return;
  list.innerHTML = tripTodoItems.map(item => `
    <li class="trip-todo-item ${item.checked ? 'is-checked' : ''}">
      <input class="trip-todo-checkbox" type="checkbox" ${item.checked ? 'checked' : ''} data-trip-todo-check="${escapeHtml(item.id)}" aria-label="${escapeHtml(item.text)}をチェック">
      <span class="trip-todo-text">${escapeHtml(item.text)}</span>
      <button class="trip-todo-delete-button" type="button" data-trip-todo-delete="${escapeHtml(item.id)}" aria-label="${escapeHtml(item.text)}を削除">×</button>
    </li>
  `).join('');
}

function addTripTodo(text) {
  const trimmed = String(text || '').trim();
  if (!trimmed) return;
  tripTodoItems.push({
    id: `todo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: trimmed,
    checked: false
  });
  saveTripTodos(currentBookmarkId);
  renderTripTodos();
}

function toggleTripTodo(id) {
  tripTodoItems = tripTodoItems.map(item =>
    item.id === id ? { ...item, checked: !item.checked } : item
  );
  saveTripTodos(currentBookmarkId);
  renderTripTodos();
}

function deleteTripTodo(id) {
  tripTodoItems = tripTodoItems.filter(item => item.id !== id);
  saveTripTodos(currentBookmarkId);
  renderTripTodos();
}

function setupTripTodos(data) {
  currentBookmarkId = getBookmarkId(data);
  tripTodoSeed = Array.isArray(data?.todos) ? data.todos : [];
  tripTodoItems = loadTripTodos(currentBookmarkId);
  saveTripTodos(currentBookmarkId);
  renderTripTodos();

  const form = document.getElementById('tripTodoForm');
  const list = document.getElementById('tripTodoList');
  if (form && !form.dataset.bound) {
    form.dataset.bound = 'true';
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = document.getElementById('tripTodoInput');
      addTripTodo(input?.value || '');
      if (input) input.value = '';
    });
  }
  if (list && !list.dataset.bound) {
    list.dataset.bound = 'true';
    list.addEventListener('change', e => {
      const checkbox = e.target.closest('[data-trip-todo-check]');
      if (checkbox) toggleTripTodo(checkbox.dataset.tripTodoCheck);
    });
    list.addEventListener('click', e => {
      const button = e.target.closest('[data-trip-todo-delete]');
      if (button) deleteTripTodo(button.dataset.tripTodoDelete);
    });
  }
}

function normalizeTripTodo(item, index) {
  const source = typeof item === 'string' ? { text: item } : (item || {});
  return {
    id: source.id || `todo-${index + 1}`,
    text: source.text || '',
    checked: Boolean(source.checked)
  };
}

function getMemoStorageKey(bookmarkId) {
  return bookmarkId ? `${MEMO_STORAGE_KEY}:${bookmarkId}` : MEMO_STORAGE_KEY;
}

function loadFreeMemo(bookmarkId) {
  const stored = localStorage.getItem(getMemoStorageKey(bookmarkId));
  return stored;
}

function saveFreeMemo(bookmarkId, value) {
  localStorage.setItem(getMemoStorageKey(bookmarkId), value);
}

function setupFreeMemo(data) {
  const bookmarkId = currentBookmarkId || getBookmarkId(data);
  const textarea = document.getElementById('freeMemoTextarea');
  const status = document.getElementById('freeMemoSaveStatus');
  if (!textarea) return;

  const stored = loadFreeMemo(bookmarkId);
  textarea.value = stored !== null ? stored : (data?.free_memo || '');
  if (stored === null && data?.free_memo) saveFreeMemo(bookmarkId, data.free_memo);

  if (!textarea.dataset.bound) {
    textarea.dataset.bound = 'true';
    let timer = null;
    textarea.addEventListener('input', () => {
      saveFreeMemo(bookmarkId, textarea.value);
      if (status) {
        status.textContent = '保存しました';
        clearTimeout(timer);
        timer = setTimeout(() => { status.textContent = ''; }, 1400);
      }
    });
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ────────────────────────────────────────────────────────────────
   3. shioriRenderer
──────────────────────────────────────────────────────────────── */
const shioriRenderer = {

  render(data, area) {
    const gradient = themeManager.getStoryGradient(data.trip_title, data.trip_concept);

    // Apply gradient to page background
    document.body.style.background = gradient;

    // Nav title
    const navTitle = document.getElementById('sNavTitle');
    if (navTitle && data.trip_title) {
      navTitle.textContent = data.trip_title.slice(0, 18) + (data.trip_title.length > 18 ? '…' : '');
    }

    // Story card
    this._renderStoryCard(document.getElementById('storyCard'), data, gradient);

    // Cover
    const itCover = document.getElementById('itCover');
    if (itCover) itCover.style.background = gradient;
    this._setText('itTitle',   data.trip_title   || '');
    this._setText('itConcept', data.trip_concept || '');

    // Hotel
    const hotel = data.hotel || {};
    this._setText('itHotelTitle', hotel.area   || '');
    this._setText('itHotelDesc',  hotel.reason || '');
    const hotelCard = document.getElementById('itHotelCard');
    if (hotelCard) hotelCard.style.display = (hotel.area || hotel.reason) ? '' : 'none';

    this._renderSelectedDecisions(data);

    // Days
    this._renderDays(document.getElementById('itDaysContainer'), data.days || [], area);

    // Summary
    this._setText('itSummary', data.summary || '');
  },

  _setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  },

  _renderStoryCard(container, data, gradient) {
    if (!container) return;
    const cfg = data.image_config || {};
    const persona = this._resolvePersonality(data);
    const code = (persona.code || 'PAVL').toLowerCase();
    const typeImage = persona.illustration || `images/${code}.png`;
    const firstDay = (data.days || [])[0] || {};
    const theme = firstDay.theme || data.trip_concept || '';
    const tags = this._getStoryTags(data);
    const rows = this._getStoryRows(data);
    const meta = this._getStoryMeta(data);
    const tagsHtml = tags.map(tag => `<span class="sc-tag">${this._esc(tag)}</span>`).join('');
    const metaHtml = meta.map(item => `
      <span class="sc-info-pill">
        <b>${this._esc(item.label)}：</b>${this._esc(item.value)}
      </span>
    `).join('');
    const rowsHtml = rows.map(row => `
      <li class="sc-route-row">
        <span class="sc-route-time">${this._esc(row.time)}</span>
        <span class="sc-route-main">
          <strong style="font-size:${this._storyPlaceFontSize(row.place)}rem;">${this._esc(row.place)}</strong>
        </span>
      </li>
    `).join('');

    container.innerHTML = `
      <div class="sc-bg" style="background:${gradient};"></div>
      <div class="sc-body">
        <header class="sc-hero">
          <p class="sc-kicker">${this._esc(data.trip_concept || '旅の余白をめぐる日')}</p>
          <h2 class="sc-trip-title">${this._esc(data.trip_title || '旅のしおり')}</h2>
          <p class="sc-theme">${this._esc(theme)}</p>
        </header>

        <section class="sc-type-card" data-glass>
          <div class="sc-type-copy">
            <p class="sc-label">TRAVEL TYPE</p>
            <strong>${this._esc(persona.name || '旅タイプ')}</strong>
            <small>TYPE: ${this._esc(persona.code || '----')}</small>
            <em>${this._esc(persona.tagline || 'あなたらしい旅の空気を大切にするタイプ')}</em>
          </div>
          <figure class="sc-type-visual">
            <img src="${this._esc(typeImage)}" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';">
            <span>${this._esc((persona.name || '旅').slice(0, 1))}</span>
          </figure>
        </section>

        <div class="sc-tags">${tagsHtml}</div>

        <section class="sc-route-card" data-glass>
          <div class="sc-day-pill">${(data.days || []).length > 1 ? 'HIGHLIGHT' : 'DAY 1'}</div>
          <ol class="sc-route-list">${rowsHtml}</ol>
        </section>

        <div class="sc-info-pills">${metaHtml}</div>

        <div class="sc-card-footer">
          <span></span>
          <b>あなたらしく、旅をする。</b>
        </div>
        <div class="sc-hashtag">#TABI OS</div>
      </div>
    `;
  },

  _getStoredPersonality() {
    try {
      return JSON.parse(sessionStorage.getItem('tabios_personality') || 'null');
    } catch(e) {
      return null;
    }
  },

  _resolvePersonality(data) {
    const sources = [
      this._getStoredPersonality(),
      data.traveler_personality,
      data.personality,
      data.image_config?.traveler_personality
    ].filter(Boolean);

    const raw = sources.find(Boolean) || {};
    const source = typeof raw === 'string' ? { name: raw } : raw;
    const code = String(source.code || source.type || '').toUpperCase();
    const byCode = personalityCatalog[code];
    const byNameEntry = Object.entries(personalityCatalog)
      .find(([, value]) => value.name === source.name);
    const resolvedCode = byCode ? code : (byNameEntry ? byNameEntry[0] : '');
    const master = byCode || byNameEntry?.[1] || {};

    return {
      code: resolvedCode || code,
      name: source.name || master.name || '旅タイプ',
      tagline: source.tagline || master.tagline || 'あなたらしい旅の空気を大切にするタイプ',
      illustration: source.illustration ||
        (resolvedCode || code ? `images/${(resolvedCode || code).toLowerCase()}.png` : '')
    };
  },

  _getStoryTags(data) {
    const cfgTags = data.image_config?.visual_keywords || [];
    const dayTheme = data.days?.[0]?.theme ? [data.days[0].theme] : [];
    return [...cfgTags, ...dayTheme, '旅の余白']
      .filter(Boolean)
      .map(tag => String(tag).replace(/^#/, '').trim())
      .filter((tag, idx, arr) => tag && arr.indexOf(tag) === idx)
      .slice(0, 3);
  },

  _getStoryRows(data) {
    const days = data.days?.length ? data.days : [];
    if (days.length > 1) {
      return days.slice(0, 3).map(day => {
        const spots = (day.schedule || [])
          .filter(item => item.category !== 'move' && item.place)
          .slice(0, 2)
          .map(item => item.place);
        return {
          time: `DAY ${day.day}`,
          place: day.theme || spots.join(' → ') || `Day ${day.day}`
        };
      });
    }

    return ((days[0] || {}).schedule || [])
      .filter(item => item.category !== 'move' && item.place)
      .slice(0, 3)
      .map(item => ({
        time: item.time || '',
        place: item.place || ''
      }));
  },

  _storyPlaceFontSize(text) {
    const len = Array.from(String(text || '')).length;
    if (len > 22) return 0.58;
    if (len > 18) return 0.62;
    if (len > 14) return 0.68;
    return 0.78;
  },

  _getStoryMeta(data) {
    const items = (data.days || [])
      .flatMap(day => day.schedule || [])
      .filter(Boolean);
    const budget = this._summarizeBudget(items);
    return [
      budget ? { label: '予算目安', value: budget } : null
    ].filter(Boolean);
  },

  _summarizeBudget(items) {
    const numbers = items
      .map(item => item.cost_yen)
      .filter(value => typeof value === 'number' && Number.isFinite(value));
    if (numbers.length) {
      const total = numbers.reduce((sum, value) => sum + value, 0);
      return `約${total.toLocaleString('ja-JP')}円`;
    }

    const label = items
      .map(item => this._getCostText(item))
      .find(Boolean);
    return label || '';
  },

  _getCostText(item) {
    const raw = item.cost_label ?? item.cost_estimate ?? item.cost_range ?? item.estimated_cost ?? item.price_estimate ?? item.cost_yen;
    if (raw === undefined || raw === null || raw === '') return '';
    if (typeof raw === 'number') return `約${raw.toLocaleString('ja-JP')}円`;
    return String(raw);
  },

  _renderSelectedDecisions(data) {
    const card = document.getElementById('selectedDecisionCard');
    const list = document.getElementById('selectedDecisionList');
    if (!card || !list) return;
    const decisions = (data.selected_decisions || [])
      .filter(item => item?.selectedName || item?.selected_option_name)
      .map(item => ({
        label: item.label || item.selected_decision_label || '選択済み',
        name: item.selectedName || item.selected_option_name
      }));
    if (!decisions.length) {
      card.style.display = 'none';
      list.innerHTML = '';
      return;
    }
    list.innerHTML = decisions.map(item => `
      <div class="selected-decision-item">
        <span>${this._esc(item.label)}</span>
        <strong>${this._esc(item.name)}</strong>
      </div>
    `).join('');
    card.style.display = '';
  },

  _esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  _renderDays(container, days, area) {
    if (!container) return;
    container.innerHTML = '';
    days.forEach(day => {
      const section = document.createElement('div');
      section.className = 'day-section';
      section.style.background = themeManager.getDayBg(day.day);
      section.innerHTML = `
        <div class="day-header">
          <span class="day-number">Day ${day.day}</span>
          <span class="day-theme">${day.theme || ''}</span>
        </div>
        <div class="timeline" id="tl-day-${day.day}"></div>
      `;
      container.appendChild(section);

      const timeline = document.getElementById(`tl-day-${day.day}`);
      (day.schedule || []).forEach(item => {
        timeline.appendChild(this._createTimelineItem(item, area));
      });
    });
  },

  _createTimelineItem(item, area) {
    const wrap = document.createElement('div');
    wrap.className = 'tl-item';

    const isMove = (item.category === 'move');
    const isFoodCat = ['lunch', 'cafe', 'dinner'].includes(item.category);

    /* ── Link buttons: ALWAYS <a> with href + target="_blank" ── */
    let linksHtml = '';
    if (!isMove && item.place) {
      const mapUrl   = linkGenerator.maps(item.place, area);
      const instaUrl = linkGenerator.instagram(item.place);
      const tabUrl   = linkGenerator.tabelog(item.place);

      linksHtml += `
        <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="tl-link tl-link-map">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          Map
        </a>
        <a href="${instaUrl}" target="_blank" rel="noopener noreferrer" class="tl-link tl-link-insta">
          Insta
        </a>`;

      if (isFoodCat) {
        linksHtml += `
        <a href="${tabUrl}" target="_blank" rel="noopener noreferrer" class="tl-link tl-link-tab">
          食べログ
        </a>`;
      }
    } else if (isMove) {
      linksHtml = `<span class="tl-link tl-link-move">移動</span>`;
    }

    /* ── Details row ── */
    const detailsInner = [
      item.stay_minutes ? `
        <span class="tl-detail">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${item.stay_minutes}分
        </span>` : '',
      item.move_to_next ? `
        <span class="tl-detail">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          ${item.move_to_next}
        </span>` : ''
      ,
      this._getCostText(item) ? `
        <span class="tl-detail tl-detail-cost">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          ${this._getCostText(item)}
        </span>` : ''
    ].filter(Boolean).join('');

    const detailsHtml = detailsInner ? `<div class="tl-details">${detailsInner}</div>` : '';
    const tipsHtml    = item.tips    ? `<div class="tl-tips"><strong>💡</strong> ${this._esc(item.tips)}</div>` : '';
    const selectedAux = item.selected_option_name && !String(item.place || '').includes(item.selected_option_name)
      ? `<span class="tl-selected-name">${this._esc(item.selected_decision_label || '選択済み')}：${this._esc(item.selected_option_name)}</span>`
      : '';

    wrap.innerHTML = `
      <div class="tl-time-col">
        <span class="tl-time">${this._esc(item.time || '')}</span>
      </div>
      <div class="tl-thread-col">
        <div class="tl-pin"></div>
      </div>
      <div class="tl-card-col">
        <div class="tl-card">
          <div class="tl-place-top">
            <h4 class="tl-place-name">${selectedAux}${this._esc(item.place || '')}</h4>
            <span class="tl-cat-tag">${this._esc(item.category || '')}</span>
          </div>
          <div class="tl-links">${linksHtml}</div>
          <p class="tl-reason">${this._esc(item.reason || '')}</p>
          ${detailsHtml}
          ${tipsHtml}
        </div>
      </div>
    `;
    return wrap;
  }
};

/* ────────────────────────────────────────────────────────────────
   4. imageExporter
──────────────────────────────────────────────────────────────── */
const imageExporter = {

  async download(data) {
    const overlay = document.getElementById('loadingOverlay');
    const saveButtons = document.querySelectorAll('[data-save-story]');
    overlay.style.display = 'flex';
    saveButtons.forEach(btn => { btn.disabled = true; });

    try {
      // 1. Create an off-screen capture clone of the story card at exact 360×640
      const source  = document.getElementById('storyCard');
      const clone   = source.cloneNode(true);
      clone.classList.add('is-exporting');

      clone.style.cssText = [
        'position:fixed',
        'top:-9999px',
        'left:0',
        'width:360px',
        'height:640px',
        'overflow:hidden',
        'border-radius:0',
        'z-index:-9999',
        'pointer-events:none'
      ].join('!important;') + '!important';

      document.body.appendChild(clone);

      // 2. Strip backdrop-filter from [data-glass] elements so html2canvas
      //    renders them correctly (backdrop-filter is not supported by html2canvas).
      clone.querySelectorAll('[data-glass]').forEach(el => {
        el.style.backdropFilter      = 'none';
        el.style.webkitBackdropFilter = 'none';
        el.style.backgroundColor     = 'rgba(255, 255, 255, 0.90)';
        el.style.border              = '1px solid rgba(255, 255, 255, 0.95)';
      });

      // 3. Allow a frame for layout to settle
      await new Promise(r => setTimeout(r, 180));

      // 4. Capture at ×3 scale → 1080 × 1920 px
      const canvas = await html2canvas(clone, {
        scale:           3,         // 360×3=1080, 640×3=1920
        width:           360,
        height:          640,
        useCORS:         true,
        allowTaint:      true,
        backgroundColor: null,
        logging:         false,
        removeContainer: true
      });

      document.body.removeChild(clone);

      const filename = (data.trip_title || '旅のしおり')
                         .replace(/[\\/:*?"<>|]/g, '')
                         .trim()
                         .slice(0, 20) + '_story.png';
      const dataUrl  = canvas.toDataURL('image/png');

      // 5. Download: iOS Safari needs special handling
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        this._showIOSOverlay(dataUrl);
      } else {
        const link      = document.createElement('a');
        link.href       = dataUrl;
        link.download   = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      trackEvent('share_image_downloaded', {
        title: data.trip_title || '',
        day_count: Array.isArray(data.days) ? data.days.length : 0
      });

    } catch (err) {
      console.error('Image export error:', err);
      alert('画像の生成に失敗しました。ページを更新して再試行してください。');
    } finally {
      overlay.style.display = 'none';
      saveButtons.forEach(btn => { btn.disabled = false; });
    }
  },

  _showIOSOverlay(dataUrl) {
    const overlay       = document.createElement('div');
    overlay.id          = 'iosImageOverlay';
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:9999;
      background:rgba(0,0,0,0.90);
      display:flex; flex-direction:column;
      align-items:center; justify-content:center;
      gap:20px; padding:28px;
    `;
    overlay.innerHTML = `
      <img src="${dataUrl}" style="
        max-width:260px; max-height:62dvh;
        object-fit:contain; border-radius:20px;
        box-shadow:0 24px 64px rgba(0,0,0,0.5);
      ">
      <div style="
        background:rgba(255,255,255,0.12);
        border:1px solid rgba(255,255,255,0.2);
        border-radius:16px; padding:14px 20px;
        text-align:center; max-width:300px;
      ">
        <p style="
          color:#FFFFFF; font-size:0.88rem;
          line-height:1.7; font-family:'Noto Sans JP',sans-serif;
        ">
          画像を<strong>長押し</strong>して<br>
          「写真に保存」を選択してください
        </p>
      </div>
      <button onclick="document.getElementById('iosImageOverlay').remove()" style="
        background:rgba(255,255,255,0.18);
        border:1px solid rgba(255,255,255,0.3);
        color:#FFFFFF; padding:11px 28px;
        border-radius:9999px; font-size:0.84rem;
        cursor:pointer; font-family:'Noto Sans JP',sans-serif;
        font-weight:600;
      ">閉じる</button>
    `;
    document.body.appendChild(overlay);
  }
};

const shioriShare = {
  appUrl: 'https://nove1453.github.io/tabios_v1/',
  storagePrefix: 'tabios_share_',
  storageIndexKey: 'tabios_share_index',

  createId() {
    const bytes = new Uint8Array(8);
    if (window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      bytes.forEach((_, i) => { bytes[i] = Math.floor(Math.random() * 256); });
    }
    return Array.from(bytes, byte => byte.toString(36).padStart(2, '0')).join('').slice(0, 12);
  },

  saveLocal(payload) {
    const id = this.createId();
    const record = {
      payload,
      createdAt: Date.now()
    };
    localStorage.setItem(`${this.storagePrefix}${id}`, JSON.stringify(record));
    this.rememberId(id);
    return id;
  },

  rememberId(id) {
    let ids = [];
    try {
      ids = JSON.parse(localStorage.getItem(this.storageIndexKey) || '[]');
    } catch(e) {
      ids = [];
    }
    const nextIds = [id, ...ids.filter(item => item !== id)];
    localStorage.setItem(this.storageIndexKey, JSON.stringify(nextIds.slice(0, 20)));
    nextIds.slice(20).forEach(oldId => {
      localStorage.removeItem(`${this.storagePrefix}${oldId}`);
    });
  },

  readLocal(id) {
    try {
      const raw = localStorage.getItem(`${this.storagePrefix}${id}`);
      if (!raw) return null;
      const record = JSON.parse(raw);
      return record.payload || null;
    } catch(e) {
      console.warn('Short share data read failed:', e);
      return null;
    }
  },

  encode(payload) {
    const json = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  },

  decode(value) {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  },

  readFromHash() {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const shortId = params.get('s');
    if (shortId) {
      const localPayload = this.readLocal(shortId);
      if (localPayload) return localPayload;
    }
    const packed = params.get('tabios');
    if (!packed) return null;
    try {
      return this.decode(packed);
    } catch(e) {
      console.warn('Share data decode failed:', e);
      return null;
    }
  },

  makeUrl(data, area) {
    const payload = { data, area };
    const url = new URL(window.location.href);
    try {
      const id = this.saveLocal(payload);
      url.hash = `s=${encodeURIComponent(id)}`;
    } catch(e) {
      console.warn('Short share URL failed. Falling back to embedded URL:', e);
      url.hash = `tabios=${this.encode(payload)}`;
    }
    return url.toString();
  },

  async share(data, area) {
    const title = data.trip_title ? `旅のしおり: ${data.trip_title}` : '旅のしおり';
    const text = this.makeShareText(data, area);
    const pasteText = JSON.stringify(data, null, 2);
    const file = this.makePasteTextFile(data, pasteText);

    try {
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title, text, files: [file] });
      } else if (navigator.share) {
        await navigator.share({ title, text });
        this.downloadPasteTextFile(file);
      } else {
        await navigator.clipboard.writeText(text);
        this.downloadPasteTextFile(file);
        alert('共有文をコピーし、貼り付け用ファイルを保存しました。');
      }
    } catch(e) {
      if (e?.name !== 'AbortError') {
        await navigator.clipboard.writeText(text);
        this.downloadPasteTextFile(file);
        alert('共有文をコピーし、貼り付け用ファイルを保存しました。');
      }
    }
  },

  makeShareText(data, area) {
    const dateText = this.getDateText(data);
    const placeText = this.getPlaceText(data, area);
    const tripLabel = `${dateText}${placeText}`;
    const firstLine = tripLabel ? `${tripLabel}の旅行のしおりです！` : '旅行のしおりです！';
    return `${firstLine}
アプリのURLはこちら
${this.appUrl}
旅のしおりに添付の文字列を貼り付けるとしおりが開けます。
あなたらしい、旅をする。
＃TABI OS`;
  },

  getDateText(data) {
    const raw =
      data.trip_meta?.start_date ||
      data.trip_meta?.arrival_datetime ||
      data.start_date ||
      data.arrival_datetime ||
      data.days?.[0]?.date ||
      '';
    if (!raw) return '';
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return String(raw);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  },

  getPlaceText(data, area) {
    return String(
      data.trip_meta?.destination ||
      data.destination ||
      data.area ||
      area ||
      data.hotel?.area ||
      ''
    )
      .replace(/おすすめ宿泊エリア|おすすめ|ホテルの方向性|宿泊エリア|周辺|エリア/g, '')
      .replace(/[。、「」]/g, '')
      .trim();
  },

  makePasteTextFile(data, pasteText) {
    const name = this.safeFilename(data.trip_title || 'tabi-shiori');
    const blob = new Blob([pasteText], { type: 'text/plain;charset=utf-8' });
    return new File([blob], `${name}-paste.txt`, { type: 'text/plain' });
  },

  downloadPasteTextFile(file) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  safeFilename(value) {
    return String(value)
      .replace(/[\\/:*?"<>|]/g, '')
      .replace(/\s+/g, '-')
      .trim()
      .slice(0, 40) || 'tabios_shiori';
  }
};

/* ────────────────────────────────────────────────────────────────
   5. Init
──────────────────────────────────────────────────────────────── */
function showNoData() {
  document.body.style.display = 'flex';
  document.body.style.alignItems = 'center';
  document.body.style.justifyContent = 'center';
  document.body.style.minHeight = '100dvh';
  document.body.innerHTML = `
    <div style="
      display:flex; flex-direction:column; align-items:center;
      gap:18px; padding:32px; text-align:center;
      font-family:'Noto Sans JP',sans-serif;
    ">
      <div style="font-size:2.5rem;">✦</div>
      <h2 style="font-size:1.1rem; font-weight:700; color:#252525;">
        しおりデータが見つかりません
      </h2>
      <p style="font-size:0.82rem; color:#888; line-height:1.7;">
        「旅のしおり」タブからJSONを貼り付け、<br>
        「しおりを生成する」を押してください。
      </p>
      <a href="index.html" style="
        padding:13px 28px;
        background:#252525; color:#FFFFFF;
        border-radius:9999px; font-size:0.85rem;
        font-weight:700; text-decoration:none;
      ">アプリに戻る</a>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const shared = shioriShare.readFromHash();
  const rawData = shared ? JSON.stringify(shared.data) : sessionStorage.getItem('tabios_shiori_data');
  const area    = shared?.area || sessionStorage.getItem('tabios_destination') || '';

  if (!rawData) { showNoData(); return; }

  let data;
  try {
    data = JSON.parse(rawData);
  } catch(e) {
    document.body.innerHTML = `
      <div style="padding:40px; text-align:center; font-family:'Noto Sans JP',sans-serif; color:#888;">
        データの読み込みに失敗しました。<br>
        <a href="index.html" style="color:#C4A882;">アプリに戻る</a>
      </div>`;
    return;
  }

  if (shared) {
    sessionStorage.setItem('tabios_shiori_data', JSON.stringify(data));
    sessionStorage.setItem('tabios_destination', area);
  }

  // Render everything
  shioriRenderer.render(data, area);
  setupTripTodos(data);
  packingList.init(data);
  setupFreeMemo(data);

  // Action buttons
  document.querySelectorAll('[data-save-story]').forEach(btn => {
    btn.addEventListener('click', () => {
      imageExporter.download(data);
    });
  });

  document.addEventListener('click', e => {
    const link = e.target.closest('a[href*="google.com/search"]');
    if (!link) return;
    trackEvent('google_search_clicked', {
      source: 'shiori',
      url: link.href || '',
      label: link.textContent.trim()
    });
  });

  document.querySelectorAll('[data-share-shiori]').forEach(btn => {
    btn.addEventListener('click', () => {
      shioriShare.share(data, area);
    });
  });

  // Backward compatibility for older markup
  document.getElementById('btnSaveImg')?.addEventListener('click', () => {
    imageExporter.download(data);
  });
});
