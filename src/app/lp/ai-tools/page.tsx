import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '【2026年】AIツール使い放題NextraLabs｜料金・機能・評判を徹底解説',
  description: 'ChatGPT・Claude・画像生成AI・動画生成AIなど30種類以上が月額定額で使い放題。NextraLabsの料金・機能・評判を徹底解説します。',
  keywords: ['AIツール使い放題', 'NextraLabs', 'AI月額', 'ChatGPT', 'Claude', '画像生成AI'],
}

const TOOLS = [
  { icon: '💬', name: 'ChatGPT / Claude / Gemini', desc: '最先端のテキストAIが全て使える' },
  { icon: '🎨', name: 'AI画像生成', desc: 'テキストから高品質な画像を生成' },
  { icon: '🎬', name: 'AI動画生成', desc: 'Kling・Hailuoなど最新動画AIを使い放題' },
  { icon: '🎵', name: 'AI音楽・音声生成', desc: 'BGM・ナレーション・効果音を自動生成' },
  { icon: '📊', name: 'AI資料・スライド作成', desc: 'プレゼン・レポートを自動生成' },
  { icon: '🔍', name: 'AIリサーチ・検索', desc: '最新情報を高速収集・要約' },
]

const REVIEWS = [
  { name: '田中さん（フリーランスデザイナー）', text: '個別に契約すると月3万円かかるツールが全部使えて最高。副業収入が月10万円になりました。' },
  { name: '鈴木さん（会社員・副業中）', text: 'Kindle出版の原稿をAIで書いて月2万円の印税収入ができました。コスパ最高です。' },
  { name: '山田さん（Webマーケター）', text: 'ブログ記事作成が10倍速になりました。SEO記事を量産して広告収入が3倍に。' },
]

export default function AiToolsLpPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-1.5 text-purple-300 text-xs font-bold mb-6">
            🚀 30種類以上のAIツールが使い放題
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">
            AIツールを<span className="text-purple-400">月額定額</span>で<br />使い放題にする
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            ChatGPT・Claude・画像生成AI・動画生成AIなど<br />
            個別契約すると月3万円以上のツールが全て使えます
          </p>
          <Link
            href="/register"
            className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl px-10 py-4 text-lg transition-all shadow-lg shadow-purple-900/50"
          >
            今すぐ無料で始める →
          </Link>
          <p className="text-xs text-gray-500 mt-3">クレジットカード不要・いつでも解約可能</p>
        </div>
      </section>

      {/* Tools */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-10">使えるAIツール一覧</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {TOOLS.map(t => (
              <div key={t.name} className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <div className="text-3xl mb-3">{t.icon}</div>
                <div className="font-bold text-white mb-1 text-sm">{t.name}</div>
                <p className="text-xs text-gray-400">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 料金 */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-4">圧倒的なコスパ</h2>
          <p className="text-gray-400 mb-10">個別契約との比較</p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div className="text-gray-400 text-sm mb-2">個別に契約した場合</div>
              <div className="text-4xl font-black text-red-400 mb-1">¥30,000+</div>
              <div className="text-xs text-gray-500">/ 月（推定）</div>
            </div>
            <div className="bg-purple-900/30 border-2 border-purple-500 rounded-2xl p-6">
              <div className="text-purple-300 text-sm mb-2 font-bold">NextraLabs</div>
              <div className="text-4xl font-black text-purple-300 mb-1">月額定額</div>
              <div className="text-xs text-purple-400">全ツール使い放題</div>
            </div>
          </div>
          <Link
            href="/register"
            className="inline-block mt-10 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl px-10 py-4 text-lg transition-all"
          >
            今すぐ始める →
          </Link>
        </div>
      </section>

      {/* 口コミ */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-10">ユーザーの声</h2>
          <div className="space-y-4">
            {REVIEWS.map(r => (
              <div key={r.name} className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <p className="text-gray-200 text-sm mb-3">&ldquo;{r.text}&rdquo;</p>
                <p className="text-xs text-gray-500 font-bold">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
        <h2 className="text-2xl font-black mb-4">今すぐAIツールを使い放題にする</h2>
        <p className="text-gray-400 mb-8">登録5分で30種類以上のAIツールが使えます</p>
        <Link
          href="/register"
          className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl px-10 py-4 text-lg transition-all shadow-lg shadow-purple-900/50"
        >
          無料で始める →
        </Link>
      </section>

      <footer className="border-t border-gray-800 py-8 text-center text-xs text-gray-600">
        <Link href="/" className="hover:text-gray-400">NextraLabs TOP</Link>
        <span className="mx-3">|</span>
        <Link href="/privacy" className="hover:text-gray-400">プライバシーポリシー</Link>
        <p className="mt-4">© 2026 NextraLabs. All rights reserved.</p>
      </footer>
    </div>
  )
}
