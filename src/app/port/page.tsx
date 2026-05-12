'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search, Code, Sparkles, LineChart, Zap, Mail, Video,
  MessageSquare, HeartHandshake, Phone, Mic, FileText, Globe,
  Database, Shield, Briefcase, ArrowRight, CheckCircle2,
  RotateCcw, Star, ExternalLink, Bot, CalendarCheck,
  CreditCard, Package, Users, Building2, TrendingUp, Camera,
  BookOpen, Cpu, Wifi, Lock, Award, Heart, Map
} from 'lucide-react'

const IDENTITY = {
  name: "米山 文貴",
  kana: "よねやま ふみたか",
  handle: "Ninja3 / NextraLabs",
  motto: "「指示したら、あとは全部やってくれる人」として働きます。",
  description: "リサーチ・開発・コンテンツ制作・自動化まで、アイデアを実行まで完結させます。AIツールを最大限に使いこなし、一人で数人分の仕事を高速でこなします。「なんとなくこんなもの」という段階から形にする実行力が強みです。",
  base: "神奈川県海老名市",
  email: "f.yoneyone9@gmail.com",
  twitter: "https://x.com/0022_sougo",
  nextraLabs: "https://nextralab.jp",
  youtube: "https://www.youtube.com/@marriage_road",
};

const STATS = [
  { label: "開発・リリース済みAIツール", value: "40+" },
  { label: "IT業界キャリア", value: "20年" },
  { label: "最速納品実績", value: "24h" },
  { label: "取得資格", value: "8+" },
];

const CERTS = [
  { name: "CompTIA Security+", icon: Shield },
  { name: "CompTIA A+", icon: Cpu },
  { name: "CompTIA Network+", icon: Wifi },
  { name: "QC検定3級", icon: Award },
  { name: "上級心理カウンセラー（JADP）", icon: Heart },
  { name: "メンタル心理カウンセラー（JADP）", icon: Heart },
];

const CAREER = [
  {
    period: "2007 – 2020",
    company: "PFUクオリティサービス(株)",
    role: "PCキッティング現場リーダー → 営業事務（15年）",
    desc: "大規模PCキッティング（数百台規模）の現場リーダーとして10年間従事。後半5年はビジネス推進部で営業事務を担当。チームマネジメント・進捗管理・顧客折衝まで幅広く経験。",
    tags: ["現場リーダー", "PCキッティング", "チームマネジメント", "営業事務"],
  },
  {
    period: "2021 – 現在",
    company: "結婚相談所 マレッジロードジャパン（IBJ加盟）",
    role: "代表・仲人",
    desc: "IBJ（日本結婚相談所連盟）に加盟し、結婚相談所を開業・運営。仲人業務・カウンセリング・婚活イベント企画を担当。上級心理カウンセラー資格を活かし、婚活者の内面サポートも行う。YouTubeチャンネル「マレッジロードジャパン」で情報発信中。",
    tags: ["IBJ加盟", "仲人", "カウンセリング", "YouTube運営"],
  },
  {
    period: "2021 – 現在",
    company: "(株)デバイスエージェンシー",
    role: "IoTソリューション導入支援エンジニア",
    desc: "ホテル・施設向けIoTソリューション（スマートロック・スマートチェックイン）の導入支援。Python/API連携によるシステム改修・現地キッティング・ネットワーク構築を担当。PR TIMESへのプレスリリース実績あり。",
    tags: ["Python", "API連携", "IoT", "スマートロック", "ホテルWi-Fi"],
  },
  {
    period: "2026 – 現在",
    company: "NextraLabs（個人事業）",
    role: "代表・AIエンジニア・プロダクトオーナー",
    desc: "AIツール・Webサービスを企画・開発・販売する個人事業。40種類以上のAIツールを自ら開発しリリース。会員制サービス（月額980円〜）を運営し、サブスク＋単品販売＋BOOTH物販の複合収益モデルを構築。",
    tags: ["Next.js", "TypeScript", "Supabase", "Vercel", "Stripe", "AI開発"],
  },
];

const SKILLS = [
  {
    icon: Code,
    title: "Webアプリ開発・本番デプロイ",
    desc: "Next.js / TypeScript / React でフルスタック開発。Supabase（DB・Auth）・Stripe（決済）・Vercel（デプロイ）を組み合わせた本番サービスを40本以上リリース済み。独自ドメイン・HTTPS対応まで一貫対応。",
    tags: ["Next.js", "TypeScript", "React", "Supabase", "Stripe", "Vercel"],
  },
  {
    icon: Bot,
    title: "AIツール企画・開発・販売",
    desc: "ChatGPT / Gemini / Claude APIを活用した実用AIツールを量産。生産性・婚活・防災・料理・旅行など多ジャンルで40種類以上を開発。会員制サービスとして月額課金モデルで運営中。",
    tags: ["OpenAI API", "Gemini API", "Claude API", "会員制SaaS", "プロンプトエンジニアリング"],
  },
  {
    icon: Zap,
    title: "業務自動化・定期実行",
    desc: "毎日・毎週・毎月のレポート生成・通知・データ収集を全自動化。Cron・Webhook・Supabaseエッジ関数を組み合わせて、一度仕組みを作れば完全ノータッチで回し続けるシステムを構築。",
    tags: ["Cron", "Webhook", "Supabase Edge Functions", "自動化設計"],
  },
  {
    icon: Search,
    title: "情報収集・深層リサーチ",
    desc: "Webを横断的に検索・解析し、競合分析・市場調査・ファクトチェックを実施。複数情報源を照合した信頼性の高いレポートを作成。SNSトレンド監視・バズ予兆検知まで対応。",
    tags: ["競合分析", "市場調査", "SNSモニタリング", "ファクトチェック"],
  },
  {
    icon: Sparkles,
    title: "AIコンテンツ制作",
    desc: "プロンプト一つでスライド・AI画像・AI動画・TTS音声・ポッドキャストを高品質に制作。Kling V3でコメディアニメ動画を生成した実績あり。ブランドに合ったビジュアルを短時間で量産。",
    tags: ["AI画像生成", "Kling動画", "TTS音声", "ポッドキャスト", "スライド制作"],
  },
  {
    icon: Cpu,
    title: "IoTシステム導入・ネットワーク構築",
    desc: "ホテル・施設向けIoTソリューション（スマートロック・スマートチェックイン・WiFi）の導入支援エンジニアとして稼働。Python/API連携によるシステム改修・現地キッティングまで担当。",
    tags: ["IoT", "スマートロック", "Wi-Fi構築", "Python", "API連携"],
  },
  {
    icon: LineChart,
    title: "データ集計・ダッシュボード",
    desc: "散在するデータを収集・集計・可視化し、KPIダッシュボードや月次レポートを自動生成。Supabase + Next.js でリアルタイム更新するダッシュボードを構築。意思決定をデータドリブンに変える。",
    tags: ["KPI設計", "グラフ可視化", "リアルタイム更新", "Supabase"],
  },
  {
    icon: Mail,
    title: "メール・カレンダー管理自動化",
    desc: "Gmail / Outlook の大量メールを自動分類・優先度付け・返信下書きまで対応。Gmail AI Acceleratorを自ら開発し実運用中。受信トレイゼロを維持する仕組みを構築。",
    tags: ["Gmail API", "Outlook", "自動分類", "AI返信生成"],
  },
  {
    icon: Mic,
    title: "音声文字起こし・議事録作成",
    desc: "会議・インタビューの音声をAIで文字起こしし、要点整理・アクションアイテム抽出まで完了した議事録として納品。多言語対応・話者分離にも対応。",
    tags: ["Whisper", "文字起こし", "議事録整形", "要点抽出"],
  },
  {
    icon: Phone,
    title: "AI電話代行",
    desc: "レストラン予約・アポ取り・問い合わせなど、AIが代わりに電話をかけて結果を報告するサービスを開発・運用中。通話内容のレポーティングまで自動化。",
    tags: ["AI電話", "予約代行", "アポ取り", "通話レポート"],
  },
  {
    icon: Video,
    title: "YouTube・動画コンテンツ制作",
    desc: "「マレッジロードジャパン」YouTubeチャンネルを運営。AI動画生成（Kling V3）でコメディアニメを制作した実績あり。ずんだもん・ゆっくり系の動画制作にも対応。",
    tags: ["YouTube運営", "Kling V3", "AI動画", "ずんだもん", "ゆっくり"],
  },
  {
    icon: Heart,
    title: "婚活カウンセリング・仲人",
    desc: "IBJ加盟の結婚相談所「マレッジロードジャパン」を運営。上級心理カウンセラー資格を活かした深いカウンセリングで、婚活者の自己分析・パートナー選択をサポート。",
    tags: ["IBJ", "仲人", "心理カウンセリング", "婚活支援"],
  },
];

// 実際のツールリスト（nextralab.jp でリリース済み）
const TOOLS = [
  { cat: "生産性", title: "Gmail AI Accelerator", desc: "Gmailを自動分類・AI返信生成で受信トレイをゼロに保つ", slug: "inbox-organizer" },
  { cat: "生産性", title: "SNS自動投稿ポスター", desc: "X・Instagram・Threads への投稿をAIで自動生成・スケジュール管理", slug: "sns-auto-poster" },
  { cat: "生産性", title: "AI副業スタートダッシュ", desc: "SNSから「あったらいいな」声を自動収集→SaaSアイデアをスコアリング", slug: "ai-sidejob" },
  { cat: "生産性", title: "AI YouTubeプロデューサー", desc: "企画・台本・サムネ・タグまでAIが一括生成するYouTube運営支援", slug: "youtube-producer" },
  { cat: "生産性", title: "Vercelモニター", desc: "Vercelデプロイ状況をリアルタイム監視・アラート通知", slug: "vercel-monitor" },
  { cat: "学習", title: "AI試験スケジューラー", desc: "資格試験の学習計画を自動生成・進捗管理まで対応", slug: "exam-scheduler" },
  { cat: "学習", title: "AI問題生成＆苦手分析", desc: "参考書のテキストからAIが問題を自動生成・苦手を分析", slug: "ai-exam-generator" },
  { cat: "学習", title: "Kindle出版完全ナビ", desc: "Kindle本の企画〜執筆〜KDP登録まで一気通貫でサポート", slug: "kdp-guide" },
  { cat: "学習", title: "Kindle AI ファクトリー", desc: "テーマを入力するだけでKindle本の原稿・目次・表紙を自動生成", slug: "kindle-factory" },
  { cat: "生活", title: "AIレシピ献立コーチ", desc: "冷蔵庫の食材から最適な献立を提案・買い物リスト自動生成", slug: "ai-recipe" },
  { cat: "生活", title: "AI引越し安心チェッカー", desc: "引越し準備チェックリストをAIが自動作成・業者比較支援", slug: "moving-checker" },
  { cat: "生活", title: "AI防災パーソナルガイド", desc: "地域・家族構成に合わせた防災計画・備蓄リストを自動生成", slug: "disaster-guard" },
  { cat: "生活", title: "AIスマートガーデニング", desc: "植物の種類・環境に合わせた育て方・水やりスケジュールを提案", slug: "smart-gardening" },
  { cat: "生活", title: "ペット翻訳AI", desc: "ペットの行動・鳴き声から気持ちをAIが翻訳・アドバイス", slug: "pet-translator" },
  { cat: "生活", title: "AI天気ブースト", desc: "天気予報×AIで今日の服装・行動計画を自動提案", slug: "weather-boost" },
  { cat: "生活", title: "AIクローゼットコーチ", desc: "手持ちの服からコーデを提案・断捨離アドバイスも", slug: "closet-coach" },
  { cat: "生活", title: "AI美容ブースト", desc: "顔型・肌質・ライフスタイルに合わせた美容ルーティン提案", slug: "beauty-boost" },
  { cat: "マネー", title: "AI借金完済・おまとめ診断", desc: "複数の借金をAIが分析・最適な返済プランとおまとめローンを診断", slug: "loan-advisor" },
  { cat: "マネー", title: "AI家計防衛シミュレーター", desc: "収支を入力するだけで節約ポイント・貯蓄計画をAIが自動分析", slug: "money-guard" },
  { cat: "マネー", title: "AI買い物依存ストッパー", desc: "衝動買いを防ぐ72時間ルール＋AIによる購入可否チェック", slug: "shopping-stopper" },
  { cat: "マネー", title: "中古・新品AI比較ナビ", desc: "Amazon・メルカリ・フリマ価格をAIが一括比較・お得度スコア算出", slug: "buy-smart-nav" },
  { cat: "マネー", title: "AIギフトアドバイザー", desc: "相手の趣味・予算・関係性からベストなギフトをAIが提案", slug: "gift-advisor" },
  { cat: "トレンド・株価", title: "トレンド×株価ダッシュボード", desc: "SNSバズ・ニュース・株価をリアルタイム連動で可視化", slug: "ai-select-shop" },
  { cat: "コミュニケーション", title: "AIコミュコーチ", desc: "職場・友人・恋愛シーン別の最適な言い回しをAIが提案", slug: "comm-coach" },
  { cat: "コミュニケーション", title: "AI退職代行アシスタント", desc: "退職交渉・書類作成・次のステップをAIが完全サポート", slug: "resignation-assistant" },
  { cat: "コミュニケーション", title: "AI塩対応くん", desc: "面倒な人・空気読めない人への完璧な塩対応テンプレートを生成", slug: "shio-taiou" },
  { cat: "コミュニケーション", title: "AIバズライター", desc: "SNS・note・ブログのバズる文章をAIが自動生成", slug: "buzz-writer" },
  { cat: "旅行・外出", title: "AI旅行コンシェルジュ", desc: "行き先・日程・予算を入力するだけで最適な旅程を自動作成", slug: "travel-concierge" },
  { cat: "旅行・外出", title: "推し活聖地巡礼プランナー", desc: "推しの聖地を地図上にマッピング・効率的な巡礼ルートを自動生成", slug: "pilgrimage-planner" },
  { cat: "旅行・外出", title: "AI Location Finder", desc: "起業・民泊・店舗に最適な物件・立地をAIが多角的に分析", slug: "location-finder" },
  { cat: "旅行・外出", title: "Staysee AI Finder", desc: "民泊・短期賃貸の最適物件をAIが自動スクリーニング・比較", slug: "staysee-ai-finder" },
  { cat: "旅行・外出", title: "AIデートコンシェルジュ", desc: "相手の好み・予算・エリアからデートプランをAIが完全設計", slug: "date-concierge" },
  { cat: "婚活", title: "AI婚活スケジューラー", desc: "婚活の目標設定から日程管理・振り返りまでAIがフルサポート", slug: "konkatsu-scheduler" },
  { cat: "婚活", title: "オンライン婚活グルーミング", desc: "プロフィール写真・自己紹介文・初回メッセージをAIが最適化", slug: "omiai-room" },
  { cat: "AI画像", title: "AI画像プロンプトマスター", desc: "Midjourney・DALL-E・Stable Diffusion用の最強プロンプトをAIが生成", slug: "prompt-master" },
  { cat: "詐欺対策", title: "AI詐欺ディフェンダー", desc: "怪しいURLや文章をAIが分析・フィッシング・詐欺リスクを即判定", slug: "scam-defender" },
  { cat: "業務効率", title: "AIセレクトショップ診断", desc: "ECサイト・ショップのコンセプト・商品構成をAIが診断・提案", slug: "ai-select-shop" },
  { cat: "修理", title: "AI修理パーツ診断くん", desc: "故障した家電・デバイスの症状からパーツ・修理方法をAIが特定", slug: "repair-parts-finder" },
  { cat: "業務", title: "Universal Converter", desc: "単位・通貨・ファイル形式・テキスト変換を一画面で完結", slug: "universal-converter" },
  { cat: "業務", title: "AI音声ゲストアシスト", desc: "ホテル・施設向けAI音声案内・多言語ゲスト対応システム", slug: "voice-guest-assist" },
];

// カテゴリごとに色分け
const CAT_COLOR: Record<string, string> = {
  "生産性": "bg-emerald-600/10 text-emerald-400",
  "学習": "bg-blue-600/10 text-blue-400",
  "生活": "bg-purple-600/10 text-purple-400",
  "マネー": "bg-yellow-600/10 text-yellow-400",
  "トレンド・株価": "bg-red-600/10 text-red-400",
  "コミュニケーション": "bg-pink-600/10 text-pink-400",
  "旅行・外出": "bg-cyan-600/10 text-cyan-400",
  "婚活": "bg-rose-600/10 text-rose-400",
  "AI画像": "bg-violet-600/10 text-violet-400",
  "詐欺対策": "bg-orange-600/10 text-orange-400",
  "業務効率": "bg-teal-600/10 text-teal-400",
  "修理": "bg-amber-600/10 text-amber-400",
  "業務": "bg-slate-500/20 text-slate-300",
};

const NOTABLE = [
  {
    title: "NextraLabs 会員制AIツールサービス",
    desc: "月額980円〜で40種類以上のAIツールを使い放題。自ら企画・開発・デプロイ・運営まで一人で完結。Stripe課金・Supabase認証・Vercelデプロイで本番稼働中。",
    url: "https://nextralab.jp",
    label: "nextralab.jp ↗",
    cat: "SaaS事業",
  },
  {
    title: "スマートホテル向けIoT APIシステム",
    desc: "EPICスマートロックとAdvaNceD IoTのAPI連携システム開発・導入。PR TIMESにプレスリリースを掲載。Python/APIでシステム改修から現地キッティングまで担当。",
    url: "https://prtimes.jp/main/html/rd/p/000000178.000058452.html",
    label: "プレスリリースを見る ↗",
    cat: "IoTエンジニアリング",
  },
  {
    title: "マレッジロードジャパン（結婚相談所）",
    desc: "IBJ加盟の結婚相談所を個人で開業・運営。YouTubeチャンネルで婚活情報を発信。上級心理カウンセラー資格を活かしたカウンセリングで多数の成婚を支援。",
    url: "https://www.youtube.com/@marriage_road",
    label: "YouTubeチャンネル ↗",
    cat: "起業・事業運営",
  },
  {
    title: "AI動画コメディアニメ（Kling V3）",
    desc: "Kling V3を使ったAIコメディアニメ動画を制作・公開。テキストプロンプトから高品質なアニメーション動画を生成するAI動画制作の最前線を実践。",
    url: "https://nextralab.jp/products/youtube-producer",
    label: "YouTube Producerツールを見る ↗",
    cat: "AI動画制作",
  },
];

const SERVICES_OFFER = [
  { icon: Bot, title: "AIツール・Webアプリ開発", desc: "Next.js + Supabase + Stripe で本番SaaSを構築。AIAPIの組み込みも込みで対応。" },
  { icon: Zap, title: "業務自動化システム構築", desc: "毎日の繰り返し作業をCron・Webhook・AIで完全自動化。工数ゼロに変えます。" },
  { icon: Search, title: "競合調査・市場リサーチ", desc: "複数情報源を横断した精度の高いリサーチレポートを作成。" },
  { icon: Sparkles, title: "AIコンテンツ量産", desc: "画像・動画・音声・スライド・記事をAIで高速量産。ブランド統一で納品。" },
  { icon: LineChart, title: "データ分析・ダッシュボード", desc: "散在データを集計・可視化。KPIダッシュボードをリアルタイム化。" },
  { icon: Cpu, title: "IoT・ネットワーク構築", desc: "スマートロック・Wi-Fi・IoTデバイスの導入支援。現地キッティングも対応。" },
  { icon: Video, title: "YouTube・動画コンテンツ制作", desc: "企画〜AI動画生成〜編集〜公開まで一貫対応。" },
  { icon: Heart, title: "婚活カウンセリング・仲人", desc: "心理カウンセラー資格を持つ仲人として、婚活者の成婚をトータルサポート。" },
];

const MasterEngine = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'tools' | 'skills' | 'career'>('tools');
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;

  // ツールをカテゴリでグループ化
  const toolsByCategory = TOOLS.reduce((acc, tool) => {
    if (!acc[tool.cat]) acc[tool.cat] = [];
    acc[tool.cat].push(tool);
    return acc;
  }, {} as Record<string, typeof TOOLS>);

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32 overflow-x-hidden selection:bg-emerald-500/30">

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#10b98115,transparent_50%)]" />
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge className="bg-emerald-600 text-white font-bold px-5 py-1.5 rounded-full text-xs tracking-tight shadow-lg">
              <span className="w-1.5 h-1.5 bg-white rounded-full inline-block mr-2 animate-pulse" />
              稼働中 · NextraLabs
            </Badge>
            <Badge className="bg-white/5 border border-white/10 text-slate-300 font-bold px-5 py-1.5 rounded-full text-xs">
              ITキャリア20年
            </Badge>
            <Badge className="bg-white/5 border border-white/10 text-slate-300 font-bold px-5 py-1.5 rounded-full text-xs">
              AIツール40本+リリース済み
            </Badge>
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl md:text-8xl font-bold text-white leading-tight">{IDENTITY.name}</h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium">{IDENTITY.kana} · {IDENTITY.handle}</p>
            <p className="text-xl md:text-3xl font-bold text-emerald-400 max-w-3xl mx-auto leading-snug">{IDENTITY.motto}</p>
          </div>
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {IDENTITY.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a href={IDENTITY.nextraLabs} target="_blank" rel="noopener noreferrer"
              className="h-12 px-8 bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-emerald-500 transition-all shadow-xl">
              NextraLabsを見る <ArrowRight size={18} />
            </a>
            <a href={`mailto:${IDENTITY.email}`}
              className="h-12 px-8 bg-white/5 border border-white/10 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all">
              連絡する
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
        {STATS.map(s => (
          <div key={s.label} className="bg-[#13141f] border border-white/5 p-8 rounded-3xl text-center">
            <p className="text-4xl md:text-5xl font-bold text-white mb-2">{s.value}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{s.label}</p>
          </div>
        ))}
      </section>

      {/* タブナビ */}
      <section className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex gap-2 bg-[#0d1117] p-1.5 rounded-2xl w-fit mx-auto">
          {([['tools', '🛠 リリース済みAIツール'], ['skills', '💡 スキル'], ['career', '📋 経歴']] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ── AIツール一覧 ── */}
      {activeTab === 'tools' && (
        <section className="max-w-7xl mx-auto px-4 mb-32 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-white">リリース済みAIツール {TOOLS.length}本+</h2>
            <p className="text-slate-400 text-sm">すべて <a href="https://nextralab.jp" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">nextralab.jp</a> で稼働中 · 月額980円〜で使い放題</p>
          </div>
          {Object.entries(toolsByCategory).map(([cat, tools]) => (
            <div key={cat}>
              <div className="flex items-center gap-3 mb-4">
                <Badge className={`${CAT_COLOR[cat] || 'bg-white/10 text-white'} font-bold px-4 py-1 rounded-full text-sm border-0`}>{cat}</Badge>
                <span className="text-slate-600 text-sm">{tools.length}本</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map(tool => (
                  <a
                    key={tool.slug}
                    href={`https://nextralab.jp/products/${tool.slug}/app`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-[#0d1117] border border-white/5 p-6 rounded-2xl hover:border-emerald-500/30 hover:bg-[#13141f] transition-all flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-white leading-tight group-hover:text-emerald-400 transition-colors">{tool.title}</h3>
                      <ExternalLink size={14} className="text-slate-600 group-hover:text-emerald-500 transition-colors shrink-0 mt-0.5" />
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed">{tool.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ── スキル ── */}
      {activeTab === 'skills' && (
        <section className="max-w-7xl mx-auto px-4 mb-32 space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center">できること</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILLS.map(s => (
              <Card key={s.title} className="bg-[#13141f] border border-white/5 p-8 rounded-3xl hover:border-emerald-500/30 transition-all flex flex-col h-full group shadow-2xl">
                <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center mb-5 text-emerald-500 group-hover:scale-110 transition-transform">
                  <s.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 leading-tight">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-5 flex-1">{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map(t => (
                    <Badge key={t} variant="secondary" className="bg-black/50 text-[10px] text-slate-400 border-0">{t}</Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* 資格 */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-white mb-6 text-center">取得資格</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CERTS.map(c => (
                <div key={c.name} className="bg-[#0d1117] border border-white/5 p-5 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-600/10 rounded-lg flex items-center justify-center text-emerald-500 shrink-0">
                    <c.icon size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-300">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 経歴 ── */}
      {activeTab === 'career' && (
        <section className="max-w-4xl mx-auto px-4 mb-32 space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center">職歴・経歴</h2>
          <div className="space-y-6">
            {CAREER.map((c, i) => (
              <div key={i} className="bg-[#13141f] border border-white/5 p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-3xl" />
                <div className="pl-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">{c.period}</span>
                    <h3 className="text-lg font-bold text-white">{c.company}</h3>
                  </div>
                  <p className="text-emerald-300 font-semibold text-sm">{c.role}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{c.desc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {c.tags.map(t => (
                      <Badge key={t} variant="secondary" className="bg-black/40 text-[10px] text-slate-400 border-0">{t}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 注目実績 */}
      <section className="max-w-7xl mx-auto px-4 mb-32 space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center">注目の実績・プロジェクト</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {NOTABLE.map(n => (
            <div key={n.title} className="bg-[#13141f] p-8 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all group flex flex-col h-full">
              <Badge className="bg-emerald-600/10 text-emerald-400 border-0 mb-4 w-fit text-xs font-bold">{n.cat}</Badge>
              <h3 className="text-xl font-bold text-white mb-3 leading-tight">{n.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">{n.desc}</p>
              <a href={n.url} target="_blank" rel="noopener noreferrer"
                className="text-emerald-400 font-bold text-sm hover:underline flex items-center gap-1">
                {n.label} <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 依頼できること */}
      <section className="max-w-7xl mx-auto px-4 mb-32 space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center">依頼できること</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES_OFFER.map(s => (
            <div key={s.title} className="bg-[#0d1117] border border-white/5 p-6 rounded-2xl hover:border-emerald-500/20 transition-all group">
              <div className="w-10 h-10 bg-emerald-600/10 rounded-xl flex items-center justify-center mb-4 text-emerald-500 group-hover:scale-110 transition-transform">
                <s.icon size={20} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[3rem] p-12 md:p-20 text-center space-y-8 shadow-2xl">
          <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight">お気軽にご連絡ください</h3>
          <p className="text-emerald-100 text-base md:text-lg font-medium max-w-2xl mx-auto">
            AIツール開発・業務自動化・IoT導入・婚活カウンセリングなど、どんなことでもご相談ください。初回の壁打ちは無料です。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`mailto:${IDENTITY.email}`}
              className="h-12 px-10 bg-white text-emerald-700 font-bold rounded-2xl flex items-center gap-2 hover:bg-emerald-50 transition-all shadow-xl">
              <Mail size={16} /> メールを送る
            </a>
            <a href={IDENTITY.twitter} target="_blank" rel="noopener noreferrer"
              className="h-12 px-10 bg-black/30 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-black/50 border border-white/10 transition-all">
              Twitter / X
            </a>
            <a href={IDENTITY.nextraLabs} target="_blank" rel="noopener noreferrer"
              className="h-12 px-10 bg-black/30 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-black/50 border border-white/10 transition-all">
              NextraLabs
            </a>
          </div>
        </div>
      </section>

      <div className="text-center opacity-10 mt-20 font-bold uppercase tracking-tight text-[10px]">
        © {new Date().getFullYear()} {IDENTITY.name} | NextraLabs
      </div>
    </div>
  );
};

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function PortPage() { return <NoSSR />; }
