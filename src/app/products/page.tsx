'use client'
import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import NewsletterBanner from '@/components/newsletter/NewsletterBanner'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, ArrowRight, Network, Store, 
  ClipboardCheck, ShieldCheck, Wallet, Home, 
  Shield, Wand2, Briefcase, Clapperboard, Mail, Share2, MapPin, BookOpen, 
  Sprout, Zap, Building2, Database, Hotel, Lock, CreditCard, Sparkles, Archive, UserPlus, Table, Sofa, Play, TrendingUp, LineChart, Scale, Crown, Gift, HeartHandshake, Star, Brain, Repeat, ShieldAlert, Utensils, Plane, Activity, CalendarHeart, CalendarCheck, Scissors, Mic, CloudRain, Phone, BookMarked
} from 'lucide-react'

// 管理者メール（このアドレスでログインしているユーザーのみ管理者リンクが見える）
const ADMIN_EMAIL = 'f.yoneyone9@gmail.com'

const TOOLS = [
  // ── 📱 SNS・コンテンツ制作 ──
  { id: 'sns-auto-poster/app',      cat: 'content',   title: 'AI SNSオートポスター',         sub: 'X・Instagram・Threadsに一括投稿。AIが最適な投稿時間と文章を生成。',                                     icon: Share2,        plan: 'ライト',     done: true },
  { id: 'ai-select-shop/app',       cat: 'content',   title: 'AIセレクトショップ',            sub: 'トレンド解析とShopify連携',                                       icon: Store,         plan: 'プレミアム', done: true },
  { id: 'youtube-producer/app',     cat: 'content',   title: 'AI YouTubeプロデューサー',      sub: 'チャンネル分析からサムネイル提案まで。再生数を伸ばすAI戦略家。',                                            icon: Clapperboard,  plan: 'プレミアム', done: true },
  { id: 'youtube-coordinator/app',  cat: 'content',   title: 'YouTube AI Sync',              sub: '動画解析と楽天コーチ',                                            icon: Play,          plan: 'プレミアム', done: true },
  { id: 'prompt-master/app',        cat: 'content',   title: 'AI画像プロンプトマスター',      sub: 'Midjourney・Flux・Runwayで使えるプロ品質プロンプトをAIが生成。',                                    icon: Wand2,         plan: 'ライト',     done: true },

  // ── 📖 出版・AI文章生成 ──
  { id: 'kdp-guide/app',            cat: 'publish',   title: 'Kindle出版完全ナビ',            sub: '初めてのKDP出版を全工程AIがサポート。表紙から原稿まで完全お任せ。',                                      icon: BookOpen,      plan: '無料',       done: true },
  { id: 'kindle-factory/app',       cat: 'publish',   title: 'Kindle AI ファクトリー',        sub: 'AI解析でKDP入稿可能な原稿を自動生成',                             icon: Crown,         plan: 'プレミアム', done: true },

  // ── 💼 ビジネス・仕事効率化 ──
  { id: 'ai-teleapo/app',           cat: 'biz',       title: 'AIテレアポくん',                sub: '法人営業の架電台本と見積もりをAIが自動生成。アポ率3倍を目指す営業支援ツール。',                              icon: Phone,         plan: 'ライト',     done: true },
  { id: 'inbox-organizer/app',      cat: 'biz',       title: 'Gmail AI Accelerator',         sub: 'メール対応時間を最大70%削減。AIが下書きから返信分類まで自動化。',                                            icon: Mail,          plan: 'プレミアム', done: true },
  { id: 'ai-sidejob/app',           cat: 'biz',       title: 'AI副業スタートダッシュ',        sub: 'あなたのスキルと時間からAIが最適な副業プランを診断。今月から収入プラス。',                                      icon: Briefcase,     plan: 'プレミアム', done: true },
  { id: 'universal-converter/app',  cat: 'biz',       title: '究極AIマルチコンバーター',      sub: '動画・画像・PDFへの変換圧縮',                                    icon: Repeat,        plan: 'ライト',     done: true },


  // ── 🎓 学習・資格・自己研鑽 ──
  { id: 'exam-scheduler/app',       cat: 'edu',       title: '資格試験AIスケジューラー',      sub: '試験日から逆算して学習計画を自動生成',                            icon: ClipboardCheck, plan: 'スタンダード', done: true },
  { id: 'ai-exam-generator/app',    cat: 'edu',       title: 'AI問題生成 & 苦手分析',         sub: '予想問題を無限生成と弱点ポイント可視化',                          icon: Brain,         plan: 'プレミアム', done: true },

  // ── 💰 お金・節約・防犯 ──
  { id: 'money-guard/app',          cat: 'money',     title: 'AI家計防衛シミュレーター',      sub: '毎月の収支を入力するだけ。AIが節約ポイントと投資タイミングを提案。',                                            icon: Wallet,        plan: 'スタンダード', done: true },
  { id: 'loan-advisor/app',         cat: 'money',     title: 'AI借金完済・おまとめ診断',      sub: '借金の一本化と完済への最短ルート',                                icon: CreditCard,    plan: '無料',       done: true },
  { id: 'shopping-stopper/app',     cat: 'money',     title: 'AI買い物依存ストッパー',        sub: '散財の鎖を断ち切る',                                              icon: ShieldAlert,   plan: '無料',       done: true },
  { id: 'buy-smart-nav/app',        cat: 'money',     title: '中古・新品AI比較ナビ',          sub: '損得勘定とAI市場判定OS',                                          icon: Scale,         plan: '無料',       done: true },
  { id: 'scam-defender/app',        cat: 'money',     title: 'AI詐欺ディフェンダー',          sub: '詐欺・悪意を即座に判定',                                          icon: ShieldCheck,   plan: 'プレミアム', done: true },

  // ── 🌿 ライフスタイル・日常 ──
  { id: 'ai-recipe/app',            cat: 'lifestyle', title: 'AIレシピ献立コーチ',            sub: '冷蔵庫の残り物と栄養最適化',                                      icon: Utensils,      plan: '無料',       done: true },
  { id: 'smart-gardening/app',      cat: 'lifestyle', title: 'AIスマートガーデニング',        sub: '植物の声を聴く育成アドバイザー',                                  icon: Sprout,        plan: 'スタンダード', done: true },
  { id: 'disaster-guard/app',       cat: 'lifestyle', title: 'AI防災パーソナルガイド',        sub: '家族構成・地域に合わせたオーダーメイドの防災計画をAIが作成。',                                          icon: Shield,        plan: 'スタンダード', done: true },
  { id: 'moving-checker/app',       cat: 'lifestyle', title: 'AI引越し安心チェッカー',        sub: '治安と物件リスクを徹底解析',                                      icon: Home,          plan: '無料',       done: true },
  { id: 'gift-advisor/app',         cat: 'lifestyle', title: 'AI先回りギフトナビ',            sub: 'カレンダー連携×楽天×Geminiで最適ギフトを先回り提案',              icon: CalendarHeart, plan: 'スタンダード', done: true },

  // ── ✈️ 旅行・おでかけ・聖地巡礼 ──
  { id: 'travel-concierge/app',     cat: 'travel',    title: 'AI旅行コンシェルジュ',          sub: '楽天トラベル×Google Maps×AIで旅程を自動生成',                     icon: Plane,         plan: 'スタンダード', done: true },
  { id: 'pilgrimage-planner/app',   cat: 'travel',    title: '推し活聖地巡礼プランナー',      sub: 'YouTube URL → AI聖地特定 → 楽天トラベル自動提案',                icon: MapPin,        plan: 'スタンダード', done: true },
  { id: 'date-concierge/app',       cat: 'travel',    title: 'デートコース自動コンシェルジュ', sub: '中間地点×楽天グルメ×Googleマップで最高のデートを自動設計',         icon: HeartHandshake, plan: 'スタンダード' },
  { id: 'location-finder/app',      cat: 'travel',    title: 'AIロケーションファインダー',     sub: '出店・移住の最適地をデータ分析',                                  icon: MapPin,        plan: 'スタンダード', done: true },

  // ── 🏨 宿泊・不動産DX（法人向け） → エンタープライズページに移動 ──

  // ── 💕 婚活・結婚相談所DX ──
  { id: 'konkatsu-scheduler/app',   cat: 'konkatsu',  title: 'AI即アポ調整くん',              sub: '婚活の進捗をAIが管理。次の一手をタイムリーに提案してくれる。',                     icon: CalendarCheck, plan: 'スタンダード', lpUrl: '/products/konkatsu-scheduler' },

  { id: 'beauty-boost/app',         cat: 'konkatsu',  title: 'お見合い垢抜けブースト',        sub: '会場周辺の美容院をAI検索 → 予約へ直接案内',                      icon: Scissors,      plan: 'スタンダード', lpUrl: '/products/beauty-boost' },
]

const CATEGORIES = [
  { id: 'content',   title: '📱 SNS・コンテンツ制作',       icon: Share2,       color: 'border-emerald-500' },
  { id: 'publish',   title: '📖 出版・AI文章生成',           icon: BookOpen,     color: 'border-emerald-500' },
  { id: 'biz',       title: '💼 ビジネス・仕事効率化',       icon: Briefcase,    color: 'border-emerald-500' },
  { id: 'edu',       title: '🎓 学習・資格・自己研鑽',       icon: Brain,        color: 'border-sky-500'     },
  { id: 'money',     title: '💰 お金・節約・防犯',           icon: Wallet,       color: 'border-amber-500'   },
  { id: 'lifestyle', title: '🌿 ライフスタイル・日常',       icon: Sprout,       color: 'border-emerald-500' },
  { id: 'travel',    title: '✈️ 旅行・おでかけ・聖地巡礼',   icon: Plane,        color: 'border-sky-500'     },
  // hotel カテゴリはエンタープライズページに移動したため非表示
  { id: 'konkatsu',  title: '💕 婚活・結婚相談所DX',         icon: HeartHandshake, color: 'border-pink-500'  },
]

function ProductCard({ product, isFav, onToggleFav, isAdmin }: {
  product: (typeof TOOLS[0]) & { done?: boolean; lpUrl?: string; target?: string; adminLink?: string }
  isFav: boolean
  onToggleFav: (e: React.MouseEvent, id: string) => void
  isAdmin?: boolean
}) {
  const planLabelMap: Record<string, string> = { '無料': 'FREE', 'ライト': 'LIGHT', 'スタンダード': 'STANDARD', 'プレミアム': 'MASTER', 'お見積もり': 'ENTERPRISE', '法人・個人事業主': 'BUSINESS', '電子書籍': 'KINDLE' }
  const displayBadge = planLabelMap[product.plan] || 'BASIC'
  const planBadgeColors: Record<string, string> = {
    '無料': 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    'ライト': 'bg-emerald-500/20 text-blue-300 border-emerald-500/40',
    'スタンダード': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'プレミアム': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'お見積もり': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    '法人・個人事業主': 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    '電子書籍': 'bg-violet-500/20 text-violet-300 border-violet-500/40',
  }
  const badgeClass = "text-[9px] font-medium tracking-wide px-2 py-0.5 rounded-full border " + (planBadgeColors[product.plan] || planBadgeColors['無料'])

  return (
    <Card className="h-full bg-[#13141f] transition-all duration-300 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group shadow-xl relative border border-white/5 hover:border-white/20">
      <button
        onClick={e => onToggleFav(e, product.id)}
        className={`absolute top-4 right-4 z-20 p-1.5 rounded-xl transition-all ${
          isFav
            ? 'text-emerald-400'
            : 'text-slate-600 opacity-40 group-hover:opacity-100 hover:text-emerald-400'
        }`}
        title={isFav ? 'お気に入りを解除' : 'お気に入りに追加'}
      >
        <Star size={16} fill={isFav ? 'currentColor' : 'none'} />
      </button>

      <CardContent className="p-5 md:p-6 flex flex-col h-full text-left relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10"><product.icon className="h-5 w-5 md:h-6 md:w-6 text-emerald-400" /></div>
          <Badge className="bg-slate-950/50 text-slate-500 border border-white/10 px-2 py-0.5 font-bold text-[8px] md:text-[9px] uppercase tracking-tight mr-7">{displayBadge}</Badge>
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-base md:text-lg font-semibold text-white tracking-tight leading-snug">
            {product.title}
          </h3>
          {product.done && (
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 text-xs font-medium px-2.5 py-1 rounded-full">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              稼働中
            </span>
          )}
          <p className="text-slate-400 text-xs font-normal leading-relaxed">{product.sub}</p>
        </div>
        <div className="pt-4 border-t border-white/5 flex flex-col gap-2.5 mt-auto">
          {(product.plan === 'お見積もり' || product.plan === '法人・個人事業主') ? (
            <div className="flex flex-col gap-2 w-full">
              <Link href="/contact" className="block w-full">
                <Button className="w-full h-10 md:h-11 font-semibold text-sm rounded-lg transition-all"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' }}>
                  お問い合わせ・見積もり →
                </Button>
              </Link>
              {product.lpUrl && (
                <Link href={product.lpUrl} className="block w-full">
                  <Button variant="outline" className="w-full h-8 font-medium text-xs rounded-lg border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all">
                    詳細・LPを見る →
                  </Button>
                </Link>
              )}
            </div>
          ) : product.plan === '電子書籍' ? (
            <a
              href={product.target || 'https://www.amazon.co.jp/s?k=nextralab&i=digital-text'}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button className="w-full h-10 md:h-12 font-semibold text-sm rounded-lg transition-all"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff' }}>
                Amazonで購入 →
              </Button>
            </a>
          ) : (
            <Link href={"/products/" + product.id} className="block w-full">
              <Button className="w-full h-10 md:h-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm rounded-lg shadow-[0_0_16px_rgba(16,185,129,0.15)] hover:shadow-[0_0_24px_rgba(16,185,129,0.3)] transition-all">起動する →</Button>
            </Link>
          )}
          {product.plan === 'お見積もり' ? (
            <div className="flex flex-col gap-1.5 px-2 py-2 bg-black/40 rounded-lg border border-white/5">
              <div className="flex items-center justify-between">
                <span className={badgeClass}>¥9,800〜 / 月</span>
              </div>
              <div className="flex gap-2 pt-0.5">
                <span className="flex-1 text-center text-[9px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">法人向け</span>
                <span className="flex-1 text-center text-[9px] font-medium px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">個人事業主向け</span>
              </div>
            </div>
          ) : product.plan === '法人・個人事業主' ? (
            <div className="flex justify-between items-center px-2 py-1 bg-black/40 rounded-lg border border-white/5">
              <span className={badgeClass}>法人・個人事業主 プラン</span>
              <Lock className="h-2.5 w-2.5 text-violet-500/30" />
            </div>
          ) : (
            <div className="flex justify-between items-center px-2 py-1 bg-black/40 rounded-lg border border-white/5">
              <span className={badgeClass}>{product.plan} プラン</span>
              {product.plan !== '無料'
                ? <Lock className="h-2.5 w-2.5 text-emerald-500/30" />
                : <Sparkles className="h-2.5 w-2.5 text-emerald-400/50" />}
            </div>
          )}
        </div>
        {/* 管理者専用リンク（Ninja3のみ表示） */}
        {isAdmin && (
          <div className="mt-2 pt-2 border-t border-emerald-500/10 flex items-center gap-2">
            <a
              href={`/products/${product.id.replace('/app', '')}`}
              className="flex-1 text-center text-[9px] font-medium px-2 py-1 rounded-md bg-emerald-500/5 text-emerald-600 border border-emerald-500/10 hover:bg-emerald-500/15 hover:text-emerald-400 transition-all"
              onClick={e => e.stopPropagation()}
            >
              ⚙ LP編集
            </a>
            <a
              href={`/products/${product.id}`}
              className="flex-1 text-center text-[9px] font-medium px-2 py-1 rounded-md bg-sky-500/5 text-sky-600 border border-sky-500/10 hover:bg-sky-500/15 hover:text-sky-400 transition-all"
              onClick={e => e.stopPropagation()}
            >
              🔗 直リンク
            </a>
            {product.adminLink && (
              <a
                href={product.adminLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-[9px] font-medium px-2 py-1 rounded-md bg-amber-500/5 text-amber-600 border border-amber-500/10 hover:bg-amber-500/15 hover:text-amber-400 transition-all"
                onClick={e => e.stopPropagation()}
              >
                🛠 管理
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ProductsList() {
  const [mounted, setMounted] = useState(false)
  const [randomFree, setRandomFree] = useState<typeof TOOLS>([])
  const [pickupTools, setPickupTools] = useState<typeof TOOLS>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showFavOnly, setShowFavOnly] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 一般ユーザー向けツール（adminOnlyを除外）
  const PUBLIC_TOOLS = TOOLS.filter(t => !t.adminOnly)

  useEffect(() => {
    setMounted(true)
    setRandomFree(PUBLIC_TOOLS.filter(t => t.plan === '無料').sort(() => 0.5 - Math.random()).slice(0, 3))
    setPickupTools([...PUBLIC_TOOLS].sort(() => 0.5 - Math.random()).slice(0, 3))

    const loadFavs = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      // 管理者判定（メールアドレスで照合）
      if (user.email === ADMIN_EMAIL) setIsAdmin(true)
      const { data } = await supabase.from('user_favorites').select('tool_id').eq('user_id', user.id)
      if (data) setFavorites(data.map((r: any) => r.tool_id))
    }
    loadFavs()
  }, [])

  const handleToggleFav = async (e: React.MouseEvent, toolId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!userId) return
    const isAlreadyFav = favorites.includes(toolId)
    if (isAlreadyFav) {
      setFavorites(prev => prev.filter(id => id !== toolId))
      await supabase.from('user_favorites').delete().eq('user_id', userId).eq('tool_id', toolId)
    } else {
      setFavorites(prev => [...prev, toolId])
      await supabase.from('user_favorites').insert({ user_id: userId, tool_id: toolId })
    }
  }

  if (!mounted) return null

  const favTools = PUBLIC_TOOLS.filter(t => favorites.includes(t.id))

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 pb-10 font-sans">
      <div className="max-w-6xl mx-auto px-4 pt-10 md:pt-20 text-center mb-6 md:mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 border border-emerald-500/30 rounded-full px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium text-emerald-400 tracking-tight uppercase">Master Catalogue</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-[1.1]">AI ツールストア</h1>
        <div className="flex items-center justify-center gap-3 mt-2">
          <a
            href="https://www.amazon.co.jp/s?k=nextralab&i=digital-text"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)', color: '#a78bfa' }}
          >
            📚 Kindle電子書籍はこちら →
          </a>
        </div>
      </div>

      {/* お気に入りフィルターバー */}
      {userId && (
        <div className="max-w-6xl mx-auto px-4 mb-8 md:mb-12 flex items-center gap-3">
          <button
            onClick={() => setShowFavOnly(prev => !prev)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              showFavOnly
                ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-400'
            }`}
          >
            <Star size={14} fill={showFavOnly ? 'currentColor' : 'none'} />
            お気に入りのみ表示
            {favorites.length > 0 && (
              <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${showFavOnly ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/10 text-slate-400'}`}>
                {favorites.length}
              </span>
            )}
          </button>
          {showFavOnly && (
            <span className="text-xs text-slate-500">クリックで全ツールに戻る</span>
          )}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 space-y-8 md:space-y-16">

        {/* お気に入りのみ表示モード */}
        {showFavOnly ? (
          favTools.length > 0 ? (
            <section>
              <div className="flex items-center gap-3 mb-4 border-l-4 border-emerald-500 pl-4 md:pl-6 py-0.5">
                <Star className="w-5 h-5 text-emerald-400" fill="currentColor" />
                <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">お気に入り（{favTools.length}件）</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {favTools.map(p => <ProductCard key={p.id} product={p} isFav={true} onToggleFav={handleToggleFav} isAdmin={isAdmin} />)}
              </div>
            </section>
          ) : (
            <div className="text-center py-20 space-y-3">
              <Star className="w-10 h-10 text-slate-700 mx-auto" />
              <p className="text-slate-500 text-sm">お気に入りがまだありません</p>
              <p className="text-slate-600 text-xs">各ツールカードの ★ をクリックして追加できます</p>
            </div>
          )
        ) : (
          <>
            {/* お気に入りセクション（お気に入りがある場合だけ表示） */}
            {favTools.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4 border-l-4 border-emerald-500 pl-4 md:pl-6 py-0.5">
                  <Star className="w-5 h-5 text-emerald-400" fill="currentColor" />
                  <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">お気に入り</h2>
                  <button
                    onClick={() => setShowFavOnly(true)}
                    className="ml-auto text-[10px] text-emerald-500 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/60 px-3 py-1 rounded-full transition-all"
                  >
                    すべて見る →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {favTools.slice(0, 3).map(p => <ProductCard key={p.id} product={p} isFav={true} onToggleFav={handleToggleFav} isAdmin={isAdmin} />)}
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center gap-3 mb-4 border-l-4 border-emerald-500 pl-4 md:pl-6 py-0.5">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">ピックアップ</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">{pickupTools.map(p => <ProductCard key={p.id} product={p} isFav={favorites.includes(p.id)} onToggleFav={handleToggleFav} isAdmin={isAdmin} />)}</div>
            </section>
            <section>
              <div className="flex items-center gap-3 mb-4 border-l-4 border-emerald-500 pl-4 md:pl-6 py-0.5">
                <Gift className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">無料トライアル</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">{randomFree.map(p => <ProductCard key={p.id} product={p} isFav={favorites.includes(p.id)} onToggleFav={handleToggleFav} isAdmin={isAdmin} />)}</div>
            </section>
            {CATEGORIES.map((cat) => (
              <section key={cat.id} id={cat.id} style={{ scrollMarginTop: '5rem' }}>
                <div className={"flex items-center gap-3 mb-4 border-l-4 " + cat.color + " pl-4 md:pl-6 py-0.5"}>
                  <cat.icon className="w-5 h-5 text-slate-400" />
                  <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">{cat.title}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">{PUBLIC_TOOLS.filter(t => t.cat === cat.id).map(p => <ProductCard key={p.id} product={p} isFav={favorites.includes(p.id)} onToggleFav={handleToggleFav} isAdmin={isAdmin} />)}</div>
              </section>
            ))}
          </>
        )}
      </div>
      {/* メルマガ登録バナー */}
      <div className="max-w-6xl mx-auto px-4 mt-16">
        <NewsletterBanner variant="compact" />
      </div>

      {/* Amazon アフィリエイト */}
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="border-t border-white/5 pt-12">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Sponsored · Amazon</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: '🤖 AI・プログラミング本',
                desc: 'ChatGPT・Python・機械学習の最新書籍を探す',
                url: 'https://www.amazon.co.jp/s?k=AI+プログラミング+ChatGPT&tag=534e3725-22',
                btn: 'Amazonで探す →',
              },
              {
                label: '📚 副業・ビジネス書',
                desc: 'フリーランス・副業・起業に役立つベストセラー',
                url: 'https://www.amazon.co.jp/s?k=副業+ビジネス+フリーランス&tag=534e3725-22',
                btn: 'Amazonで探す →',
              },
              {
                label: '🌿 ガーデニング用品',
                desc: 'スマートプランターから土・肥料まで揃う',
                url: 'https://www.amazon.co.jp/s?k=ガーデニング+プランター+肥料&tag=534e3725-22',
                btn: 'Amazonで探す →',
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#13141f] border border-white/5 hover:border-emerald-500/30 rounded-xl p-5 transition-all group"
              >
                <p className="text-sm font-semibold text-white mb-1.5 group-hover:text-emerald-300 transition-colors">{item.label}</p>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.desc}</p>
                <span className="text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">{item.btn}</span>
              </a>
            ))}
          </div>

        </div>
      </div>

      <div className="text-center opacity-20 mt-10 font-medium tracking-tight text-[10px] text-slate-500">Nextra Labs · 2026</div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-emerald-500 font-bold p-10">Loading...</div>}>
      <ProductsList />
    </Suspense>
  )
}



