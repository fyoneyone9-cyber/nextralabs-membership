'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Copy,
  Check,
  Hash,
  MessageCircle,
  Camera,
  Globe,
  Briefcase,
  RefreshCw,
  Sparkles,
  Share2,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────
type Tone = 'casual' | 'business' | 'fun'
type Platform = 'twitter' | 'instagram' | 'facebook' | 'linkedin'

interface GeneratedPost {
  platform: Platform
  text: string
  hashtags: string[]
  charLimit: number
}

// ─── Platform Config ─────────────────────────────────────
const platformConfig: Record<Platform, { name: string; icon: React.ElementType; charLimit: number; color: string; bgColor: string; gradient: string }> = {
  twitter: { name: 'Twitter / X', icon: MessageCircle, charLimit: 280, color: 'text-sky-500', bgColor: 'bg-sky-500/10', gradient: 'from-sky-500 to-blue-500' },
  instagram: { name: 'Instagram', icon: Camera, charLimit: 2200, color: 'text-pink-500', bgColor: 'bg-pink-500/10', gradient: 'from-pink-500 to-purple-500' },
  facebook: { name: 'Facebook', icon: Globe, charLimit: 63206, color: 'text-blue-600', bgColor: 'bg-blue-600/10', gradient: 'from-blue-600 to-blue-500' },
  linkedin: { name: 'LinkedIn', icon: Briefcase, charLimit: 3000, color: 'text-blue-700', bgColor: 'bg-blue-700/10', gradient: 'from-blue-700 to-cyan-600' },
}

// ─── Template Patterns ───────────────────────────────────
const toneTemplates: Record<Tone, { label: string; emoji: string; patterns: Record<Platform, (topic: string, detail: string) => string> }> = {
  casual: {
    label: 'カジュアル',
    emoji: '😊',
    patterns: {
      twitter: (topic, detail) =>
        `${topic}について調べてみたんだけど、めっちゃ面白い！🔥\n\n${detail ? detail : 'みんなも知ってた？'}\n\nぜひチェックしてみて👀`,
      instagram: (topic, detail) =>
        `✨ ${topic} ✨\n\n最近ハマってるのがコレ！\n${detail ? `\n${detail}\n` : ''}\n正直、もっと早く知りたかった…😭\n\nみんなはどう思う？\nコメントで教えてね💬\n\n---`,
      facebook: (topic, detail) =>
        `【${topic}】が気になってます！\n\n${detail ? detail + '\n\n' : ''}みなさんの意見も聞かせてください😊\n最近これ関連で面白い情報があれば、ぜひシェアしてください！`,
      linkedin: (topic, detail) =>
        `${topic}について興味深い発見がありました。\n\n${detail ? detail + '\n\n' : ''}この分野は今後さらに注目されると感じています。\n\n皆さまのご意見もお聞かせください。`,
    },
  },
  business: {
    label: 'ビジネス',
    emoji: '💼',
    patterns: {
      twitter: (topic, detail) =>
        `【${topic}】\n\n${detail ? detail : 'ビジネスにおける重要なトレンドです。'}\n\n詳しくはスレッドで解説します👇`,
      instagram: (topic, detail) =>
        `📊 ${topic}\n\n${detail ? detail + '\n\n' : ''}ビジネスパーソンなら知っておきたいポイント：\n\n✅ 市場の変化を把握\n✅ 競合との差別化\n✅ 具体的なアクションプラン\n\n保存して後で見返してね📌\n\n---`,
      facebook: (topic, detail) =>
        `【ビジネスインサイト】${topic}\n\n${detail ? detail + '\n\n' : ''}ポイントをまとめました：\n\n1️⃣ 現状の課題\n2️⃣ 取り組むべき施策\n3️⃣ 期待される成果\n\n詳しくは記事をご覧ください。\nご質問やご意見があればコメントでお気軽にどうぞ。`,
      linkedin: (topic, detail) =>
        `${topic}について、最新の知見を共有させていただきます。\n\n${detail ? detail + '\n\n' : ''}【Key Takeaways】\n・業界トレンドの変化\n・実務への影響\n・推奨されるアクション\n\n本件について、皆さまの見解やご経験をお聞かせいただければ幸いです。\n\n#ビジネス #業界動向`,
    },
  },
  fun: {
    label: '楽しい',
    emoji: '🎉',
    patterns: {
      twitter: (topic, detail) =>
        `🚀 ${topic}がヤバすぎる件について 🚀\n\n${detail ? detail : 'マジで衝撃的なんだが…'}\n\nこれ知らない人、人生損してるかも！？😱`,
      instagram: (topic, detail) =>
        `🔥🔥🔥\n\n${topic}が最高すぎる！！！\n\n${detail ? detail + '\n\n' : ''}テンション上がりすぎて投稿しちゃった😆\n\nこの感動、伝われ〜〜〜！\n\n友達にもシェアしてね✌️\n\n---`,
      facebook: (topic, detail) =>
        `🎉 みんな聞いて！！ 🎉\n\n${topic}が凄すぎるんだけど！！\n\n${detail ? detail + '\n\n' : ''}もうテンション爆上がり⬆️⬆️⬆️\n\n知ってた人は「いいね」、知らなかった人は「超いいね」で教えて😆`,
      linkedin: (topic, detail) =>
        `ワクワクするニュースです！✨\n\n${topic}について、とても興奮しています。\n\n${detail ? detail + '\n\n' : ''}こういう革新的な動きが業界を変えていくと確信しています。\n\nぜひ皆さまの感想をお聞かせください！🙌`,
    },
  },
}

// ─── Hashtag Generator ───────────────────────────────────
function generateHashtags(topic: string, platform: Platform): string[] {
  const baseKeywords = topic.split(/[\s、。,.・／/]+/).filter(k => k.length > 0)
  const commonTags: Record<Platform, string[]> = {
    twitter: ['おすすめ', '拡散希望', 'トレンド', '話題'],
    instagram: ['instagood', 'instajapan', '日本', 'おすすめ', 'いいね返し'],
    facebook: ['シェア', '情報共有', 'おすすめ'],
    linkedin: ['キャリア', 'ビジネス', 'イノベーション', 'DX'],
  }

  const tags = [
    ...baseKeywords.slice(0, 3).map(k => k.replace(/^#/, '')),
    ...commonTags[platform].slice(0, platform === 'instagram' ? 5 : 3),
  ]
  return Array.from(new Set(tags)).slice(0, platform === 'instagram' ? 8 : 5)
}

// ─── Component ───────────────────────────────────────────
export default function SnsAutoPoster() {
  const [topic, setTopic] = useState('')
  const [detail, setDetail] = useState('')
  const [tone, setTone] = useState<Tone>('casual')
  const [posts, setPosts] = useState<GeneratedPost[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generate = useCallback(() => {
    if (!topic.trim()) return
    setIsGenerating(true)

    // Simulate brief processing time for UX
    setTimeout(() => {
      const platforms: Platform[] = ['twitter', 'instagram', 'facebook', 'linkedin']
      const template = toneTemplates[tone]
      const results: GeneratedPost[] = platforms.map(platform => {
        const text = template.patterns[platform](topic.trim(), detail.trim())
        const hashtags = generateHashtags(topic, platform)
        return {
          platform,
          text,
          hashtags,
          charLimit: platformConfig[platform].charLimit,
        }
      })
      setPosts(results)
      setIsGenerating(false)
    }, 600)
  }, [topic, detail, tone])

  const copyToClipboard = useCallback(async (post: GeneratedPost) => {
    const fullText = post.text + '\n\n' + post.hashtags.map(t => `#${t}`).join(' ')
    await navigator.clipboard.writeText(fullText)
    setCopiedId(post.platform)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const getCharCount = (post: GeneratedPost) => {
    const fullText = post.text + '\n\n' + post.hashtags.map(t => `#${t}`).join(' ')
    return fullText.length
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-500/5 to-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products/sns-auto-poster"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            ツール紹介ページに戻る
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Share2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">SNSオートポスター</h1>
              <p className="text-sm text-muted-foreground">トピックを入力 → 4プラットフォーム分の投稿を自動生成</p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <Card className="mb-8 border-2 border-blue-500/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Topic */}
              <div>
                <label className="text-sm font-medium mb-2 block">📝 トピック / テーマ</label>
                <Input
                  placeholder="例: AIを使った業務効率化、新商品のローンチ、週末のカフェ巡り..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="text-base"
                />
              </div>

              {/* Detail */}
              <div>
                <label className="text-sm font-medium mb-2 block">💬 補足情報（任意）</label>
                <Textarea
                  placeholder="伝えたいポイントや具体的な内容があれば入力してください..."
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Tone Selector */}
              <div>
                <label className="text-sm font-medium mb-2 block">🎨 トーン選択</label>
                <div className="flex gap-2 flex-wrap">
                  {(Object.entries(toneTemplates) as [Tone, typeof toneTemplates[Tone]][]).map(([key, t]) => (
                    <Button
                      key={key}
                      variant={tone === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTone(key)}
                      className={tone === key ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0' : ''}
                    >
                      {t.emoji} {t.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generate}
                disabled={!topic.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-lg py-6"
              >
                {isGenerating ? (
                  <><RefreshCw className="h-5 w-5 mr-2 animate-spin" />生成中...</>
                ) : (
                  <><Sparkles className="h-5 w-5 mr-2" />投稿を生成する</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Posts */}
        {posts.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              生成された投稿
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {posts.map((post) => {
                const config = platformConfig[post.platform]
                const Icon = config.icon
                const charCount = getCharCount(post)
                const isOverLimit = charCount > post.charLimit
                return (
                  <Card
                    key={post.platform}
                    className="overflow-hidden hover:shadow-lg transition-shadow border-2"
                  >
                    {/* Platform Header */}
                    <div className={`bg-gradient-to-r ${config.gradient} p-4`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                          <Icon className="h-5 w-5" />
                          <span className="font-bold">{config.name}</span>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${isOverLimit ? 'bg-red-500/90 text-white' : 'bg-white/20 text-white'}`}
                        >
                          {charCount} / {post.charLimit.toLocaleString()}文字
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      {/* Post Text */}
                      <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed min-h-[120px]">
                        {post.text}
                      </div>

                      {/* Hashtags */}
                      <div>
                        <div className="flex items-center gap-1 mb-2">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">ハッシュタグ</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {post.hashtags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Copy Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => copyToClipboard(post)}
                      >
                        {copiedId === post.platform ? (
                          <><Check className="h-4 w-4 mr-2 text-green-500" />コピーしました！</>
                        ) : (
                          <><Copy className="h-4 w-4 mr-2" />テキスト＋ハッシュタグをコピー</>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Regenerate */}
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={generate}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                別パターンで再生成
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 mb-4">
              <Share2 className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">トピックを入力して投稿を生成しよう</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              テーマやトピックを入力すると、Twitter・Instagram・Facebook・LinkedIn向けの投稿文が自動で生成されます。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
