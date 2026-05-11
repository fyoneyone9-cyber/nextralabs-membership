'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { BookOpen, FileText, Globe, Landmark, ListChecks, Copy, CheckCircle2, ExternalLink, ChevronRight } from 'lucide-react'

// ────────────────────────────────────────────
// スタイル定数
// ────────────────────────────────────────────
const cardStyle = { background: '#0d1117', border: '1px solid #1e293b' }
const accentCardStyle = { background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.25)' }

// ────────────────────────────────────────────
// 小コンポーネント
// ────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
      <span style={{ color: '#10b981' }}>▍</span>{children}
    </h2>
  )
}

function Step({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: '#10b981' }}>
        {num}
      </div>
      <div className="space-y-1 pt-0.5 flex-1">
        <p className="text-sm font-semibold text-slate-200">{title}</p>
        <div className="text-xs text-slate-500 leading-relaxed space-y-1">{children}</div>
      </div>
    </div>
  )
}

function InfoBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4 space-y-1" style={accentCardStyle}>
      <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">{label}</p>
      <div className="text-xs text-slate-300 leading-relaxed">{children}</div>
    </div>
  )
}

function CopyBox({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="rounded-xl p-4 space-y-2" style={cardStyle}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
        <button onClick={copy} className="flex items-center gap-1 text-[10px] transition-colors" style={{ color: copied ? '#10b981' : '#64748b' }}>
          {copied ? <CheckCircle2 size={11} /> : <Copy size={11} />}
          {copied ? 'コピー済み' : 'コピー'}
        </button>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">{text}</p>
    </div>
  )
}

function CheckItem({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false)
  return (
    <button
      onClick={() => setChecked(v => !v)}
      className="flex items-start gap-3 w-full text-left transition-opacity"
      style={{ opacity: checked ? 0.45 : 1 }}
    >
      <div
        className="flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 transition-all"
        style={{
          background: checked ? '#10b981' : 'transparent',
          borderColor: checked ? '#10b981' : '#334155',
        }}
      >
        {checked && <CheckCircle2 size={11} color="#fff" />}
      </div>
      <span className={`text-xs leading-relaxed ${checked ? 'line-through text-slate-600' : 'text-slate-300'}`}>{children}</span>
    </button>
  )
}

function LinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-semibold transition-all"
      style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
    >
      <ExternalLink size={11} />{children}
    </a>
  )
}

// ────────────────────────────────────────────
// タブコンテンツ
// ────────────────────────────────────────────

// ① KDP設定タブ
function TabAccount() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <SectionTitle>KDPアカウント作成</SectionTitle>
        <div className="space-y-5">
          <Step num={1} title="Amazonアカウントでログイン">
            <p>既存のAmazonアカウントでOK。新規登録も可能。</p>
            <LinkButton href="https://kdp.amazon.co.jp/">KDP Japan を開く</LinkButton>
          </Step>
          <Step num={2} title="著者・出版者情報を入力">
            <p>「アカウント」→「著者/出版者情報」から氏名・住所を登録。</p>
            <p className="text-slate-600">※ペンネームはここで設定（本名でなくてOK）</p>
          </Step>
          <Step num={3} title="税務情報（マイナンバー or 免税申告）">
            <p>日本居住者は「税務情報インタビュー」で以下を選択：</p>
            <ul className="space-y-1 pl-2">
              <li>• 個人事業主 → マイナンバー（個人番号）を入力</li>
              <li>• 副業・個人 → 同上でOK</li>
              <li>• 法人 → 法人番号を入力</li>
            </ul>
            <p className="text-slate-600">※未入力だとロイヤリティが30%天引きされるので必ず完了させる</p>
          </Step>
          <Step num={4} title="銀行口座を登録">
            <p>「支払い」→「銀行口座」から登録。ゆうちょ銀行は非対応なので注意。</p>
            <p className="text-slate-600">対応：三菱UFJ / 三井住友 / みずほ / 楽天銀行 / ソニー銀行など</p>
          </Step>
        </div>
      </div>

      <div className="space-y-4">
        <SectionTitle>KDP Select への加入（推奨）</SectionTitle>
        <InfoBox label="KDP Selectとは？">
          <p>Kindle Unlimited（KU）に自動登録される代わりに、Amazonのみでの独占販売が条件。KUページ読み込みに応じてKENPCロイヤリティが得られる。</p>
          <p className="mt-1 text-slate-400">→ 初出版者・小説・実用書はSelect加入が収益化しやすい</p>
        </InfoBox>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-xl p-4 space-y-1" style={cardStyle}>
            <p className="text-xs font-semibold text-slate-300">Select 加入メリット</p>
            <ul className="text-xs text-slate-500 space-y-1 mt-2">
              <li>✅ KU読み放題に掲載される</li>
              <li>✅ KDPプロモーション（無料キャンペーン等）が使える</li>
              <li>✅ KENPC収益が発生する</li>
            </ul>
          </div>
          <div className="rounded-xl p-4 space-y-1" style={cardStyle}>
            <p className="text-xs font-semibold text-slate-300">Select 非加入メリット</p>
            <ul className="text-xs text-slate-500 space-y-1 mt-2">
              <li>✅ 楽天kobo / Apple Books 等にも展開できる</li>
              <li>✅ 独占縛りなし</li>
              <li>⚠️ KUには掲載されない</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ② 内容・構成タブ
function TabManuscript() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <SectionTitle>ジャンル・テーマ選定</SectionTitle>
        <InfoBox label="売れるジャンルの選び方">
          <p>KDPで稼ぎやすいのは「ニッチ実用書」。競合が少なく検索上位を取りやすい。</p>
          <ul className="mt-2 space-y-1 text-slate-400">
            <li>• ✅ 副業・節税・FIREなど「お金系」</li>
            <li>• ✅ 資格・スキルアップ系</li>
            <li>• ✅ 健康・ダイエット・メンタル</li>
            <li>• ✅ AIツール活用・自動化</li>
          </ul>
        </InfoBox>
      </div>

      <div className="space-y-4">
        <SectionTitle>目次構成をAIで作る</SectionTitle>
        <CopyBox
          label="目次生成プロンプト（ChatGPT / Claude に貼り付け）"
          text={`あなたはKindle出版の専門家です。
以下のテーマで日本語の電子書籍の目次を作成してください。

テーマ：[ここにテーマを入力]
ターゲット読者：[例：副業初心者、30代会社員]
ページ数目安：50〜80ページ（Kindle短編）

【出力形式】
- はじめに（読者の悩みと本書の約束）
- 第1章〜第5章（各章に3〜4節）
- おわりに（次のアクションとCTA）

読みやすく、各章が独立して価値を持つ構成にしてください。`}
        />
      </div>

      <div className="space-y-4">
        <SectionTitle>原稿をAIで執筆する</SectionTitle>
        <CopyBox
          label="章ごとの執筆プロンプト"
          text={`以下の章の原稿を執筆してください。

章タイトル：[章タイトルを入力]
節構成：[節1 / 節2 / 節3]
文字数：2000〜3000文字
読者レベル：初心者向け

【文体ルール】
- 「です・ます」調
- 具体例・数字・体験談を必ず含める
- 専門用語は初出時に説明
- 1段落4〜5行以内

【構成】
1. 冒頭：読者の悩みに共感する一文
2. 本文：解説＋具体例
3. まとめ：次の章への橋渡し`}
        />
      </div>

      <div className="space-y-4">
        <SectionTitle>DOCX形式での入稿準備</SectionTitle>
        <div className="space-y-3">
          <Step num={1} title="WordファイルをKDP推奨形式に整える">
            <p>フォント：游明朝 または MS 明朝（日本語）</p>
            <p>余白：上下左右 2.5cm</p>
            <p>行間：1.5〜1.8倍</p>
          </Step>
          <Step num={2} title="見出しスタイルを設定する">
            <p>「見出し1」→ 章タイトル / 「見出し2」→ 節タイトル</p>
            <p className="text-slate-600">Kindle Createが自動で目次を認識するので必須</p>
          </Step>
          <Step num={3} title="表紙画像を別途用意する">
            <p>推奨サイズ：1600 × 2560px（縦型）/ JPEG形式</p>
            <p className="text-slate-600">Kindle Createに取り込む前に画像を準備しておく</p>
          </Step>
        </div>
      </div>
    </div>
  )
}

// ③ 本の情報タブ
function TabRegister() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <SectionTitle>タイトル・サブタイトル</SectionTitle>
        <InfoBox label="売れるタイトルの法則">
          <p>「誰が・何を・どうなるか」を30文字以内で表現する。</p>
          <ul className="mt-2 space-y-1 text-slate-400">
            <li>• ✅ 数字を入れる（「7日で」「月収10万円」）</li>
            <li>• ✅ 読者の悩みをそのままタイトルにする</li>
            <li>• ✅ サブタイトルで補足説明する</li>
          </ul>
        </InfoBox>
        <CopyBox
          label="タイトル案生成プロンプト"
          text={`以下の本のタイトル案を10個生成してください。

テーマ：[テーマを入力]
ターゲット：[例：副業初心者・30代会社員]

【条件】
- 30文字以内
- 数字を含むもの3案
- 読者の悩みを直接表現するもの3案
- 「方法・コツ・手順」などの言葉を使うもの3案
- キャッチーなもの1案

各案にサブタイトル（40文字以内）もセットで提案してください。`}
        />
      </div>

      <div className="space-y-4">
        <SectionTitle>内容紹介文（Description）</SectionTitle>
        <CopyBox
          label="説明文生成プロンプト（KDPのDescription欄用）"
          text={`Kindleの内容紹介文を作成してください。

本のタイトル：[タイトル]
テーマ・内容：[概要]

【構成（400〜600文字）】
1. 冒頭：読者の悩みに共感する一文（インパクト重視）
2. この本で解決できること（箇条書き3〜5点）
3. 著者/本書の信頼性（NextraLabsが監修・AIを活用した実践的内容）
4. CTA：「今すぐ読む」「Kindle Unlimitedで無料で読む」

HTMLタグは使用不可。改行のみ使用してください。`}
        />
      </div>

      <div className="space-y-4">
        <SectionTitle>キーワード設定（7個）</SectionTitle>
        <InfoBox label="キーワード戦略">
          <p>Amazonの検索に使われる最重要設定。1フレーズ＝1キーワードとして設定。</p>
          <ul className="mt-2 space-y-1 text-slate-400">
            <li>• ✅ 読者が検索しそうな具体的なフレーズ</li>
            <li>• ✅ 本のタイトルと重複しないものを選ぶ</li>
            <li>• ✅ ニッチすぎず、広すぎず（競合100〜1000件が理想）</li>
          </ul>
        </InfoBox>
        <CopyBox
          label="キーワード案生成プロンプト"
          text={`以下のKindle本に最適なAmazon検索キーワードを15個提案してください。

テーマ：[テーマ]
ターゲット読者：[読者層]

【条件】
- Amazonで実際に検索されそうなフレーズ
- 本のタイトル・サブタイトルと重複しない
- 日本語フレーズ（2〜5語）
- 競合が少なそうなニッチなものを優先
- 最終的に上位7個を太字で表示してください`}
        />
      </div>

      <div className="space-y-4">
        <SectionTitle>カテゴリ選択</SectionTitle>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { cat: 'ビジネス・経済', subs: ['起業・開業', '副業・在宅ワーク', '自己啓発'] },
            { cat: 'コンピュータ・IT', subs: ['プログラミング', 'AI・機械学習', 'Webサービス'] },
            { cat: '趣味・実用', subs: ['料理・グルメ', '健康・フィットネス', '節約'] },
            { cat: '小説・文芸', subs: ['ライトノベル', 'ミステリー', 'ファンタジー'] },
          ].map(({ cat, subs }) => (
            <div key={cat} className="rounded-xl p-4 space-y-2" style={cardStyle}>
              <p className="text-xs font-semibold text-slate-300">{cat}</p>
              {subs.map(s => (
                <div key={s} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <ChevronRight size={9} style={{ color: '#10b981' }} />{s}
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600">※ 2カテゴリまで設定可能。ニッチなサブカテゴリを選ぶとランキング上位に入りやすい。</p>
      </div>
    </div>
  )
}

// ④ 出版申請タブ
function TabPublish() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <SectionTitle>価格設定・ロイヤリティ</SectionTitle>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-xl p-5 space-y-3" style={accentCardStyle}>
            <p className="text-xs font-semibold text-emerald-400">70%ロイヤリティ（推奨）</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              価格帯：¥250〜¥1,250の間に設定が必要。<br />
              KDP Selectとセットで利用可能。<br />
              <span className="text-slate-500">例：¥498設定 → ¥348.6 の収益</span>
            </p>
          </div>
          <div className="rounded-xl p-5 space-y-3" style={cardStyle}>
            <p className="text-xs font-semibold text-slate-300">35%ロイヤリティ</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              価格帯：¥100〜¥20,000まで自由に設定可能。<br />
              KDP Select非加入でもOK。<br />
              <span className="text-slate-600">例：¥3,000設定 → ¥1,050の収益</span>
            </p>
          </div>
        </div>
        <InfoBox label="価格設定の目安">
          <ul className="space-y-1 text-slate-400">
            <li>• 短編（〜50ページ）：¥250〜¥498</li>
            <li>• 中編（50〜100ページ）：¥498〜¥798</li>
            <li>• 長編・専門書（100ページ〜）：¥798〜¥1,250</li>
          </ul>
        </InfoBox>
      </div>

      <div className="space-y-4">
        <SectionTitle>出版前 最終チェックリスト</SectionTitle>
        <div className="rounded-xl p-6 space-y-4" style={cardStyle}>
          <p className="text-xs font-semibold text-slate-400 mb-2">クリックでチェック ✓</p>
          <div className="space-y-3">
            {[
              'タイトル・サブタイトルに誤字脱字がない',
              '内容紹介文（Description）が400文字以上ある',
              'キーワードが7個すべて設定されている',
              'カテゴリが2つ設定されている',
              '表紙画像が1600×2560px / JPEG形式である',
              '原稿のDOCX/KPFファイルに文字化けがない',
              '目次（見出し1・2）が正しく設定されている',
              '著者名（ペンネーム）を確認した',
              '税務情報の入力が完了している',
              '銀行口座が登録されている',
              '70%ロイヤリティ対象価格（¥250〜¥1,250）に設定した',
              'KDP Selectへの加入を選択/非選択した',
              'プレビューアーでKindle表示を最終確認した',
            ].map((item, i) => (
              <CheckItem key={i}>{item}</CheckItem>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <SectionTitle>申請後のスケジュール</SectionTitle>
        <div className="space-y-3">
          {[
            { day: '申請当日', desc: 'KDPが審査開始（通常24〜72時間）' },
            { day: '1〜3日後', desc: 'Amazonに本が掲載される（メールで通知あり）' },
            { day: '掲載後', desc: 'SNS・noteで告知を開始しよう' },
            { day: '60日後', desc: '初回ロイヤリティ支払い（銀行口座に振込）' },
          ].map(({ day, desc }) => (
            <div key={day} className="flex items-start gap-4 rounded-xl p-4" style={cardStyle}>
              <div className="flex-shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                {day}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <SectionTitle>役立つリンク集</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'KDP ダッシュボード', href: 'https://kdp.amazon.co.jp/' },
            { label: 'Kindle Previewer（公式）', href: 'https://www.amazon.co.jp/gp/feature.html?docId=3077699832' },
            { label: 'KDPヘルプセンター', href: 'https://kdp.amazon.co.jp/ja_JP/help/topic/G200634390' },
            { label: 'BookReport（売上分析）', href: 'https://getbookreport.com/' },
          ].map(({ label, href }) => (
            <LinkButton key={label} href={href}>{label}</LinkButton>
          ))}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────
// タブ定義
// ────────────────────────────────────────────
const TABS = [
  { id: 'account',    label: '① KDP設定',  icon: Landmark,   component: TabAccount },
  { id: 'manuscript', label: '② 内容・構成', icon: FileText,   component: TabManuscript },
  { id: 'register',   label: '③ 本の情報',  icon: ListChecks, component: TabRegister },
  { id: 'publish',    label: '④ 出版申請',  icon: Globe,       component: TabPublish },
]

// ────────────────────────────────────────────
// メインエンジン
// ────────────────────────────────────────────
const MasterEngine = () => {
  const [activeTab, setActiveTab] = useState('account')
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => { setIsMounted(true) }, [])
  if (!isMounted) return null

  const ActiveContent = TABS.find(t => t.id === activeTab)?.component ?? TabAccount

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: '#050507', fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}
    >
      {/* ヒーロー */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10 space-y-4">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
          style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          KDP出版完全ガイド
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-100 tracking-tight leading-[1.2]">
          Kindle出版を<span style={{ color: '#10b981' }}>ゼロから完走する</span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
          アカウント開設から原稿執筆・本の情報入力・出版申請まで、全工程をステップごとにナビゲート。AIプロンプトつきで誰でも最短で出版できます。
        </p>
      </div>

      {/* タブバー */}
      <div className="max-w-4xl mx-auto px-6">
        <div
          className="flex gap-1 p-1.5 rounded-2xl overflow-x-auto"
          style={{ background: '#0d1117', border: '1px solid #1e293b' }}
        >
          {TABS.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all min-w-[80px]"
                style={{
                  background: isActive ? '#10b981' : 'transparent',
                  color: isActive ? '#fff' : '#64748b',
                }}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* コンテンツ */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <ActiveContent />
      </div>
    </div>
  )
}

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

export default function KdpPage() { return <NoSSR /> }
