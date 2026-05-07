'use client'
import dynamic from 'next/dynamic'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Loader2, Settings, ExternalLink, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const STYLES = [
  { id: 'japanese', name: '和風・日の丸', emoji: '⛩️', bg: '#1a0000', textColor: '#c0392b', accent: '#ffffff', font: 'bold 28px serif' },
  { id: 'street',   name: 'ストリート',   emoji: '🏙️', bg: '#111111', textColor: '#ffdd00', accent: '#ffffff', font: 'bold 30px Impact, sans-serif' },
  { id: 'retro',    name: 'レトロ',       emoji: '📻', bg: '#2c1a0e', textColor: '#ff6b35', accent: '#f7c59f', font: 'bold 26px Georgia, serif' },
  { id: 'cyberpunk',name: 'サイバー',     emoji: '🌃', bg: '#000020', textColor: '#00ffff', accent: '#ff00ff', font: 'bold 28px monospace' },
  { id: 'kawaii',   name: 'かわいい',     emoji: '🎀', bg: '#fff0f5', textColor: '#ff69b4', accent: '#ffb7c5', font: 'bold 28px sans-serif' },
  { id: 'minimal',  name: 'ミニマル',     emoji: '⬜', bg: '#ffffff', textColor: '#111111', accent: '#888888', font: '300 28px Helvetica, sans-serif' },
  { id: 'gold',     name: 'ラグジュアリー',emoji: '💎', bg: '#0a0a00', textColor: '#d4af37', accent: '#ffe566', font: 'bold 26px Georgia, serif' },
  { id: 'neon',     name: 'ネオンサイン', emoji: '💡', bg: '#000000', textColor: '#39ff14', accent: '#ff00ff', font: 'bold 28px monospace' },
  { id: 'nature',   name: 'ボタニカル',   emoji: '🌿', bg: '#f1f8f1', textColor: '#2ecc71', accent: '#1a6b3a', font: 'bold 26px Georgia, serif' },
];

const TSHIRT_COLORS = [
  { id: 'white', name: '白',   hex: '#FFFFFF' },
  { id: 'black', name: '黒',   hex: '#1a1a1a' },
  { id: 'navy',  name: '紺',   hex: '#1e3a5f' },
  { id: 'gray',  name: 'グレー', hex: '#808080' },
  { id: 'red',   name: 'レッド', hex: '#e74c3c' },
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

  // APIキー設定
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [shopifyToken, setShopifyToken] = useState('');
  const [printifyShopId, setPrintifyShopId] = useState('');
  const [printifyToken, setPrintifyToken] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // localStorageからAPIキー読み込み
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const { shopifyDomain: sd, shopifyToken: st, printifyShopId: pid, printifyToken: pt } = JSON.parse(saved);
        if (sd) setShopifyDomain(sd);
        if (st) setShopifyToken(st);
        if (pid) setPrintifyShopId(pid);
        if (pt) setPrintifyToken(pt);
      }
    } catch {}
    fetchTrends();
  }, []);

  const saveSettings = () => {
    localStorage.setItem(LS_KEY, JSON.stringify({ shopifyDomain, shopifyToken, printifyShopId, printifyToken }));
    setShowSettings(false);
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
    const currentStyle = STYLES.find(s => s.id === style) || STYLES[0];
    const currentTColor = TSHIRT_COLORS.find(c => c.id === tshirtColor) || TSHIRT_COLORS[1];

    // 背景
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    // Tシャツシルエット
    ctx.fillStyle = currentTColor.hex;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.1);
    ctx.lineTo(w * 0.8, h * 0.1);
    ctx.lineTo(w * 0.95, h * 0.3);
    ctx.lineTo(w * 0.8, h * 0.35);
    ctx.lineTo(w * 0.8, h * 0.9);
    ctx.lineTo(w * 0.2, h * 0.9);
    ctx.lineTo(w * 0.2, h * 0.35);
    ctx.lineTo(w * 0.05, h * 0.3);
    ctx.closePath();
    ctx.fill();

    // デザインエリア（スタイル背景）
    const dx = w * 0.25, dy = h * 0.3, dw = w * 0.5, dh = h * 0.4;
    ctx.fillStyle = currentStyle.bg;
    ctx.beginPath();
    ctx.roundRect(dx, dy, dw, dh, 12);
    ctx.fill();

    // アクセントライン
    ctx.strokeStyle = currentStyle.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(dx + 4, dy + 4, dw - 8, dh - 8, 10);
    ctx.stroke();

    // キーワードテキスト
    ctx.font = currentStyle.font;
    ctx.fillStyle = currentStyle.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // テキストが長い場合は折り返し
    const maxWidth = dw - 24;
    const words = keyword.split('');
    let line = '';
    const lines: string[] = [];
    for (const char of words) {
      const testLine = line + char;
      if (ctx.measureText(testLine).width > maxWidth && line) {
        lines.push(line);
        line = char;
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    const lineHeight = 36;
    const startY = dy + dh / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((l, i) => ctx.fillText(l, w / 2, startY + i * lineHeight));

    // サイバーパンクはグロー効果
    if (style === 'cyberpunk' || style === 'neon') {
      ctx.shadowBlur = 12;
      ctx.shadowColor = currentStyle.textColor;
      lines.forEach((l, i) => ctx.fillText(l, w / 2, startY + i * lineHeight));
      ctx.shadowBlur = 0;
    }

    setMockupDataUrl(canvas.toDataURL('image/png'));
  }, [keyword, style, tshirtColor]);

  useEffect(() => {
    if (keyword) {
      const t = setTimeout(() => drawDesign(), 50);
      return () => clearTimeout(t);
    }
  }, [keyword, style, tshirtColor, drawDesign]);

  const hasApiKeys = shopifyDomain && shopifyToken && printifyShopId && printifyToken;

  const handlePublish = async () => {
    if (!hasApiKeys) {
      setShowSettings(true);
      return;
    }
    if (!mockupDataUrl) {
      alert('デザインを先に作成してください');
      return;
    }
    setIsPublishing(true);
    setPublishResult(null);
    try {
      const res = await fetch('/api/tools/shopify-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopifyDomain,
          shopifyToken,
          printifyShopId,
          printifyToken,
          keyword,
          style,
          imageBase64: mockupDataUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPublishResult({ url: data.productUrl });
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
          <Settings size={14} /> API設定
        </button>
      </div>

      {/* API設定パネル */}
      {showSettings && (
        <div className="bg-[#0d0e1a] border-2 border-emerald-500/30 rounded-3xl p-8 space-y-5 animate-in fade-in">
          <h3 className="text-white font-black text-lg uppercase italic">Shopify / Printify API設定</h3>
          <p className="text-slate-500 text-xs">設定はブラウザに保存されます（サーバーには送信されません）</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500">Shopifyドメイン</label>
              <input value={shopifyDomain} onChange={e => setShopifyDomain(e.target.value)}
                placeholder="yourshop.myshopify.com"
                className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-emerald-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500">Shopify Access Token</label>
              <input value={shopifyToken} onChange={e => setShopifyToken(e.target.value)}
                type="password" placeholder="shpat_xxxxxxxx"
                className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-emerald-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500">Printify Shop ID</label>
              <input value={printifyShopId} onChange={e => setPrintifyShopId(e.target.value)}
                placeholder="12345678"
                className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-emerald-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500">Printify API Token</label>
              <input value={printifyToken} onChange={e => setPrintifyToken(e.target.value)}
                type="password" placeholder="eyJ0eXAiOiJKV1Qi..."
                className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white text-sm outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={saveSettings}
              className="px-8 h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl transition-all">
              保存する
            </button>
            <button onClick={() => setShowSettings(false)}
              className="px-6 h-12 bg-white/5 text-slate-400 font-black text-sm rounded-xl transition-all">
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* APIキー未設定の警告 */}
      {!hasApiKeys && !showSettings && (
        <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl px-5 py-3">
          <AlertTriangle size={16} className="text-yellow-400 shrink-0" />
          <p className="text-yellow-400 text-xs font-bold">Shopify / Printify APIキーが未設定です。「API設定」ボタンから設定してください。</p>
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
              className="text-xs text-slate-400 hover:text-white font-bold border border-white/10 px-4 py-2 rounded-xl transition-all">
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
              <div className="flex gap-3">
                {TSHIRT_COLORS.map(c => (
                  <button key={c.id} onClick={() => setTshirtColor(c.id)}
                    title={c.name}
                    className={'w-12 h-12 rounded-xl border-4 transition-all ' + (tshirtColor === c.id ? 'border-emerald-500 scale-110' : 'border-white/5')}
                    style={{ backgroundColor: c.hex }} />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 italic">スタイルパレット</label>
              <div className="grid grid-cols-3 gap-2">
                {STYLES.map(s => (
                  <button key={s.id} onClick={() => setStyle(s.id)}
                    className={'py-3 rounded-xl text-[10px] font-black uppercase italic border-2 transition-all ' +
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
              {isPublishing ? <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" /> 出品中...</span> : 'SHOPIFY 出品 🚀'}
            </button>

            {!hasApiKeys && (
              <p className="text-center text-yellow-400 text-xs font-bold">* 出品にはAPIキーの設定が必要です</p>
            )}
          </div>
          <div className="bg-[#13141f] rounded-[2.5rem] border-2 border-white/5 p-10 flex justify-center items-center relative">
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
