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
  { id: 'closet', icon: '装', label: '繧ｯ繝ｭ繝ｼ繧ｼ繝・ヨ' },
  { id: 'cospa', icon: '投', label: '繧ｳ繧ｹ繝大・譫・ },
  { id: 'declutter', icon: '卵・・, label: '譁ｭ謐ｨ髮｢蛻､螳・ },
  { id: 'sell', icon: '腸', label: '螢ｲ蜊ｴ繧ｬ繧､繝・ },
  { id: 'coord', icon: '送', label: '繧ｳ繝ｼ繝・署譯・ },
  { id: 'stats', icon: '嶋', label: '邨ｱ險・ },
]

const CATEGORIES = ['繝医ャ繝励せ', '繝懊ヨ繝繧ｹ', '繧｢繧ｦ繧ｿ繝ｼ', '繝ｯ繝ｳ繝斐・繧ｹ', '繧ｷ繝･繝ｼ繧ｺ', '繝舌ャ繧ｰ', '繧｢繧ｯ繧ｻ繧ｵ繝ｪ繝ｼ', '縺昴・莉・]
const SEASONS = ['譏･', '螟・, '遘・, '蜀ｬ', '繧ｪ繝ｼ繝ｫ繧ｷ繝ｼ繧ｺ繝ｳ']
const COLORS = ['鮟・, '逋ｽ', '繧ｰ繝ｬ繝ｼ', '繝阪う繝薙・', '繝吶・繧ｸ繝･', '闌ｶ', '襍､', '繝斐Φ繧ｯ', '髱・, '邱・, '鮟・, '繝代・繝励Ν', '縺昴・莉・]
const CONDITIONS = ['譁ｰ蜩∝酔讒・, '鄒主刀', '濶ｯ縺・, '菴ｿ逕ｨ諢溘≠繧・, '蛯ｷ豎壹ｌ縺ゅｊ']
const BRAND_RANKS = ['繝上う繝悶Λ繝ｳ繝・, '繧ｻ繝ｬ繧ｯ繝医す繝ｧ繝・・', '繝輔ぃ繧ｹ繝医ヵ繧｡繝・す繝ｧ繝ｳ', '繝弱・繝悶Λ繝ｳ繝・]

const CURRENT_SEASON = (() => {
  const m = new Date().getMonth() + 1
  if (m >= 3 && m <= 5) return '譏･'
  if (m >= 6 && m <= 8) return '螟・
  if (m >= 9 && m <= 11) return '遘・
  return '蜀ｬ'
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
  if (lastWornDays > 365) { score += 35; reasons.push('1蟷ｴ莉･荳顔捩逕ｨ縺励※縺・∪縺帙ｓ') }
  else if (lastWornDays > 180) { score += 25; reasons.push('蜊雁ｹｴ莉･荳顔捩逕ｨ縺励※縺・∪縺帙ｓ') }
  else if (lastWornDays > 90) { score += 15; reasons.push('3繝ｶ譛井ｻ･荳顔捩逕ｨ縺励※縺・∪縺帙ｓ') }

  // Cost per wear
  const cpw = costPerWear(item)
  if (cpw > 5000) { score += 20; reasons.push(`1蝗槭≠縺溘ｊﾂ･${cpw.toLocaleString()}縺ｨ鬮倥さ繧ｹ繝・) }
  else if (cpw > 3000) { score += 10; reasons.push(`1蝗槭≠縺溘ｊﾂ･${cpw.toLocaleString()}`) }

  // Season mismatch
  if (item.season !== '繧ｪ繝ｼ繝ｫ繧ｷ繝ｼ繧ｺ繝ｳ' && item.season !== CURRENT_SEASON) {
    score += 5; reasons.push(`莉翫・繧ｷ繝ｼ繧ｺ繝ｳ(${CURRENT_SEASON})縺ｫ蜷医ｏ縺ｪ縺Я)
  }

  // Condition
  if (item.condition === '蛯ｷ豎壹ｌ縺ゅｊ') { score += 15; reasons.push('迥ｶ諷九′謔ｪ縺・) }
  else if (item.condition === '菴ｿ逕ｨ諢溘≠繧・) { score += 5; reasons.push('菴ｿ逕ｨ諢溘′縺ゅｋ') }

  // Low wear count + old
  const purchaseDays = daysSince(item.purchaseDate)
  if (purchaseDays > 180 && item.wearCount < 3) {
    score += 20; reasons.push(`雉ｼ蜈･縺九ｉ${Math.floor(purchaseDays / 30)}繝ｶ譛医〒${item.wearCount}蝗槭＠縺狗捩縺ｦ縺・∪縺帙ｓ`)
  }

  return { score: Math.min(100, score), reasons }
}

function estimateSellPrice(item: ClothingItem): { low: number; high: number; platform: string } {
  let ratio = 0.3 // default
  if (item.condition === '譁ｰ蜩∝酔讒・) ratio = 0.5
  else if (item.condition === '鄒主刀') ratio = 0.4
  else if (item.condition === '濶ｯ縺・) ratio = 0.3
  else if (item.condition === '菴ｿ逕ｨ諢溘≠繧・) ratio = 0.15
  else ratio = 0.05

  // Brand rank multiplier
  if (item.brand) {
    const bl = item.brand.toLowerCase()
    if (/gucci|louis|chanel|hermes|prada|dior|balenciaga|ysl|celine/i.test(bl)) ratio *= 1.5
    else if (/beams|united arrows|ships|journal|nano|urban research/i.test(bl)) ratio *= 1.2
    else if (/uniqlo|gu|h&m|zara|gap|縺励∪繧繧・i.test(bl)) ratio *= 0.7
  }

  const base = Math.round(item.price * ratio)
  const low = Math.max(300, Math.round(base * 0.7))
  const high = Math.round(base * 1.3)
  const platform = high > 5000 ? '繝｡繝ｫ繧ｫ繝ｪ' : high > 2000 ? '繝｡繝ｫ繧ｫ繝ｪ / 繝ｩ繧ｯ繝・ : '繧ｻ繧ｫ繧ｹ繝医↓荳諡ｬ謖∬ｾｼ'
  return { low, high, platform }
}

// ==================== COMPONENT ====================
export function ClosetCoach() {
  const [tab, setTab] = useState<Tab>('closet')
  const [items, setItems] = useState<ClothingItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', category: '繝医ャ繝励せ', brand: '', price: '', purchaseDate: '', lastWornDate: '',
    wearCount: '0', season: '繧ｪ繝ｼ繝ｫ繧ｷ繝ｼ繧ｺ繝ｳ', color: '鮟・, condition: '濶ｯ縺・, memo: '',
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
    setForm({ name: '', category: '繝医ャ繝励せ', brand: '', price: '', purchaseDate: '', lastWornDate: '', wearCount: '0', season: '繧ｪ繝ｼ繝ｫ繧ｷ繝ｼ繧ｺ繝ｳ', color: '鮟・, condition: '濶ｯ縺・, memo: '' })
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
    if (confirm('縺薙・繧｢繧､繝・Β繧貞炎髯､縺励∪縺吶°・・)) {
      saveItems(items.filter(it => it.id !== id))
    }
  }

  const handleWear = (id: string) => {
    const today = new Date().toISOString().split('T')[0]
    saveItems(items.map(it => it.id === id ? { ...it, wearCount: it.wearCount + 1, lastWornDate: today } : it))
  }

  const exportCSV = () => {
    const header = '繧｢繧､繝・Β蜷・繧ｫ繝・ざ繝ｪ,繝悶Λ繝ｳ繝・雉ｼ蜈･萓｡譬ｼ,雉ｼ蜈･譌･,譛邨ら捩逕ｨ譌･,逹逕ｨ蝗樊焚,繧ｷ繝ｼ繧ｺ繝ｳ,濶ｲ,迥ｶ諷・繝｡繝｢'
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
    const tops = items.filter(it => it.category === '繝医ャ繝励せ')
    const bottoms = items.filter(it => it.category === '繝懊ヨ繝繧ｹ')
    const outers = items.filter(it => it.category === '繧｢繧ｦ繧ｿ繝ｼ')
    const results: { top: ClothingItem; bottom: ClothingItem; outer?: ClothingItem }[] = []
    for (const top of tops.slice(0, 5)) {
      for (const bottom of bottoms.slice(0, 5)) {
        if (top.color === bottom.color && top.color !== '鮟・ && top.color !== '逋ｽ') continue
        const outer = outers.find(o => o.season === CURRENT_SEASON || o.season === '繧ｪ繝ｼ繝ｫ繧ｷ繝ｼ繧ｺ繝ｳ')
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
              <span className="text-2xl">送</span>
              <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                AI繧ｯ繝ｭ繝ｼ繧ｼ繝・ヨ譁ｭ謐ｨ髮｢繧ｳ繝ｼ繝・              </h1>
            </div>
            <div className="text-xs text-white/40">{items.length} 繧｢繧､繝・Β</div>
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
                <h2 className="text-xl font-bold">装 繧ｯ繝ｭ繝ｼ繧ｼ繝・ヨ</h2>
                <p className="text-sm text-white/50">繧｢繧､繝・Β繧堤匳骭ｲ縺励※邂｡逅・＠縺ｾ縺励ｇ縺・/p>
              </div>
              <div className="flex gap-2">
                {items.length > 0 && (
                  <button onClick={exportCSV} className="px-3 py-2 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition-colors">踏 CSV蜃ｺ蜉・/button>
                )}
                <button onClick={() => { resetForm(); setShowForm(true) }} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">+ 霑ｽ蜉</button>
              </div>
            </div>

            {/* Form */}
            {showForm && (
              <div className="bg-white/5 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-sm">{editId ? '笨擾ｸ・繧｢繧､繝・Β邱ｨ髮・ : '筐・譁ｰ隕冗匳骭ｲ'}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs text-white/50 mb-1 block">繧｢繧､繝・Β蜷・*</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="逋ｽT繧ｷ繝｣繝・UNIQLO" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">繧ｫ繝・ざ繝ｪ</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">繝悶Λ繝ｳ繝・/label>
                    <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="UNIQLO" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">雉ｼ蜈･萓｡譬ｼ(蜀・ *</label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="3990" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">逹逕ｨ蝗樊焚</label>
                    <input type="number" value={form.wearCount} onChange={e => setForm(f => ({ ...f, wearCount: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">雉ｼ蜈･譌･</label>
                    <input type="date" value={form.purchaseDate} onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">譛邨ら捩逕ｨ譌･</label>
                    <input type="date" value={form.lastWornDate} onChange={e => setForm(f => ({ ...f, lastWornDate: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">繧ｷ繝ｼ繧ｺ繝ｳ</label>
                    <select value={form.season} onChange={e => setForm(f => ({ ...f, season: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                      {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">濶ｲ</label>
                    <select value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                      {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">迥ｶ諷・/label>
                    <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                      {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-white/50 mb-1 block">繝｡繝｢</label>
                    <input value={form.memo} onChange={e => setForm(f => ({ ...f, memo: e.target.value }))} placeholder="縺頑ｰ励↓蜈･繧翫√さ繝ｼ繝・Γ繝｢縺ｪ縺ｩ" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50" />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={resetForm} className="px-4 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10">繧ｭ繝｣繝ｳ繧ｻ繝ｫ</button>
                  <button onClick={handleSave} disabled={!form.name.trim() || !form.price} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg text-sm font-medium disabled:opacity-30 hover:opacity-90">菫晏ｭ・/button>
                </div>
              </div>
            )}

            {/* Item list */}
            {items.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-12 text-center text-white/40">
                <p className="text-4xl mb-3">装</p>
                <p className="text-sm">縺ｾ縺繧｢繧､繝・Β縺後≠繧翫∪縺帙ｓ</p>
                <p className="text-xs mt-1">縲・ 霑ｽ蜉縲阪・繧ｿ繝ｳ縺ｧ譛阪ｒ逋ｻ骭ｲ縺励∪縺励ｇ縺・/p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/30 to-pink-500/30 flex items-center justify-center text-lg shrink-0">
                      {item.category === '繝医ャ繝励せ' ? '装' : item.category === '繝懊ヨ繝繧ｹ' ? '走' : item.category === '繧｢繧ｦ繧ｿ繝ｼ' ? 'ｧ･' : item.category === '繧ｷ繝･繝ｼ繧ｺ' ? '臓' : item.category === '繝舌ャ繧ｰ' ? '像' : item.category === '繝ｯ繝ｳ繝斐・繧ｹ' ? '送' : '笨ｨ'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{item.name}</span>
                        {item.brand && <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full shrink-0">{item.brand}</span>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/40 mt-1">
                        <span>ﾂ･{item.price.toLocaleString()}</span>
                        <span>{item.wearCount}蝗樒捩逕ｨ</span>
                        <span>1蝗・ﾂ･{costPerWear(item).toLocaleString()}</span>
                        <span>{item.color}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => handleWear(item.id)} className="px-2 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30" title="逹逕ｨ險倬鹸">装+1</button>
                      <button onClick={() => handleEdit(item)} className="px-2 py-1.5 bg-white/5 rounded-lg text-xs hover:bg-white/10">笨擾ｸ・/button>
                      <button onClick={() => handleDelete(item.id)} className="px-2 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs hover:bg-red-500/20">卵</button>
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
              <h2 className="text-xl font-bold">投 繧ｳ繧ｹ繝大・譫・/h2>
              <p className="text-sm text-white/50">1蝗槭≠縺溘ｊ繧ｳ繧ｹ繝医′鬮倥＞鬆・↓陦ｨ遉ｺ縲ら捩繧九⊇縺ｩ繧ｳ繧ｹ繝代′濶ｯ縺上↑繧翫∪縺・/p>
            </div>
            {items.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-8 text-center text-white/40 text-sm">繧ｯ繝ｭ繝ｼ繧ｼ繝・ヨ縺ｫ繧｢繧､繝・Β繧堤匳骭ｲ縺励※縺上□縺輔＞</div>
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
                          <div className="text-sm font-bold">ﾂ･{cpw.toLocaleString()}<span className="text-xs text-white/40 font-normal">/蝗・/span></div>
                          <div className="text-xs text-white/40">ﾂ･{cpd}<span className="text-white/30">/譌･</span></div>
                        </div>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${cpw > 3000 ? 'bg-red-500' : cpw > 1000 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${barWidth}%` }} />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/40 mt-2">
                        <span>雉ｼ蜈･ ﾂ･{item.price.toLocaleString()}</span>
                        <span>{item.wearCount}蝗樒捩逕ｨ</span>
                        <span>{cpw <= 500 ? '笨・蜈・叙繧後※繧具ｼ・ : cpw <= 1000 ? '総 縺ｾ縺壹∪縺・ : '嶋 繧ゅ▲縺ｨ逹繧医≧'}</span>
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
              <h2 className="text-xl font-bold">卵・・譁ｭ謐ｨ髮｢AI蛻､螳・/h2>
              <p className="text-sm text-white/50">繧ｹ繧ｳ繧｢30莉･荳翫・繧｢繧､繝・Β縺梧焔謾ｾ縺怜呵｣懊〒縺呻ｼ・declutterCandidates.length}莉ｶ・・/p>
            </div>
            {declutterCandidates.length === 0 ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
                <p className="text-2xl mb-2">笨ｨ</p>
                <p className="text-sm text-green-400">{items.length === 0 ? '繧｢繧､繝・Β繧堤匳骭ｲ縺吶ｋ縺ｨ蛻､螳壹＠縺ｾ縺・ : '縺吶∋縺ｦ縺ｮ繧｢繧､繝・Β縺梧ｴｻ逕ｨ縺輔ｌ縺ｦ縺・∪縺呻ｼ・}</p>
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
                        {score >= 70 ? '閥' : score >= 50 ? '泯' : '泙'} {score}轤ｹ
                      </div>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                      <div className={`h-full rounded-full ${score >= 70 ? 'bg-red-500' : score >= 50 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${score}%` }} />
                    </div>
                    <ul className="space-y-1">
                      {reasons.map((r, i) => <li key={i} className="text-xs text-white/50">窶｢ {r}</li>)}
                    </ul>
                    <div className="mt-2 text-xs font-medium">
                      {score >= 70 ? '庁 謇区叛縺吶％縺ｨ繧貞ｼｷ縺上♀縺吶☆繧√＠縺ｾ縺・ : score >= 50 ? '庁 謇区叛縺励ｒ讀懆ｨ弱＠縺ｾ縺励ｇ縺・ : '庁 繧ゅ≧蟆代＠逹縺ｦ縺ｿ縺ｾ縺励ｇ縺・}
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
              <h2 className="text-xl font-bold">腸 螢ｲ蜊ｴ繧ｬ繧､繝・/h2>
              <p className="text-sm text-white/50">諠ｳ螳壼｣ｲ蜊ｴ萓｡譬ｼ縺ｨ縺翫☆縺吶ａ繝励Λ繝・ヨ繝輔か繝ｼ繝</p>
            </div>

            {/* Platform comparison */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-3">投 繝励Λ繝・ヨ繝輔か繝ｼ繝豈碑ｼ・/h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="border-b border-white/10">
                    <th className="text-left py-2 px-2 text-white/40">繝励Λ繝・ヨ繝輔か繝ｼ繝</th>
                    <th className="text-left py-2 px-2 text-white/40">謇区焚譁・/th>
                    <th className="text-left py-2 px-2 text-white/40">蜷代＞縺ｦ繧九ｂ縺ｮ</th>
                    <th className="text-left py-2 px-2 text-white/40">迚ｹ蠕ｴ</th>
                  </tr></thead>
                  <tbody className="text-white/70">
                    <tr className="border-b border-white/5"><td className="py-2 px-2 font-medium">繝｡繝ｫ繧ｫ繝ｪ</td><td className="py-2 px-2">10%</td><td className="py-2 px-2">繝悶Λ繝ｳ繝牙刀縲懈律逕ｨ蜩・/td><td className="py-2 px-2">蛻ｩ逕ｨ閠・怙螟壹・螢ｲ繧後ｄ縺吶＞</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2 px-2 font-medium">繝ｩ繧ｯ繝・/td><td className="py-2 px-2">6.6%</td><td className="py-2 px-2">繝ｬ繝・ぅ繝ｼ繧ｹ譛・/td><td className="py-2 px-2">謇区焚譁吶′螳峨＞</td></tr>
                    <tr className="border-b border-white/5"><td className="py-2 px-2 font-medium">PayPay繝輔Μ繝・/td><td className="py-2 px-2">5%</td><td className="py-2 px-2">繝｡繝ｳ繧ｺ繝ｻ螳ｶ髮ｻ</td><td className="py-2 px-2">謇区焚譁呎怙螳・/td></tr>
                    <tr className="border-b border-white/5"><td className="py-2 px-2 font-medium">繧ｻ繧ｫ繝ｳ繝峨せ繝医Μ繝ｼ繝・/td><td className="py-2 px-2">窶・/td><td className="py-2 px-2">螟ｧ驥丞・蛻・/td><td className="py-2 px-2">謖√■霎ｼ繧縺縺代・荳諡ｬ雋ｷ蜿・/td></tr>
                    <tr><td className="py-2 px-2 font-medium">ZOZOUSED</td><td className="py-2 px-2">窶・/td><td className="py-2 px-2">繝悶Λ繝ｳ繝画恪</td><td className="py-2 px-2">ZOZO蝓ｺ貅悶・譟ｻ螳・/td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Item estimates */}
            {items.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-8 text-center text-white/40 text-sm">繧｢繧､繝・Β繧堤匳骭ｲ縺吶ｋ縺ｨ螢ｲ蜊ｴ諠ｳ螳壻ｾ｡譬ｼ繧堤ｮ怜・縺励∪縺・/div>
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
                          <div className="text-sm font-bold text-green-400">ﾂ･{est.low.toLocaleString()} 縲・ﾂ･{est.high.toLocaleString()}</div>
                          <div className="text-xs text-white/40">雉ｼ蜈･ ﾂ･{item.price.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="text-xs text-white/50 mt-1">桃 縺翫☆縺吶ａ: {est.platform}</div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Photo tips */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-3">萄 螢ｲ繧後ｄ縺吶＞蜀咏悄縺ｮ繧ｳ繝・/h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li>陪 閾ｪ辟ｶ蜈峨〒謦ｮ蠖ｱ・育ｪ馴圀縺後・繧ｹ繝茨ｼ・/li>
                <li>ｧｹ 閭梧勹縺ｯ逋ｽ or 繧ｷ繝ｳ繝励Ν縺ｫ・亥ｺ顔ｽｮ縺阪・NG・・/li>
                <li>盗 蜈ｨ菴・+ 繧ｿ繧ｰ + 繝繝｡繝ｼ繧ｸ驛ｨ蛻・・譛菴・譫・/li>
                <li>装 繝上Φ繧ｬ繝ｼ縺ｫ縺九￠縺ｦ謦ｮ繧九→笳・/li>
                <li>棟 繧ｵ繧､繧ｺ諢溘′繧上°繧句・逵滂ｼ医Γ繧ｸ繝｣繝ｼ蠖薙※繧九↑縺ｩ・・/li>
                <li>笨搾ｸ・繝悶Λ繝ｳ繝牙錐繝ｻ繧ｵ繧､繧ｺ繝ｻ逹逕ｨ蝗樊焚繧偵ち繧､繝医Ν縺ｫ蜷ｫ繧√ｋ</li>
              </ul>
            </div>
          </div>
        )}

        {/* ==================== COORD TAB ==================== */}
        {tab === 'coord' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">送 繧ｳ繝ｼ繝・署譯・/h2>
              <p className="text-sm text-white/50">逋ｻ骭ｲ繧｢繧､繝・Β縺九ｉ逹蝗槭＠繝代ち繝ｼ繝ｳ繧呈署譯茨ｼ井ｻ翫・繧ｷ繝ｼ繧ｺ繝ｳ: {CURRENT_SEASON}・・/p>
            </div>
            {coordSuggestions.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-8 text-center text-white/40 text-sm">
                {items.length === 0 ? '繧｢繧､繝・Β繧堤匳骭ｲ縺励※縺上□縺輔＞' : '繝医ャ繝励せ縺ｨ繝懊ヨ繝繧ｹ繧堤匳骭ｲ縺吶ｋ縺ｨ繧ｳ繝ｼ繝・ｒ謠先｡医＠縺ｾ縺・}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {coordSuggestions.map((coord, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-white/40 mb-2">繧ｳ繝ｼ繝・#{i + 1}</div>
                    <div className="space-y-2">
                      {coord.outer && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-lg">ｧ･</span>
                          <span>{coord.outer.name}</span>
                          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{coord.outer.color}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-lg">装</span>
                        <span>{coord.top.name}</span>
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{coord.top.color}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-lg">走</span>
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
              <h3 className="font-bold text-sm mb-3">耳 濶ｲ蜷医ｏ縺帙・蝓ｺ譛ｬ</h3>
              <div className="grid grid-cols-2 gap-3 text-xs text-white/60">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="font-medium text-white/80 mb-1">繝｢繝弱ヨ繝ｼ繝ｳ</div>
                  鮟津礼區ﾃ励げ繝ｬ繝ｼ縺ｧ螳牙ｮ壽─縲りｿｷ縺｣縺溘ｉ繧ｳ繝ｬ
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="font-medium text-white/80 mb-1">蜷檎ｳｻ濶ｲ</div>
                  繝阪う繝薙・ﾃ鈴搨縲√・繝ｼ繧ｸ繝･ﾃ苓幻縺ｧ縺ｾ縺ｨ縺ｾ繧頑─
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="font-medium text-white/80 mb-1">蟾ｮ縺苓牡</div>
                  繝吶・繧ｹ(鮟堤區)縺ｫ1轤ｹ縺縺代き繝ｩ繝ｼ繧貞・繧後ｋ
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="font-medium text-white/80 mb-1">3濶ｲ繝ｫ繝ｼ繝ｫ</div>
                  蜈ｨ霄ｫ3濶ｲ莉･蜀・↓謚代∴繧九→縺ｾ縺ｨ縺ｾ繧・                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STATS TAB ==================== */}
        {tab === 'stats' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">嶋 繝ｯ繝ｼ繝峨Ο繝ｼ繝也ｵｱ險・/h2>
              <p className="text-sm text-white/50">縺ゅ↑縺溘・繧ｯ繝ｭ繝ｼ繧ｼ繝・ヨ縺ｮ蜈ｨ菴灘ワ</p>
            </div>

            {items.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-8 text-center text-white/40 text-sm">繧｢繧､繝・Β繧堤匳骭ｲ縺吶ｋ縺ｨ邨ｱ險医′陦ｨ遉ｺ縺輔ｌ縺ｾ縺・/div>
            ) : (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">{items.length}</div>
                    <div className="text-xs text-white/40">邱上い繧､繝・Β謨ｰ</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">ﾂ･{totalInvestment.toLocaleString()}</div>
                    <div className="text-xs text-white/40">邱乗兜雉・｡・/div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">ﾂ･{items.length > 0 ? Math.round(totalInvestment / items.length).toLocaleString() : 0}</div>
                    <div className="text-xs text-white/40">蟷ｳ蝮・腰萓｡</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">{declutterCandidates.length}</div>
                    <div className="text-xs text-white/40">譁ｭ謐ｨ髮｢蛟呵｣・/div>
                  </div>
                </div>

                {/* Category breakdown */}
                <div className="bg-white/5 rounded-2xl p-5">
                  <h3 className="font-bold text-sm mb-3">投 繧ｫ繝・ざ繝ｪ蛻･蜀・ｨｳ</h3>
                  <div className="space-y-3">
                    {categoryCount.map(cc => {
                      const pct = Math.round((cc.count / items.length) * 100)
                      return (
                        <div key={cc.category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{cc.category}</span>
                            <span className="text-white/40">{cc.count}逹 (ﾂ･{cc.total.toLocaleString()})</span>
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
                  <h3 className="font-bold text-sm mb-3">醇 逹逕ｨ蝗樊焚繝ｩ繝ｳ繧ｭ繝ｳ繧ｰ</h3>
                  <div className="space-y-2">
                    {[...items].sort((a, b) => b.wearCount - a.wearCount).slice(0, 5).map((item, i) => (
                      <div key={item.id} className="flex items-center gap-3 text-sm">
                        <span className="text-lg">{i === 0 ? '･・ : i === 1 ? '･・ : i === 2 ? '･・ : `#${i + 1}`}</span>
                        <span className="flex-1">{item.name}</span>
                        <span className="font-bold">{item.wearCount}蝗・/span>
                        <span className="text-xs text-white/40">ﾂ･{costPerWear(item).toLocaleString()}/蝗・/span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Season distribution */}
                <div className="bg-white/5 rounded-2xl p-5">
                  <h3 className="font-bold text-sm mb-3">減 繧ｷ繝ｼ繧ｺ繝ｳ蛻･蛻・ｸ・/h3>
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
          窶ｻ 縺吶∋縺ｦ縺ｮ繝・・繧ｿ縺ｯ繝悶Λ繧ｦ繧ｶ蜀・↓菫晏ｭ倥＆繧後∝､夜Κ縺ｫ騾∽ｿ｡縺輔ｌ繧九％縺ｨ縺ｯ縺ゅｊ縺ｾ縺帙ｓ縲・        </p>
      </div>
    
      </div>
  )
}


