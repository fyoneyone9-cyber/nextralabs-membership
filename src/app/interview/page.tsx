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
    q: 'PFUクオリティサービスに15年いらっしゃったんですよね。その経験は今に活きていますか？',
    a: [
      'めちゃくちゃ活きてます。PFUって、富士通の子会社でPCのキッティング（設定・展開）を大量にやる会社なんですね。15年いたので、ハードウェアからソフトウェアまで、かなり幅広く触ってました。',
      '特にリーダーとして現場を回してたときは、「いかに効率よく、ミスなく、チームで動くか」をずっと考えてた。今AIツールを作るときも、同じ感覚があります。ユーザーが迷わないUI、抜けのない処理フロー——これって、キッティング現場で叩き込まれた「段取り力」そのものなんですよね。',
      '正直、当時はその15年がこんな形で花開くとは思ってなかった（笑）。でも点と点は繋がるもので、「あのとき学んでおいてよかった」って今すごく思います。',
    ],
  },
  {
    q: 'PFUを辞めて個人事業主に。Uber Eatsや出前館、Amazonflexをやっていた時期がありますよね。その時代に気づいたことは？',
    a: [
      '正直あの時期は、精神的にも経済的にもしんどかった。でも、今となってはあの時期がなかったら僕の根っこはできてなかったなって思います。',
      '配達の仕事って、完全出来高制なんですよ。動いた分だけ稼げるし、動かなければゼロ。そのシンプルさが逆に頭を整理させてくれた。「本当に自分は何がしたいのか」「何に価値を感じるのか」を、走りながら考えてた感じです。',
      'あと、現場で出会うお客さんや街の空気から、「普通の人がどんな生活をしているか」がリアルにわかった。これって、ツール開発するときの視点に直結してます。「AIに詳しくない人でも使える」って意識は、あの時代にしっかり根付いたんだと思います。',
    ],
  },
  {
    q: 'デバイスエージェンシーではIoTソリューションの導入支援エンジニアをされていましたね。どんな経験でしたか？',
    a: [
      'あれは本当にいい経験でした。IoTって言葉はキラキラしてるんですけど、実際は「デバイスと人と、現場のオペレーションをどう繋げるか」っていうめちゃくちゃ泥臭い仕事なんですよ（笑）。',
      'Pythonを使ってAPI連携を組んだり、センサーのデータを可視化したり。「ハードとソフトの橋渡し」をするのが役割でした。でもそれって、AIツール開発と全く同じ構造なんですよね。LLMというエンジンと、ユーザーインターフェースと、バックエンドのAPIを繋げる——やってることの本質は変わってない。',
      '技術的な自信がついたのもあるし、「ITって結局、課題解決のための道具」って腹落ちしたのもこの時期です。かっこいいものを作るんじゃなく、誰かの問題を解くものを作る、という軸が定まりました。',
    ],
  },
  {
    q: 'CompTIA Security+、A+、Network+の資格を取られていますね。なぜ取ろうと思ったんですか？',
    a: [
      '正直、最初は「履歴書に書けるから」みたいな動機もありました（笑）。でも取り始めたら本当に面白くて。',
      'CompTIAって国際資格なんですけど、体系的にIT全般を学べるんですよ。Network+はネットワークの基礎、A+はハードウェア・OS、Security+はセキュリティ全般。全部取ることで、「ITの地図」が頭の中にできた感じがしました。',
      'AIツールを作るとき、セキュリティの知識ってめちゃくちゃ重要で。APIキーの管理、認証フロー、データの扱い——ここを雑にしたら信頼を一気に失う。Security+を持ってることで、「この設計で大丈夫か」のチェックが自分でできるんです。資格は取って終わりじゃなくて、使ってなんぼだなって実感してます。',
    ],
  },
  {
    q: '上級心理カウンセラーの資格も持っていると聞きました。AIとどう関係があるんですか？',
    a: [
      'これ、よく「え、なんで？」って言われるんですよ（笑）。でも僕の中では完全に繋がってます。',
      '婚活の仕事をするうえで、心理学はどうしても必要でした。人がなぜ動けないのか、なぜ選べないのか、なぜ傷つくのか——そこを理解しないと、本当の意味でサポートできない。それで取ったのが上級心理カウンセラーです。',
      'で、AIツール設計にも実はめちゃくちゃ使えるんですよ。「このUIだとユーザーが不安になる」「この言葉の選び方だと壁を感じる」「成功体験を先に与えないと続かない」——これって全部、行動心理学の話。AIにカウンセラーの視点を組み込むと、単なる「便利なツール」じゃなくて「使い続けたくなるツール」になるんです。技術と心理、この掛け算が僕の強みだと思ってます。',
    ],
  },
  {
    q: '結婚相談所「マリッジロードジャパン」の代表もされていますよね。AIと全然違う世界に見えるんですが。',
    a: [
      'よく言われるんですけど、僕の中では一本の線で繋がってます。AIも婚活も、突き詰めると「人の人生をちょっと前に進める」ってことなんですよね。',
      'テクノロジーだけでも、人の温かさだけでも足りない。両方持ってる人間でありたいなと思って、どちらも続けてます。',
      '婚活の現場では、人の本音とか、迷いとか、恐れとかにめちゃくちゃ向き合います。それがあるから、AIツールを作るときも「使う人はどんな気持ちでここに来てるんだろう」って想像できる。この視点、技術だけの人にはなかなか持てない部分だと思うんです。',
    ],
  },
  {
    q: 'NextraLabsを立ち上げようと思ったのは？',
    a: [
      'AIってすごいんですけど、使いこなせてる人がまだ全然少ないと思って。情報格差というか、知ってる人と知らない人の差がどんどん開いてるなって。',
      'じゃあ自分が橋を作ろうと。難しいことを難しいまま届けるんじゃなくて、「こんな使い方あるよ」って、具体的なツールの形にして渡したかったんです。',
      '「AIを使う」じゃなくて「AIで何かできるようになる」体験を提供したい。そのためのプラットフォームがNextraLabsです。ただのツール集じゃなくて、ユーザーが変わっていく場所にしたいと思ってます。',
    ],
  },
  {
    q: 'ツールを作るうえで、一番こだわっていることは何ですか？',
    a: [
      '「本物であること」ですね。これは絶対に曲げない。APIが繋がっていないとか、裏でモックが動いてるとか、そういうのは絶対にやらない。',
      'ユーザーさんが使ったときに「あれ、なんか違う」ってなる瞬間が一番悲しくて。だから、リリースするのは全部、自分が本当に使えると確信したものだけ。',
      'あと、「説明しなくても使える」こと。マニュアルを読まなきゃ使えないツールって、それ設計が失敗してるんですよね。最初の画面で「ああ、これやればいいんだ」ってわかる。そこに全力を注いでます。',
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
    q: '神奈川県海老名市という場所からAI事業をやる、ということに意味はありますか？',
    a: [
      'あると思ってます。東京とか渋谷とかって、IT起業家がうようよいて、情報もお金も集まってくる。でも海老名って、そういう熱量から少し距離があるんですよね。',
      'それが逆に良くて。流行りに流されず、本当に使える・売れるものかどうか、冷静に判断できる。地方の感覚って、意外と「一般ユーザーの感覚」に近かったりする。「これ、本当に普通の人に刺さるか？」を自分でチェックしやすい環境にいると思ってます。',
      'あと、「地方からでもオンラインで世界規模のサービスが作れる」というのを証明したい気持ちもあります。場所は言い訳にならない時代。海老名からでも日本全国、いや世界に届けられるってことを、体で示していきたいです。',
    ],
  },
  {
    q: '一日のスケジュールを教えてもらえますか？AIとどう向き合っているのか気になります。',
    a: [
      'だいたい朝6時くらいに起きて、コーヒー飲みながらまずAIニュースをチェックします。X（Twitter）とかニュースレターをざっと流して、「今日押さえるべき情報」を10分でピックアップ。これは欠かさないですね。',
      '午前中は開発に集中します。AIが一番クリエイティブに使えるのは頭が新鮮なうちだなって思ってて。プロンプトを設計したり、APIの挙動を確かめたり、UIの試作を作ったり。昼過ぎからは婚活のカウンセリングや事務作業が入ったりすることもある。',
      '夜はまた自分の時間で、ツールの改善や新機能の実装。「今日どんな課題に当たったか」をAIと対話しながら整理することも多いです。AIをただ使うんじゃなくて、「考えるパートナー」として扱ってる感じ。一日5〜6時間はAIと何らかの形で関わってると思います。',
    ],
  },
  {
    q: 'これまでで一番大きな失敗って、何ですか？',
    a: [
      '正直に言うと、過去に「完璧になってからリリースしよう」って思いすぎて、ずっとリリースできなかったツールがあります。結局そのアイデア、半年後に海外のサービスが先にやっちゃって（笑）。',
      'あれは本当に悔しかった。でも学んだのは「完璧を待ってたら永遠に出せない」ということ。今は「60点でもいいから出して、ユーザーの反応を見ながら磨く」に切り替えてます。早く出す勇気は、失敗から学びました。',
      'もう一個は、一人でやろうとしすぎたこと。最初期は全部自分でやりたくて、助けを求めるのが苦手だった。でも今は、ツールごとに強みのある人と組んだり、コミュニティに頼ったりする。弱さを見せることも、長く続けるための戦略だなって今は思ってます。',
    ],
  },
  {
    q: '失敗から学んだことを、ユーザーに伝えるとしたらどんな言葉になりますか？',
    a: [
      '「うまくいかないのは、まだやってる証拠」ですかね。失敗って終わりじゃなくて、フィードバックだと思ってるんです。AIで言えばエラーログみたいなもので、次の改善につながる情報が詰まってる。',
      'ただ、失敗を無駄にしない技術が必要で。「なぜうまくいかなかったか」を言語化すること。これをAIと一緒にやると、意外と整理しやすかったりします。「失敗の振り返りをAIに手伝ってもらう」って使い方、実はすごくおすすめです。',
    ],
  },
  {
    q: '好きな言葉や座右の銘はありますか？',
    a: [
      '「凡事徹底」ですね。ちゃんとやるべきことをちゃんとやる、それだけ。カッコよくない言葉かもしれないけど（笑）、これが一番難しいし、一番強いと思ってます。',
      'AIって結局、使う人間の「ちゃんとやる力」が問われる道具だと思うんですよ。AIを使えばラクになる、でも楽して成果は出ない。プロンプトを磨く、データを整える、フィードバックを反映する——地味な積み重ねなくしては、AIは力を発揮しない。',
      '「凡事徹底」をAI時代に翻訳すると、「基礎をしっかり、丁寧に続ける」ってことだと僕は思ってます。派手なハックより、地道な改善の積み重ねの方が、長く強くなれる。そう信じてNextraLabsを続けてます。',
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
      '3年後は、ツールが100本を超えてる状態を目指してます。ただ数を増やすだけじゃなくて、「ジャンルごとに最高のAIツールが揃ってる場所」にしたい。家計管理、キャリア設計、副業、Kindle出版、婚活——人生の主要な課題に全部AIで向き合えるプラットフォーム。',
      '5年後は、正直「場所」の概念を超えたいと思ってます。NextraLabsのAIが、ユーザーの生活に溶け込んで、「これがいないと困る」って言ってもらえる存在になること。スマートホームのAIアシスタントみたいに、生活インフラになれたら最高だなって。',
      'あと個人的には、日本発のAIツールが世界で使われる事例を作りたい。海老名から世界へ、は大げさじゃなく本気で狙ってます。',
    ],
  },
  {
    q: 'これだけ多岐にわたって活動されていて、しんどいと思う瞬間はないですか？',
    a: [
      'あります、普通に（笑）。「全部やろうとするな」って言われることも多いし、自分でも思うことはある。',
      'ただ、何かが完成したときの感覚が好きすぎるんですよ。ツールが動いた瞬間、誰かに「助かった」って言われた瞬間。その瞬間のためにやってる感じがします。',
      'しんどくなったときは、原点に戻るようにしてます。「なんでこれ作ったっけ」「誰のために動いてるんだっけ」って。ユーザーの声を読み直したり、初期のメモを見返したり。それだけでかなり回復する（笑）。メンタルの管理も、カウンセラー資格が地味に役立ってます。',
    ],
  },
  {
    q: 'NextraLabsのメンバーシップに入るかどうか悩んでいる人に、何か言葉をかけるとしたら？',
    a: [
      '「迷ってるなら、とりあえず触ってみてください」ですね。百聞は一見にしかずで、AIツールって使ってみないと良さが伝わらない。',
      '僕が作ったツールって、全部「自分が本当に欲しかったもの」なんですよ。だから「こういう悩みを持つ人は絶対に刺さる」って自信がある。具体的には、副業を始めたい・Kindleで出版したい・お金の管理を見直したい・AIを仕事に使いたい——この辺りに一つでも当てはまるなら、絶対に元が取れると思ってます。',
      'あと、コミュニティにいるってことの価値も伝えたい。一人でAI学ぶのって孤独だし、情報の取捨選択が大変。NextraLabsにいれば、厳選された情報と、同じ方向を向いた仲間と、実際に使えるツールが揃ってる。それだけで、前進するスピードが全然違います。',
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
            神奈川県海老名市在住。CompTIA Security+/A+/Network+ 取得。上級心理カウンセラー。
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
