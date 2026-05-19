import Link from 'next/link'
import Image from 'next/image'
import { GitCompareArrows, CheckCircle2, Zap, ShieldCheck, Brain, Repeat } from 'lucide-react'

export const metadata = {
  title: 'AIクロスチェッカー | NextraLabs',
  description: 'GeminiとGPT-4oが同時に回答。2つのAIが合意した情報だけを"確定回答"として出力する、信頼性最大化ツール。',
}

export default function CrossCheckerLP() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 font-sans">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 border border-emerald-500/30 rounded-full px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium text-emerald-400 tracking-tight uppercase">NEW TOOL · JUST LAUNCHED</span>
        </div>
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <GitCompareArrows className="h-12 w-12 text-emerald-400" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
          AI クロスチェッカー
        </h1>
        <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Gemini × GPT-4o が同時に回答。<br />
          <span className="text-emerald-400 font-semibold">2つのAIが合意した情報だけ</span>を確定回答として出力。<br />
          ハルシネーション・嘘・間違いを最小化。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/products/cross-checker/app"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-xl text-base shadow-[0_0_24px_rgba(16,185,129,0.3)] hover:shadow-[0_0_36px_rgba(16,185,129,0.5)] transition-all"
          >
            <Zap className="h-4 w-4" />
            今すぐ使う（無料）→
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">仕組みは超シンプル</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: '質問を入力', desc: 'ファクト確認・文章校正・コードレビューなど8種のモードから選んで入力するだけ。' },
            { step: '02', title: '2つのAIが同時に回答', desc: 'GeminiとGPT-4oが並列で処理。それぞれの回答をリアルタイム表示。' },
            { step: '03', title: '一致点だけを確定回答として出力', desc: '両AIが合意した内容のみを抽出し、相違点はハイライト。信頼度スコア付き。' },
          ].map((item) => (
            <div key={item.step} className="bg-[#13141f] border border-white/5 rounded-2xl p-6 space-y-3">
              <div className="text-4xl font-black text-emerald-500/20">{item.step}</div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">こんなことができます</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: CheckCircle2, title: 'ファクトチェック', desc: '数値・固有名詞・日付などの正確性を2つのAIで検証。' },
            { icon: Brain, title: '文章・コード校正', desc: '誤字・論理ミス・バグを両AIがダブルチェック。' },
            { icon: ShieldCheck, title: '法律・契約書確認', desc: '契約書・利用規約の問題点を2つの視点で洗い出す。' },
            { icon: Repeat, title: 'SEO記事チェック', desc: 'SEO品質・ファクト・表現をまとめて検証。' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4 bg-[#13141f] border border-white/5 rounded-xl p-5">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                <item.icon className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">AIの嘘に騙されるのは、今日で終わり。</h2>
        <p className="text-slate-400">無料プランで今すぐ試せます。</p>
        <Link
          href="/products/cross-checker/app"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-xl text-base shadow-[0_0_24px_rgba(16,185,129,0.3)] transition-all"
        >
          <Zap className="h-4 w-4" />
          クロスチェッカーを起動する →
        </Link>
      </div>

      {/* YouTube動画 */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
          実際の動作を動画で確認
        </h2>
        <p className="text-center text-slate-400 mb-8 text-sm">
          ずんだもん×四国めたんが使い方をわかりやすく解説！
        </p>
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
          <iframe
            src="https://www.youtube.com/embed/tYEAzOsDAy4"
            title="AIクロスチェッカー 使い方解説"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>

      {/* チートシート画像 */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
          使い方チートシート
        </h2>
        <p className="text-center text-slate-400 mb-8 text-sm">
          機能概要・使い方ステップ・活用シーンを一枚にまとめました
        </p>
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
          <Image
            src="/cross-checker-cheatsheet.png"
            alt="AIクロスチェッカー チートシート"
            width={1920}
            height={1080}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      <div className="text-center opacity-20 pb-10 font-medium tracking-tight text-[10px] text-slate-500">Nextra Labs · 2026</div>
    </div>
  )
}
