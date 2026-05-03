const fs = require('fs');

const bgPath = 'C:/Users/fyone/AppData/Roaming/Genspark Claw/users/ab54bf68-d5d4-409b-83d4-8b036308c046/workspace/note-chrome-bg.png';
const bgBase64 = fs.readFileSync(bgPath).toString('base64');

const W = 1280, H = 670;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <!-- 背景画像 -->
  <image href="data:image/png;base64,${bgBase64}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>

  <!-- 暗いオーバーレイ（左側を読みやすく） -->
  <rect x="0" y="0" width="780" height="${H}" fill="rgba(5,5,10,0.72)"/>

  <!-- 左アクセントライン -->
  <defs>
    <linearGradient id="acc" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="7" height="${H}" fill="url(#acc)"/>

  <!-- タグ -->
  <rect x="56" y="52" width="238" height="40" rx="20" fill="#4f46e5" opacity="0.9"/>
  <text x="175" y="78" font-family="'Hiragino Sans','Yu Gothic UI','Meiryo',sans-serif" font-size="17" font-weight="bold" fill="white" text-anchor="middle">マーケティング戦術</text>

  <!-- メインコピー -->
  <text x="56" y="195" font-family="'Hiragino Sans','Yu Gothic UI','Meiryo',sans-serif" font-size="78" font-weight="bold" fill="white" letter-spacing="-1">SEOより</text>
  <text x="56" y="285" font-family="'Hiragino Sans','Yu Gothic UI','Meiryo',sans-serif" font-size="78" font-weight="bold" fill="#818cf8" letter-spacing="-1">10倍強い</text>
  <text x="56" y="375" font-family="'Hiragino Sans','Yu Gothic UI','Meiryo',sans-serif" font-size="78" font-weight="bold" fill="white" letter-spacing="-1">集客装置を</text>
  <text x="56" y="465" font-family="'Hiragino Sans','Yu Gothic UI','Meiryo',sans-serif" font-size="78" font-weight="bold" fill="#fbbf24" letter-spacing="-1">無料で作った。</text>

  <!-- サブコピー -->
  <text x="56" y="526" font-family="'Hiragino Sans','Yu Gothic UI','Meiryo',sans-serif" font-size="22" fill="#9ca3af">Chrome拡張機能 × 寄生型PR ｜ 技術知識ゼロでOK</text>

  <!-- 右側カード -->
  <rect x="830" y="105" width="395" height="455" rx="22" fill="rgba(10,10,20,0.88)" stroke="#374151" stroke-width="1.5"/>

  <!-- 登録費用 -->
  <text x="1027" y="168" font-family="'Hiragino Sans','Yu Gothic UI','Meiryo',sans-serif" font-size="19" font-weight="bold" fill="#818cf8" text-anchor="middle">💳 登録費用</text>
  <text x="1027" y="252" font-family="Arial,Helvetica,sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle">$5</text>
  <text x="1027" y="283" font-family="'Hiragino Sans','Yu Gothic UI','Meiryo',sans-serif" font-size="16" fill="#6b7280" text-anchor="middle">一度払うだけ・月額ゼロ</text>

  <line x1="858" y1="310" x2="1197" y2="310" stroke="#1f2937" stroke-width="1"/>

  <!-- 転換率 -->
  <text x="1027" y="360" font-family="'Hiragino Sans','Yu Gothic UI','Meiryo',sans-serif" font-size="19" font-weight="bold" fill="#10b981" text-anchor="middle">📈 転換率</text>
  <text x="1027" y="430" font-family="'Hiragino Sans','Yu Gothic UI','Meiryo',sans-serif" font-size="54" font-weight="bold" fill="white" text-anchor="middle">SEO超え</text>
  <text x="1027" y="463" font-family="'Hiragino Sans','Yu Gothic UI','Meiryo',sans-serif" font-size="16" fill="#6b7280" text-anchor="middle">能動的ユーザーが自ら来る</text>

  <line x1="858" y1="490" x2="1197" y2="490" stroke="#1f2937" stroke-width="1"/>

  <text x="1027" y="535" font-family="Arial,Helvetica,sans-serif" font-size="18" fill="#4f46e5" text-anchor="middle">by NextraLabs</text>

  <!-- 下部バー -->
  <rect x="0" y="${H-56}" width="${W}" height="56" fill="rgba(10,10,20,0.95)"/>
  <rect x="0" y="${H-56}" width="${W}" height="3" fill="#4f46e5"/>
  <text x="56" y="${H-20}" font-family="'Hiragino Sans','Yu Gothic UI','Meiryo',sans-serif" font-size="18" fill="#6b7280">¥300 の有料記事  ｜  読了時間：約5分  ｜  コピーするだけで真似できる</text>
</svg>`;

const outPath = 'C:/Users/fyone/AppData/Roaming/Genspark Claw/users/ab54bf68-d5d4-409b-83d4-8b036308c046/workspace/note-chrome-thumbnail-final.svg';
fs.writeFileSync(outPath, svg, 'utf8');
console.log('完了: ' + outPath);
