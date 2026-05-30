/* ================================================================
   shiori.js — Tabi OS Shiori Page
   Modules: themeManager / linkGenerator / shioriRenderer / imageExporter
   ================================================================ */
'use strict';

/* ────────────────────────────────────────────────────────────────
   1. themeManager
──────────────────────────────────────────────────────────────── */
const themeManager = {

  getStoryPalette(data, area) {
    const cfg = data.image_config || {};
    const cfgColors = [cfg.theme_color, cfg.theme_color_secondary, cfg.accent_color, cfg.text_color]
      .filter(c => /^#[0-9a-f]{6}$/i.test(c || ''));
    const listedColors = Array.isArray(cfg.palette_colors)
      ? cfg.palette_colors.filter(c => /^#[0-9a-f]{6}$/i.test(c || '')).slice(0, 4)
      : [];

    if (cfgColors.length >= 3) {
      return {
        name: cfg.palette_name || cfg.destination_vibe || '旅のムード',
        colors: listedColors.length > 0
          ? listedColors
          : [cfg.theme_color, cfg.theme_color_secondary, cfg.accent_color, '#FFFFFF'],
        gradient: cfg.background_style === 'solid'
          ? cfg.theme_color
          : `linear-gradient(160deg, ${cfg.theme_color} 0%, ${cfg.theme_color_secondary || cfg.theme_color} 48%, #FFFFFF 100%)`,
        accent: cfg.accent_color || cfg.theme_color,
        text: cfg.text_color || '#252525',
        mood: cfg.mood || ''
      };
    }

    const txt = [
      area,
      data.trip_title,
      data.trip_concept,
      cfg.mood,
      cfg.destination_vibe,
      ...(cfg.visual_keywords || [])
    ].join(' ').toLowerCase();

    const palettes = [
      {
        test: /海|島|宮古|石垣|沖縄|マリン|珊瑚|サンゴ|夏|beach|ocean|resort/,
        name: 'Okinawa Blue',
        colors: ['#A8D4EC', '#74BCD8', '#F7E7B0', '#FFFFFF'],
        gradient: 'linear-gradient(160deg, #A8D4EC 0%, #74BCD8 34%, #DDF4F8 70%, #FFF7DC 100%)',
        accent: '#167D9A',
        text: '#183642',
        mood: 'serene'
      },
      {
        test: /京都|奈良|鎌倉|寺|神社|和|抹茶|着物|茶道|紅葉|秋/,
        name: 'Kyoto Matcha',
        colors: ['#8FA36B', '#D7B56D', '#B85C38', '#F7EFE2'],
        gradient: 'linear-gradient(160deg, #F7EFE2 0%, #D7C59A 34%, #9FB37A 68%, #B85C38 100%)',
        accent: '#7C8F50',
        text: '#2E291F',
        mood: 'nostalgic'
      },
      {
        test: /北海道|森|山|自然|高原|緑|湖|キャンプ|春/,
        name: 'Forest Air',
        colors: ['#B4D4B4', '#7BAE87', '#E9F3D2', '#FFFFFF'],
        gradient: 'linear-gradient(160deg, #E9F3D2 0%, #B4D4B4 38%, #7BAE87 72%, #F8FFF0 100%)',
        accent: '#4E805A',
        text: '#243526',
        mood: 'fresh'
      },
      {
        test: /東京|大阪|夜|都市|夜景|ネオン|渋谷|新宿|冬|urban/,
        name: 'Urban Lavender',
        colors: ['#C8C0E8', '#6F6A9A', '#F1D2E8', '#202038'],
        gradient: 'linear-gradient(160deg, #EDE8FF 0%, #C8C0E8 36%, #8E88BE 72%, #2C2D4F 100%)',
        accent: '#6F6A9A',
        text: '#202038',
        mood: 'vibrant'
      },
      {
        test: /韓国|ソウル|釜山|仁川|cafe/,
        name: 'Seoul Rose',
        colors: ['#F0C8D4', '#D998AA', '#F7E7EC', '#FFFFFF'],
        gradient: 'linear-gradient(160deg, #FFF0F4 0%, #F0C8D4 42%, #D998AA 78%, #FFFFFF 100%)',
        accent: '#B95E77',
        text: '#402831',
        mood: 'cozy'
      }
    ];

    return palettes.find(p => p.test.test(txt)) || {
      name: 'Soft Journey',
      colors: ['#E8D4C0', '#C4A882', '#FAF0E8', '#FFFFFF'],
      gradient: 'linear-gradient(160deg, #FAF0E8 0%, #F0E0D0 34%, #E8D4C0 70%, #FDF8F2 100%)',
      accent: '#A8886A',
      text: '#252525',
      mood: cfg.mood || 'calm'
    };
  },

  getStoryGradient(data, area) {
    return this.getStoryPalette(data, area).gradient;
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

/* ────────────────────────────────────────────────────────────────
   3. shioriRenderer
──────────────────────────────────────────────────────────────── */
const shioriRenderer = {

  render(data, area) {
    const palette = themeManager.getStoryPalette(data, area);
    const gradient = palette.gradient;

    // Apply gradient to page background
    document.body.style.background = gradient;
    document.documentElement.style.setProperty('--brand', palette.accent);

    // Nav title
    const navTitle = document.getElementById('sNavTitle');
    if (navTitle && data.trip_title) {
      navTitle.textContent = data.trip_title.slice(0, 18) + (data.trip_title.length > 18 ? '…' : '');
    }

    // Story card
    this._renderStoryCard(document.getElementById('storyCard'), data, palette);

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

  _renderStoryCard(container, data, palette) {
    if (!container) return;
    const days = (data.days || []).slice(0, 4);
    const cfg = data.image_config || {};
    const persona = data.traveler_personality || data.personality || cfg.traveler_personality || {};
    const code = persona.code || '';
    const illustration = persona.illustration || (code ? `images/${code.toLowerCase()}.png` : '');
    const keywords = (cfg.visual_keywords || []).slice(0, 3);
    const paletteColors = (palette.colors || []).slice(0, 4);
    const moodLabel = cfg.mood || palette.mood || 'travel';

    const daysHtml = days.map(day => {
      const spots = (day.schedule || [])
        .filter(s => s.category !== 'move' && s.place)
        .slice(0, 3)
        .map(s => s.place)
        .join(' · ');
      return `
        <div class="sc-day-row" data-glass>
          <div class="sc-day-num">Day ${day.day}</div>
          <div class="sc-day-theme">${day.theme || ''}</div>
          <div class="sc-spots">${spots || '—'}</div>
        </div>`;
    }).join('');

    const summarySnip = (data.summary || '').slice(0, 55) +
                        ((data.summary || '').length > 55 ? '…' : '');
    const swatchesHtml = paletteColors.map(c => `<span class="sc-swatch" style="background:${c};"></span>`).join('');
    const keywordsHtml = keywords.map(k => `<span class="sc-keyword">${k}</span>`).join('');
    const stampHtml = (persona.name || code) ? `
        <div class="sc-persona-stamp" data-glass>
          <div class="sc-persona-illust">
            ${illustration ? `<img src="${illustration}" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';">` : ''}
            <span class="sc-persona-fallback" style="${illustration ? 'display:none;' : ''}">${(code || persona.name || '旅').slice(0, 2)}</span>
          </div>
          <div class="sc-persona-copy">
            <span class="sc-persona-label">Travel Type</span>
            <strong>${persona.name || '旅タイプ'}</strong>
            <small>${code}${persona.tagline ? ` · ${persona.tagline}` : ''}</small>
          </div>
        </div>` : '';

    container.innerHTML = `
      <div class="sc-bg" style="background:${palette.gradient};"></div>
      <div class="sc-body" style="--sc-accent:${palette.accent}; --sc-text:${palette.text};">
        <div class="sc-topline">
          <div class="sc-brand">Tabi OS</div>
          <div class="sc-mood">${moodLabel}</div>
        </div>
        <div class="sc-header" data-glass>
          <div class="sc-trip-title">${data.trip_title || ''}</div>
          <div class="sc-concept">${data.trip_concept || ''}</div>
        </div>
        ${stampHtml}
        <div class="sc-palette" data-glass>
          <div>
            <span class="sc-palette-label">Mood Palette</span>
            <strong>${cfg.palette_name || palette.name}</strong>
          </div>
          <div class="sc-swatches">${swatchesHtml}</div>
        </div>
        ${keywordsHtml ? `<div class="sc-keywords">${keywordsHtml}</div>` : ''}
        <div class="sc-days">${daysHtml}</div>
        <div class="sc-footer" data-glass>
          <div class="sc-summary-text">${cfg.caption || summarySnip}</div>
          <div class="sc-hashtag">#tabios</div>
        </div>
      </div>
    `;
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
