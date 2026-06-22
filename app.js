/* ================================================================
app.js — Tabi OS Main Logic
Modules: AppState / themeManager / linkGenerator /
diagnosis / promptGenerator / shioriInputHandler / AppController
================================================================ */
'use strict';

function trackEvent(eventName, params = {}) {
if (typeof gtag === "function") {
  gtag("event", eventName, params);
}
}

/* ────────────────────────────────────────────────────────────────
0. App State
──────────────────────────────────────────────────────────────── */
const AppState = {
diagnosisResult: null,   // { code, name, tagline, desc }
currentTab: 'diagnosis',
destination: '',
analytics: {
  diagnosisStarted: false
}
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

const travelTypeProfiles = {
PAVL:{animal:'キツネ',catchphrase:'旅全体の世界観を、美しく組み立てる人。',shortDescription:'行きたい場所やホテル、カフェ、移動ルートまで、旅全体のストーリーを考えるのが好き。同行者の笑顔を想像しながら、最高の旅をプロデュースします。',style:'旅をひとつの作品のように設計し、宿・食事・景色・移動の流れまで美しく整えます。',prep:'旅行前はGoogleマップの保存、ホテル比較、予約導線までかなり丁寧に確認します。',stress:'予定変更や曖昧な返事が続くと、自分だけで抱え込みやすいところがあります。',strengths:['旅全体を俯瞰して計画できる','同行者の好みまで考えられる','旅先選びで大きく外しにくい'],cautions:['予定変更が続くと疲れやすい','準備をひとりで抱え込みやすい'],companionView:'全部考えてくれて頼もしい、任せれば外さないと思われやすいタイプです。',travelTraits:['旅行前からGoogleマップの保存件数が増える','宿と食事の世界観が合っているか気になる','良い写真が撮れる時間帯まで考える','同行者に候補を見せながら、実はおすすめを決めている','予定変更が起きるとすぐ代替案を考える']},
PAVS:{animal:'リス',catchphrase:'絶景と効率を、軽やかに集める人。',shortDescription:'話題の景色や写真に残したい場所を、無理のない順番で集めていくのが得意。コスパと満足度のバランスを取りながら、旅の見どころを逃しません。',style:'限られた時間で見たい景色をきちんと回収し、写真に残る満足感を大切にします。',prep:'事前にアクセスや営業時間を調べ、無駄な移動を減らすルート作りに安心します。',stress:'期待していた景色が見られない、時間が押して撮影機会を逃す場面に弱いです。',strengths:['効率よく見どころを巡れる','写真映えと予算のバランスがうまい','下調べが堅実'],cautions:['詰め込みすぎると疲れやすい','写真の成果に気分が左右されやすい'],companionView:'段取りがよく、良い景色へ連れて行ってくれる人として見られます。',travelTraits:['日の入り時間を確認する','移動時間の短さにうれしくなる','展望台や海沿いに反応する','無料でも映える場所を探す','撮影後に次の場所へすぐ切り替える']},
PAEL:{animal:'フクロウ',catchphrase:'土地の物語を、深く味わう人。',shortDescription:'文化、アート、食、歴史を丁寧にたどり、その土地ならではの意味を感じる旅を好みます。予約や下調べも、深く楽しむための準備です。',style:'観光地を消費するより、背景にある文化や作り手の思いを知ることで満たされます。',prep:'美術館、名店、伝統体験などを事前に調べ、価値ある体験に時間とお金を使います。',stress:'浅い情報だけで動く旅や、慌ただしく通過するだけの旅には物足りなさを感じます。',strengths:['土地の魅力を深く掘れる','予約や手配が丁寧','旅後の記憶が濃い'],cautions:['説明や背景を重視しすぎて同行者を待たせやすい','予定の密度が重くなりやすい'],companionView:'知的で、旅に奥行きを足してくれる人として頼られます。',travelTraits:['企画展の会期を確認する','老舗や作家ものに弱い','食事の背景まで知りたい','旅先で本や図録を買う','静かな感動を長く覚えている']},
PAES:{animal:'イタチ',catchphrase:'ローカルの奥へ、計画的に踏み込む人。',shortDescription:'有名どころだけでなく、地元の路地や市場、個人店を計画的に開拓します。効率よく動きながらも、旅先のリアルな空気を拾うのが得意です。',style:'下調べを武器に、観光パンフレットの外側にある面白さを探します。',prep:'口コミや地図を見比べ、行きにくい場所も安全に回れる順番を組みます。',stress:'チェーン店ばかりの旅や、現地感のない予定には退屈しやすいです。',strengths:['穴場を見つける力がある','計画的にローカル体験へ行ける','移動判断が現実的'],cautions:['マニアックになりすぎることがある','同行者の快適さを忘れがち'],companionView:'普通の旅行では出会えない場所へ連れて行ってくれる人です。',travelTraits:['市場や商店街に寄りたい','路地の看板を見て足が止まる','地元客の多い店に惹かれる','交通手段を細かく調べる','穴場を見つけると共有したくなる']},
PCVL:{animal:'白鳥',catchphrase:'何もしない贅沢を、きちんと味わう人。',shortDescription:'上質な宿や美しい空間で、予定を詰め込まずに過ごす時間を大切にします。旅先での余白そのものを、特別な体験として楽しめる人です。',style:'旅の中心は移動量よりも、心身がほどける空間とゆったりした時間です。',prep:'宿の雰囲気、部屋、ラウンジ、温泉、朝食まで吟味して選びます。',stress:'予定を詰め込まれたり、落ち着かない場所へ連れ回されると消耗します。',strengths:['上質な宿選びがうまい','余白の価値を知っている','旅に落ち着きを作れる'],cautions:['動き出しが遅くなりやすい','贅沢基準が同行者とずれることがある'],companionView:'一緒にいると旅が大人っぽく整う、安心感のある人です。',travelTraits:['ホテル滞在時間を長めに取る','朝食やラウンジにこだわる','何もしない時間を予定に入れる','静かな景色に満足する','部屋の照明や香りが気になる']},
PCVS:{animal:'ネコ',catchphrase:'カフェと美術館を、自分の速度でめぐる人。',shortDescription:'カフェ、美術館、雑貨店など、心地よい場所を計画的に選びながら静かに旅を楽しみます。映えよりも、自分の感性が落ち着く空間を大切にします。',style:'移動は少なめでも、好きな場所でゆっくり過ごすことで旅の満足度が上がります。',prep:'混雑しにくい時間帯や近くのカフェを調べ、疲れない流れを作ります。',stress:'人混みや大きな音、急な予定追加が続くと集中力が切れます。',strengths:['心地よい場所選びが上手','無理のない計画を作れる','静かな時間を楽しめる'],cautions:['予定を控えめにしすぎることがある','興味のない場所では反応が薄く見える'],companionView:'落ち着いた旅にしてくれる、センスの良い人と思われます。',travelTraits:['ブックカフェを探す','美術館のショップも楽しむ','混雑回避が得意','長めの休憩を正当化できる','窓際席に弱い']},
PCEL:{animal:'カピバラ',catchphrase:'癒しを予約して、心身を整える人。',shortDescription:'温泉、スパ、サウナ、宿時間など、回復できる体験を大切にします。無理に動き回るより、旅先でちゃんと休めたことに満足を感じます。',style:'旅をリセットの時間として捉え、体力と気分が整う選択を優先します。',prep:'予約、移動負担、休憩時間を確認し、疲れない旅程を準備します。',stress:'移動が多すぎる日程や、休む場所がない旅では表情が曇りやすいです。',strengths:['回復できる旅を設計できる','無理をしない判断ができる','宿や温浴施設選びがうまい'],cautions:['刺激の多い旅を避けすぎることがある','同行者の活動欲と差が出やすい'],companionView:'一緒にいると旅が穏やかになり、休む大切さを思い出させてくれる人です。',travelTraits:['温泉やサウナ付きに反応する','移動時間が長いと不安','夕方以降は宿で過ごしたい','寝具や静けさを重視する','旅後に元気になっていたい']},
PCES:{animal:'ハリネズミ',catchphrase:'静かなローカル時間に、そっと潜る人。',shortDescription:'安全な骨組みだけ整えたうえで、旅先では静かな街角や小さな店で過ごすことを好みます。派手さよりも、居心地と素朴な空気を大切にします。',style:'旅先で目立つより、その土地の日常にそっと混ざることに満足します。',prep:'宿や基本ルートは確認しつつ、細部は静かな偶然に任せます。',stress:'大人数の行動や賑やかな観光地が続くと、ひとりの時間が欲しくなります。',strengths:['静かな良さを見つけられる','安全面の準備が堅実','無理なく旅を続けられる'],cautions:['希望を言わずに我慢しやすい','消極的に見られることがある'],companionView:'落ち着いていて、旅の空気をやわらかくしてくれる人です。',travelTraits:['早朝の散歩が好き','地元の小さな店に入る','混雑を見ると予定変更する','読書できる場所を探す','静かな宿にほっとする']},
FAVL:{animal:'オオカミ',catchphrase:'夜のきらめきを、直感で演出する人。',shortDescription:'旅先の夜景、バー、少し特別な食事など、その瞬間のときめきを逃しません。計画に縛られず、気分が乗った方向へ旅を華やかに変えていきます。',style:'予定よりも、その場で心が動いた瞬間のドラマを大切にします。',prep:'細かく決めすぎず、良さそうな候補をいくつか持って出発します。',stress:'自由に動けない旅や、盛り上がった瞬間に止められる場面に弱いです。',strengths:['旅に高揚感を作れる','直感で良い店を選べる','夜の過ごし方が上手'],cautions:['予算が膨らみやすい','翌日の体力を忘れがち'],companionView:'一緒にいると旅が映画みたいに楽しくなる人です。',travelTraits:['夜景を見ると予定変更したくなる','バーやルーフトップに弱い','直前予約に強い','良い雰囲気に投資する','帰る時間が遅くなりがち']},
FAVS:{animal:'ウサギ',catchphrase:'今いちばん美しい瞬間へ、軽やかに跳ぶ人。',shortDescription:'天気、光、SNSで見た景色などに反応して、直感的に行き先を変えます。リーズナブルでも写真に残る満足感を大切にするタイプです。',style:'完璧な計画よりも、今この瞬間のきれいさや楽しさを優先します。',prep:'候補は集めますが、当日の気分や天気で軽やかに組み替えます。',stress:'予定を固定されすぎたり、写真を撮る時間がないと不完全燃焼になりがちです。',strengths:['美しい瞬間を見つける感度が高い','身軽に予定変更できる','楽しい空気を作れる'],cautions:['移動効率を見落としやすい','写真優先に見られることがある'],companionView:'一緒にいるとかわいい景色に出会える、感度の高い人です。',travelTraits:['天気で行き先を変える','かわいい壁や看板に止まる','夕焼けに弱い','SNS保存が直感的','軽装でよく歩く']},
FAEL:{animal:'イルカ',catchphrase:'好奇心の波に乗って、体験へ飛び込む人。',shortDescription:'現地で気になった体験や人との出会いに、迷わず飛び込める冒険タイプ。予定外の出来事すら、旅のハイライトに変えていきます。',style:'旅先で何が起きるかわからない余白にこそ、価値を感じます。',prep:'最低限の安全確認だけして、あとは現地で決める自由を残します。',stress:'細かすぎる予定や、挑戦を止められる状況では窮屈に感じます。',strengths:['体験への飛び込み力がある','人との出会いを楽しめる','旅を物語に変えられる'],cautions:['予約や時間管理が甘くなりやすい','同行者を驚かせすぎることがある'],companionView:'予想外の楽しい展開を連れてくる人として見られます。',travelTraits:['現地ツアーを急に入れる','店員さんと話し込む','道に迷っても楽しむ','少し高くても体験に払う','旅の話が増え続ける']},
FAES:{animal:'サル',catchphrase:'身軽さと直感で、街を開拓する人。',shortDescription:'決めすぎず、気になった路地や店へ軽やかに入っていきます。お金をかけすぎず、現地のリアルな面白さを見つけるのが得意です。',style:'予定の完成度より、歩いている途中で見つかる小さな発見を楽しみます。',prep:'ざっくり目的地だけ決めて、細かい行動は現地の空気で選びます。',stress:'高級店や予約だらけの旅、自由に寄り道できない行程には退屈しやすいです。',strengths:['身軽に動ける','ローカルの面白さを拾える','節約しながら楽しめる'],cautions:['行き当たりばったりで疲れることがある','集合時間にルーズになりやすい'],companionView:'一緒に歩くと面白いものを見つけてくれる人です。',travelTraits:['路地裏に吸い込まれる','安くてうまい店に燃える','予定表を見すぎない','現地交通を試したがる','寄り道が長い']},
FCVL:{animal:'黒猫',catchphrase:'気ままな贅沢を、夜風のように楽しむ人。',shortDescription:'細かな計画に縛られず、その日の気分で上質なホテル、スパ、バーなどを選びます。自由とご褒美感の両方を大切にする旅人です。',style:'自分の気分が整うかどうかを基準に、贅沢な時間を自由に選びます。',prep:'決め込みすぎず、良い選択肢をいくつか知っておく程度が心地よいです。',stress:'安さだけで選ぶ旅や、朝から晩まで固定された予定には息苦しさを感じます。',strengths:['自分を満たす選択ができる','上質な場所を嗅ぎ分ける','無理に合わせすぎない'],cautions:['気分で出費が増えやすい','予定共有が少なく同行者を不安にさせることがある'],companionView:'自由なのにセンスがよく、旅に大人の余韻を作る人です。',travelTraits:['当日スパを入れる','良いホテルバーに惹かれる','朝はゆっくりしたい','ご褒美に弱い','予定より気分を優先する']},
FCVS:{animal:'コアラ',catchphrase:'余白を集めて、心地よく漂う人。',shortDescription:'予定を決めすぎず、気に入ったカフェや宿で長く過ごすことに幸せを感じます。節約感覚もありつつ、自分のペースを何より大切にします。',style:'たくさん回るより、ひとつの場所でゆっくり呼吸できる旅を好みます。',prep:'候補は保存しますが、当日の体調や気分で行くかどうかを決めます。',stress:'急かされること、次々移動すること、騒がしい予定が続くことが苦手です。',strengths:['余白を楽しむ力がある','居心地の良い場所を見つけられる','無駄遣いしすぎない'],cautions:['動かなすぎて機会を逃すことがある','意思表示が曖昧に見える'],companionView:'一緒にいると力が抜ける、穏やかな旅にしてくれる人です。',travelTraits:['同じカフェに長居する','宿で昼寝できる','予定は少なめが安心','散歩だけで満足する','気に入ると動きたくない']},
FCEL:{animal:'シカ',catchphrase:'街の空気を、詩のように受け取る人。',shortDescription:'予定表よりも、風、音、匂い、人の気配など、目に見えない空気感を味わいます。贅沢な体験も、心が動くなら自然に選びます。',style:'旅先の情緒や余韻を、自分の感覚で深く受け取ることを大切にします。',prep:'細かく決めすぎず、心が動きそうな街や時間帯を選びます。',stress:'効率だけを求められたり、感じる前に次へ急がされると疲れます。',strengths:['空気感を味わう感性がある','旅の余韻を言葉にできる','人や土地に自然に馴染める'],cautions:['目的が曖昧に見えることがある','時間管理が後回しになりがち'],companionView:'旅を静かに深めてくれる、感性豊かな人として映ります。',travelTraits:['知らない街を歩くだけで満たされる','音や匂いを覚えている','予定より雰囲気を優先する','小さな会話が記憶に残る','帰宅後に旅の余韻が続く']},
FCES:{animal:'ツバメ',catchphrase:'風の向くまま、自然体で旅をする人。',shortDescription:'細かい計画や高価な演出がなくても、行った先で自然に楽しみを見つけられます。気軽さ、身軽さ、自由さを大切にする究極の自然体タイプです。',style:'旅を大げさに構えず、日常の延長のように軽やかに楽しみます。',prep:'必要最低限だけ確認し、あとは現地でどうにかなる感覚を持っています。',stress:'高額な予約や細かい段取り、過剰な期待を背負う旅には疲れやすいです。',strengths:['どこでも自然に楽しめる','節約しながら身軽に動ける','予定変更に強い'],cautions:['準備不足で困ることがある','こだわりがないように見られやすい'],companionView:'気取らず一緒にいられる、旅の空気を軽くしてくれる人です。',travelTraits:['ベンチでぼーっとできる','安い移動手段に抵抗がない','予定がなくても不安が少ない','地元の普通の店で満足する','荷物が少ない']}
};

function getTravelTypeProfile(code, persona = {}) {
const detail = travelTypeProfiles[code] || {};
const longDescription = detail.longDescription || [
`あなたは、${detail.style || persona.desc || '自分らしい旅の手触りを大切にする旅人'}。`,
`${detail.prep || '旅行前は必要な情報を集めながら、自分が心地よく動ける流れを探します。'}旅先では、ただ有名な場所を消化するよりも、自分の価値観に合う瞬間を選び取ることを重視します。`,
`満足を感じるのは、${(detail.travelTraits || ['自分のペースで旅を楽しめたとき'])[0]}ような、自分らしさが旅の中に自然に出た瞬間です。同行者に対しても、無意識のうちに自分なりの快適さや楽しさを共有しようとします。`,
`一方で、${detail.stress || '自分のペースや期待が大きく崩れる場面'}では少しストレスを感じやすいかもしれません。良い旅にしたい気持ちが強いほど、遠慮やこだわりが表情に出ることもあります。`,
`${detail.companionView || '同行者からは、旅にその人らしい色を添えてくれる存在として見られやすいでしょう。'}自分でも気づかない強みは、旅先の選択に一貫した美意識や安心感があること。少しだけ余白を残すと、旅はさらに豊かになります。`
].join('\n\n');
return {
  ...persona,
  ...detail,
  longDescription,
  shortDescription: detail.shortDescription || persona.tagline || persona.desc || '',
  catchphrase: detail.catchphrase || persona.tagline || '',
  strengths: detail.strengths || [],
  cautions: detail.cautions || [],
  travelTraits: detail.travelTraits || [],
  companionView: detail.companionView || ''
};
}
/* ────────────────────────────────────────────────────────────────
2. linkGenerator
──────────────────────────────────────────────────────────────── */
const linkGenerator = {
maps(place, area) {
const q = (area && !place.includes(area)) ? `${place} ${area}` : place;
return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
},
google(keyword) {
return `https://www.google.com/search?q=${encodeURIComponent(String(keyword || '').trim())}`;
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
trackEvent('bookmark_saved', {
  bookmark_id: id,
  destination: item.destination,
  title: item.title
});
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
  app: 'TABI OS',
  trips: items
};
fileDownloader.downloadText('tabios-trip-archive.json', JSON.stringify(payload, null, 2));
},

clear() {
localStorage.removeItem(this.key);
this.render();
},

deleteTrip(id) {
const items = this.list().filter(entry => entry.id !== id);
this.saveList(items);
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
  <button type="button" class="archive-delete" data-archive-delete="${this._esc(item.id)}" aria-label="${title}を削除">×</button>
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
if (document.fonts?.ready) await document.fonts.ready;
const canvas = document.createElement('canvas');
canvas.width = 1080;
canvas.height = 1350;
const ctx = canvas.getContext('2d');
this._drawBackground(ctx, canvas);
await this._drawTypeImage(ctx, result.code);
this._drawCopy(ctx, result);
fileDownloader.downloadCanvas(canvas, `tabios-${result.code.toLowerCase()}-diagnosis.png`);
trackEvent("share_image_downloaded", {
  type: "diagnosis",
  travel_type: result.code
});
},

async share() {
const result = AppState.diagnosisResult;
if (!result) {
  alert('先に旅タイプ診断を完了してください。');
  return;
}
const text = `私は${result.code}｜${result.name}でした。\n${result.catchphrase || result.tagline || ''}\nあなたらしく、旅をする。\n#TABI OS`;
if (navigator.share) {
  try {
    await navigator.share({ title: 'TABI OS 旅タイプ診断', text });
    return;
  } catch(e) {}
}
await navigator.clipboard?.writeText(text);
alert('シェア用テキストをコピーしました。');
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
  const x = 340;
  const y = 155;
  const size = 400;
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
  this._roundRect(ctx, 340, 155, 400, 400, 44);
  ctx.fill();
  ctx.fillStyle = '#9d87a8';
  ctx.font = '700 120px serif';
  ctx.textAlign = 'center';
  ctx.fillText('旅', 540, 395);
}
},

_drawCopy(ctx, result) {
ctx.textAlign = 'center';
ctx.textBaseline = 'alphabetic';
ctx.fillStyle = '#6f5d7d';
ctx.font = '800 92px Montserrat, sans-serif';
ctx.fillText(result.code || 'TYPE', 540, 610);

ctx.fillStyle = '#3c3432';
ctx.font = '700 58px "Noto Serif JP", serif';
ctx.fillText(result.name || '旅タイプ', 540, 690);

ctx.fillStyle = '#6f5d7d';
ctx.font = '700 29px "Noto Sans JP", sans-serif';
const taglineBottom = this._drawFittedText(ctx, result.catchphrase || result.tagline || '', {
  x: 540,
  y: 755,
  maxWidth: 760,
  maxHeight: 78,
  fontFamily: '"Noto Sans JP", sans-serif',
  weight: '700',
  startSize: 29,
  minSize: 21,
  lineHeight: 1.45
});

ctx.fillStyle = '#7f7470';
const descBottom = this._drawFittedText(ctx, result.shortDescription || result.tagline || '', {
  x: 540,
  y: Math.max(840, taglineBottom + 44),
  maxWidth: 760,
  maxHeight: 150,
  fontFamily: '"Noto Sans JP", sans-serif',
  weight: '400',
  startSize: 26,
  minSize: 20,
  lineHeight: 1.55
});

this._drawAxisBlock(ctx, result.axisScores || {}, 950);

ctx.fillStyle = '#9d87a8';
ctx.font = '700 25px Cinzel, serif';
ctx.fillText('TABI OS', 540, 1292);
ctx.fillStyle = '#8b7c78';
ctx.font = '400 22px "Noto Sans JP", sans-serif';
ctx.fillText('あなたらしく、旅をする。', 540, 1324);
},

_drawAxisBlock(ctx, axisScores, y) {
ctx.textAlign = 'left';
ctx.fillStyle = '#6f5d7d';
ctx.font = '800 22px Montserrat, sans-serif';
ctx.fillText('TRAVEL BALANCE', 170, y);
const axes = Object.values(axisScores);
axes.forEach((axis, index) => {
  const rowY = y + 46 + index * 54;
  ctx.fillStyle = '#4d4240';
  ctx.font = '700 22px "Noto Sans JP", sans-serif';
  ctx.fillText(`${axis.leftCode} ${axis.leftLabel} ${axis.leftPercent}%`, 170, rowY);
  ctx.textAlign = 'right';
  ctx.fillText(`${axis.rightPercent}% ${axis.rightLabel} ${axis.rightCode}`, 910, rowY);
  ctx.textAlign = 'left';
  this._roundRect(ctx, 170, rowY + 12, 740, 14, 7);
  ctx.fillStyle = '#ece4ec';
  ctx.fill();
  this._roundRect(ctx, 170, rowY + 12, 740 * axis.leftPercent / 100, 14, 7);
  ctx.fillStyle = '#9d87a8';
  ctx.fill();
});
ctx.fillStyle = '#8b7c78';
ctx.font = '400 20px "Noto Sans JP", sans-serif';
ctx.textAlign = 'center';
ctx.fillText('P / F  計画性　　A / C  行動量', 540, y + 276);
ctx.fillText('V / E  旅の目的　　L / S  お金の使い方', 540, y + 310);
},

_wrapTextLines(ctx, text, maxWidth) {
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
return lines;
},

_drawFittedText(ctx, text, opts) {
let size = opts.startSize;
let lines = [];
let lineHeight = 0;
while (size >= opts.minSize) {
  ctx.font = `${opts.weight} ${size}px ${opts.fontFamily}`;
  lines = this._wrapTextLines(ctx, text, opts.maxWidth);
  lineHeight = Math.round(size * opts.lineHeight);
  if (lines.length * lineHeight <= opts.maxHeight) break;
  size -= 1;
}
ctx.font = `${opts.weight} ${size}px ${opts.fontFamily}`;
lineHeight = Math.round(size * opts.lineHeight);
lines.forEach((lineText, index) => {
  ctx.fillText(lineText, opts.x, opts.y + lineHeight * index);
});
return opts.y + Math.max(0, lines.length - 1) * lineHeight;
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

axisMeta: {
PF: { axis:'P', leftCode:'P', rightCode:'F', leftLabel:'計画派', rightLabel:'自由派', title:'計画性' },
AC: { axis:'A', leftCode:'A', rightCode:'C', leftLabel:'活動派', rightLabel:'のんびり派', title:'行動量' },
VE: { axis:'V', leftCode:'V', rightCode:'E', leftLabel:'景色派', rightLabel:'体験派', title:'旅の目的' },
LS: { axis:'L', leftCode:'L', rightCode:'S', leftLabel:'贅沢派', rightLabel:'節約派', title:'お金の使い方' }
},

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
  if (!AppState.analytics.diagnosisStarted) {
    AppState.analytics.diagnosisStarted = true;
    trackEvent('diagnosis_start');
  }
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
const axisScores = this.calculateAxisScores(scores);
return (axisScores.PF.leftPercent >= 50 ? 'P' : 'F') +
(axisScores.AC.leftPercent >= 50 ? 'A' : 'C') +
(axisScores.VE.leftPercent >= 50 ? 'V' : 'E') +
(axisScores.LS.leftPercent >= 50 ? 'L' : 'S');
},

calculateAxisScores(scores) {
const toPercent = value => Math.max(0, Math.min(100, Math.round(((value - 8) / 32) * 100)));
const build = key => {
  const meta = this.axisMeta[key];
  const leftPercent = toPercent(scores[meta.axis]);
  return { ...meta, leftPercent, rightPercent: 100 - leftPercent };
};
return { PF: build('PF'), AC: build('AC'), VE: build('VE'), LS: build('LS') };
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
const persona = getTravelTypeProfile(code, themeManager.personalities[code]);
const axisScores = this.calculateAxisScores(scores);

AppState.diagnosisResult = { code, ...persona };
AppState.diagnosisResult.axisScores = axisScores;
sessionStorage.setItem('tabios_personality', JSON.stringify(AppState.diagnosisResult));
localStorage.setItem('tabios_personality', JSON.stringify(AppState.diagnosisResult));
trackEvent('diagnosis_complete', {
  personality_code: code,
  personality_name: persona?.name || '',
  score_p: scores.P,
  score_a: scores.A,
  score_v: scores.V,
  score_l: scores.L
});

// Auto-fill prompt tab personality selector
const sel = document.getElementById('my-personality');
if (sel && persona) sel.value = persona.name;

this._showResult(code, persona, axisScores);

},

_showResult(code, persona, axisScores) {
const view = document.getElementById('result-view');
const img = document.getElementById('result-img');
const fallback = document.getElementById('result-img-fallback');

img.style.display = 'none';
fallback.style.display = 'flex';
img.src = `images/${code.toLowerCase()}.png`;

document.getElementById('result-code').textContent = code;
document.getElementById('result-name').textContent = persona?.name ?? code;
document.getElementById('result-tagline').textContent = persona ? persona.catchphrase || persona.tagline || '' : '';
document.getElementById('result-desc').innerHTML = this._paragraphs(persona.longDescription || persona.desc || '');
this._renderAxisBalance(axisScores);
this._renderAxisComments(axisScores);
this._renderReportSections(persona);

view.style.display = 'block';

view.scrollIntoView({ behavior: 'smooth', block: 'start' });

},

_renderAxisBalance(axisScores) {
const list = document.getElementById('axis-balance-list');
if (!list) return;
list.innerHTML = Object.values(axisScores).map(axis => `
  <div class="axis-balance-row">
    <div class="axis-balance-head">
      <span>${axis.leftCode} ${axis.leftLabel} ${axis.leftPercent}%</span>
      <span>${axis.rightPercent}% ${axis.rightLabel} ${axis.rightCode}</span>
    </div>
    <div class="axis-track" aria-label="${axis.title}">
      <div class="axis-bar axis-bar-left" style="width:${axis.leftPercent}%"></div>
      <div class="axis-bar axis-bar-right" style="width:${axis.rightPercent}%"></div>
    </div>
  </div>
`).join('');
},

_renderAxisComments(axisScores) {
const list = document.getElementById('axis-comment-list');
if (!list) return;
list.innerHTML = Object.values(axisScores).map(axis => {
  const primaryLeft = axis.leftPercent >= axis.rightPercent;
  const code = primaryLeft ? axis.leftCode : axis.rightCode;
  const label = primaryLeft ? axis.leftLabel : axis.rightLabel;
  const percent = primaryLeft ? axis.leftPercent : axis.rightPercent;
  return `
    <article class="axis-comment-card">
      <h4>${axis.title}｜${code} ${percent}%</h4>
      <p>${this._esc(this._axisComment(axis, code, label, percent))}</p>
    </article>
  `;
}).join('');
},

_axisComment(axis, code, label, percent) {
const strength = percent <= 55 ? 'ほぼ中間で、わずかに' : percent <= 65 ? 'やや' : percent <= 79 ? '傾向が強めの' : '非常に強い';
const map = {
  P:'行きたい場所や移動ルートを整理しておくほど、当日は安心して旅を楽しめます。',
  F:'予定に余白を残すほど、偶然の出会いや気分の変化を旅の楽しみにできます。',
  A:'一日の中で複数の場所を巡るほど、旅をしている実感が高まりやすいです。',
  C:'休憩や宿時間をしっかり確保するほど、旅全体の満足度が上がります。',
  V:'景色、写真、空間の美しさが、旅の記憶を強くしてくれます。',
  E:'その土地の空気、人、文化に触れる体験が、深い満足につながります。',
  L:'上質な宿や食事、特別な体験に投資することで旅の納得感が高まります。',
  S:'工夫して賢く楽しむことに喜びがあり、身軽で現実的な旅が得意です。'
};
return `${strength}${label}です。${map[code] || ''}`;
},

_renderReportSections(persona) {
const wrap = document.getElementById('result-report-sections');
if (!wrap) return;
const section = (title, body) => `<article class="result-report-card"><h3>${title}</h3>${body}</article>`;
const list = items => `<ul>${(items || []).map(item => `<li>${this._esc(item)}</li>`).join('')}</ul>`;
wrap.innerHTML = [
  section('旅で発揮される長所', list(persona.strengths)),
  section('旅で起こりやすい弱点・注意点', list(persona.cautions)),
  section('同行者からどう見られやすいか', `<p>${this._esc(persona.companionView || '')}</p>`),
  section('旅の特徴・あるある', list(persona.travelTraits))
].join('');
},

_paragraphs(text) {
return String(text || '').split(/\n{2,}/).filter(Boolean).map(p => `<p>${this._esc(p)}</p>`).join('');
},

_esc(value) {
return String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');
},

reset(form) {
form.reset();
AppState.analytics.diagnosisStarted = false;
document.querySelectorAll('.q-card').forEach(c => c.classList.remove('error'));
document.getElementById('quiz-error').style.display = 'none';
document.getElementById('result-view').style.display = 'none';
document.getElementById('result-img').src = '';
AppState.diagnosisResult = null;
sessionStorage.removeItem('tabios_personality');
localStorage.removeItem('tabios_personality');
window.scrollTo({ top: 0, behavior: 'smooth' });
}
};

const profileViewer = {
open() {
const modal = document.getElementById('profile-modal');
const content = document.getElementById('profile-content');
if (!modal || !content) return;
const result = this._getPersonality();
content.innerHTML = result ? this._resultHtml(result) : `
  <p class="profile-empty">
    まだ旅タイプ診断の結果がありません。<br>
    診断を完了すると、ここからいつでも自分の旅タイプを確認できます。
  </p>
  <div class="form-actions">
    <button type="button" class="btn-primary" data-profile-diagnosis>診断をはじめる</button>
  </div>
`;
modal.classList.add('is-open');
modal.setAttribute('aria-hidden', 'false');
},

close() {
const modal = document.getElementById('profile-modal');
if (!modal) return;
modal.classList.remove('is-open');
modal.setAttribute('aria-hidden', 'true');
},

_getPersonality() {
if (AppState.diagnosisResult) return AppState.diagnosisResult;
try {
  const stored = sessionStorage.getItem('tabios_personality') ||
    localStorage.getItem('tabios_personality');
  const parsed = stored ? JSON.parse(stored) : null;
  if (parsed?.code) {
    const master = themeManager.personalities[parsed.code] || {};
    AppState.diagnosisResult = { code: parsed.code, ...master, ...parsed };
    return AppState.diagnosisResult;
  }
} catch(e) {
  return null;
}
return null;
},

_resultHtml(result) {
const code = result.code || '';
const image = code ? `images/${code.toLowerCase()}.png` : '';
return `
  <div class="profile-card">
    <img class="profile-img" src="${this._esc(image)}" alt="" onerror="this.style.display='none';">
    <div>
      <span class="profile-code">TYPE: ${this._esc(code || '----')}</span>
      <h3 class="profile-name">${this._esc(result.name || '旅タイプ')}</h3>
      <p class="profile-tagline">${this._esc(result.tagline || '')}</p>
    </div>
  </div>
  <p class="profile-desc">${this._esc(result.desc || 'あなたらしい旅の空気を大切にするタイプです。')}</p>
  <div class="form-actions">
    <button type="button" class="btn-primary" data-profile-save>診断結果を画像保存</button>
  </div>
`;
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
const mustVisit    = document.getElementById('must-visit')?.value.trim() || '';
const fixedPlans   = document.getElementById('fixed-plans')?.value.trim() || '';
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
sessionStorage.setItem('tabios_trip_meta', JSON.stringify({
  destination,
  start_date: arrDt.slice(0, 10),
  arrival_datetime: arrDt,
  departure_datetime: depDt,
  duration,
  members: Number(members) || 1,
  transport
}));

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
${mustVisit ? `- **行きたい場所・気になっている場所**: ${mustVisit}` : '- **行きたい場所・気になっている場所**: 指定なし。旅タイプと条件に合わせてAIが提案してください。'}
${fixedPlans ? `- **すでに決まっている予定**: ${fixedPlans}` : '- **すでに決まっている予定**: 特になし。'}

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
- 行きたい場所が指定されている場合は、可能な限り自然な動線に組み込むこと。難しい場合は理由を踏まえて代替案を提案すること。
- 決まっている予定がある場合は、その時間・場所を固定予定として必ず守り、前後の移動と休憩を調整すること。

### 営業状況の確認ルール（厳守）

- 提案する飲食店・カフェ・美術館・温泉・宿泊施設・観光施設は、必ず「現在営業中」または「指定旅行日時に営業予定」と確認できるものだけを採用してください。
- 営業時間・定休日だけでなく、閉業、掲載保留、長期休業、移転、季節営業、臨時休業、予約制限の有無も確認してください。
- Googleマップ、食べログ、公式サイト、公式Instagram、観光協会サイトのうち、可能な限り2つ以上の情報源で営業状況を照合してください。
- 1つでも「閉店」「閉業」「掲載保留」「休業期間未定」「営業終了」「移転未確認」と表示されている場合は、原則として旅程に入れないでください。
- 情報源ごとに内容が矛盾する場合は、公式サイト・公式SNS・Googleマップ・食べログの順に新しい情報を優先し、確証が取れないスポットは採用せず、代替案を提示してください。
- 季節営業の施設は、旅行日が営業期間内であることを確認してください。
- 旅行日が土日祝・繁忙期に該当する場合は、混雑・予約可否・入場制限も考慮してください。
- 営業確認に不確実性が残る場合は、scheduleには入れず、backup_optionsまたはnotesに「要直前確認」として記載してください。

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

### ✅ 旅行前ToDo生成指示

旅行プランと同時に、旅行に行くまでに必要なToDoリストも作成してください。

ToDoは細かすぎず、旅行前に必要な手配・予約を中心にしてください。

例：
- 往復の飛行機を予約する
- 1日目のホテルを予約する
- 2日目の夕食を予約する
- レンタカーを予約する
- 美術館のチケットを予約する
- 空港までの移動手段を確認する

出力JSONには todos 配列を含めてください。
free_memo は空文字 "" で含めてください。

### 🧭 候補比較・選択用 decision_items 生成指示

飲食店・ホテル・予約が必要な体験については、1つに決め打ちせず、候補を3つ出してください。

ただし、最もおすすめの候補を1つ recommended として示してください。

候補ごとに以下を出してください。
- 名称
- エリア
- 予算目安
- 雰囲気
- 予約の必要性
- この旅に合う理由

出力JSONには decision_items 配列を含めてください。

しおりに直接表示する schedule には、未確定項目として「候補から選択：1日目の夕食」のように入れてください。

候補比較画面でユーザーが選択した後、target_schedule_id をもとに確定版しおりへ反映できる構造にしてください。

ホテル候補を decision_items に出す場合は、必ず対応する schedule に target_schedule_id を設定してください。

ホテルにチェックインする予定、ホテル内大浴場・サウナ、ホテルで就寝、客室で休憩など、ホテル名が関係する schedule には、後から選択したホテル名を反映できるように、schedule.id と decision_items.target_schedule_id を一致させてください。

ユーザーがホテル候補を選択した後、しおり上でホテル名が必ず表示される構造にしてください。

### ⚠️ 出力フォーマット（必須）

{
"trip_title": "旅タイトル（おしゃれに）",
"trip_concept": "旅のコンセプト（100文字程度）",
"trip_meta": {
"destination": "${destination}",
"start_date": "${arrDt.slice(0, 10)}",
"arrival_datetime": "${arrDt}",
"departure_datetime": "${depDt}",
"duration": "${duration}",
"members": ${Number(members) || 1},
"transport": "${transport}"
},
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
"id": "day1-1830-dinner",
"time": "HH:MM",
"place": "スポット名",
"category": "cafe / lunch / sightseeing / hotel / dinner / activity / move のいずれか",
"reason": "【${myPersona}】の感性に寄り添った提案理由（おしゃれな文体で）",
"stay_minutes": 60,
"move_to_next": "次への移動方法と時間目安",
"business_status": "指定旅行日時に営業予定 / 現在営業中 など、確認できた営業状況",
"business_sources": ["確認に使った情報源名1", "確認に使った情報源名2"],
"reservation_note": "予約可否・混雑・入場制限などの補足。なければ空文字",
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
"decision_items": [
{
"id": "day1-dinner",
"type": "restaurant",
"day": 1,
"label": "1日目の夕食",
"status": "pending",
"recommended_option_id": "day1-dinner-1",
"target_schedule_id": "day1-1830-dinner",
"options": [
{
"id": "day1-dinner-1",
"name": "A店",
"area": "表参道",
"price_range": "5,000〜7,000円",
"vibe": "雰囲気重視",
"reservation_need": "予約推奨",
"reason": "今回の旅タイプに最も合うため"
},
{
"id": "day1-dinner-2",
"name": "B店",
"area": "渋谷",
"price_range": "3,000〜5,000円",
"vibe": "カジュアル",
"reservation_need": "予約できれば安心",
"reason": "移動効率がよく、コスパも良いため"
},
{
"id": "day1-dinner-3",
"name": "C店",
"area": "青山",
"price_range": "7,000〜10,000円",
"vibe": "記念日向き",
"reservation_need": "要予約",
"reason": "特別感を出したい場合に合うため"
}
]
},
{
"id": "day1-hotel",
"type": "hotel",
"day": 1,
"label": "1日目のホテル",
"status": "pending",
"recommended_option_id": "day1-hotel-1",
"target_schedule_id": "day1-hotel-checkin",
"options": [
{
"id": "day1-hotel-1",
"name": "〇〇ホテル",
"area": "那覇",
"price_range": "15,000〜22,000円",
"vibe": "大浴場・サウナあり",
"reservation_need": "要予約",
"reason": "移動せずに夜を整えられるため"
}
]
}
],
"todos": [
{
"id": "todo-1",
"text": "往復の飛行機を予約する",
"checked": false
},
{
"id": "todo-2",
"text": "1日目のホテルを予約する",
"checked": false
}
],
"free_memo": "",
"backup_options": [
{
"place": "営業確認に不確実性がある候補または雨天代替候補",
"reason": "代替案として残す理由",
"note": "要直前確認 / 営業状況不確実 / 雨天代替 など"
}
],
"notes": ["営業確認・予約・混雑・季節営業に関する補足"],
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
trackEvent('prompt_generated', {
  destination,
  duration,
  personality: myPersona,
  personality_code: personaCode,
  members: Number(members) || 1
});
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

function showBookmarkLoading() {
const overlay = document.querySelector('.bookmark-loading-overlay');
if (!overlay) return;
overlay.classList.add('is-active');
overlay.setAttribute('aria-hidden', 'false');
}

function hideBookmarkLoading() {
const overlay = document.querySelector('.bookmark-loading-overlay');
if (!overlay) return;
overlay.classList.remove('is-active');
overlay.setAttribute('aria-hidden', 'true');
}

/* ────────────────────────────────────────────────────────────────
5. shioriInputHandler
──────────────────────────────────────────────────────────────── */
const shioriInputHandler = {
currentData: null,
currentArea: '',
decisionSelections: {},

async open() {
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
trackEvent('json_loaded', {
  has_decision_items: Array.isArray(data.decision_items) && data.decision_items.length > 0,
  decision_item_count: Array.isArray(data.decision_items) ? data.decision_items.length : 0,
  day_count: Array.isArray(data.days) ? data.days.length : 0,
  title: data.trip_title || ''
});

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

const storedTripMeta = (() => {
  try { return JSON.parse(sessionStorage.getItem('tabios_trip_meta') || 'null'); }
  catch(e) { return null; }
})();
if (storedTripMeta) {
  data.trip_meta = { ...storedTripMeta, ...(data.trip_meta || {}) };
}
if (area && data.trip_meta && !data.trip_meta.destination) {
  data.trip_meta.destination = area;
}

const decisionItems = this.getDecisionItems(data);
if (decisionItems.length) {
  this.currentData = data;
  this.currentArea = area;
  this.decisionSelections = this.loadDecisionSelections(this._bookmarkId(data));
  this.renderDecisionReview(data);
  return;
}

await this.generateShiori(data, area);

},

getDecisionItems(tripData) {
return Array.isArray(tripData?.decision_items) ? tripData.decision_items : [];
},

renderDecisionReview(tripData, options = {}) {
const wrap = document.getElementById('decision-review');
const list = document.getElementById('decision-list');
const err = document.getElementById('decision-error');
if (!wrap || !list) return;
if (err) err.style.display = 'none';
const items = this.getDecisionItems(tripData);
list.innerHTML = items.map(item => this._decisionItemHtml(item)).join('');
wrap.style.display = 'block';
if (options.scroll !== false) {
  wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
},

preserveScroll(callback) {
const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
callback();
requestAnimationFrame(() => {
  window.scrollTo({ top: scrollY, behavior: 'auto' });
});
},

selectDecisionOption(decisionItemId, optionId) {
this.preserveScroll(() => {
const item = this.getDecisionItems(this.currentData).find(entry => entry.id === decisionItemId);
const option = item?.options?.find(entry => entry.id === optionId);
if (!item || !option) return;
this.decisionSelections[decisionItemId] = {
  decisionItemId,
  selectedOptionId: optionId,
  selectedName: option.name || '',
  mode: 'option'
};
trackEvent('decision_option_selected', {
  decision_item_id: decisionItemId,
  option_id: optionId,
  option_name: option.name || '',
  decision_type: item.type || '',
  mode: 'option'
});
this.saveDecisionSelections(this._bookmarkId(this.currentData));
this.renderDecisionReview(this.currentData, { scroll: false });
});
},

setCustomDecisionValue(decisionItemId, value) {
this.preserveScroll(() => {
const selectedName = String(value || '').trim();
if (!selectedName) return;
this.decisionSelections[decisionItemId] = {
  decisionItemId,
  selectedOptionId: null,
  selectedName,
  mode: 'custom'
};
trackEvent('decision_option_selected', {
  decision_item_id: decisionItemId,
  option_id: '',
  option_name: selectedName,
  mode: 'custom'
});
this.saveDecisionSelections(this._bookmarkId(this.currentData));
this.renderDecisionReview(this.currentData, { scroll: false });
});
},

setDecisionUndecided(decisionItemId) {
this.preserveScroll(() => {
const item = this.getDecisionItems(this.currentData).find(entry => entry.id === decisionItemId);
this.decisionSelections[decisionItemId] = {
  decisionItemId,
  selectedOptionId: null,
  selectedName: `未定：${item?.label || '現地で相談'}`,
  mode: 'undecided'
};
trackEvent('decision_option_selected', {
  decision_item_id: decisionItemId,
  option_id: '',
  option_name: this.decisionSelections[decisionItemId].selectedName,
  decision_type: item?.type || '',
  mode: 'undecided'
});
this.saveDecisionSelections(this._bookmarkId(this.currentData));
this.renderDecisionReview(this.currentData, { scroll: false });
});
},

validateDecisionSelections() {
return this.getDecisionItems(this.currentData)
  .every(item => Boolean(this.decisionSelections[item.id]?.selectedName));
},

applyDecisionSelectionsToTripData(tripData) {
const cloned = JSON.parse(JSON.stringify(tripData));
const selectedDecisions = [];
this.getDecisionItems(cloned).forEach(item => {
  const selection = this.decisionSelections[item.id];
  if (!selection) return;
  const option = item.options?.find(entry => entry.id === selection.selectedOptionId);
  const selectedName = selection.selectedName || option?.name || '';
  const selectedDecision = {
    decisionItemId: item.id,
    selectedOptionId: selection.selectedOptionId || null,
    selectedName,
    selected_option_name: selectedName,
    selected_decision_label: item.label || '',
    mode: selection.mode,
    type: item.type || '',
    label: item.label || '',
    day: item.day || null,
    reason: option?.reason || '',
    price_range: option?.price_range || '',
    reservation_need: option?.reservation_need || ''
  };
  selectedDecisions.push(selectedDecision);
  const target = this._findTargetSchedule(cloned, item);
  if (target) {
    const originalPlace = String(target.place || '');
    if (
      this._isHotelDecision(item) &&
      originalPlace &&
      !originalPlace.includes(selectedName) &&
      !/候補から選択/.test(originalPlace) &&
      this._isHotelRelatedSchedule(target)
    ) {
      const placeDetail = originalPlace.replace(/^ホテル内/, '').trim();
      target.place = placeDetail ? `${selectedName} ${placeDetail}` : selectedName;
    } else {
      target.place = selectedName;
    }
    target.selected_decision_label = item.label || '';
    target.selected_option_name = selectedName;
    if (option?.reason) target.reason = option.reason;
    if (option?.price_range && !target.cost_label) target.cost_label = option.price_range;
    if (option?.reservation_need) target.reservation_note = option.reservation_need;
  }
  if (this._isHotelDecision(item)) {
    this._applyHotelNameToRelatedSchedules(cloned, item, selectedName);
    if (cloned.hotel) {
      cloned.hotel.selected_name = selectedName;
      if (!cloned.hotel.area || /候補から選択|ホテル|宿/.test(cloned.hotel.area)) {
        cloned.hotel.area = selectedName;
      }
    } else {
      cloned.hotel = { area: selectedName };
    }
  }
});
cloned.selected_decisions = selectedDecisions;
return cloned;
},

saveDecisionSelections(bookmarkId) {
localStorage.setItem(this._decisionStorageKey(bookmarkId), JSON.stringify(this.decisionSelections));
},

loadDecisionSelections(bookmarkId) {
try {
  return JSON.parse(localStorage.getItem(this._decisionStorageKey(bookmarkId)) || '{}');
} catch(e) {
  return {};
}
},

async finalizeDecisionReview() {
const err = document.getElementById('decision-error');
if (!this.validateDecisionSelections()) {
  if (err) {
    err.textContent = '未選択の候補があります。候補を選ぶか、未定にしてください。';
    err.style.display = 'block';
  }
  return;
}
if (err) err.style.display = 'none';
const finalized = this.applyDecisionSelectionsToTripData(this.currentData);
await this.generateShiori(finalized, this.currentArea);
},

resetDecisionReview() {
const wrap = document.getElementById('decision-review');
if (wrap) wrap.style.display = 'none';
this.currentData = null;
this.currentArea = '';
this.decisionSelections = {};
},

async generateShiori(data, area) {
sessionStorage.setItem('tabios_shiori_data', JSON.stringify(data));
sessionStorage.setItem('tabios_destination', area);
const savedItem = archiveManager.saveTrip(data, area);
archiveManager.render();
trackEvent('bookmark_generated', {
  bookmark_id: savedItem?.id || '',
  destination: area || data.destination || data.area || data.trip_meta?.destination || '',
  title: data.trip_title || '',
  day_count: Array.isArray(data.days) ? data.days.length : 0
});

showBookmarkLoading();
await new Promise(resolve => setTimeout(resolve, 5000));

try {
  const newTab = window.open('shiori.html', '_blank');
  if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
    window.location.href = 'shiori.html';
    return;
  }
  hideBookmarkLoading();
} catch(e) {
  window.location.href = 'shiori.html';
}
},

_decisionItemHtml(item) {
const selection = this.decisionSelections[item.id] || {};
const recommended = item.recommended_option_id;
const selectedLabel = selection.selectedName ? `選択中：${selection.selectedName}` : '未選択';
const options = (item.options || []).map((option, index) => {
  const selected = selection.selectedOptionId === option.id;
  const googleUrl = this.buildDecisionOptionGoogleUrl(option, item, this.currentData);
  return `
    <article class="decision-option ${selected ? 'is-selected' : ''}">
      <span class="decision-option-name">
        <span>候補${index + 1}：${this._esc(option.name || '候補')}</span>
        ${option.id === recommended ? '<span class="decision-recommend">おすすめ</span>' : ''}
      </span>
      <span class="decision-meta">
        ${option.area ? `<span>エリア：${this._esc(option.area)}</span>` : ''}
        ${option.price_range ? `<span>予算：${this._esc(option.price_range)}</span>` : ''}
        ${option.vibe ? `<span>雰囲気：${this._esc(option.vibe)}</span>` : ''}
        ${option.reservation_need ? `<span>予約：${this._esc(option.reservation_need)}</span>` : ''}
      </span>
      ${option.reason ? `<span class="decision-reason">理由：${this._esc(option.reason)}</span>` : ''}
      <span class="decision-option-actions">
        ${googleUrl ? `<a class="decision-search-button" href="${this._esc(googleUrl)}" target="_blank" rel="noopener noreferrer">Googleで調べる</a>` : ''}
        <button type="button" class="decision-select-button" data-decision-option="${this._esc(item.id)}" data-option-id="${this._esc(option.id)}">この候補にする</button>
      </span>
    </article>
  `;
}).join('');
const customSearchUrl = selection.mode === 'custom'
  ? linkGenerator.google(this.buildDecisionOptionSearchKeyword({ name: selection.selectedName }, item, this.currentData))
  : '';
return `
  <article class="decision-item-card">
    <div class="decision-item-top">
      <div>
        <h4 class="decision-label">${this._esc(item.label || item.id || '選択項目')}</h4>
        ${recommended ? `<p class="archive-note">おすすめ：${this._esc(this._recommendedName(item))}</p>` : ''}
      </div>
      <span class="decision-status-pill">${this._esc(selectedLabel)}</span>
    </div>
    <div class="decision-options">${options}</div>
    <div class="decision-custom">
      <div class="decision-custom-row">
        <input class="decision-custom-input" type="text" placeholder="自分で入力する" value="${selection.mode === 'custom' ? this._esc(selection.selectedName) : ''}" data-decision-custom-input="${this._esc(item.id)}">
        <button class="decision-small-btn" type="button" data-decision-custom="${this._esc(item.id)}">反映</button>
        <button class="decision-small-btn decision-undecided" type="button" data-decision-undecided="${this._esc(item.id)}">未定にする</button>
      </div>
      ${customSearchUrl ? `<a class="decision-search-button decision-custom-search" href="${this._esc(customSearchUrl)}" target="_blank" rel="noopener noreferrer">自分の入力をGoogleで調べる</a>` : ''}
    </div>
  </article>`;
},

buildDecisionOptionSearchKeyword(option, decisionItem, tripData) {
const parts = [];
if (option?.name) parts.push(option.name);
if (option?.area) parts.push(option.area);
const destination = tripData?.destination || tripData?.area || tripData?.location ||
  tripData?.trip_meta?.destination || tripData?.hotel?.area || this.currentArea || '';
if (destination && !parts.includes(destination)) parts.push(destination);
const type = String(decisionItem?.type || '').toLowerCase();
if (type === 'hotel') parts.push('ホテル');
if (['restaurant', 'dinner', 'lunch'].includes(type)) parts.push('飲食店');
if (type === 'cafe') parts.push('カフェ');
if (['experience', 'activity'].includes(type)) parts.push('体験');
return parts.filter(Boolean).join(' ');
},

buildDecisionOptionGoogleUrl(option, decisionItem, tripData) {
const keyword = this.buildDecisionOptionSearchKeyword(option, decisionItem, tripData);
return keyword ? linkGenerator.google(keyword) : '';
},

_findTargetSchedule(tripData, item) {
const days = tripData.days || [];
for (const day of days) {
  for (const schedule of (day.schedule || [])) {
    if (item.target_schedule_id && schedule.id === item.target_schedule_id) return schedule;
  }
}
const type = String(item.type || '').toLowerCase();
const categoryMap = {
  restaurant: ['dinner', 'lunch', 'cafe'],
  dinner: ['dinner'],
  lunch: ['lunch'],
  cafe: ['cafe'],
  hotel: ['hotel', 'stay', 'accommodation', 'lodging'],
  stay: ['hotel', 'stay', 'accommodation', 'lodging'],
  accommodation: ['hotel', 'stay', 'accommodation', 'lodging'],
  lodging: ['hotel', 'stay', 'accommodation', 'lodging'],
  experience: ['activity']
};
const categories = categoryMap[type] || [type];
for (const day of days) {
  if (item.day && Number(day.day) !== Number(item.day)) continue;
  const found = (day.schedule || []).find(schedule =>
    (this._isHotelDecision(item) && this._isHotelRelatedSchedule(schedule)) ||
    categories.includes(String(schedule.category || '').toLowerCase()) ||
    String(schedule.place || '').includes(item.label || '')
  );
  if (found) return found;
}
return null;
},

_applyHotelNameToRelatedSchedules(tripData, item, hotelName) {
if (!hotelName) return;
const days = tripData.days || [];
days.forEach(day => {
  if (item.day && Number(day.day) !== Number(item.day)) return;
  (day.schedule || []).forEach(schedule => {
    if (!this._isHotelRelatedSchedule(schedule)) return;
    schedule.selected_decision_label = item.label || schedule.selected_decision_label || '';
    schedule.selected_option_name = hotelName;
    if (schedule.place && !String(schedule.place).includes(hotelName)) {
      const withoutGeneric = String(schedule.place).replace(/^ホテル内/, '').trim();
      schedule.place = withoutGeneric ? `${hotelName} ${withoutGeneric}` : hotelName;
    } else if (!schedule.place) {
      schedule.place = hotelName;
    }
  });
});
},

_isHotelDecision(item) {
return ['hotel', 'stay', 'accommodation', 'lodging'].includes(String(item?.type || '').toLowerCase());
},

_isHotelRelatedSchedule(schedule) {
const category = String(schedule?.category || '').toLowerCase();
const hotelCategories = ['hotel', 'stay', 'accommodation', 'lodging'];
if (hotelCategories.includes(category)) return true;
const text = [schedule?.place, schedule?.label, schedule?.reason, schedule?.tips]
  .filter(Boolean)
  .join(' ');
const hasHotelWord = /ホテル|宿|宿泊|大浴場|サウナ|チェックイン|チェックアウト|客室/.test(text);
return category === 'activity' ? hasHotelWord : hasHotelWord;
},

_recommendedName(item) {
return item.options?.find(option => option.id === item.recommended_option_id)?.name || '';
},

_bookmarkId(data) {
const raw = data?.bookmark_id || data?.trip_id || data?.id ||
  [data?.trip_title, data?.trip_meta?.start_date, data?.trip_meta?.destination].filter(Boolean).join('|') ||
  'default';
let hash = 0;
for (let i = 0; i < raw.length; i += 1) {
  hash = ((hash << 5) - hash) + raw.charCodeAt(i);
  hash |= 0;
}
return Math.abs(hash).toString(36);
},

_decisionStorageKey(bookmarkId) {
return bookmarkId ? `tabiosDecisionSelections:${bookmarkId}` : 'tabiosDecisionSelections';
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

try {
  const storedPersona = JSON.parse(localStorage.getItem('tabios_personality') || 'null');
  if (storedPersona?.code) {
    AppState.diagnosisResult = storedPersona;
    sessionStorage.setItem('tabios_personality', JSON.stringify(storedPersona));
    const sel = document.getElementById('my-personality');
    if (sel && storedPersona.name) sel.value = storedPersona.name;
  }
} catch(e) {}

document.getElementById('btn-reset-quiz')?.addEventListener('click', () => {
  diagnosis.reset(quizForm);
});

document.getElementById('btn-to-prompt')?.addEventListener('click', () => {
  this.switchTab('prompt');
});

document.getElementById('btn-save-diagnosis')?.addEventListener('click', () => {
  diagnosisImageExporter.download();
});

document.getElementById('btn-share-diagnosis')?.addEventListener('click', () => {
  diagnosisImageExporter.share();
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

document.getElementById('btn-finalize-shiori')?.addEventListener('click', () => {
  shioriInputHandler.finalizeDecisionReview();
});

document.getElementById('btn-reset-decision')?.addEventListener('click', () => {
  shioriInputHandler.resetDecisionReview();
});

document.getElementById('decision-list')?.addEventListener('click', e => {
  const searchLink = e.target.closest('.decision-search-button');
  if (searchLink) {
    trackEvent('google_search_clicked', {
      source: 'decision_review',
      url: searchLink.href || '',
      label: searchLink.textContent.trim()
    });
    return;
  }
  const optionBtn = e.target.closest('[data-decision-option]');
  if (optionBtn) {
    shioriInputHandler.selectDecisionOption(optionBtn.dataset.decisionOption, optionBtn.dataset.optionId);
    return;
  }
  const customBtn = e.target.closest('[data-decision-custom]');
  if (customBtn) {
    const id = customBtn.dataset.decisionCustom;
    const input = [...document.querySelectorAll('[data-decision-custom-input]')]
      .find(el => el.dataset.decisionCustomInput === id);
    shioriInputHandler.setCustomDecisionValue(id, input?.value || '');
    return;
  }
  const undecidedBtn = e.target.closest('[data-decision-undecided]');
  if (undecidedBtn) {
    shioriInputHandler.setDecisionUndecided(undecidedBtn.dataset.decisionUndecided);
  }
});

// ── Profile ──
document.getElementById('btn-profile')?.addEventListener('click', () => {
  profileViewer.open();
});

document.getElementById('profile-modal')?.addEventListener('click', e => {
  if (e.target.closest('[data-profile-close]')) {
    profileViewer.close();
  }
  if (e.target.closest('[data-profile-diagnosis]')) {
    profileViewer.close();
    this.switchTab('diagnosis');
  }
  if (e.target.closest('[data-profile-save]')) {
    diagnosisImageExporter.download();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') profileViewer.close();
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
  const deleteId = e.target.closest('[data-archive-delete]')?.dataset.archiveDelete;
  if (openId) archiveManager.openTrip(openId);
  if (exportId) archiveManager.exportTrip(exportId);
  if (deleteId && confirm('この旅の記録を削除しますか？')) {
    archiveManager.deleteTrip(deleteId);
  }
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
