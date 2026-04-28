'use client'

import { useState, useEffect, useCallback } from 'react'

// ==================== TYPES ====================
type Tab = 'generate' | 'templates' | 'params' | 'improve' | 'history' | 'guide'

interface PromptRecord {
  id: string
  category: string
  input: string
  prompt: string
  style: string
  timestamp: number
  favorite: boolean
}

interface Category {
  id: string
  num: string
  name: string
  group: 'business' | 'creative'
  description: string
  basePrompt: string
  exampleInput: string
}

interface StylePreset {
  id: string
  name: string
  nameEn: string
  desc: string
  modifiers: string
}

interface AnglePreset {
  name: string
  nameEn: string
}

interface LightingPreset {
  name: string
  nameEn: string
}

// ==================== CONSTANTS ====================
const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'generate', icon: '🎨', label: 'プロンプト生成' },
  { id: 'templates', icon: '📚', label: 'テンプレート' },
  { id: 'params', icon: '🔧', label: 'パラメータ辞典' },
  { id: 'improve', icon: '✨', label: 'プロンプト改善' },
  { id: 'history', icon: '📋', label: '履歴' },
  { id: 'guide', icon: '📖', label: '学習ガイド' },
]

const CATEGORIES: Category[] = [
  // Business (01-13)
  { id: 'product-image', num: '01', name: '商品イメージの仮作成', group: 'business', description: '商品コンセプトをビジュアル化', basePrompt: 'product photography of {input}, studio lighting, white background, commercial quality, high detail, 8K', exampleInput: '木製のミニマルなスマホスタンド' },
  { id: 'service-visual', num: '02', name: 'サービスのビジュアル化', group: 'business', description: '無形サービスをイメージ化', basePrompt: 'conceptual visualization of {input}, modern design, professional, clean composition, corporate style', exampleInput: 'クラウド会計サービス' },
  { id: 'hero-image', num: '03', name: 'ホームページのトップ画像', group: 'business', description: 'ウェブサイトのヒーロー画像', basePrompt: 'hero banner image for website about {input}, wide aspect ratio, modern web design aesthetic, vibrant colors, professional photography', exampleInput: 'AIスタートアップ企業' },
  { id: 'logo-icon', num: '04', name: 'ロゴやアイコン案', group: 'business', description: 'ロゴ・アイコンのたたき台', basePrompt: 'minimalist logo design for {input}, vector style, clean lines, simple shapes, iconic, memorable, professional', exampleInput: 'エコフレンドリーなカフェ' },
  { id: 'presentation', num: '05', name: '資料やプレゼン用の画像', group: 'business', description: 'ビジネス資料の挿絵', basePrompt: 'professional illustration for business presentation about {input}, clean infographic style, modern flat design, corporate colors', exampleInput: 'DX推進の成功事例' },
  { id: 'business-model', num: '06', name: 'ビジネスモデルの図解', group: 'business', description: 'ビジネス構造をわかりやすく', basePrompt: 'clean infographic diagram showing {input}, isometric illustration style, labeled arrows, modern flat design, pastel colors', exampleInput: 'サブスクリプション型SaaSの収益モデル' },
  { id: 'sns-ad', num: '07', name: 'SNS広告画像', group: 'business', description: 'SNS広告用ビジュアル', basePrompt: 'eye-catching social media advertisement for {input}, bold typography space, vibrant gradient background, Instagram/Facebook ad format, scroll-stopping visual', exampleInput: '夏のセールキャンペーン' },
  { id: 'sale-banner', num: '08', name: 'セール用バナー作成', group: 'business', description: 'ECサイトのバナー画像', basePrompt: 'e-commerce sale banner for {input}, bold and dynamic design, attention-grabbing, festive, promotional, with empty space for text overlay', exampleInput: 'ブラックフライデー50%OFF' },
  { id: 'catchcopy-visual', num: '09', name: 'キャッチコピーに合ったビジュアル', group: 'business', description: 'コピーの世界観を表現', basePrompt: 'evocative visual that embodies the concept of "{input}", emotional, atmospheric, cinematic mood, with text-friendly negative space', exampleInput: '未来は、もう始まっている。' },
  { id: 'thumbnail', num: '10', name: 'サムネイル生成', group: 'business', description: 'YouTube等のサムネイル', basePrompt: 'YouTube thumbnail style image about {input}, bold dramatic composition, high contrast, expressive, 16:9 aspect ratio, eye-catching', exampleInput: '【衝撃】AIが仕事を奪う未来' },
  { id: 'email-header', num: '11', name: 'メルマガのヘッダー画像', group: 'business', description: 'メールマガジンの見出し画像', basePrompt: 'email newsletter header image about {input}, clean and professional, 600px wide banner style, subtle gradient, modern typography space', exampleInput: '今月のおすすめ新商品' },
  { id: 'textbook-illust', num: '12', name: '教材の挿絵', group: 'business', description: '教育コンテンツの図解', basePrompt: 'educational illustration explaining {input}, clear and informative, textbook style, labeled diagram, friendly colors, easy to understand', exampleInput: '光合成のしくみ' },
  { id: 'history-geo', num: '13', name: '歴史や地理のイメージ', group: 'business', description: '歴史的場面・地理の再現', basePrompt: 'historical visualization of {input}, detailed and accurate, painterly style, dramatic lighting, educational reference quality', exampleInput: '江戸時代の日本橋の賑わい' },
  // Creative (14-26)
  { id: 'english-scene', num: '14', name: '英会話の場面を視覚化', group: 'creative', description: '英語学習のシチュエーション画像', basePrompt: 'illustration of a scene: {input}, friendly cartoon style, diverse characters, warm colors, language learning context, clear situation', exampleInput: 'カフェで注文する場面' },
  { id: 'profile-arrange', num: '15', name: 'プロフィール画像のアレンジ', group: 'creative', description: 'SNSプロフィール画像', basePrompt: 'stylized portrait/avatar of {input}, social media profile picture style, centered composition, clean background, expressive, modern', exampleInput: 'メガネをかけた猫のアバター' },
  { id: 'post-visual', num: '16', name: '投稿のビジュアル強化', group: 'creative', description: 'SNS投稿用の映える画像', basePrompt: 'aesthetic social media post image of {input}, Instagram-worthy, beautiful composition, trending visual style, high quality', exampleInput: '朝のコーヒーとノートパソコン' },
  { id: 'picture-diary', num: '17', name: '絵日記', group: 'creative', description: '日記風のイラスト', basePrompt: 'cute illustrated diary entry showing {input}, watercolor sketch style, handwritten feel, warm nostalgic colors, storybook illustration', exampleInput: '公園でピクニックした日' },
  { id: 'novel-illust', num: '18', name: '小説やシナリオの挿絵', group: 'creative', description: '物語のワンシーンを描写', basePrompt: 'dramatic illustration of a scene from a story: {input}, cinematic composition, moody lighting, narrative atmosphere, book illustration quality', exampleInput: '夜の廃墟で光る剣を見つける少女' },
  { id: 'composition-change', num: '19', name: '画像の構図変更', group: 'creative', description: '既存構図のリフレーム', basePrompt: '{input}, dynamic composition, rule of thirds, professional framing, balanced visual weight, artistic perspective', exampleInput: '東京タワーを見上げるアングル、夕暮れ時' },
  { id: 'photo-to-illust', num: '20', name: '写真をイラストに変換', group: 'creative', description: '写真風→イラスト風に', basePrompt: 'illustration style conversion of {input}, artistic interpretation, hand-drawn feel, stylized, colorful, anime/cartoon/watercolor aesthetic', exampleInput: '渋谷スクランブル交差点の風景' },
  { id: 'illust-to-photo', num: '21', name: 'イラストをリアルな写真に', group: 'creative', description: 'イラスト→実写風に変換', basePrompt: 'photorealistic version of {input}, hyperrealistic, natural lighting, real-world materials, detailed textures, DSLR photography quality', exampleInput: 'アニメ風の森の中の小さな家' },
  { id: 'character-create', num: '22', name: 'キャラクターの作成', group: 'creative', description: 'オリジナルキャラデザイン', basePrompt: 'character design sheet of {input}, full body, front view, multiple expressions, clean linework, consistent style, character concept art', exampleInput: '魔法使いの少年、青い帽子、金色の目' },
  { id: 'rough-to-lineart', num: '23', name: '手書きラフ → 線画清書', group: 'creative', description: 'ラフスケッチを清書', basePrompt: 'clean lineart illustration based on the concept of {input}, precise outlines, professional manga/comic style, black and white, detailed line drawing', exampleInput: '猫耳の女の子がジャンプしているポーズ' },
  { id: 'lineart-to-color', num: '24', name: '線画 → 着彩＆テクスチャ', group: 'creative', description: '線画にカラーリング', basePrompt: 'fully colored and textured illustration of {input}, vibrant color palette, detailed shading, rich textures, professional digital painting finish', exampleInput: 'ドラゴンの線画を水彩風に着彩' },
  { id: 'rough-to-genre', num: '25', name: '手書きラフ → ジャンル変換', group: 'creative', description: '多ジャンルへスタイル変換', basePrompt: '{input}, reimagined in {style} style, artistic reinterpretation, genre transformation, professional quality', exampleInput: '簡単な家の落書きをサイバーパンク風に' },
  { id: 'line-stamp', num: '26', name: 'LINEスタンプ風スタンプ', group: 'creative', description: '挨拶スタンプ4種セット', basePrompt: 'LINE sticker set of {input}, 4 variations showing: greeting, thank you, goodbye, and OK reactions, cute kawaii style, bold outlines, transparent background, expressive, simple', exampleInput: '丸い白猫キャラクター' },
]

const STYLES: StylePreset[] = [
  { id: 'photo', name: '写真風', nameEn: 'photography', desc: 'リアルな写真のような仕上がり', modifiers: 'photorealistic, DSLR quality, natural lighting, high resolution' },
  { id: 'illustration', name: 'イラスト', nameEn: 'illustration', desc: 'デジタルイラスト風', modifiers: 'digital illustration, clean lines, vibrant colors, professional artwork' },
  { id: 'watercolor', name: '水彩画', nameEn: 'watercolor', desc: '透明感のある水彩タッチ', modifiers: 'watercolor painting, soft edges, transparent layers, artistic brushwork' },
  { id: 'anime', name: 'アニメ風', nameEn: 'anime', desc: '日本のアニメスタイル', modifiers: 'anime style, cel shading, large expressive eyes, Japanese animation aesthetic' },
  { id: 'oil-painting', name: '油絵', nameEn: 'oil painting', desc: '重厚感のある油絵タッチ', modifiers: 'oil painting, thick brushstrokes, rich textures, classical art style, canvas texture' },
  { id: '3d-render', name: '3Dレンダリング', nameEn: '3D render', desc: '3DCGの質感', modifiers: '3D render, Octane render, ray tracing, volumetric lighting, high poly' },
  { id: 'flat-design', name: 'フラットデザイン', nameEn: 'flat design', desc: 'モダンなフラットスタイル', modifiers: 'flat design, minimal, geometric shapes, bold colors, clean vector art' },
  { id: 'pixel-art', name: 'ピクセルアート', nameEn: 'pixel art', desc: 'レトロなドット絵', modifiers: 'pixel art, 16-bit style, retro game aesthetic, limited color palette' },
  { id: 'pencil-sketch', name: '鉛筆スケッチ', nameEn: 'pencil sketch', desc: '手描き風の鉛筆画', modifiers: 'pencil sketch, graphite drawing, fine hatching, realistic shading, paper texture' },
  { id: 'ukiyoe', name: '浮世絵', nameEn: 'ukiyo-e', desc: '日本の伝統的木版画', modifiers: 'ukiyo-e style, Japanese woodblock print, flat color blocks, bold outlines, traditional' },
  { id: 'cyberpunk', name: 'サイバーパンク', nameEn: 'cyberpunk', desc: 'ネオン×近未来', modifiers: 'cyberpunk aesthetic, neon lights, dark atmosphere, futuristic, rain-soaked streets, holographic' },
  { id: 'ghibli', name: 'ジブリ風', nameEn: 'Studio Ghibli', desc: 'ジブリ的な温かい世界観', modifiers: 'Studio Ghibli inspired, warm color palette, pastoral scenery, hand-painted background, whimsical' },
  { id: 'pop-art', name: 'ポップアート', nameEn: 'pop art', desc: 'アンディ・ウォーホル風', modifiers: 'pop art style, bold primary colors, Ben-Day dots, high contrast, comic book aesthetic' },
  { id: 'isometric', name: 'アイソメトリック', nameEn: 'isometric', desc: '等角投影の立体図解', modifiers: 'isometric illustration, 3D perspective, clean lines, infographic style, detailed miniature' },
  { id: 'cinematic', name: 'シネマティック', nameEn: 'cinematic', desc: '映画のワンシーン風', modifiers: 'cinematic, anamorphic lens, dramatic lighting, movie still, film grain, shallow depth of field' },
]

const ANGLES: AnglePreset[] = [
  { name: '正面', nameEn: 'front view' },
  { name: '斜め45度', nameEn: '45-degree angle' },
  { name: '俯瞰（上から）', nameEn: 'bird\'s eye view, top-down' },
  { name: 'あおり（下から）', nameEn: 'low angle, worm\'s eye view' },
  { name: 'クローズアップ', nameEn: 'extreme close-up, macro' },
  { name: '広角パノラマ', nameEn: 'wide-angle panoramic shot' },
  { name: '横顔', nameEn: 'side profile view' },
  { name: '背面', nameEn: 'rear view, from behind' },
]

const LIGHTINGS: LightingPreset[] = [
  { name: '自然光', nameEn: 'natural lighting, golden hour' },
  { name: 'スタジオ照明', nameEn: 'studio lighting, softbox' },
  { name: 'ドラマチック', nameEn: 'dramatic lighting, chiaroscuro, high contrast' },
  { name: 'ネオン', nameEn: 'neon lighting, colorful glow, cyberpunk' },
  { name: 'バックライト', nameEn: 'backlit, silhouette, rim lighting' },
  { name: '夕暮れ', nameEn: 'sunset lighting, warm orange tones, magic hour' },
  { name: '月光', nameEn: 'moonlight, cool blue tones, night scene' },
  { name: 'フラット', nameEn: 'flat lighting, even illumination, no shadows' },
]

const QUALITY_TAGS = [
  'masterpiece', 'best quality', 'ultra detailed', '8K', 'HDR',
  'high resolution', 'sharp focus', 'professional', 'award-winning',
]

const ASPECT_RATIOS = [
  { label: '1:1 (正方形)', value: '1:1' },
  { label: '16:9 (横長)', value: '16:9' },
  { label: '9:16 (縦長)', value: '9:16' },
  { label: '4:3 (スタンダード)', value: '4:3' },
  { label: '3:2 (写真)', value: '3:2' },
  { label: '2:3 (ポートレート)', value: '2:3' },
]

// ==================== HELPERS ====================
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function buildPrompt(
  category: Category,
  input: string,
  style: StylePreset | null,
  angle: AnglePreset | null,
  lighting: LightingPreset | null,
  quality: string[],
  aspectRatio: string,
  negativePrompt: string,
  extraStyle?: string
): string {
  let prompt = category.basePrompt.replace('{input}', input)
  if (extraStyle) {
    prompt = prompt.replace('{style}', extraStyle)
  }
  if (style) {
    prompt += `, ${style.modifiers}`
  }
  if (angle) {
    prompt += `, ${angle.nameEn}`
  }
  if (lighting) {
    prompt += `, ${lighting.nameEn}`
  }
  if (quality.length > 0) {
    prompt += `, ${quality.join(', ')}`
  }
  if (aspectRatio !== '1:1') {
    prompt += ` --ar ${aspectRatio}`
  }
  if (negativePrompt.trim()) {
    prompt += `\n\nNegative prompt: ${negativePrompt}`
  }
  return prompt
}

// ==================== COMPONENT ====================
export function PromptMaster() {
  const [tab, setTab] = useState<Tab>('generate')
  // Generate tab
  const [selectedCatId, setSelectedCatId] = useState(CATEGORIES[0].id)
  const [userInput, setUserInput] = useState('')
  const [selectedStyleId, setSelectedStyleId] = useState('photo')
  const [selectedAngleIdx, setSelectedAngleIdx] = useState(-1)
  const [selectedLightIdx, setSelectedLightIdx] = useState(-1)
  const [selectedQuality, setSelectedQuality] = useState<string[]>(['masterpiece', 'best quality', 'ultra detailed'])
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [negativePrompt, setNegativePrompt] = useState('low quality, blurry, distorted, deformed, ugly, bad anatomy')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [copied, setCopied] = useState(false)
  const [catFilter, setCatFilter] = useState<'all' | 'business' | 'creative'>('all')
  // Improve tab
  const [improveInput, setImproveInput] = useState('')
  const [improvedResult, setImprovedResult] = useState('')
  // History
  const [history, setHistory] = useState<PromptRecord[]>([])
  // Templates filter
  const [templateGroup, setTemplateGroup] = useState<'all' | 'business' | 'creative'>('all')
  // Params tab
  const [paramSection, setParamSection] = useState<'style' | 'angle' | 'lighting' | 'quality'>('style')

  const selectedCat = CATEGORIES.find(c => c.id === selectedCatId) || CATEGORIES[0]
  const selectedStyle = STYLES.find(s => s.id === selectedStyleId) || null
  const selectedAngle = selectedAngleIdx >= 0 ? ANGLES[selectedAngleIdx] : null
  const selectedLight = selectedLightIdx >= 0 ? LIGHTINGS[selectedLightIdx] : null

  // localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('prompt-master-history')
      if (saved) setHistory(JSON.parse(saved))
    } catch { /* */ }
  }, [])

  const saveHistory = useCallback((h: PromptRecord[]) => {
    setHistory(h)
    localStorage.setItem('prompt-master-history', JSON.stringify(h))
  }, [])

  // Generate
  const handleGenerate = () => {
    if (!userInput.trim()) return
    const prompt = buildPrompt(selectedCat, userInput, selectedStyle, selectedAngle, selectedLight, selectedQuality, aspectRatio, negativePrompt)
    setGeneratedPrompt(prompt)
    const record: PromptRecord = {
      id: generateId(),
      category: selectedCat.name,
      input: userInput,
      prompt,
      style: selectedStyle?.name || '',
      timestamp: Date.now(),
      favorite: false,
    }
    saveHistory([record, ...history].slice(0, 100))
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Improve
  const handleImprove = () => {
    if (!improveInput.trim()) return
    const original = improveInput.trim()
    // Add quality boosters
    let improved = original
    // Check if quality tags exist
    const hasQuality = QUALITY_TAGS.some(q => original.toLowerCase().includes(q.toLowerCase()))
    if (!hasQuality) {
      improved += ', masterpiece, best quality, ultra detailed, 8K'
    }
    // Check if lighting info exists
    const hasLighting = ['lighting', 'light', 'lit', 'glow', 'shadow'].some(l => original.toLowerCase().includes(l))
    if (!hasLighting) {
      improved += ', professional lighting'
    }
    // Check if style info exists
    const hasStyle = STYLES.some(s => original.toLowerCase().includes(s.nameEn.toLowerCase()))
    if (!hasStyle) {
      improved += ', highly detailed'
    }
    // Add negative if not present
    if (!original.toLowerCase().includes('negative')) {
      improved += '\n\nNegative prompt: low quality, blurry, distorted, deformed, ugly, bad anatomy, watermark, text, signature'
    }
    setImprovedResult(improved)

    const record: PromptRecord = {
      id: generateId(),
      category: '改善',
      input: original.slice(0, 50) + '...',
      prompt: improved,
      style: '改善',
      timestamp: Date.now(),
      favorite: false,
    }
    saveHistory([record, ...history].slice(0, 100))
  }

  const filteredCategories = catFilter === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.group === catFilter)
  const templateCategories = templateGroup === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.group === templateGroup)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-gray-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                AI画像プロンプトマスター
              </h1>
            </div>
            <div className="text-xs text-white/40">26カテゴリ対応</div>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* ==================== GENERATE TAB ==================== */}
        {tab === 'generate' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">🎨 プロンプト生成</h2>
              <p className="text-sm text-white/50">カテゴリを選んで日本語で入力 → 最適なプロンプトを自動生成</p>
            </div>

            {/* Category filter */}
            <div className="flex gap-2">
              {[
                { id: 'all' as const, label: 'すべて' },
                { id: 'business' as const, label: '💼 ビジネス' },
                { id: 'creative' as const, label: '🎨 クリエイティブ' },
              ].map(f => (
                <button key={f.id} onClick={() => setCatFilter(f.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${catFilter === f.id ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Category select */}
            <div>
              <label className="text-xs text-white/50 mb-1 block">カテゴリ</label>
              <select value={selectedCatId} onChange={e => setSelectedCatId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm">
                {filteredCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.num}. {c.name}</option>
                ))}
              </select>
              <div className="text-xs text-white/30 mt-1">{selectedCat.description}</div>
            </div>

            {/* User input */}
            <div>
              <label className="text-xs text-white/50 mb-1 block">作りたい画像の内容（日本語）</label>
              <textarea value={userInput} onChange={e => setUserInput(e.target.value)} placeholder={selectedCat.exampleInput} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
            </div>

            {/* Style */}
            <div>
              <label className="text-xs text-white/50 mb-1 block">スタイル</label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {STYLES.map(s => (
                  <button key={s.id} onClick={() => setSelectedStyleId(s.id)} className={`px-2 py-2 rounded-lg text-xs text-center transition-all ${selectedStyleId === s.id ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Angle */}
            <div>
              <label className="text-xs text-white/50 mb-1 block">画角（任意）</label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setSelectedAngleIdx(-1)} className={`px-2.5 py-1.5 rounded-lg text-xs transition-all ${selectedAngleIdx === -1 ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-white/5 text-white/50'}`}>指定なし</button>
                {ANGLES.map((a, i) => (
                  <button key={i} onClick={() => setSelectedAngleIdx(i)} className={`px-2.5 py-1.5 rounded-lg text-xs transition-all ${selectedAngleIdx === i ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-white/5 text-white/50'}`}>{a.name}</button>
                ))}
              </div>
            </div>

            {/* Lighting */}
            <div>
              <label className="text-xs text-white/50 mb-1 block">ライティング（任意）</label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setSelectedLightIdx(-1)} className={`px-2.5 py-1.5 rounded-lg text-xs transition-all ${selectedLightIdx === -1 ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-white/5 text-white/50'}`}>指定なし</button>
                {LIGHTINGS.map((l, i) => (
                  <button key={i} onClick={() => setSelectedLightIdx(i)} className={`px-2.5 py-1.5 rounded-lg text-xs transition-all ${selectedLightIdx === i ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-white/5 text-white/50'}`}>{l.name}</button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div>
              <label className="text-xs text-white/50 mb-1 block">品質タグ</label>
              <div className="flex flex-wrap gap-2">
                {QUALITY_TAGS.map(q => (
                  <button key={q} onClick={() => setSelectedQuality(prev => prev.includes(q) ? prev.filter(p => p !== q) : [...prev, q])} className={`px-2.5 py-1.5 rounded-lg text-xs transition-all ${selectedQuality.includes(q) ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-white/5 text-white/50'}`}>{q}</button>
                ))}
              </div>
            </div>

            {/* Aspect ratio */}
            <div>
              <label className="text-xs text-white/50 mb-1 block">アスペクト比</label>
              <div className="flex flex-wrap gap-2">
                {ASPECT_RATIOS.map(ar => (
                  <button key={ar.value} onClick={() => setAspectRatio(ar.value)} className={`px-2.5 py-1.5 rounded-lg text-xs transition-all ${aspectRatio === ar.value ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-white/5 text-white/50'}`}>{ar.label}</button>
                ))}
              </div>
            </div>

            {/* Negative prompt */}
            <div>
              <label className="text-xs text-white/50 mb-1 block">ネガティブプロンプト</label>
              <textarea value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
            </div>

            {/* Generate button */}
            <button onClick={handleGenerate} disabled={!userInput.trim()} className="w-full py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-30 transition-opacity">
              ✨ プロンプトを生成
            </button>

            {/* Result */}
            {generatedPrompt && (
              <div className="bg-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-purple-400">生成されたプロンプト</h3>
                  <button onClick={() => handleCopy(generatedPrompt)} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs hover:bg-purple-500/30">{copied ? '✅ コピー済み' : '📋 コピー'}</button>
                </div>
                <pre className="text-sm text-white/80 whitespace-pre-wrap break-all bg-black/30 rounded-lg p-4 font-mono">{generatedPrompt}</pre>
              </div>
            )}
          </div>
        )}

        {/* ==================== TEMPLATES TAB ==================== */}
        {tab === 'templates' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">📚 カテゴリ別テンプレート</h2>
              <p className="text-sm text-white/50">26カテゴリのプリセット。タップで適用</p>
            </div>

            <div className="flex gap-2">
              {[
                { id: 'all' as const, label: 'すべて (26)' },
                { id: 'business' as const, label: '💼 ビジネス (13)' },
                { id: 'creative' as const, label: '🎨 クリエイティブ (13)' },
              ].map(f => (
                <button key={f.id} onClick={() => setTemplateGroup(f.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${templateGroup === f.id ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                  {f.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {templateCategories.map(c => (
                <div key={c.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.group === 'business' ? 'bg-blue-500/20 text-blue-400' : 'bg-fuchsia-500/20 text-fuchsia-400'}`}>{c.num}</span>
                        <span className="font-medium text-sm">{c.name}</span>
                      </div>
                      <div className="text-xs text-white/40 mb-2">{c.description}</div>
                      <div className="text-xs text-white/50 bg-black/20 rounded-lg p-2 font-mono break-all">{c.basePrompt.replace('{input}', c.exampleInput).replace('{style}', 'cyberpunk')}</div>
                      <div className="text-xs text-white/30 mt-1">例: {c.exampleInput}</div>
                    </div>
                    <button onClick={() => { setSelectedCatId(c.id); setUserInput(c.exampleInput); setTab('generate') }} className="shrink-0 ml-3 px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-xs hover:bg-purple-500/30">使う</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== PARAMS TAB ==================== */}
        {tab === 'params' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">🔧 パラメータ辞典</h2>
              <p className="text-sm text-white/50">スタイル・画角・ライティング・品質の英語キーワード集</p>
            </div>

            <div className="flex gap-2">
              {[
                { id: 'style' as const, label: '🎨 スタイル', count: STYLES.length },
                { id: 'angle' as const, label: '📐 画角', count: ANGLES.length },
                { id: 'lighting' as const, label: '💡 ライティング', count: LIGHTINGS.length },
                { id: 'quality' as const, label: '✨ 品質', count: QUALITY_TAGS.length },
              ].map(s => (
                <button key={s.id} onClick={() => setParamSection(s.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${paramSection === s.id ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                  {s.label} ({s.count})
                </button>
              ))}
            </div>

            {paramSection === 'style' && (
              <div className="space-y-2">
                {STYLES.map(s => (
                  <div key={s.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{s.name}</span>
                      <button onClick={() => handleCopy(s.modifiers)} className="text-xs text-purple-400 hover:text-purple-300 px-2">📋</button>
                    </div>
                    <div className="text-xs text-white/40 mb-1">{s.desc}</div>
                    <div className="text-xs text-green-400 font-mono bg-black/20 rounded-lg px-3 py-1.5 break-all">{s.modifiers}</div>
                  </div>
                ))}
              </div>
            )}

            {paramSection === 'angle' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ANGLES.map((a, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{a.name}</div>
                      <div className="text-xs text-green-400 font-mono">{a.nameEn}</div>
                    </div>
                    <button onClick={() => handleCopy(a.nameEn)} className="text-xs text-purple-400 hover:text-purple-300 px-2">📋</button>
                  </div>
                ))}
              </div>
            )}

            {paramSection === 'lighting' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {LIGHTINGS.map((l, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{l.name}</div>
                      <div className="text-xs text-green-400 font-mono">{l.nameEn}</div>
                    </div>
                    <button onClick={() => handleCopy(l.nameEn)} className="text-xs text-purple-400 hover:text-purple-300 px-2">📋</button>
                  </div>
                ))}
              </div>
            )}

            {paramSection === 'quality' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {QUALITY_TAGS.map(q => (
                  <div key={q} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="text-sm text-green-400 font-mono">{q}</div>
                    <button onClick={() => handleCopy(q)} className="text-xs text-purple-400 hover:text-purple-300 px-2">📋</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== IMPROVE TAB ==================== */}
        {tab === 'improve' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">✨ プロンプト改善AI</h2>
              <p className="text-sm text-white/50">既存のプロンプトを貼り付けて品質アップ</p>
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1 block">改善したいプロンプトを貼り付け</label>
              <textarea value={improveInput} onChange={e => setImproveInput(e.target.value)} placeholder="例: a cat sitting on a chair" rows={5} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono" />
            </div>

            <button onClick={handleImprove} disabled={!improveInput.trim()} className="w-full py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-30 transition-opacity">
              ✨ プロンプトを改善
            </button>

            {improvedResult && (
              <div className="space-y-3">
                <div className="bg-white/5 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-green-400">改善後のプロンプト</h3>
                    <button onClick={() => handleCopy(improvedResult)} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30">{copied ? '✅ コピー済み' : '📋 コピー'}</button>
                  </div>
                  <pre className="text-sm text-white/80 whitespace-pre-wrap break-all bg-black/30 rounded-lg p-4 font-mono">{improvedResult}</pre>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-purple-400 mb-2">💡 改善ポイント</h3>
                  <ul className="text-xs text-white/60 space-y-1">
                    <li>• 品質タグを追加してディテールを向上</li>
                    <li>• ライティング指定で雰囲気を安定化</li>
                    <li>• ネガティブプロンプトで不要な要素を排除</li>
                    <li>• より具体的な修飾語で意図を明確化</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== HISTORY TAB ==================== */}
        {tab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">📋 履歴＆お気に入り</h2>
                <p className="text-sm text-white/50">生成したプロンプトの一覧（{history.length}件）</p>
              </div>
              {history.length > 0 && (
                <button onClick={() => { if (confirm('履歴をすべて削除しますか？')) saveHistory([]) }} className="text-xs text-red-400 hover:text-red-300 px-2">全削除</button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-12 text-center text-white/40">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-sm">まだ履歴がありません</p>
                <p className="text-xs mt-1">プロンプトを生成すると自動で保存されます</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map(h => (
                  <div key={h.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => saveHistory(history.map(r => r.id === h.id ? { ...r, favorite: !r.favorite } : r))} className="text-lg">{h.favorite ? '⭐' : '☆'}</button>
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">{h.category}</span>
                        {h.style && <span className="text-xs text-white/30">{h.style}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/30">{new Date(h.timestamp).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        <button onClick={() => handleCopy(h.prompt)} className="text-xs text-purple-400 hover:text-purple-300">📋</button>
                        <button onClick={() => saveHistory(history.filter(r => r.id !== h.id))} className="text-xs text-red-400 hover:text-red-300">🗑</button>
                      </div>
                    </div>
                    <div className="text-xs text-white/40 mb-1">{h.input}</div>
                    <div className="text-xs text-white/60 bg-black/20 rounded-lg px-3 py-2 font-mono break-all line-clamp-3">{h.prompt}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== GUIDE TAB ==================== */}
        {tab === 'guide' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">📖 学習ガイド</h2>
              <p className="text-sm text-white/50">プロンプトの基本から応用まで</p>
            </div>

            {/* Basic Structure */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm text-purple-400 mb-3">🏗️ プロンプトの基本構造</h3>
              <div className="bg-black/30 rounded-lg p-4 text-sm font-mono text-white/70 mb-3">
                <div className="text-green-400">[被写体/メインの内容],</div>
                <div className="text-blue-400">[スタイル/画風],</div>
                <div className="text-yellow-400">[構図/画角],</div>
                <div className="text-orange-400">[ライティング/雰囲気],</div>
                <div className="text-pink-400">[品質タグ]</div>
              </div>
              <div className="text-xs text-white/50">
                例: <span className="text-white/70 font-mono">a Japanese garden in autumn, watercolor painting, wide angle, soft golden hour lighting, masterpiece, best quality, 8K</span>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm text-green-400 mb-3">✅ 効果的なTips</h3>
              <div className="space-y-2 text-sm text-white/60">
                <div>• <strong className="text-white/80">具体的に書く</strong> — 「花」→「満開の桜の木、花びらが風に舞う」</div>
                <div>• <strong className="text-white/80">形容詞を重ねる</strong> — 色、質感、雰囲気を追加</div>
                <div>• <strong className="text-white/80">参考アーティスト</strong> — 「in the style of [artist]」でテイスト指定</div>
                <div>• <strong className="text-white/80">ネガティブプロンプト</strong> — 不要な要素を明示的に排除</div>
                <div>• <strong className="text-white/80">カンマで区切る</strong> — 各要素はカンマで明確に分離</div>
                <div>• <strong className="text-white/80">重要なものを先に</strong> — 先頭の語句ほど影響が強い</div>
              </div>
            </div>

            {/* NG */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm text-red-400 mb-3">❌ よくあるNG</h3>
              <div className="space-y-2 text-sm text-white/60">
                <div>• <span className="text-red-400 line-through">beautiful picture</span> → <span className="text-green-400">具体的なスタイルを指定</span></div>
                <div>• <span className="text-red-400 line-through">make it look good</span> → <span className="text-green-400">品質タグを使用</span></div>
                <div>• <span className="text-red-400 line-through">日本語のまま長文</span> → <span className="text-green-400">英語キーワードの組み合わせ</span></div>
                <div>• <span className="text-red-400 line-through">矛盾する指示</span> → <span className="text-green-400">1つの方向性に統一</span></div>
                <div>• <span className="text-red-400 line-through">「〜しないで」</span> → <span className="text-green-400">ネガティブプロンプトに入れる</span></div>
              </div>
            </div>

            {/* Model-specific tips */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm text-blue-400 mb-3">🤖 モデル別Tips</h3>
              <div className="space-y-3">
                {[
                  { name: 'Midjourney', tips: '--ar で比率指定, --v 6 で最新版, --s で様式化度, --q で品質' },
                  { name: 'DALL-E 3', tips: '自然言語で詳しく書くほど良い結果。ネガティブプロンプト非対応' },
                  { name: 'Stable Diffusion', tips: 'LoRA/モデル指定可能。ネガティブプロンプト重要。CFG Scale調整' },
                  { name: 'Flux', tips: '高品質な自然言語理解。長文プロンプトに強い' },
                ].map(m => (
                  <div key={m.name} className="bg-black/20 rounded-lg p-3">
                    <div className="text-xs font-bold text-white/80 mb-1">{m.name}</div>
                    <div className="text-xs text-white/50">{m.tips}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Glossary */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm text-yellow-400 mb-3">📖 よく使う英語表現</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ['高品質', 'high quality, masterpiece'],
                  ['細部まで', 'highly detailed, intricate'],
                  ['映画的', 'cinematic, dramatic'],
                  ['柔らかい', 'soft, gentle, ethereal'],
                  ['力強い', 'bold, powerful, dynamic'],
                  ['ミニマル', 'minimalist, clean, simple'],
                  ['レトロ', 'vintage, retro, nostalgic'],
                  ['幻想的', 'fantasy, magical, mystical'],
                  ['未来的', 'futuristic, sci-fi, modern'],
                  ['自然な', 'natural, organic, earthy'],
                ].map(([jp, en]) => (
                  <div key={jp} className="bg-black/20 rounded-lg p-2 flex items-center justify-between">
                    <div><span className="text-white/60">{jp}</span></div>
                    <div className="text-green-400 font-mono text-right">{en}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto px-4 py-6 border-t border-white/10 mt-8">
        <p className="text-xs text-white/30 text-center">
          ※ 生成されたプロンプトはすべてブラウザ内で処理されます。サーバーへのデータ送信はありません。
        </p>
      </div>
    </div>
  )
}
