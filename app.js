/* ================================================================
app.js — Tabi OS Main Logic
Modules: AppState / themeManager / linkGenerator /
diagnosis / promptGenerator / shioriInputHandler / AppController
================================================================ */
'use strict';

/* ────────────────────────────────────────────────────────────────
0. App State
──────────────────────────────────────────────────────────────── */
const AppState = {
diagnosisResult: null,   // { code, name, tagline, desc }
currentTab: 'diagnosis',
destination: ''
};

/* ────────────────────────────────────────────────────────────────

1. themeManager
──────────────────────────────────────────────────────────────── */ 
const themeManager = {
personalities: {
PAVL: { name:'旅演出家',      tagline:'旅全体の世界観を作り込むタイプ',             desc:'あなたが訪れる旅はすべて完璧にプロデュースされた一本の美しい映画。綿密なスケジューリングと最高級のホテル、息をのむような絶景を余すことなく楽しむカリスマです。最高の世界観と上質な空間を調和させるセンスはピカイチです。' },
PAVS: { name:'景色収集家',    tagline:'絶景・映えスポットを賢くコレクションするタイプ', desc:'美しい光景を絶対に見逃さない、計画的でフットワークの軽いハントマスター。無駄のないルート計画で、話題の絶景スポットや旬な景色を抜群のタイパで集めて回ります。賢くコストを抑えながらも、写真映えのクオリティには一切の妥協なしです。' },
PAEL: { name:'感性探訪家',    tagline:'土地の文化・アートに深くひたるタイプ',         desc:'旅先での出会いや伝統、文化体験にじっくりと時間をかける知的なオーガナイザー。旅行前の計画に余念がなく、その土地ならではのプレミアムな伝統体験や美食に惜しみなく自己投資します。体験を通して教養を豊かにしていく贅沢な旅がお似合いです。' },
PAES: { name:'路地開拓士',    tagline:'まだ知られていない場所を計画的に開拓するタイプ', desc:'計画的かつ効率的に、知る人ぞ知る現地のローカル体験や本物の空気をハントする探検家。ガイドブックの奥深く、地元の人が愛する体験を求めてアクティブに足を運びます。誰も気づいていない「隠れ路地の名店」を開拓することに無上の喜びを感じるタイプです。' },
PCVL: { name:'余白貴族',      tagline:'何もしない時間も旅の楽しみなエレガントタイプ', desc:'ラグジュアリーな時間が流れる高級ホテルや、美しいデザインに囲まれてゆったり流れるひとときを愛するエレガントな旅人。贅沢な空間をあえて「何もしない」で味わい尽くす大人な旅を好みます。上質なサービスに癒されるのが最大の幸福です。' },
PCVS: { name:'カフェ漂流家',  tagline:'カフェや美術館をスマートに巡るカルチャーサーファー', desc:'お気に入りのブックカフェや静かな美術館を計画的に巡りながら、自分のペースで漂うことを好むアーティスト肌。スマートでおしゃれな空間に身を置き、時間を節約しながらも心豊かに街の美観をクリップしていきます。' },
PCEL: { name:'癒し滞在家',    tagline:'最高の宿で心身をリセットするヒーリングタイプ', desc:'綿密なプランニングで最高の宿やリラクゼーション体験をリザーブし、極上の快適さにひたる旅のヒーラー。スパや温泉、プライベートな自然環境に囲まれながら、極上のおもてなしに身を委ねます。移動や慌ただしさは最小限に抑えるのが流儀です。' },
PCES: { name:'静かな放浪家',  tagline:'静かなローカルの時間に没頭するインドア旅人', desc:'事前にしっかり安全な宿泊先や基本的な流れを設計した上で、旅先では静かにローカルな時間の移ろいに没頭する思索派。豪華さよりも「居心地の良さ」や「素朴な癒し」を重視し、読書のような静寂を愛するインドア派トラベラーです。' },
FAVL: { name:'夜更かし演出家', tagline:'直感とトキメキで夜の旅を彩るタイプ',          desc:'その瞬間のトキメキとノリを信じて旅を進める、お洒落で気ままな自由人。気分が高まった瞬間に高級なディナーを予約したり、思いつきで絶景の見えるルーフトップバーへと繰り出します。夜の街のきらめきを自分流にデコレーションしていく楽しさを噛み締めます。' },
FAVS: { name:'映え放浪家',    tagline:'直感で最高の映えを逃さない天性のセンサー',    desc:'直感を頼りに「今いちばん綺麗な場所」へと軽やかに飛び回る、天性のセンスを持つタイプ。ガチガチの計画は苦手。天気が良いからと夕日を見に走り、SNSで見つけた美しい景色へとノリ良く旅路を変えます。等身大でありながら、抜群のおしゃれアンテナを持っています。' },
FAEL: { name:'自由探検家',    tagline:'好奇心のままに飛び込むハプニング大歓迎タイプ', desc:'予定調和が大嫌い。現地で心が動いた方向へ好奇心旺盛に飛び込んでいく直感重視のチャレンジャー。その場だからこそ出会えるハプニング的なプレミアム体験に飛びつきます。あなたの旅はいつもドラマチックで予測不能です。' },
FAES: { name:'気まぐれ開拓士', tagline:'身軽さと直感でローカルを開拓する冒険者タイプ', desc:'思い立った瞬間に身軽なリュック一つでローカル線に飛び乗るような、冒険小説の主人公タイプ。予算はリーズナブルに抑えつつ、直感的に面白いと感じた怪しい路地裏やユニークな現地文化に恐れず関わっていきます。' },
FCVL: { name:'月夜の漂流家',  tagline:'気ままにラグジュアリーを楽しむ大人の自由人',  desc:'気まぐれにラグジュアリーな過ごし方を自分流にカスタムする、気高きマイペーストラベラー。旅先で朝目覚めてから「今日はあの高級ホテルスパでまったりしよう」と決めたり、夜風を浴びながらリッチなカクテルを楽しんだり。縛られない自由と贅沢なご褒美を愛します。' },
FCVS: { name:'余白収集家',    tagline:'風の吹くままに余白を愛するノマドタイプ',      desc:'風の吹くままにふらりと歩き、ふと見つけたお洒落なカフェの窓辺で何時間も過ごすような、余白を愛するノマドタイプ。スケジュールを一切持たないという「究極の贅沢」をスマートに楽しんでいます。' },
FCEL: { name:'空気感旅行家',  tagline:'目に見えない空気感や情緒を味わうポエトリーな旅人', desc:'旅先の街角の匂い、流れる音楽、地元の人たちの笑い声など「目に見えない愛おしい空気感」を、感覚を開いて受け取るポエトリーな旅人。急いでどこかへ行く計画はせず、ただ波の音を聞きながら揺られているだけで心が満たされます。' },
FCES: { name:'風まかせ人',    tagline:'最もニュートラルで自然体な究極の旅人',       desc:'最もルールに縛られない、最もニュートラルで気張らないナチュラル旅人。予算をかけず、計画も立てず、ただ「そこに呼ばれたから来た」ような自然体極まるスタイルを愛します。素朴なベンチに座ってぼーっと風の音を聞いている時間が一番の癒やしです。' }
},

getPersonalityByName(name) {
return Object.values(this.personalities).find(p => p.name === name) || null;
},

getDayBg(dayNum) {
const bgs = [
'rgba(232, 242, 255, 0.82)',
'rgba(255, 244, 232, 0.82)',
'rgba(232, 255, 242, 0.82)',
'rgba(248, 232, 255, 0.82)',
'rgba(255, 248, 232, 0.82)'
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

const fileDownloader = {
downloadText(filename, text, type = 'application/json') {
const blob = new Blob([text], { type: `${type};charset=utf-8` });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
setTimeout(() => URL.revokeObjectURL(url), 1000);
},

downloadCanvas(canvas, filename) {
const a = document.createElement('a');
a.href = canvas.toDataURL('image/png');
a.download = filename;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
}
};

const archiveManager = {
key: 'tabios_trip_archive',
limit: 50,

list() {
try {
  const items = JSON.parse(localStorage.getItem(this.key) || '[]');
  return Array.isArray(items) ? items : [];
} catch(e) {
  return [];
}
},

saveList(items) {
localStorage.setItem(this.key, JSON.stringify(items.slice(0, this.limit)));
},

saveTrip(data, area) {
const now = new Date();
const persona = data.traveler_personality || {};
const id = `trip_${now.getTime()}_${Math.random().toString(36).slice(2, 8)}`;
const item = {
  id,
  createdAt: now.toISOString(),
  title: data.trip_title || '旅のしおり',
  concept: data.trip_concept || '',
  destination: area || data.destination || data.area || data.hotel?.area || '',
  personality: {
    code: persona.code || '',
    name: persona.name || '',
    tagline: persona.tagline || ''
  },
  data
};
const items = [item, ...this.list()].slice(0, this.limit);
this.saveList(items);
return item;
},

openTrip(id) {
const item = this.list().find(entry => entry.id === id);
if (!item) return;
sessionStorage.setItem('tabios_shiori_data', JSON.stringify(item.data));
sessionStorage.setItem('tabios_destination', item.destination || '');
const newTab = window.open('shiori.html', '_blank');
if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
  window.location.href = 'shiori.html';
}
},

exportTrip(id) {
const item = this.list().find(entry => entry.id === id);
if (!item) return;
const filename = this._filename(item.title || 'tabios-shiori', item.createdAt);
fileDownloader.downloadText(filename, JSON.stringify(item.data, null, 2));
},

exportAll() {
const items = this.list();
const payload = {
  exported_at: new Date().toISOString(),
  app: 'Tabi OS',
  trips: items
};
fileDownloader.downloadText('tabios-trip-archive.json', JSON.stringify(payload, null, 2));
},

clear() {
localStorage.removeItem(this.key);
this.render();
},

render() {
const list = document.getElementById('archive-list');
const empty = document.getElementById('archive-empty');
if (!list || !empty) return;
const items = this.list();
empty.style.display = items.length ? 'none' : 'block';
list.innerHTML = items.map(item => this._cardHtml(item)).join('');
},

_cardHtml(item) {
const date = this._dateLabel(item.createdAt);
const destination = item.destination || '行き先未設定';
const persona = item.personality?.name || '旅タイプ未設定';
const title = this._esc(item.title || '旅のしおり');
const concept = this._esc(item.concept || '保存された旅のしおりです。');
return `
<article class="archive-card">
  <div>
    <div class="archive-meta">
      <span class="archive-pill">${this._esc(date)}</span>
      <span class="archive-pill">${this._esc(destination)}</span>
      <span class="archive-pill">${this._esc(persona)}</span>
    </div>
    <h3 class="archive-title">${title}</h3>
    <p class="archive-desc">${concept}</p>
  </div>
  <div class="archive-card-actions">
    <button type="button" class="btn-copy" data-archive-open="${this._esc(item.id)}">しおりを開く</button>
    <button type="button" class="btn-ghost" data-archive-export="${this._esc(item.id)}">JSON出力</button>
  </div>
</article>`;
},

_dateLabel(iso) {
const date = iso ? new Date(iso) : new Date();
if (Number.isNaN(date.getTime())) return '';
const p = n => String(n).padStart(2, '0');
return `${date.getFullYear()}.${p(date.getMonth() + 1)}.${p(date.getDate())}`;
},

_filename(title, iso) {
const safe = String(title).replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '-').slice(0, 40) || 'tabios-shiori';
return `${safe}-${this._dateLabel(iso).replace(/\./g, '')}.json`;
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

const diagnosisImageExporter = {
async download() {
const result = AppState.diagnosisResult;
if (!result) {
  alert('先に旅タイプ診断を完了してください。');
  return;
}
const canvas = document.createElement('canvas');
canvas.width = 1080;
canvas.height = 1350;
const ctx = canvas.getContext('2d');
this._drawBackground(ctx, canvas);
await this._drawTypeImage(ctx, result.code);
this._drawCopy(ctx, result);
fileDownloader.downloadCanvas(canvas, `tabios-${result.code.toLowerCase()}-diagnosis.png`);
},

_drawBackground(ctx, canvas) {
const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
grad.addColorStop(0, '#f5edf4');
grad.addColorStop(0.52, '#fbf7f1');
grad.addColorStop(1, '#edf3ef');
ctx.fillStyle = grad;
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = 'rgba(255,255,255,0.88)';
this._roundRect(ctx, 90, 90, 900, 1170, 56);
ctx.fill();
ctx.strokeStyle = 'rgba(111,93,125,0.14)';
ctx.lineWidth = 2;
ctx.stroke();
},

async _drawTypeImage(ctx, code) {
const src = `images/${String(code || '').toLowerCase()}.png`;
try {
  const img = await this._loadImage(src);
  const x = 315;
  const y = 185;
  const size = 450;
  ctx.save();
  this._roundRect(ctx, x, y, size, size, 44);
  ctx.clip();
  const ratio = Math.max(size / img.width, size / img.height);
  const w = img.width * ratio;
  const h = img.height * ratio;
  ctx.drawImage(img, x + (size - w) / 2, y + (size - h) / 2, w, h);
  ctx.restore();
} catch(e) {
  ctx.fillStyle = '#eee7f3';
  this._roundRect(ctx, 315, 185, 450, 450, 44);
  ctx.fill();
  ctx.fillStyle = '#9d87a8';
  ctx.font = '700 120px serif';
  ctx.textAlign = 'center';
  ctx.fillText('旅', 540, 455);
}
},

_drawCopy(ctx, result) {
ctx.textAlign = 'center';
ctx.fillStyle = '#6f5d7d';
ctx.font = '700 30px Montserrat, sans-serif';
ctx.fillText(`TYPE: ${result.code}`, 540, 700);

ctx.fillStyle = '#3c3432';
ctx.font = '700 78px serif';
ctx.fillText(result.name || '旅タイプ', 540, 800);

ctx.fillStyle = '#6f5d7d';
ctx.font = '700 31px sans-serif';
this._wrapText(ctx, result.tagline || '', 540, 875, 760, 46);

ctx.fillStyle = '#7f7470';
ctx.font = '400 28px sans-serif';
this._wrapText(ctx, result.desc || '', 540, 1010, 760, 44, 5);

ctx.fillStyle = '#9d87a8';
ctx.font = '700 28px Cinzel, serif';
ctx.fillText('TABI OS', 540, 1190);
},

_wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) {
const chars = Array.from(String(text || ''));
let line = '';
let lines = [];
chars.forEach(char => {
  const test = line + char;
  if (ctx.measureText(test).width > maxWidth && line) {
    lines.push(line);
    line = char;
  } else {
    line = test;
  }
});
if (line) lines.push(line);
lines = lines.slice(0, maxLines);
if (lines.length === maxLines && chars.length) {
  const last = lines[maxLines - 1];
  if (ctx.measureText(last).width >= maxWidth * 0.94) {
    lines[maxLines - 1] = `${last.slice(0, Math.max(0, last.length - 1))}…`;
  }
}
lines.forEach((lineText, index) => ctx.fillText(lineText, x, y + lineHeight * index));
},

_loadImage(src) {
return new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = src;
});
},

_roundRect(ctx, x, y, w, h, r) {
ctx.beginPath();
ctx.moveTo(x + r, y);
ctx.arcTo(x + w, y, x + w, y + h, r);
ctx.arcTo(x + w, y + h, x, y + h, r);
ctx.arcTo(x, y + h, x, y, r);
ctx.arcTo(x, y, x + w, y, r);
ctx.closePath();
}
};

/* ────────────────────────────────────────────────────────────────
3. diagnosis
──────────────────────────────────────────────────────────────── */
const diagnosis = {

questions: [
// ── P / F axis ──────────────────────────────────────────
{ id:1,  text:'旅行前、GoogleMapの保存がどんどん増えていく',                           axis:'P', rev:false },
{ id:2,  text:'その場で決まる予定変更はむしろワクワクして楽しい',                     axis:'P', rev:true  },
{ id:3,  text:'何をするか決まっていない時間があると、実は少し不安...',               axis:'P', rev:false },
{ id:4,  text:'あえて下調べせず、現地で偶然見つけた惹かれるお店に飛び込みたい',     axis:'P', rev:true  },
{ id:5,  text:'電車の乗り換えや移動時間まで細かく計算して予定を組む',               axis:'P', rev:false },
{ id:6,  text:'目的地を決めず「とりあえず歩く」時間が一番好きだったりする',         axis:'P', rev:true  },
{ id:7,  text:'人気店の予約が事前にしっかり取れていないと落ち着かない',             axis:'P', rev:false },
{ id:8,  text:'「旅行は予定通りに進まないもの」と最初から割り切っている',           axis:'P', rev:true  },
// ── A / C axis ──────────────────────────────────────────
{ id:9,  text:'せっかく行くなら、朝から予定をぎっしり詰め込みたい',                 axis:'A', rev:false },
{ id:10, text:'何もしないでボーッとする「カフェ休憩」の時間が旅の最重要項目だ',     axis:'A', rev:true  },
{ id:11, text:'「せっかくここまで来たんだから！」と欲張って予定を増やしがち',       axis:'A', rev:false },
{ id:12, text:'観光よりも、宿のベッドやお風呂でのんびりチャージする時間が必要だ',   axis:'A', rev:true  },
{ id:13, text:'一日の中に複数のエリアや観光スポットをどんどん回りたい',             axis:'A', rev:false },
{ id:14, text:'正直なところ、観光中の移動や人混みだけで疲れ果ててしまいやすい',     axis:'A', rev:true  },
{ id:15, text:'歩きすぎてヘトヘトになっても、夜遅くまで動き回れるタフさがある',     axis:'A', rev:false },
{ id:16, text:'予定はあえてスカスカにして、旅先での「ゆとり時間」を大事に残したい', axis:'A', rev:true  },
// ── V / E axis ──────────────────────────────────────────
{ id:17, text:'心奪われる美しい景色やおしゃれな空間を見ると、反射的にカメラを構える', axis:'V', rev:false },
{ id:18, text:'定番の有名観光スポットより、地元民にまぎれる空気感のほうが心惹かれる', axis:'V', rev:true  },
{ id:19, text:'気づけば旅先から戻ったスマホのカメラフォルダがとんでもない枚数になる',  axis:'V', rev:false },
{ id:20, text:'SNSで「映えるか」よりも、自分のリアルな感覚が「楽しいか」を優先したい', axis:'V', rev:true  },
{ id:21, text:'世界観が洗練されたおしゃれなカフェやホテルを熱心に探してしまう',       axis:'V', rev:false },
{ id:22, text:'お世辞にも綺麗とは言えないけれど、味のある「ローカル食堂」にワクワクする', axis:'V', rev:true },
{ id:23, text:'一緒にいる人を待たせてでも、完璧な写真を撮るために立ち止まってしまう', axis:'V', rev:false },
{ id:24, text:'観光パンフレットに載る名所に行くより、ただその街を歩くだけで満たされる', axis:'V', rev:true  },
// ── L / S axis ──────────────────────────────────────────
{ id:25, text:'旅行のクオリティを左右する「宿（宿泊）」にはお財布を気にせず投資したい', axis:'L', rev:false },
{ id:26, text:'移動費や交通機関にお金をかけるのはもったいない。できるだけ安く抑えたい', axis:'L', rev:true  },
{ id:27, text:'メニューを見ながら「せっかくの旅行なら、一番良い店に行こう」が口癖だ', axis:'L', rev:false  },
{ id:28, text:'高くて有名なお店より、コスパ最強な地元の「隠れた穴場」を探すのが得意だ', axis:'L', rev:true },
{ id:29, text:'旅先で足が疲れたら、ためらわずにタクシーを使う心の余裕がある',          axis:'L', rev:false },
{ id:30, text:'旅費をどれだけお得に安く抑えて攻略できたか、にゲーム感覚の喜びを感じる', axis:'L', rev:true },
{ id:31, text:'普段頑張っている自分へのおもてなしとして、旅先では多少の贅沢を許したい', axis:'L', rev:false },
{ id:32, text:'少し工夫してお得に節約ができると、なんだか密かに嬉しくなる',             axis:'L', rev:true  }
],

init() {
const container = document.getElementById('questions-container');
if (!container) return;
container.innerHTML = '';
const labels = ['そう思う', 'ややそう', 'どちらでも', 'あまり', '思わない'];
this.questions.forEach((q, i) => {
const card = document.createElement('div');
card.className = 'q-card';
card.id = `qcard-${q.id}`;
card.innerHTML =         `<span class="q-num">Q${String(i + 1).padStart(2, '0')}</span>         <p class="q-text">${q.text}</p>         <div class="q-options">           ${[5, 4, 3, 2, 1].map((v, idx) =>`
<label class="opt-label">
<input type="radio" name="q${q.id}" value="${v}" class="opt-radio">
<div class="opt-circle"></div>
<span class="opt-mini">${labels[idx]}</span>
</label>
`).join('')}         </div>`       ;
container.appendChild(card);
});

// Remove error highlight on answer
container.addEventListener('change', e => {
  const name = e.target.name;
  if (!name) return;
  const id = name.replace('q', '');
  const card = document.getElementById(`qcard-${id}`);
  if (card) card.classList.remove('error');
});

},

calculate(form) {
const scores = { P: 0, A: 0, V: 0, L: 0 };
for (const q of this.questions) {
const el = form.querySelector(`input[name="q${q.id}"]:checked`);
if (!el) return null;
let val = parseInt(el.value, 10);
if (q.rev) val = 6 - val;
scores[q.axis] += val;
}
return scores;
},

getCode(scores) {
const th = 24;
return (scores.P >= th ? 'P' : 'F') +
(scores.A >= th ? 'A' : 'C') +
(scores.V >= th ? 'V' : 'E') +
(scores.L >= th ? 'L' : 'S');
},

submit(form) {
const unanswered = this.questions.filter(q =>
!form.querySelector(`input[name="q${q.id}"]:checked`)
);
document.querySelectorAll('.q-card').forEach(c => c.classList.remove('error'));

if (unanswered.length > 0) {
  unanswered.forEach(q => {
    document.getElementById(`qcard-${q.id}`)?.classList.add('error');
  });
  document.getElementById(`qcard-${unanswered[0].id}`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const nums = unanswered.map(q => {
    const idx = this.questions.findIndex(x => x.id === q.id);
    return `${idx + 1}問目`;
  });
  const err = document.getElementById('quiz-error');
  err.textContent = `${nums.join('、')} が未回答です。`;
  err.style.display = 'block';
  return;
}
document.getElementById('quiz-error').style.display = 'none';

const scores = this.calculate(form);
const code = this.getCode(scores);
const persona = themeManager.personalities[code];

AppState.diagnosisResult = { code, ...persona };
sessionStorage.setItem('tabios_personality', JSON.stringify(AppState.diagnosisResult));

// Auto-fill prompt tab personality selector
const sel = document.getElementById('my-personality');
if (sel && persona) sel.value = persona.name;

this._showResult(code, persona, scores);

},

_showResult(code, persona, scores) {
const view = document.getElementById('result-view');
const img = document.getElementById('result-img');
const fallback = document.getElementById('result-img-fallback');

img.style.display = 'none';
fallback.style.display = 'flex';
img.src = `images/${code.toLowerCase()}.png`;

document.getElementById('result-code').textContent = code;
document.getElementById('result-name').textContent = persona?.name ?? code;
document.getElementById('result-tagline').textContent = persona ? `「${persona.tagline}」` : '';
document.getElementById('result-desc').textContent = persona?.desc ?? '';

view.style.display = 'block';

const pct = s => Math.max(0, Math.min(100, Math.round(((s - 8) / 32) * 100)));
setTimeout(() => {
  document.getElementById('bar-PF').style.width = `${100 - pct(scores.P)}%`;
  document.getElementById('bar-AC').style.width = `${100 - pct(scores.A)}%`;
  document.getElementById('bar-VE').style.width = `${100 - pct(scores.V)}%`;
  document.getElementById('bar-LS').style.width = `${100 - pct(scores.L)}%`;
}, 120);

view.scrollIntoView({ behavior: 'smooth', block: 'start' });

},

reset(form) {
form.reset();
document.querySelectorAll('.q-card').forEach(c => c.classList.remove('error'));
document.getElementById('quiz-error').style.display = 'none';
document.getElementById('result-view').style.display = 'none';
document.getElementById('result-img').src = '';
AppState.diagnosisResult = null;
sessionStorage.removeItem('tabios_personality');
window.scrollTo({ top: 0, behavior: 'smooth' });
}
};

/* ────────────────────────────────────────────────────────────────
4. promptGenerator
──────────────────────────────────────────────────────────────── */
const promptGenerator = {

personalityDescs: {
'旅演出家':    '旅行を完璧にコーディネートし、洗練されたおもてなし空間と最高の世界観を体験したいプロデューサー気質のタイプ',
'景色収集家':  '綿密なプランを立て、話題の映えるスポットや旬な絶景を効率よく収めて回りたいタイパ重視のハンタータイプ',
'感性探訪家':  '事前にしっかり下調べをしたうえで、その土地ならではの本物の文化・アート・体験にじっくり浸りたいタイプ',
'路地開拓士':  '効率的な計画を組みつつ、定番観光地よりも現地のローカルな路地裏やリアルな体験を開拓したいタイプ',
'余白貴族':    '贅沢なホテルや宿を予約し、その洗練された最高級の空間の中で「あえて何もしない余白」を楽しむエレガントなタイプ',
'カフェ漂流家': '大好きな世界観のカフェや美術館をスマートに下調べし、そこに佇んで自分のペースを最優先して楽しむカルチャー重視のタイプ',
'癒し滞在家':  '最高の温泉宿やリゾート・スパをあらかじめ予約し、移動を極力減らしてただ宿のおもてなしと癒しの空気に没頭したいヒーリングタイプ',
'静かな放浪家': 'あらかじめ安全な土台は確保しつつ、旅先では静かで素朴なローカルの時間と静寂に浸る知的なインドアタイプ',
'夜更かし演出家': '型にはまったスケジュールを嫌い、その瞬間のトキメキや深夜のきらめく景色などエモーショナルな瞬間を直感でカスタムするタイプ',
'映え放浪家':  '計画に縛られず、その瞬間のフィーリングに合わせて「いま一番フォトジェニックな場所」へノリよく移動するセンス重視タイプ',
'自由探検家':  '予測不能なハプニングや、その場でしか出会えないプレミアムな体験・アドベンチャーに直感で飛び込んでいく熱量の高いタイプ',
'気まぐれ開拓士': '身軽さと直感を武器に、ローカル線に乗ったりディープな大衆食堂の扉を開けたりしながら本物の現地体験を開拓する気まぐれな冒険者タイプ',
'月夜の漂流家': '一切縛られない気ままな自由を楽しみつつ、その日の気分で極上のリラクゼーションや贅沢なカクテルを楽しむ大人の自由人タイプ',
'余白収集家':  '何ひとつスケジュールを持たずにふらりと街に出て、出会ったおしゃれなカフェで風を感じながらのんびりと余白をクリップするタイプ',
'空気感旅行家': '美しい宿泊先だけは確保しつつ、予定を一切作らずに地元の何気ない街の音・香り・おもてなしなど情緒的な空気をゆったり吸い込むタイプ',
'風まかせ人':  '予算も計画も全く決めず、観光地化された場所を避け、ただのんびりと素朴なローカルの時間と同化する究極に自然体なタイプ'
},

_fmtDT(dtStr) {
if (!dtStr) return '';
const d = new Date(dtStr);
const p = n => String(n).padStart(2, '0');
return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
},

_timeOnly(dtStr) {
if (!dtStr) return '';
const d = new Date(dtStr);
const p = n => String(n).padStart(2, '0');
return `${p(d.getHours())}:${p(d.getMinutes())}`;
},

_checked(selector) {
return Array.from(document.querySelectorAll(`${selector}:checked`)).map(el => el.value);
},

submit(form) {
const myPersona    = document.getElementById('my-personality').value;
const destination  = document.getElementById('destination').value.trim();
const arrDt        = document.getElementById('arrival-dt').value;
const depDt        = document.getElementById('departure-dt').value;
const duration     = document.getElementById('duration').value;
const members      = document.getElementById('members').value;
const companion    = form.querySelector('input[name="companion"]:checked')?.value;
const partnerPers  = document.getElementById('partner-personality').value;
const budget       = document.getElementById('budget').value;
const transport    = document.getElementById('transport').value;
const fatigue      = form.querySelector('input[name="fatigue"]:checked')?.value;
const eat          = form.querySelector('input[name="eat"]:checked')?.value;
const photo        = form.querySelector('input[name="photo"]:checked')?.value;
const themes       = this._checked('#th-heal, #th-fun, #th-eat, #th-photo, #th-nature, #th-luxury, #th-special');
const avoids       = this._checked('#av-q, #av-cr, #av-er, #av-ti, #av-lm, #av-op');
const hotels       = this._checked('#ht-sl, #ht-sa, #ht-vw, #ht-ph, #ht-on, #ht-lc');

const errEl = document.getElementById('prompt-error');
if (!myPersona || !destination || !arrDt || !depDt || !duration || !budget || !transport) {
  errEl.textContent = '必須項目（*）をすべて入力・選択してください。';
  errEl.style.display = 'block';
  return;
}
if (new Date(arrDt) >= new Date(depDt)) {
  errEl.textContent = '出発日時は到着日時より後に設定してください。';
  errEl.style.display = 'block';
  return;
}
errEl.style.display = 'none';

// Save destination for shiori
AppState.destination = destination;
sessionStorage.setItem('tabios_destination', destination);

const myDesc = this.personalityDescs[myPersona] || '';
const personaEntry = Object.entries(themeManager.personalities).find(([, p]) => p.name === myPersona);
const personaCode = AppState.diagnosisResult?.code || personaEntry?.[0] || '';
const personaTagline = AppState.diagnosisResult?.tagline || personaEntry?.[1]?.tagline || '';
const partnerDesc = partnerPers
  ? `${partnerPers}（${this.personalityDescs[partnerPers] || '特性を大切にした旅の仲間'}）`
  : '指定なし（AIにおまかせ）';
const arrTime = this._timeOnly(arrDt);
const depTime = this._timeOnly(depDt);

const prompt = `あなたは、旅の「世界観」や「人間の情緒・価値観」を深く理解し、型通りの観光地巡りではない最高の旅をデザインしてくれる『一流の旅コンシェルジュ』です。

私たちの価値観やコンディションに寄り添った、最高に愛おしい旅行プランを提案してください。

ーーー

### 🕊️ 旅のキャスト

- **私の旅タイプ**: 「${myPersona}」です。私は普段、${myDesc}を大切にしています。
- **診断コード**: ${personaCode || '未診断'}
- **旅タイプのタグライン**: ${personaTagline || '未指定'}
- **同行者**: ${companion === '一人旅' ? '今回は「一人旅」をします。' : `今回は「${companion}」と「${members}名」で旅に出ます。`}
${companion !== '一人旅' ? `**同行者の旅タイプ**: ${partnerDesc}` : ''}

### 🗺️ 旅の輪郭

- **行き先**: ${destination}
- **日程**: ${duration}
- **1人あたり予算**: ${budget}程度
- **主な移動手段**: ${transport}
- **到着日時**: ${this._fmtDT(arrDt)}（初日は${arrTime}以降から行動可能）
- **出発日時**: ${this._fmtDT(depDt)}（最終日は${depTime}までに帰路へ）

### 🌿 今回の旅に求めること

${themes.length > 0 ? `* **旅のテーマ**: 「${themes.join('、')}」を大事にしたいです。` : '* **旅のテーマ**: 心と感性が喜ぶような体験を楽しみたいです。'}

- **体力ペース**: 「${fatigue}」というペースで進みたいです。
- **食事へのこだわり**: 「${eat}」という思いがあります。
- **写真の距離感**: 「${photo}」という気持ちを大切にさせてください。
${hotels.length > 0 ? `**宿へのこだわり**: ${hotels.join('、')}を重視した宿泊先を提案してください。` : ''}

### 🚫 避けたいこと

${avoids.length > 0 ? `* 「${avoids.join('、')}」を完全に排除できる動線でお願いします。` : '* 心地よい時間の余白を重視してください。'}

ーーー

### 🎯 プランニング指示

- 初日の行動開始時間（${arrTime}）と最終日の帰路デッドライン（${depTime}）を厳守すること。
- 現地の実際の位置関係に基づき、逆戻りのないスムーズな移動導線にすること。
- 体力ペースを最優先し、詰め込みすぎないゆとりのあるスケジュールにすること。
- 実際の営業時間・定休日を考慮し、移動時間はバッファ込みで設計すること。
- 天候変化に備えた「雨天代替案」を適宜織り交ぜること。

⚠️ URLはすべて空文字のまま出力してください（システムが自動生成します）。
⚠️ 回答はJSON形式のみで出力し、挨拶・説明文・コードブロック記号は不要です。
⚠️ 可能であれば、回答は「tabios_shiori.json.txt」というテキストファイルとして出力してください。ファイル本文にはJSONのみを入れてください。
⚠️ テキストファイル出力ができない環境では、チャット本文にJSONのみをそのまま出力してください。

### 【JSON出力ルール（厳守）】

- 出力はRFC8259準拠の有効なJSONのみ
- JSONの前後に説明文を出力しない
- Markdownコードブロック（\`\`\`json）は使用しない
- すべてのキー・文字列は半角ダブルクォート(")を使用する
- 全角クォート（“ ”）は禁止
- 全角アポストロフィ（‘ ’）は禁止
- 文字列内で改行しない
- 改行が必要な場合は \\n を使用する
- 配列・オブジェクト末尾のカンマは禁止
- true / false / null は小文字で出力する
- 数値は文字列にしない（例："1200"ではなく1200）
- URL項目は必ず空文字 "" を設定する
- JSON.parse() で読み込める形式で出力する
- Unicode文字はそのまま出力する（\\uエスケープ不要）

### 🎨 Instagram画像デザイン（image_config）の設計指示

旅プランJSONに加え、Canvas で Instagram ストーリー（1080×1920px）用画像を生成するための 「image_config」 オブジェクトを必ず含めてください。設計の際は以下のルールを厳守してください。

- **theme_color**（プライマリ背景色）は行き先のイメージカラーを16進数で指定すること。
  例：海・沖縄系 → "#A8D4EC" / 京都・和系 → "#D4B896" / 森・自然系 → "#B4D4B4" / 都市・夜系 → "#C8C0E8" / 韓国系 → "#F0C8D4"
- **background_style** は "gradient"（推奨）または "solid" から選択すること。
- 背景色は theme_color をベースとし、洗練された余白を活かしたデザインを前提とすること。
- **highlight_spots** はDay全体から画像上に映えるスポットを3〜5件厳選すること。
- **visual_keywords** はこの旅の世界観・空気感を表す日本語キーワードを3〜5個選ぶこと。
- **caption** はInstagram投稿に使える自然な日本語で60文字以内に収めること。
- **traveler_personality_stamp** は true にし、旅タイプ診断結果をInstagram投稿用画像に入れる前提で設計すること。
- **palette_name** は旅先・季節・ムードをひとことで表す名前にすること。
- **palette_colors** は投稿内の世界観確認に使える4色の16進数カラー配列にすること。

### 💰 費用見積もり指示

- 各 schedule 項目ごとに、1人あたりの概算費用を必ず調べて推定してください。
- 入場料、飲食代、体験料、施設利用料、移動費など、その工程で主に発生する費用を含めてください。
- 無料の場合は cost_yen: 0、cost_label: "無料" としてください。
- 金額が変動する場合は妥当な中央値を cost_yen に入れ、cost_label には "約1,000〜1,500円" のような表示文を入れてください。
- 不確実な場合でも空欄にせず、一般的な相場から推定し、cost_note に "時期・店舗により変動" など補足してください。

### ⚠️ 出力フォーマット（必須）

{
"trip_title": "旅タイトル（おしゃれに）",
"trip_concept": "旅のコンセプト（100文字程度）",
"traveler_personality": {
"code": "${personaCode}",
"name": "${myPersona}",
"tagline": "${personaTagline}",
"illustration": "images/${(personaCode || 'personality').toLowerCase()}.png"
},
"days": [
{
"day": 1,
"theme": "この日のテーマ",
"schedule": [
{
"time": "HH:MM",
"place": "スポット名",
"category": "cafe / lunch / sightseeing / hotel / dinner / activity / move のいずれか",
"reason": "【${myPersona}】の感性に寄り添った提案理由（おしゃれな文体で）",
"stay_minutes": 60,
"move_to_next": "次への移動方法と時間目安",
"cost_yen": 1200,
"cost_label": "約1,200円",
"cost_note": "入場料・飲食代・体験料・施設利用料・移動費など、この工程で主に発生する1人あたり概算",
"tips": "混雑回避・ベストアングル等のワンポイント情報"
}
]
}
],
"hotel": {
"area": "おすすめ宿泊エリアまたはホテルの方向性",
"reason": "【${myPersona}】の感性に合う理由"
},
"summary": "コンシェルジュからの温かいエールメッセージ（150文字程度）",
"image_config": {
"theme_color": "#16進数カラー（行き先イメージのプライマリ背景色）",
"theme_color_secondary": "#16進数カラー（グラデーション第2色。theme_colorより少し明るく）",
"accent_color": "#16進数カラー（見出し・強調に使うアクセント色）",
"text_color": "#16進数カラー（背景上で読みやすい本文テキスト色）",
"background_style": "gradient",
"destination_vibe": "ocean / traditional / nature / urban / resort / cafe のいずれか1つ",
"mood": "この旅のムードを表す英単語1語（例: serene / vibrant / nostalgic / cozy）",
"palette_name": "旅先や季節から抽出したカラーパレット名",
"palette_colors": ["#テーマ色1", "#テーマ色2", "#テーマ色3", "#テーマ色4"],
"traveler_personality_stamp": true,
"highlight_spots": ["画像に載せるスポット名1", "スポット名2", "スポット名3"],
"visual_keywords": ["旅の世界観キーワード1", "キーワード2", "キーワード3"],
"caption": "Instagram投稿用キャプション（60文字以内・日本語・ハッシュタグなし）"
}
}`;

const output = document.getElementById('prompt-output');
output.textContent = prompt;
const result = document.getElementById('prompt-result');
result.style.display = 'block';
document.getElementById('copy-toast').style.display = 'none';
result.scrollIntoView({ behavior: 'smooth', block: 'start' });

},

copy() {
const text = document.getElementById('prompt-output').textContent;
const ta = document.createElement('textarea');
ta.value = text;
ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
document.body.appendChild(ta);
ta.select();
try {
document.execCommand('copy');
const toast = document.getElementById('copy-toast');
toast.style.display = 'block';
setTimeout(() => { toast.style.display = 'none'; }, 2500);
} catch(e) {
console.warn('Copy failed', e);
}
document.body.removeChild(ta);
}
};

/* ────────────────────────────────────────────────────────────────
5. shioriInputHandler
──────────────────────────────────────────────────────────────── */
const shioriInputHandler = {
open() {
const raw = document.getElementById('json-input').value.trim();
const errEl = document.getElementById('shiori-error');

if (!raw) {
  errEl.textContent = 'JSONデータを入力してください。';
  errEl.style.display = 'block';
  return;
}

let cleaned = raw;
if (cleaned.includes('```json')) cleaned = cleaned.split('```json')[1];
if (cleaned.includes('```'))     cleaned = cleaned.split('```')[0];
cleaned = cleaned.trim();

let data;
try {
  data = JSON.parse(cleaned);
} catch(e) {
  errEl.textContent = 'JSONの形式が正しくありません。括弧や引用符を確認してください。';
  errEl.style.display = 'block';
  return;
}

errEl.style.display = 'none';

const area = document.getElementById('destination').value.trim() ||
             AppState.destination ||
             sessionStorage.getItem('tabios_destination') || '';
const storedPersona = AppState.diagnosisResult || (() => {
  try { return JSON.parse(sessionStorage.getItem('tabios_personality') || 'null'); }
  catch(e) { return null; }
})();

if (storedPersona && !data.traveler_personality) {
  data.traveler_personality = {
    code: storedPersona.code || '',
    name: storedPersona.name || '',
    tagline: storedPersona.tagline || '',
    illustration: storedPersona.code ? `images/${storedPersona.code.toLowerCase()}.png` : ''
  };
}

if (data.image_config && storedPersona) {
  data.image_config.traveler_personality_stamp = true;
}

sessionStorage.setItem('tabios_shiori_data', JSON.stringify(data));
sessionStorage.setItem('tabios_destination', area);
archiveManager.saveTrip(data, area);
archiveManager.render();

// Open in new tab; fall back to same tab if popup is blocked
const newTab = window.open('shiori.html', '_blank');
if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
  window.location.href = 'shiori.html';
}

}
};

/* ────────────────────────────────────────────────────────────────
6. AppController
──────────────────────────────────────────────────────────────── */
const AppController = {

init() {
// ── Tab switching ──
document.querySelectorAll('.tab-btn').forEach(btn => {
btn.addEventListener('click', () => this.switchTab(btn.dataset.panel));
});

// ── Diagnosis ──
diagnosis.init();

const quizForm = document.getElementById('quiz-form');
if (quizForm) {
  quizForm.addEventListener('submit', e => { e.preventDefault(); diagnosis.submit(quizForm); });
}

document.getElementById('btn-reset-quiz')?.addEventListener('click', () => {
  diagnosis.reset(quizForm);
});

document.getElementById('btn-to-prompt')?.addEventListener('click', () => {
  this.switchTab('prompt');
});

document.getElementById('btn-save-diagnosis')?.addEventListener('click', () => {
  diagnosisImageExporter.download();
});

// Image load/error
const img = document.getElementById('result-img');
const fallback = document.getElementById('result-img-fallback');
if (img) {
  img.addEventListener('load', () => {
    img.style.display = 'block';
    if (fallback) fallback.style.display = 'none';
  });
  img.addEventListener('error', () => {
    img.style.display = 'none';
    if (fallback) fallback.style.display = 'flex';
  });
}

// ── Companion toggle ──
document.querySelectorAll('input[name="companion"]').forEach(r => {
  r.addEventListener('change', e => {
    const wrap = document.getElementById('partner-wrap');
    if (wrap) wrap.style.display = e.target.value === '一人旅' ? 'none' : 'block';
  });
});

// ── Prompt form ──
const promptForm = document.getElementById('prompt-form');
if (promptForm) {
  promptForm.addEventListener('submit', e => { e.preventDefault(); promptGenerator.submit(promptForm); });
}

document.getElementById('btn-copy-prompt')?.addEventListener('click', () => {
  promptGenerator.copy();
});

// ── Shiori ──
document.getElementById('btn-gen-shiori')?.addEventListener('click', () => {
  shioriInputHandler.open();
});

// ── Archive ──
archiveManager.render();

document.getElementById('btn-export-archive')?.addEventListener('click', () => {
  archiveManager.exportAll();
});

document.getElementById('btn-clear-archive')?.addEventListener('click', () => {
  if (confirm('保存した旅の記録をすべて削除しますか？')) {
    archiveManager.clear();
  }
});

document.getElementById('archive-list')?.addEventListener('click', e => {
  const openId = e.target.closest('[data-archive-open]')?.dataset.archiveOpen;
  const exportId = e.target.closest('[data-archive-export]')?.dataset.archiveExport;
  if (openId) archiveManager.openTrip(openId);
  if (exportId) archiveManager.exportTrip(exportId);
});

},

switchTab(panelName) {
document.querySelectorAll('.tab-btn').forEach(btn => {
btn.classList.toggle('active', btn.dataset.panel === panelName);
});
document.querySelectorAll('.app-panel').forEach(panel => {
const isActive = panel.id === `panel-${panelName}`;
if (isActive) {
panel.classList.add('active');
} else {
panel.classList.remove('active');
}
});
AppState.currentTab = panelName;
window.scrollTo({ top: 0, behavior: 'smooth' });
}
};

/* ────────────────────────────────────────────────────────────────
7. Init
──────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
AppController.init();
});
