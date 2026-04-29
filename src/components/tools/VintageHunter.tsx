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

  const handleSearch = useCallback(async () => {
    setLoading(true)
    setHasSearched(true)
    try {
      const params = new URLSearchParams()
      if (filters.brand) params.set('brand', filters.brand)
      if (filters.keywords) params.set('keywords', filters.keywords)
      if (filters.minPrice) params.set('minPrice', filters.minPrice)
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
      if (filters.condition !== 'all') params.set('condition', filters.condition)

      const res = await fetch(`/api/tools/vintage-hunter/search?${params.toString()}`)
      const data = await res.json()

      if (data.items) {
        // Compute AI scores client-side
        const scoredItems = data.items.map((item: VintageItem) => {
          const priceRatio = item.marketPrice > 0 ? item.price / item.marketPrice : 1
          const dealScore = Math.max(0, (1 - priceRatio) * 60) // up to 60 points for good deal
          const rarityScore = item.rarity * 0.25 // up to 25 points
          const conditionScore =
            item.condition === '新品' ? 15 :
            item.condition === '未使用に近い' ? 13 :
            item.condition === '目立った傷や汚れなし' ? 10 :
            item.condition === 'やや傷や汚れあり' ? 6 :
            item.condition === '傷や汚れあり' ? 3 : 1
          const aiScore = Math.min(100, Math.max(0, Math.round(dealScore + rarityScore + conditionScore)))
          return { ...item, aiScore }
        })
        setItems(scoredItems)
        setTotalResults(data.total || scoredItems.length)
      }
    } catch (err) {
      console.error('Search failed:', err)
      alert('検索に失敗しました。')
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
    if (score >= 80) return '🔥 超お買い得'
    if (score >= 60) return '✨ お買い得'
    if (score >= 40) return '👍 まずまず'
    return '📊 普通'
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
              <h1 className="text-sm font-semibold text-white">古着ハンター</h1>
              <p className="text-xs text-gray-500">AI搭載ヴィンテージ検索</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowWebhookPanel(!showWebhookPanel)}
            className="text-xs border-amber-800/50 text-amber-400 hover:text-amber-300 bg-transparent"
          >
            🔔 Discord通知設定
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Webhook Panel */}
        {showWebhookPanel && (
          <Card className="bg-[#1a1408] border-amber-900/30 mb-6">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-amber-400 mb-3">🔔 Discord Webhook設定</h3>
              <div className="flex gap-2">
                <Input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="bg-[#0d0a07] border-amber-900/30 text-white placeholder-gray-600 flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleNotify({ id: 'test', title: 'テスト通知', brand: 'Test', price: 1000, marketPrice: 2000, condition: '良好', size: 'M', listedAt: new Date().toISOString(), rarity: 50, aiScore: 85, gradientFrom: '#f59e0b', gradientTo: '#ea580c', initials: 'TS', description: 'テスト通知です', category: 'トップス', listingUrl: 'https://jp.mercari.com/search?keyword=Test' })}
                  disabled={!webhookUrl || webhookStatus === 'sending'}
                  className="bg-amber-600 hover:bg-amber-700 text-white border-0"
                >
                  {webhookStatus === 'sending' ? '送信中...' :
                   webhookStatus === 'success' ? '✓ 送信完了' :
                   webhookStatus === 'error' ? '✗ 失敗' :
                   'テスト送信'}
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Discordサーバーの設定 → 連携サービス → ウェブフック でURLを取得できます
              </p>
            </CardContent>
          </Card>
        )}

        {/* Search Form */}
        <Card className="bg-[#1a1408] border-amber-900/30 mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">ブランド</Label>
                <Input
                  value={filters.brand}
                  onChange={(e) => setFilters(f => ({ ...f, brand: e.target.value }))}
                  placeholder="Supreme, KAPITAL..."
                  className="bg-[#0d0a07] border-amber-900/30 text-white placeholder-gray-600 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">キーワード</Label>
                <Input
                  value={filters.keywords}
                  onChange={(e) => setFilters(f => ({ ...f, keywords: e.target.value }))}
                  placeholder="ボックスロゴ, 90s..."
                  className="bg-[#0d0a07] border-amber-900/30 text-white placeholder-gray-600 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">下限価格</Label>
                <Input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                  placeholder="¥1,000"
                  className="bg-[#0d0a07] border-amber-900/30 text-white placeholder-gray-600 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">上限価格</Label>
                <Input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                  placeholder="¥50,000"
                  className="bg-[#0d0a07] border-amber-900/30 text-white placeholder-gray-600 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400 mb-1 block">状態</Label>
                <select
                  value={filters.condition}
                  onChange={(e) => setFilters(f => ({ ...f, condition: e.target.value }))}
                  className="w-full h-9 rounded-md border border-amber-900/30 bg-[#0d0a07] text-white text-sm px-3"
                >
                  <option value="all">すべて</option>
                  <option value="新品">新品</option>
                  <option value="未使用に近い">未使用に近い</option>
                  <option value="目立った傷や汚れなし">目立った傷や汚れなし</option>
                  <option value="やや傷や汚れあり">やや傷や汚れあり</option>
                  <option value="傷や汚れあり">傷や汚れあり</option>
                </select>
              </div>
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 font-medium"
            >
              {loading ? '🔍 検索中...' : '🔍 古着を検索'}
            </Button>
          </CardContent>
        </Card>

        {/* Results Controls */}
        {hasSearched && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="text-sm text-gray-400">
              {totalResults > 0 ? (
                <>
                  <span className="text-amber-400 font-bold">{totalResults}</span>件中
                  <span className="text-white font-bold ml-1">{displayItems.length}</span>件表示
                </>
              ) : (
                '結果なし'
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label className="text-xs text-gray-500">最低スコア:</Label>
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
                <option value="aiScore">AIスコア順</option>
                <option value="priceLow">価格が安い順</option>
                <option value="priceHigh">価格が高い順</option>
                <option value="newest">新着順</option>
              </select>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!hasSearched ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 mb-2">ブランドやキーワードを入力して検索</p>
            <p className="text-gray-600 text-sm">AIが自動でお買い得品をスコアリングします</p>
          </div>
        ) : loading ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 animate-bounce">👗</div>
            <p className="text-amber-400">データを検索中...</p>
          </div>
        ) : displayItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">😢</div>
            <p className="text-gray-400">条件に合う商品が見つかりませんでした</p>
            <p className="text-gray-600 text-sm mt-1">検索条件を変えてお試しください</p>
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
                        🔥 お買い得
                      </div>
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
                        ¥{item.price.toLocaleString()}
                      </span>
                      {item.price < item.marketPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          ¥{item.marketPrice.toLocaleString()}
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
                ✕
              </button>
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
                <h4 className="text-sm font-semibold text-amber-400 mb-3">💰 価格分析</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-500">出品価格</div>
                    <div className="text-xl font-bold text-amber-400">¥{selectedItem.price.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">推定相場</div>
                    <div className="text-xl font-bold text-gray-300">¥{selectedItem.marketPrice.toLocaleString()}</div>
                  </div>
                </div>
                {selectedItem.price < selectedItem.marketPrice && (
                  <div className="mt-2 text-sm text-emerald-400">
                    💡 相場より <span className="font-bold">¥{(selectedItem.marketPrice - selectedItem.price).toLocaleString()}</span> お得 (
                    {Math.round((1 - selectedItem.price / selectedItem.marketPrice) * 100)}%OFF)
                  </div>
                )}
              </div>

              {/* AI Analysis */}
              <div className="bg-[#0d0a07] rounded-lg p-4 border border-amber-900/20">
                <h4 className="text-sm font-semibold text-amber-400 mb-3">🤖 AI分析</h4>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`text-3xl font-bold ${getScoreColor(selectedItem.aiScore)}`}>
                    {selectedItem.aiScore}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{getScoreLabel(selectedItem.aiScore)}</div>
                    <div className="text-xs text-gray-500">AI総合スコア / 100</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">割安度</span>
                      <span className="text-white">{Math.round(Math.max(0, (1 - selectedItem.price / selectedItem.marketPrice) * 60))}/60</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.max(0, (1 - selectedItem.price / selectedItem.marketPrice) * 100)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">レア度</span>
                      <span className="text-white">{Math.round(selectedItem.rarity * 0.25)}/25</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${selectedItem.rarity}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">コンディション</span>
                      <span className="text-white">
                        {selectedItem.condition === '新品' ? '15' :
                         selectedItem.condition === '未使用に近い' ? '13' :
                         selectedItem.condition === '目立った傷や汚れなし' ? '10' :
                         selectedItem.condition === 'やや傷や汚れあり' ? '6' : '3'}/15
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{
                        width: `${(selectedItem.condition === '新品' ? 100 :
                                   selectedItem.condition === '未使用に近い' ? 87 :
                                   selectedItem.condition === '目立った傷や汚れなし' ? 67 :
                                   selectedItem.condition === 'やや傷や汚れあり' ? 40 : 20)}%`
                      }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-600">
                出品日時: {new Date(selectedItem.listedAt).toLocaleString('ja-JP')}
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
                      🛒 楽天の商品ページを見る（実データ）
                    </Button>
                  </a>
                )}
                <div className="text-xs text-gray-400 mb-1">🔍 他サイトで同じ商品を比較する（検索結果ページが開きます）</div>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://jp.mercari.com/search?keyword=${encodeURIComponent(selectedItem.brand + ' ' + selectedItem.title.substring(0, 30))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white border-0 text-sm">
                      メルカリ
                    </Button>
                  </a>
                  <a
                    href={`https://auctions.yahoo.co.jp/search/search?p=${encodeURIComponent(selectedItem.brand + ' ' + selectedItem.title.substring(0, 30))}&auccat=2084028463`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 text-sm">
                      ヤフオク
                    </Button>
                  </a>
                  <a
                    href={`https://search.rakuten.co.jp/search/mall/${encodeURIComponent(selectedItem.brand + ' ' + selectedItem.title.substring(0, 30))}/551177/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-rose-700 hover:bg-rose-800 text-white border-0 text-sm">
                      楽天
                    </Button>
                  </a>
                </div>
                <div className="flex gap-2 mt-1">
                  <Button
                    onClick={() => handleNotify(selectedItem)}
                    disabled={webhookStatus === 'sending'}
                    className="flex-1 bg-[#5865f2] hover:bg-[#4752c4] text-white border-0"
                  >
                    {webhookStatus === 'sending' ? '送信中...' :
                     webhookStatus === 'success' ? '✓ Discord送信済み' :
                     '🔔 Discordに通知'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedItem(null)}
                    className="border-amber-900/30 text-gray-300 bg-transparent"
                  >
                    閉じる
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
