import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '特別インタビュー — Ninja3が語る「AIと生きる」という選択 | NextraLabs',
  description: 'AIツール開発者・Ninja3氏への独占インタビュー。なぜAIと向き合い続けるのか、NextraLabsに込めた思い、これからの時代を語る。',
  openGraph: {
    title: '特別インタビュー — Ninja3が語る「AIと生きる」という選択',
    description: 'NextraLabs代表・Ninja3氏への独占インタビュー',
    images: ['/interview/interview-both.png'],
  },
}

const QA = [
  {
    q: 'まず、Ninja3さんがAIに本格的に向き合い始めたきっかけを教えてください。',
    a: [
      '最初は正直、「便利なツールが増えたな」くらいの感覚でした。でも、あるとき自分でAPIを叩いてみたんです。そしたら、もう止まらなくて。',
      '「これ、人間の仕事が変わるんじゃなくて、人間ができることの上限が変わる」って気づいたんですよね。それからは毎日なにか作ってました。',
    ],
  },
  {
    q: 'NextraLabsを立ち上げようと思ったのは？',
    a: [
      'AIってすごいんですけど、使いこなせてる人がまだ全然少ないと思って。情報格差というか、知ってる人と知らない人の差がどんどん開いてるなって。',
      'じゃあ自分が橋を作ろうと。難しいことを難しいまま届けるんじゃなくて、「こんな使い方あるよ」って、具体的なツールの形にして渡したかったんです。',
    ],
  },
  {
    q: 'ツールを作るうえで、一番こだわっていることは何ですか？',
    a: [
      '「本物であること」ですね。これは絶対に曲げない。APIが繋がっていないとか、裏でモックが動いてるとか、そういうのは絶対にやらない。',
      'ユーザーさんが使ったときに「あれ、なんか違う」ってなる瞬間が一番悲しくて。だから、リリースするのは全部、自分が本当に使えると確信したものだけ。',
    ],
  },
  {
    q: '結婚相談所の代表もされていますよね。AIと全然違う世界に見えるんですが。',
    a: [
      'よく言われるんですけど、僕の中では一本の線で繋がってます。AIも婚活も、突き詰めると「人の人生をちょっと前に進める」ってことなんですよね。',
      'テクノロジーだけでも、人の温かさだけでも足りない。両方持ってる人間でありたいなと思って、どちらも続けてます。',
    ],
  },
  {
    q: 'これだけ多岐にわたって活動されていて、しんどいと思う瞬間はないですか？',
    a: [
      'あります、普通に（笑）。「全部やろうとするな」って言われることも多いし、自分でも思うことはある。',
      'ただ、何かが完成したときの感覚が好きすぎるんですよ。ツールが動いた瞬間、誰かに「助かった」って言われた瞬間。その瞬間のためにやってる感じがします。',
    ],
  },
  {
    q: '今後、NextraLabsをどういう場所にしていきたいですか？',
    a: [
      '「AIで困ったらここ来たらいい」って思われる場所にしたいですね。ツールが増えるだけじゃなくて、ここにいると学べる、背中を押してもらえる、そういうコミュニティにしていきたい。',
      'AIって怖くないし、難しくもない。そういうことを日本中に届けるのが、今の自分の使命だと思ってます。',
    ],
  },
  {
    q: '最後に、これを読んでいるユーザーに一言お願いします。',
    a: [
      '全部使ってみてください、まず（笑）。「自分には難しそう」って思ってる人ほど、実際に触るとびっくりするくらい使えるんです。',
      'AIは魔法じゃないけど、使いこなせたら魔法みたいに感じる瞬間がある。その体験を、NextraLabsで届け続けます。一緒に変わっていきましょう。',
    ],
  },
]

export default function InterviewPage() {
  return (
    <main className="min-h-screen bg-[#050507] text-white">

      {/* ヒーロー */}
      <section className="relative overflow-hidden bg-[#0d1117] border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* テキスト */}
            <div className="flex-1 space-y-5">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 tracking-wide uppercase border border-emerald-500/30 rounded-full px-3 py-1 bg-emerald-500/5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Special Interview
              </span>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.15]">
                Ninja3が語る<br />
                <span className="text-emerald-400">「AIと生きる」</span>という選択
              </h1>
              <p className="text-slate-400 text-base leading-relaxed">
                AIツール開発者にして結婚相談所代表——。<br />
                肩書きだけでは語れないその人物像と、<br />
                NextraLabsに込めた本音に迫る独占インタビュー。
              </p>
              <p className="text-xs text-slate-500">Interviewer: NextraLabs 編集部 ／ 2026年5月</p>
            </div>

            {/* メイン画像 */}
            <div className="flex-1 w-full max-w-md">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
                <Image
                  src="/interview/interview-both.png"
                  alt="Ninja3インタビュー"
                  width={800}
                  height={800}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-5 py-4">
                  <p className="text-sm font-medium text-white">Ninja3 × 編集部 対談</p>
                  <p className="text-xs text-slate-400">神奈川・某所にて収録</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* インタビュー本編 */}
      <section className="max-w-3xl mx-auto px-4 py-16 md:py-24 space-y-20">
        {QA.map((item, idx) => (
          <div key={idx} className="space-y-6">
            {/* 質問 */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0d1117] border border-emerald-500/30 flex items-center justify-center">
                <Image
                  src="/interview/interview-reporter.png"
                  alt="記者"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex-1 bg-[#0d1117] border border-white/5 rounded-2xl rounded-tl-sm px-5 py-4">
                <p className="text-xs text-emerald-400 font-medium mb-1">編集部</p>
                <p className="text-white font-medium leading-relaxed">{item.q}</p>
              </div>
            </div>

            {/* 回答 */}
            <div className="flex gap-4 items-start flex-row-reverse">
              <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border border-emerald-500/40">
                <Image
                  src="/interview/interview-ninja.png"
                  alt="Ninja3"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 bg-[#13141f] border border-emerald-500/10 rounded-2xl rounded-tr-sm px-5 py-4 space-y-3">
                <p className="text-xs text-slate-400 font-medium mb-1 text-right">Ninja3</p>
                {item.a.map((para, pi) => (
                  <p key={pi} className="text-slate-200 leading-relaxed text-sm md:text-base">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {idx < QA.length - 1 && (
              <div className="border-b border-white/5 pt-4" />
            )}
          </div>
        ))}
      </section>

      {/* エンディング */}
      <section className="bg-[#0d1117] border-t border-white/5 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-500/40 mx-auto shadow-lg shadow-emerald-500/10">
            <Image
              src="/interview/interview-ninja.png"
              alt="Ninja3"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-white font-semibold text-lg">Ninja3</p>
            <p className="text-slate-400 text-sm mt-1">NextraLabs 代表 ／ AIツール開発者 ／ 結婚相談所 マリッジロードジャパン 代表</p>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
            「AIで人の人生を前に進める」をミッションに、20以上のAIツールを開発・提供。
            神奈川県在住。日々ツールを磨きながら、ユーザーと一緒に新しい使い方を探し続けている。
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href="https://nextralab.jp"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 text-sm"
            >
              NextraLabsのツールを見る →
            </a>
            <a
              href="https://marriage-road-site.vercel.app"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-transparent border border-white/20 hover:border-emerald-500/50 text-white font-medium rounded-lg transition-all duration-200 text-sm"
            >
              マリッジロードジャパン
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
