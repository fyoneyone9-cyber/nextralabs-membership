'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Check, ArrowLeft, RefreshCw, Shield, Clock, MessageSquare } from 'lucide-react'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────
type Relationship = 'in-laws' | 'relatives' | 'boss' | 'neighbor' | 'other'
type Tone = 'gentle' | 'firm' | 'iron'
type Situation = 'visit' | 'event' | 'money' | 'lifestyle' | 'child' | 'other'

interface Reply {
  text: string
  readDelay: string
  tip: string
}

// ─── Data ────────────────────────────────────────────────
const RELATIONSHIPS: Record<Relationship, string> = {
  'in-laws': '義父母',
  'relatives': '親戚',
  'boss': '上司・先輩',
  'neighbor': '近所・ご近所',
  'other': 'その他',
}

const TONES: Record<Tone, { label: string; desc: string }> = {
  gentle: { label: 'やんわり', desc: '柔らかく、でも断る' },
  firm: { label: 'しっかり', desc: '理由を明確にして断る' },
  iron: { label: '鉄壁', desc: '一切の隙を与えない' },
}

const SITUATIONS: Record<Situation, string> = {
  visit: '訪問・帰省の要求',
  event: '法事・行事への参加',
  money: 'お金の無心・援助',
  lifestyle: '生活への干渉・説教',
  child: '子供・孫・結婚の催促',
  other: 'その他の重い頼み',
}

const TEMPLATES: Record<Situation, Record<Tone, string[]>> = {
  visit: {
    gentle: [
      'お気持ちはとても嬉しいです。ただ、最近ちょっとバタバタしておりまして…落ち着いたらこちらからご連絡させてください 🙇',
      'いつもお気遣いありがとうございます。今はちょっと予定が立てづらい状況でして、また改めてご相談させてください。',
      'ありがとうございます！少し体調を整えてからにしたいので、また時期が来たらこちらからお声がけしますね。',
    ],
    firm: [
      'お誘いありがとうございます。申し訳ありませんが、当面は仕事の都合でお伺いするのが難しい状況です。落ち着きましたらご連絡いたします。',
      'ありがたいお話ですが、現在の生活リズム的に週末の外出が厳しく、お約束できかねます。申し訳ございません。',
      'お気持ちは重々承知しておりますが、しばらくは家庭の事情で遠出を控えております。ご理解いただけますと幸いです。',
    ],
    iron: [
      'ご連絡ありがとうございます。恐れ入りますが、訪問の予定は当面ございません。こちらの都合がつきましたらお知らせいたします。',
      '今後の訪問については、こちらから改めてご連絡差し上げます。お気遣いなくお過ごしください。',
      '申し訳ございませんが、当分の間お伺いすることは叶いません。何卒ご了承ください。',
    ],
  },
  event: {
    gentle: [
      '大切な行事なのに申し訳ありません。あいにくその時期は外せない用事がありまして…お気持ちだけでも届けさせてください。',
      'ご案内ありがとうございます。残念ながら都合がつかず…。心ばかりですがお供え（お香典）をお送りさせていただきます。',
      '行事のお知らせありがとうございます。今回は参加が難しそうです。次の機会にはぜひ。',
    ],
    firm: [
      'ご案内いただきありがとうございます。誠に申し訳ありませんが、仕事の関係で参加が難しい状況です。別途お気持ちをお送りさせていただきます。',
      '大変恐縮ですが、スケジュールの都合上、今回は欠席とさせていただきます。ご了承ください。',
      '日程を確認いたしましたが、残念ながら調整がつきませんでした。申し訳ございません。',
    ],
    iron: [
      'ご連絡ありがとうございます。今回の行事への参加は見送らせていただきます。ご了承ください。',
      '恐れ入りますが、今回は欠席いたします。今後の行事についても、参加可能な場合はこちらからご連絡いたします。',
      '申し訳ございませんが、出席は叶いません。何卒よろしくお願いいたします。',
    ],
  },
  money: {
    gentle: [
      'お力になりたい気持ちはあるのですが、我が家も今ちょっと余裕がなくて…。お役に立てず申し訳ありません。',
      'ご事情はお察ししますが、こちらも家計が厳しい時期でして…。本当に申し訳ないのですが、今回はご期待に沿えそうにありません。',
      'お気持ちはわかります。ただ、うちもローンなどがあって金銭的な援助は難しい状況です。他の形でお力になれることがあれば。',
    ],
    firm: [
      '大変恐れ入りますが、金銭的なご援助は我が家の方針としてお受けしておりません。ご理解いただけますと幸いです。',
      'お話は承りましたが、家計の事情により金銭面でのご協力は致しかねます。何卒ご了承ください。',
      '申し訳ございませんが、経済的な支援については対応いたしかねます。他にお手伝いできることがあればお申し付けください。',
    ],
    iron: [
      '金銭のご相談については、一切お受けしておりません。ご了承ください。',
      '恐れ入りますが、金銭面でのご要望にはお応えできません。今後同様のご相談はご遠慮いただけますようお願いいたします。',
      '申し訳ございませんが、お金に関するお話はお受けいたしかねます。ご理解のほどよろしくお願いいたします。',
    ],
  },
  lifestyle: {
    gentle: [
      'アドバイスありがとうございます。参考にさせていただきますね。夫婦で相談しながらやっていきますので、見守っていただけると嬉しいです 😊',
      'ご心配いただきありがとうございます。いろいろ試行錯誤中ですが、二人で頑張っていますので大丈夫です！',
      'お気遣いありがとうございます。今の生活スタイルが私たちには合っているので、このまま続けていこうと思っています。',
    ],
    firm: [
      'ご意見ありがとうございます。ただ、生活のことについては夫婦で話し合って決めておりますので、ご理解いただけますと助かります。',
      'お気持ちは十分伝わっております。ですが、各家庭にはそれぞれの事情がありますので、私たちのやり方を尊重していただけると幸いです。',
      'アドバイスをいただくのはありがたいのですが、生活面のことは私たちで判断させていただいております。',
    ],
    iron: [
      '生活に関することは私たち夫婦で決めております。ご意見は承りますが、判断はこちらでいたします。',
      '恐れ入りますが、私たちの生活方針についてはこちらで管理しております。ご干渉はお控えいただけますようお願いいたします。',
      'プライベートな事柄については、ご助言は不要です。何卒ご理解ください。',
    ],
  },
  child: {
    gentle: [
      'いつも気にかけてくださってありがとうございます。子供のことは私たちのペースで考えていきたいと思っていますので、温かく見守っていただけると嬉しいです 😊',
      'お孫さんの顔が見たいお気持ちはよく分かります。でも焦らず、私たちのタイミングで…と思っておりますので、もう少しお待ちくださいね。',
      'ありがたいお言葉です。結婚（子供）については二人でじっくり考えていますので、決まったらお知らせしますね。',
    ],
    firm: [
      '子供（結婚）については、私たち自身のタイミングで決めたいと考えております。お気持ちはありがたいのですが、この件についてはそっとしておいていただけると助かります。',
      '大変デリケートな話題ですので、私たちの判断にお任せいただけますか。時が来ましたらお伝えいたします。',
      'ご期待されるお気持ちは承知しておりますが、この件については二人で話し合っております。ご理解をお願いいたします。',
    ],
    iron: [
      '子供（結婚）に関しては、私たちの問題ですので、今後この話題には触れないでいただけますようお願いいたします。',
      '恐れ入りますが、家族計画については一切お答えいたしかねます。ご了承ください。',
      'この件については回答を控えさせていただきます。私たちの判断でございますので、何卒ご理解ください。',
    ],
  },
  other: {
    gentle: [
      'お声がけありがとうございます。ちょっと今は余裕がなくて…。また落ち着いたらこちらからご連絡しますね。',
      'ありがたいお話なのですが、今回はご遠慮させていただきます。申し訳ありません。',
      'お気持ちは嬉しいのですが、ちょっと事情がありまして…。またの機会にお願いできれば幸いです。',
    ],
    firm: [
      '恐れ入りますが、今回のお話についてはお受けすることが難しい状況です。ご理解いただけますと幸いです。',
      '誠に申し訳ございませんが、こちらの事情によりお引き受けいたしかねます。何卒ご了承ください。',
      '大変恐縮ですが、お断りさせていただきます。別の形でお力になれることがあれば、お申し付けください。',
    ],
    iron: [
      'ご連絡ありがとうございます。恐れ入りますが、お断りいたします。ご了承ください。',
      '申し訳ございませんが、お受けすることはできません。今後同様のご依頼はご遠慮いただけますようお願いいたします。',
      'こちらの件については、対応いたしかねます。何卒よろしくお願いいたします。',
    ],
  },
}

const READ_DELAYS: Record<Tone, string[]> = {
  gentle: [
    '30分〜1時間後に既読にしましょう。「忙しかったんだな」と思わせるちょうどいいタイミングです。',
    '1時間後に既読 → さらに30分後に返信。「ちゃんと考えてくれた」感が出ます。',
    '昼休みや夕方など「一区切りついた」タイミングで返すと自然です。',
  ],
  firm: [
    '2〜3時間後に既読にしましょう。「すぐには飛びつかない」という姿勢を示せます。',
    '半日後に返信。急がないことで「こちらのペースで対応する」意志が伝わります。',
    '翌日の午前中に返信。一晩置くことで「熟考した」印象を与えられます。',
  ],
  iron: [
    '翌日以降に返信。即レスしないことで「この話題の優先度は低い」と無言で伝えます。',
    '24時間以上空けてから短文で返信。それ以上のやり取りは不要です。',
    '48時間後に一言だけ返信。追撃が来ても同じペースを崩さないこと。',
  ],
}

const TIPS: Record<Situation, string[]> = {
  visit: [
    '「また連絡します」は魔法の言葉。こちらが主導権を握れます。',
    '具体的な日程を絶対に出さないこと。「近いうちに」で濁しましょう。',
    'パートナーと口裏を合わせておくと鉄壁です。',
  ],
  event: [
    '「仕事」は最強の断り文句。詳細を聞かれても「守秘義務で…」で切れます。',
    'お供えやお花を送ると、欠席の罪悪感を軽減できます。',
    '一度断ったら追加の説明は不要。理由を重ねると嘘っぽくなります。',
  ],
  money: [
    '一度でも貸すと前例になります。最初から「うちはそういうことはしない」で統一。',
    '「ローンがあって」「教育費がかかって」は具体的すぎず抽象的すぎず、ベストな断り方。',
    '配偶者を盾にしてもOK。「パートナーと相談したけど難しいと…」',
  ],
  lifestyle: [
    '反論すると議論になります。「ありがとうございます」で受け流して実行しないのがベスト。',
    '「参考にします」は日本語の「No」です。相手もなんとなく察します。',
    '話題を変えるのも有効。「そういえば〇〇はお元気ですか？」',
  ],
  child: [
    'この話題は「答えない」が最強。何を言っても次の質問を生みます。',
    '「二人で決めます」の一言を崩さないこと。理由は不要。',
    '繰り返し聞かれたら「前にもお伝えしましたが…」でプレッシャーをかけ返す。',
  ],
  other: [
    '断る理由は短いほど強い。長々と説明すると突っ込まれます。',
    '「検討します」→ 数日後に「やはり難しいです」の2段階断りも有効。',
    '一度断ったら同じ質問には同じ返事を。ブレると「押せばいける」と思われます。',
  ],
}

// ─── Component ───────────────────────────────────────────
export default function ShioTaiou() {
  const [relationship, setRelationship] = useState<Relationship>('in-laws')
  const [situation, setSituation] = useState<Situation>('visit')
  const [tone, setTone] = useState<Tone>('gentle')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<Reply | null>(null)
  const [copied, setCopied] = useState(false)

  const generate = () => {
    const templates = TEMPLATES[situation][tone]
    const text = templates[Math.floor(Math.random() * templates.length)]
    const delays = READ_DELAYS[tone]
    const readDelay = delays[Math.floor(Math.random() * delays.length)]
    const tips = TIPS[situation]
    const tip = tips[Math.floor(Math.random() * tips.length)]
    setResult({ text, readDelay, tip })
    setCopied(false)
  }

  const copyToClipboard = () => {
    if (!result) return
    navigator.clipboard.writeText(result.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/products/shio-taiou">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-1" />
              戻る
            </Button>
          </Link>
          <h1 className="text-lg font-bold">🧂 塩対応代行AI</h1>
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">スタンダード</Badge>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Relationship */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <MessageSquare className="inline h-4 w-4 mr-1" />
            相手との関係
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(RELATIONSHIPS) as [Relationship, string][]).map(([key, label]) => (
              <Button
                key={key}
                variant={relationship === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRelationship(key)}
                className={relationship === key ? 'bg-amber-500 hover:bg-amber-600 text-white border-0' : 'border-gray-700 text-gray-300'}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Situation */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Shield className="inline h-4 w-4 mr-1" />
            シチュエーション
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(SITUATIONS) as [Situation, string][]).map(([key, label]) => (
              <Button
                key={key}
                variant={situation === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSituation(key)}
                className={situation === key ? 'bg-amber-500 hover:bg-amber-600 text-white border-0' : 'border-gray-700 text-gray-300'}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">断りの強さ</label>
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(TONES) as [Tone, { label: string; desc: string }][]).map(([key, { label, desc }]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all ${tone === key ? 'border-amber-500 bg-amber-500/10' : 'border-gray-800 bg-gray-900 hover:border-gray-600'}`}
                onClick={() => setTone(key)}
              >
                <CardContent className="p-3 text-center">
                  <div className={`font-bold ${tone === key ? 'text-amber-400' : 'text-gray-300'}`}>{label}</div>
                  <div className="text-xs text-gray-500 mt-1">{desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Input (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            相手のメッセージ（任意・参考用）
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="例：今度の日曜、孫の顔見せに来なさいよ"
            className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-600 min-h-[80px]"
          />
        </div>

        {/* Generate */}
        <Button
          onClick={generate}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white text-lg py-6"
        >
          🧂 塩対応を生成する
        </Button>

        {/* Result */}
        {result && (
          <div className="space-y-4">
            {/* Reply */}
            <Card className="border-amber-500/30 bg-gray-900">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">💬 返信文</Badge>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={generate} className="text-gray-400 hover:text-white">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-gray-400 hover:text-white">
                      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <p className="text-white leading-relaxed whitespace-pre-wrap">{result.text}</p>
              </CardContent>
            </Card>

            {/* Read Timing */}
            <Card className="border-blue-500/30 bg-gray-900">
              <CardContent className="p-5">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mb-3">
                  <Clock className="h-3 w-3 mr-1 inline" />
                  既読タイミング
                </Badge>
                <p className="text-gray-300 text-sm leading-relaxed">{result.readDelay}</p>
              </CardContent>
            </Card>

            {/* Tip */}
            <Card className="border-purple-500/30 bg-gray-900">
              <CardContent className="p-5">
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-3">
                  <Shield className="h-3 w-3 mr-1 inline" />
                  プロのコツ
                </Badge>
                <p className="text-gray-300 text-sm leading-relaxed">{result.tip}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
