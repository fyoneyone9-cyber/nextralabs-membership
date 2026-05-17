import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '特別インタビュー — Ninja3が語る「AIと生きる」という選択 | NextraLabs',
  description: 'AIツール開発者・Ninja3氏への独占インタビュー。なぜAIと向き合い続けるのか、NextraLabsに込めた思い、これからの時代を語る。',
  openGraph: {
    title: '特別インタビュー — Ninja3が語る「AIと生きる」という選択',
    description: 'NextraLabs代表・Ninja3氏への独占インタビュー',
    images: ['/ogp/interview.png'],
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
    q: '「30のAIツール使い放題」というコンセプトはどこから来ているんですか？',
    a: [
      'ひとつのツールだけだと、「特定の用途にしか使えない」ってなるじゃないですか。でも人の生活って、副業も、家計管理も、SNSも、Kindle出版も——全部バラバラに存在してる。',
      'だから「この人の生活を丸ごと変えられるプラットフォーム」にしたかったんです。30本揃えたのは、「どこかで必ず刺さる」を作りたかったから。一本でも「これ欲しかった」ってなってくれたら、もうそこから始まります。',
      'あと正直、自分が使いたくて作ってるものがほとんどで（笑）。「これあったら便利なのに、なんで誰も作ってないんだろう」を全部形にしてる感じです。',
    ],
  },
  {
    q: 'ツールを作るうえで、一番こだわっていることは何ですか？',
    a: [
      '「本物であること」ですね。これは絶対に曲げない。APIが繋がっていないとか、裏でモックが動いてるとか、そういうのは絶対にやらない。',
      'ユーザーさんが使ったときに「あれ、なんか違う」ってなる瞬間が一番悲しくて。だから、リリースするのは全部、自分が本当に使えると確信したものだけ。',
      'あと「説明しなくても使える」こと。マニュアルを読まなきゃ使えないツールって、それ設計が失敗してるんですよね。最初の画面で「ああ、これやればいいんだ」ってわかる。そこに全力を注いでます。',
    ],
  },
  {
    q: '「業務自動化」というキーワードを前面に出していますよね。具体的にどんな場面を想定していますか？',
    a: [
      'たとえばSNS投稿って、毎日考えて、書いて、画像を用意して、投稿して——それだけで週3〜4時間消えていく人もいるんですよ。それをAIが肩代わりしてくれたら、その時間が丸ごと戻ってくる。',
      'Kindle出版も同じで、「書きたいけど何から始めればいいかわからない」って人が、ナビゲートされながら出版まで辿り着ける。「副業の壁」って知識不足と手間なんですよね。AIがその両方を解消してくれる。',
      'NextraLabsが目指してるのは「時間を取り戻す」こと。ユーザーさんに本当にやりたいことに集中してほしくて、その邪魔をしてる雑務をぜんぶAIに任せる——それが僕のビジョンです。',
    ],
  },
  {
    q: 'KDP出版ナビ、AI家計防衛、AI副業スタートダッシュなど、生活密着型のツールが多いですね。なぜこのジャンルを選んだんですか？',
    a: [
      'AIって「ビジネス用途」のイメージが強いじゃないですか。でも日常生活で困ってることって山ほどある。お金のこと、副業のこと、情報発信のこと。そこにAIが入っていない理由がないな、と。',
      '特にKindle出版は、「書いてみたい気持ちはあるけど出版のプロセスが複雑すぎてやめた」って人が本当に多い。そのプロセスをAIが一緒に歩いてくれるだけで、世に出なかった本が出る。それってすごいことだなって。',
      '家計管理や副業も同じで、「やりたいのに踏み出せない」人の背中を押すのがNextraLabsのツールの役割だと思ってます。ハードルを下げることがイノベーションだと思ってるので。',
    ],
  },
  {
    q: '無料プランからプレミアムまで、段階的な料金設計になっていますよね。この設計の意図は？',
    a: [
      'まず「触らないと良さが伝わらない」のがAIツールだと思ってて。だから無料でもちゃんと使えるものを入れてあります。「試して、好きになって、もっと使いたくなったら課金する」という順番にしたかった。',
      '月980円、1980円という価格設定も意識的で。「高いから迷う」じゃなくて、「これで仕事が楽になるなら安い」ってすぐ判断できる金額にしてます。個別にAPIツール契約したら軽く月5万超えるような内容が入ってるので、むしろ激安だと思ってる（笑）。',
    ],
  },
  {
    q: 'AIツールを「日常に使える形」にする難しさってどんなところですか？',
    a: [
      'これがね、一番難しいんですよ（笑）。技術的な実装より、むしろここに時間がかかる。',
      'AIって、プロンプト次第でものすごくいい答えを出せるけど、逆にプロンプトがダメだとゴミしか返ってこない。でも一般の人に「プロンプトを工夫して」って言っても難しいじゃないですか。だからツール側で、最適なプロンプトを裏に隠して、ユーザーは選択肢をいくつか選ぶだけで高品質な出力が得られる——そういう設計にしてます。',
      '「黒魔術を、白魔術に変換する」みたいな感覚ですね（笑）。難しい呪文を唱えなくても魔法が使える状態を作る。これが僕のやりたいことの本質です。',
    ],
  },
  {
    q: 'ユーザーからの反応で、特に印象に残っているものはありますか？',
    a: [
      '「SNS投稿が完全自動化できて、週4時間の作業が消えました」ってメッセージをもらったときは本当に嬉しかった。4時間って、けっこうな自由時間ですよね。それが毎週戻ってくる。',
      'あと「Kindle出版ナビで初めての電子書籍を出版できました！」って連絡もきて。その人、何年も「いつか出版したい」って思い続けてた方らしくて。ツールがその「いつか」を「今日」に変えたっていう話を聞いて、これを作ってよかったと思いましたね。',
      '嬉しいのと同時に、「もっといいものにしなきゃ」という気持ちにもなります。ユーザーさんの声が、次のバージョンを作るエネルギーに直結してます。',
    ],
  },
  {
    q: 'YouTubeチャンネル連携やSNS自動投稿など、クリエイター向けの機能も充実していますね。',
    a: [
      'クリエイターの人って、「作る」ことに集中したいのに「発信する」作業に時間を取られすぎてるな、というのを見てて思ってたんですよね。',
      'YouTube動画の企画書を作ったり、サムネのアイデアを出したり、概要欄を書いたり——これ全部AIに任せられる。そうすると「撮る・編集する」という本質的な部分に集中できる。クリエイターの生産性を上げるのも、NextraLabsのテーマのひとつです。',
    ],
  },
  {
    q: 'ホテルや民泊向けのエンタープライズプランもありますよね。B2C以外にも広げていく意図は？',
    a: [
      'そうですね。チェックインの自動化とか、多言語対応とか、スタッフ不足に悩む宿泊施設って本当に多くて。AIがその問題を解決できると思ってます。',
      'B2CとB2Bを両方やるのは大変ではあるんですが、「AIで業務を楽にする」という本質は同じ。個人のフリーランスも、ホテル経営者も、困ってることの構造は一緒なんですよ。「やるべきことが多すぎる、時間が足りない」——そこにNextraLabsが入れる余地があると思ってます。',
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
    q: '3年後・5年後のNextraLabsのビジョンを聞かせてください。',
    a: [
      '3年後は、ツールが100本を超えてる状態を目指してます。ただ数を増やすだけじゃなくて、「ジャンルごとに最高のAIツールが揃ってる場所」にしたい。家計管理、キャリア設計、副業、Kindle出版——人生の主要な課題に全部AIで向き合えるプラットフォーム。',
      '5年後は、「場所」の概念を超えたいと思ってます。NextraLabsのAIが、ユーザーの生活に溶け込んで、「これがいないと困る」って言ってもらえる存在になること。スマートホームのAIアシスタントみたいに、生活インフラになれたら最高だなって。',
      'あと個人的には、日本発のAIツールが世界で使われる事例を作りたい。場所は言い訳にならない時代。日本中から、そして世界に届けられるってことを、体で示していきたいです。',
    ],
  },
  {
    q: 'これだけ多岐にわたって活動されていて、しんどいと思う瞬間はないですか？',
    a: [
      'あります、普通に（笑）。「全部やろうとするな」って言われることも多いし、自分でも思うことはある。',
      'ただ、何かが完成したときの感覚が好きすぎるんですよ。ツールが動いた瞬間、誰かに「助かった」って言われた瞬間。その瞬間のためにやってる感じがします。',
      'しんどくなったときは、原点に戻るようにしてます。「なんでこれ作ったっけ」「誰のために動いてるんだっけ」って。ユーザーの声を読み直したり、初期のメモを見返したり。それだけでかなり回復する（笑）。',
    ],
  },
  {
    q: 'NextraLabsのメンバーシップに入るかどうか悩んでいる人に、何か言葉をかけるとしたら？',
    a: [
      '「迷ってるなら、とりあえず触ってみてください」ですね。百聞は一見にしかずで、AIツールって使ってみないと良さが伝わらない。',
      '無料プランでもちゃんとしたツールが使えるので、まずゼロリスクで試せます。「これ便利だな」って思ったら、そのまま課金してくれればいい。それだけのシンプルな構造にしてます。',
      'あと、コミュニティにいることの価値も伝えたい。一人でAI使っても孤独だし、情報の取捨選択が大変。NextraLabsにいれば、厳選された情報と、同じ方向を向いた仲間と、実際に使えるツールが揃ってる。それだけで、前進するスピードが全然違います。',
    ],
  },
  {
    q: 'AIに仕事を任せることへの不安を感じている人へ、メッセージはありますか？',
    a: [
      'めちゃくちゃわかります、その気持ち。僕も最初は「本当にこれで大丈夫か」って疑いながら使ってましたから。',
      '正直なところを言うと、AIは「全部任せられるスーパーマン」じゃないんです。「ここまでやってくれるアシスタント」です。最終的な判断は人間がする。でも「下準備」「情報整理」「下書き作成」あたりは、今のAIがものすごく上手い。そこを任せるだけで、作業時間が半分以下になる人は多いと思います。',
      'まず「このひとつの作業だけ試してみよう」くらいの気持ちで使い始めてみてください。それで体感できます。怖くなくなります。',
    ],
  },
  {
    q: '競合他社や他のAIツールサービスと、NextraLabsは何が違いますか？',
    a: [
      '「日本人の日常にフォーカスしてる」ことが一番の違いだと思ってます。海外のAIサービスって当然、英語圏の課題から作られてる。日本の家計管理の感覚とか、Kindle出版の流れとか、日本語でのSNS発信の特性とか——そこをちゃんと理解した上でツールを作ってるのが強みだと思ってます。',
      'あと、全部自分で作って、自分で使ってるので、「使い物にならないツールをリリースする」ってことが構造上起きにくい（笑）。自分がユーザーゼロ号なので、「これ不便だな」はすぐ直します。',
    ],
  },
  {
    q: '今後追加予定のツールや機能はありますか？ちょっとだけ教えてください（笑）。',
    a: [
      '笑、いくつか仕込んでるんですが——AIと連携した「週次振り返りアシスタント」は近いうちに出したいと思ってます。一週間を振り返って、次の行動を整理してくれるやつ。',
      'あと、ユーザーさんから「メール返信の自動化が欲しい」っていう声が多くて。これも開発中です。「このメールにどう返す？」ってAIに相談できる機能、絶対みんな使うよなって思ってます。',
      'まだ言えないものもあるんですが（笑）、毎月何かしら増えていきます。メンバーシップに入ってる人が一番早く触れる形にしてるので、そこはメリットのひとつです。',
    ],
  },
  {
    q: '好きな言葉や、開発時に意識していることはありますか？',
    a: [
      '「凡事徹底」ですね。ちゃんとやるべきことをちゃんとやる、それだけ。カッコよくない言葉かもしれないけど（笑）、これが一番難しいし、一番強いと思ってます。',
      'AIを使えばラクになる、でも楽して成果は出ない。プロンプトを磨く、ユーザーの声を反映する、UIを細かく直す——地味な積み重ねなくしては、どんないいツールも本物にならない。その地道さを大事にしてます。',
    ],
  },
  {
    q: '最後に、これを読んでいるユーザーに一言お願いします。',
    a: [
      '全部使ってみてください、まず（笑）。「自分には難しそう」って思ってる人ほど、実際に触るとびっくりするくらい使えるんです。',
      'AIは魔法じゃないけど、使いこなせたら魔法みたいに感じる瞬間がある。その体験を、NextraLabsで届け続けます。一緒に変わっていきましょう。',
      'そして、これを読んでくれてること自体が、もう一歩踏み出してる証拠だと思う。行動するかどうかで、1年後の景色が全然変わります。NextraLabsはその「一歩」を、ずっと応援し続けます。',
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

      {/* Vol.2 導線 */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <a href="/interview-vol2" className="flex items-center justify-between gap-4 bg-[#0d1117] border border-emerald-500/20 hover:border-emerald-500/50 rounded-2xl px-6 py-5 transition-all group">
          <div>
            <p className="text-xs text-emerald-400 font-medium mb-1">続編が公開されました</p>
            <p className="text-white font-medium group-hover:text-emerald-400 transition-colors">
              Vol.2「AI最前線2026」を読む →
            </p>
            <p className="text-xs text-slate-500 mt-1">エージェントAI・個人開発者の戦略・NextraLabsの次の一手</p>
          </div>
          <div className="flex-shrink-0 text-2xl">🚀</div>
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
            日々ツールを磨きながら、ユーザーと一緒に新しい使い方を探し続けている。
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
