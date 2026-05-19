import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Phone, FileText, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const AiTeleapoLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 噫 繝偵・繝ｭ繝ｼ繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-6 py-1 rounded-full font-bold text-xs tracking-tight">
          豕穂ｺｺ蝟ｶ讌ｭ謾ｯ謠ｴ繝・・繝ｫ
        </Badge>
        <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tighter leading-[1.1]">
          AI繝・Ξ繧｢繝晁・蜍輔す繧ｹ繝・Β<br />
          <span className="text-blue-400">繧｢繝晉紫3蛟・/span>繧堤岼謖・☆<br />
          蝟ｶ讌ｭ謾ｯ謠ｴ繝・・繝ｫ
        </h1>
        <h2 className="text-xl md:text-3xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          譫ｶ髮ｻ蜿ｰ譛ｬ繝ｻ蝟ｶ讌ｭ繧ｷ繝翫Μ繧ｪ繝ｻ謠先｡郁ｦ∫せ繧但I縺檎椪譎ゅ↓謨ｴ逅・・br className="hidden md:block" />
          豕穂ｺｺ繝励Λ繝ｳ縺ｯ蛻･騾斐♀隕狗ｩ阪ｊ縺ｧ縺疲署譯医＠縺ｾ縺吶・
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/contact">
            <button className="h-16 px-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all active:scale-95 leading-none">
              辟｡譁咏嶌隲・・隕狗ｩ阪ｂ繧翫∈ 筐・
            </button>
          </Link>
        </div>
      </section>

      {/* 笨ｨ 讖溯・邏ｹ莉九そ繧ｯ繧ｷ繝ｧ繝ｳ */}
      <section className="max-w-6xl mx-auto px-4 py-24 space-y-16">
        <div className="text-center space-y-4">
          <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
            蝟ｶ讌ｭ謌先棡繧呈怙螟ｧ蛹悶☆繧・縺､縺ｮ讖溯・
          </h3>
          <p className="text-slate-500 font-bold">AI縺梧楔髮ｻ縺九ｉ隕狗ｩ阪ｂ繧翫∪縺ｧ荳豌鈴夊ｲｫ縺ｧ繧ｵ繝昴・繝・/p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-3xl space-y-4 hover:border-blue-500/30 transition-all group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Phone size={24} />
            </div>
            <h4 className="text-xl font-bold text-white">AI譫ｶ髮ｻ蜿ｰ譛ｬ逕滓・</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              讌ｭ遞ｮ繝ｻ蝠・攝繝ｻ諡・ｽ楢・ュ蝣ｱ繧貞・蜉帙☆繧九□縺代〒AI縺梧怙驕ｩ縺ｪ譫ｶ髮ｻ蜿ｰ譛ｬ繧堤函謌舌ょ女莉倡ｪ∫ｴ縺九ｉ繧｢繝晏叙蠕励∪縺ｧ螳悟・繧ｹ繧ｯ繝ｪ繝励ヨ蛹悶・
            </p>
            <div className="flex items-center gap-2 text-blue-400 text-sm font-bold">
              <CheckCircle2 size={16} />
              <span>讌ｭ遞ｮ蛻･繧ｫ繧ｹ繧ｿ繝槭う繧ｺ蟇ｾ蠢・/span>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-3xl space-y-4 hover:border-cyan-500/30 transition-all group">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <h4 className="text-xl font-bold text-white">豕穂ｺｺ隕狗ｩ阪ｂ繧願・蜍穂ｽ懈・</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              繝医・繧ｯ邨先棡縺ｫ蠢懊§縺ｦ豕穂ｺｺ蜷代￠隕狗ｩ肴嶌繧但I縺瑚・蜍穂ｽ懈・縲よ署譯医・隕∵葎繝ｻROI隱ｬ譏弱・螂醍ｴ・擅莉ｶ縺ｾ縺ｧ荳諡ｬ逕滓・縲・
            </p>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
              <CheckCircle2 size={16} />
              <span>繝励Ο蜩∬ｳｪ縺ｮ隕狗ｩ肴嶌繧堤椪譎ゅ↓</span>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-3xl space-y-4 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <h4 className="text-xl font-bold text-white">AI繧｢繝峨ヰ繧､繧ｹ・・隼蝟・署譯・/h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              谺｡蝗樊楔髮ｻ縺ｮ繝吶せ繝医ち繧､繝溘Φ繧ｰ縺ｨ謾ｹ蝟・い繝峨ヰ繧､繧ｹ繧但I縺梧署譯医よ楔髮ｻ險倬鹸繧定塘遨阪＠縺ｦ繧｢繝晉紫繧堤ｶ咏ｶ夂噪縺ｫ蜷台ｸ翫・
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
              <CheckCircle2 size={16} />
              <span>繝・・繧ｿ繝峨Μ繝悶Φ縺ｪ蝟ｶ讌ｭ謾ｹ蝟・/span>
            </div>
          </div>
        </div>
      </section>

      {/* 噫 CTA繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ */}
      <section className="max-w-5xl mx-auto px-4 pt-10 text-center">
        <Card className="bg-gradient-to-br from-blue-700 to-cyan-800 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <Phone size={300} className="text-white" />
          </div>
          <div className="relative z-10 space-y-6 text-center">
            <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-none">
              繧｢繝晉紫3蛟阪∈縲・
            </h3>
            <p className="text-blue-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center">
              AI縺悟霧讌ｭ繧ｷ繝翫Μ繧ｪ縺ｨ譫ｶ髮ｻ隕∫せ繧呈紛逅・・br />
              豕穂ｺｺ繝励Λ繝ｳ縺ｯ蛻･騾斐♀隕狗ｩ阪ｊ縺ｧ譛驕ｩ蛹悶＠縺ｾ縺吶・
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6 text-center">
              <Link href="/contact">
                <button className="h-16 px-12 bg-white text-blue-700 font-bold text-xl rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95 leading-none flex items-center gap-2">
                  辟｡譁咏嶌隲・・隕狗ｩ阪ｂ繧・<ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

const NoSSRWrapper = dynamic(() => Promise.resolve(AiTeleapoLpContent), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050507]" />,
})

export default function AiTeleapoLp() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI繝・Ξ繧｢繝晁・蜍輔す繧ｹ繝・Β',
    description: '豕穂ｺｺ蝟ｶ讌ｭ縺ｮ譫ｶ髮ｻ蜿ｰ譛ｬ縺ｨ蝟ｶ讌ｭ繧ｷ繝翫Μ繧ｪ繧但I縺瑚・蜍墓紛逅・ゅい繝晉紫3蛟阪ｒ逶ｮ謖・☆蝟ｶ讌ｭ謾ｯ謠ｴ繝・・繝ｫ縲・,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://nextralab.jp/products/ai-teleapo',
    offers: { '@type': 'Offer', price: '隕√♀隕狗ｩ阪ｊ', priceCurrency: 'JPY' },
    publisher: { '@type': 'Organization', name: 'NextraLabs' },
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NoSSRWrapper />
    </>
  )
}
