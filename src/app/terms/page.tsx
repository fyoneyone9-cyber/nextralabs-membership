import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: '利用規約 | NextraLabs',
  description: 'NextraLabs AIツールストアの利用規約',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 px-4 py-10 md:py-16 font-sans">
      <div className="container mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          トップに戻る
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">📜 利用規約</h1>
        <p className="text-sm text-slate-400 mb-8">最終更新日: 2026年4月29日</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-3 text-white">第1条（適用）</h2>
            <p className="text-slate-400 leading-relaxed">
              本利用規約（以下「本規約」）は、NextraLabs（以下「当社」）が提供するWebサービス「NextraLabs AI Tool Store」（以下「本サービス」）の利用に関する条件を定めるものです。
              ユーザーは本規約に同意の上、本サービスを利用するものとします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-white">第2条（定義）</h2>
            <ul className="list-disc pl-5 text-slate-400 space-y-1">
              <li>「ユーザー」とは、本サービスを利用するすべての方を指します。</li>
              <li>「有料会員」とは、月額プランに加入しているユーザーを指します。</li>
              <li>「ツール」とは、本サービス上で提供されるAIツール・アプリケーションを指します。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-white">第3条（アカウント登録）</h2>
            <ol className="list-decimal pl-5 text-slate-400 space-y-1">
              <li>ユーザーは正確な情報を提供して登録を行うものとします。</li>
              <li>アカウントの管理責任はユーザーにあります。</li>
              <li>1人につき1アカウントとし、複数アカウントの作成は禁止します。</li>
              <li>不正な情報での登録が発覚した場合、アカウントを停止することがあります。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-white">第4条（料金・決済）</h2>
            <ol className="list-decimal pl-5 text-slate-400 space-y-1">
              <li>各プランの料金は、本サービス上に表示された金額とします。</li>
              <li>決済はStripe社の決済システムを通じて処理されます。</li>
              <li>月額プランは毎月自動更新されます。解約はいつでも可能です。</li>
              <li>当社は料金を変更する場合、事前にユーザーに通知します。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-white">第5条（禁止事項）</h2>
            <p className="text-slate-400 mb-2">ユーザーは以下の行為を行ってはなりません。</p>
            <ul className="list-disc pl-5 text-slate-400 space-y-1">
              <li>法令または公序良俗に反する行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>他のユーザーまたは第三者の権利を侵害する行為</li>
              <li>ツールの逆コンパイル、リバースエンジニアリング、改変</li>
              <li>ツールの再販、再配布、二次利用</li>
              <li>自動化ツールやボットによる不正アクセス</li>
              <li>虚偽の情報を登録・流布する行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-white">第6条（ツールの利用）</h2>
            <ol className="list-decimal pl-5 text-slate-400 space-y-1">
              <li>各ツールはブラウザ上で動作し、入力データはブラウザ内（localStorage等）に保存されます。</li>
              <li>ツールの出力結果は参考情報であり、法的助言、医療助言、投資助言等を構成するものではありません。</li>
              <li>ツールの利用により生じた損害について、当社は責任を負いません。</li>
              <li>当社はツールの内容を予告なく変更・停止することがあります。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-white">第7条（知的財産権）</h2>
            <ol className="list-decimal pl-5 text-slate-400 space-y-1">
              <li>本サービスおよびツールに関する知的財産権は当社に帰属します。</li>
              <li>ユーザーがツールを利用して生成したコンテンツの権利はユーザーに帰属します。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-white">第8条（免責事項）</h2>
            <ol className="list-decimal pl-5 text-slate-400 space-y-1">
              <li>当社は本サービスの完全性、正確性、有用性を保証しません。</li>
              <li>天災、システム障害、第三者による攻撃等に起因するサービスの中断について、当社は責任を負いません。</li>
              <li>ユーザー間またはユーザーと第三者間のトラブルについて、当社は責任を負いません。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-white">第9条（規約の変更）</h2>
            <p className="text-slate-400 leading-relaxed">
              当社は必要に応じて本規約を変更することがあります。変更後の規約は本サービス上に掲載した時点で効力を生じるものとします。
              重要な変更がある場合は、事前にユーザーに通知します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-white">第10条（準拠法・管轄）</h2>
            <ol className="list-decimal pl-5 text-slate-400 space-y-1">
              <li>本規約は日本法に準拠するものとします。</li>
              <li>本規約に関する紛争は、横浜地方裁判所を第一審の専属的合意管轄裁判所とします。</li>
            </ol>
          </section>

          <section className="border-t border-white/10 pt-6">
            <h2 className="text-xl font-bold mb-3 text-white">運営者情報</h2>
            <div className="text-slate-400 space-y-1">
              <p><strong className="text-slate-100">事業者名:</strong> NextraLabs（個人事業）</p>
              <p><strong className="text-slate-100">代表者:</strong> 米山 文貴</p>
              <p><strong className="text-slate-100">所在地:</strong> 神奈川県海老名市</p>
              <p><strong className="text-slate-100">お問い合わせ:</strong> <Link href="/contact" className="text-emerald-400 hover:text-emerald-300">お問い合わせフォーム</Link></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
