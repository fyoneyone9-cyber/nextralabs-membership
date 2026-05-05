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

// 笏笏笏 Types 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
type Tone = 'casual' | 'business' | 'fun'
type Platform = 'twitter' | 'instagram' | 'facebook' | 'linkedin'

interface GeneratedPost {
  platform: Platform
  text: string
  hashtags: string[]
  charLimit: number
}

// 笏笏笏 Platform Config 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
const platformConfig: Record<Platform, { name: string; icon: React.ElementType; charLimit: number; color: string; bgColor: string; gradient: string }> = {
  twitter: { name: 'Twitter / X', icon: MessageCircle, charLimit: 280, color: 'text-sky-500', bgColor: 'bg-sky-500/10', gradient: 'from-sky-500 to-blue-500' },
  instagram: { name: 'Instagram', icon: Camera, charLimit: 2200, color: 'text-pink-500', bgColor: 'bg-pink-500/10', gradient: 'from-pink-500 to-purple-500' },
  facebook: { name: 'Facebook', icon: Globe, charLimit: 63206, color: 'text-blue-600', bgColor: 'bg-blue-600/10', gradient: 'from-blue-600 to-blue-500' },
  linkedin: { name: 'LinkedIn', icon: Briefcase, charLimit: 3000, color: 'text-blue-700', bgColor: 'bg-blue-700/10', gradient: 'from-blue-700 to-cyan-600' },
}

// 笏笏笏 Template Patterns 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
const toneTemplates: Record<Tone, { label: string; emoji: string; patterns: Record<Platform, (topic: string, detail: string) => string> }> = {
  casual: {
    label: '繧ｫ繧ｸ繝･繧｢繝ｫ',
    emoji: '・',
    patterns: {
      twitter: (topic, detail) =>
        `${topic}縺ｫ縺､縺・※隱ｿ縺ｹ縺ｦ縺ｿ縺溘ｓ縺縺代←縲√ａ縺｣縺｡繧・擇逋ｽ縺・ｼÅ沐･\n\n${detail ? detail : '縺ｿ繧薙↑繧ら衍縺｣縺ｦ縺滂ｼ・}\n\n縺懊・繝√ぉ繝・け縺励※縺ｿ縺ｦ操`,
      instagram: (topic, detail) =>
        `笨ｨ ${topic} 笨ｨ\n\n譛霑代ワ繝槭▲縺ｦ繧九・縺後さ繝ｬ・―n${detail ? `\n${detail}\n` : ''}\n豁｣逶ｴ縲√ｂ縺｣縺ｨ譌ｩ縺冗衍繧翫◆縺九▲縺溪ｦ亊\n\n縺ｿ繧薙↑縺ｯ縺ｩ縺・昴≧・歃n繧ｳ繝｡繝ｳ繝医〒謨吶∴縺ｦ縺ｭ町\n\n---`,
      facebook: (topic, detail) =>
        `縲・{topic}縲代′豌励↓縺ｪ縺｣縺ｦ縺ｾ縺呻ｼ―n\n${detail ? detail + '\n\n' : ''}縺ｿ縺ｪ縺輔ｓ縺ｮ諢剰ｦ九ｂ閨槭°縺帙※縺上□縺輔＞・\n譛霑代％繧碁未騾｣縺ｧ髱｢逋ｽ縺・ュ蝣ｱ縺後≠繧後・縲√●縺ｲ繧ｷ繧ｧ繧｢縺励※縺上□縺輔＞・～,
      linkedin: (topic, detail) =>
        `${topic}縺ｫ縺､縺・※闊亥袖豺ｱ縺・匱隕九′縺ゅｊ縺ｾ縺励◆縲・n\n${detail ? detail + '\n\n' : ''}縺薙・蛻・㍽縺ｯ莉雁ｾ後＆繧峨↓豕ｨ逶ｮ縺輔ｌ繧九→諢溘§縺ｦ縺・∪縺吶・n\n逧・＆縺ｾ縺ｮ縺疲э隕九ｂ縺願◇縺九○縺上□縺輔＞縲Ａ,
    },
  },
  business: {
    label: '繝薙ず繝阪せ',
    emoji: '直',
    patterns: {
      twitter: (topic, detail) =>
        `縲・{topic}縲曾n\n${detail ? detail : '繝薙ず繝阪せ縺ｫ縺翫￠繧矩㍾隕√↑繝医Ξ繝ｳ繝峨〒縺吶・}\n\n隧ｳ縺励￥縺ｯ繧ｹ繝ｬ繝・ラ縺ｧ隗｣隱ｬ縺励∪縺咀汨㌔,
      instagram: (topic, detail) =>
        `投 ${topic}\n\n${detail ? detail + '\n\n' : ''}繝薙ず繝阪せ繝代・繧ｽ繝ｳ縺ｪ繧臥衍縺｣縺ｦ縺翫″縺溘＞繝昴う繝ｳ繝茨ｼ喀n\n笨・蟶ょｴ縺ｮ螟牙喧繧呈滑謠｡\n笨・遶ｶ蜷医→縺ｮ蟾ｮ蛻･蛹暴n笨・蜈ｷ菴鍋噪縺ｪ繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝励Λ繝ｳ\n\n菫晏ｭ倥＠縺ｦ蠕後〒隕玖ｿ斐＠縺ｦ縺ｭ東\n\n---`,
      facebook: (topic, detail) =>
        `縲舌ン繧ｸ繝阪せ繧､繝ｳ繧ｵ繧､繝医・{topic}\n\n${detail ? detail + '\n\n' : ''}繝昴う繝ｳ繝医ｒ縺ｾ縺ｨ繧√∪縺励◆・喀n\n1・鞘Ε 迴ｾ迥ｶ縺ｮ隱ｲ鬘圭n2・鞘Ε 蜿悶ｊ邨・・縺ｹ縺肴命遲暴n3・鞘Ε 譛溷ｾ・＆繧後ｋ謌先棡\n\n隧ｳ縺励￥縺ｯ險倅ｺ九ｒ縺碑ｦｧ縺上□縺輔＞縲・n縺碑ｳｪ蝠上ｄ縺疲э隕九′縺ゅｌ縺ｰ繧ｳ繝｡繝ｳ繝医〒縺頑ｰ苓ｻｽ縺ｫ縺ｩ縺・◇縲Ａ,
      linkedin: (topic, detail) =>
        `${topic}縺ｫ縺､縺・※縲∵怙譁ｰ縺ｮ遏･隕九ｒ蜈ｱ譛峨＆縺帙※縺・◆縺縺阪∪縺吶・n\n${detail ? detail + '\n\n' : ''}縲尻ey Takeaways縲曾n繝ｻ讌ｭ逡後ヨ繝ｬ繝ｳ繝峨・螟牙喧\n繝ｻ螳溷漁縺ｸ縺ｮ蠖ｱ髻ｿ\n繝ｻ謗ｨ螂ｨ縺輔ｌ繧九い繧ｯ繧ｷ繝ｧ繝ｳ\n\n譛ｬ莉ｶ縺ｫ縺､縺・※縲∫嚀縺輔∪縺ｮ隕玖ｧ｣繧・＃邨碁ｨ薙ｒ縺願◇縺九○縺・◆縺縺代ｌ縺ｰ蟷ｸ縺・〒縺吶・n\n#繝薙ず繝阪せ #讌ｭ逡悟虚蜷疏,
    },
  },
  fun: {
    label: '讌ｽ縺励＞',
    emoji: '脂',
    patterns: {
      twitter: (topic, detail) =>
        `噫 ${topic}縺後Ζ繝舌☆縺弱ｋ莉ｶ縺ｫ縺､縺・※ 噫\n\n${detail ? detail : '繝槭ず縺ｧ陦晄茶逧・↑繧薙□縺娯ｦ'}\n\n縺薙ｌ遏･繧峨↑縺・ｺｺ縲∽ｺｺ逕滓錐縺励※繧九°繧ゑｼ・ｼ溟沽ｱ`,
      instagram: (topic, detail) =>
        `櫨櫨櫨\n\n${topic}縺梧怙鬮倥☆縺弱ｋ・・ｼ・ｼ―n\n${detail ? detail + '\n\n' : ''}繝・Φ繧ｷ繝ｧ繝ｳ荳翫′繧翫☆縺弱※謚慕ｨｿ縺励■繧・▲縺溟沽・n\n縺薙・諢溷虚縲∽ｼ昴ｏ繧後懊懊懶ｼ―n\n蜿矩＃縺ｫ繧ゅす繧ｧ繧｢縺励※縺ｭ笨鯉ｸ十n\n---`,
      facebook: (topic, detail) =>
        `脂 縺ｿ繧薙↑閨槭＞縺ｦ・・ｼ・脂\n\n${topic}縺悟℡縺吶℃繧九ｓ縺縺代←・・ｼ―n\n${detail ? detail + '\n\n' : ''}繧ゅ≧繝・Φ繧ｷ繝ｧ繝ｳ辷・ｸ翫′繧岩ｬ・ｸ鞘ｬ・ｸ鞘ｬ・ｸ十n\n遏･縺｣縺ｦ縺滉ｺｺ縺ｯ縲後＞縺・・縲阪∫衍繧峨↑縺九▲縺滉ｺｺ縺ｯ縲瑚ｶ・＞縺・・縲阪〒謨吶∴縺ｦ・`,
      linkedin: (topic, detail) =>
        `繝ｯ繧ｯ繝ｯ繧ｯ縺吶ｋ繝九Η繝ｼ繧ｹ縺ｧ縺呻ｼ≫惠\n\n${topic}縺ｫ縺､縺・※縲√→縺ｦ繧り・螂ｮ縺励※縺・∪縺吶・n\n${detail ? detail + '\n\n' : ''}縺薙≧縺・≧髱ｩ譁ｰ逧・↑蜍輔″縺梧･ｭ逡後ｒ螟峨∴縺ｦ縺・￥縺ｨ遒ｺ菫｡縺励※縺・∪縺吶・n\n縺懊・逧・＆縺ｾ縺ｮ諢滓Φ繧偵♀閨槭°縺帙￥縺縺輔＞・Å泗形,
    },
  },
}

// 笏笏笏 Hashtag Generator 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
function generateHashtags(topic: string, platform: Platform): string[] {
  const baseKeywords = topic.split(/[\s縲√・.繝ｻ・・]+/).filter(k => k.length > 0)
  const commonTags: Record<Platform, string[]> = {
    twitter: ['縺翫☆縺吶ａ', '諡｡謨｣蟶梧悍', '繝医Ξ繝ｳ繝・, '隧ｱ鬘・],
    instagram: ['instagood', 'instajapan', '譌･譛ｬ', '縺翫☆縺吶ａ', '縺・＞縺ｭ霑斐＠'],
    facebook: ['繧ｷ繧ｧ繧｢', '諠・ｱ蜈ｱ譛・, '縺翫☆縺吶ａ'],
    linkedin: ['繧ｭ繝｣繝ｪ繧｢', '繝薙ず繝阪せ', '繧､繝弱・繝ｼ繧ｷ繝ｧ繝ｳ', 'DX'],
  }

  const tags = [
    ...baseKeywords.slice(0, 3).map(k => k.replace(/^#/, '')),
    ...commonTags[platform].slice(0, platform === 'instagram' ? 5 : 3),
  ]
  return Array.from(new Set(tags)).slice(0, platform === 'instagram' ? 8 : 5)
}

// 笏笏笏 Component 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
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
            繝・・繝ｫ邏ｹ莉九・繝ｼ繧ｸ縺ｫ謌ｻ繧・          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Share2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">SNS繧ｪ繝ｼ繝医・繧ｹ繧ｿ繝ｼ</h1>
              <p className="text-sm text-muted-foreground">繝医ヴ繝・け繧貞・蜉・竊・4繝励Λ繝・ヨ繝輔か繝ｼ繝蛻・・謚慕ｨｿ繧定・蜍慕函謌・/p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <Card className="mb-8 border-2 border-blue-500/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Topic */}
              <div>
                <label className="text-sm font-medium mb-2 block">統 繝医ヴ繝・け / 繝・・繝・/label>
                <Input
                  placeholder="萓・ AI繧剃ｽｿ縺｣縺滓･ｭ蜍吝柑邇・喧縲∵眠蝠・刀縺ｮ繝ｭ繝ｼ繝ｳ繝√・ｱ譛ｫ縺ｮ繧ｫ繝輔ぉ蟾｡繧・.."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="text-base"
                />
              </div>

              {/* Detail */}
              <div>
                <label className="text-sm font-medium mb-2 block">町 陬懆ｶｳ諠・ｱ・井ｻｻ諢擾ｼ・/label>
                <Textarea
                  placeholder="莨昴∴縺溘＞繝昴う繝ｳ繝医ｄ蜈ｷ菴鍋噪縺ｪ蜀・ｮｹ縺後≠繧後・蜈･蜉帙＠縺ｦ縺上□縺輔＞..."
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Tone Selector */}
              <div>
                <label className="text-sm font-medium mb-2 block">耳 繝医・繝ｳ驕ｸ謚・/label>
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
                  <><RefreshCw className="h-5 w-5 mr-2 animate-spin" />逕滓・荳ｭ...</>
                ) : (
                  <><Sparkles className="h-5 w-5 mr-2" />謚慕ｨｿ繧堤函謌舌☆繧・/>
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
              逕滓・縺輔ｌ縺滓兜遞ｿ
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
                          {charCount} / {post.charLimit.toLocaleString()}譁・ｭ・                        </Badge>
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
                          <span className="text-xs font-medium text-muted-foreground">繝上ャ繧ｷ繝･繧ｿ繧ｰ</span>
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
                          <><Check className="h-4 w-4 mr-2 text-green-500" />繧ｳ繝斐・縺励∪縺励◆・・/>
                        ) : (
                          <><Copy className="h-4 w-4 mr-2" />繝・く繧ｹ繝茨ｼ九ワ繝・す繝･繧ｿ繧ｰ繧偵さ繝斐・</>
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
                蛻･繝代ち繝ｼ繝ｳ縺ｧ蜀咲函謌・              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 mb-4">
              <Share2 className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">繝医ヴ繝・け繧貞・蜉帙＠縺ｦ謚慕ｨｿ繧堤函謌舌＠繧医≧</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              繝・・繝槭ｄ繝医ヴ繝・け繧貞・蜉帙☆繧九→縲ゝwitter繝ｻInstagram繝ｻFacebook繝ｻLinkedIn蜷代￠縺ｮ謚慕ｨｿ譁・′閾ｪ蜍輔〒逕滓・縺輔ｌ縺ｾ縺吶・            </p>
          </div>
        )}

      {/* Affiliate */}
      <div className="mt-8 border rounded-xl p-4 bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <span className="text-[10px] text-muted-foreground font-medium mr-2">PR</span>
          <span className="text-sm">嶋 繝輔か繝ｭ繝ｯ繝ｼ縺檎・蠅励＠縺滉ｺｺ縺御ｽｿ縺｣縺ｦ縺・ｋ繧ゅ・繧定ｦ九ｋ</span>
          <p className="text-xs text-muted-foreground mt-0.5">謚慕ｨｿ閾ｪ蜍募喧縺ｮ谺｡縺ｯ縲瑚ｦ九ｉ繧後ｋ莉慕ｵ・∩縲阪４NS驕狗畑縺ｫ蠖ｹ遶九▽繧ｰ繝・ぜ繝ｻ繝・・繝ｫ繧呈爾縺昴≧縲・/p>
        </div>
        <a href="https://www.amazon.co.jp/s?k=SNS+繝槭・繧ｱ繝・ぅ繝ｳ繧ｰ+繝・・繝ｫ&tag=nextralabs-22" target="_blank" rel="noopener noreferrer sponsored"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors">
          繝√ぉ繝・け縺吶ｋ 竊・        </a>
      </div>
      </div>
    
      </div>
  )
}




