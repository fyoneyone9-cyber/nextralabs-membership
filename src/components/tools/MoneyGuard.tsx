'use client'
import AffiliateBanner from '@/components/affiliate/AffiliateBanner'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { AlertTriangle, Copy, CheckCircle2, ExternalLink, Camera, X, ShoppingBag, Smartphone, Coffee, Shirt, Gamepad2, UtensilsCrossed, Wine, Zap } from 'lucide-react'

// ── プリセット定義 ──────────────────────────────────────────
const PRESETS = [
  {
    category: '衝動買い',
    color: '#ef4444',
    items: [
      { label: 'セール品を大量購入',       icon: ShoppingBag,     text: 'セールにつられて必要かどうか分からないものをカートに入れています。「今だけ」という言葉に弱いです。' },
      { label: 'SNSで見て欲しくなった',   icon: Smartphone,      text: 'InstagramやTikTokで見た商品が気になって購入しようとしています。数分前に見ただけで欲しくなりました。' },
      { label: 'ゲーム課金したい',         icon: Gamepad2,        text: 'スマホゲームに課金しようとしています。「このアイテムを買えば強くなれる」と感じています。' },
    ],
  },
  {
    category: '食費・外食',
    color: '#f59e0b',
    items: [
      { label: 'コンビニで無駄買い',        icon: Coffee,          text: 'コンビニに立ち寄ってスイーツや飲み物を余計に買おうとしています。お腹は空いていません。' },
      { label: 'デリバリーを頼みたい',      icon: UtensilsCrossed, text: '料理が面倒でフードデリバリーを注文しようとしています。家に食材はあります。' },
      { label: 'お酒を追加購入',            icon: Wine,            text: 'もうお酒が手元にあるのに、さらに購入しようとしています。ストレス発散が目的です。' },
    ],
  },
  {
    category: 'ファッション・ガジェット',
    color: '#8b5cf6',
    items: [
      { label: '洋服をまた買いたい',        icon: Shirt,           text: 'クローゼットがいっぱいなのに新しい服を購入しようとしています。「今の気分に合う服がない」と感じています。' },
      { label: '新型スマホに機種変したい',  icon: Smartphone,      text: '今のスマホは動いているのに新型に変えたくなっています。スペック差はほぼ気にならないレベルです。' },
      { label: 'ガジェット・家電を衝動買い', icon: Zap,            text: '特に今困っているわけではないのに、新しいガジェットや家電が欲しくなっています。' },
    ],
  },
]

const MasterEngine = () => {
  const [inputText, setInputText] = useState('');
  const [riskScore, setRiskScore] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [appraisalResult, setAppraisalResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [lastUsage, setLastUsage] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('last_usage_money_guard');
    if (saved) setLastUsage(parseInt(saved));
  }, []);

  const isLimitReached = () => {
    if (!lastUsage) return false;
    const now = new Date();
    const last = new Date(lastUsage);
    return now.toDateString() === last.toDateString();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLimitReached()) {
      alert("1日の利用制限に達しました。家計防衛のため、続きは明日までお待ちください。");
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      setFileName(file.name);
      const now = Date.now();
      setLastUsage(now);
      localStorage.setItem('last_usage_money_guard', now.toString());
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = `money-guard-evidence.png`;
      link.click();
    }
  };

  const FINAL_PROMPT = `【最優先：添付された画像を解析してください】
あなたはプロの金融・防犯コンサルタントです。
今添付した【レシート/明細/商品画像】を隅々まで分析し、以下の【状況メモ】と合わせて、私の無駄遣いを全力で止めてください。

【状況メモ】: ${inputText || "（添付画像の内容をメインに解析してください）"}

以下の項目で回答してください：
1. 【リスクスコア】: 0-100で判定（高いほど危険）
2. 【心理的弱点】: 画像から読み取れる、私が今陥っている「買い物の罠」
3. 【防衛アドバイス】: 今すぐスマホを置いて、この購入を止めるための具体的な3つのアクション`;

  if (!isClient) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left my-2 md:my-4">

      {/* ヘッダー */}
      <div className="text-center space-y-3 md:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-400">Psychological Defense Command v7.0-MASTER</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.15]">
          AI家計防衛<span className="text-emerald-400">シミュレーター</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          「また買っちゃった…」を<span className="text-emerald-400 font-semibold">AIが未然に防ぐ</span>心理防衛ツール。<br />
          レシートや衝動の瞬間を記録して、購入ボタンを押す前に<strong className="text-white">冷静な判断</strong>を取り戻しましょう。
        </p>
      </div>

      {/* プリセット */}
      <div className="bg-[#13141f] border border-white/5 rounded-2xl p-5 md:p-7 space-y-4">
        <div className="flex items-center gap-2">
          <ShoppingBag size={14} className="text-emerald-400" />
          <p className="text-xs font-semibold text-white">よくある無駄遣いシーンから選ぶ</p>
          <span className="text-[10px] text-slate-600 ml-auto">タップで自動入力</span>
        </div>
        {PRESETS.map(cat => (
          <div key={cat.category} className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest px-0.5" style={{ color: cat.color }}>{cat.category}</p>
            <div className="flex flex-wrap gap-2">
              {cat.items.map(item => {
                const Icon = item.icon
                const isSelected = inputText === item.text
                return (
                  <button
                    key={item.label}
                    onClick={() => setInputText(isSelected ? '' : item.text)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'text-slate-950 border-transparent'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                    style={isSelected ? { background: cat.color, borderColor: cat.color } : {}}
                  >
                    <Icon size={12} />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#13141f] border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        {/* 使い方 */}
        <div className="bg-[#0a0b14] border border-white/5 rounded-xl p-5 mb-8 flex items-start gap-4">
          <div className="w-8 h-8 rounded-full border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 font-bold text-sm">!</div>
          <div className="space-y-1.5 text-sm text-slate-400 leading-relaxed">
            <p><span className="text-emerald-400 font-semibold mr-2">#1</span>レシートや明細を撮影してアップロード（自動で保存されます）</p>
            <p><span className="text-emerald-400 font-semibold mr-2">#2</span>防衛指示をコピー。AIに<strong className="text-white">画像を添付</strong>してこの指示を投げる</p>
            <p><span className="text-emerald-400 font-semibold mr-2">#3</span>AIのアドバイス結果を右のエリアに戻す</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* 左：アップロード＋コピー */}
          <div className="space-y-4">
            {!image ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-white/10 rounded-2xl aspect-video flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 hover:border-emerald-500/30 transition-all bg-black/20"
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" capture="environment" />
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                  <Camera className="w-7 h-7 text-slate-500" />
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-slate-300">タップしてスキャン</p>
                  <p className="text-xs text-slate-500 mt-1">レシート / 明細書</p>
                </div>
              </div>
            ) : (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black">
                <img src={image} alt="Evidence" className="object-contain w-full h-full p-4" />
                <button
                  onClick={() => { setImage(null); setFileName(null); }}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-emerald-600 p-2 rounded-full text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 bg-emerald-500/90 text-slate-950 font-medium text-xs px-3 py-1 rounded-full">
                  画像保存済み
                </div>
              </div>
            )}

            <div className="space-y-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="購入の言い訳や迷いを打ち込んでください..."
                className="w-full h-28 bg-[#0a0b14] border border-white/5 rounded-xl p-4 text-sm text-white focus:border-emerald-500/50 outline-none resize-none transition-all"
              />
              <button
                onClick={() => { navigator.clipboard.writeText(FINAL_PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className={`w-full h-12 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm ${
                  copied
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                }`}
              >
                {copied
                  ? <><CheckCircle2 className="w-4 h-4" /> コピーしました！</>
                  : <><Copy className="w-4 h-4" /> 防衛指示をコピー</>
                }
              </button>

              {/* AIリンク */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'ChatGPT', url: 'https://chatgpt.com' },
                  { label: 'Gemini', url: 'https://gemini.google.com' },
                  { label: 'Claude', url: 'https://claude.ai' },
                ].map(ai => (
                  <button
                    key={ai.label}
                    onClick={() => window.open(ai.url, '_blank')}
                    className="flex items-center justify-center gap-1.5 h-10 bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-all"
                  >
                    <ExternalLink className="w-3 h-3" /> {ai.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右：分析結果 */}
          <div className="bg-[#0a0b14] rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <AlertTriangle className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">分析結果を戻す</h3>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-slate-500 mb-0.5">Dopamine Risk</p>
                <p className="text-2xl font-bold text-white">{riskScore}%</p>
              </div>
            </div>

            <textarea
              value={appraisalResult}
              onChange={(e) => setAppraisalResult(e.target.value)}
              placeholder="AIからのアドバイスをペースト..."
              className="flex-1 bg-[#13141f] border border-white/5 rounded-xl p-5 text-sm text-slate-300 focus:border-emerald-500/50 outline-none resize-none min-h-[320px] leading-relaxed transition-all"
            />

            {appraisalResult && (
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" /> 防衛シーケンス起動
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  警告：脳がドーパミンに支配されています！<br />
                  今すぐブラウザを閉じ、このレポートを3回読み直してください。<br />
                  冷静になるまで購入ボタンを押すことは許可されません。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NoSSRWrapper = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });

export default function MoneyGuard() {
  const router = useRouter()

  // ブラウザバック・マウスサイドボタン対応
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      const ok = window.confirm('ツールを終了しますか？')
      if (ok) {
        router.push('/dashboard')
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  // タブ閉じ・URL直打ち対応
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleBack = useCallback(() => {
    const ok = window.confirm('ツールを終了しますか？')
    if (ok) router.push('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 font-sans p-4 md:p-10 overflow-x-hidden text-left">
      <NoSSRWrapper />
    
      {/* Amazonアフィリエイト */}
      <AffiliateBanner toolId="money-guard" />
</div>
  );
}
