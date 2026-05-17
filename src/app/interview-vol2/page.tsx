import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '特別インタビュー Vol.2 — Ninja3が語る「AI最前線2026」 | NextraLabs',
  description: '2026年のAIトレンド、エージェントAI、個人開発者の戦略、NextraLabsの次の一手——Ninja3が今最も熱く語りたいことをすべて話した。',
  openGraph: {
    title: '特別インタビュー Vol.2 — Ninja3が語る「AI最前線2026」',
    description: '2026年のAIトレンド、エージェントAI、個人開発者の戦略を語る。',
    images: ['/ogp/interview2.png'],
  },
}

const QA = [
  {
    q: '前回のインタビューからしばらく経ちましたが、2026年に入ってAIの進化スピードが一段と上がった印象があります。Ninja3さんは今、どんな感覚で日々を過ごしていますか？',
    a: [
      '正直、去年とは全然空気が違う、という感じがしています。2024年〜2025年って「すごいものが出てきた、さあどう使う？」という探索期だったと思うんですよ。でも2026年に入って、「これ、もう業務に組み込まなきゃ乗り遅れる」という空気になってきた。',
      'ChatGPTを「試してみた」で止まってた人が、今年は「毎日使わないと仕事が終わらない」という状態になりつつある。この変化が一番大きいなと思ってます。',
    ],
  },
  {
    q: '2026年で最も注目しているAI技術・トレンドを教えてください。',
    a: [
      '「AIエージェント」の本格普及ですね。これは間違いなく一番のトレンドだと思ってます。',
      'これまでの生成AIって、「質問したら答える」という一問一答の構造だったじゃないですか。でもエージェントAIは違う。「この仕事を完成させて」って指示すると、自分でタスクを分解して、必要なツールを呼び出して、途中で判断もして、最後まで完結させる。',
      '「実行するAI」への進化、ですよね。これが日常業務に入り込んでくると、働き方が根本から変わる。そこはかなり注視してます。',
    ],
  },
  {
    q: 'AIエージェントって、具体的にどんな場面で使われ始めていますか？',
    a: [
      '一番わかりやすいのは「営業の自動化」ですね。リスト収集→メール作成→送信→返信対応→アポ管理——これ全部エージェントが回す、という事例がもう出始めてる。',
      'あとは「情報収集・レポート作成」。競合調査を依頼したら、自分でいくつものサイトを巡回して、まとめて、整形して、スライドまで作ってくれる。人間がやったら半日かかる仕事が30分以内に終わる。',
      'NextraLabsのツールも、この方向に進化させていきたいと思ってます。「ボタンを押す」じゃなくて「お願いする」に変えていく。',
    ],
  },
  {
    q: 'マルチモーダルAI——テキストだけでなく、画像・音声・動画も扱えるAI——も進化が著しいですよね。',
    a: [
      'これは体感として、もうレベルが全然違う。1年前と比べると、画像や動画の生成クオリティが「実用レベル」を完全に超えてる。',
      'Kling V3で動画を作ったことがあるんですが、あのクオリティを去年の自分に見せたら信じないですよ（笑）。テキスト一行で、映画のワンシーンみたいな映像が出てくる。',
      'これがNextraLabsのツール展開にも直結していて、「文章を書くAI」だけじゃなくて「映像を作るAI」「音声を作るAI」を組み合わせた、マルチメディアなコンテンツ生成が当たり前になる。クリエイターの人たちは本当にチャンスの時代だと思います。',
    ],
  },
  {
    q: '「AIが仕事を奪う」という議論も続いていますが、2026年時点でNinja3さんはどう見ていますか？',
    a: [
      '「奪われる仕事」と「生まれる仕事」が同時に起きているフェーズだと思ってます。',
      '単純な繰り返し作業——定型メール、データ入力、単純な画像加工——は確実にAIに移っていく。でも一方で、「AIを使いこなす人」「AIと人間の橋渡しをする人」「AIが生成したものに人間の価値観を加える人」の需要がどんどん増えてる。',
      '僕自身もそこにいるわけで。NextraLabsってある意味「AIと人間の翻訳業」だと思ってます。難しい技術を、使える形に翻訳する。この仕事は、AIが進化するほど価値が上がる。',
    ],
  },
  {
    q: '「AIネイティブ」という言葉も聞くようになりました。どういう人材が求められると思いますか？',
    a: [
      '「AIをツールとして当然使いこなす人」ですよね。ちょうど今の時代、エクセルが使えることが当たり前みたいに、AIが使えることが当たり前になる。その移行期が、まさに今2026年だと思ってます。',
      'ただ「使える」の定義が大事で、ただChatGPTで質問できる、じゃ足りなくなってきてる。どのAIをどの場面で使い分けるか、プロンプトをどう設計するか、出力の品質をどう判断するか——この「AI運用力」みたいなものが、これから一番差がつくスキルだと思います。',
      'NextraLabsが目指してるのも、まさにそこの底上げなんですよ。',
    ],
  },
  {
    q: '「小さい個人・個人事業主がAIでどこまで戦えるか」という観点ではいかがですか？',
    a: [
      'これが一番面白いところで、今は「個人が最強の時代」になりつつあると思ってます。',
      '以前は、ちゃんとしたプロダクトを作るには、エンジニア・デザイナー・ライター・マーケター……チームが必要だった。でも今は全部AIが肩代わりしてくれる。僕みたいに一人でもNextraLabsを動かせるのは、AIが「チームの代わり」になってくれてるからです。',
      '大企業が重い組織で動いてる間に、個人やスモールチームが超高速でプロダクトを出せる。この速度差は、2026年以降もっと広がると思ってます。「人数じゃなくてAI活用度で勝負が決まる時代」に本格的に入ってきた。',
    ],
  },
  {
    q: '一方で、AIを使いすぎることへのリスクや懸念もあると思います。Ninja3さんが気をつけていることは？',
    a: [
      '「AIを盲信しない」ことですね。AIって自信満々に嘘をつくことがある（笑）。ハルシネーション問題ってやつですが、出力をそのまま使う前に、「本当にこれ正しいか」という確認をサボらないようにしてます。',
      'あとは「判断の主体を人間に残す」こと。AIに任せる部分は増やせばいいけど、最終的にGOを出すのは自分。特に、ユーザーさんに届くものについては、AI任せにしない。そこだけは絶対に自分の目を通します。',
      '責任を持てないアウトプットを出さない——これはAI時代でも変わらないし、むしろAIが使いやすくなるほど、この姿勢が大事になると思ってます。',
    ],
  },
  {
    q: '日本のAI活用の現状について、正直なところを聞かせてください。',
    a: [
      '遅れてるけど、ポテンシャルは高い、という感じです。',
      '企業レベルで見ると、大企業の導入が遅い。文化的に「新しいものを試す」ことへのハードルが高いし、セキュリティやコンプライアンスの壁もある。でも個人レベルでは、すごく前向きな人が増えてきた。',
      '日本って、新しい技術が「一般の人に使いやすい形」に整備された瞬間に一気に広がる国だと思ってる。スマートフォンがまさにそうだった。AIでも同じことが起きると思ってて、NextraLabsはその「整備する側」にいたい。',
    ],
  },
  {
    q: 'NextraLabsとして、2026年後半から2027年にかけてどんな動きをしていく予定ですか？',
    a: [
      '大きくは3つです。',
      'ひとつ目は「AIエージェント機能の組み込み」。今のツールって、まだ「ここを入力したら出力が出る」という段階なんですよ。これをもっと自律的に、「こういう状況になったらAIが自分で動く」という形に進化させたい。',
      'ふたつ目は「音声・動画生成との統合」。テキストだけじゃなくて、インプットしたら記事もできる、画像もできる、動画もできる——ワンストップで。コンテンツ制作の全工程をNextraLabsで完結できるようにしたいと思ってます。',
      'みっつ目は「コミュニティの強化」。ツールを使うだけじゃなくて、使い方を共有できる、仲間が見つかる。そういう場所にしていきたい。AI活用って、孤独でやるより仲間がいる方が絶対に速く上達するので。',
    ],
  },
  {
    q: '最後に、「2026年のAIの波に乗り遅れたくない」と焦りを感じている人へ、メッセージをお願いします。',
    a: [
      '「焦らなくていい、でも動かなきゃいけない」ですね。',
      'AIは毎日進化してるけど、今日始めた人が明日始めた人に大きく負けることはない。でも「いつか始める」を続けてると、差は確実に広がっていく。',
      '始め方はシンプルで、「今日の仕事を一個だけAIに頼んでみる」こと。メールの返信文を書いてもらうでも、アイデア出しを手伝ってもらうでも、何でもいい。その「一回目」の体験が、全てを変えます。',
      'NextraLabsは、その「一回目」が怖くない場所でありたいと思ってます。難しくない、失敗してもいい、気軽に試せる——そういう入口を、これからもずっと用意し続けます。AI時代、一緒に楽しんでいきましょう。',
    ],
  },
]

export default function InterviewVol2Page() {
  return (
    <main className="min-h-screen bg-[#050507] text-white">

      {/* ヒーロー */}
      <section className="relative overflow-hidden bg-[#0d1117] border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* テキスト */}
            <div className="flex-1 space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 tracking-wide uppercase border border-emerald-500/30 rounded-full px-3 py-1 bg-emerald-500/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Special Interview Vol.2
                </span>
                <a href="/interview" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors underline underline-offset-2">
                  ← Vol.1を読む
                </a>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.15]">
                Ninja3が語る<br />
                <span className="text-emerald-400">「AI最前線2026」</span>
              </h1>
              <p className="text-slate-400 text-base leading-relaxed">
                エージェントAI、個人開発者の未来、そして「次の波」に乗る方法。<br />
                NextraLabs代表が今最も熱く語りたいことをすべて話した。
              </p>
              <p className="text-xs text-slate-500">Interviewer: NextraLabs 編集部 ／ 2026年5月</p>
            </div>

            {/* アイコン */}
            <div className="flex-shrink-0 flex gap-4 items-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10 shadow-xl shadow-black/50">
                  <Image
                    src="/interview/interview-reporter2.png"
                    alt="編集部"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <p className="text-xs text-slate-500">編集部</p>
              </div>
              <div className="text-slate-600 text-2xl font-light">×</div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-full overflow-hidden border border-emerald-500/40 shadow-xl shadow-emerald-500/10">
                  <Image
                    src="/interview/interview-ninja.png"
                    alt="Ninja3"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-slate-500">Ninja3</p>
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
              <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border border-white/10">
                <Image
                  src="/interview/interview-reporter2.png"
                  alt="記者"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
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

      {/* Vol.1 導線 */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <a href="/interview" className="flex items-center justify-between gap-4 bg-[#0d1117] border border-white/5 hover:border-emerald-500/30 rounded-2xl px-6 py-5 transition-all group">
          <div>
            <p className="text-xs text-slate-500 mb-1">前回のインタビューも読む</p>
            <p className="text-white font-medium group-hover:text-emerald-400 transition-colors">
              Vol.1「AIと生きる」という選択 →
            </p>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden border border-emerald-500/30 flex-shrink-0">
            <Image
              src="/interview/interview-ninja.png"
              alt="Ninja3"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        </a>
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
            「AIで人の人生を前に進める」をミッションに、30以上のAIツールを開発・提供。
            2026年のAI最前線を走りながら、誰もが取り残されない未来を作り続けている。
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href="https://nextralab.jp"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 text-sm"
            >
              NextraLabsのツールを見る →
            </a>
            <a
              href="/interview"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-transparent border border-white/20 hover:border-emerald-500/50 text-white font-medium rounded-lg transition-all duration-200 text-sm"
            >
              Vol.1を読む
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
