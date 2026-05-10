import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ToolLaunchButton } from '@/components/ToolLaunchButton'
import {
  ArrowLeft,
  FileDown,
  Image as ImageIcon,
  Video,
  Zap,
  ShieldCheck,
  Lock,
  Clock,
  Layout,
  FileText,
  Repeat
} from 'lucide-react'

export const metadata: Metadata = {
  title: '究極AIマルチコンバーター | 動画・画像・PDF変換を全自動・高速処理 | NextraLabs',
  description: '動画・画像・PDFを選択してボタンを押すだけ。MP4→MP3・JPG→PDF・PDF圧縮など50種類以上の変換に対応したAI搭載ファイル変換ツール。高速・高品質・セキュア。月額¥480のライトプランで利用可能。',
  keywords: ['ファイル変換AI','動画変換','画像変換AI','PDF変換AI','MP4変換','動画圧縮AI','画像圧縮AI','PDF圧縮','ファイル形式変換','NextraLabsコンバーター','MP4MP3変換','JPG PNG変換','オンライン変換ツール'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://membership-site-nextralabos.vercel.app/products/universal-converter' },
  openGraph: {
    title: '究極AIマルチコンバーター | 動画・画像・PDF変換を全自動 | NextraLabs',
    description: '動画・画像・PDFを選択してボタンを押すだけ。50種類以上の変換に対応。月額¥480。',
    url: 'https://membership-site-nextralabos.vercel.app/products/universal-converter',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://membership-site-nextralabos.vercel.app/og-image.png', width: 1200, height: 630, alt: '究極AIマルチコンバーター | NextraLabs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '究極AIマルチコンバーター | 動画・画像・PDF変換を全自動',
    description: '動画・画像・PDFを選択してボタンを押すだけ。50種類以上の変換。月額¥480。',
    images: ['https://membership-site-nextralabos.vercel.app/og-image.png'],
  },
}

const features = [
  {
    icon: Repeat,
    title: 'オールインワン変換',
    description: '動画(MP4/MOV)、画像(WebP/PNG)、PDF。デジタルデータの主要形式すべてに対応。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Zap,
    title: 'AI極限圧縮',
    description: '画質を1ミリも妥協せず、ファイルサイズだけを削ぎ落とす。Genspark AIが最適解を導き出します。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: ShieldCheck,
    title: '会員プラン厳守',
    description: '全ツール共通の「1カウント制」。プランに応じた回数制限で、公平かつ持続可能なサービスを提供。',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  }
]

export default function UniversalConverterPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '究極AIマルチコンバーター',
    description: '動画・画像・PDFを選択してボタンを押すだけ。50種類以上の変換に対応したAI搭載ファイル変換ツール。',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '480', priceCurrency: 'JPY' },
    publisher: { '@type': 'Organization', name: 'NextraLabs', url: 'https://membership-site-nextralabos.vercel.app' }
  }
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="min-h-screen bg-[#050507] text-slate-200 pb-20 font-sans">
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-emerald-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-500/5" />
        <div className="container mx-auto px-4 relative">
          <Link href="/products" className="inline-flex items-center text-sm text-slate-400 hover:text-emerald-400 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> ツール一覧に戻る
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 font-bold tracking-tight uppercase">💎 MASTERMODEL</Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-4 uppercase">UNIVERSAL AI CONVERTER</h1>
              <p className="text-xl text-emerald-500 font-bold mb-6 ">動画・画像・PDF × 万能変換 × 憲法遵守</p>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-xl">
                「開けない」「送れない」「重すぎる」。あらゆるデジタルデータの障壁を、AIが取り除きます。
                <span className="text-white font-bold">最高品質の変換・圧縮</span>を、これ一台に集約。
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <ToolLaunchButton productId="universal-converter" className="w-full sm:w-auto h-12 px-10 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xl rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all uppercase " />
              </div>

              <div className="flex items-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-tight">
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> プラン厳守</span>
                <span className="flex items-center gap-1.5"><Repeat className="h-4 w-4 text-emerald-500" /> 全形式対応</span>
                <span className="flex items-center gap-1.5"><Layout className="h-4 w-4 text-emerald-500" /> 憲法準拠</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-500 rounded-3xl blur opacity-20" />
              <Card className="relative bg-[#13141f] border-2 border-emerald-500 rounded-3xl overflow-hidden p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 opacity-50">
                    <div className="flex items-center gap-3"><Video className="h-5 w-5" /> <span className="text-xs font-bold uppercase ">Video Mode</span></div>
                    <Badge variant="outline" className="text-[8px]">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-xl border-2 border-emerald-500">
                    <div className="flex items-center gap-3"><ImageIcon className="h-5 w-5 text-emerald-400" /> <span className="text-xs font-bold uppercase text-white">Image Mode</span></div>
                    <Badge className="bg-emerald-500 text-slate-950 text-[8px]">Selected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 opacity-50">
                    <div className="flex items-center gap-3"><FileText className="h-5 w-5" /> <span className="text-xs font-bold uppercase ">PDF Mode</span></div>
                    <Badge variant="outline" className="text-[8px]">Standby</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Constraints Info */}
      <section className="py-16 bg-black/40 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8 border-l-4 border-emerald-500 pl-4">
              <ShieldCheck className="h-6 w-6 text-emerald-500" />
              <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Nextra利用規約に基づく制限</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { plan: '無料', count: '会員登録必須', detail: '体験利用可能', color: 'border-slate-500/30' },
                { plan: 'ライト', count: '1回/日', detail: '全ツール合計', color: 'border-emerald-500/30' },
                { plan: 'スタンダード', count: '2回/日', detail: '全ツール合計', color: 'border-emerald-500/30' },
                { plan: 'プレミアム', count: '3回/日', detail: '全ツール合計', color: 'border-emerald-500/30' }
              ].map((p, i) => (
                <div key={i} className={`p-6 rounded-2xl bg-white/5 border ${p.color} text-center`}>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-tight">{p.plan} PLAN</p>
                  <p className="text-xl font-bold text-white mb-1 ">{p.count}</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase">{p.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-slate-500 text-[10px] mt-8 font-bold uppercase tracking-[0.2em]">
              ⚠️ Nextra利用規約第4条により、全プランにおいて「無制限提供」は禁止されています。
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <div key={i} className="group p-8 rounded-[2rem] bg-[#13141f] border border-white/10 hover:border-emerald-500/50 transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${f.bg} mb-6 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`h-7 w-7 ${f.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tighter">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed ">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16" style={{ background: '#0d1117' }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">よくある質問</h2>
          <div className="space-y-4">
            {[
              { q: '対応しているファイル形式を教えてください。', a: '動画（MP4・MOV・AVI・WebM）、画像（JPG・PNG・WebP・GIF）、ドキュメント（PDF・DOCX）など50種類以上に対応しています。' },
              { q: 'ファイルはサーバーに保存されますか？', a: 'いいえ。変換処理はブラウザ上で行い、ファイルはサーバーに送信・保存されません。プライバシーを完全に保護します。' },
              { q: 'ファイルサイズの上限はありますか？', a: 'ライトプランでは1ファイル最大500MBまで対応しています。大容量ファイルの変換もスムーズに処理します。' },
              { q: '変換にかかる時間はどれくらいですか？', a: 'ファイルサイズや形式によりますが、通常数秒〜数十秒で完了します。AIによる最適化処理で高速変換を実現しています。' },
              { q: 'スマートフォンでも使えますか？', a: 'はい。ブラウザベースのツールのため、スマートフォン・タブレット・PCすべてで利用可能です。アプリのインストールは不要です。' },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl" style={{ background: '#13141f', border: '1px solid #1e293b' }}>
                <p className="font-semibold text-white mb-2">Q. {item.q}</p>
                <p className="text-slate-400 text-sm leading-relaxed">A. {item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
