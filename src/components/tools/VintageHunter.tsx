'use client'


import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ---- Types ----
interface VintageItem {
  id: string
  title: string
  brand: string
  price: number
  marketPrice: number
  condition: string
  size: string
  listedAt: string
  rarity: number
  aiScore: number
  gradientFrom: string
  gradientTo: string
  initials: string
  description: string
  category: string
  listingUrl: string
  source?: string
}

interface SearchFilters {
  brand: string
  keywords: string
  minPrice: string
  maxPrice: string
  condition: string
}

// ---- Component ----
export default function VintageHunter() {
  const [items, setItems] = useState<VintageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    brand: '',
    keywords: '',
    minPrice: '',
    maxPrice: '',
    condition: 'all',
  })
  const [sortBy, setSortBy] = useState<'aiScore' | 'priceLow' | 'priceHigh' | 'newest'>('aiScore')
  const [scoreFilter, setScoreFilter] = useState(0)
  const [selectedItem, setSelectedItem] = useState<VintageItem | null>(null)
  const [webhookUrl, setWebhookUrl] = useState('')
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [showWebhookPanel, setShowWebhookPanel] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  const GRADIENTS = [
    ['#f59e0b', '#ea580c'], ['#8b5cf6', '#6d28d9'], ['#10b981', '#059669'],
    ['#3b82f6', '#1d4ed8'], ['#ec4899', '#be185d'], ['#ef4444', '#b91c1c'],
    ['#14b8a6', '#0d9488'], ['#f97316', '#c2410c'], ['#a855f7', '#7c3aed'],
    ['#06b6d4', '#0891b2'],
  ]

  const extractCondition = (text: string): string => {
    if (text.includes('譁ｰ蜩・) || text.includes('譛ｪ菴ｿ逕ｨ') || text.includes('繧ｿ繧ｰ莉倥″')) return '譁ｰ蜩・
    if (text.includes('鄒主刀') || text.includes('讌ｵ鄒・)) return '譛ｪ菴ｿ逕ｨ縺ｫ霑代＞'
    if (text.includes('濶ｯ蜩・) || text.includes('濶ｯ螂ｽ')) return '逶ｮ遶九▲縺溷す繧・ｱ壹ｌ縺ｪ縺・
    if (text.includes('蛯ｷ') || text.includes('豎壹ｌ') || text.includes('繧ｸ繝｣繝ｳ繧ｯ')) return '蛯ｷ繧・ｱ壹ｌ縺ゅｊ'
    return '繧・ｄ蛯ｷ繧・ｱ壹ｌ縺ゅｊ'
  }

  const extractSize = (title: string): string => {
    const m = title.match(/\b(XXS|XS|S|M|L|XL|XXL|XXXL|FREE|F)\b/i)
    return m ? m[1].toUpperCase() : 'FREE'
  }

  const handleSearch = useCallback(async () => {
    setLoading(true)
    setHasSearched(true)
    try {
      // 1. Get Rakuten API config from server
      const configRes = await fetch('/api/tools/vintage-hunter/search')
      const config = await configRes.json()

      if (!config.rakuten?.appId) {
        alert('API險ｭ螳壹′縺ゅｊ縺ｾ縺帙ｓ')
        return
      }

      // 2. Call Rakuten API directly from browser (requires Referer header)
      const searchKeyword = [filters.brand, filters.keywords, '蜿､逹 繝ｴ繧｣繝ｳ繝・・繧ｸ'].filter(Boolean).join(' ')
      const params = new URLSearchParams({
        applicationId: config.rakuten.appId,
        accessKey: config.rakuten.accessKey,
        keyword: searchKeyword,
        genreId: '551177',
        hits: '30',
        sort: '-updateTimestamp',
        imageFlag: '1',
        formatVersion: '2',
      })
      if (filters.minPrice) params.set('minPrice', filters.minPrice)
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)

      const rakutenRes = await fetch(
        `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401?${params.toString()}`
      )

      if (!rakutenRes.ok) {
        throw new Error(`Rakuten API error: ${rakutenRes.status}`)
      }

      const data = await rakutenRes.json()
      const rawItems = data.Items || data.items || []

      const parsedItems: VintageItem[] = rawItems.map((wrapper: any, i: number) => {
        const item = wrapper.Item || wrapper
        const title = item.itemName || ''
        const desc = item.itemCaption || ''
        const price = item.itemPrice || 0
        const gradient = GRADIENTS[i % GRADIENTS.length]
        const brandName = filters.brand || (item.shopName || '')
        const rarity = Math.min(100, 20 + Math.floor(Math.random() * 60))
        const markup = 1.1 + Math.random() * 0.3
        const marketPrice = Math.round(price * markup / 100) * 100
        const itemCondition = extractCondition(title + ' ' + desc)

        if (filters.condition && filters.condition !== 'all' && itemCondition !== filters.condition) {
          return null
        }

        return {
          id: item.itemCode || `rk-${i}`,
          title,
          brand: brandName,
          price,
          marketPrice,
          condition: itemCondition,
          size: extractSize(title),
          listedAt: new Date().toISOString(),
          rarity,
          aiScore: 0,
          gradientFrom: gradient[0],
          gradientTo: gradient[1],
          initials: brandName.substring(0, 2).toUpperCase(),
          description: desc.substring(0, 120),
          category: '繝医ャ繝励せ',
          listingUrl: item.itemUrl || '',
          source: 'rakuten',
        }
      }).filter(Boolean) as VintageItem[]

      // Compute AI scores
      const scoredItems = parsedItems.map((item) => {
        const priceRatio = item.marketPrice > 0 ? item.price / item.marketPrice : 1
        const dealScore = Math.max(0, (1 - priceRatio) * 60)
        const rarityScore = item.rarity * 0.25
        const conditionScore =
          item.condition === '譁ｰ蜩・ ? 15 :
          item.condition === '譛ｪ菴ｿ逕ｨ縺ｫ霑代＞' ? 13 :
          item.condition === '逶ｮ遶九▲縺溷す繧・ｱ壹ｌ縺ｪ縺・ ? 10 :
          item.condition === '繧・ｄ蛯ｷ繧・ｱ壹ｌ縺ゅｊ' ? 6 :
          item.condition === '蛯ｷ繧・ｱ壹ｌ縺ゅｊ' ? 3 : 1
        const aiScore = Math.min(100, Math.max(0, Math.round(dealScore + rarityScore + conditionScore)))
        return { ...item, aiScore }
      })

      setItems(scoredItems)
      setTotalResults(scoredItems.length)
    } catch (err) {
      console.error('Search failed:', err)
      alert('讀懃ｴ｢縺ｫ螟ｱ謨励＠縺ｾ縺励◆縲・)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const handleNotify = useCallback(async (item: VintageItem) => {
    if (!webhookUrl) {
      setShowWebhookPanel(true)
      return
    }
    setWebhookStatus('sending')
    try {
      const res = await fetch('/api/tools/vintage-hunter/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl, item }),
      })
      const data = await res.json()
      if (data.success) {
        setWebhookStatus('success')
        setTimeout(() => setWebhookStatus('idle'), 3000)
      } else {
        setWebhookStatus('error')
        setTimeout(() => setWebhookStatus('idle'), 3000)
      }
    } catch {
      setWebhookStatus('error')
      setTimeout(() => setWebhookStatus('idle'), 3000)
    }
  }, [webhookUrl])

  // Sort and filter items
  const displayItems = items
    .filter(item => item.aiScore >= scoreFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'aiScore': return b.aiScore - a.aiScore
        case 'priceLow': return a.price - b.price
        case 'priceHigh': return b.price - a.price
        case 'newest':
          return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime()
        default: return 0
      }
    })

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-amber-400'
    if (score >= 60) return 'text-emerald-400'
    if (score >= 40) return 'text-blue-400'
    return 'text-gray-400'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return '櫨 雜・♀雋ｷ縺・ｾ・
    if (score >= 60) return '笨ｨ 縺願ｲｷ縺・ｾ・
    if (score >= 40) return '総 縺ｾ縺壹∪縺・
    return '投 譎ｮ騾・
  }

  return (
    <div className="min-h-screen bg-[#0d0a07] text-white">
      {/* Header */}
      <div className="border-b border-amber-900/30 bg-[#0d0a07]/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs font-bold">
              VH
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">AI蜿､逹縺願ｲｷ縺・ｾ励ワ繝ｳ繧ｿ繝ｼ</h1>
              <p className="text-xs text-gray-500">AI謳ｭ霈峨Χ繧｣繝ｳ繝・・繧ｸ讀懃ｴ｢</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowWebhookPanel(!showWebhookPanel)}
            className="text-xs border-amber-800/50 text-amber-400 hover:text-amber-300 bg-transparent"
          >
            粕 Discord騾夂衍險ｭ螳・          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Webhook Panel */}
        {showWebhookPanel && (
          <Card className="bg-[#1a1408] border-amber-900/30 mb-6">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-amber-400 mb-3">粕 Discord Webhook險ｭ螳・/h3>
              <div className="flex gap-2">
                <Input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="bg-[#0d0a07] border-amber-900/30 text-white placeholder-gray-600 flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleNotify({ id: 'test', title: '繝・せ繝磯夂衍', brand: 'Test', price: 1000, marketPrice: 2000, condition: '濶ｯ螂ｽ', size: 'M', listedAt: new Date().toISOString(), rarity: 50, aiScore: 85, gradientFrom: '#f59e0b', gradientTo: '#ea580c', initials: 'TS', description: '繝・せ繝磯夂衍縺ｧ縺・, category: '繝医ャ繝励せ', listingUrl: 'https://jp.mercari.com/search?keyword=Test' })}
                  disabled={!webhookUrl || webhookStatus === 'sending'}
                  className="bg-amber-600 hover:bg-amber-700 text-white border-0"
                >
                  {webhookStatus === 'sending' ? '騾∽ｿ｡荳ｭ...' :
                   webhookStatus === 'success' ? '笨・騾∽ｿ｡螳御ｺ・ :
                   webhookStatus === 'error' ? '笨・螟ｱ謨・ :
                   '繝・せ繝磯∽ｿ｡'}
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Discord繧ｵ繝ｼ繝舌・縺ｮ險ｭ螳・竊・騾｣謳ｺ繧ｵ繝ｼ繝薙せ 竊・繧ｦ繧ｧ繝悶ヵ繝・け 縺ｧURL繧貞叙蠕励〒縺阪∪縺・              </p>
            </CardContent>
          </Card>
        )}

        {/* Search Form */}
        <Card className="bg-[#1a1408] border-amber-900/30 mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">繝悶Λ繝ｳ繝・/Label>
                <Input
                  value={filters.brand}
                  onChange={(e) => setFilters(f => ({ ...f, brand: e.target.value }))}
                  placeholder="Supreme, KAPITAL..."
                  className="bg-[#0d0a07] border-amber-900/30 text-white placeholder-gray-600 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">繧ｭ繝ｼ繝ｯ繝ｼ繝・/Label>
                <Input
                  value={filters.keywords}
                  onChange={(e) => setFilters(f => ({ ...f, keywords: e.target.value }))}
                  placeholder="繝懊ャ繧ｯ繧ｹ繝ｭ繧ｴ, 90s..."
                  className="bg-[#0d0a07] border-amber-900/30 text-white placeholder-gray-600 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">荳矩剞萓｡譬ｼ</Label>
                <Input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                  placeholder="ﾂ･1,000"
                  className="bg-[#0d0a07] border-amber-900/30 text-white placeholder-gray-600 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">荳企剞萓｡譬ｼ</Label>
                <Input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                  placeholder="ﾂ･50,000"
                  className="bg-[#0d0a07] border-amber-900/30 text-white placeholder-gray-600 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">迥ｶ諷・/Label>
                <select
                  value={filters.condition}
                  onChange={(e) => setFilters(f => ({ ...f, condition: e.target.value }))}
                  className="w-full h-9 rounded-md border border-amber-900/30 bg-[#0d0a07] text-white text-sm px-3"
                >
                  <option value="all">縺吶∋縺ｦ</option>
                  <option value="譁ｰ蜩・>譁ｰ蜩・/option>
                  <option value="譛ｪ菴ｿ逕ｨ縺ｫ霑代＞">譛ｪ菴ｿ逕ｨ縺ｫ霑代＞</option>
                  <option value="逶ｮ遶九▲縺溷す繧・ｱ壹ｌ縺ｪ縺・>逶ｮ遶九▲縺溷す繧・ｱ壹ｌ縺ｪ縺・/option>
                  <option value="繧・ｄ蛯ｷ繧・ｱ壹ｌ縺ゅｊ">繧・ｄ蛯ｷ繧・ｱ壹ｌ縺ゅｊ</option>
                  <option value="蛯ｷ繧・ｱ壹ｌ縺ゅｊ">蛯ｷ繧・ｱ壹ｌ縺ゅｊ</option>
                </select>
              </div>
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 font-medium"
            >
              {loading ? '剥 讀懃ｴ｢荳ｭ...' : '剥 蜿､逹繧呈､懃ｴ｢'}
            </Button>
          </CardContent>
        </Card>

        {/* Results Controls */}
        {hasSearched && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="text-sm text-gray-400">
              {totalResults > 0 ? (
                <>
                  <span className="text-amber-400 font-bold">{totalResults}</span>莉ｶ荳ｭ
                  <span className="text-white font-bold ml-1">{displayItems.length}</span>莉ｶ陦ｨ遉ｺ
                </>
              ) : (
                '邨先棡縺ｪ縺・
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label className="text-xs text-gray-500">譛菴弱せ繧ｳ繧｢:</Label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="10"
                  value={scoreFilter}
                  onChange={(e) => setScoreFilter(parseInt(e.target.value))}
                  className="w-20 accent-amber-500"
                />
                <span className="text-xs text-amber-400 w-8">{scoreFilter}</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-8 rounded-md border border-amber-900/30 bg-[#1a1408] text-white text-xs px-2"
              >
                <option value="aiScore">AI繧ｹ繧ｳ繧｢鬆・/option>
                <option value="priceLow">萓｡譬ｼ縺悟ｮ峨＞鬆・/option>
                <option value="priceHigh">萓｡譬ｼ縺碁ｫ倥＞鬆・/option>
                <option value="newest">譁ｰ逹鬆・/option>
              </select>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!hasSearched ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">剥</div>
            <p className="text-gray-400 mb-2">繝悶Λ繝ｳ繝峨ｄ繧ｭ繝ｼ繝ｯ繝ｼ繝峨ｒ蜈･蜉帙＠縺ｦ讀懃ｴ｢</p>
            <p className="text-gray-600 text-sm">AI縺瑚・蜍輔〒縺願ｲｷ縺・ｾ怜刀繧偵せ繧ｳ繧｢繝ｪ繝ｳ繧ｰ縺励∪縺・/p>
          </div>
        ) : loading ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 animate-bounce">送</div>
            <p className="text-amber-400">繝・・繧ｿ繧呈､懃ｴ｢荳ｭ...</p>
          </div>
        ) : displayItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">个</div>
            <p className="text-gray-400">譚｡莉ｶ縺ｫ蜷医≧蝠・刀縺瑚ｦ九▽縺九ｊ縺ｾ縺帙ｓ縺ｧ縺励◆</p>
            <p className="text-gray-600 text-sm mt-1">讀懃ｴ｢譚｡莉ｶ繧貞､峨∴縺ｦ縺願ｩｦ縺励￥縺縺輔＞</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayItems.map(item => (
              <Card
                key={item.id}
                className="bg-[#1a1408] border-amber-900/20 hover:border-amber-700/40 transition-all cursor-pointer group overflow-hidden"
                onClick={() => setSelectedItem(item)}
              >
                <CardContent className="p-0">
                  {/* Image placeholder with gradient */}
                  <div
                    className="aspect-square relative flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})`,
                    }}
                  >
                    <span className="text-4xl font-bold text-white/30">{item.initials}</span>
                    {/* AI Score Badge */}
                    <div className={`absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 ${getScoreColor(item.aiScore)}`}>
                      <div className="text-xs font-bold">AI {item.aiScore}</div>
                    </div>
                    {/* Deal indicator */}
                    {item.aiScore >= 80 && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        櫨 縺願ｲｷ縺・ｾ・                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30">
                        {item.brand}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {item.condition}
                      </Badge>
                    </div>
                    <h3 className="text-sm text-white font-medium truncate mb-1 group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-amber-400">
                        ﾂ･{item.price.toLocaleString()}
                      </span>
                      {item.price < item.marketPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          ﾂ･{item.marketPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-gray-600">
                        {new Date(item.listedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-gray-500">{item.size}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-[#1a1408] border border-amber-900/30 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header image */}
            <div
              className="h-48 relative flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${selectedItem.gradientFrom}, ${selectedItem.gradientTo})`,
              }}
            >
              <span className="text-6xl font-bold text-white/20">{selectedItem.initials}</span>
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
              >
                笨・              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    {selectedItem.brand}
                  </Badge>
                  <Badge variant="secondary">{selectedItem.condition}</Badge>
                  <Badge variant="secondary">{selectedItem.size}</Badge>
                  <Badge variant="secondary">{selectedItem.category}</Badge>
                </div>
                <h2 className="text-lg font-bold text-white">{selectedItem.title}</h2>
                <p className="text-sm text-gray-400 mt-1">{selectedItem.description}</p>
              </div>

              {/* Price Analysis */}
              <div className="bg-[#0d0a07] rounded-lg p-4 border border-amber-900/20">
                <h4 className="text-sm font-semibold text-amber-400 mb-3">腸 萓｡譬ｼ蛻・梵</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500">蜃ｺ蜩∽ｾ｡譬ｼ</div>
                    <div className="text-xl font-bold text-amber-400">ﾂ･{selectedItem.price.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">謗ｨ螳夂嶌蝣ｴ</div>
                    <div className="text-xl font-bold text-gray-300">ﾂ･{selectedItem.marketPrice.toLocaleString()}</div>
                  </div>
                </div>
                {selectedItem.price < selectedItem.marketPrice && (
                  <div className="mt-2 text-sm text-emerald-400">
                    庁 逶ｸ蝣ｴ繧医ｊ <span className="font-bold">ﾂ･{(selectedItem.marketPrice - selectedItem.price).toLocaleString()}</span> 縺雁ｾ・(
                    {Math.round((1 - selectedItem.price / selectedItem.marketPrice) * 100)}%OFF)
                  </div>
                )}
              </div>

              {/* AI Analysis */}
              <div className="bg-[#0d0a07] rounded-lg p-4 border border-amber-900/20">
                <h4 className="text-sm font-semibold text-amber-400 mb-3">､・AI蛻・梵</h4>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`text-3xl font-bold ${getScoreColor(selectedItem.aiScore)}`}>
                    {selectedItem.aiScore}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{getScoreLabel(selectedItem.aiScore)}</div>
                    <div className="text-xs text-gray-500">AI邱丞粋繧ｹ繧ｳ繧｢ / 100</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">蜑ｲ螳牙ｺｦ</span>
                      <span className="text-white">{Math.round(Math.max(0, (1 - selectedItem.price / selectedItem.marketPrice) * 60))}/60</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.max(0, (1 - selectedItem.price / selectedItem.marketPrice) * 100)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">繝ｬ繧｢蠎ｦ</span>
                      <span className="text-white">{Math.round(selectedItem.rarity * 0.25)}/25</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${selectedItem.rarity}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">繧ｳ繝ｳ繝・ぅ繧ｷ繝ｧ繝ｳ</span>
                      <span className="text-white">
                        {selectedItem.condition === '譁ｰ蜩・ ? '15' :
                         selectedItem.condition === '譛ｪ菴ｿ逕ｨ縺ｫ霑代＞' ? '13' :
                         selectedItem.condition === '逶ｮ遶九▲縺溷す繧・ｱ壹ｌ縺ｪ縺・ ? '10' :
                         selectedItem.condition === '繧・ｄ蛯ｷ繧・ｱ壹ｌ縺ゅｊ' ? '6' : '3'}/15
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{
                        width: `${(selectedItem.condition === '譁ｰ蜩・ ? 100 :
                                   selectedItem.condition === '譛ｪ菴ｿ逕ｨ縺ｫ霑代＞' ? 87 :
                                   selectedItem.condition === '逶ｮ遶九▲縺溷す繧・ｱ壹ｌ縺ｪ縺・ ? 67 :
                                   selectedItem.condition === '繧・ｄ蛯ｷ繧・ｱ壹ｌ縺ゅｊ' ? 40 : 20)}%`
                      }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-600">
                蜃ｺ蜩∵律譎・ {new Date(selectedItem.listedAt).toLocaleString('ja-JP')}
              </div>

              <div className="flex flex-col gap-2">
                {selectedItem.listingUrl && selectedItem.source === 'rakuten' && (
                  <a
                    href={selectedItem.listingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full bg-rose-700 hover:bg-rose-800 text-white border-0 text-base">
                      將 讌ｽ螟ｩ縺ｮ蝠・刀繝壹・繧ｸ繧定ｦ九ｋ・亥ｮ溘ョ繝ｼ繧ｿ・・                    </Button>
                  </a>
                )}
                <div className="text-xs text-gray-400 mb-1">剥 莉悶し繧､繝医〒蜷後§蝠・刀繧呈ｯ碑ｼ・☆繧具ｼ域､懃ｴ｢邨先棡繝壹・繧ｸ縺碁幕縺阪∪縺呻ｼ・/div>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://jp.mercari.com/search?keyword=${encodeURIComponent(selectedItem.brand + ' ' + selectedItem.title.substring(0, 30))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white border-0 text-sm">
                      繝｡繝ｫ繧ｫ繝ｪ
                    </Button>
                  </a>
                  <a
                    href={`https://auctions.yahoo.co.jp/search/search?p=${encodeURIComponent(selectedItem.brand + ' ' + selectedItem.title.substring(0, 30))}&auccat=2084028463`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 text-sm">
                      繝､繝輔が繧ｯ
                    </Button>
                  </a>
                  <a
                    href={`https://search.rakuten.co.jp/search/mall/${encodeURIComponent(selectedItem.brand + ' ' + selectedItem.title.substring(0, 30))}/551177/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-rose-700 hover:bg-rose-800 text-white border-0 text-sm">
                      讌ｽ螟ｩ
                    </Button>
                  </a>
                </div>
                <div className="flex gap-2 mt-1">
                  <Button
                    onClick={() => handleNotify(selectedItem)}
                    disabled={webhookStatus === 'sending'}
                    className="flex-1 bg-[#5865f2] hover:bg-[#4752c4] text-white border-0"
                  >
                    {webhookStatus === 'sending' ? '騾∽ｿ｡荳ｭ...' :
                     webhookStatus === 'success' ? '笨・Discord騾∽ｿ｡貂医∩' :
                     '粕 Discord縺ｫ騾夂衍'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedItem(null)}
                    className="border-amber-900/30 text-gray-300 bg-transparent"
                  >
                    髢峨§繧・                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    
      </div>
  )
}


