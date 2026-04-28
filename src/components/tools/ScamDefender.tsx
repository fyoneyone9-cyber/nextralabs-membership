'use client'

import { useState, useCallback, useRef } from 'react'

// ─── Types ───────────────────────────────────────────────
interface QuizQuestion {
  id: string
  scenario: string
  isScam: boolean
  explanation: string
  category: string
  difficulty: '初級' | '中級' | '上級'
}

interface SimMessage {
  role: 'scammer' | 'user' | 'coach'
  text: string
}

interface CheckItem {
  id: string
  label: string
  category: string
  description: string
  done: boolean
  priority: '必須' | '推奨' | '任意'
}

interface ScamPattern {
  id: string
  name: string
  category: string
  description: string
  keywords: string[]
  examples: string[]
  prevention: string
  damage: string
}

// ─── Data ────────────────────────────────────────────────
const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1', category: 'オレオレ詐欺', difficulty: '初級',
    scenario: '「お母さん、俺だけど…。会社のお金を使い込んでしまって、今日中に200万円必要なんだ。誰にも言わないで。」',
    isScam: true,
    explanation: '典型的なオレオレ詐欺です。「誰にも言わないで」は詐欺の常套句。必ず本人の携帯に折り返し確認してください。',
  },
  {
    id: 'q2', category: '還付金詐欺', difficulty: '初級',
    scenario: '「○○市役所の健康保険課です。医療費の還付金が35,000円あります。ATMで手続きできますので、近くのATMに行っていただけますか？」',
    isScam: true,
    explanation: '還付金詐欺です。役所が電話でATM操作を指示することは絶対にありません。還付金は口座振込か窓口での手続きです。',
  },
  {
    id: 'q3', category: '架空請求', difficulty: '初級',
    scenario: '「最終通告：ご利用料金の未納が確認されました。本日中にご連絡なき場合、法的手続きに移行します。連絡先：090-XXXX-XXXX」',
    isScam: true,
    explanation: '架空請求詐欺のSMSです。身に覚えのない請求には絶対に連絡しないでください。正規の請求は書面で届きます。',
  },
  {
    id: 'q4', category: 'フィッシング', difficulty: '中級',
    scenario: '「【Amazon】お客様のアカウントに異常なログインが検出されました。24時間以内にこちらのリンクから確認してください：https://amaz0n-security.xyz/verify」',
    isScam: true,
    explanation: 'フィッシング詐欺です。URLが「amaz0n」(数字のゼロ)で、ドメインも「.xyz」です。Amazonは「amazon.co.jp」ドメインのみ使用します。',
  },
  {
    id: 'q5', category: '投資詐欺', difficulty: '中級',
    scenario: '「元本保証で年利20%の投資案件です。今なら限定30名のみ参加可能。著名人の○○さんも参加しています。」',
    isScam: true,
    explanation: '投資詐欺の典型パターンです。元本保証で高利回りは金融商品取引法違反。著名人の名前を勝手に使うのも詐欺の特徴です。',
  },
  {
    id: 'q6', category: '闇バイト', difficulty: '中級',
    scenario: '「高収入バイト！1日で5万円以上可能！仕事内容は荷物の受け取りと転送だけ。面接なし、即日勤務OK。身分証のコピーを送ってください。」',
    isScam: true,
    explanation: '闇バイト（受け子・出し子）の勧誘です。「荷物の受け取り・転送」は詐欺の受け子です。身分証を送ると脅迫に使われます。逮捕されるのは実行犯（あなた）です。',
  },
  {
    id: 'q7', category: 'ロマンス詐欺', difficulty: '上級',
    scenario: '「マッチングアプリで知り合った外国人から「あなたに会いに行きたい。でも渡航費用が足りない。3万円だけ送ってくれたら必ず返す」と言われた。」',
    isScam: true,
    explanation: 'ロマンス詐欺です。会ったことのない相手への送金は絶対NGです。「少額から始めて徐々に増額」が常套手段。',
  },
  {
    id: 'q8', category: 'サポート詐欺', difficulty: '上級',
    scenario: '「PCの画面に突然「ウイルスに感染しました！今すぐ050-XXXX-XXXXに電話してください」と警告が表示され、大きな警告音が鳴り続けている。」',
    isScam: true,
    explanation: 'サポート詐欺（テクニカルサポート詐欺）です。ブラウザを閉じるだけで解決します（Ctrl+W or Alt+F4）。表示された番号には絶対に電話しないでください。',
  },
  {
    id: 'q9', category: '正規', difficulty: '中級',
    scenario: '「○○銀行です。お客様の口座から不審な引き落としがありました。確認のため、最寄りの支店にお越しいただくか、カスタマーセンター(0120-XXX-XXX)にご連絡ください。」',
    isScam: false,
    explanation: '銀行からの正規連絡の可能性があります。ただし、この電話自体が詐欺の可能性もあるため、銀行の公式サイトに記載の番号に自分からかけ直して確認しましょう。',
  },
  {
    id: 'q10', category: '正規', difficulty: '上級',
    scenario: '「宅配便の不在通知がポストに入っていた。記載の電話番号に折り返したところ、再配達の日時を聞かれた。」',
    isScam: false,
    explanation: '正規の不在通知です。ただしSMSやメールでの不在通知は詐欺の可能性が高いです。紙の不在票は基本的に安全ですが、番号は公式サイトで照合すると安心です。',
  },
]

const scamPatterns: ScamPattern[] = [
  {
    id: 's1', name: 'オレオレ詐欺', category: '電話詐欺',
    description: '息子や孫を装い「お金が必要」と緊急性を煽る',
    keywords: ['俺だけど', '事故', '示談金', '会社のお金', '今日中に', '誰にも言わないで'],
    examples: ['「俺だけど、事故を起こしちゃって…」', '「会社の金を使い込んで、クビになる…」'],
    prevention: '必ず本人の携帯に折り返す。家族で合言葉を決めておく。',
    damage: '平均被害額: 約300万円',
  },
  {
    id: 's2', name: '還付金詐欺', category: '電話詐欺',
    description: '市役所や年金事務所を装い、ATM操作を指示',
    keywords: ['還付金', 'ATM', '手続き', '期限', '健康保険', '市役所'],
    examples: ['「医療費の還付金があります」', '「ATMで手続きしてください」'],
    prevention: '役所がATM操作を電話で指示することは絶対にない。',
    damage: '平均被害額: 約100万円',
  },
  {
    id: 's3', name: '架空請求詐欺', category: 'SMS/メール詐欺',
    description: '身に覚えのない請求で焦らせて連絡させる',
    keywords: ['最終通告', '未納', '法的手続き', '裁判', '本日中に'],
    examples: ['「利用料金の未納が確認されました」', '「法的措置を取ります」'],
    prevention: '身に覚えのない請求は無視。正規の請求は書面で届く。',
    damage: '平均被害額: 約50万円',
  },
  {
    id: 's4', name: 'フィッシング詐欺', category: 'SMS/メール詐欺',
    description: '実在企業を装った偽サイトでID/パスワードを盗む',
    keywords: ['アカウント異常', 'ログイン確認', '24時間以内', 'こちらのリンク', '本人確認'],
    examples: ['「不正アクセスが検出されました」', '「アカウントがロックされます」'],
    prevention: 'メール内のリンクは絶対にクリックしない。公式アプリかブックマークからアクセス。',
    damage: 'クレジットカード不正利用、個人情報漏洩',
  },
  {
    id: 's5', name: '投資詐欺', category: '投資・副業詐欺',
    description: '高利回り・元本保証をうたう架空の投資話',
    keywords: ['元本保証', '年利20%', '限定', '著名人', '必ず儲かる', '今だけ'],
    examples: ['「元本保証で年利20%」', '「有名人も参加している」'],
    prevention: '「必ず儲かる」投資は存在しない。金融庁の登録業者か確認。',
    damage: '数百万〜数千万円の被害例多数',
  },
  {
    id: 's6', name: '闇バイト', category: '犯罪加担型',
    description: 'SNSで高額報酬をうたい、犯罪の実行役にさせる',
    keywords: ['即日現金', '高収入', '簡単作業', '面接なし', '荷物の受け取り', '身分証', 'テレグラム'],
    examples: ['「1日5万以上可能」', '「荷物を受け取って転送するだけ」'],
    prevention: '高額×簡単×匿名 = 100%闇バイト。応募した時点で脅迫される。',
    damage: '逮捕・実刑（実行犯として処罰される）',
  },
  {
    id: 's7', name: 'ロマンス詐欺', category: '恋愛詐欺',
    description: 'マッチングアプリやSNSで恋愛感情を利用して金銭を要求',
    keywords: ['会いに行きたい', '渡航費', '少しだけ貸して', '暗号資産', '投資を一緒に'],
    examples: ['「あなたに会うために渡航費が必要」', '「一緒に投資しよう」'],
    prevention: '会ったことのない相手に送金しない。投資の話が出たら100%詐欺。',
    damage: '平均被害額: 約500万円',
  },
  {
    id: 's8', name: 'サポート詐欺', category: 'PC詐欺',
    description: '偽のウイルス警告画面で電話をかけさせ、遠隔操作で金銭を騙し取る',
    keywords: ['ウイルス感染', '今すぐ電話', '遠隔操作', 'サポート料金', 'ギフトカード'],
    examples: ['「ウイルスに感染しました！」', '「Microsoftサポートです。遠隔操作で修復します」'],
    prevention: 'ブラウザを閉じるだけで解決（Ctrl+W）。表示された番号に電話しない。',
    damage: '数万〜数十万円（ギフトカード購入させるケースが多い）',
  },
]

const defaultChecklist: CheckItem[] = [
  { id: 'c1', label: '迷惑電話フィルタアプリの設定', category: 'スマホ設定', description: 'Whoscall等の迷惑電話対策アプリをインストール・設定', done: false, priority: '必須' },
  { id: 'c2', label: '知らない番号に出ない設定', category: 'スマホ設定', description: '連絡先に登録されていない番号は留守電に回す設定', done: false, priority: '必須' },
  { id: 'c3', label: '二段階認証の設定', category: 'アカウント', description: 'LINE、メール、銀行アプリに二段階認証を設定', done: false, priority: '必須' },
  { id: 'c4', label: 'LINEの友だち追加設定', category: 'SNS', description: '「友だち自動追加」「友だちへの追加を許可」をOFF', done: false, priority: '必須' },
  { id: 'c5', label: 'パスワードの変更', category: 'アカウント', description: '銀行、メール、SNSのパスワードを強力なものに変更', done: false, priority: '必須' },
  { id: 'c6', label: '家族の合言葉を決める', category: 'コミュニケーション', description: '「お金の話が出たら合言葉を確認する」ルールを決める', done: false, priority: '必須' },
  { id: 'c7', label: '緊急連絡先リストの作成', category: 'コミュニケーション', description: '警察(#9110)、消費者ホットライン(188)、家族の番号を紙で冷蔵庫に貼る', done: false, priority: '必須' },
  { id: 'c8', label: 'SMSフィルタ設定', category: 'スマホ設定', description: 'SMS内のリンクを自動ブロック or 警告表示する設定', done: false, priority: '推奨' },
  { id: 'c9', label: 'メールの迷惑メールフィルタ', category: 'メール', description: 'フィッシングメールを自動振り分けるフィルタを確認', done: false, priority: '推奨' },
  { id: 'c10', label: 'クレジットカードの利用通知', category: '金融', description: '利用時に即時通知が届く設定をON', done: false, priority: '推奨' },
  { id: 'c11', label: '銀行アプリの振込限度額', category: '金融', description: '1日の振込限度額を必要最低限に設定', done: false, priority: '推奨' },
  { id: 'c12', label: 'SNSの公開範囲確認', category: 'SNS', description: 'Facebook、Instagramの投稿公開範囲を「友達のみ」に', done: false, priority: '任意' },
]

const emergencySteps = [
  { step: 1, title: '落ち着く', description: '深呼吸して冷静になる。詐欺犯は「焦らせる」のが手口。', icon: '🧘' },
  { step: 2, title: '電話を切る / 画面を閉じる', description: '怪しい電話はすぐ切る。PC警告画面はCtrl+Wで閉じる。', icon: '📵' },
  { step: 3, title: '家族に相談', description: '一人で判断しない。必ず家族や信頼できる人に相談する。', icon: '👨‍👩‍👦' },
  { step: 4, title: '警察に相談', description: '警察相談窓口 #9110（緊急の場合は110番）に電話。', icon: '👮' },
  { step: 5, title: '振込済みの場合', description: '銀行に連絡して口座凍結を依頼。振り込め詐欺救済法で返金の可能性あり。', icon: '🏦' },
  { step: 6, title: '証拠を保全', description: 'SMS、メール、通話履歴、画面のスクリーンショットを保存。', icon: '📸' },
]

// ─── Danger keyword analysis ─────────────────────────────
// ─── Enhanced Danger Keyword DB ──────────────────────────
// Each entry has: words (variants), level, category, weight (for scoring)
const dangerKeywordGroups: { words: string[]; level: 'critical' | 'warning' | 'suspicious'; category: string; weight: number }[] = [
  // ── 闇バイト・犯罪加担 (最重要) ──
  { words: ['受け子', 'うけこ'], level: 'critical', category: '闇バイト（受け子）', weight: 25 },
  { words: ['出し子', 'だしこ'], level: 'critical', category: '闇バイト（出し子）', weight: 25 },
  { words: ['掛け子', 'かけこ'], level: 'critical', category: '闇バイト（掛け子）', weight: 25 },
  { words: ['裏バイト', '闇バイト', 'やみばいと', 'ウラバイト'], level: 'critical', category: '闇バイト', weight: 25 },
  { words: ['飛ばし', '飛ばし携帯', '飛ばしスマホ'], level: 'critical', category: '犯罪ツール', weight: 25 },
  { words: ['タタキ', 'たたき', '叩き'], level: 'critical', category: '強盗（闇バイト用語）', weight: 25 },
  { words: ['荷物の受け取り', '荷物を受け取', '荷物受取', '荷受け'], level: 'critical', category: '受け子', weight: 20 },
  { words: ['荷物を届ける', '荷物の転送', '荷物転送'], level: 'critical', category: '受け子', weight: 20 },
  { words: ['現金の回収', '現金回収', 'お金を受け取'], level: 'critical', category: '受け子/出し子', weight: 22 },
  { words: ['口座を貸し', '口座貸し', '口座売買', '口座を売'], level: 'critical', category: '口座詐欺', weight: 25 },
  { words: ['名義貸し', '名義を貸'], level: 'critical', category: '犯罪加担', weight: 22 },
  { words: ['キャッシュカードを送', 'カードを郵送', 'カードを預'], level: 'critical', category: '口座詐欺', weight: 25 },
  { words: ['telegram', 'テレグラム', 'テレグラ'], level: 'warning', category: '匿名通信（犯罪連絡に多用）', weight: 12 },
  { words: ['signal', 'シグナル'], level: 'warning', category: '匿名通信', weight: 8 },
  { words: ['秘密厳守', '他言無用', '誰にも言うな', '誰にも言わないで', '内密に'], level: 'critical', category: '口止め（詐欺の常套句）', weight: 18 },

  // ── 高額報酬系 ──
  { words: ['即日現金', '即金', '即日払い', '即日入金', '当日払い', '当日現金'], level: 'critical', category: '闇バイト', weight: 18 },
  { words: ['高収入', '高額報酬', '高額バイト', '高額案件', '月収100万', '日給5万', '日給10万', '1日で5万', '1日で10万'], level: 'critical', category: '高額報酬（闇バイト）', weight: 15 },
  { words: ['簡単作業', '簡単なお仕事', 'カンタン作業', '誰でもできる', '未経験ok', '未経験歓迎'], level: 'warning', category: '簡単×高額は危険', weight: 10 },
  { words: ['面接なし', '面接不要', '履歴書不要', '経歴不問'], level: 'warning', category: '匿名性（闇バイト特徴）', weight: 10 },
  { words: ['日払い', '週払い', '現金手渡し'], level: 'warning', category: '即金性', weight: 8 },

  // ── 身分証要求 ──
  { words: ['身分証', '免許証のコピー', '免許証の写真', '身分証明書を送', '本人確認書類を送', '免許証を撮影', 'マイナンバーカード'], level: 'critical', category: '個人情報搾取（脅迫材料化）', weight: 18 },
  { words: ['顔写真を送', '自撮りを送', '顔写真付き'], level: 'critical', category: '個人情報搾取', weight: 15 },

  // ── 投資詐欺 ──
  { words: ['元本保証', '元本割れなし'], level: 'critical', category: '投資詐欺', weight: 20 },
  { words: ['必ず儲かる', '絶対儲かる', '100%利益', '損しない', 'ノーリスク'], level: 'critical', category: '投資詐欺', weight: 20 },
  { words: ['年利20', '年利30', '月利10', '月利5%以上'], level: 'critical', category: '投資詐欺（異常利回り）', weight: 18 },
  { words: ['暗号資産', '仮想通貨', 'ビットコイン', 'FX自動売買'], level: 'warning', category: '投資詐欺の手段', weight: 8 },
  { words: ['マイニング', 'NFT投資', 'バイナリーオプション'], level: 'warning', category: '投資詐欺の手段', weight: 10 },
  { words: ['著名人も参加', '有名人も', '芸能人も'], level: 'critical', category: '権威づけ（詐欺の常套句）', weight: 15 },
  { words: ['限定30名', '限定募集', '残りわずか', '今だけ', '本日限り', '先着'], level: 'suspicious', category: '焦らせ手口', weight: 6 },

  // ── 架空請求・フィッシング ──
  { words: ['最終通告', '最終警告', '法的手続き', '法的措置', '裁判所', '差し押さえ'], level: 'warning', category: '架空請求', weight: 12 },
  { words: ['未納', '未払い', '滞納', '延滞'], level: 'suspicious', category: '架空請求', weight: 6 },
  { words: ['本日中に', '24時間以内', '48時間以内', '至急', '緊急'], level: 'warning', category: '焦らせ手口', weight: 8 },
  { words: ['アカウント異常', 'アカウントロック', '不正アクセス', '不正ログイン', 'セキュリティ警告'], level: 'warning', category: 'フィッシング', weight: 10 },
  { words: ['こちらのリンク', '以下のurlを', 'リンクをクリック', '本人確認はこちら'], level: 'warning', category: 'フィッシング', weight: 10 },

  // ── オレオレ詐欺 ──
  { words: ['示談金', '慰謝料', '賠償金', '和解金'], level: 'critical', category: 'オレオレ詐欺', weight: 18 },
  { words: ['会社のお金', '横領', '使い込み'], level: 'critical', category: 'オレオレ詐欺', weight: 15 },

  // ── 還付金詐欺 ──
  { words: ['還付金', '過払い金', '払い戻し'], level: 'warning', category: '還付金詐欺', weight: 10 },
  { words: ['atmで手続き', 'atmに行って', 'コンビニatm'], level: 'critical', category: '還付金詐欺', weight: 20 },

  // ── サポート詐欺 ──
  { words: ['ウイルスに感染', 'ウイルス感染', 'マルウェア', 'pcが危険'], level: 'warning', category: 'サポート詐欺', weight: 10 },
  { words: ['今すぐ電話', 'サポートに電話', '050-', '0570-'], level: 'warning', category: 'サポート詐欺', weight: 10 },
  { words: ['遠隔操作', 'リモート操作', 'チームビューアー', 'teamviewer', 'anydesk'], level: 'critical', category: 'サポート詐欺', weight: 15 },

  // ── ロマンス詐欺 ──
  { words: ['会いに行きたい', '渡航費', '飛行機代', 'ビザ代'], level: 'warning', category: 'ロマンス詐欺', weight: 12 },
  { words: ['少しだけ貸して', 'お金を貸して', '送金してほしい', '立て替えて'], level: 'critical', category: 'ロマンス詐欺/金銭要求', weight: 15 },

  // ── 支払い手段（詐欺に多用） ──
  { words: ['ギフトカード', 'amazonギフト', 'itunesカード', 'googleplayカード', 'プリペイドカード'], level: 'critical', category: '不可逆な支払い手段', weight: 18 },
  { words: ['振込先', '振り込んで', '口座に送金', '口座番号'], level: 'warning', category: '金銭要求', weight: 8 },

  // ── SNS勧誘パターン ──
  { words: ['dm', 'ダイレクトメッセージ', 'dmください', 'dm送って'], level: 'suspicious', category: 'SNS勧誘', weight: 4 },
  { words: ['#副業', '#高収入', '#簡単', '#稼げる', '副業紹介'], level: 'suspicious', category: 'SNS勧誘（闇バイト/投資詐欺）', weight: 6 },
  { words: ['スマホだけで', 'スマホ1台', '在宅で月収', 'コピペだけ', 'コピペするだけ'], level: 'warning', category: '情報商材/闇バイト', weight: 10 },

  // ── 個人情報要求 ──
  { words: ['住所を教えて', '住所を送', '自宅の住所'], level: 'critical', category: '個人情報搾取', weight: 15 },
  { words: ['クレジットカード番号', 'カード番号', '暗証番号', 'パスワードを入力'], level: 'critical', category: 'フィッシング', weight: 20 },
]

// Flatten for display: create a flat keyword array from groups
const dangerKeywords = dangerKeywordGroups.flatMap(group =>
  group.words.map(word => ({ word, level: group.level, category: group.category, weight: group.weight }))
)

// ─── Simulation scenarios ─────────────────────────────
const simScenarios = [
  {
    id: 'oreore',
    name: 'オレオレ詐欺',
    icon: '📞',
    messages: [
      { role: 'scammer' as const, text: 'もしもし、お母さん？俺だけど…' },
      { role: 'coach' as const, text: '💡 ポイント：「俺」としか名乗りません。名前を聞き返してください。' },
    ],
    responses: [
      { text: '「誰？名前を言って」', next: [
        { role: 'scammer' as const, text: 'え…俺だよ、○○。ちょっと風邪ひいて声が変なんだ…' },
        { role: 'coach' as const, text: '💡 「風邪で声が変」は典型的な言い訳です。「じゃあ○○の携帯にかけ直すね」が正解！' },
      ]},
      { text: '「どうしたの？大丈夫？」', next: [
        { role: 'scammer' as const, text: '実は会社のお金を使い込んでしまって…今日中に200万円必要なんだ。誰にも言わないで…' },
        { role: 'coach' as const, text: '⚠️ 危険！「今日中」「誰にも言わないで」は詐欺の2大キーワードです。すぐに電話を切って、本人の携帯に折り返してください。' },
      ]},
      { text: '「電話切るね。本人の携帯にかけ直す」', next: [
        { role: 'coach' as const, text: '🎉 完璧な対応です！これが最も安全な対処法。折り返して本人に確認すれば、詐欺を100%見破れます。' },
      ]},
    ],
  },
  {
    id: 'kanpu',
    name: '還付金詐欺',
    icon: '🏢',
    messages: [
      { role: 'scammer' as const, text: '○○市役所の健康保険課の田中と申します。医療費の過払い分、35,000円の還付金がございます。' },
      { role: 'coach' as const, text: '💡 市役所を名乗っています。還付金の話が出たら要注意。' },
    ],
    responses: [
      { text: '「ATMで手続きできますか？」', next: [
        { role: 'scammer' as const, text: 'はい、お近くのATMに行って操作していただければ振り込まれます。今日が期限ですので…' },
        { role: 'coach' as const, text: '⚠️ 危険！ATMで「還付金を受け取る」操作は存在しません。ATMでできるのは「送金」だけです。これは100%詐欺です。' },
      ]},
      { text: '「市役所に直接行って確認します」', next: [
        { role: 'coach' as const, text: '🎉 正解！自分で市役所に行くか、公式サイトに載っている番号に電話するのが安全です。' },
      ]},
      { text: '「担当者の名前と部署を教えてください。折り返します」', next: [
        { role: 'scammer' as const, text: 'え…あの、本日中に手続きしないと期限切れになりますが…' },
        { role: 'coach' as const, text: '💡 「折り返す」と言った途端に焦り出すのは詐欺の証拠。市役所の公式番号にかけ直しましょう。' },
      ]},
    ],
  },
  {
    id: 'yami',
    name: '闇バイト勧誘（SNS）',
    icon: '💬',
    messages: [
      { role: 'scammer' as const, text: '【高額案件】日給5万〜10万！！荷物を受け取って指定の場所に届けるだけの簡単なお仕事です✨ 面接なし・即日勤務OK！興味ある方はDMください💰' },
      { role: 'coach' as const, text: '⚠️ 「荷物の受け取り・転送」は特殊詐欺の受け子（違法）です。これに応募するとどうなるか見てみましょう。' },
    ],
    responses: [
      { text: '「興味あります！詳しく教えてください」', next: [
        { role: 'scammer' as const, text: '応募ありがとう！まず身分証（免許証の写真）と口座情報を送ってください。すぐに仕事を紹介します。' },
        { role: 'coach' as const, text: '🚨 超危険！身分証を送った時点で：\n1. 脅迫材料にされる（「やめたら身分証をばらまく」）\n2. 個人情報が犯罪に使われる\n3. あなたが逮捕される（実行犯として）\n\n絶対に身分証を送らないでください。' },
      ]},
      { text: '「怪しいので無視する」', next: [
        { role: 'coach' as const, text: '🎉 正解！高額×簡単×匿名 = 100%闇バイトです。無視が最善です。可能ならSNSの通報機能で報告してください。' },
      ]},
      { text: '「通報する」', next: [
        { role: 'coach' as const, text: '🎉 最高の対応！SNSの通報機能を使うか、警察の闇バイト相談窓口（#9110）に情報提供してください。あなたの通報が誰かを救います。' },
      ]},
    ],
  },
]

// ─── Component ───────────────────────────────────────────
export default function ScamDefender() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'sim' | 'checklist' | 'database' | 'emergency' | 'yamicheck'>('quiz')

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null)
  const [quizComplete, setQuizComplete] = useState(false)

  // Sim state
  const [simScenario, setSimScenario] = useState<typeof simScenarios[0] | null>(null)
  const [simMessages, setSimMessages] = useState<SimMessage[]>([])
  const [simStep, setSimStep] = useState(0)

  // Checklist state
  const [checklist, setChecklist] = useState<CheckItem[]>(defaultChecklist)

  // Yami check state
  const [yamiInput, setYamiInput] = useState('')
  const [yamiResult, setYamiResult] = useState<{ score: number; found: typeof dangerKeywords; analysis: string } | null>(null)

  const tabs = [
    { id: 'quiz' as const, label: '🔍 詐欺クイズ' },
    { id: 'sim' as const, label: '📞 電話シミュレーター' },
    { id: 'checklist' as const, label: '✅ 見守りチェック' },
    { id: 'database' as const, label: '📊 詐欺手口DB' },
    { id: 'emergency' as const, label: '🚨 緊急通報ガイド' },
    { id: 'yamicheck' as const, label: '⚠️ 闇バイト判定' },
  ]

  // Quiz logic
  const currentQ = quizQuestions[quizIndex]
  const answerQuiz = useCallback((answer: boolean) => {
    if (quizAnswered) return
    const correct = answer === currentQ.isScam
    if (correct) setQuizScore(s => s + 1)
    setQuizCorrect(correct)
    setQuizAnswered(true)
  }, [quizAnswered, currentQ])

  const nextQuiz = useCallback(() => {
    if (quizIndex + 1 >= quizQuestions.length) {
      setQuizComplete(true)
    } else {
      setQuizIndex(i => i + 1)
      setQuizAnswered(false)
      setQuizCorrect(null)
    }
  }, [quizIndex])

  const resetQuiz = useCallback(() => {
    setQuizIndex(0)
    setQuizScore(0)
    setQuizAnswered(false)
    setQuizCorrect(null)
    setQuizComplete(false)
  }, [])

  // Sim logic
  const startSim = useCallback((scenario: typeof simScenarios[0]) => {
    setSimScenario(scenario)
    setSimMessages(scenario.messages)
    setSimStep(0)
  }, [])

  const simRespond = useCallback((responseIndex: number) => {
    if (!simScenario) return
    const response = simScenario.responses[responseIndex]
    const newMsgs: SimMessage[] = [
      { role: 'user', text: response.text },
      ...response.next,
    ]
    setSimMessages(prev => [...prev, ...newMsgs])
    setSimStep(s => s + 1)
  }, [simScenario])

  // Checklist logic
  const toggleCheck = useCallback((id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item))
  }, [])
  const completedChecks = checklist.filter(c => c.done).length

  // Yami check logic — enhanced scoring
  const analyzeYami = useCallback(() => {
    if (!yamiInput.trim()) return
    const text = yamiInput.toLowerCase()

    // Match against keyword groups (deduplicate by group)
    const matchedGroups: { words: string[]; matchedWord: string; level: 'critical' | 'warning' | 'suspicious'; category: string; weight: number }[] = []
    const seenCategories = new Set<string>()

    for (const group of dangerKeywordGroups) {
      for (const word of group.words) {
        if (text.includes(word.toLowerCase())) {
          const catKey = group.category + '|' + group.level
          if (!seenCategories.has(catKey)) {
            seenCategories.add(catKey)
            matchedGroups.push({ ...group, matchedWord: word })
          }
          break // one match per group is enough
        }
      }
    }

    // Base score from weights
    let rawScore = matchedGroups.reduce((sum, g) => sum + g.weight, 0)

    // ── Combo bonuses (multiple risk signals = exponentially more dangerous) ──
    const matchedCats = new Set(matchedGroups.map(g => g.category))
    const hasCrimeTool = matchedGroups.some(g => ['闇バイト（受け子）', '闇バイト（出し子）', '闘バイト（掛け子）', '受け子', '受け子/出し子', '口座詐欺', '犯罪加担', '犯罪ツール', '強盗（闇バイト用語）', '闇バイト'].includes(g.category))
    const hasHighPay = matchedGroups.some(g => g.category.includes('高額報酬') || g.category.includes('即金'))
    const hasEasy = matchedGroups.some(g => g.category.includes('簡単'))
    const hasAnon = matchedGroups.some(g => g.category.includes('匿名') || g.category.includes('口止め'))
    const hasIdRequest = matchedGroups.some(g => g.category.includes('個人情報搾取'))
    const hasUrgency = matchedGroups.some(g => g.category.includes('焦らせ'))

    // "高額 × 簡単 × 匿名" triple = classic yami-baito pattern
    if (hasHighPay && hasEasy && hasAnon) rawScore += 25
    // "高額 × 簡単" = very suspicious
    else if (hasHighPay && hasEasy) rawScore += 15
    // Crime tool + any other signal
    if (hasCrimeTool && (hasHighPay || hasIdRequest)) rawScore += 20
    // ID request + high pay = likely extortion trap
    if (hasIdRequest && hasHighPay) rawScore += 15
    // Urgency amplifier
    if (hasUrgency && matchedGroups.length >= 2) rawScore += 10

    // Normalize to 0-100
    const score = Math.min(100, Math.round(rawScore * 100 / 120))

    // Convert matched groups to flat found array for display
    const found = matchedGroups.map(g => ({
      word: g.matchedWord,
      level: g.level,
      category: g.category,
      weight: g.weight,
    }))

    // Detailed analysis
    let analysis = ''
    const details: string[] = []

    if (score >= 80) {
      analysis = '🚨 極めて危険 — 闇バイト・詐欺の可能性が非常に高いです。\n絶対に応募しないでください。SNSの通報機能で報告することを強くおすすめします。'
      if (hasCrimeTool) details.push('→ 犯罪の実行役にされる可能性があります（逮捕・実刑のリスク）')
      if (hasIdRequest) details.push('→ 身分証を送ると脅迫材料にされ、抜けられなくなります')
    } else if (score >= 60) {
      analysis = '⚠️ かなり危険 — 詐欺・闇バイトの特徴が複数見られます。\nこのような募集には絶対に応じないでください。'
      if (hasHighPay && hasEasy) details.push('→ 「高額」×「簡単」の組み合わせは闇バイトの典型パターン')
    } else if (score >= 40) {
      analysis = '🔶 要注意 — 複数の怪しいキーワードが検出されました。\n安全な仕事かどうか、慎重に確認してください。'
    } else if (score >= 20) {
      analysis = '🔸 やや注意 — 一部気になるキーワードがあります。\n会社名・所在地・事業内容を必ず確認してください。'
    } else if (matchedGroups.length > 0) {
      analysis = '🟡 軽微な注意点あり — 直ちに危険とは言えませんが、注意は必要です。'
    } else {
      analysis = '🟢 明確な危険キーワードは検出されませんでした。\nただし、テキスト分析だけでは判断できないケースもあります。\n\n💡 見分けるポイント:\n・会社名/所在地が明記されているか\n・仕事内容が具体的か\n・報酬が相場と比べて高すぎないか\n・「高額×簡単×匿名」の3要素が揃っていないか'
    }

    if (details.length > 0) {
      analysis += '\n\n' + details.join('\n')
    }

    setYamiResult({ score, found, analysis })
  }, [yamiInput])

  return (
    <div className="min-h-screen bg-[#0a0a14] text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0f0f1a]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-4xl mb-2">🛡️</div>
          <h1 className="text-2xl font-bold">AI詐欺ディフェンダー</h1>
          <p className="text-gray-400 mt-1">詐欺シミュレーション × 闇バイト判定 × 家族見守り</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 bg-[#0f0f1a] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ─── Quiz Tab ─── */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">🔍 詐欺パターン検知クイズ</h2>
            {!quizComplete ? (
              <>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>問題 {quizIndex + 1} / {quizQuestions.length}</span>
                  <span>スコア: {quizScore}/{quizIndex + (quizAnswered ? 1 : 0)}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${((quizIndex + (quizAnswered ? 1 : 0)) / quizQuestions.length) * 100}%` }} />
                </div>
                <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                  <div className="flex gap-2 mb-4">
                    <span className={`text-xs px-2 py-1 rounded ${currentQ.difficulty === '初級' ? 'bg-green-500/20 text-green-400' : currentQ.difficulty === '中級' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>{currentQ.difficulty}</span>
                    <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-400">{currentQ.category}</span>
                  </div>
                  <p className="text-lg leading-relaxed mb-6">{currentQ.scenario}</p>
                  {!quizAnswered ? (
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => answerQuiz(true)} className="py-4 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 rounded-xl font-bold text-lg transition-colors">🚨 詐欺だ！</button>
                      <button onClick={() => answerQuiz(false)} className="py-4 bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 rounded-xl font-bold text-lg transition-colors">✅ 安全</button>
                    </div>
                  ) : (
                    <div className={`p-4 rounded-xl ${quizCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                      <p className="font-bold text-lg mb-2">{quizCorrect ? '🎉 正解！' : '❌ 不正解…'}</p>
                      <p className="text-sm text-gray-300">{currentQ.explanation}</p>
                      <button onClick={nextQuiz} className="mt-4 px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium transition-colors">
                        {quizIndex + 1 >= quizQuestions.length ? '結果を見る' : '次の問題 →'}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-[#13131e] rounded-xl border border-amber-500/30 p-8 text-center">
                <div className="text-6xl mb-4">{quizScore >= 8 ? '🏆' : quizScore >= 5 ? '👍' : '📚'}</div>
                <div className="text-4xl font-bold text-amber-400 mb-2">{quizScore} / {quizQuestions.length}</div>
                <p className="text-gray-400 mb-2">正解率: {Math.round(quizScore / quizQuestions.length * 100)}%</p>
                <p className="text-lg mb-6">
                  {quizScore >= 8 ? '素晴らしい！詐欺を見抜く力が高いです。' :
                   quizScore >= 5 ? 'まずまず。苦手なパターンを復習しましょう。' :
                   '要注意！詐欺手口データベースで学習をおすすめします。'}
                </p>
                <button onClick={resetQuiz} className="px-8 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-bold transition-colors">もう一度挑戦</button>
              </div>
            )}
          </div>
        )}

        {/* ─── Sim Tab ─── */}
        {activeTab === 'sim' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">📞 詐欺電話シミュレーター</h2>
            {!simScenario ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {simScenarios.map(s => (
                  <button
                    key={s.id}
                    onClick={() => startSim(s)}
                    className="bg-[#13131e] rounded-xl border border-gray-800 p-6 text-left hover:border-amber-500/50 transition-colors"
                  >
                    <div className="text-4xl mb-3">{s.icon}</div>
                    <h3 className="font-bold text-lg">{s.name}</h3>
                    <p className="text-sm text-gray-500 mt-2">クリックして練習開始</p>
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="bg-[#13131e] rounded-xl border border-gray-800 p-4 min-h-[400px] space-y-3">
                  {simMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                        msg.role === 'scammer' ? 'bg-red-500/20 text-red-200 rounded-bl-none' :
                        msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' :
                        'bg-amber-500/10 text-amber-200 rounded-bl-none border border-amber-500/30'
                      }`}>
                        <div className="text-xs mb-1 opacity-60">
                          {msg.role === 'scammer' ? '👤 詐欺犯' : msg.role === 'user' ? '🙋 あなた' : '🛡️ コーチ'}
                        </div>
                        <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
                      </div>
                    </div>
                  ))}
                </div>
                {simStep === 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">あなたの対応を選んでください：</p>
                    {simScenario.responses.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => simRespond(i)}
                        className="w-full text-left p-4 bg-[#1a1a2e] hover:bg-[#252540] border border-gray-700 rounded-xl text-sm transition-colors"
                      >
                        {r.text}
                      </button>
                    ))}
                  </div>
                )}
                <button onClick={() => { setSimScenario(null); setSimMessages([]); setSimStep(0) }} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors">
                  ← シナリオ選択に戻る
                </button>
              </>
            )}
          </div>
        )}

        {/* ─── Checklist Tab ─── */}
        {activeTab === 'checklist' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">✅ 家族見守りセキュリティチェック</h2>
              <span className="text-sm text-gray-400">{completedChecks}/{checklist.length} 完了</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div className="bg-gradient-to-r from-amber-500 to-green-500 h-3 rounded-full transition-all duration-500" style={{ width: `${(completedChecks / checklist.length) * 100}%` }} />
            </div>
            <p className="text-sm text-gray-400">次の帰省時に、親御さんと一緒にチェックしましょう 👨‍👩‍👦</p>

            {['スマホ設定', 'アカウント', 'SNS', 'コミュニケーション', 'メール', '金融'].map(category => {
              const items = checklist.filter(c => c.category === category)
              if (items.length === 0) return null
              return (
                <div key={category}>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{category}</h3>
                  <div className="space-y-2">
                    {items.map(item => (
                      <div
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          item.done ? 'bg-green-500/10 border-green-500/30' : 'bg-[#13131e] border-gray-800 hover:border-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${item.done ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}>
                          {item.done && <span className="text-xs text-white">✓</span>}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${item.done ? 'line-through text-gray-500' : ''}`}>{item.label}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${item.priority === '必須' ? 'bg-red-500/20 text-red-400' : item.priority === '推奨' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-700 text-gray-500'}`}>{item.priority}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ─── Database Tab ─── */}
        {activeTab === 'database' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">📊 最新詐欺手口データベース</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scamPatterns.map(pattern => (
                <div key={pattern.id} className="bg-[#13131e] rounded-xl border border-gray-800 p-5 hover:border-red-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">{pattern.name}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-400">{pattern.category}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{pattern.description}</p>
                  <div className="mb-3">
                    <p className="text-xs text-red-400 font-bold mb-1">🚨 危険キーワード:</p>
                    <div className="flex flex-wrap gap-1">
                      {pattern.keywords.map((kw, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">{kw}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1 mb-3">
                    {pattern.examples.map((ex, i) => (
                      <p key={i}>💬 {ex}</p>
                    ))}
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-2 text-xs text-green-400">
                    🛡️ {pattern.prevention}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">💰 {pattern.damage}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Emergency Tab ─── */}
        {activeTab === 'emergency' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-xl font-bold">🚨 緊急通報ガイド</h2>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
              <p className="text-lg font-bold text-red-400 mb-4">詐欺被害に遭った・遭いそうな場合</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#13131e] rounded-xl p-4">
                  <div className="text-3xl mb-2">👮</div>
                  <p className="font-bold text-lg">警察相談</p>
                  <p className="text-3xl font-bold text-amber-400 mt-2">#9110</p>
                  <p className="text-xs text-gray-500 mt-1">緊急でない相談</p>
                </div>
                <div className="bg-[#13131e] rounded-xl p-4">
                  <div className="text-3xl mb-2">🚔</div>
                  <p className="font-bold text-lg">緊急通報</p>
                  <p className="text-3xl font-bold text-red-400 mt-2">110</p>
                  <p className="text-xs text-gray-500 mt-1">今まさに被害発生中</p>
                </div>
                <div className="bg-[#13131e] rounded-xl p-4">
                  <div className="text-3xl mb-2">📞</div>
                  <p className="font-bold text-lg">消費者ホットライン</p>
                  <p className="text-3xl font-bold text-green-400 mt-2">188</p>
                  <p className="text-xs text-gray-500 mt-1">消費者トラブル全般</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">対処ステップ</h3>
              {emergencySteps.map(step => (
                <div key={step.step} className="flex items-start gap-4 bg-[#13131e] rounded-xl border border-gray-800 p-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Step {step.step}: {step.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Yami Check Tab ─── */}
        {activeTab === 'yamicheck' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">⚠️ 闇バイト判定チェッカー</h2>
            <p className="text-sm text-gray-400">SNSやメッセージで見かけたバイト募集文を貼り付けてください。危険度をAIが判定します。</p>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <textarea
                placeholder="ここにバイト募集文を貼り付け...&#10;&#10;例: 「高収入バイト！日給5万〜！荷物を受け取って届けるだけ！面接なし即日OK」"
                value={yamiInput}
                onChange={e => setYamiInput(e.target.value)}
                rows={6}
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-amber-500 focus:outline-none resize-none"
              />
              <button onClick={analyzeYami} className="w-full mt-4 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium transition-colors">
                🔍 危険度を判定する
              </button>
            </div>

            {yamiResult && (
              <div className="space-y-4">
                <div className={`bg-[#13131e] rounded-xl border p-6 text-center ${
                  yamiResult.score >= 80 ? 'border-red-500/50' :
                  yamiResult.score >= 50 ? 'border-amber-500/50' :
                  yamiResult.score >= 20 ? 'border-yellow-500/50' :
                  'border-green-500/50'
                }`}>
                  <div className="text-sm text-gray-400 mb-2">危険度スコア</div>
                  <div className={`text-6xl font-bold ${
                    yamiResult.score >= 80 ? 'text-red-500' :
                    yamiResult.score >= 50 ? 'text-amber-500' :
                    yamiResult.score >= 20 ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    {yamiResult.score}%
                  </div>
                  <pre className="text-sm mt-4 whitespace-pre-wrap font-sans text-left max-w-lg mx-auto">{yamiResult.analysis}</pre>
                </div>

                {yamiResult.found.length > 0 && (
                  <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                    <h3 className="font-bold mb-3">検出された危険キーワード:</h3>
                    <div className="space-y-2">
                      {yamiResult.found.map((kw, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-1 rounded font-bold ${
                            kw.level === 'critical' ? 'bg-red-500/20 text-red-400' :
                            kw.level === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {kw.level === 'critical' ? '🚨 危険' : kw.level === 'warning' ? '⚠️ 注意' : '🔶 要確認'}
                          </span>
                          <span className="text-sm font-mono text-red-300">「{kw.word}」</span>
                          <span className="text-xs text-gray-500">→ {kw.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
