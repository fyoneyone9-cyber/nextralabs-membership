'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, Code, Sparkles, LineChart, Zap, Mail, Twitter, Video, 
  MessageSquare, HeartHandshake, Phone, Mic, FileText, Globe, 
  Database, Layout, Presentation, Headphones, Monitor, 
  Github, Instagram, Send, CheckCircle2, ArrowRight, Lightbulb, 
  RotateCcw, Shield, Briefcase
} from 'lucide-react'

const IDENTITY = {
  name: "米山 文貴",
  motto: "「指示したら、あとは全部やってくれる人」として働きます。",
  description: "リサーチ・開発・コンテンツ制作・自動化まで、アイデアを実行まで完結させます。実際に手を動かして完成まで持っていく実行力が強みです。AIツールを最大限に使いこなし、一人で数人分の仕事を高速でこなすことができます。",
  base: "日本・東京",
  email: "f.yoneyone9@gmail.com",
  twitter: "https://x.com/0022_sougo"
};

const STATS = [
  { label: "対応可能な業務種", value: "15+" },
  { label: "最速納品実績", value: "24h" },
  { label: "自動化できる業務", value: "∞" }
];

const SKILLS = [
  { icon: Search, title: "情報収集・深層リサーチ", desc: "Webを横断的に検索・解析し、競合分析・市場調査・ファクトチェックを行います。複数情報源を照合した信頼性の高いレポートを作成します。", tags: ["Web検索", "競合分析", "深層調査", "ファクトチェック"] },
  { icon: Code, title: "Web開発・本番デプロイ", desc: "WebサイトやAPIを設計・構築し、独自ドメインへの本番デプロイまで一貫対応。このポートフォリオサイト自体がその実例です。", tags: ["HTML/CSS/JS", "Python", "Node.js", "Caddy/Nginx", "HTTPS対応"] },
  { icon: Sparkles, title: "AIコンテンツ制作", desc: "プロンプト一つで、スライド・画像・動画・音声・ポッドキャストを高品質に制作。ブランドに合ったビジュアルを短時間で量産できます。", tags: ["スライド", "AI画像", "AI動画", "TTS音声", "ポッドキャスト"] },
  { icon: Zap, title: "業務自動化・定期実行", desc: "毎日・毎週・毎月のレポート生成・通知・データ収集を全自動化。一度仕組みを作れば、あとは完全ノータッチで回り続けます。", tags: ["定期実行", "Slack/メール通知", "Webhook", "ワークフロー設計"] },
  { icon: LineChart, title: "データ集計・ダッシュボード", desc: "散在するデータを収集・集計・可視化し、KPIダッシュボードや月次レポートを自動生成。意思決定をデータドリブンに変えます。", tags: ["KPI設計", "グラフ作成", "Sheets", "リアルタイム更新"] },
  { icon: Mail, title: "メール・カレンダー管理", desc: "Gmail / Outlook の大量メールを自動分類・優先度付け・返信下書きまで対応。受信トレイをゼロに保つ仕組みを構築します。", tags: ["Gmail", "Outlook", "自動分類", "スケジュール管理"] },
  { icon: Twitter, title: "SNS運用・トレンド監視", desc: "Twitter/X・Reddit・Instagram のトレンドをリアルタイム監視し、バズ予兆の検知・投稿案の生成・エンゲージメント分析を行います。", tags: ["Twitter/X", "Reddit", "Instagram", "トレンド分析"] },
  { icon: Mic, title: "音声文字起こし・議事録", desc: "会議・インタビューの音声をAIで文字起こしし、要点整理・アクションアイテム抽出まで完了した議事録として納品します。", tags: ["文字起こし", "議事録整形", "要点抽出", "多言語対応"] },
  { icon: Phone, title: "AI電話代行", desc: "レストラン予約・アポ取り・問い合わせ・クレーム交渉など、AIが代わりに電話をかけて結果を報告します。", tags: ["予約代行", "アポ取り", "問い合わせ", "通話レポート"] },
  { icon: LineChart, title: "株価・市場情報の取得", desc: "指定銘銘柄のリアルタイム株価・財務データ・市場動向を自動収集・分析。定期配信レポートにも組み込めます。", tags: ["リアルタイム株価", "財務分析", "AI銘柄分析"] },
  { icon: Globe, title: "クラウドファイル管理", desc: "Google Drive・OneDrive のファイルを整理・変換・共有リンク発行まで一括対応。フォルダ構造の設計から運用まで担います。", tags: ["Google Drive", "OneDrive", "SharePoint", "Notion"] },
  { icon: HeartHandshake, title: "プロジェクト全体管理", desc: "要件定義から納品まで、複数タスクを並行管理しながら全体をドライブします。「何から始めれば？」という状態から一緒に整理します。", tags: ["要件定義", "タスク管理", "進捗管理", "納品管理"] }
];

const PROJECTS = [
  { category: "システム基盤", title: "Surveillance OS — 全能型監視パネル", desc: "F12不要。ブラウザの全ログジャック、操作追跡、API死活監視を一画面に統合。sessionStorageによる永続ログ保持を実現。", link: "#", label: "監視パネル v15.2 実装済み" },
  { category: "データ戦略", title: "Triple-Hybrid Speed Engine", desc: "GNews API、1時間以内速報RSS、トレンドRSSを三段構えで統合。情報のタイムラグをゼロにする高速解析エンジン。", link: "/products/trend-stock", label: "デモを見る ↗" },
  { category: "会員制サービス", title: "NextraLabs — 会員制事業サイト", desc: "会員登録・ログイン・会員限定コンテンツ配信を備えた本格的な会員制WEBシステム。実際に稼働中の事業サイトです。", link: "https://nextralab.jp/", label: "サイトを見る ↗" },
  { category: "リサーチ", title: "毎朝のニュース要約・配信", desc: "指定テーマのニュースを毎朝収集・まとめて、メールやSlackで定期配信する仕組みを作ります。", link: "/products/trends", label: "📰 サンプルを見る ↗" },
  { category: "分析", title: "競合調査・市場分析レポート", desc: "競合他社のWebサイト・SNS・ニュースを調査・分析し、わかりやすいレポートにまとめます。", link: "/products/trend-stock", label: "🔍 デモを見る ↗" },
  { category: "Web開発", title: "Webサイト構築・公開", desc: "要件を伝えるだけでサイトを設計・構築し、本番環境に公開します（このサイト自体がその実例）。", link: "/", label: "🌐 このサイトがデモ ↗" },
  { category: "制作", title: "プレゼン資料・ドキュメント作成", desc: "テーマと要点を共有するだけで、デザイン済みのスライドやドキュメントを仕上げます。", link: "/products/kindle-factory", label: "🎨 ショーケースを見る ↗" },
  { category: "自動化", title: "メール整理・業務効率化", desc: "受信トレイの整理・分類・返信対応を効率化し、重要なものだけに集中できる環境を作ります。", link: "/products/inbox-organizer", label: "📧 デモを見る ↗" },
  { category: "データ", title: "データ集計・ダッシュボード作成", desc: "散在するデータを集計・可視化し、意思決定に使えるダッシュボードやレポートを作ります。", link: "/dashboard", label: "📊 デモを見る ↗" },
  { category: "AI生成", title: "画像・動画・音声コンテンツ制作", desc: "AIを活用してプロ品質の画像・動画・BGM・ナレーション音声を生成します。", link: "/products/prompt-master", label: "🎨 ギャラリーを見る ↗" },
  { category: "SNS", title: "SNS情報収集・トレンド監視", desc: "Twitter/X・Reddit・Instagramから特定テーマの投稿・トレンドをリアルタイムで収集・報告します。", link: "/products/sns-auto-poster", label: "📡 ダッシュボードを見る ↗" },
  { category: "SaaS発掘", title: "SNSからSaaSアイデアを自動発掘", desc: "X・Instagram・TikTokから「あったらいいな」声を自動収集→AIで開発価値の高いアイデアを怀良・スコアリングして毎朝レポート。", link: "/products/ai-sidejob", label: "💡 レポートを見る ↗" },
  { category: "音声", title: "音声文字起こし・議事録作成", desc: "会議・インタビューの音声ファイルを文字起こしし、整形された議事録として仕上げます。", link: "/products/meeting-notes", label: "🎤 デモを見る ↗" },
  { category: "電話代行", title: "AI電話代行", desc: "レストラン予約・問い合わせなど、指示した内容でAIが代わりに電話をかけます。", link: "/products/phone-call", label: "📞 デモを試す ↗" },
  { category: "株価・金融", title: "株価・市場情報のリアルタイム取得", desc: "指定した銘柄の株価・財務データを即座に取得し、投資判断の参考情報をまとめます。", link: "/products/trend-stock", label: "📈 ダッシュボードを見る ↗" },
  { category: "ファイル管理", title: "クラウドファイルの整理・共有", desc: "Google Drive・OneDriveのファイルを整理・変換・共有リンク発行まで一括対応。", link: "/products/expense-sync", label: "☁️ デモを見る ↗" },
  { category: "動画・ VTuber", title: "ずんだもん・ゆっくり系動画制作", desc: "テーマとシナリオを渡すだけで、キャラクターボイス・字幕・ BGMを一気に完成させます。", link: "/products/youtube-producer", label: "🎬 デモを見る ↗" }
];

const MasterEngine = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 font-sans pb-32 overflow-x-hidden text-left selection:bg-emerald-500/30">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#10b98115,transparent_50%)]" />
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <Badge className="bg-emerald-600 text-white font-bold px-6 py-1.5 rounded-full uppercase text-xs tracking-tight shadow-lg">Master Portfolio v5.1</Badge>
          <div className="space-y-4">
             <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight">{IDENTITY.name}</h1>
             <p className="text-2xl md:text-4xl font-bold text-emerald-400 ">{IDENTITY.motto}</p>
          </div>
          <p className="text-lg md:text-xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
            リサーチ・開発・コンテンツ制作・自動化まで、アイデアを実行まで完結させます。
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="#skills" className="h-14 px-8 bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-emerald-500 transition-all shadow-xl">スキルを見る <ArrowRight size={20}/></Link>
            <Link href="/contact" className="h-14 px-8 bg-white/5 border border-white/10 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all">連絡する</Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
        {STATS.map(s => (
          <div key={s.label} className="bg-[#13141f] border border-white/5 p-10 rounded-[2.5rem] text-center shadow-2xl">
            <p className="text-6xl font-bold text-white mb-2">{s.value}</p>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">{s.label}</p>
          </div>
        ))}
      </section>

      {/* 特徴セクション */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 mb-40">
        {[
          { icon: Zap, title: "圧倒的なスピード", desc: "AIを使いこなして、通常3日かかる作業を数時間で完成させます。" },
          { icon: Search, title: "要件定義から完成まで", desc: "「なんとなくこんなもの」から形にするのが得意。曖昧な依頼でも動きます。" },
          { icon: Sparkles, title: "AI最前線の活用", desc: "画像・動画・音声・リサーチ・コードすべてAIで最大化。人力の10倍速で動きます。" },
          { icon: RotateCcw, title: "一度作れば自動で回る", desc: "定期レポート・通知・データ収集など、仕組みを作って工数ゼロに変えます。" }
        ].map((item, i) => (
          <div key={i} className="bg-[#13141f] p-8 rounded-[2.5rem] border border-white/5 flex gap-6 items-start">
            <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-500 shrink-0"><item.icon size={24} /></div>
            <div className="space-y-2 text-left">
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* About Me */}
      <section className="max-w-4xl mx-auto px-4 mb-40 space-y-8 text-left">
        <h2 className="text-3xl font-bold border-l-4 border-emerald-500 pl-6">自己紹介</h2>
        <div className="bg-[#13141f] p-10 rounded-[3rem] border border-white/5 space-y-6 text-slate-300 leading-relaxed text-lg">
          <p>{IDENTITY.description}</p>
          <p>「これって自動化できない？」「こんなの作れる？」という相談から始まるプロジェクトが得意です。要件が曖昧な段階から一緒に整理し、動くものを作って納品します。</p>
          <p className="text-emerald-400 font-bold">👉 まずは気軽に相談ください。初回の壁打ちは無料です。</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-sm">
            <div><p className="text-slate-500 font-bold mb-1 text-left">拠点</p><p className="text-left">日本・東京</p></div>
            <div><p className="text-slate-500 font-bold mb-1 text-left">稼働形態</p><p className="text-left">フリーランス</p></div>
            <div><p className="text-slate-500 font-bold mb-1 text-left">対応時間</p><p className="text-left">柔軟対応</p></div>
            <div><p className="text-slate-500 font-bold mb-1 text-left">対応領域</p><p className="text-left">AI・開発</p></div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="max-w-7xl mx-auto px-4 space-y-16 mb-48 text-left">
        <h2 className="text-4xl font-bold text-white text-center">できること</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS.map(s => (
            <Card key={s.title} className="bg-[#13141f] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl hover:border-emerald-500/30 transition-all flex flex-col h-full group">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform"><s.icon size={28} /></div>
              <h3 className="text-xl font-bold text-white mb-4 leading-tight text-left">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 text-left">{s.desc}</p>
              <div className="flex flex-wrap gap-1.5 justify-start">
                {s.tags.map(t => <Badge key={t} variant="secondary" className="bg-black/50 text-[10px] text-slate-400 border-0">{t}</Badge>)}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="max-w-7xl mx-auto px-4 space-y-16 mb-48 text-left">
        <h2 className="text-4xl font-bold text-white text-center">こんな仕事ができます</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
           {PROJECTS.map(p => (
             <div key={p.title} className="bg-[#13141f] p-10 rounded-[3rem] border border-white/5 shadow-2xl hover:bg-white/5 transition-all group flex flex-col h-full text-left">
                <Badge className="bg-emerald-600/10 text-emerald-500 border-0 mb-6 w-fit">{p.category}</Badge>
                <h3 className="text-2xl font-bold text-white mb-4 leading-tight text-left">{p.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1 text-left">{p.desc}</p>
                {p.link.startsWith('http') ? (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-emerald-500 font-bold text-sm hover:underline text-left">{p.label}</a>
                ) : (
                  <Link href={p.link} className="text-emerald-500 font-bold text-sm hover:underline text-left">{p.label}</Link>
                )}
             </div>
           ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[4rem] p-12 md:p-20 text-center space-y-8 shadow-2xl">
          <h3 className="text-4xl md:text-6xl font-bold text-white ">お気軽にご連絡ください</h3>
          <p className="text-emerald-100 text-lg md:text-xl font-bold max-w-2xl mx-auto text-center">お仕事のご依頼・ご相談など、どんなことでもお声がけください。初回の壁打ちは無料です。</p>
          <div className="flex flex-wrap justify-center gap-4 pt-6">
             <a href={`mailto:${IDENTITY.email}`} className="h-12 px-10 bg-white text-emerald-700 font-bold rounded-2xl flex items-center gap-3 hover:bg-emerald-50 transition-all shadow-xl">メールを送る</a>
             <a href={IDENTITY.twitter} target="_blank" className="h-12 px-10 bg-black/30 text-white font-bold rounded-2xl flex items-center gap-3 hover:bg-black/50 border border-white/10 transition-all shadow-xl ">Twitter / X</a>
          </div>
        </div>
      </section>

      <div className="text-center opacity-10 mt-24 font-bold uppercase tracking-tight text-[10px]">
        © {new Date().getFullYear()} {IDENTITY.name} | NextraLabs
      </div>
    </div>
  );
};

const NoSSR = dynamic(() => Promise.resolve(MasterEngine), { ssr: false });
export default function PortPage() { return <NoSSR />; }
