import dynamic from 'next/dynamic'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Phone, FileText, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const AiTeleapoLpContent = () => {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* 﨟槫勠 郢晏・繝ｻ郢晢ｽｭ郢晢ｽｼ郢ｧ・ｻ郢ｧ・ｯ郢ｧ・ｷ郢晢ｽｧ郢晢ｽｳ */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center space-y-10">
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-6 py-1 rounded-full font-bold text-xs tracking-tight">
          雎慕ｩゑｽｺ・ｺ陜滂ｽｶ隶鯉ｽｭ隰ｾ・ｯ隰・ｴ郢昴・繝ｻ郢晢ｽｫ
        </Badge>
        <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tighter leading-[1.1]">
          AIテレアポくん（架電・自動化支援）br />
          <span className="text-blue-400">郢ｧ・｢郢晄刮邏ｫ3陋溘・/span>郢ｧ蝣､蟯ｼ隰悶・笘・br />
          陜滂ｽｶ隶鯉ｽｭ隰ｾ・ｯ隰・ｴ郢昴・繝ｻ郢晢ｽｫ
        </h1>
        <h2 className="text-xl md:text-3xl font-bold text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 text-center">
          隴ｫ・ｶ鬮ｮ・ｻ陷ｿ・ｰ隴幢ｽｬ郢晢ｽｻ陜滂ｽｶ隶鯉ｽｭ郢ｧ・ｷ郢晉ｿｫﾎ懃ｹｧ・ｪ郢晢ｽｻ隰蜈茨ｽ｡驛・ｽｦ竏ｫ縺帷ｹｧ菴・邵ｺ讙取､ｪ隴弱ｅ竊楢ｬｨ・ｴ騾・・ﾂ繝ｻbr className="hidden md:block" />
          雎慕ｩゑｽｺ・ｺ郢晏干ﾎ帷ｹ晢ｽｳ邵ｺ・ｯ陋ｻ・･鬨ｾ譁絶凰髫慕距・ｩ髦ｪ・顔ｸｺ・ｧ邵ｺ逍ｲ鄂ｲ隴ｯ蛹ｻ・邵ｺ・ｾ邵ｺ蜷ｶﾂ繝ｻ
        </h2>
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <Link href="/contact">
            <button className="h-16 px-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xl rounded-2xl shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all active:scale-95 leading-none">
              霎滂ｽ｡隴∝衷蠍碁坿繝ｻ繝ｻ髫慕距・ｩ髦ｪ・らｹｧ鄙ｫ竏・遲舌・
            </button>
          </Link>
        </div>
      </section>

      {/* 隨ｨ・ｨ 隶匁ｺｯ繝ｻ驍擾ｽｹ闔我ｹ昴◎郢ｧ・ｯ郢ｧ・ｷ郢晢ｽｧ郢晢ｽｳ */}
      <section className="max-w-6xl mx-auto px-4 py-24 space-y-16">
        <div className="text-center space-y-4">
          <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
            陜滂ｽｶ隶鯉ｽｭ隰悟・譽｡郢ｧ蜻域呵棔・ｧ陋ｹ謔ｶ笘・ｹｧ繝ｻ邵ｺ・､邵ｺ・ｮ隶匁ｺｯ繝ｻ
          </h3>
          <p className="text-slate-500 font-bold">AI邵ｺ譴ｧ讌秘ｫｮ・ｻ邵ｺ荵晢ｽ蛾囎迢暦ｽｩ髦ｪ・らｹｧ鄙ｫ竏ｪ邵ｺ・ｧ闕ｳﾂ雎碁斡ﾂ螟奇ｽｲ・ｫ邵ｺ・ｧ郢ｧ・ｵ郢晄亢繝ｻ郢昴・/p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-3xl space-y-4 hover:border-blue-500/30 transition-all group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Phone size={24} />
            </div>
            <h4 className="text-xl font-bold text-white">AI隴ｫ・ｶ鬮ｮ・ｻ陷ｿ・ｰ隴幢ｽｬ騾墓ｻ薙・</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              隶鯉ｽｭ驕橸ｽｮ郢晢ｽｻ陜繝ｻ謾晉ｹ晢ｽｻ隲｡繝ｻ・ｽ讌｢ﾂ繝ｻ繝･陜｣・ｱ郢ｧ雋槭・陷牙ｸ吮・郢ｧ荵昶味邵ｺ莉｣縲但I邵ｺ譴ｧ諤咎ｩ包ｽｩ邵ｺ・ｪ隴ｫ・ｶ鬮ｮ・ｻ陷ｿ・ｰ隴幢ｽｬ郢ｧ蝣､蜃ｽ隰瑚・ﾂ繧・･ｳ闔牙｡・ｪ竏ｫ・ｰ・ｴ邵ｺ荵晢ｽ臥ｹｧ・｢郢晄剌蜿呵募干竏ｪ邵ｺ・ｧ陞ｳ謔溘・郢ｧ・ｹ郢ｧ・ｯ郢晢ｽｪ郢晏干繝ｨ陋ｹ謔ｶﾂ繝ｻ
            </p>
            <div className="flex items-center gap-2 text-blue-400 text-sm font-bold">
              <CheckCircle2 size={16} />
              <span>隶鯉ｽｭ驕橸ｽｮ陋ｻ・･郢ｧ・ｫ郢ｧ・ｹ郢ｧ・ｿ郢晄ｧｭ縺・ｹｧ・ｺ陝・ｽｾ陟｢繝ｻ/span>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-3xl space-y-4 hover:border-cyan-500/30 transition-all group">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <h4 className="text-xl font-bold text-white">雎慕ｩゑｽｺ・ｺ髫慕距・ｩ髦ｪ・らｹｧ鬘倥・陷咲ｩゑｽｽ諛医・</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              郢晏現繝ｻ郢ｧ・ｯ驍ｨ蜈域｣｡邵ｺ・ｫ陟｢諛環ｧ邵ｺ・ｦ雎慕ｩゑｽｺ・ｺ陷ｷ莉｣・髫慕距・ｩ閧ｴ蠍檎ｹｧ菴・邵ｺ迹壹・陷咲ｩゑｽｽ諛医・邵ｲ繧育ｽｲ隴ｯ蛹ｻ繝ｻ髫補扱闡守ｹ晢ｽｻROI髫ｱ・ｬ隴丞ｼｱ繝ｻ陞る・・ｴ繝ｻ謫・脂・ｶ邵ｺ・ｾ邵ｺ・ｧ闕ｳﾂ隲｡・ｬ騾墓ｻ薙・邵ｲ繝ｻ
            </p>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
              <CheckCircle2 size={16} />
              <span>郢晏干ﾎ溯惓竏ｬ・ｳ・ｪ邵ｺ・ｮ髫慕距・ｩ閧ｴ蠍檎ｹｧ蝣､讀ｪ隴弱ｅ竊・/span>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-3xl space-y-4 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <h4 className="text-xl font-bold text-white">AI郢ｧ・｢郢晏ｳｨ繝ｰ郢ｧ・､郢ｧ・ｹ繝ｻ繝ｻ髫ｼ陜溘・鄂ｲ隴ｯ繝ｻ/h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              隹ｺ・｡陜玲ｨ頑･秘ｫｮ・ｻ邵ｺ・ｮ郢晏生縺帷ｹ晏現縺｡郢ｧ・､郢晄ｺ佩ｦ郢ｧ・ｰ邵ｺ・ｨ隰ｾ・ｹ陜溘・縺・ｹ晏ｳｨ繝ｰ郢ｧ・､郢ｧ・ｹ郢ｧ菴・邵ｺ譴ｧ鄂ｲ隴ｯ蛹ｻﾂ繧域･秘ｫｮ・ｻ髫ｪ蛟ｬ鮖ｸ郢ｧ螳壼｡倬→髦ｪ・邵ｺ・ｦ郢ｧ・｢郢晄刮邏ｫ郢ｧ蝣､・ｶ蜥擾ｽｶ螟ょ飭邵ｺ・ｫ陷ｷ蜿ｰ・ｸ鄙ｫﾂ繝ｻ
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
              <CheckCircle2 size={16} />
              <span>郢昴・繝ｻ郢ｧ・ｿ郢晏ｳｨﾎ懃ｹ晄じﾎｦ邵ｺ・ｪ陜滂ｽｶ隶鯉ｽｭ隰ｾ・ｹ陜溘・/span>
            </div>
          </div>
        </div>
      </section>

      {/* 﨟槫勠 CTA郢ｧ・ｻ郢ｧ・ｯ郢ｧ・ｷ郢晢ｽｧ郢晢ｽｳ */}
      <section className="max-w-5xl mx-auto px-4 pt-10 text-center">
        <Card className="bg-gradient-to-br from-blue-700 to-cyan-800 border-0 rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-center space-y-10">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <Phone size={300} className="text-white" />
          </div>
          <div className="relative z-10 space-y-6 text-center">
            <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-none">
              郢ｧ・｢郢晄刮邏ｫ3陋滄亂竏育ｸｲ繝ｻ
            </h3>
            <p className="text-blue-100 text-lg font-bold leading-relaxed max-w-2xl mx-auto px-4 text-center">
              AI邵ｺ謔滄悸隶鯉ｽｭ郢ｧ・ｷ郢晉ｿｫﾎ懃ｹｧ・ｪ邵ｺ・ｨ隴ｫ・ｶ鬮ｮ・ｻ髫補悪縺帷ｹｧ蜻育ｴ幃・・ﾂ繝ｻbr />
              雎慕ｩゑｽｺ・ｺ郢晏干ﾎ帷ｹ晢ｽｳ邵ｺ・ｯ陋ｻ・･鬨ｾ譁絶凰髫慕距・ｩ髦ｪ・顔ｸｺ・ｧ隴崢鬩包ｽｩ陋ｹ謔ｶ・邵ｺ・ｾ邵ｺ蜷ｶﾂ繝ｻ
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-6 text-center">
              <Link href="/contact">
                <button className="h-16 px-12 bg-white text-blue-700 font-bold text-xl rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95 leading-none flex items-center gap-2">
                  霎滂ｽ｡隴∝衷蠍碁坿繝ｻ繝ｻ髫慕距・ｩ髦ｪ・らｹｧ繝ｻ<ArrowRight size={20} />
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
    name: 'AIテレアポくん（架電・自動化支援）',
    description: '法人営業の架電台本と見積もりをAIが瞬時に生成。アポ率3倍を目指す営業支援ツール。',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: 'https://nextralab.jp/products/ai-teleapo',
    offers: { '@type': 'Offer', price: '480', priceCurrency: 'JPY' },
    publisher: { '@type': 'Organization', name: 'NextraLabs' },
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NoSSRWrapper />
    </>
  )
}
