import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIで副業・収入アップ【NextraLabs】月額定額で始めるAI副業入門2026年',
  description: 'AIツールを使った副業で月5万円を目指す方法を解説。ブログ・動画・画像・ライティングなどAI副業をNextraLabsの使い放題プランでお得にスタート。',
  keywords: ['AI副業', '副業AIツール', 'NextraLabs副業', 'AI在宅ワーク', '副業月5万'],
}

const JOBS = [
  { emoji: '✍️', title: 'AIブログ運営', earn: '月1〜10万円', desc: 'AI記事生成でSEOブログを運営。アフィリエイト・広告収入' },
  { emoji: '🎨', title: 'AI画像販売', earn: '月1〜5万円', desc: '生成した画像をストックフォトやNFTで販売' },
  { emoji: '🎬', title: 'AI動画制作', earn: '月3〜20万円', desc: '企業のSNS動画をAIで制作して受注' },
  { emoji: '📝', title: 'AIライティング', earn: '月2〜15万円', desc: 'AIを使って高品質な記事・コピーを量産' },
  { emoji: '📚', title: 'Kindle出版', earn: '月0.5〜3万円', desc: 'AIで電子書籍を執筆してKindleで販売' },
  { emoji: '🤖', title: 'AIコンサル', earn: '月10〜50万円', desc: '企業のAI導入支援・研修を行う上流工程' },
]

export default function SideJobLpPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5 text-emerald-300 text-xs font-bold mb-6">
            💰 AIで副収入を作る
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">
            AIツールで<br /><span className="text-emerald-400">月5万円</span>の<br />副収入を目指す
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            AIを使えば副業の参入障壁はゼロ。<br />
            NextraLabsで30種類のAIツールを月額定額で使い放題にして副業をスタート。
          </p>
          <Link
            href="/register"
            className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl px-10 py-4 text-lg transition-all shadow-lg shadow-emerald-900/50"
          >
            今すぐ無料で始める →
          </Link>
        </div>
      </section>

      {/* 副業アイデア */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-10">AIを使った副業アイデア</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {JOBS.map(job => (
              <div key={job.title} className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <div className="text-3xl mb-3">{job.emoji}</div>
                <div className="font-bold text-white text-sm mb-1">{job.title}</div>
                <div className="text-emerald-400 text-xs font-bold mb-2">{job.earn}</div>
                <p className="text-xs text-gray-400">{job.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ステップ */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-10">副業スタートまでの4ステップ</h2>
          <div className="space-y-6">
            {[
              { step: '01', title: 'NextraLabsに登録', desc: '月額定額でAIツール使い放題。まずは無料から始めよう' },
              { step: '02', title: 'AIツールをマスター', desc: 'ブログ・画像・動画など自分に合ったツールを集中的に練習' },
              { step: '03', title: '最初の案件を受注', desc: 'クラウドワークスやランサーズで低単価から始めて実績を作る' },
              { step: '04', title: '収入を拡大', desc: 'SNS・ブログで実績を発信して単価アップ・直接受注へ' },
            ].map(item => (
              <div key={item.step} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center font-black text-sm">
                  {item.step}
                </div>
                <div>
                  <div className="font-bold text-white mb-1">{item.title}</div>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900">
        <h2 className="text-2xl font-black mb-4">AI副業を今すぐ始める</h2>
        <p className="text-gray-400 mb-8">NextraLabsで30種類のAIツールを使い放題にしてスタート</p>
        <Link
          href="/register"
          className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl px-10 py-4 text-lg transition-all"
        >
          無料で始める →
        </Link>
        <p className="text-xs text-gray-600 mt-3">いつでも解約可能</p>
      </section>

      <footer className="border-t border-gray-800 py-8 text-center text-xs text-gray-600">
        <Link href="/" className="hover:text-gray-400">NextraLabs TOP</Link>
        <p className="mt-4">© 2026 NextraLabs. All rights reserved.</p>
      </footer>
    </div>
  )
}
