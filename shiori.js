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
    const tagsHtml = tags.map(tag => `<span class="sc-tag">${this._esc(tag)}</span>`).join('');
    const rowsHtml = rows.map(row => `
      <li class="sc-route-row">
        <span class="sc-route-time">${this._esc(row.time)}</span>
        <span class="sc-route-main">
          <strong>${this._esc(row.place)}</strong>
          <small>${this._esc(row.note)}</small>
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
          place: day.theme || spots.join(' → ') || `Day ${day.day}`,
          note: spots.join(' / ')
        };
      });
    }

    return ((days[0] || {}).schedule || [])
      .filter(item => item.category !== 'move' && item.place)
      .slice(0, 3)
      .map(item => ({
        time: item.time || '',
        place: item.place || '',
        note: item.reason || item.tips || ''
      }));
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
    const btnSave = document.getElementById('btnSaveImg');
    overlay.style.display = 'flex';
    if (btnSave) btnSave.disabled = true;

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
      if (btnSave) btnSave.disabled = false;
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
  const rawData = sessionStorage.getItem('tabios_shiori_data');
  const area    = sessionStorage.getItem('tabios_destination') || '';

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

  // Render everything
  shioriRenderer.render(data, area);

  // Save image button
  document.getElementById('btnSaveImg')?.addEventListener('click', () => {
    imageExporter.download(data);
  });
});
