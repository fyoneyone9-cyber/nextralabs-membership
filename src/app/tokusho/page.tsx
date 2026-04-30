import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: '特定商取引法に基づく表記 | NextraLabs',
  description: 'NextraLabs の特定商取引法に基づく表記ページです。',
}

export default function TokushoPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        トップに戻る
      </Link>

      <h1 className="text-3xl font-bold mb-2">📋 特定商取引法に基づく表記</h1>
      <p className="text-sm text-muted-foreground mb-10">最終更新日: 2026年4月30日</p>

      <div className="space-y-0 border border-border rounded-xl overflow-hidden">
        {[
          { label: '販売事業者名', value: 'NextraLabs（個人事業主）' },
          { label: '代表者氏名', value: '米山 文貴' },
          { label: '所在地', value: '神奈川県海老名市（詳細住所はメールにてご請求ください）' },
          { label: '電話番号', value: '080-3207-8422（平日10:00〜18:00）' },
          { label: 'メールアドレス', value: 'info@marriage-road.jp' },
          { label: 'ウェブサイト', value: 'https://membership-site-nextralabos.vercel.app' },
          {
            label: '販売価格',
            value: 'スタンダードプラン：¥980（税込）／月　プレミアムプラン：¥1,980（税込）／月　※各プランの詳細は料金ページをご確認ください。',
          },
          { label: '販売価格以外の必要料金', value: 'インターネット接続料金・通信料金はお客様負担となります。' },
          { label: '支払方法', value: 'クレジットカード（Visa / Mastercard / American Express / JCB）' },
          { label: '支払時期', value: 'ご契約時に初回課金。以降は毎月同日に自動更新・課金されます。' },
          {
            label: 'サービス提供時期',
            value: '決済完了後、即時にサービスをご利用いただけます。',
          },
          {
            label: 'キャンセル・解約について',
            value:
              'マイページまたはお問い合わせフォームよりいつでも解約できます。解約後は次回更新日以降の課金は発生しません。当月分のご返金は原則承っておりません。',
          },
          {
            label: '返品・返金について',
            value:
              'デジタルコンテンツの性質上、サービス提供開始後の返金は原則お断りしております。ただし、システム障害など当社の責に帰すべき事由によりサービスが利用できない場合はこの限りではありません。',
          },
          { label: '動作環境', value: 'インターネット接続環境および最新のWebブラウザ（Chrome / Safari / Firefox / Edge）' },
        ].map((row, i) => (
          <div
            key={i}
            className={`flex flex-col sm:flex-row ${i % 2 === 0 ? 'bg-muted/30' : 'bg-background'}`}
          >
            <div className="sm:w-48 shrink-0 px-5 py-4 font-medium text-sm text-foreground border-b sm:border-b-0 sm:border-r border-border">
              {row.label}
            </div>
            <div className="flex-1 px-5 py-4 text-sm text-muted-foreground leading-relaxed">
              {row.value}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-8 leading-relaxed">
        ご不明な点がございましたら、
        <Link href="/contact" className="underline hover:text-primary">
          お問い合わせフォーム
        </Link>
        またはメール（f.yoneyone9@gmail.com）までお気軽にご連絡ください。
      </p>
    </div>
  )
}
