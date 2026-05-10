// ============================================================
// 🔒 LOCKED — KindleFactory product page
// 完成済みツール。NextraLabs様の明示的な指示なしに
// このファイルを編集・削除・移動することを禁止する。
// Locked: 2026-05-10
// ============================================================
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { BookOpen, FileText, Sparkles, Download, Crown } from 'lucide-react'

export default function KindleFactoryLp() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32">
      {/* ヒーロー */}
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-20 text-center space-y-8">
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-1 rounded-full font-bold uppercase text-xs">KDP出版 完全自動化</Badge>
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter uppercase leading-[1.1]">
          Kindle本<span className="text-emerald-500">ファクトリー</span>
        </h1>
        <h2 className="text-xl md:text-3xl font-bold text-slate-300 max-w-2xl mx-auto leading-relaxed">
          テーマを入力するだけ。<br />
          AIがKDP入稿可能な<span className="text-emerald-400">DOCX原稿</span>を自動生成します。
        </h2>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link href="/products/kindle-factory/app">
            <button className="h-12 px-10 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all active:scale-95 uppercase ">
              今すぐ原稿を生成する ➔
            </button>
          </Link>
        </div>
      </section>

      {/* 機能 */}
      <section className="max-w-4xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8">
        {[
          { icon: <Sparkles size={28} />, title: 'AI原稿自動生成', desc: 'テーマ・ジャンルを選ぶだけ。最大10,000字のKindle本原稿をAIが即座に作成。Gemini 2.5 Flash搭載で高品質・高速生成。' },
          { icon: <Download size={28} />, title: 'KDP入稿用DOCX出力', desc: 'Wordで開けるDOCXファイルをそのままKDPにアップロードできます。入稿作業を大幅に短縮。' },
          { icon: <FileText size={28} />, title: 'KDP入稿チートシート', desc: 'タイトル・著者名・キーワード・説明文など入稿に必要な情報をまとめて出力（STANDARDプラン以上）。' },
          { icon: <Crown size={28} />, title: '表紙プロンプト生成', desc: 'Midjourney・DALL-Eで使える表紙画像生成プロンプトを自動作成（PREMIUMプラン）。' },
        ].map((f, i) => (
          <div key={i} className="bg-[#13141f] border-2 border-white/5 p-8 rounded-[2rem] space-y-4 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">{f.icon}</div>
            <h3 className="text-xl font-bold text-white uppercase">{f.title}</h3>
            <p className="text-slate-400 font-bold text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* KDP入稿ステップ */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] p-8 space-y-6">
          <h3 className="font-bold text-emerald-400 text-lg uppercase tracking-wider flex items-center gap-2">
            <BookOpen size={20} />KDP入稿までの流れ
          </h3>
          <ol className="space-y-4">
            {[
              { step: '01', title: 'テーマ・ジャンルを入力', desc: '副業・AI活用・自己啓発などのジャンルからワンクリックで選択。または自由入力も可能。' },
              { step: '02', title: 'AIが原稿を自動生成', desc: '30〜60秒でKDP入稿可能なDOCX原稿が完成。Gemini 2.5 Flashによる高品質生成。' },
              { step: '03', title: 'WordまたはGoogleドキュメントで確認・加筆', desc: '内容を確認し、必要に応じて修正・加筆。プレビューで事前確認も可能。' },
              { step: '04', title: 'Canva等で表紙を作成', desc: '推奨サイズ 2560×1600px。表紙プロンプト機能（PREMIUM）でAI画像生成も可。' },
              { step: '05', title: 'KDPダッシュボードで登録・出版', desc: 'KDP入稿チートシートを見ながら入力。審査通過後（24〜72時間）に販売開始！' },
            ].map((s) => (
              <li key={s.step} className="flex gap-4 items-start">
                <span className="text-emerald-500 font-bold text-2xl min-w-[40px]">{s.step}</span>
                <div>
                  <p className="text-white font-bold text-sm">{s.title}</p>
                  <p className="text-slate-400 text-sm font-bold">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* プラン比較 */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold text-white uppercase text-center mb-6">プラン別機能</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'FREE', color: 'border-slate-500/40 text-slate-400', items: ['1日1回', '原稿プレビュー', '—', '—', '—'] },
            { name: 'LIGHT', color: 'border-emerald-500/40 text-blue-400', items: ['1日3回', '原稿プレビュー', 'DOCX出力', '—', '—'] },
            { name: 'STANDARD', color: 'border-emerald-500/40 text-emerald-400', items: ['1日5回', '原稿プレビュー', 'DOCX出力', 'KDP表', '—'] },
            { name: 'PREMIUM', color: 'border-emerald-500/40 text-emerald-400', items: ['1日15回', '原稿プレビュー', 'DOCX出力', 'KDP表', '表紙プロンプト'] },
          ].map((p, i) => (
            <div key={i} className={`bg-[#13141f] border-2 ${p.color} rounded-2xl p-4 space-y-2`}>
              <p className={`font-bold text-sm uppercase ${p.color.split(' ')[1]}`}>{p.name}</p>
              {p.items.map((item, j) => (
                <p key={j} className={`text-xs font-bold ${item === '—' ? 'text-slate-600' : 'text-slate-300'}`}>{item}</p>
              ))}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-500 font-bold mt-4">
          <a href="/pricing" className="text-emerald-400 underline">プランをアップグレード</a>してすべての機能を使えるようにしましょう
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pt-8 text-center space-y-6">
        <h3 className="text-3xl font-bold text-white uppercase">今日から出版できる。</h3>
        <Link href="/products/kindle-factory/app">
          <button className="h-12 px-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg rounded-2xl shadow-xl transition-all active:scale-95 uppercase ">
            原稿生成をはじめる ➔
          </button>
        </Link>
      </section>
    </div>
  )
}
