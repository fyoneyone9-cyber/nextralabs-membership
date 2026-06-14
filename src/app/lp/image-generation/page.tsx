import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI画像生成ツール使い放題【NextraLabs】Midjourney・DALL-Eも月額定額',
  description: 'AI画像生成ツールをまとめて使い放題。Midjourney風・DALL-E風・アニメ調など多様なスタイルで画像生成。NextraLabsで今すぐ始めよう。',
  keywords: ['AI画像生成', 'Midjourney', 'DALL-E', '画像生成使い放題', 'NextraLabs'],
}

const STYLES = [
  { emoji: '🎨', name: 'フォトリアル', desc: '写真のようにリアルな画像を生成' },
  { emoji: '✏️', name: 'アニメ・イラスト', desc: '日本風アニメやイラスト調の画像' },
  { emoji: '🖼️', name: 'アート・絵画', desc: '油絵・水彩・デジタルアート風' },
  { emoji: '📱', name: 'SNS・バナー', desc: 'Instagram・X・YouTube用素材' },
  { emoji: '🏢', name: 'ビジネス素材', desc: 'プレゼン・資料用のプロ品質画像' },
  { emoji: '🌟', name: 'ファンタジー', desc: '幻想的・SF的なクリエイティブ画像' },
]

export default function ImageGenerationLpPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-gray-900 via-pink-950 to-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-pink-500/20 border border-pink-500/30 rounded-full px-4 py-1.5 text-pink-300 text-xs font-bold mb-6">
            🎨 テキストから画像を自動生成
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">
            AI画像生成を<br /><span className="text-pink-400">使い放題</span>にする
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            思い描いた画像をテキストで指定するだけ。<br />
            プロ品質の画像が数秒で生成できます。
          </p>
          <Link
            href="/register"
            className="inline-block bg-pink-600 hover:bg-pink-500 text-white font-black rounded-2xl px-10 py-4 text-lg transition-all shadow-lg shadow-pink-900/50"
          >
            今すぐ無料で始める →
          </Link>
        </div>
      </section>

      {/* スタイル */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-10">あらゆるスタイルに対応</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {STYLES.map(s => (
              <div key={s.name} className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <div className="text-3xl mb-3">{s.emoji}</div>
                <div className="font-bold text-white text-sm mb-1">{s.name}</div>
                <p className="text-xs text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使い方 */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-10">使い方はたった3ステップ</h2>
          <div className="space-y-6">
            {[
              { step: '01', title: 'テキストで指示する', desc: '「青い空の下に立つ女性、アニメ調」のように日本語で入力するだけ' },
              { step: '02', title: 'AIが自動生成', desc: '数秒〜数十秒で高品質な画像が生成されます' },
              { step: '03', title: 'ダウンロード・利用', desc: '生成した画像をSNS・ブログ・仕事に自由に活用' },
            ].map(item => (
              <div key={item.step} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center font-black text-sm">
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

      {/* 活用シーン */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-10">こんな場面で活躍</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'ブログ・記事のアイキャッチ', desc: '毎回オリジナルの記事画像を自動生成' },
              { title: 'SNSコンテンツ', desc: 'Instagram・X用の目を引くビジュアル' },
              { title: 'ECサイトの商品画像', desc: '背景変更・バリエーション展開も簡単' },
              { title: '副業・受注案件', desc: 'クライアント向けデザイン案の高速制作' },
            ].map(item => (
              <div key={item.title} className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <div className="font-bold text-white text-sm mb-2">✓ {item.title}</div>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center bg-gradient-to-br from-gray-900 via-pink-950 to-gray-900">
        <h2 className="text-2xl font-black mb-4">AI画像生成を今すぐ試す</h2>
        <p className="text-gray-400 mb-8">NextraLabsで画像生成AIを使い放題にする</p>
        <Link
          href="/register"
          className="inline-block bg-pink-600 hover:bg-pink-500 text-white font-black rounded-2xl px-10 py-4 text-lg transition-all"
        >
          無料で始める →
        </Link>
      </section>

      <footer className="border-t border-gray-800 py-8 text-center text-xs text-gray-600">
        <Link href="/" className="hover:text-gray-400">NextraLabs TOP</Link>
        <p className="mt-4">© 2026 NextraLabs. All rights reserved.</p>
      </footer>
    </div>
  )
}
