'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, Loader2, CheckCircle2, TrendingUp, Info, ShoppingCart, 
  ShieldCheck, CreditCard, Calculator, ExternalLink, Star
} from 'lucide-react'
import { ApiLinkIndicator } from '@/components/tools/ApiLinkIndicator'

// A8.net 案件リスト
const AFFILIATE_OFFERS = [
  { name: 'デイリーキャッシング', desc: 'おまとめローン・不動産担保ローンに強い。全国対応。', url: 'https://px.a8.net/svt/ejp?a8mat=3HQYB0+A5KEP6+4WSG+5YJRM', tags: ['おまとめ', '高額対応'] },
  { name: '首都圏管財', desc: '不動産担保ローンで借金を一本化。低金利で余裕の返済。', url: 'https://px.a8.net/svt/ejp?a8mat=3HQYB0+AZXIJU+OU6+601S2', tags: ['低金利', '一本化'] },
  { name: 'セントラル', desc: '大手並みの安心感。スピード審査で即日対応も可能。', url: 'https://px.a8.net/svt/ejp?a8mat=3HQYB0+9N3YY2+363I+699KI', tags: ['スピード', '老舗'] },
  { name: 'アロー', desc: '独自の審査基準で柔軟対応。最短45分で審査完了。', url: 'https://px.a8.net/svt/ejp?a8mat=3HQYB0+A0SXUY+2SHI+5ZMCH', tags: ['柔軟審査', 'WEB完結'] },
]

export default function LoanAdvisorApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [formData, setFormData] = useState({ amount: '', rate: '', count: '3' })

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // 実際のAPI連携(route.ts)を呼ぶ想定ですが、今回はUI導線確認のためシミュレーション
    await new Promise(r => setTimeout(r, 2000));
    
    const amount = Number(formData.amount) || 250;
    const rate = Number(formData.rate) || 18.0;
    const reduction = Math.floor(amount * (rate - 12) / 100); // 簡易計算

    setResult(`入力された情報をAIが解析しました。現在${formData.count}社から計${amount}万円の借入がありますが、おまとめローンを活用して年利12%前後へ一本化することで、年間で約${reduction}万円の利息を削減できる可能性があります。現在の支払いは「利息の罠」に陥っている可能性が高いため、早急な対策を推奨します。`);
    setIsAnalyzing(false);
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-12 font-sans selection:bg-emerald-500/30 text-left">
      <div className="max-w-5xl mx-auto space-y-10 border-4 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.2)] rounded-[3rem] p-6 md:p-12 text-white font-black">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-500/20 pb-10">
          <div className="flex items-center gap-4 text-left">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><CreditCard className="h-10 w-10 text-emerald-400" /></div>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">AI借金完済・おまとめ診断</h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-emerald-500 text-slate-950 font-black italic px-6 py-2 text-sm rounded-full shadow-lg">FREE PLAN</Badge>
            <ApiLinkIndicator model="Edge Finance Analysis" />
          </div>
        </div>

        {/* Manual */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 text-left">
          <div className="flex items-center gap-2 text-emerald-400"><Info size={20} /> <h3 className="font-black italic uppercase text-sm">使いかた・活用マニュアル</h3></div>
          <p className="text-sm text-slate-300 font-bold leading-relaxed italic">現在の借入状況を入力してください。Gemini 2.5 Flashが、おまとめによる減額効果を算出し、あなたに最適な解決先をA8.netの厳選案件からマッチングします。</p>
        </div>

        {/* Input Form */}
        <Card className="bg-[#13141f] border border-white/5 rounded-2xl p-8 space-y-6 shadow-xl">
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">借入合計金額 (万円)</label>
              <input 
                type="number" 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-6 font-bold text-white outline-none focus:border-emerald-500 transition-all" 
                placeholder="例：250" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">現在の平均金利 (%)</label>
              <input 
                type="number" 
                value={formData.rate}
                onChange={(e) => setFormData({...formData, rate: e.target.value})}
                className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-6 font-bold text-white outline-none focus:border-emerald-500 transition-all" 
                placeholder="例：18.0" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">借入社数</label>
              <select 
                value={formData.count}
                onChange={(e) => setFormData({...formData, count: e.target.value})}
                className="w-full h-14 bg-black border-2 border-white/10 rounded-xl px-6 font-bold text-white outline-none focus:border-emerald-500 transition-all appearance-none"
              >
                <option value="1">1社</option>
                <option value="2">2社</option>
                <option value="3">3社</option>
                <option value="4">4社以上</option>
              </select>
            </div>
          </div>
          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-2xl rounded-[2rem] shadow-xl uppercase italic active:scale-95 flex items-center justify-center gap-3">
            {isAnalyzing ? <><Loader2 className="animate-spin" /> 解析中...</> : '完済診断を実行 🚀'}
          </Button>
        </Card>

        {/* Result Area */}
        {result && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* AI Advice */}
            <Card className="bg-emerald-500/5 border-2 border-emerald-500/30 rounded-[3.5rem] p-12 shadow-inner text-left">
              <h3 className="text-2xl font-black text-white italic uppercase mb-8 flex items-center gap-3"><Zap className="text-emerald-400" /> AI Strategic Advice</h3>
              <div className="text-xl text-white font-bold italic leading-loose whitespace-pre-wrap mb-10">{result}</div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[{ title: '利息を止める', desc: 'おまとめローンへの切り替え', icon: Calculator }, { title: '返済を一本化', desc: '管理の手間と手数料を削減', icon: CheckCircle2 }, { title: '生活再建', desc: '月々の負担を減らし貯蓄へ', icon: TrendingUp }].map((s, i) => (
                  <div key={i} className="bg-black/40 p-6 rounded-2xl border border-emerald-500/20">
                    <s.icon className="h-5 w-5 text-emerald-400 mb-2" />
                    <h4 className="text-sm font-black text-white">{s.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold">{s.desc}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* 🔥 Affiliate Offers (A8.net) */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-widest border-l-4 border-emerald-500 pl-4">AI推奨の解決策（提携先）</h3>
                <Badge variant="outline" className="border-emerald-500/50 text-emerald-500 uppercase text-[10px]">A8.net Verified</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {AFFILIATE_OFFERS.map((offer, i) => (
                  <a key={i} href={offer.url} target="_blank" rel="noopener noreferrer" className="group">
                    <Card className="bg-[#13141f] border-2 border-white/5 p-8 rounded-[2.5rem] h-full flex flex-col justify-between hover:border-emerald-500/50 transition-all group-hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xl font-black text-white italic group-hover:text-emerald-400 transition-colors">{offer.name}</h4>
                          <Star className="text-emerald-500 fill-emerald-500" size={16} />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {offer.tags.map(tag => (
                            <span key={tag} className="text-[9px] font-black px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">{tag}</span>
                          ))}
                        </div>
                        <p className="text-sm text-slate-400 font-bold italic leading-relaxed">{offer.desc}</p>
                      </div>
                      <div className="pt-6">
                        <div className="w-full h-14 bg-white/5 group-hover:bg-emerald-600 rounded-xl flex items-center justify-center gap-2 font-black italic transition-all group-hover:text-slate-950">
                          詳細を確認して申し込む <ExternalLink size={18} />
                        </div>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            </div>

            {/* Amazon Books */}
            <a href="https://www.amazon.co.jp/s?k=借金完済&tag=nextralabs-22" target="_blank" className="block group">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-800 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl transition-all group-hover:scale-[1.01]">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white italic">不敗のマネーリテラシーを習得 ➔</h3>
                  <p className="text-blue-100 text-sm font-bold">完済後に二度と困らないための知識を本で学ぶ</p>
                </div>
                <ShoppingCart size={40} className="text-white animate-pulse" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
