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

const LS_KEY = 'nextra_selectshop_settings';

const MasterEngine = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [trends, setTrends] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [style, setStyle] = useState('japanese');
  const [tshirtColor, setTshirtColor] = useState('black');
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
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, w, h);

    // ========== Tシャツシルエット ==========
    ctx.fillStyle = TC.hex;
    // 影
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 4;
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
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // ========== デザインエリア ==========
    const cx = w / 2;
    const dx = w * 0.25, dy = h * 0.3, dw = w * 0.5, dh = h * 0.4;
    const cy = dy + dh / 2;

    // ---------- スタイル別背景描画 ----------

    if (style === 'japanese') {
      // 白背景
      ctx.fillStyle = '#fefefe';
      ctx.fillRect(dx, dy, dw, dh);
      // 朱色の大きな円
      ctx.fillStyle = '#c0392b';
      ctx.beginPath();
      ctx.arc(cx, cy, dh * 0.38, 0, Math.PI * 2);
      ctx.fill();
      // 縦の飾り線
      ctx.strokeStyle = '#c0392b';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(dx + 8, dy + 8); ctx.lineTo(dx + 8, dy + dh - 8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(dx + dw - 8, dy + 8); ctx.lineTo(dx + dw - 8, dy + dh - 8); ctx.stroke();

    } else if (style === 'street') {
      ctx.fillStyle = '#111';
      ctx.fillRect(dx, dy, dw, dh);
      // ジグザグライン
      ctx.strokeStyle = '#ffdd00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = dx; x < dx + dw; x += 16) {
        ctx.lineTo(x, dy + (((x - dx) / 16) % 2 === 0 ? 8 : 18));
      }
      ctx.stroke();
      ctx.beginPath();
      for (let x = dx; x < dx + dw; x += 16) {
        ctx.lineTo(x, dy + dh - (((x - dx) / 16) % 2 === 0 ? 8 : 18));
      }
      ctx.stroke();

    } else if (style === 'retro') {
      ctx.fillStyle = '#f5e6c8';
      ctx.fillRect(dx, dy, dw, dh);
      // 同心円
      for (let r = dh * 0.45; r > 10; r -= 14) {
        ctx.strokeStyle = r % 28 === 0 ? '#ff6b35' : '#d4a96a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      // 外枠
      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = 3;
      ctx.strokeRect(dx + 5, dy + 5, dw - 10, dh - 10);

    } else if (style === 'cyberpunk') {
      ctx.fillStyle = '#000020';
      ctx.fillRect(dx, dy, dw, dh);
      // 格子線
      ctx.strokeStyle = 'rgba(0,255,255,0.2)';
      ctx.lineWidth = 1;
      for (let x = dx; x < dx + dw; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, dy); ctx.lineTo(x, dy + dh); ctx.stroke();
      }
      for (let y = dy; y < dy + dh; y += 20) {
        ctx.beginPath(); ctx.moveTo(dx, y); ctx.lineTo(dx + dw, y); ctx.stroke();
      }
      // 斜めの光
      const cg = ctx.createLinearGradient(dx, dy, dx + dw, dy + dh);
      cg.addColorStop(0, 'rgba(0,255,255,0.0)');
      cg.addColorStop(0.5, 'rgba(0,255,255,0.08)');
      cg.addColorStop(1, 'rgba(255,0,255,0.0)');
      ctx.fillStyle = cg;
      ctx.fillRect(dx, dy, dw, dh);

    } else if (style === 'kawaii') {
      ctx.fillStyle = '#fff0f5';
      ctx.fillRect(dx, dy, dw, dh);
      // ハートを散りばめる
      const hearts = [[cx-30,cy-20],[cx+25,cy-30],[cx-20,cy+25],[cx+30,cy+20],[cx,cy-35]];
      hearts.forEach(([hx, hy]) => {
        ctx.fillStyle = 'rgba(255,182,193,0.5)';
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('♥', hx, hy);
      });
      // 波線枠
      ctx.strokeStyle = '#ff69b4';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(dx + 6, dy + 6, dw - 12, dh - 12);
      ctx.setLineDash([]);

    } else if (style === 'minimal') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(dx, dy, dw, dh);
      // 細いシングルライン
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      ctx.strokeRect(dx + 10, dy + 10, dw - 20, dh - 20);
      // 下部アンダーライン
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy + dh * 0.3);
      ctx.lineTo(cx + 30, cy + dh * 0.3);
      ctx.stroke();

    } else if (style === 'gold') {
      ctx.fillStyle = '#0a0800';
      ctx.fillRect(dx, dy, dw, dh);
      // ゴールドの二重枠
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 3;
      ctx.strokeRect(dx + 4, dy + 4, dw - 8, dh - 8);
      ctx.strokeStyle = '#ffe566';
      ctx.lineWidth = 1;
      ctx.strokeRect(dx + 10, dy + 10, dw - 20, dh - 20);
      // 四隅の装飾
      const corners = [[dx+4,dy+4],[dx+dw-4,dy+4],[dx+4,dy+dh-4],[dx+dw-4,dy+dh-4]];
      corners.forEach(([cx2,cy2]) => {
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.arc(cx2, cy2, 4, 0, Math.PI*2);
        ctx.fill();
      });

    } else if (style === 'neon') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(dx, dy, dw, dh);
      // ネオン枠（二重グロー）
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#39ff14';
      ctx.strokeStyle = '#39ff14';
      ctx.lineWidth = 2;
      ctx.strokeRect(dx + 6, dy + 6, dw - 12, dh - 12);
      ctx.shadowColor = '#ff00ff';
      ctx.strokeStyle = '#ff00ff';
      ctx.lineWidth = 1;
      ctx.strokeRect(dx + 12, dy + 12, dw - 24, dh - 24);
      ctx.shadowBlur = 0;

    } else if (style === 'nature') {
      ctx.fillStyle = '#f1f8f1';
      ctx.fillRect(dx, dy, dw, dh);
      // 葉っぱの装飾
      ctx.fillStyle = 'rgba(46,204,113,0.2)';
      [[cx-35,cy+10],[cx+35,cy-10],[cx-10,cy+30],[cx+10,cy-30]].forEach(([lx,ly]) => {
        ctx.beginPath();
        ctx.ellipse(lx, ly, 12, 6, Math.PI/4, 0, Math.PI*2);
        ctx.fill();
      });
      ctx.strokeStyle = '#2ecc71';
      ctx.lineWidth = 2;
      ctx.strokeRect(dx + 6, dy + 6, dw - 12, dh - 12);

    } else if (style === 'gradient') {
      const gg = ctx.createLinearGradient(dx, dy, dx + dw, dy + dh);
      gg.addColorStop(0, '#7c3aed');
      gg.addColorStop(0.4, '#db2777');
      gg.addColorStop(1, '#2563eb');
      ctx.fillStyle = gg;
      ctx.fillRect(dx, dy, dw, dh);
      // 光沢ライン
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(dx, dy + dh * 0.2);
      ctx.lineTo(dx + dw, dy);
      ctx.stroke();

    } else if (style === 'vintage') {
      ctx.fillStyle = '#f5e6c8';
      ctx.fillRect(dx, dy, dw, dh);
      // ざらつき風の点描
      ctx.fillStyle = 'rgba(92,61,30,0.04)';
      for (let i = 0; i < 200; i++) {
        ctx.fillRect(dx + Math.random()*dw, dy + Math.random()*dh, 2, 2);
      }
      // クラシック枠
      ctx.strokeStyle = '#8b5e3c';
      ctx.lineWidth = 3;
      ctx.strokeRect(dx + 5, dy + 5, dw - 10, dh - 10);
      ctx.strokeStyle = '#c8a96a';
      ctx.lineWidth = 1;
      ctx.strokeRect(dx + 11, dy + 11, dw - 22, dh - 22);

    } else if (style === 'popart') {
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(dx, dy, dw, dh);
      // ベン・デイドット風
      ctx.fillStyle = 'rgba(255,0,0,0.15)';
      for (let px = dx; px < dx + dw; px += 12) {
        for (let py = dy; py < dy + dh; py += 12) {
          ctx.beginPath();
          ctx.arc(px + 4, py + 4, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // 太い黒枠
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 5;
      ctx.strokeRect(dx + 4, dy + 4, dw - 8, dh - 8);

    } else if (style === 'anime') {
      ctx.fillStyle = '#0d0d2b';
      ctx.fillRect(dx, dy, dw, dh);
      // 星を散りばめる
      ctx.fillStyle = 'rgba(125,249,255,0.6)';
      [[cx-30,dy+14],[cx+25,dy+20],[cx-15,dy+dh-16],[cx+30,dy+dh-20],[cx,dy+10]].forEach(([sx,sy]) => {
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', sx, sy);
      });
      // ピンクのグロー枠
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ff6ec7';
      ctx.strokeStyle = '#ff6ec7';
      ctx.lineWidth = 2;
      ctx.strokeRect(dx + 6, dy + 6, dw - 12, dh - 12);
      ctx.shadowBlur = 0;

    } else if (style === 'military') {
      ctx.fillStyle = '#2d3a1e';
      ctx.fillRect(dx, dy, dw, dh);
      // カモフラ風パターン（不規則な楕円）
      const camo = ['#3a4a28','#4a5c30','#1e2a10','#2d3a1e'];
      for (let i = 0; i < 12; i++) {
        ctx.fillStyle = camo[i % camo.length];
        ctx.beginPath();
        ctx.ellipse(
          dx + (i * 31) % dw,
          dy + (i * 19) % dh,
          18 + (i % 3) * 8, 10 + (i % 2) * 6,
          (i * 0.5), 0, Math.PI * 2
        );
        ctx.fill();
      }
      // ステンシル風枠
      ctx.strokeStyle = '#c8b560';
      ctx.lineWidth = 3;
      ctx.strokeRect(dx + 5, dy + 5, dw - 10, dh - 10);

    } else if (style === 'typo') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(dx, dy, dw, dh);
      // 背景に薄い文字
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.font = 'bold 60px Helvetica, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(keyword[0] || 'A', cx, cy);
      // 赤いアクセントライン（上下）
      ctx.fillStyle = '#ff3300';
      ctx.fillRect(dx, dy, dw, 6);
      ctx.fillRect(dx, dy + dh - 6, dw, 6);

    } else if (style === 'monochrome') {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(dx, dy, dw, dh);
      // ハーフトーン風グラデーション
      const mg = ctx.createRadialGradient(cx, cy, 0, cx, cy, dh*0.5);
      mg.addColorStop(0, 'rgba(255,255,255,0.1)');
      mg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = mg;
      ctx.fillRect(dx, dy, dw, dh);
      // 白い細枠
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(dx + 8, dy + 8, dw - 16, dh - 16);
    }

    // ========== テキスト描画 ==========
    ctx.font = S.font;
    ctx.fillStyle = S.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // グロー系スタイル
    if (['cyberpunk','neon','anime'].includes(style)) {
      ctx.shadowBlur = 16;
      ctx.shadowColor = S.textColor;
    }
    // ポップアート：黒縁取り
    if (style === 'popart') {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
    }
    // ミリタリー：縁取り
    if (style === 'military') {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
    }

    // 折り返し処理
    const maxWidth = dw - 28;
    const chars = keyword.split('');
    let line = '';
    const lines: string[] = [];
    for (const ch of chars) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = ch; }
      else line = test;
    }
    lines.push(line);
    const lineH = 38;
    const startY = cy - ((lines.length - 1) * lineH) / 2;

    lines.forEach((l, i) => {
      const y = startY + i * lineH;
      if (style === 'popart' || style === 'military') ctx.strokeText(l, cx, y);
      ctx.fillText(l, cx, y);
    });

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    setMockupDataUrl(canvas.toDataURL('image/png'));
  }, [keyword, style, tshirtColor]);

  useEffect(() => {
    if (keyword) {
      const t = setTimeout(() => drawDesign(), 50);
      return () => clearTimeout(t);
    }
  }, [keyword, style, tshirtColor, drawDesign]);

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
