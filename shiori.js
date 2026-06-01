/* ================================================================
   shiori.js — Tabi OS Shiori Page
   Modules: themeManager / linkGenerator / shioriRenderer / imageExporter
   ================================================================ */
'use strict';

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

const hotelSuggestions = {
  PAVL: {
    title: "世界観のある上質ホテル",
    text: "旅演出家タイプには、旅全体の空気感まで整えてくれる上質なホテルがおすすめです。",
    button: "上質なホテルを探す"
  },
  PAVS: {
    title: "絶景・眺望の良い宿",
    text: "景色収集家タイプには、朝焼けや夜景まで楽しめる眺望の良い宿がおすすめです。",
    button: "絶景ホテルを探す"
  },
  PAEL: {
    title: "文化や美食を楽しめる宿",
    text: "感性探訪家タイプには、土地の文化や食を深く味わえる宿がおすすめです。",
    button: "文化を感じる宿を探す"
  },
  PAES: {
    title: "街歩きに便利な宿",
    text: "路地開拓士タイプには、ローカルな街歩きがしやすい立地の宿がおすすめです。",
    button: "街歩き向きの宿を探す"
  },
  PCVL: {
    title: "余白を楽しめる温泉宿",
    text: "余白貴族タイプには、予定を詰め込まず、宿時間そのものを味わえる温泉宿やラグジュアリー宿がおすすめです。",
    button: "温泉宿・上質宿を探す"
  },
  PCVS: {
    title: "カフェや美術館近くの宿",
    text: "カフェ漂流家タイプには、カフェ街や美術館、雑貨店にアクセスしやすい宿がおすすめです。",
    button: "カフェ街近くの宿を探す"
  },
  PCEL: {
    title: "スパ・サウナ・温泉付き宿",
    text: "癒し滞在家タイプには、移動を減らして心身を休められるスパ・サウナ・温泉付きの宿がおすすめです。",
    button: "癒しの宿を探す"
  },
  PCES: {
    title: "静かに過ごせる小規模宿",
    text: "静かな放浪家タイプには、人混みから少し離れて静かに過ごせる小規模な宿がおすすめです。",
    button: "静かな宿を探す"
  },
  FAVL: {
    title: "夜景やバーを楽しめる宿",
    text: "夜更かし演出家タイプには、夜景やバー、繁華街へのアクセスが良い宿がおすすめです。",
    button: "夜を楽しめる宿を探す"
  },
  FAVS: {
    title: "デザインホテル・映え宿",
    text: "映え放浪家タイプには、写真に残したくなるデザインホテルや個性ある宿がおすすめです。",
    button: "映える宿を探す"
  },
  FAEL: {
    title: "アクティビティ拠点の宿",
    text: "自由探検家タイプには、現地体験やアクティビティに動きやすい拠点型の宿がおすすめです。",
    button: "冒険の拠点宿を探す"
  },
  FAES: {
    title: "リーズナブルで動きやすい宿",
    text: "気まぐれ開拓士タイプには、価格を抑えながら自由に動ける立地重視の宿がおすすめです。",
    button: "動きやすい宿を探す"
  },
  FCVL: {
    title: "大人向けラグジュアリー宿",
    text: "月夜の漂流家タイプには、夜の余韻やご褒美感を楽しめる大人向けの上質宿がおすすめです。",
    button: "大人の上質宿を探す"
  },
  FCVS: {
    title: "長居したくなる宿",
    text: "余白収集家タイプには、予定を決めずにゆっくり滞在したくなる居心地の良い宿がおすすめです。",
    button: "長居したい宿を探す"
  },
  FCEL: {
    title: "街の空気を味わえる宿",
    text: "空気感旅行家タイプには、その土地の暮らしや街の情緒を感じられる宿がおすすめです。",
    button: "街の空気を感じる宿を探す"
  },
  FCES: {
    title: "コスパ良く泊まれる宿",
    text: "風まかせ人タイプには、気軽に泊まれて自由に動けるコスパの良い宿がおすすめです。",
    button: "コスパ宿を探す"
  }
};

const rakutenAffiliate = {
  href: "https://hb.afl.rakuten.co.jp/hsc/545d0372.2fc54cdc.545d0373.e627ea30/?link_type=pict&ut=eyJwYWdlIjoic2hvcCIsInR5cGUiOiJwaWN0IiwiY29sIjoxLCJjYXQiOiIxIiwiYmFuIjo2MTcwOTEsImFtcCI6ZmFsc2V9",
  image: "https://hbb.afl.rakuten.co.jp/hsb/545d0372.2fc54cdc.545d0373.e627ea30/?me_id=2100001&me_adv_id=617091&t=pict"
};

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

    // Days
    this._renderDays(document.getElementById('itDaysContainer'), data.days || [], area);

    // Affiliate hotel suggestion
    this._renderAffiliateHotel(data, area);

    // Summary
    this._setText('itSummary', data.summary || '');
  },

  _setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  },

  _renderAffiliateHotel(data, area) {
    const card = document.getElementById('affiliateHotelCard');
    if (!card) return;

    const persona = this._resolvePersonality(data);
    const suggestion = hotelSuggestions[persona.code] || {
      title: "この旅に合う宿",
      text: "今回の旅の空気感に合わせて、心地よく過ごせる宿を選ぶのがおすすめです。",
      button: "宿を探す"
    };
    const destination = this._getDestinationLabel(data, area);
    const destinationText = destination ? `${destination}の宿探し` : '旅先の宿探し';
    const buttonText = destination ? `${destination}で${suggestion.button}` : suggestion.button;

    this._setText('affiliateDestination', destinationText);
    this._setText('affiliateTitle', suggestion.title);
    this._setText('affiliateText', suggestion.text);

    const button = document.getElementById('affiliateButton');
    if (button) {
      button.href = rakutenAffiliate.href;
      button.textContent = buttonText;
      button.setAttribute('rel', 'nofollow sponsored noopener');
      button.setAttribute('target', '_blank');
    }

    const banner = document.getElementById('affiliateBanner');
    const bannerImg = document.getElementById('affiliateBannerImg');
    if (banner) {
      banner.href = rakutenAffiliate.href;
      banner.setAttribute('rel', 'nofollow sponsored noopener');
      banner.setAttribute('target', '_blank');
    }
    if (bannerImg) {
      bannerImg.src = rakutenAffiliate.image;
    }

    card.style.display = '';
  },

  _getDestinationLabel(data, area) {
    const hotelArea = data.hotel?.area || '';
    const raw = area || data.destination || data.area || hotelArea || '';
    return String(raw)
      .replace(/おすすめ宿泊エリア|おすすめ|ホテルの方向性|宿泊エリア|周辺|エリア/g, '')
      .replace(/[。、「」]/g, '')
      .trim()
      .slice(0, 18);
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
          <b>Tabi OS</b>
        </div>
        <div class="sc-hashtag">#Tabios</div>
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
    const tipsHtml    = item.tips    ? `<div class="tl-tips"><strong>💡</strong> ${item.tips}</div>` : '';

    wrap.innerHTML = `
      <div class="tl-time-col">
        <span class="tl-time">${item.time || ''}</span>
      </div>
      <div class="tl-thread-col">
        <div class="tl-pin"></div>
      </div>
      <div class="tl-card-col">
        <div class="tl-card">
          <div class="tl-place-top">
            <h4 class="tl-place-name">${item.place || ''}</h4>
            <span class="tl-cat-tag">${item.category || ''}</span>
          </div>
          <div class="tl-links">${linksHtml}</div>
          <p class="tl-reason">${item.reason || ''}</p>
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
    const jsonText = JSON.stringify(data, null, 2);
    const file = this.makeJsonTextFile(data, jsonText);

    try {
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title, text, files: [file] });
      } else if (navigator.share) {
        await navigator.share({ title, text });
        this.downloadJsonTextFile(file);
      } else {
        await navigator.clipboard.writeText(`${text}\n\n--- 添付用JSON ---\n${jsonText}`);
        this.downloadJsonTextFile(file);
        alert('共有文とJSONをコピーし、JSONテキストファイルを保存しました。');
      }
    } catch(e) {
      if (e?.name !== 'AbortError') {
        await navigator.clipboard.writeText(`${text}\n\n--- 添付用JSON ---\n${jsonText}`);
        this.downloadJsonTextFile(file);
        alert('共有文とJSONをコピーし、JSONテキストファイルを保存しました。');
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

  makeJsonTextFile(data, jsonText) {
    const name = this.safeFilename(data.trip_title || 'tabios_shiori');
    const blob = new Blob([jsonText], { type: 'text/plain;charset=utf-8' });
    return new File([blob], `${name}.json.txt`, { type: 'text/plain' });
  },

  downloadJsonTextFile(file) {
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

  // Action buttons
  document.querySelectorAll('[data-save-story]').forEach(btn => {
    btn.addEventListener('click', () => {
      imageExporter.download(data);
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
