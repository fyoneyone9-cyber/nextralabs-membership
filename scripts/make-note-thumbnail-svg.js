const fs = require('fs');

const W = 1280, H = 670;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f0e17"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
  </defs>

  <!-- 背景 -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- 右下装飾円 -->
  <circle cx="${W-80}" cy="${H+60}" r="360" fill="#6366f1" opacity="0.07"/>
  <circle cx="${W-200}" cy="80" r="180" fill="#4f46e5" opacity="0.05"/>

  <!-- 左アクセントライン -->
  <rect x="0" y="0" width="8" height="${H}" fill="url(#accent)"/>

  <!-- タグ -->
  <rect x="60" y="55" width="240" height="42" rx="21" fill="#4f46e5"/>
  <text x="180" y="82" font-family="'Hiragino Sans','Yu Gothic','Meiryo',sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">マーケティング戦術</text>

  <!-- メインコピー -->
  <text x="60" y="200" font-family="'Hiragino Sans','Yu Gothic','Meiryo',sans-serif" font-size="76" font-weight="bold" fill="white">SEOより</text>
  <text x="60" y="290" font-family="'Hiragino Sans','Yu Gothic','Meiryo',sans-serif" font-size="76" font-weight="bold" fill="#818cf8">10倍強い</text>
  <text x="60" y="380" font-family="'Hiragino Sans','Yu Gothic','Meiryo',sans-serif" font-size="76" font-weight="bold" fill="white">集客装置を</text>
  <text x="60" y="470" font-family="'Hiragino Sans','Yu Gothic','Meiryo',sans-serif" font-size="76" font-weight="bold" fill="#fbbf24">無料で作った。</text>

  <!-- サブコピー -->
  <text x="60" y="530" font-family="'Hiragino Sans','Yu Gothic','Meiryo',sans-serif" font-size="24" fill="#9ca3af">Chrome拡張機能 × 寄生型PR戦略 ｜ 技術知識ゼロでOK</text>

  <!-- 右側ボックス -->
  <rect x="820" y="110" width="410" height="450" rx="24" fill="#111827" stroke="#374151" stroke-width="1.5"/>

  <!-- $5 -->
  <text x="1025" y="170" font-family="'Hiragino Sans','Yu Gothic','Meiryo',sans-serif" font-size="20" font-weight="bold" fill="#818cf8" text-anchor="middle">登録費用</text>
  <text x="1025" y="255" font-family="Arial,sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle">$5</text>
  <text x="1025" y="288" font-family="'Hiragino Sans','Yu Gothic','Meiryo',sans-serif" font-size="17" fill="#6b7280" text-anchor="middle">たった一度払うだけ</text>

  <!-- 区切り線 -->
  <line x1="848" y1="315" x2="1202" y2="315" stroke="#1f2937" stroke-width="1"/>

  <!-- SEO超え -->
  <text x="1025" y="365" font-family="'Hiragino Sans','Yu Gothic','Meiryo',sans-serif" font-size="20" font-weight="bold" fill="#10b981" text-anchor="middle">転換率</text>
  <text x="1025" y="440" font-family="'Hiragino Sans','Yu Gothic','Meiryo',sans-serif" font-size="52" font-weight="bold" fill="white" text-anchor="middle">SEO超え</text>
  <text x="1025" y="473" font-family="'Hiragino Sans','Yu Gothic','Meiryo',sans-serif" font-size="17" fill="#6b7280" text-anchor="middle">能動的ユーザーが自ら来る</text>

  <!-- 区切り線 -->
  <line x1="848" y1="498" x2="1202" y2="498" stroke="#1f2937" stroke-width="1"/>

  <!-- by NextraLabs -->
  <text x="1025" y="538" font-family="Arial,sans-serif" font-size="19" fill="#4f46e5" text-anchor="middle">by NextraLabs</text>

  <!-- 下部バー -->
  <rect x="0" y="${H-58}" width="${W}" height="58" fill="#111827"/>
  <rect x="0" y="${H-58}" width="${W}" height="3" fill="#4f46e5"/>
  <text x="60" y="${H-20}" font-family="'Hiragino Sans','Yu Gothic','Meiryo',sans-serif" font-size="18" fill="#6b7280">¥300 の有料記事  ｜  読了時間：約5分  ｜  技術知識ゼロでOK</text>
</svg>`;

const outPath = 'C:/Users/fyone/AppData/Roaming/Genspark Claw/users/ab54bf68-d5d4-409b-83d4-8b036308c046/workspace/note-chrome-thumbnail.svg';
fs.writeFileSync(outPath, svg, 'utf8');
console.log('SVG完了: ' + outPath);
