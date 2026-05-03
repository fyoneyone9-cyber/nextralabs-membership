const { createCanvas } = require('canvas');
const fs = require('fs');

// 1280x670 (noteの推奨サイズ)
const W = 1280, H = 670;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// 背景：黒
ctx.fillStyle = '#0a0a0a';
ctx.fillRect(0, 0, W, H);

// 左側アクセントライン
const grad = ctx.createLinearGradient(0, 0, 0, H);
grad.addColorStop(0, '#4f46e5');
grad.addColorStop(1, '#7c3aed');
ctx.fillStyle = grad;
ctx.fillRect(0, 0, 8, H);

// 右下装飾円
ctx.globalAlpha = 0.07;
ctx.fillStyle = '#6366f1';
ctx.beginPath();
ctx.arc(W - 100, H + 50, 350, 0, Math.PI * 2);
ctx.fill();
ctx.globalAlpha = 1;

// タグ：「マーケティング」
ctx.fillStyle = '#4f46e5';
ctx.beginPath();
ctx.roundRect(60, 60, 220, 40, 20);
ctx.fill();
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 18px sans-serif';
ctx.textAlign = 'left';
ctx.fillText('マーケティング戦術', 80, 86);

// メインキャッチ（大）
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 72px sans-serif';
ctx.fillText('SEOより', 60, 200);

ctx.fillStyle = '#818cf8';
ctx.font = 'bold 72px sans-serif';
ctx.fillText('10倍強い', 60, 285);

ctx.fillStyle = '#ffffff';
ctx.font = 'bold 72px sans-serif';
ctx.fillText('集客装置を', 60, 370);

ctx.fillStyle = '#fbbf24';
ctx.font = 'bold 72px sans-serif';
ctx.fillText('無料で作った。', 60, 455);

// サブキャッチ
ctx.fillStyle = '#9ca3af';
ctx.font = '26px sans-serif';
ctx.fillText('Chrome拡張機能×寄生型PR戦略｜技術知識ゼロでOK', 60, 520);

// 右側：インパクト数字ボックス
ctx.fillStyle = '#111827';
ctx.beginPath();
ctx.roundRect(820, 120, 400, 430, 24);
ctx.fill();
ctx.strokeStyle = '#374151';
ctx.lineWidth = 1.5;
ctx.stroke();

// 数字①
ctx.fillStyle = '#4f46e5';
ctx.font = 'bold 22px sans-serif';
ctx.textAlign = 'center';
ctx.fillText('登録費用', 1020, 175);
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 64px sans-serif';
ctx.fillText('$5', 1020, 255);
ctx.fillStyle = '#6b7280';
ctx.font = '18px sans-serif';
ctx.fillText('たった一度払うだけ', 1020, 285);

// 区切り線
ctx.strokeStyle = '#1f2937';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(850, 310);
ctx.lineTo(1190, 310);
ctx.stroke();

// 数字②
ctx.fillStyle = '#10b981';
ctx.font = 'bold 22px sans-serif';
ctx.fillText('転換率', 1020, 360);
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 64px sans-serif';
ctx.fillText('SEO超え', 1020, 435);
ctx.fillStyle = '#6b7280';
ctx.font = '18px sans-serif';
ctx.fillText('能動的ユーザーが自ら来る', 1020, 465);

// 区切り線
ctx.beginPath();
ctx.moveTo(850, 490);
ctx.lineTo(1190, 490);
ctx.stroke();

// NextraLabs
ctx.fillStyle = '#6b7280';
ctx.font = '20px sans-serif';
ctx.fillText('by NextraLabs', 1020, 530);

// 下部バー
ctx.fillStyle = '#111827';
ctx.fillRect(0, H - 60, W, 60);
ctx.fillStyle = '#4f46e5';
ctx.fillRect(0, H - 60, W, 3);
ctx.fillStyle = '#6b7280';
ctx.font = '18px sans-serif';
ctx.textAlign = 'left';
ctx.fillText('¥300 の有料記事  |  読了時間：約5分  |  技術知識ゼロでOK', 60, H - 22);

const outPath = 'C:/Users/fyone/AppData/Roaming/Genspark Claw/users/ab54bf68-d5d4-409b-83d4-8b036308c046/workspace/note-chrome-thumbnail.png';
fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
console.log('完了: ' + outPath);
