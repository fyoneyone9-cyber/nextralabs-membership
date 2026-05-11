'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { AlertTriangle, Copy, CheckCircle2, ExternalLink, Camera, X, ShoppingBag, Smartphone, Coffee, Shirt, Gamepad2, UtensilsCrossed, Wine, Zap } from 'lucide-react'

// 笏笏 繝励Μ繧ｻ繝・ヨ螳夂ｾｩ 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
const PRESETS = [
  {
    category: '陦晏虚雋ｷ縺・,
    color: '#ef4444',
    items: [
      { label: '繧ｻ繝ｼ繝ｫ蜩√ｒ螟ｧ驥剰ｳｼ蜈･',       icon: ShoppingBag,     text: '繧ｻ繝ｼ繝ｫ縺ｫ縺､繧峨ｌ縺ｦ蠢・ｦ√°縺ｩ縺・°蛻・°繧峨↑縺・ｂ縺ｮ繧偵き繝ｼ繝医↓蜈･繧後※縺・∪縺吶ゅ御ｻ翫□縺代阪→縺・≧險闡峨↓蠑ｱ縺・〒縺吶・ },
      { label: 'SNS縺ｧ隕九※谺ｲ縺励￥縺ｪ縺｣縺・,   icon: Smartphone,      text: 'Instagram繧УikTok縺ｧ隕九◆蝠・刀縺梧ｰ励↓縺ｪ縺｣縺ｦ雉ｼ蜈･縺励ｈ縺・→縺励※縺・∪縺吶よ焚蛻・燕縺ｫ隕九◆縺縺代〒谺ｲ縺励￥縺ｪ繧翫∪縺励◆縲・ },
      { label: '繧ｲ繝ｼ繝隱ｲ驥代＠縺溘＞',         icon: Gamepad2,        text: '繧ｹ繝槭・繧ｲ繝ｼ繝縺ｫ隱ｲ驥代＠繧医≧縺ｨ縺励※縺・∪縺吶ゅ後％縺ｮ繧｢繧､繝・Β繧定ｲｷ縺医・蠑ｷ縺上↑繧後ｋ縲阪→諢溘§縺ｦ縺・∪縺吶・ },
    ],
  },
  {
    category: '鬟溯ｲｻ繝ｻ螟夜｣・,
    color: '#f59e0b',
    items: [
      { label: '繧ｳ繝ｳ繝薙ル縺ｧ辟｡鬧・ｲｷ縺・,        icon: Coffee,          text: '繧ｳ繝ｳ繝薙ル縺ｫ遶九■蟇・▲縺ｦ繧ｹ繧､繝ｼ繝・ｄ鬟ｲ縺ｿ迚ｩ繧剃ｽ呵ｨ医↓雋ｷ縺翫≧縺ｨ縺励※縺・∪縺吶ゅ♀閻ｹ縺ｯ遨ｺ縺・※縺・∪縺帙ｓ縲・ },
      { label: '繝・Μ繝舌Μ繝ｼ繧帝ｼ縺ｿ縺溘＞',      icon: UtensilsCrossed, text: '譁咏炊縺碁擇蛟偵〒繝輔・繝峨ョ繝ｪ繝舌Μ繝ｼ繧呈ｳｨ譁・＠繧医≧縺ｨ縺励※縺・∪縺吶ょｮｶ縺ｫ鬟滓攝縺ｯ縺ゅｊ縺ｾ縺吶・ },
      { label: '縺企・繧定ｿｽ蜉雉ｼ蜈･',            icon: Wine,            text: '繧ゅ≧縺企・縺梧焔蜈・↓縺ゅｋ縺ｮ縺ｫ縲√＆繧峨↓雉ｼ蜈･縺励ｈ縺・→縺励※縺・∪縺吶ゅせ繝医Ξ繧ｹ逋ｺ謨｣縺檎岼逧・〒縺吶・ },
    ],
  },
  {
    category: '繝輔ぃ繝・す繝ｧ繝ｳ繝ｻ繧ｬ繧ｸ繧ｧ繝・ヨ',
    color: '#8b5cf6',
    items: [
      { label: '豢区恪繧偵∪縺溯ｲｷ縺・◆縺・,        icon: Shirt,           text: '繧ｯ繝ｭ繝ｼ繧ｼ繝・ヨ縺後＞縺｣縺ｱ縺・↑縺ｮ縺ｫ譁ｰ縺励＞譛阪ｒ雉ｼ蜈･縺励ｈ縺・→縺励※縺・∪縺吶ゅ御ｻ翫・豌怜・縺ｫ蜷医≧譛阪′縺ｪ縺・阪→諢溘§縺ｦ縺・∪縺吶・ },
      { label: '譁ｰ蝙九せ繝槭・縺ｫ讖溽ｨｮ螟峨＠縺溘＞',  icon: Smartphone,      text: '莉翫・繧ｹ繝槭・縺ｯ蜍輔＞縺ｦ縺・ｋ縺ｮ縺ｫ譁ｰ蝙九↓螟峨∴縺溘￥縺ｪ縺｣縺ｦ縺・∪縺吶ゅせ繝壹ャ繧ｯ蟾ｮ縺ｯ縺ｻ縺ｼ豌励↓縺ｪ繧峨↑縺・Ξ繝吶Ν縺ｧ縺吶・ },
      { label: '繧ｬ繧ｸ繧ｧ繝・ヨ繝ｻ螳ｶ髮ｻ繧定｡晏虚雋ｷ縺・, icon: Zap,            text: '迚ｹ縺ｫ莉雁峅縺｣縺ｦ縺・ｋ繧上￠縺ｧ縺ｯ縺ｪ縺・・縺ｫ縲∵眠縺励＞繧ｬ繧ｸ繧ｧ繝・ヨ繧・ｮｶ髮ｻ縺梧ｬｲ縺励￥縺ｪ縺｣縺ｦ縺・∪縺吶・ },
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
      alert("1譌･縺ｮ蛻ｩ逕ｨ蛻ｶ髯舌↓驕斐＠縺ｾ縺励◆縲ょｮｶ險磯亟陦帙・縺溘ａ縲∫ｶ壹″縺ｯ譏取律縺ｾ縺ｧ縺雁ｾ・■縺上□縺輔＞縲・);
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

  const FINAL_PROMPT = `縲先怙蜆ｪ蜈茨ｼ壽ｷｻ莉倥＆繧後◆逕ｻ蜒上ｒ隗｣譫舌＠縺ｦ縺上□縺輔＞縲・
縺ゅ↑縺溘・繝励Ο縺ｮ驥題檮繝ｻ髦ｲ迥ｯ繧ｳ繝ｳ繧ｵ繝ｫ繧ｿ繝ｳ繝医〒縺吶・
莉頑ｷｻ莉倥＠縺溘舌Ξ繧ｷ繝ｼ繝・譏守ｴｰ/蝠・刀逕ｻ蜒上代ｒ髫・・∪縺ｧ蛻・梵縺励∽ｻ･荳九・縲千憾豕√Γ繝｢縲代→蜷医ｏ縺帙※縲∫ｧ√・辟｡鬧・▲縺・ｒ蜈ｨ蜉帙〒豁｢繧√※縺上□縺輔＞縲・

縲千憾豕√Γ繝｢縲・ ${inputText || "・域ｷｻ莉倡判蜒上・蜀・ｮｹ繧偵Γ繧､繝ｳ縺ｫ隗｣譫舌＠縺ｦ縺上□縺輔＞・・}

莉･荳九・鬆・岼縺ｧ蝗樒ｭ斐＠縺ｦ縺上□縺輔＞・・
1. 縲舌Μ繧ｹ繧ｯ繧ｹ繧ｳ繧｢縲・ 0-100縺ｧ蛻､螳夲ｼ磯ｫ倥＞縺ｻ縺ｩ蜊ｱ髯ｺ・・
2. 縲仙ｿ・炊逧・ｼｱ轤ｹ縲・ 逕ｻ蜒上°繧芽ｪｭ縺ｿ蜿悶ｌ繧九∫ｧ√′莉企勍縺｣縺ｦ縺・ｋ縲瑚ｲｷ縺・黄縺ｮ鄂縲・
3. 縲宣亟陦帙い繝峨ヰ繧､繧ｹ縲・ 莉翫☆縺舌せ繝槭・繧堤ｽｮ縺・※縲√％縺ｮ雉ｼ蜈･繧呈ｭ｢繧√ｋ縺溘ａ縺ｮ蜈ｷ菴鍋噪縺ｪ3縺､縺ｮ繧｢繧ｯ繧ｷ繝ｧ繝ｳ`;

  if (!isClient) return null;

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-10 space-y-6 md:space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-[#050507] text-left my-2 md:my-4">

      {/* 繝倥ャ繝繝ｼ */}
      <div className="text-center space-y-3 md:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-emerald-400">Psychological Defense Command v7.0-MASTER</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.15]">
          AI螳ｶ險磯亟陦・span className="text-emerald-400">繧ｷ繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          縲後∪縺溯ｲｷ縺｣縺｡繧・▲縺溪ｦ縲阪ｒ<span className="text-emerald-400 font-semibold">AI縺梧悴辟ｶ縺ｫ髦ｲ縺・/span>蠢・炊髦ｲ陦帙ヤ繝ｼ繝ｫ縲・br />
          繝ｬ繧ｷ繝ｼ繝医ｄ陦晏虚縺ｮ迸ｬ髢薙ｒ險倬鹸縺励※縲∬ｳｼ蜈･繝懊ち繝ｳ繧呈款縺吝燕縺ｫ<strong className="text-white">蜀ｷ髱吶↑蛻､譁ｭ</strong>繧貞叙繧頑綾縺励∪縺励ｇ縺・・
        </p>
      </div>

      {/* 繝励Μ繧ｻ繝・ヨ */}
      <div className="bg-[#13141f] border border-white/5 rounded-2xl p-5 md:p-7 space-y-4">
        <div className="flex items-center gap-2">
          <ShoppingBag size={14} className="text-emerald-400" />
          <p className="text-xs font-semibold text-white">繧医￥縺ゅｋ辟｡鬧・▲縺・す繝ｼ繝ｳ縺九ｉ驕ｸ縺ｶ</p>
          <span className="text-[10px] text-slate-600 ml-auto">繧ｿ繝・・縺ｧ閾ｪ蜍募・蜉・/span>
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

        {/* 菴ｿ縺・婿 */}
        <div className="bg-[#0a0b14] border border-white/5 rounded-xl p-5 mb-8 flex items-start gap-4">
          <div className="w-8 h-8 rounded-full border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 font-bold text-sm">!</div>
          <div className="space-y-1.5 text-sm text-slate-400 leading-relaxed">
            <p><span className="text-emerald-400 font-semibold mr-2">#1</span>繝ｬ繧ｷ繝ｼ繝医ｄ譏守ｴｰ繧呈聴蠖ｱ縺励※繧｢繝・・繝ｭ繝ｼ繝会ｼ郁・蜍輔〒菫晏ｭ倥＆繧後∪縺呻ｼ・/p>
            <p><span className="text-emerald-400 font-semibold mr-2">#2</span>髦ｲ陦帶欠遉ｺ繧偵さ繝斐・縲・I縺ｫ<strong className="text-white">逕ｻ蜒上ｒ豺ｻ莉・/strong>縺励※縺薙・謖・､ｺ繧呈兜縺偵ｋ</p>
            <p><span className="text-emerald-400 font-semibold mr-2">#3</span>AI縺ｮ繧｢繝峨ヰ繧､繧ｹ邨先棡繧貞承縺ｮ繧ｨ繝ｪ繧｢縺ｫ謌ｻ縺・/p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* 蟾ｦ・壹い繝・・繝ｭ繝ｼ繝会ｼ九さ繝斐・ */}
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
                  <p className="text-base font-semibold text-slate-300">繧ｿ繝・・縺励※繧ｹ繧ｭ繝｣繝ｳ</p>
                  <p className="text-xs text-slate-500 mt-1">繝ｬ繧ｷ繝ｼ繝・/ 譏守ｴｰ譖ｸ</p>
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
                  逕ｻ蜒丈ｿ晏ｭ俶ｸ医∩
                </div>
              </div>
            )}

            <div className="space-y-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="雉ｼ蜈･縺ｮ險縺・ｨｳ繧・ｿｷ縺・ｒ謇薙■霎ｼ繧薙〒縺上□縺輔＞..."
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
                  ? <><CheckCircle2 className="w-4 h-4" /> 繧ｳ繝斐・縺励∪縺励◆・・/>
                  : <><Copy className="w-4 h-4" /> 髦ｲ陦帶欠遉ｺ繧偵さ繝斐・</>
                }
              </button>

              {/* AI繝ｪ繝ｳ繧ｯ */}
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

          {/* 蜿ｳ・壼・譫千ｵ先棡 */}
          <div className="bg-[#0a0b14] rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <AlertTriangle className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">蛻・梵邨先棡繧呈綾縺・/h3>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-slate-500 mb-0.5">Dopamine Risk</p>
                <p className="text-2xl font-bold text-white">{riskScore}%</p>
              </div>
            </div>

            <textarea
              value={appraisalResult}
              onChange={(e) => setAppraisalResult(e.target.value)}
              placeholder="AI縺九ｉ縺ｮ繧｢繝峨ヰ繧､繧ｹ繧偵・繝ｼ繧ｹ繝・.."
              className="flex-1 bg-[#13141f] border border-white/5 rounded-xl p-5 text-sm text-slate-300 focus:border-emerald-500/50 outline-none resize-none min-h-[320px] leading-relaxed transition-all"
            />

            {appraisalResult && (
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" /> 髦ｲ陦帙す繝ｼ繧ｱ繝ｳ繧ｹ襍ｷ蜍・
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  隴ｦ蜻奇ｼ夊┻縺後ラ繝ｼ繝代Α繝ｳ縺ｫ謾ｯ驟阪＆繧後※縺・∪縺呻ｼ・br />
                  莉翫☆縺舌ヶ繝ｩ繧ｦ繧ｶ繧帝哩縺倥√％縺ｮ繝ｬ繝昴・繝医ｒ3蝗櫁ｪｭ縺ｿ逶ｴ縺励※縺上□縺輔＞縲・br />
                  蜀ｷ髱吶↓縺ｪ繧九∪縺ｧ雉ｼ蜈･繝懊ち繝ｳ繧呈款縺吶％縺ｨ縺ｯ險ｱ蜿ｯ縺輔ｌ縺ｾ縺帙ｓ縲・
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

  // 繝悶Λ繧ｦ繧ｶ繝舌ャ繧ｯ繝ｻ繝槭え繧ｹ繧ｵ繧､繝峨・繧ｿ繝ｳ蟇ｾ蠢・  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      const ok = window.confirm('繝・・繝ｫ繧堤ｵゆｺ・＠縺ｾ縺吶°・・)
      if (ok) {
        router.push('/dashboard')
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [router])

  // 繧ｿ繝夜哩縺倥・URL逶ｴ謇薙■蟇ｾ蠢・  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleBack = useCallback(() => {
    const ok = window.confirm('繝・・繝ｫ繧堤ｵゆｺ・＠縺ｾ縺吶°・・)
    if (ok) router.push('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-[#050507] text-gray-100 font-sans p-4 md:p-10 overflow-x-hidden text-left">
      <NoSSRWrapper />
    </div>
  );
}
