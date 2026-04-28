'use client'

import { useState, useEffect, useCallback } from 'react'

// ==================== TYPES ====================
type Tab = 'closet' | 'cospa' | 'declutter' | 'sell' | 'coord' | 'stats'

interface ClothingItem {
  id: string
  name: string
  category: string
  brand: string
  price: number
  purchaseDate: string
  lastWornDate: string
  wearCount: number
  season: string
  color: string
  condition: string
  memo: string
  createdAt: string
}

// ==================== CONSTANTS ====================
const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'closet', icon: '👕', label: 'クローゼット' },
  { id: 'cospa', icon: '📊', label: 'コスパ分析' },
  { id: 'declutter', icon: '🗑️', label: '断捨離判定' },
  { id: 'sell', icon: '💰', label: '売却ガイド' },
  { id: 'coord', icon: '👗', label: 'コーデ提案' },
  { id: 'stats', icon: '📈', label: '統計' },
]

const CATEGORIES = ['トップス', 'ボトムス', 'アウター', 'ワンピース', 'シューズ', 'バッグ', 'アクセサリー', 'その他']
const SEASONS = ['春', '夏', '秋', '冬', 'オールシーズン']
const COLORS = ['黒', '白', 'グレー', 'ネイビー', 'ベージュ', '茶', '赤', 'ピンク', '青', '緑', '黄', 'パープル', 'その他']
const CONDITIONS = ['新品同様', '美品', '良い', '使用感あり', '傷汚れあり']
const BRAND_RANKS = ['ハイブランド', 'セレクトショップ', 'ファストファッション', 'ノーブランド']

const CURRENT_SEASON = (() => {
  const m = new Date().getMonth() + 1
  if (m >= 3 && m <= 5) return '春'
  if (m >= 6 && m <= 8) return '夏'
  if (m >= 9 && m <= 11) return '秋'
  return '冬'
})()

// ==================== HELPERS ====================
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function daysSince(dateStr: string): number {
  if (!dateStr) return 999
  const d = new Date(dateStr)
  const now = new Date()
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
}

function costPerWear(item: ClothingItem): number {
  if (item.wearCount === 0) return item.price
  return Math.round(item.price / item.wearCount)
}

function costPerDay(item: ClothingItem): number {
  const days = daysSince(item.purchaseDate)
  if (days === 0) return item.price
  return Math.round(item.price / days)
}

function declutterScore(item: ClothingItem): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  // Days since last worn
  const lastWornDays = daysSince(item.lastWornDate)
  if (lastWornDays > 365) { score += 35; reasons.push('1年以上着用していません') }
  else if (lastWornDays > 180) { score += 25; reasons.push('半年以上着用していません') }
  else if (lastWornDays > 90) { score += 15; reasons.push('3ヶ月以上着用していません') }

  // Cost per wear
  const cpw = costPerWear(item)
  if (cpw > 5000) { score += 20; reasons.push(`1回あたり¥${cpw.toLocaleString()}と高コスト`) }
  else if (cpw > 3000) { score += 10; reasons.push(`1回あたり¥${cpw.toLocaleString()}`) }

  // Season mismatch
  if (item.season !== 'オールシーズン' && item.season !== CURRENT_SEASON) {
    score += 5; reasons.push(`今のシーズン(${CURRENT_SEASON})に合わない`)
  }

  // Condition
  if (item.condition === '傷汚れあり') { score += 15; reasons.push('状態が悪い') }
  else if (item.condition === '使用感あり') { score += 5; reasons.push('使用感がある') }

  // Low wear count + old
  const purchaseDays = daysSince(item.purchaseDate)
  if (purchaseDays > 180 && item.wearCount < 3) {
    score += 20; reasons.push(`購入から${Math.floor(purchaseDays / 30)}ヶ月で${item.wearCount}回しか着ていません`)
  }

  return { score: Math.min(100, score), reasons }
}

function estimateSellPrice(item: ClothingItem): { low: number; high: number; platform: string } {
  let ratio = 0.3 // default
  if (item.condition === '新品同様') ratio = 0.5
  else if (item.condition === '美品') ratio = 0.4
  else if (item.condition === '良い') ratio = 0.3
  else if (item.condition === '使用感あり') ratio = 0.15
  else ratio = 0.05

  // Brand rank multiplier
  if (item.brand) {
    const bl = item.brand.toLowerCase()
    if (/gucci|louis|chanel|hermes|prada|dior|balenciaga|ysl|celine/i.test(bl)) ratio *= 1.5
    else if (/beams|united arrows|ships|journal|nano|urban research/i.test(bl)) ratio *= 1.2
    else if (/uniqlo|gu|h&m|zara|gap|しまむら/i.test(bl)) ratio *= 0.7
  }

  const base = Math.round(item.price * ratio)
  const low = Math.max(300, Math.round(base * 0.7))
  const high = Math.round(base * 1.3)
  const platform = high > 5000 ? 'メルカリ' : high > 2000 ? 'メルカリ / ラクマ' : 'セカストに一括持込'
  return { low, high, platform }
}

// ==================== COMPONENT ====================
export function ClosetCoach() {
  const [tab, setTab] = useState<Tab>('closet')
  const [items, setItems] = useState<ClothingItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', category: 'トップス', brand: '', price: '', purchaseDate: '', lastWornDate: '',
    wearCount: '0', season: 'オールシーズン', color: '黒', condition: '良い', memo: '',
  })

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('closet-coach-items')
    if (saved) {
      try { setItems(JSON.parse(saved)) } catch { /* ignore */ }
    }
  }, [])

  // Save to localStorage
  const saveItems = useCallback((newItems: ClothingItem[]) => {
    setItems(newItems)
    localStorage.setItem('closet-coach-items', JSON.stringify(newItems))
  }, [])

  const resetForm = () => {
    setForm({ name: '', category: 'トップス', brand: '', price: '', purchaseDate: '', lastWornDate: '', wearCount: '0', season: 'オールシーズン', color: '黒', condition: '良い', memo: '' })
    setEditId(null)
    setShowForm(false)
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.price) return
    const now = new Date().toISOString()
    if (editId) {
      saveItems(items.map(it => it.id === editId ? { ...it, ...form, price: Number(form.price), wearCount: Number(form.wearCount) } : it))
    } else {
      const newItem: ClothingItem = {
        id: generateId(), name: form.name.trim(), category: form.category, brand: form.brand.trim(),
        price: Number(form.price), purchaseDate: form.purchaseDate, lastWornDate: form.lastWornDate || form.purchaseDate,
        wearCount: Number(form.wearCount), season: form.season, color: form.color, condition: form.condition,
        memo: form.memo.trim(), createdAt: now,
      }
      saveItems([newItem, ...items])
    }
    resetForm()
  }

  const handleEdit = (item: ClothingItem) => {
    setForm({
      name: item.name, category: item.category, brand: item.brand, price: String(item.price),
      purchaseDate: item.purchaseDate, lastWornDate: item.lastWornDate, wearCount: String(item.wearCount),
      season: item.season, color: item.color, condition: item.condition, memo: item.memo,
    })
    setEditId(item.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('このアイテムを削除しますか？')) {
      saveItems(items.filter(it => it.id !== id))
    }
  }

  const handleWear = (id: string) => {
    const today = new Date().toISOString().split('T')[0]
    saveItems(items.map(it => it.id === id ? { ...it, wearCount: it.wearCount + 1, lastWornDate: today } : it))
  }

  const exportCSV = () => {
    const header = 'アイテム名,カテゴリ,ブランド,購入価格,購入日,最終着用日,着用回数,シーズン,色,状態,メモ'
    const rows = items.map(it => `"${it.name}","${it.category}","${it.brand}",${it.price},${it.purchaseDate},${it.lastWornDate},${it.wearCount},"${it.season}","${it.color}","${it.condition}","${it.memo}"`)
    const csv = '\uFEFF' + [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `closet-coach-${new Date().toISOString().split('T')[0]}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  // Sorted/filtered items for different tabs
  const sortedByCospa = [...items].sort((a, b) => costPerWear(b) - costPerWear(a))
  const declutterCandidates = items.map(it => ({ item: it, ...declutterScore(it) })).filter(d => d.score >= 30).sort((a, b) => b.score - a.score)

  // Coord suggestions
  const coordSuggestions = (() => {
    const tops = items.filter(it => it.category === 'トップス')
    const bottoms = items.filter(it => it.category === 'ボトムス')
    const outers = items.filter(it => it.category === 'アウター')
    const results: { top: ClothingItem; bottom: ClothingItem; outer?: ClothingItem }[] = []
    for (const top of tops.slice(0, 5)) {
      for (const bottom of bottoms.slice(0, 5)) {
        if (top.color === bottom.color && top.color !== '黒' && top.color !== '白') continue
        const outer = outers.find(o => o.season === CURRENT_SEASON || o.season === 'オールシーズン')
        results.push({ top, bottom, outer })
        if (results.length >= 6) break
      }
      if (results.length >= 6) break
    }
    return results
  })()

  // Stats
  const totalInvestment = items.reduce((s, it) => s + it.price, 0)
  const categoryCount = CATEGORIES.map(c => ({ category: c, count: items.filter(it => it.category === c).length, total: items.filter(it => it.category === c).reduce((s, it) => s + it.price, 0) })).filter(c => c.count > 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-gray-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👗</span>
              <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                AIクローゼット断捨離コーチ
              </h1>
            </div>
            <div className="text-xs text-white/40">{items.length} アイテム</div>
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
        {/* ==================== CLOSET TAB ==================== */}
        {tab === 'closet' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">👕 クローゼット</h2>
                <p className="text-sm text-white/50">アイテムを登録して管理しましょう</p>
              </div>
              <div className="flex gap-2">
                {items.length > 0 && (
                  <button onClick={exportCSV} className="px-3 py-2 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition-colors">📥 CSV出力</button>
                )}
                <button onClick={() => { resetForm(); setShowForm(true) }} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">+ 追加</button>
              </div>
            </div>

            {/* Form */}
            {showForm && (
              <div className="bg-white/5 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-sm">{editId ? '✏️ アイテム編集' : '➕ 新規登録'}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs text-white/50 mb-1 block">アイテム名 *</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="白Tシャツ UNIQLO" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">カテゴリ</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">ブランド</label>
                    <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="UNIQLO" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">購入価格(円) *</label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="3990" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">着用回数</label>
                    <input type="number" value={form.wearCount} onChange={e => setForm(f => ({ ...f, wearCount: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">購入日</label>
                    <input type="date" value={form.purchaseDate} onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">最終着用日</label>
                    <input type="date" value={form.lastWornDate} onChange={e => setForm(f => ({ ...f, lastWornDate: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">シーズン</label>
                    <select value={form.season} onChange={e => setForm(f => ({ ...f, season: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                      {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">色</label>
                    <select value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                      {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">状態</label>
                    <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                      {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-white/50 mb-1 block">メモ</label>
                    <input value={form.memo} onChange={e => setForm(f => ({ ...f, memo: e.target.value }))} placeholder="お気に入り、コーデメモなど" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={resetForm} className="px-4 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10">キャンセル</button>
                  <button onClick={handleSave} disabled={!form.name.trim() || !form.price} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg text-sm font-medium disabled:opacity-30 hover:opacity-90">保存</button>
                </div>
              </div>
            )}

            {/* Item list */}
            {items.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-12 text-center text-white/40">
                <p className="text-4xl mb-3">👕</p>
                <p className="text-sm">まだアイテムがありません</p>
                <p className="text-xs mt-1">「+ 追加」ボタンで服を登録しましょう</p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/30 to-pink-500/30 flex items-center justify-center text-lg shrink-0">
                      {item.category === 'トップス' ? '👕' : item.category === 'ボトムス' ? '👖' : item.category === 'アウター' ? '🧥' : item.category === 'シューズ' ? '👟' : item.category === 'バッグ' ? '👜' : item.category === 'ワンピース' ? '👗' : '✨'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{item.name}</span>
                        {item.brand && <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full shrink-0">{item.brand}</span>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/40 mt-1">
                        <span>¥{item.price.toLocaleString()}</span>
                        <span>{item.wearCount}回着用</span>
                        <span>1回 ¥{costPerWear(item).toLocaleString()}</span>
                        <span>{item.color}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => handleWear(item.id)} className="px-2 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30" title="着用記録">👕+1</button>
                      <button onClick={() => handleEdit(item)} className="px-2 py-1.5 bg-white/5 rounded-lg text-xs hover:bg-white/10">✏️</button>
                      <button onClick={() => handleDelete(item.id)} className="px-2 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs hover:bg-red-500/20">🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== COSPA TAB ==================== */}
        {tab === 'cospa' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">📊 コスパ分析</h2>
              <p className="text-sm text-white/50">1回あたりコストが高い順に表示。着るほどコスパが良くなります</p>
            </div>
            {items.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-8 text-center text-white/40 text-sm">クローゼットにアイテムを登録してください</div>
            ) : (
              <div className="space-y-2">
                {sortedByCospa.map((item, i) => {
                  const cpw = costPerWear(item)
                  const cpd = costPerDay(item)
                  const barWidth = Math.min(100, (cpw / (sortedByCospa[0] ? costPerWear(sortedByCospa[0]) : 1)) * 100)
                  return (
                    <div key={item.id} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white/30">#{i + 1}</span>
                          <span className="font-medium text-sm">{item.name}</span>
                          {item.brand && <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{item.brand}</span>}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">¥{cpw.toLocaleString()}<span className="text-xs text-white/40 font-normal">/回</span></div>
                          <div className="text-xs text-white/40">¥{cpd}<span className="text-white/30">/日</span></div>
                        </div>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${cpw > 3000 ? 'bg-red-500' : cpw > 1000 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${barWidth}%` }} />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/40 mt-2">
                        <span>購入 ¥{item.price.toLocaleString()}</span>
                        <span>{item.wearCount}回着用</span>
                        <span>{cpw <= 500 ? '✅ 元取れてる！' : cpw <= 1000 ? '👍 まずまず' : '📈 もっと着よう'}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================== DECLUTTER TAB ==================== */}
        {tab === 'declutter' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">🗑️ 断捨離AI判定</h2>
              <p className="text-sm text-white/50">スコア30以上のアイテムが手放し候補です（{declutterCandidates.length}件）</p>
            </div>
            {declutterCandidates.length === 0 ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
                <p className="text-2xl mb-2">✨</p>
                <p className="text-sm text-green-400">{items.length === 0 ? 'アイテムを登録すると判定します' : 'すべてのアイテムが活用されています！'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {declutterCandidates.map(({ item, score, reasons }) => (
                  <div key={item.id} className={`rounded-xl p-4 ${score >= 70 ? 'bg-red-500/10 border border-red-500/30' : score >= 50 ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-white/5 border border-white/10'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium text-sm">{item.name}</span>
                        {item.brand && <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full ml-2">{item.brand}</span>}
                      </div>
                      <div className={`text-sm font-bold ${score >= 70 ? 'text-red-400' : score >= 50 ? 'text-amber-400' : 'text-white/60'}`}>
                        {score >= 70 ? '🔴' : score >= 50 ? '🟡' : '🟢'} {score}点
                      </div>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                      <div className={`h-full rounded-full ${score >= 70 ? 'bg-red-500' : score >= 50 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${score}%` }} />
                    </div>
                    <ul className="space-y-1">
                      {reasons.map((r, i) => <li key={i} className="text-xs text-white/50">• {r}</li>)}
                    </ul>
                    <div className="mt-2 text-xs font-medium">
                      {score >= 70 ? '💡 手放すことを強くおすすめします' : score >= 50 ? '💡 手放しを検討しましょう' : '💡 もう少し着てみましょう'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== SELL TAB ==================== */}
        {tab === 'sell' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">💰 売却ガイド</h2>
              <p className="text-sm text-white/50">想定売却価格とおすすめプラットフォーム</p>
            </div>

            {/* Platform comparison */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-3">📊 プラットフォーム比較</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="border-b border-white/10">
                    <th className="text-left py-2 px-2 text-white/40">プラットフォーム</th>
                    <th className="text-left py-2 px-2 text-white/40">手数料</th>
                    <th className="text-left py-2 px-2 text-white/40">向いてるもの</th>
                    <th className="text-left py-2 px-2 text-white/40">特徴</th>
                  </tr></thead>
                  <tbody className="text-white/70">
                    <tr className="border-b border-white/5"><td className="py-2 px-2 font-medium">メルカリ</td><td className="py-2 px-2">10%</td><td className="py-2 px-2">ブランド品〜日用品</td><td className="py-2 px-2">利用者最多・売れやすい</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2 px-2 font-medium">ラクマ</td><td className="py-2 px-2">6.6%</td><td className="py-2 px-2">レディース服</td><td className="py-2 px-2">手数料が安い</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2 px-2 font-medium">PayPayフリマ</td><td className="py-2 px-2">5%</td><td className="py-2 px-2">メンズ・家電</td><td className="py-2 px-2">手数料最安</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2 px-2 font-medium">セカンドストリート</td><td className="py-2 px-2">—</td><td className="py-2 px-2">大量処分</td><td className="py-2 px-2">持ち込むだけ・一括買取</td></tr>
                    <tr><td className="py-2 px-2 font-medium">ZOZOUSED</td><td className="py-2 px-2">—</td><td className="py-2 px-2">ブランド服</td><td className="py-2 px-2">ZOZO基準の査定</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Item estimates */}
            {items.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-8 text-center text-white/40 text-sm">アイテムを登録すると売却想定価格を算出します</div>
            ) : (
              <div className="space-y-2">
                {items.map(item => {
                  const est = estimateSellPrice(item)
                  return (
                    <div key={item.id} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-sm">{item.name}</span>
                          {item.brand && <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full ml-2">{item.brand}</span>}
                          <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full ml-1">{item.condition}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-400">¥{est.low.toLocaleString()} 〜 ¥{est.high.toLocaleString()}</div>
                          <div className="text-xs text-white/40">購入 ¥{item.price.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="text-xs text-white/50 mt-1">📍 おすすめ: {est.platform}</div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Photo tips */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-3">📸 売れやすい写真のコツ</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li>🔆 自然光で撮影（窓際がベスト）</li>
                <li>🧹 背景は白 or シンプルに（床置きはNG）</li>
                <li>📐 全体 + タグ + ダメージ部分の最低3枚</li>
                <li>👕 ハンガーにかけて撮ると◎</li>
                <li>📏 サイズ感がわかる写真（メジャー当てるなど）</li>
                <li>✍️ ブランド名・サイズ・着用回数をタイトルに含める</li>
              </ul>
            </div>
          </div>
        )}

        {/* ==================== COORD TAB ==================== */}
        {tab === 'coord' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">👗 コーデ提案</h2>
              <p className="text-sm text-white/50">登録アイテムから着回しパターンを提案（今のシーズン: {CURRENT_SEASON}）</p>
            </div>
            {coordSuggestions.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-8 text-center text-white/40 text-sm">
                {items.length === 0 ? 'アイテムを登録してください' : 'トップスとボトムスを登録するとコーデを提案します'}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {coordSuggestions.map((coord, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-white/40 mb-2">コーデ #{i + 1}</div>
                    <div className="space-y-2">
                      {coord.outer && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-lg">🧥</span>
                          <span>{coord.outer.name}</span>
                          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{coord.outer.color}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-lg">👕</span>
                        <span>{coord.top.name}</span>
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{coord.top.color}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-lg">👖</span>
                        <span>{coord.bottom.name}</span>
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{coord.bottom.color}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Color coordination tips */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-3">🎨 色合わせの基本</h3>
              <div className="grid grid-cols-2 gap-3 text-xs text-white/60">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="font-medium text-white/80 mb-1">モノトーン</div>
                  黒×白×グレーで安定感。迷ったらコレ
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="font-medium text-white/80 mb-1">同系色</div>
                  ネイビー×青、ベージュ×茶でまとまり感
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="font-medium text-white/80 mb-1">差し色</div>
                  ベース(黒白)に1点だけカラーを入れる
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="font-medium text-white/80 mb-1">3色ルール</div>
                  全身3色以内に抑えるとまとまる
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STATS TAB ==================== */}
        {tab === 'stats' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">📈 ワードローブ統計</h2>
              <p className="text-sm text-white/50">あなたのクローゼットの全体像</p>
            </div>

            {items.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-8 text-center text-white/40 text-sm">アイテムを登録すると統計が表示されます</div>
            ) : (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">{items.length}</div>
                    <div className="text-xs text-white/40">総アイテム数</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">¥{totalInvestment.toLocaleString()}</div>
                    <div className="text-xs text-white/40">総投資額</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">¥{items.length > 0 ? Math.round(totalInvestment / items.length).toLocaleString() : 0}</div>
                    <div className="text-xs text-white/40">平均単価</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">{declutterCandidates.length}</div>
                    <div className="text-xs text-white/40">断捨離候補</div>
                  </div>
                </div>

                {/* Category breakdown */}
                <div className="bg-white/5 rounded-2xl p-5">
                  <h3 className="font-bold text-sm mb-3">📊 カテゴリ別内訳</h3>
                  <div className="space-y-3">
                    {categoryCount.map(cc => {
                      const pct = Math.round((cc.count / items.length) * 100)
                      return (
                        <div key={cc.category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{cc.category}</span>
                            <span className="text-white/40">{cc.count}着 (¥{cc.total.toLocaleString()})</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Wear ranking */}
                <div className="bg-white/5 rounded-2xl p-5">
                  <h3 className="font-bold text-sm mb-3">🏆 着用回数ランキング</h3>
                  <div className="space-y-2">
                    {[...items].sort((a, b) => b.wearCount - a.wearCount).slice(0, 5).map((item, i) => (
                      <div key={item.id} className="flex items-center gap-3 text-sm">
                        <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                        <span className="flex-1">{item.name}</span>
                        <span className="font-bold">{item.wearCount}回</span>
                        <span className="text-xs text-white/40">¥{costPerWear(item).toLocaleString()}/回</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Season distribution */}
                <div className="bg-white/5 rounded-2xl p-5">
                  <h3 className="font-bold text-sm mb-3">🌸 シーズン別分布</h3>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {SEASONS.map(s => {
                      const count = items.filter(it => it.season === s).length
                      return (
                        <div key={s} className={`rounded-lg p-3 ${s === CURRENT_SEASON ? 'bg-violet-500/20 border border-violet-500/30' : 'bg-white/5'}`}>
                          <div className="text-lg font-bold">{count}</div>
                          <div className="text-xs text-white/40">{s}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto px-4 py-6 border-t border-white/10 mt-8">
        <p className="text-xs text-white/30 text-center">
          ※ すべてのデータはブラウザ内に保存され、外部に送信されることはありません。
        </p>
      </div>
    </div>
  )
}
