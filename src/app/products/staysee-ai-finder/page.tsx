import { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Staysee AI Finder | 旅行の宿泊先をAIが予算・条件から最速提案',
  description: '予算・エリア・人数・目的を入力するだけでAIが最適な宿を提案。楽天トラベル・じゃらん連携で最安値をリアルタイム比較。旅行準備を10倍速く。',
  keywords: ["AI宿探し","旅行AI","ホテルAI検索","楽天トラベルAI","宿泊先AI提案"],
  alternates: {
    canonical: 'https://nextralab.jp/products/staysee-ai-finder',
  },
  openGraph: {
    title: 'Staysee AI Finder | 旅行の宿泊先をAIが予算・条件から最速提案 | NextraLabs',
    description: '予算・エリア・人数・目的を入力するだけでAIが最適な宿を提案。楽天トラベル・じゃらん連携で最安値をリアルタイム比較。旅行準備を10倍速く。',
    url: 'https://nextralab.jp/products/staysee-ai-finder',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'NextraLabs',
    images: [{ url: 'https://nextralab.jp/og-image.png', width: 1200, height: 630, alt: 'Staysee AI Finder | 旅行の宿泊先をAIが予算・条件から最速提案' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Staysee AI Finder | 旅行の宿泊先をAIが予算・条件から最速提案',
    description: '予算・エリア・人数・目的を入力するだけでAIが最適な宿を提案。楽天トラベル・じゃらん連携で最安値をリアルタイム比較。旅行準備を10倍速く。',
    images: ['https://nextralab.jp/og-image.png'],
  },
}

const StayseeFinderLP = dynamic(() => import('@/components/tools/StayseeFinderLP'), { ssr: false })

export default function Page() {
  return (
    <div className="min-h-screen bg-[#050507]">
      <StayseeFinderLP />

      {/* ── 口コミ ── */}
      <section className="bg-[#0d1117] py-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              ユーザーの<span className="text-emerald-400">リアルな声</span>
            </h2>
            <p className="text-slate-400 text-sm">実際に使ったユーザーの感想</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: '早川 誠一', role: '旅行好き・40代', location: '東京都', text: '旅行先の宿を探すのに毎回何十件も見て疲れていました。条件を入力したら本当に合う宿だけ絞り込んでくれるので選択疲れがなくなりました。提案された宿がことごとく当たりで友人にも勧めています。', tag: '旅行好き' },
              { name: '徳永 みさき', role: '女子旅企画担当', location: '大阪府', text: '女子旅の宿選びは全員の希望を満たすのが大変でした。グループの条件をまとめて入力したら全員が満足できる宿を提案してくれました。予算内でレベルの高い宿が見つかり幹事として感謝されました。', tag: 'グループ旅行' },
              { name: '岩田 俊夫', role: '出張族・50代', location: '名古屋市', text: '週1〜2回出張があり毎回宿を探す手間が大変でした。出張先と条件を入れると最適なビジネスホテルをすぐ出してくれます。チェックインとチェックアウトの時間も配慮した提案で助かっています。', tag: 'ビジネス出張' },
              { name: '鳥海 和代', role: '温泉巡り趣味・60代', location: '神奈川県', text: '全国の温泉旅館を巡るのが趣味ですが、クチコミが多すぎて選びきれなかったです。露天風呂や料理へのこだわりを細かく入力すると本当に好みに合う旅館を見つけてくれます。最高の宿を発見できました。', tag: '温泉旅行' },
              { name: '関口 裕二', role: '民泊愛好家・30代', location: '東京都', text: 'Airbnbやじゃらんなど複数サービスをまたいで探すのが面倒でした。一括で条件を入れれば横断的に最適な宿を提案してくれます。民泊の隠れた名宿を発見できるのが特に気に入っています。', tag: '民泊・ユニーク宿' },
              { name: '染谷 杏子', role: '子連れ旅行', location: '埼玉県', text: '小さい子ども連れで宿を選ぶのはハードルが高かったです。子どもの年齢と必要な設備を入力したらキッズフレンドリーな宿を選んでくれます。大浴場と子ども食が充実した宿を紹介してもらい、家族全員大満足でした。', tag: '子連れファミリー旅行' },
            ].map((r, i) => (
              <div key={i} className="bg-[#13141f] border border-white/5 hover:border-emerald-500/20 rounded-2xl p-6 space-y-4 flex flex-col transition-all">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1">{r.text}</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                    {r.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm whitespace-nowrap">{r.name}</p>
                    <p className="text-slate-500 text-xs whitespace-nowrap">{r.role} · {r.location}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">{r.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
