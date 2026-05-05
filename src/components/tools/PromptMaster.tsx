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
  { id: 'generate', icon: '耳', label: '繝励Ο繝ｳ繝励ヨ逕滓・' },
  { id: 'templates', icon: '答', label: '繝・Φ繝励Ξ繝ｼ繝・ },
  { id: 'params', icon: '肌', label: '繝代Λ繝｡繝ｼ繧ｿ霎槫・' },
  { id: 'improve', icon: '笨ｨ', label: '繝励Ο繝ｳ繝励ヨ謾ｹ蝟・ },
  { id: 'history', icon: '搭', label: '螻･豁ｴ' },
  { id: 'guide', icon: '当', label: '蟄ｦ鄙偵ぎ繧､繝・ },
]

const CATEGORIES: Category[] = [
  // Business (01-13)
  { id: 'product-image', num: '01', name: '蝠・刀繧､繝｡繝ｼ繧ｸ縺ｮ莉ｮ菴懈・', group: 'business', description: '蝠・刀繧ｳ繝ｳ繧ｻ繝励ヨ繧偵ン繧ｸ繝･繧｢繝ｫ蛹・, basePrompt: 'product photography of {input}, studio lighting, white background, commercial quality, high detail, 8K', exampleInput: '譛ｨ陬ｽ縺ｮ繝溘ル繝槭Ν縺ｪ繧ｹ繝槭・繧ｹ繧ｿ繝ｳ繝・ },
  { id: 'service-visual', num: '02', name: '繧ｵ繝ｼ繝薙せ縺ｮ繝薙ず繝･繧｢繝ｫ蛹・, group: 'business', description: '辟｡蠖｢繧ｵ繝ｼ繝薙せ繧偵う繝｡繝ｼ繧ｸ蛹・, basePrompt: 'conceptual visualization of {input}, modern design, professional, clean composition, corporate style', exampleInput: '繧ｯ繝ｩ繧ｦ繝我ｼ夊ｨ医し繝ｼ繝薙せ' },
  { id: 'hero-image', num: '03', name: '繝帙・繝繝壹・繧ｸ縺ｮ繝医ャ繝礼判蜒・, group: 'business', description: '繧ｦ繧ｧ繝悶し繧､繝医・繝偵・繝ｭ繝ｼ逕ｻ蜒・, basePrompt: 'hero banner image for website about {input}, wide aspect ratio, modern web design aesthetic, vibrant colors, professional photography', exampleInput: 'AI繧ｹ繧ｿ繝ｼ繝医い繝・・莨∵･ｭ' },
  { id: 'logo-icon', num: '04', name: '繝ｭ繧ｴ繧・い繧､繧ｳ繝ｳ譯・, group: 'business', description: '繝ｭ繧ｴ繝ｻ繧｢繧､繧ｳ繝ｳ縺ｮ縺溘◆縺榊床', basePrompt: 'minimalist logo design for {input}, vector style, clean lines, simple shapes, iconic, memorable, professional', exampleInput: '繧ｨ繧ｳ繝輔Ξ繝ｳ繝峨Μ繝ｼ縺ｪ繧ｫ繝輔ぉ' },
  { id: 'presentation', num: '05', name: '雉・侭繧・・繝ｬ繧ｼ繝ｳ逕ｨ縺ｮ逕ｻ蜒・, group: 'business', description: '繝薙ず繝阪せ雉・侭縺ｮ謖ｿ邨ｵ', basePrompt: 'professional illustration for business presentation about {input}, clean infographic style, modern flat design, corporate colors', exampleInput: 'DX謗ｨ騾ｲ縺ｮ謌仙粥莠倶ｾ・ },
  { id: 'business-model', num: '06', name: '繝薙ず繝阪せ繝｢繝・Ν縺ｮ蝗ｳ隗｣', group: 'business', description: '繝薙ず繝阪せ讒矩繧偵ｏ縺九ｊ繧・☆縺・, basePrompt: 'clean infographic diagram showing {input}, isometric illustration style, labeled arrows, modern flat design, pastel colors', exampleInput: '繧ｵ繝悶せ繧ｯ繝ｪ繝励す繝ｧ繝ｳ蝙鬼aaS縺ｮ蜿守寢繝｢繝・Ν' },
  { id: 'sns-ad', num: '07', name: 'SNS蠎・相逕ｻ蜒・, group: 'business', description: 'SNS蠎・相逕ｨ繝薙ず繝･繧｢繝ｫ', basePrompt: 'eye-catching social media advertisement for {input}, bold typography space, vibrant gradient background, Instagram/Facebook ad format, scroll-stopping visual', exampleInput: '螟上・繧ｻ繝ｼ繝ｫ繧ｭ繝｣繝ｳ繝壹・繝ｳ' },
  { id: 'sale-banner', num: '08', name: '繧ｻ繝ｼ繝ｫ逕ｨ繝舌リ繝ｼ菴懈・', group: 'business', description: 'EC繧ｵ繧､繝医・繝舌リ繝ｼ逕ｻ蜒・, basePrompt: 'e-commerce sale banner for {input}, bold and dynamic design, attention-grabbing, festive, promotional, with empty space for text overlay', exampleInput: '繝悶Λ繝・け繝輔Λ繧､繝・・50%OFF' },
  { id: 'catchcopy-visual', num: '09', name: '繧ｭ繝｣繝・メ繧ｳ繝斐・縺ｫ蜷医▲縺溘ン繧ｸ繝･繧｢繝ｫ', group: 'business', description: '繧ｳ繝斐・縺ｮ荳也阜隕ｳ繧定｡ｨ迴ｾ', basePrompt: 'evocative visual that embodies the concept of "{input}", emotional, atmospheric, cinematic mood, with text-friendly negative space', exampleInput: '譛ｪ譚･縺ｯ縲√ｂ縺・ｧ九∪縺｣縺ｦ縺・ｋ縲・ },
  { id: 'thumbnail', num: '10', name: '繧ｵ繝繝阪う繝ｫ逕滓・', group: 'business', description: 'YouTube遲峨・繧ｵ繝繝阪う繝ｫ', basePrompt: 'YouTube thumbnail style image about {input}, bold dramatic composition, high contrast, expressive, 16:9 aspect ratio, eye-catching', exampleInput: '縲占｡晄茶縲羨I縺御ｻ穂ｺ九ｒ螂ｪ縺・悴譚･' },
  { id: 'email-header', num: '11', name: '繝｡繝ｫ繝槭ぎ縺ｮ繝倥ャ繝繝ｼ逕ｻ蜒・, group: 'business', description: '繝｡繝ｼ繝ｫ繝槭ぎ繧ｸ繝ｳ縺ｮ隕句・縺礼判蜒・, basePrompt: 'email newsletter header image about {input}, clean and professional, 600px wide banner style, subtle gradient, modern typography space', exampleInput: '莉頑怦縺ｮ縺翫☆縺吶ａ譁ｰ蝠・刀' },
  { id: 'textbook-illust', num: '12', name: '謨呎攝縺ｮ謖ｿ邨ｵ', group: 'business', description: '謨呵ご繧ｳ繝ｳ繝・Φ繝・・蝗ｳ隗｣', basePrompt: 'educational illustration explaining {input}, clear and informative, textbook style, labeled diagram, friendly colors, easy to understand', exampleInput: '蜈牙粋謌舌・縺励￥縺ｿ' },
  { id: 'history-geo', num: '13', name: '豁ｴ蜿ｲ繧・慍逅・・繧､繝｡繝ｼ繧ｸ', group: 'business', description: '豁ｴ蜿ｲ逧・ｴ髱｢繝ｻ蝨ｰ逅・・蜀咲樟', basePrompt: 'historical visualization of {input}, detailed and accurate, painterly style, dramatic lighting, educational reference quality', exampleInput: '豎滓虻譎ゆｻ｣縺ｮ譌･譛ｬ讖九・雉代ｏ縺・ },
  // Creative (14-26)
  { id: 'english-scene', num: '14', name: '闍ｱ莨夊ｩｱ縺ｮ蝣ｴ髱｢繧定ｦ冶ｦ壼喧', group: 'creative', description: '闍ｱ隱槫ｭｦ鄙偵・繧ｷ繝√Η繧ｨ繝ｼ繧ｷ繝ｧ繝ｳ逕ｻ蜒・, basePrompt: 'illustration of a scene: {input}, friendly cartoon style, diverse characters, warm colors, language learning context, clear situation', exampleInput: '繧ｫ繝輔ぉ縺ｧ豕ｨ譁・☆繧句ｴ髱｢' },
  { id: 'profile-arrange', num: '15', name: '繝励Ο繝輔ぅ繝ｼ繝ｫ逕ｻ蜒上・繧｢繝ｬ繝ｳ繧ｸ', group: 'creative', description: 'SNS繝励Ο繝輔ぅ繝ｼ繝ｫ逕ｻ蜒・, basePrompt: 'stylized portrait/avatar of {input}, social media profile picture style, centered composition, clean background, expressive, modern', exampleInput: '繝｡繧ｬ繝阪ｒ縺九￠縺溽賢縺ｮ繧｢繝舌ち繝ｼ' },
  { id: 'post-visual', num: '16', name: '謚慕ｨｿ縺ｮ繝薙ず繝･繧｢繝ｫ蠑ｷ蛹・, group: 'creative', description: 'SNS謚慕ｨｿ逕ｨ縺ｮ譏縺医ｋ逕ｻ蜒・, basePrompt: 'aesthetic social media post image of {input}, Instagram-worthy, beautiful composition, trending visual style, high quality', exampleInput: '譛昴・繧ｳ繝ｼ繝偵・縺ｨ繝弱・繝医ヱ繧ｽ繧ｳ繝ｳ' },
  { id: 'picture-diary', num: '17', name: '邨ｵ譌･險・, group: 'creative', description: '譌･險倬｢ｨ縺ｮ繧､繝ｩ繧ｹ繝・, basePrompt: 'cute illustrated diary entry showing {input}, watercolor sketch style, handwritten feel, warm nostalgic colors, storybook illustration', exampleInput: '蜈ｬ蝨偵〒繝斐け繝九ャ繧ｯ縺励◆譌･' },
  { id: 'novel-illust', num: '18', name: '蟆剰ｪｬ繧・す繝翫Μ繧ｪ縺ｮ謖ｿ邨ｵ', group: 'creative', description: '迚ｩ隱槭・繝ｯ繝ｳ繧ｷ繝ｼ繝ｳ繧呈緒蜀・, basePrompt: 'dramatic illustration of a scene from a story: {input}, cinematic composition, moody lighting, narrative atmosphere, book illustration quality', exampleInput: '螟懊・蟒・｢溘〒蜈峨ｋ蜑｣繧定ｦ九▽縺代ｋ蟆大･ｳ' },
  { id: 'composition-change', num: '19', name: '逕ｻ蜒上・讒句峙螟画峩', group: 'creative', description: '譌｢蟄俶ｧ句峙縺ｮ繝ｪ繝輔Ξ繝ｼ繝', basePrompt: '{input}, dynamic composition, rule of thirds, professional framing, balanced visual weight, artistic perspective', exampleInput: '譚ｱ莠ｬ繧ｿ繝ｯ繝ｼ繧定ｦ倶ｸ翫￡繧九い繝ｳ繧ｰ繝ｫ縲∝､墓坩繧梧凾' },
  { id: 'photo-to-illust', num: '20', name: '蜀咏悄繧偵う繝ｩ繧ｹ繝医↓螟画鋤', group: 'creative', description: '蜀咏悄鬚ｨ竊偵う繝ｩ繧ｹ繝磯｢ｨ縺ｫ', basePrompt: 'illustration style conversion of {input}, artistic interpretation, hand-drawn feel, stylized, colorful, anime/cartoon/watercolor aesthetic', exampleInput: '貂玖ｰｷ繧ｹ繧ｯ繝ｩ繝ｳ繝悶Ν莠､蟾ｮ轤ｹ縺ｮ鬚ｨ譎ｯ' },
  { id: 'illust-to-photo', num: '21', name: '繧､繝ｩ繧ｹ繝医ｒ繝ｪ繧｢繝ｫ縺ｪ蜀咏悄縺ｫ', group: 'creative', description: '繧､繝ｩ繧ｹ繝遺・螳溷・鬚ｨ縺ｫ螟画鋤', basePrompt: 'photorealistic version of {input}, hyperrealistic, natural lighting, real-world materials, detailed textures, DSLR photography quality', exampleInput: '繧｢繝九Γ鬚ｨ縺ｮ譽ｮ縺ｮ荳ｭ縺ｮ蟆上＆縺ｪ螳ｶ' },
  { id: 'character-create', num: '22', name: '繧ｭ繝｣繝ｩ繧ｯ繧ｿ繝ｼ縺ｮ菴懈・', group: 'creative', description: '繧ｪ繝ｪ繧ｸ繝翫Ν繧ｭ繝｣繝ｩ繝・じ繧､繝ｳ', basePrompt: 'character design sheet of {input}, full body, front view, multiple expressions, clean linework, consistent style, character concept art', exampleInput: '鬲疲ｳ穂ｽｿ縺・・蟆大ｹｴ縲・搨縺・ｸｽ蟄舌・≡濶ｲ縺ｮ逶ｮ' },
  { id: 'rough-to-lineart', num: '23', name: '謇区嶌縺阪Λ繝・竊・邱夂判貂・嶌', group: 'creative', description: '繝ｩ繝輔せ繧ｱ繝・メ繧呈ｸ・嶌', basePrompt: 'clean lineart illustration based on the concept of {input}, precise outlines, professional manga/comic style, black and white, detailed line drawing', exampleInput: '迪ｫ閠ｳ縺ｮ螂ｳ縺ｮ蟄舌′繧ｸ繝｣繝ｳ繝励＠縺ｦ縺・ｋ繝昴・繧ｺ' },
  { id: 'lineart-to-color', num: '24', name: '邱夂判 竊・逹蠖ｩ・・ユ繧ｯ繧ｹ繝√Ε', group: 'creative', description: '邱夂判縺ｫ繧ｫ繝ｩ繝ｼ繝ｪ繝ｳ繧ｰ', basePrompt: 'fully colored and textured illustration of {input}, vibrant color palette, detailed shading, rich textures, professional digital painting finish', exampleInput: '繝峨Λ繧ｴ繝ｳ縺ｮ邱夂判繧呈ｰｴ蠖ｩ鬚ｨ縺ｫ逹蠖ｩ' },
  { id: 'rough-to-genre', num: '25', name: '謇区嶌縺阪Λ繝・竊・繧ｸ繝｣繝ｳ繝ｫ螟画鋤', group: 'creative', description: '螟壹ず繝｣繝ｳ繝ｫ縺ｸ繧ｹ繧ｿ繧､繝ｫ螟画鋤', basePrompt: '{input}, reimagined in {style} style, artistic reinterpretation, genre transformation, professional quality', exampleInput: '邁｡蜊倥↑螳ｶ縺ｮ關ｽ譖ｸ縺阪ｒ繧ｵ繧､繝舌・繝代Φ繧ｯ鬚ｨ縺ｫ' },
  { id: 'line-stamp', num: '26', name: 'LINE繧ｹ繧ｿ繝ｳ繝鈴｢ｨ繧ｹ繧ｿ繝ｳ繝・, group: 'creative', description: '謖ｨ諡ｶ繧ｹ繧ｿ繝ｳ繝・遞ｮ繧ｻ繝・ヨ', basePrompt: 'LINE sticker set of {input}, 4 variations showing: greeting, thank you, goodbye, and OK reactions, cute kawaii style, bold outlines, transparent background, expressive, simple', exampleInput: '荳ｸ縺・區迪ｫ繧ｭ繝｣繝ｩ繧ｯ繧ｿ繝ｼ' },
]

const STYLES: StylePreset[] = [
  { id: 'photo', name: '蜀咏悄鬚ｨ', nameEn: 'photography', desc: '繝ｪ繧｢繝ｫ縺ｪ蜀咏悄縺ｮ繧医≧縺ｪ莉穂ｸ翫′繧・, modifiers: 'photorealistic, DSLR quality, natural lighting, high resolution' },
  { id: 'illustration', name: '繧､繝ｩ繧ｹ繝・, nameEn: 'illustration', desc: '繝・ず繧ｿ繝ｫ繧､繝ｩ繧ｹ繝磯｢ｨ', modifiers: 'digital illustration, clean lines, vibrant colors, professional artwork' },
  { id: 'watercolor', name: '豌ｴ蠖ｩ逕ｻ', nameEn: 'watercolor', desc: '騾乗・諢溘・縺ゅｋ豌ｴ蠖ｩ繧ｿ繝・メ', modifiers: 'watercolor painting, soft edges, transparent layers, artistic brushwork' },
  { id: 'anime', name: '繧｢繝九Γ鬚ｨ', nameEn: 'anime', desc: '譌･譛ｬ縺ｮ繧｢繝九Γ繧ｹ繧ｿ繧､繝ｫ', modifiers: 'anime style, cel shading, large expressive eyes, Japanese animation aesthetic' },
  { id: 'oil-painting', name: '豐ｹ邨ｵ', nameEn: 'oil painting', desc: '驥榊字諢溘・縺ゅｋ豐ｹ邨ｵ繧ｿ繝・メ', modifiers: 'oil painting, thick brushstrokes, rich textures, classical art style, canvas texture' },
  { id: '3d-render', name: '3D繝ｬ繝ｳ繝繝ｪ繝ｳ繧ｰ', nameEn: '3D render', desc: '3DCG縺ｮ雉ｪ諢・, modifiers: '3D render, Octane render, ray tracing, volumetric lighting, high poly' },
  { id: 'flat-design', name: '繝輔Λ繝・ヨ繝・じ繧､繝ｳ', nameEn: 'flat design', desc: '繝｢繝繝ｳ縺ｪ繝輔Λ繝・ヨ繧ｹ繧ｿ繧､繝ｫ', modifiers: 'flat design, minimal, geometric shapes, bold colors, clean vector art' },
  { id: 'pixel-art', name: '繝斐け繧ｻ繝ｫ繧｢繝ｼ繝・, nameEn: 'pixel art', desc: '繝ｬ繝医Ο縺ｪ繝峨ャ繝育ｵｵ', modifiers: 'pixel art, 16-bit style, retro game aesthetic, limited color palette' },
  { id: 'pencil-sketch', name: '驩帷ｭ・せ繧ｱ繝・メ', nameEn: 'pencil sketch', desc: '謇区緒縺埼｢ｨ縺ｮ驩帷ｭ・判', modifiers: 'pencil sketch, graphite drawing, fine hatching, realistic shading, paper texture' },
  { id: 'ukiyoe', name: '豬ｮ荳也ｵｵ', nameEn: 'ukiyo-e', desc: '譌･譛ｬ縺ｮ莨晉ｵｱ逧・惠迚育判', modifiers: 'ukiyo-e style, Japanese woodblock print, flat color blocks, bold outlines, traditional' },
  { id: 'cyberpunk', name: '繧ｵ繧､繝舌・繝代Φ繧ｯ', nameEn: 'cyberpunk', desc: '繝阪が繝ｳﾃ苓ｿ第悴譚･', modifiers: 'cyberpunk aesthetic, neon lights, dark atmosphere, futuristic, rain-soaked streets, holographic' },
  { id: 'ghibli', name: '繧ｸ繝悶Μ鬚ｨ', nameEn: 'Studio Ghibli', desc: '繧ｸ繝悶Μ逧・↑貂ｩ縺九＞荳也阜隕ｳ', modifiers: 'Studio Ghibli inspired, warm color palette, pastoral scenery, hand-painted background, whimsical' },
  { id: 'pop-art', name: '繝昴ャ繝励い繝ｼ繝・, nameEn: 'pop art', desc: '繧｢繝ｳ繝・ぅ繝ｻ繧ｦ繧ｩ繝ｼ繝帙Ν鬚ｨ', modifiers: 'pop art style, bold primary colors, Ben-Day dots, high contrast, comic book aesthetic' },
  { id: 'isometric', name: '繧｢繧､繧ｽ繝｡繝医Μ繝・け', nameEn: 'isometric', desc: '遲芽ｧ呈兜蠖ｱ縺ｮ遶倶ｽ灘峙隗｣', modifiers: 'isometric illustration, 3D perspective, clean lines, infographic style, detailed miniature' },
  { id: 'cinematic', name: '繧ｷ繝阪・繝・ぅ繝・け', nameEn: 'cinematic', desc: '譏逕ｻ縺ｮ繝ｯ繝ｳ繧ｷ繝ｼ繝ｳ鬚ｨ', modifiers: 'cinematic, anamorphic lens, dramatic lighting, movie still, film grain, shallow depth of field' },
]

const ANGLES: AnglePreset[] = [
  { name: '豁｣髱｢', nameEn: 'front view' },
  { name: '譁懊ａ45蠎ｦ', nameEn: '45-degree angle' },
  { name: '菫ｯ迸ｰ・井ｸ翫°繧会ｼ・, nameEn: 'bird\'s eye view, top-down' },
  { name: '縺ゅ♀繧奇ｼ井ｸ九°繧会ｼ・, nameEn: 'low angle, worm\'s eye view' },
  { name: '繧ｯ繝ｭ繝ｼ繧ｺ繧｢繝・・', nameEn: 'extreme close-up, macro' },
  { name: '蠎・ｧ偵ヱ繝弱Λ繝・, nameEn: 'wide-angle panoramic shot' },
  { name: '讓ｪ鬘・, nameEn: 'side profile view' },
  { name: '閭碁擇', nameEn: 'rear view, from behind' },
]

const LIGHTINGS: LightingPreset[] = [
  { name: '閾ｪ辟ｶ蜈・, nameEn: 'natural lighting, golden hour' },
  { name: '繧ｹ繧ｿ繧ｸ繧ｪ辣ｧ譏・, nameEn: 'studio lighting, softbox' },
  { name: '繝峨Λ繝槭メ繝・け', nameEn: 'dramatic lighting, chiaroscuro, high contrast' },
  { name: '繝阪が繝ｳ', nameEn: 'neon lighting, colorful glow, cyberpunk' },
  { name: '繝舌ャ繧ｯ繝ｩ繧､繝・, nameEn: 'backlit, silhouette, rim lighting' },
  { name: '螟墓坩繧・, nameEn: 'sunset lighting, warm orange tones, magic hour' },
  { name: '譛亥・', nameEn: 'moonlight, cool blue tones, night scene' },
  { name: '繝輔Λ繝・ヨ', nameEn: 'flat lighting, even illumination, no shadows' },
]

const QUALITY_TAGS = [
  'masterpiece', 'best quality', 'ultra detailed', '8K', 'HDR',
  'high resolution', 'sharp focus', 'professional', 'award-winning',
]

const ASPECT_RATIOS = [
  { label: '1:1 (豁｣譁ｹ蠖｢)', value: '1:1' },
  { label: '16:9 (讓ｪ髟ｷ)', value: '16:9' },
  { label: '9:16 (邵ｦ髟ｷ)', value: '9:16' },
  { label: '4:3 (繧ｹ繧ｿ繝ｳ繝繝ｼ繝・', value: '4:3' },
  { label: '3:2 (蜀咏悄)', value: '3:2' },
  { label: '2:3 (繝昴・繝医Ξ繝ｼ繝・', value: '2:3' },
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
      category: '謾ｹ蝟・,
      input: original.slice(0, 50) + '...',
      prompt: improved,
      style: '謾ｹ蝟・,
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
              <span className="text-2xl">耳</span>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                AI逕ｻ蜒上・繝ｭ繝ｳ繝励ヨ繝槭せ繧ｿ繝ｼ
              </h1>
            </div>
            <div className="text-xs text-white/40">26繧ｫ繝・ざ繝ｪ蟇ｾ蠢・/div>
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
              <h2 className="text-xl font-bold">耳 繝励Ο繝ｳ繝励ヨ逕滓・</h2>
              <p className="text-sm text-white/50">繧ｫ繝・ざ繝ｪ繧帝∈繧薙〒譌･譛ｬ隱槭〒蜈･蜉・竊・譛驕ｩ縺ｪ繝励Ο繝ｳ繝励ヨ繧定・蜍慕函謌・/p>
            </div>

            {/* Category filter */}
            <div className="flex gap-2">
              {[
                { id: 'all' as const, label: '縺吶∋縺ｦ' },
                { id: 'business' as const, label: '直 繝薙ず繝阪せ' },
                { id: 'creative' as const, label: '耳 繧ｯ繝ｪ繧ｨ繧､繝・ぅ繝・ },
              ].map(f => (
                <button key={f.id} onClick={() => setCatFilter(f.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${catFilter === f.id ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Category select - grid cards */}
            <div>
              <label className="text-xs text-white/50 mb-2 block">繧ｫ繝・ざ繝ｪ・・filteredCategories.length}遞ｮ・・/label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[280px] overflow-y-auto pr-1 scrollbar-hide">
                {filteredCategories.map(c => (
                  <button key={c.id} onClick={() => setSelectedCatId(c.id)} className={`text-left p-2.5 rounded-xl text-xs transition-all border ${selectedCatId === c.id ? 'bg-purple-500/20 border-purple-500/40 text-white' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/10'}`}>
                    <span className={`font-mono font-bold ${selectedCatId === c.id ? 'text-purple-400' : 'text-white/30'}`}>{c.num}</span>
                    <div className="font-medium mt-0.5 leading-tight">{c.name}</div>
                  </button>
                ))}
              </div>
              <div className="text-xs text-purple-400/70 mt-2">驕ｸ謚樔ｸｭ: <span className="text-white/80">{selectedCat.num}. {selectedCat.name}</span> 窶・{selectedCat.description}</div>
            </div>

            {/* User input */}
            <div>
              <label className="text-xs text-white/50 mb-1 block">菴懊ｊ縺溘＞逕ｻ蜒上・蜀・ｮｹ・域律譛ｬ隱橸ｼ・/label>
              <textarea value={userInput} onChange={e => setUserInput(e.target.value)} placeholder={selectedCat.exampleInput} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
            </div>

            {/* Style */}
            <div>
              <label className="text-xs text-white/50 mb-1 block">繧ｹ繧ｿ繧､繝ｫ</label>
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
              <label className="text-xs text-white/50 mb-1 block">逕ｻ隗抵ｼ井ｻｻ諢擾ｼ・/label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setSelectedAngleIdx(-1)} className={`px-2.5 py-1.5 rounded-lg text-xs transition-all ${selectedAngleIdx === -1 ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-white/5 text-white/50'}`}>謖・ｮ壹↑縺・/button>
                {ANGLES.map((a, i) => (
                  <button key={i} onClick={() => setSelectedAngleIdx(i)} className={`px-2.5 py-1.5 rounded-lg text-xs transition-all ${selectedAngleIdx === i ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-white/5 text-white/50'}`}>{a.name}</button>
                ))}
              </div>
            </div>

            {/* Lighting */}
            <div>
              <label className="text-xs text-white/50 mb-1 block">繝ｩ繧､繝・ぅ繝ｳ繧ｰ・井ｻｻ諢擾ｼ・/label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setSelectedLightIdx(-1)} className={`px-2.5 py-1.5 rounded-lg text-xs transition-all ${selectedLightIdx === -1 ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-white/5 text-white/50'}`}>謖・ｮ壹↑縺・/button>
                {LIGHTINGS.map((l, i) => (
                  <button key={i} onClick={() => setSelectedLightIdx(i)} className={`px-2.5 py-1.5 rounded-lg text-xs transition-all ${selectedLightIdx === i ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-white/5 text-white/50'}`}>{l.name}</button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div>
              <label className="text-xs text-white/50 mb-1 block">蜩∬ｳｪ繧ｿ繧ｰ</label>
              <div className="flex flex-wrap gap-2">
                {QUALITY_TAGS.map(q => (
                  <button key={q} onClick={() => setSelectedQuality(prev => prev.includes(q) ? prev.filter(p => p !== q) : [...prev, q])} className={`px-2.5 py-1.5 rounded-lg text-xs transition-all ${selectedQuality.includes(q) ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-white/5 text-white/50'}`}>{q}</button>
                ))}
              </div>
            </div>

            {/* Aspect ratio */}
            <div>
              <label className="text-xs text-white/50 mb-1 block">繧｢繧ｹ繝壹け繝域ｯ・/label>
              <div className="flex flex-wrap gap-2">
                {ASPECT_RATIOS.map(ar => (
                  <button key={ar.value} onClick={() => setAspectRatio(ar.value)} className={`px-2.5 py-1.5 rounded-lg text-xs transition-all ${aspectRatio === ar.value ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-white/5 text-white/50'}`}>{ar.label}</button>
                ))}
              </div>
            </div>

            {/* Negative prompt */}
            <div>
              <label className="text-xs text-white/50 mb-1 block">繝阪ぎ繝・ぅ繝悶・繝ｭ繝ｳ繝励ヨ</label>
              <textarea value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
            </div>

            {/* Generate button */}
            <button onClick={handleGenerate} disabled={!userInput.trim()} className="w-full py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-30 transition-opacity">
              笨ｨ 繝励Ο繝ｳ繝励ヨ繧堤函謌・            </button>

            {/* Result */}
            {generatedPrompt && (
              <div className="bg-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-purple-400">逕滓・縺輔ｌ縺溘・繝ｭ繝ｳ繝励ヨ</h3>
                  <button onClick={() => handleCopy(generatedPrompt)} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs hover:bg-purple-500/30">{copied ? '笨・繧ｳ繝斐・貂医∩' : '搭 繧ｳ繝斐・'}</button>
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
              <h2 className="text-xl font-bold">答 繧ｫ繝・ざ繝ｪ蛻･繝・Φ繝励Ξ繝ｼ繝・/h2>
              <p className="text-sm text-white/50">26繧ｫ繝・ざ繝ｪ縺ｮ繝励Μ繧ｻ繝・ヨ縲ゅち繝・・縺ｧ驕ｩ逕ｨ</p>
            </div>

            <div className="flex gap-2">
              {[
                { id: 'all' as const, label: '縺吶∋縺ｦ (26)' },
                { id: 'business' as const, label: '直 繝薙ず繝阪せ (13)' },
                { id: 'creative' as const, label: '耳 繧ｯ繝ｪ繧ｨ繧､繝・ぅ繝・(13)' },
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
                      <div className="text-xs text-white/30 mt-1">萓・ {c.exampleInput}</div>
                    </div>
                    <button onClick={() => { setSelectedCatId(c.id); setUserInput(c.exampleInput); setTab('generate') }} className="shrink-0 ml-3 px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-xs hover:bg-purple-500/30">菴ｿ縺・/button>
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
              <h2 className="text-xl font-bold">肌 繝代Λ繝｡繝ｼ繧ｿ霎槫・</h2>
              <p className="text-sm text-white/50">繧ｹ繧ｿ繧､繝ｫ繝ｻ逕ｻ隗偵・繝ｩ繧､繝・ぅ繝ｳ繧ｰ繝ｻ蜩∬ｳｪ縺ｮ闍ｱ隱槭く繝ｼ繝ｯ繝ｼ繝蛾寔</p>
            </div>

            <div className="flex gap-2">
              {[
                { id: 'style' as const, label: '耳 繧ｹ繧ｿ繧､繝ｫ', count: STYLES.length },
                { id: 'angle' as const, label: '盗 逕ｻ隗・, count: ANGLES.length },
                { id: 'lighting' as const, label: '庁 繝ｩ繧､繝・ぅ繝ｳ繧ｰ', count: LIGHTINGS.length },
                { id: 'quality' as const, label: '笨ｨ 蜩∬ｳｪ', count: QUALITY_TAGS.length },
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
                      <button onClick={() => handleCopy(s.modifiers)} className="text-xs text-purple-400 hover:text-purple-300 px-2">搭</button>
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
                    <button onClick={() => handleCopy(a.nameEn)} className="text-xs text-purple-400 hover:text-purple-300 px-2">搭</button>
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
                    <button onClick={() => handleCopy(l.nameEn)} className="text-xs text-purple-400 hover:text-purple-300 px-2">搭</button>
                  </div>
                ))}
              </div>
            )}

            {paramSection === 'quality' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {QUALITY_TAGS.map(q => (
                  <div key={q} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="text-sm text-green-400 font-mono">{q}</div>
                    <button onClick={() => handleCopy(q)} className="text-xs text-purple-400 hover:text-purple-300 px-2">搭</button>
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
              <h2 className="text-xl font-bold">笨ｨ 繝励Ο繝ｳ繝励ヨ謾ｹ蝟БI</h2>
              <p className="text-sm text-white/50">譌｢蟄倥・繝励Ο繝ｳ繝励ヨ繧定ｲｼ繧贋ｻ倥￠縺ｦ蜩∬ｳｪ繧｢繝・・</p>
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1 block">謾ｹ蝟・＠縺溘＞繝励Ο繝ｳ繝励ヨ繧定ｲｼ繧贋ｻ倥￠</label>
              <textarea value={improveInput} onChange={e => setImproveInput(e.target.value)} placeholder="萓・ a cat sitting on a chair" rows={5} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono" />
            </div>

            <button onClick={handleImprove} disabled={!improveInput.trim()} className="w-full py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-30 transition-opacity">
              笨ｨ 繝励Ο繝ｳ繝励ヨ繧呈隼蝟・            </button>

            {improvedResult && (
              <div className="space-y-3">
                <div className="bg-white/5 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-green-400">謾ｹ蝟・ｾ後・繝励Ο繝ｳ繝励ヨ</h3>
                    <button onClick={() => handleCopy(improvedResult)} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30">{copied ? '笨・繧ｳ繝斐・貂医∩' : '搭 繧ｳ繝斐・'}</button>
                  </div>
                  <pre className="text-sm text-white/80 whitespace-pre-wrap break-all bg-black/30 rounded-lg p-4 font-mono">{improvedResult}</pre>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-purple-400 mb-2">庁 謾ｹ蝟・・繧､繝ｳ繝・/h3>
                  <ul className="text-xs text-white/60 space-y-1">
                    <li>窶｢ 蜩∬ｳｪ繧ｿ繧ｰ繧定ｿｽ蜉縺励※繝・ぅ繝・・繝ｫ繧貞髄荳・/li>
                    <li>窶｢ 繝ｩ繧､繝・ぅ繝ｳ繧ｰ謖・ｮ壹〒髮ｰ蝗ｲ豌励ｒ螳牙ｮ壼喧</li>
                    <li>窶｢ 繝阪ぎ繝・ぅ繝悶・繝ｭ繝ｳ繝励ヨ縺ｧ荳崎ｦ√↑隕∫ｴ繧呈賜髯､</li>
                    <li>窶｢ 繧医ｊ蜈ｷ菴鍋噪縺ｪ菫ｮ鬟ｾ隱槭〒諢丞峙繧呈・遒ｺ蛹・/li>
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
                <h2 className="text-xl font-bold">搭 螻･豁ｴ・・♀豌励↓蜈･繧・/h2>
                <p className="text-sm text-white/50">逕滓・縺励◆繝励Ο繝ｳ繝励ヨ縺ｮ荳隕ｧ・・history.length}莉ｶ・・/p>
              </div>
              {history.length > 0 && (
                <button onClick={() => { if (confirm('螻･豁ｴ繧偵☆縺ｹ縺ｦ蜑企勁縺励∪縺吶°・・)) saveHistory([]) }} className="text-xs text-red-400 hover:text-red-300 px-2">蜈ｨ蜑企勁</button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-12 text-center text-white/40">
                <p className="text-4xl mb-3">搭</p>
                <p className="text-sm">縺ｾ縺螻･豁ｴ縺後≠繧翫∪縺帙ｓ</p>
                <p className="text-xs mt-1">繝励Ο繝ｳ繝励ヨ繧堤函謌舌☆繧九→閾ｪ蜍輔〒菫晏ｭ倥＆繧後∪縺・/p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map(h => (
                  <div key={h.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => saveHistory(history.map(r => r.id === h.id ? { ...r, favorite: !r.favorite } : r))} className="text-lg">{h.favorite ? '箝・ : '笘・}</button>
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">{h.category}</span>
                        {h.style && <span className="text-xs text-white/30">{h.style}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/30">{new Date(h.timestamp).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        <button onClick={() => handleCopy(h.prompt)} className="text-xs text-purple-400 hover:text-purple-300">搭</button>
                        <button onClick={() => saveHistory(history.filter(r => r.id !== h.id))} className="text-xs text-red-400 hover:text-red-300">卵</button>
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
              <h2 className="text-xl font-bold">当 蟄ｦ鄙偵ぎ繧､繝・/h2>
              <p className="text-sm text-white/50">繝励Ο繝ｳ繝励ヨ縺ｮ蝓ｺ譛ｬ縺九ｉ蠢懃畑縺ｾ縺ｧ</p>
            </div>

            {/* Basic Structure */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm text-purple-400 mb-3">女・・繝励Ο繝ｳ繝励ヨ縺ｮ蝓ｺ譛ｬ讒矩</h3>
              <div className="bg-black/30 rounded-lg p-4 text-sm font-mono text-white/70 mb-3">
                <div className="text-green-400">[陲ｫ蜀吩ｽ・繝｡繧､繝ｳ縺ｮ蜀・ｮｹ],</div>
                <div className="text-blue-400">[繧ｹ繧ｿ繧､繝ｫ/逕ｻ鬚ｨ],</div>
                <div className="text-yellow-400">[讒句峙/逕ｻ隗綻,</div>
                <div className="text-orange-400">[繝ｩ繧､繝・ぅ繝ｳ繧ｰ/髮ｰ蝗ｲ豌余,</div>
                <div className="text-pink-400">[蜩∬ｳｪ繧ｿ繧ｰ]</div>
              </div>
              <div className="text-xs text-white/50">
                萓・ <span className="text-white/70 font-mono">a Japanese garden in autumn, watercolor painting, wide angle, soft golden hour lighting, masterpiece, best quality, 8K</span>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm text-green-400 mb-3">笨・蜉ｹ譫懃噪縺ｪTips</h3>
              <div className="space-y-2 text-sm text-white/60">
                <div>窶｢ <strong className="text-white/80">蜈ｷ菴鍋噪縺ｫ譖ｸ縺・/strong> 窶・縲瑚干縲坂・縲梧ｺ髢九・譯懊・譛ｨ縲∬干縺ｳ繧峨′鬚ｨ縺ｫ闊槭≧縲・/div>
                <div>窶｢ <strong className="text-white/80">蠖｢螳ｹ隧槭ｒ驥阪・繧・/strong> 窶・濶ｲ縲∬ｳｪ諢溘・峅蝗ｲ豌励ｒ霑ｽ蜉</div>
                <div>窶｢ <strong className="text-white/80">蜿り・い繝ｼ繝・ぅ繧ｹ繝・/strong> 窶・縲景n the style of [artist]縲阪〒繝・う繧ｹ繝域欠螳・/div>
                <div>窶｢ <strong className="text-white/80">繝阪ぎ繝・ぅ繝悶・繝ｭ繝ｳ繝励ヨ</strong> 窶・荳崎ｦ√↑隕∫ｴ繧呈・遉ｺ逧・↓謗帝勁</div>
                <div>窶｢ <strong className="text-white/80">繧ｫ繝ｳ繝槭〒蛹ｺ蛻・ｋ</strong> 窶・蜷・ｦ∫ｴ縺ｯ繧ｫ繝ｳ繝槭〒譏守｢ｺ縺ｫ蛻・屬</div>
                <div>窶｢ <strong className="text-white/80">驥崎ｦ√↑繧ゅ・繧貞・縺ｫ</strong> 窶・蜈磯ｭ縺ｮ隱槫唱縺ｻ縺ｩ蠖ｱ髻ｿ縺悟ｼｷ縺・/div>
              </div>
            </div>

            {/* NG */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm text-red-400 mb-3">笶・繧医￥縺ゅｋNG</h3>
              <div className="space-y-2 text-sm text-white/60">
                <div>窶｢ <span className="text-red-400 line-through">beautiful picture</span> 竊・<span className="text-green-400">蜈ｷ菴鍋噪縺ｪ繧ｹ繧ｿ繧､繝ｫ繧呈欠螳・/span></div>
                <div>窶｢ <span className="text-red-400 line-through">make it look good</span> 竊・<span className="text-green-400">蜩∬ｳｪ繧ｿ繧ｰ繧剃ｽｿ逕ｨ</span></div>
                <div>窶｢ <span className="text-red-400 line-through">譌･譛ｬ隱槭・縺ｾ縺ｾ髟ｷ譁・/span> 竊・<span className="text-green-400">闍ｱ隱槭く繝ｼ繝ｯ繝ｼ繝峨・邨・∩蜷医ｏ縺・/span></div>
                <div>窶｢ <span className="text-red-400 line-through">遏帷崟縺吶ｋ謖・､ｺ</span> 竊・<span className="text-green-400">1縺､縺ｮ譁ｹ蜷第ｧ縺ｫ邨ｱ荳</span></div>
                <div>窶｢ <span className="text-red-400 line-through">縲後懊＠縺ｪ縺・〒縲・/span> 竊・<span className="text-green-400">繝阪ぎ繝・ぅ繝悶・繝ｭ繝ｳ繝励ヨ縺ｫ蜈･繧後ｋ</span></div>
              </div>
            </div>

            {/* Model-specific tips */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm text-blue-400 mb-3">､・繝｢繝・Ν蛻･Tips</h3>
              <div className="space-y-3">
                {[
                  { name: 'Midjourney', tips: '--ar 縺ｧ豈皮紫謖・ｮ・ --v 6 縺ｧ譛譁ｰ迚・ --s 縺ｧ讒伜ｼ丞喧蠎ｦ, --q 縺ｧ蜩∬ｳｪ' },
                  { name: 'DALL-E 3', tips: '閾ｪ辟ｶ險隱槭〒隧ｳ縺励￥譖ｸ縺上⊇縺ｩ濶ｯ縺・ｵ先棡縲ゅロ繧ｬ繝・ぅ繝悶・繝ｭ繝ｳ繝励ヨ髱槫ｯｾ蠢・ },
                  { name: 'Stable Diffusion', tips: 'LoRA/繝｢繝・Ν謖・ｮ壼庄閭ｽ縲ゅロ繧ｬ繝・ぅ繝悶・繝ｭ繝ｳ繝励ヨ驥崎ｦ√・FG Scale隱ｿ謨ｴ' },
                  { name: 'Flux', tips: '鬮伜刀雉ｪ縺ｪ閾ｪ辟ｶ險隱樒炊隗｣縲る聞譁・・繝ｭ繝ｳ繝励ヨ縺ｫ蠑ｷ縺・ },
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
              <h3 className="font-bold text-sm text-yellow-400 mb-3">当 繧医￥菴ｿ縺・恭隱櫁｡ｨ迴ｾ</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ['鬮伜刀雉ｪ', 'high quality, masterpiece'],
                  ['邏ｰ驛ｨ縺ｾ縺ｧ', 'highly detailed, intricate'],
                  ['譏逕ｻ逧・, 'cinematic, dramatic'],
                  ['譟斐ｉ縺九＞', 'soft, gentle, ethereal'],
                  ['蜉帛ｼｷ縺・, 'bold, powerful, dynamic'],
                  ['繝溘ル繝槭Ν', 'minimalist, clean, simple'],
                  ['繝ｬ繝医Ο', 'vintage, retro, nostalgic'],
                  ['蟷ｻ諠ｳ逧・, 'fantasy, magical, mystical'],
                  ['譛ｪ譚･逧・, 'futuristic, sci-fi, modern'],
                  ['閾ｪ辟ｶ縺ｪ', 'natural, organic, earthy'],
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
          窶ｻ 逕滓・縺輔ｌ縺溘・繝ｭ繝ｳ繝励ヨ縺ｯ縺吶∋縺ｦ繝悶Λ繧ｦ繧ｶ蜀・〒蜃ｦ逅・＆繧後∪縺吶ゅし繝ｼ繝舌・縺ｸ縺ｮ繝・・繧ｿ騾∽ｿ｡縺ｯ縺ゅｊ縺ｾ縺帙ｓ縲・        </p>
      </div>
    
      </div>
  )
}




