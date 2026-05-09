'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Copy, Check, Trash2, Palette, Sun, Maximize, Wind, Layers, Monitor, Wand2, Sparkles, LayoutGrid, ExternalLink
} from 'lucide-react'

const PRESET_TAGS = {
  style: [
    { label: '実写フォト', content: 'photorealistic, 8k resolution, cinematic lighting, shot on 35mm lens, f/1.8' },
    { label: 'アニメ調', content: 'anime style, vibrant colors, clean lines, high-quality cel shaded, makoto shinkai style' },
    { label: '油絵風', content: 'oil painting, thick brushstrokes, classical masterpiece, impasto style, canvas texture' },
    { label: '3Dレンダリング', content: 'unreal engine 5, octane render, ray tracing, 3D character design, blender' },
    { label: '水彩画', content: 'watercolor illustration, soft edges, hand-drawn, paper texture, pastel colors' },
    { label: 'サイバーパンク', content: 'cyberpunk aesthetic, neon lights, futuristic city, chrome, high-tech noir' },
    { label: 'ピクセルアート', content: '16-bit pixel art, retro gaming style, sharp pixels, pixelated' },
    { label: 'ジブリ風', content: 'Studio Ghibli style, lush nature, nostalgic atmosphere, hand-painted look' },
    { label: '浮世絵', content: 'Ukiyo-e style, traditional Japanese woodblock print, flat colors, katsushika hokusai' },
    { label: 'スケッチ', content: 'pencil sketch, rough lines, charcoal drawing, artistic, hand-drawn' },
    { label: 'ミニチュア', content: 'tilt-shift photography, miniature model style, bokeh, macro lens' },
    { label: 'クレイアニメ', content: 'claymation style, plasticine texture, stop motion look, handcrafted' },
    { label: 'スチームパンク', content: 'steampunk, brass gears, steam, victorian industrial, copper, clockwork' },
    { label: '万華鏡風', content: 'kaleidoscopic, symmetrical fractals, psychedelic, vibrant colors' },
    { label: '点描画', content: 'pointillism, tiny dots of color, post-impressionism, george seurat' },
    { label: 'チョークアート', content: 'chalk drawing, blackboard texture, dusty, colorful, street art' },
    { label: 'ポップアート', content: 'pop art style, Andy Warhol style, high contrast, vibrant dots, screen print' },
    { label: '切り絵', content: 'paper cut art, layered paper, shadows between layers, handcrafted, washi' },
    { label: '墨絵', content: 'sumi-e style, Japanese ink wash painting, brush strokes, zen, minimalist' },
    { label: 'ビンテージ写真', content: 'vintage 1970s photo, polaroid style, faded colors, grain, nostalgic' },
  ],
  lighting: [
    { label: '黄金の夕暮れ', content: 'golden hour, warm sunlight, long shadows, lens flare' },
    { label: 'スタジオ照明', content: 'studio lighting, softbox, professional photography, clean background' },
    { label: 'ネオン街', content: 'neon glow, volumetric fog, blue and pink lighting, night city' },
    { label: '月夜', content: 'moonlight, night scene, dark atmosphere, silver glow, starlight' },
    { label: '神々しい光', content: 'god rays, ethereal lighting, heavenly glow, cinematic, light beams' },
    { label: 'キャンドル', content: 'candlelight, flickering flame, warm intimate atmosphere, low light' },
    { label: '白黒・低照度', content: 'low key lighting, dramatic shadows, black and white noir, high contrast' },
    { label: 'SF・レーザー', content: 'laser beam lighting, glowing energy, high tech, futuristic glow' },
    { label: 'オーロラ', content: 'aurora borealis lighting, green and purple sky glow, magical, night sky' },
    { label: '海底の光', content: 'underwater light rays, caustic ripples, deep blue, marine atmosphere' },
  ],
  composition: [
    { label: '超広角', content: 'ultra wide angle, fisheye lens, expansive view, landscape' },
    { label: 'ポートレート', content: 'close-up portrait, shallow depth of field, bokeh background, 85mm' },
    { label: '鳥瞰（俯瞰）', content: 'birds-eye view, from above, aerial photography, drone shot' },
    { label: 'マクロ撮影', content: 'macro photography, extreme detail, microscopic focus, tiny world' },
    { label: '対称性', content: 'symmetrical composition, balanced, centered focus, geometric' },
    { label: 'パノラマ', content: 'panoramic view, wide landscape, breathtaking scale, horizontal' },
    { label: '躍動感', content: 'dynamic action shot, motion blur, fast movement, energetic' },
    { label: '映画構図', content: 'cinematic composition, 2.35:1 aspect ratio, epic scale, widescreen' },
    { label: '虫瞰（ロー）', content: 'worms-eye view, looking up, low angle, monumental, grand' },
    { label: '二重露光', content: 'double exposure, overlapping images, artistic blend, surreal' },
  ],
  atmosphere: [
    { label: '幻想的', content: 'ethereal, dreamlike, magical atmosphere, surreal, fantasy' },
    { label: 'ノスタルジック', content: 'nostalgic, retro vibe, faded colors, old memories, sepia' },
    { label: 'ダーク・ホラー', content: 'dark, gothic, horror atmosphere, creepy, moody, terrifying' },
    { label: '爽やか・清潔', content: 'fresh, clean, minimalist, airy, bright atmosphere, sunny' },
    { label: '緊迫感', content: 'tense atmosphere, high stakes, dramatic pressure, thriller' },
    { label: '和風・禅', content: 'zen, peaceful Japanese atmosphere, traditional, calm, serene' },
    { label: '終末世界', content: 'post-apocalyptic, overgrown, ruined city, desolate, wasteland' },
    { label: 'サイケデリック', content: 'trippy, colorful, warped reality, intricate patterns, dream' },
  ],
  material: [
    { label: '液体金属', content: 'liquid metal, metallic mercury texture, reflective, shiny' },
    { label: '氷・凍結', content: 'frozen, ice crystals, transparent, cold blue, frosting' },
    { label: '溶岩・マグマ', content: 'molten lava, glowing cracks, intense heat, volcanic' },
    { label: 'クリスタル', content: 'crystalline structure, diamond facets, prismatic, light refracting' },
    { label: 'ホログラム', content: 'holographic, glitch effect, semi-transparent, light based, projection' },
    { label: '錆びた鉄', content: 'rusty metal, decayed, industrial, old iron, weathered' },
  ],
  aspect: [
    { label: 'YouTube (16:9)', content: 'aspect ratio 16:9, widescreen' },
    { label: 'X/Twitter (3:2)', content: 'aspect ratio 3:2, landscape' },
    { label: 'Instagram (1:1)', content: 'aspect ratio 1:1, square' },
    { label: 'TikTok/Reels (9:16)', content: 'aspect ratio 9:16, portrait, vertical' },
    { label: '映画 (2.39:1)', content: 'aspect ratio 2.39:1, anamorphic cinematic' },
  ],
}

const CATEGORY_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  style:       { label: 'スタイル',    icon: <Palette size={14} /> },
  lighting:    { label: 'ライティング', icon: <Sun size={14} /> },
  composition: { label: '構図',        icon: <Maximize size={14} /> },
  atmosphere:  { label: '雰囲気',      icon: <Wind size={14} /> },
  material:    { label: '素材感',      icon: <Layers size={14} /> },
  aspect:      { label: 'アスペクト比', icon: <Monitor size={14} /> },
}

export default function PromptMaster() {
  const [subject, setSubject] = useState('')
  const [logoConcept, setLogoConcept] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const toggleTag = (content: string) => {
    setSelectedTags(prev =>
      prev.includes(content) ? prev.filter(t => t !== content) : [...prev, content]
    )
  }

  const clearAll = () => {
    setSubject('')
    setLogoConcept('')
    setSelectedTags([])
  }

  const getCombinedPrompt = () => {
    const tagsPart = selectedTags.join(', ')
    return `あなたは世界最高峰の画像生成エンジニアです。
今すぐ、以下の【主題】と【詳細設定】、【指定パーツ】を完璧に組み合わせた「高品質な画像」を1枚生成してください。
説明不要、画像生成（Create an image）のみを即座に実行せよ。

【主題（メイン）】: ${subject}
【詳細設定】: ${logoConcept}
【指定パーツ】: ${tagsPart}`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getCombinedPrompt())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectedCount = selectedTags.length

  return (
    <div
      className="min-h-screen text-slate-100 pb-24"
      style={{
        background: '#050507',
        fontFamily: "'Inter', 'Noto Sans JP', sans-serif",
      }}
    >
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center space-y-5">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
          style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.08)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Prompt Master
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold text-slate-100 tracking-tight leading-[1.15]">
          AIに渡す「完璧な指令」を<br />
          <span style={{ color: '#10b981' }}>ワンクリック</span>で錬成する
        </h1>
        <p className="text-slate-400 text-base leading-relaxed max-w-xl mx-auto">
          主題を入力し、スタイル・ライティング・構図などのパーツを選ぶだけ。<br />
          ChatGPTやGeminiに貼り付けると即座に画像生成が始まります。
        </p>
      </div>

      {/* Main */}
      <div className="max-w-5xl mx-auto px-6 space-y-6">
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">

          {/* Left: inputs + tags */}
          <div className="space-y-5">

            {/* Step 1 */}
            <Card style={{ background: '#0d1117', border: '1px solid #1e293b' }} className="rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <Sparkles size={15} style={{ color: '#10b981' }} />
                  主題（メインテーマ）
                </div>
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={12} />
                  すべてクリア
                </button>
              </div>
              <textarea
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="例：未来の渋谷に立つサイボーグの侍、光る雨の中でたたずむ少女など..."
                className="w-full h-28 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none resize-none transition-colors"
                style={{
                  background: '#13141f',
                  border: '1px solid #334155',
                }}
                onFocus={e => (e.target.style.borderColor = '#10b981')}
                onBlur={e => (e.target.style.borderColor = '#334155')}
              />
            </Card>

            {/* Step 2 */}
            <Card style={{ background: '#0d1117', border: '1px solid #1e293b' }} className="rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Wand2 size={15} style={{ color: '#10b981' }} />
                詳細設定・ロゴ指定（任意）
              </div>
              <textarea
                value={logoConcept}
                onChange={e => setLogoConcept(e.target.value)}
                placeholder="例：白背景、文字なし、ミニマルなベクター形式 など詳細を自由に入力..."
                className="w-full h-24 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none resize-none transition-colors"
                style={{
                  background: '#13141f',
                  border: '1px solid #334155',
                }}
                onFocus={e => (e.target.style.borderColor = '#10b981')}
                onBlur={e => (e.target.style.borderColor = '#334155')}
              />
            </Card>

            {/* Step 3: Tags */}
            <Card style={{ background: '#0d1117', border: '1px solid #1e293b' }} className="rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <LayoutGrid size={15} style={{ color: '#10b981' }} />
                  プロのパーツを選択
                </div>
                {selectedCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>
                    {selectedCount} 件選択中
                  </span>
                )}
              </div>

              <div className="space-y-5 max-h-[520px] overflow-y-auto pr-1">
                {Object.entries(PRESET_TAGS).map(([category, tags]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      {CATEGORY_LABELS[category]?.icon}
                      {CATEGORY_LABELS[category]?.label}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => {
                        const active = selectedTags.includes(tag.content)
                        return (
                          <button
                            key={tag.label}
                            onClick={() => toggleTag(tag.content)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                            style={
                              active
                                ? { background: 'rgba(16,185,129,0.18)', color: '#34d399', border: '1px solid rgba(16,185,129,0.5)' }
                                : { background: '#13141f', color: '#94a3b8', border: '1px solid #1e293b' }
                            }
                          >
                            {tag.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: action panel */}
          <div className="space-y-4">
            <Card
              style={{ background: '#0d1117', border: '2px solid #10b981', boxShadow: '0 0 20px rgba(16,185,129,0.15)' }}
              className="rounded-xl p-6 space-y-5"
            >
              <div className="text-xs font-medium text-slate-500 text-center">PROMPT COMMAND HUB</div>

              {/* Preview */}
              {subject && (
                <div className="rounded-lg p-3 text-xs text-slate-400 leading-relaxed max-h-40 overflow-y-auto"
                  style={{ background: '#13141f', border: '1px solid #1e293b' }}>
                  {getCombinedPrompt()}
                </div>
              )}

              {/* Copy button */}
              <Button
                onClick={handleCopy}
                disabled={!subject}
                className="w-full h-12 text-sm font-semibold rounded-lg transition-all"
                style={
                  copied
                    ? { background: '#059669', color: '#fff' }
                    : subject
                    ? { background: '#10b981', color: '#fff' }
                    : { background: '#1e293b', color: '#475569', cursor: 'not-allowed' }
                }
              >
                {copied ? (
                  <><Check size={16} className="mr-2" />コピーしました</>
                ) : (
                  <><Copy size={16} className="mr-2" />プロンプトをコピー</>
                )}
              </Button>

              <p className="text-xs text-slate-600 text-center leading-relaxed">
                コピーして以下のAIへ貼り付けると<br />自動的に画像生成が始まります
              </p>

              {/* AI links */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => window.open('https://chatgpt.com', '_blank')}
                  className="w-full h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  style={{ background: '#13141f', border: '1px solid #1e293b', color: '#e2e8f0' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#334155')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e293b')}
                >
                  <Sparkles size={14} style={{ color: '#10b981' }} />
                  ChatGPT で開く
                  <ExternalLink size={12} className="text-slate-600" />
                </button>
                <button
                  onClick={() => window.open('https://gemini.google.com', '_blank')}
                  className="w-full h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  style={{ background: '#13141f', border: '1px solid #1e293b', color: '#e2e8f0' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#334155')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e293b')}
                >
                  <Wand2 size={14} style={{ color: '#10b981' }} />
                  Gemini で開く
                  <ExternalLink size={12} className="text-slate-600" />
                </button>
              </div>
            </Card>

            {/* Usage hint */}
            <Card style={{ background: '#0d1117', border: '1px solid #1e293b' }} className="rounded-xl p-5 space-y-3">
              <p className="text-xs font-semibold text-slate-400">使い方</p>
              <ol className="space-y-2 text-xs text-slate-500 leading-relaxed list-decimal list-inside">
                <li>主題に描きたいシーンや被写体を入力</li>
                <li>必要に応じて詳細設定を追記</li>
                <li>スタイル・構図などのパーツを選択</li>
                <li>「プロンプトをコピー」してAIに貼り付け</li>
              </ol>
            </Card>
          </div>
        </div>
      </div>

      <div className="text-center mt-16 opacity-20">
        <p className="text-xs text-slate-600 tracking-widest">NextraLabs 2026</p>
      </div>
    </div>
  )
}
