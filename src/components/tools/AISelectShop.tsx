'use client'
import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Loader2, Settings, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const STYLES = [
  { id: 'japanese',  name: '和風・日の丸',  emoji: '⛩️', bg: '#1a0000', textColor: '#c0392b', accent: '#ffffff', font: 'bold 28px serif' },
  { id: 'street',    name: 'ストリート',    emoji: '🏙️', bg: '#111111', textColor: '#ffdd00', accent: '#ffffff', font: 'bold 30px Impact, sans-serif' },
  { id: 'retro',     name: 'レトロ',        emoji: '📻', bg: '#2c1a0e', textColor: '#ff6b35', accent: '#f7c59f', font: 'bold 26px Georgia, serif' },
  { id: 'cyberpunk', name: 'サイバー',      emoji: '🌃', bg: '#000020', textColor: '#00ffff', accent: '#ff00ff', font: 'bold 28px monospace' },
  { id: 'kawaii',    name: 'かわいい',      emoji: '🎀', bg: '#fff0f5', textColor: '#ff69b4', accent: '#ffb7c5', font: 'bold 28px sans-serif' },
  { id: 'minimal',   name: 'ミニマル',      emoji: '⬜', bg: '#ffffff', textColor: '#111111', accent: '#888888', font: '300 28px Helvetica, sans-serif' },
  { id: 'gold',      name: 'ラグジュアリー', emoji: '💎', bg: '#0a0a00', textColor: '#d4af37', accent: '#ffe566', font: 'bold 26px Georgia, serif' },
  { id: 'neon',      name: 'ネオンサイン',  emoji: '💡', bg: '#000000', textColor: '#39ff14', accent: '#ff00ff', font: 'bold 28px monospace' },
  { id: 'nature',    name: 'ボタニカル',    emoji: '🌿', bg: '#f1f8f1', textColor: '#2ecc71', accent: '#1a6b3a', font: 'bold 26px Georgia, serif' },
  { id: 'gradient',  name: 'グラデーション', emoji: '🌈', bg: '#1a0033', textColor: '#ffffff', accent: '#a855f7', font: 'bold 28px sans-serif' },
  { id: 'vintage',   name: 'ヴィンテージ',  emoji: '🗿', bg: '#f5e6c8', textColor: '#5c3d1e', accent: '#a0785a', font: 'bold 26px Georgia, serif' },
  { id: 'popart',    name: 'ポップアート',  emoji: '🎨', bg: '#ffff00', textColor: '#e91e63', accent: '#0000ff', font: 'bold 30px Impact, sans-serif' },
  { id: 'anime',     name: 'アニメ風',      emoji: '🌸', bg: '#0d0d2b', textColor: '#ff6ec7', accent: '#7df9ff', font: 'bold 26px sans-serif' },
  { id: 'military',  name: 'ミリタリー',   emoji: '🪖', bg: '#2d3a1e', textColor: '#c8b560', accent: '#8a9a5b', font: 'bold 26px monospace' },
  { id: 'typo',      name: 'タイポグラフィ', emoji: '🔤', bg: '#ffffff', textColor: '#000000', accent: '#ff3300', font: '900 32px Helvetica, sans-serif' },
  { id: 'monochrome',name: 'モノクロ',      emoji: '🖤', bg: '#1a1a1a', textColor: '#ffffff', accent: '#888888', font: '300 28px Helvetica, sans-serif' },
];

const TSHIRT_COLORS = [
  { id: 'white',  name: '白',      hex: '#FFFFFF' },
  { id: 'black',  name: '黒',      hex: '#1a1a1a' },
  { id: 'navy',   name: '紺',      hex: '#1e3a5f' },
  { id: 'gray',   name: 'グレー',   hex: '#808080' },
  { id: 'red',    name: 'レッド',   hex: '#e74c3c' },
  { id: 'beige',  name: 'ベージュ', hex: '#f5e6c8' },
  { id: 'green',  name: 'グリーン', hex: '#2d6a4f' },
  { id: 'purple', name: 'パープル', hex: '#6b21a8' },
  { id: 'pink',   name: 'ピンク',   hex: '#f472b6' },
  { id: 'orange', name: 'オレンジ', hex: '#ea580c' },
  { id: 'brown',  name: 'ブラウン', hex: '#78350f' },
  { id: 'yellow', name: 'イエロー', hex: '#fbbf24' },
];

const TEXT_COLORS = [
  { id: 'white',   hex: '#FFFFFF', name: '白' },
  { id: 'black',   hex: '#111111', name: '黒' },
  { id: 'yellow',  hex: '#FFE600', name: '黄' },
  { id: 'red',     hex: '#FF2D2D', name: '赤' },
  { id: 'cyan',    hex: '#00FFFF', name: '水色' },
  { id: 'pink',    hex: '#FF6EC7', name: 'ピンク' },
  { id: 'gold',    hex: '#D4AF37', name: 'ゴールド' },
  { id: 'lime',    hex: '#39FF14', name: 'ライム' },
];

const LS_KEY = 'nextra_selectshop_settings';

const MasterEngine = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [trends, setTrends] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [style, setStyle] = useState('japanese');
  const [tshirtColor, setTshirtColor] = useState('black');
  const [textColorId, setTextColorId] = useState('auto'); // 'auto' = スタイルデフォルト
  const [mockupDataUrl, setMockupDataUrl] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ url?: string; error?: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ name?: string; status?: string } | null>(null);

  // ユーザー毎のAPIキー設定（任意：未設定時はサーバーのデフォルトを使用）
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [shopifyClientId, setShopifyClientId] = useState('');
  const [shopifyClientSecret, setShopifyClientSecret] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // localStorageからAPIキー読み込み
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const { shopifyDomain: sd, shopifyClientId: ci, shopifyClientSecret: cs } = JSON.parse(saved);
        if (sd) setShopifyDomain(sd);
        if (ci) setShopifyClientId(ci);
        if (cs) setShopifyClientSecret(cs);
      }
    } catch {}
    fetchTrends();
  }, []);

  const saveSettings = () => {
    localStorage.setItem(LS_KEY, JSON.stringify({ shopifyDomain, shopifyClientId, shopifyClientSecret }));
    setShowSettings(false);
    setTestResult(null);
  };

  const testShopifyConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'shopify-test',
          shopifyDomain: shopifyDomain || undefined,
          shopifyClientId: shopifyClientId || undefined,
          shopifyClientSecret: shopifyClientSecret || undefined,
        }),
      });
      const data = await res.json();
      setTestResult(data.result || { status: 'ERROR', name: data.error });
    } catch (e: any) {
      setTestResult({ status: 'ERROR', name: e.message });
    } finally {
      setIsTesting(false);
    }
  };

  const fetchTrends = async () => {
    setIsLoading(true);
    try {
      const r = await fetch('/api/trends', { cache: 'no-store' });
      const d = await r.json();
      if (d.trends) setTrends(d.trends.slice(0, 9).map((t: string, i: number) => ({ id: i, name: t })));
    } catch {
      setTrends([
        { id: 0, name: 'AI美女' }, { id: 1, name: '猫動画' }, { id: 2, name: 'キャンプギア' },
        { id: 3, name: '推し活' }, { id: 4, name: 'サウナ' }, { id: 5, name: 'ガジェット' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Tシャツのクリップパスを定義（装飾をTシャツ内に収める）
  const getTshirtPath = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.beginPath();
    ctx.moveTo(w*0.2, h*0.1);
    ctx.lineTo(w*0.8, h*0.1);
    ctx.lineTo(w*0.95, h*0.3);
    ctx.lineTo(w*0.8, h*0.35);
    ctx.lineTo(w*0.8, h*0.9);
    ctx.lineTo(w*0.2, h*0.9);
    ctx.lineTo(w*0.2, h*0.35);
    ctx.lineTo(w*0.05, h*0.3);
    ctx.closePath();
  };

  const drawDesign = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !keyword) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width, h = canvas.height;
    const S = STYLES.find(s => s.id === style) || STYLES[0];
    const TC = TSHIRT_COLORS.find(c => c.id === tshirtColor) || TSHIRT_COLORS[1];

    // ========== キャンバスクリア ==========
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, w, h);

    // ========== Tシャツベース（影） ==========
    ctx.save();
    getTshirtPath(ctx, w, h);
    ctx.shadowColor = 'rgba(0,0,0,0.22)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = TC.hex;
    ctx.fill();
    ctx.restore();

    // ========== Tシャツ内にクリップして装飾描画 ==========
    ctx.save();
    getTshirtPath(ctx, w, h);
    ctx.clip();

    // Tシャツベース色を再塗り
    ctx.fillStyle = TC.hex;
    ctx.fillRect(0, 0, w, h);

    // ========== プリントエリア（胸元） ==========
    const cx = w / 2;
    const cy = h * 0.44; // 胸元（上に移動）
    const pr = h * 0.20; // プリント半径

    if (style === 'japanese') {
      // 朱色の大きな円をTシャツに直接
      ctx.fillStyle = 'rgba(192,57,43,0.92)';
      ctx.beginPath(); ctx.arc(cx, cy, pr, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, pr - 6, 0, Math.PI*2); ctx.stroke();

    } else if (style === 'street') {
      // 黒いブロック帯
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(w*0.1, cy - pr*0.6, w*0.8, pr*1.2);
      ctx.fillStyle = '#ffdd00';
      ctx.fillRect(w*0.1, cy - pr*0.6, w*0.8, 5);
      ctx.fillRect(w*0.1, cy + pr*0.6 - 5, w*0.8, 5);

    } else if (style === 'retro') {
      // 同心円をTシャツに直接
      for (let r = pr; r > 8; r -= 14) {
        ctx.strokeStyle = r % 28 === 0 ? 'rgba(255,107,53,0.8)' : 'rgba(212,169,106,0.5)';
        ctx.lineWidth = r % 28 === 0 ? 2.5 : 1;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();
      }

    } else if (style === 'cyberpunk') {
      const top = cy - pr*1.1, bot = cy + pr*1.1;
      ctx.fillStyle = 'rgba(0,0,30,0.7)';
      ctx.fillRect(w*0.08, top, w*0.84, bot - top);
      ctx.strokeStyle = 'rgba(0,255,255,0.22)'; ctx.lineWidth = 1;
      for (let x = w*0.08; x < w*0.92; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bot); ctx.stroke();
      }
      for (let y = top; y < bot; y += 20) {
        ctx.beginPath(); ctx.moveTo(w*0.08, y); ctx.lineTo(w*0.92, y); ctx.stroke();
      }
      const cg = ctx.createLinearGradient(0, top, w, bot);
      cg.addColorStop(0, 'rgba(0,255,255,0.08)');
      cg.addColorStop(1, 'rgba(255,0,255,0.08)');
      ctx.fillStyle = cg; ctx.fillRect(w*0.08, top, w*0.84, bot - top);

    } else if (style === 'kawaii') {
      // パステルピンクの円
      ctx.fillStyle = 'rgba(255,182,193,0.45)';
      ctx.beginPath(); ctx.arc(cx, cy, pr, 0, Math.PI*2); ctx.fill();
      // ハート装飾
      const hearts: [number,number][] = [[cx-40,cy-30],[cx+35,cy-25],[cx-25,cy+35],[cx+38,cy+28],[cx,cy-pr+12],[cx,cy+pr-12]];
      hearts.forEach(([hx,hy]) => {
        ctx.fillStyle = 'rgba(255,105,180,0.55)';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('♥', hx, hy);
      });

    } else if (style === 'minimal') {
      // 細いラインのみ（背景色そのまま）
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(w*0.25, cy - pr*0.8); ctx.lineTo(w*0.75, cy - pr*0.8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w*0.25, cy + pr*0.8); ctx.lineTo(w*0.75, cy + pr*0.8); ctx.stroke();

    } else if (style === 'gold') {
      // ゴールドの円とオーナメント
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, pr);
      grd.addColorStop(0, 'rgba(212,175,55,0.25)');
      grd.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(cx, cy, pr, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, pr, 0, Math.PI*2); ctx.stroke();
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, pr - 8, 0, Math.PI*2); ctx.stroke();
      // 四方に小さいダイヤ
      [[cx,cy-pr+4],[cx,cy+pr-4],[cx-pr+4,cy],[cx+pr-4,cy]].forEach(([px,py]) => {
        ctx.fillStyle = '#d4af37';
        ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI*2); ctx.fill();
      });

    } else if (style === 'neon') {
      ctx.shadowBlur = 24; ctx.shadowColor = '#39ff14';
      ctx.strokeStyle = '#39ff14'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, pr, 0, Math.PI*2); ctx.stroke();
      ctx.shadowColor = '#ff00ff';
      ctx.strokeStyle = '#ff00ff'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, pr - 10, 0, Math.PI*2); ctx.stroke();
      ctx.shadowBlur = 0;

    } else if (style === 'nature') {
      // 緑の葉っぱ風楕円
      const leafPositions: [number,number,number][] = [
        [cx-pr*0.5, cy-pr*0.3, 0.4],[cx+pr*0.5, cy-pr*0.3, -0.4],
        [cx-pr*0.3, cy+pr*0.4, 0.8],[cx+pr*0.3, cy+pr*0.4, -0.8],
        [cx, cy-pr*0.6, 0],
      ];
      leafPositions.forEach(([lx,ly,angle]) => {
        ctx.fillStyle = 'rgba(46,204,113,0.35)';
        ctx.beginPath();
        ctx.ellipse(lx, ly, pr*0.28, pr*0.14, angle, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(26,107,58,0.5)'; ctx.lineWidth = 1;
        ctx.stroke();
      });

    } else if (style === 'gradient') {
      // Tシャツ全体をグラデで染める
      const gg = ctx.createLinearGradient(0, 0, w, h);
      gg.addColorStop(0, '#7c3aed');
      gg.addColorStop(0.45, '#db2777');
      gg.addColorStop(1, '#2563eb');
      ctx.fillStyle = gg; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, h*0.25); ctx.lineTo(w, h*0.1); ctx.stroke();

    } else if (style === 'vintage') {
      // クリーム色の楕円
      ctx.fillStyle = 'rgba(245,230,200,0.6)';
      ctx.beginPath(); ctx.ellipse(cx, cy, pr*1.1, pr*0.8, 0, 0, Math.PI*2); ctx.fill();
      // ざらつき
      ctx.fillStyle = 'rgba(92,61,30,0.03)';
      for (let i = 0; i < 300; i++) {
        ctx.fillRect(cx - pr + Math.random()*pr*2, cy - pr + Math.random()*pr*2, 2, 2);
      }
      ctx.strokeStyle = '#8b5e3c'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(cx, cy, pr*1.1, pr*0.8, 0, 0, Math.PI*2); ctx.stroke();
      ctx.strokeStyle = '#c8a96a'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(cx, cy, pr*0.98, pr*0.68, 0, 0, Math.PI*2); ctx.stroke();

    } else if (style === 'popart') {
      // 全体を黄色で
      ctx.fillStyle = '#FFE600'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255,0,60,0.13)';
      for (let px = 0; px < w; px += 14) {
        for (let py = 0; py < h; py += 14) {
          ctx.beginPath(); ctx.arc(px+5, py+5, 4, 0, Math.PI*2); ctx.fill();
        }
      }
      ctx.strokeStyle = '#000'; ctx.lineWidth = 6;
      ctx.strokeRect(3, h*0.12, w-6, h*0.82);

    } else if (style === 'anime') {
      // 深夜ブルーのオーラ円
      const ag = ctx.createRadialGradient(cx, cy, 0, cx, cy, pr);
      ag.addColorStop(0, 'rgba(13,13,43,0.8)');
      ag.addColorStop(1, 'rgba(13,13,43,0)');
      ctx.fillStyle = ag;
      ctx.beginPath(); ctx.arc(cx, cy, pr*1.2, 0, Math.PI*2); ctx.fill();
      // 星
      const starPos: [number,number][] = [[cx-pr*0.7,cy-pr*0.6],[cx+pr*0.65,cy-pr*0.5],[cx-pr*0.4,cy+pr*0.65],[cx+pr*0.55,cy+pr*0.55],[cx,cy-pr*0.9],[cx,cy+pr*0.9]];
      starPos.forEach(([sx,sy]) => {
        ctx.fillStyle = 'rgba(125,249,255,0.7)';
        ctx.font = '16px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('★', sx, sy);
      });
      ctx.shadowBlur = 14; ctx.shadowColor = '#ff6ec7';
      ctx.strokeStyle = '#ff6ec7'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, pr, 0, Math.PI*2); ctx.stroke();
      ctx.shadowBlur = 0;

    } else if (style === 'military') {
      // カモフラ全体（Tシャツ全面）
      const camo = ['rgba(45,58,30,0.8)','rgba(58,74,40,0.7)','rgba(74,92,48,0.6)','rgba(30,42,16,0.85)'];
      for (let i = 0; i < 24; i++) {
        ctx.fillStyle = camo[i % camo.length];
        ctx.beginPath();
        ctx.ellipse(
          (i*67)%w, (i*43)%h,
          25+(i%5)*12, 14+(i%4)*8, i*0.48, 0, Math.PI*2
        );
        ctx.fill();
      }

    } else if (style === 'typo') {
      // 白ベース
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
      // 巨大薄い頭文字（背景）
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.font = `900 ${h*0.55}px Helvetica, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText((keyword[0]||'A').toUpperCase(), cx, cy + h*0.02);
      // 赤帯
      ctx.fillStyle = '#FF3300';
      ctx.fillRect(0, cy - pr*0.95, w, 8);
      ctx.fillRect(0, cy + pr*0.85, w, 8);

    } else if (style === 'monochrome') {
      // 全体ダーク
      ctx.fillStyle = '#111'; ctx.fillRect(0, 0, w, h);
      const mg = ctx.createRadialGradient(cx, cy, 0, cx, cy, pr*1.4);
      mg.addColorStop(0, 'rgba(255,255,255,0.1)');
      mg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = mg; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1;
      ctx.strokeRect(w*0.1, h*0.15, w*0.8, h*0.72);
    }

    // ========== テキスト描画 ==========
    // 文字色: ユーザー選択 > スタイルデフォルト
    const resolvedTextColor = textColorId !== 'auto'
      ? (TEXT_COLORS.find(c => c.id === textColorId)?.hex || S.textColor)
      : S.textColor;

    ctx.font = S.font;
    ctx.fillStyle = resolvedTextColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (['cyberpunk','neon','anime'].includes(style)) {
      ctx.shadowBlur = 20; ctx.shadowColor = resolvedTextColor;
    }

    const maxW = w * 0.68;
    const chars = keyword.split('');
    let line = '';
    const lines: string[] = [];
    for (const ch of chars) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = ch; }
      else line = test;
    }
    lines.push(line);
    const lineH = 42;
    const startY = cy - ((lines.length - 1) * lineH) / 2;

    lines.forEach((l, i) => {
      const y = startY + i * lineH;
      if (style === 'popart') {
        ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.strokeText(l, cx, y);
      } else if (style === 'military') {
        ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 3; ctx.strokeText(l, cx, y);
      } else if (style === 'vintage') {
        ctx.strokeStyle = 'rgba(139,94,60,0.35)'; ctx.lineWidth = 2; ctx.strokeText(l, cx, y);
      } else if (['gradient','monochrome','neon','cyberpunk','anime'].includes(style)) {
        // 読みやすさのために薄い影
        ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 2; ctx.strokeText(l, cx, y);
      }
      ctx.fillText(l, cx, y);
    });

    ctx.shadowBlur = 0; ctx.shadowColor = 'transparent';
    ctx.restore(); // クリップ解除

    setMockupDataUrl(canvas.toDataURL('image/png'));
  }, [keyword, style, tshirtColor, textColorId]);

  useEffect(() => {
    if (keyword) {
      const t = setTimeout(() => drawDesign(), 50);
      return () => clearTimeout(t);
    }
  }, [keyword, style, tshirtColor, textColorId, drawDesign]);

  const handlePublish = async () => {
    if (!mockupDataUrl || !keyword) {
      alert('キーワードを入力してプレビューを確認してください');
      return;
    }
    setIsPublishing(true);
    setPublishResult(null);
    try {
      const res = await fetch('/api/tools/printful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-product',
          keyword,
          style,
          tshirtColor,
          mockupUrl: mockupDataUrl,
          sizes: ['S', 'M', 'L', 'XL'],
          // ユーザー設定（空なら省略 → サーバーのデフォルト使用）
          shopifyDomain: shopifyDomain || undefined,
          shopifyClientId: shopifyClientId || undefined,
          shopifyClientSecret: shopifyClientSecret || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPublishResult({ url: data.shopify?.url });
        setCurrentStep(3);
      } else {
        setPublishResult({ error: data.error || '出品に失敗しました' });
      }
    } catch (e: any) {
      setPublishResult({ error: e.message });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-32 text-left border-4 border-emerald-500/50 rounded-[2rem] p-3 md:p-10 shadow-2xl bg-[#050507]">

      {/* ヘッダー */}
      <div className="text-center space-y-3 relative">
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">AIセレクトショップ</h1>
        <div className="inline-block bg-[#5845e0] text-white font-black px-4 py-0.5 rounded-full uppercase italic text-[10px]">v25.0-MASTER</div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="absolute top-0 right-0 flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 text-xs font-bold px-3 py-2 rounded-xl transition-all"
        >
          <Settings size={14} /> Shopify設定
        </button>
      </div>

      {/* Shopify設定パネル */}
      {showSettings && (
        <div className="bg-[#0d0e1a] border-2 border-emerald-500/30 rounded-3xl p-8 space-y-5 animate-in fade-in">
          <div>
            <h3 className="text-white font-black text-lg uppercase italic">Shopify連携設定</h3>
            <p className="text-slate-500 text-xs mt-1">未設定の場合はNextraLabsのデフォルトストアに出品されます。自分のShopifyストアに出品したい場合は以下を入力してください。</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-500">Shopifyドメイン</label>
              <input value={shopifyDomain} onChange={e => setShopifyDomain(e.target.value)}
                placeholder="yourshop.myshopify.com"
                className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-emerald-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500">Client ID</label>
              <input value={shopifyClientId} onChange={e => setShopifyClientId(e.target.value)}
                placeholder="67b4f4e95c3a..."
                className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-emerald-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500">Client Secret</label>
              <input value={shopifyClientSecret} onChange={e => setShopifyClientSecret(e.target.value)}
                type="password" placeholder="shpss_xxxxxxxx"
                className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-emerald-500" />
            </div>
          </div>

          {/* 接続テスト結果 */}
          {testResult && (
            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold ${testResult.status === 'CONNECTED' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
              {testResult.status === 'CONNECTED' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              {testResult.status === 'CONNECTED' ? `接続成功: ${testResult.name}` : `接続失敗: ${testResult.name}`}
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            <button onClick={saveSettings}
              className="px-8 h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl transition-all">
              保存する
            </button>
            <button onClick={testShopifyConnection} disabled={isTesting}
              className="px-6 h-12 bg-white/5 hover:bg-white/10 text-slate-300 font-black text-sm rounded-xl transition-all disabled:opacity-50">
              {isTesting ? <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" />テスト中...</span> : '接続テスト'}
            </button>
            <button onClick={() => setShowSettings(false)}
              className="px-6 h-12 bg-white/5 text-slate-500 font-black text-sm rounded-xl transition-all">
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* ステップナビ */}
      <div className="flex gap-2 justify-center bg-white/5 p-1.5 rounded-2xl border border-white/5 max-w-xl mx-auto">
        {[1, 2, 3].map(s => (
          <button key={s} onClick={() => setCurrentStep(s)}
            className={'flex-1 py-3 rounded-xl font-black italic text-xs ' + (currentStep === s ? 'bg-[#5845e0] text-white' : 'text-slate-500')}>
            Step {s}
          </button>
        ))}
      </div>

      {/* Step1: トレンド一覧 */}
      {currentStep === 1 && (
        <div className="animate-in fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0a0b14] p-6 rounded-3xl border-2 border-emerald-500/20 shadow-inner mb-8">
            <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-emerald-500 uppercase tracking-widest italic">TREND ENGINE: LIVE SYNC</span>
            </div>
            <button onClick={fetchTrends} disabled={isLoading}
              className="text-xs text-slate-400 hover:text-white font-bold border border-white/10 px-4 py-2 rounded-xl transition-all disabled:opacity-50">
              {isLoading ? '取得中...' : '更新'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? <div className="col-span-3 text-center py-20 text-emerald-500"><Loader2 className="animate-spin mx-auto" /></div>
              : trends.map(t => (
                <div key={t.id}
                  className="bg-[#13141f] border-2 border-white/5 p-8 rounded-[2rem] hover:border-emerald-500 cursor-pointer transition-all"
                  onClick={() => { setKeyword(t.name); setCurrentStep(2); }}>
                  <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 animate-pulse">最新バズワード連携</Badge>
                  <p className="text-2xl font-black italic text-white">{t.name}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Step2: デザイン作成 + 出品 */}
      {currentStep === 2 && (
        <div className="grid lg:grid-cols-2 gap-12 animate-in zoom-in-95">
          <div className="bg-[#13141f] p-8 rounded-[2.5rem] border-2 border-white/5 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 italic">デザインキーワード</label>
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                className="w-full h-16 text-2xl font-black italic bg-black border-2 border-white/10 rounded-xl px-6 text-white outline-none focus:border-emerald-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 italic">生地のカラー</label>
              <div className="flex flex-wrap gap-2">
                {TSHIRT_COLORS.map(c => (
                  <button key={c.id} onClick={() => setTshirtColor(c.id)} title={c.name}
                    className={'w-10 h-10 rounded-xl border-4 transition-all ' + (tshirtColor === c.id ? 'border-emerald-500 scale-110' : 'border-white/5 hover:border-white/20')}
                    style={{ backgroundColor: c.hex }} />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 italic">文字カラー</label>
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => setTextColorId('auto')}
                  className={'px-3 h-8 rounded-lg text-[10px] font-black border-2 transition-all ' + (textColorId === 'auto' ? 'border-emerald-500 text-white bg-emerald-500/20' : 'border-white/10 text-slate-500')}>
                  AUTO
                </button>
                {TEXT_COLORS.map(c => (
                  <button key={c.id} onClick={() => setTextColorId(c.id)} title={c.name}
                    className={'w-8 h-8 rounded-lg border-3 transition-all ' + (textColorId === c.id ? 'border-emerald-500 scale-110 border-2' : 'border-white/10 border-2 hover:border-white/30')}
                    style={{ backgroundColor: c.hex }} />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 italic">スタイルパレット</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {STYLES.map(s => (
                  <button key={s.id} onClick={() => setStyle(s.id)}
                    className={'py-2 rounded-xl text-[9px] font-black uppercase italic border-2 transition-all ' +
                      (style === s.id ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-black text-slate-500 border-white/5 hover:border-white/20')}>
                    {s.emoji} {s.name}
                  </button>
                ))}
              </div>
            </div>

            {publishResult?.error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-xs font-bold">
                {publishResult.error}
              </div>
            )}

            <button onClick={handlePublish} disabled={isPublishing || !keyword}
              className="w-full h-24 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-3xl italic rounded-[2rem] shadow-xl active:scale-95 transition-all">
              {isPublishing
                ? <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> 出品中...</span>
                : 'SHOPIFY 出品'}
            </button>
          </div>

          {/* キャンバスプレビュー */}
          <div className="bg-[#13141f] rounded-[2.5rem] border-2 border-white/5 p-10 flex justify-center items-center">
            <canvas ref={canvasRef} width={400} height={500} className="bg-white rounded-3xl max-w-full h-auto shadow-2xl" />
          </div>
        </div>
      )}

      {/* Step3: 完了 */}
      {currentStep === 3 && (
        <div className="text-center py-20 animate-in zoom-in space-y-8">
          <h2 className="text-6xl font-black text-white italic uppercase">Success!</h2>
          <p className="text-emerald-400 font-bold text-xl">「{keyword}」Tシャツの出品が完了しました</p>
          {publishResult?.url && (
            <a href={publishResult.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 py-4 rounded-2xl transition-all">
              <ExternalLink size={18} /> Shopifyで確認する
            </a>
          )}
          <br />
          <button onClick={() => { setCurrentStep(1); setKeyword(''); setMockupDataUrl(null); setPublishResult(null); }}
            className="h-16 px-12 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl text-lg transition-all">
            新しい商品を作る
          </button>
        </div>
      )}
    </div>
  );
};

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function AISelectShop() { return <NoSSR />; }
