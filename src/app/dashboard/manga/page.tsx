'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── 型定義 ───────────────────────────────────────
interface Panel {
  panel: number
  name: string
  dialogue: string
  prompt: string
  speaker: string
  speaker_side: string
  files: string[]
}
interface Page {
  name: string
  page_prefix: string
  panels: Panel[]
}
interface Templates {
  characters?: { name: string; aliases: string[]; outfits: { name: string; prompt: string }[] }[]
  expression?: { name: string; text: string }[]
  pose?: { name: string; text: string }[]
  background?: { name: string; text: string }[]
  negative?: string
}

// ─── タブ ────────────────────────────────────────
type Tab = 'generate' | 'pages'

// ─── メイン ──────────────────────────────────────
export default function MangaDashboard() {
  const [tab, setTab] = useState<Tab>('generate')
  const [comfyStatus, setComfyStatus] = useState<'checking' | 'running' | 'offline'>('checking')

  // モデル
  const [checkpoints, setCheckpoints] = useState<string[]>([])
  const [loras, setLoras] = useState<string[]>([])
  const [selectedCkpt, setSelectedCkpt] = useState('novaAnime3dXL_v70.safetensors')
  const [selectedLora, setSelectedLora] = useState('last-000014.safetensors')
  const [loraStrength, setLoraStrength] = useState(1.0)
  const [loraEnabled, setLoraEnabled] = useState(true)

  // 台本
  const [script, setScript] = useState('')
  const [pagePrefix, setPagePrefix] = useState('manga')
  const [panelsPerPage, setPanelsPerPage] = useState(3)

  // テンプレート
  const [templates, setTemplates] = useState<Templates>({})

  // 生成
  const [generating, setGenerating] = useState(false)
  const [log, setLog] = useState('')
  const [logType, setLogType] = useState<'info' | 'ok' | 'error'>('info')

  // ページ一覧
  const [pages, setPages] = useState<Page[]>([])

  // 編集モーダル
  const [editTarget, setEditTarget] = useState<{ pageName: string; panel: Panel } | null>(null)
  const [editPrompt, setEditPrompt] = useState('')
  const [editDialogue, setEditDialogue] = useState('')
  const [saving, setSaving] = useState(false)

  // ─── 初期ロード ───────────────────────────────
  useEffect(() => {
    checkStatus()
    loadModels()
    loadTemplates()
    loadPages()
  }, [])

  async function checkStatus() {
    setComfyStatus('checking')
    try {
      const res = await fetch('/api/manga?action=status')
      const d = await res.json()
      setComfyStatus(d.comfyui === 'running' ? 'running' : 'offline')
    } catch { setComfyStatus('offline') }
  }

  async function loadModels() {
    try {
      const res = await fetch('/api/manga?action=models')
      const d = await res.json()
      if (d.checkpoints) setCheckpoints(d.checkpoints)
      if (d.loras) setLoras(d.loras)
    } catch {}
  }

  async function loadTemplates() {
    try {
      const res = await fetch('/api/manga?action=templates')
      const d = await res.json()
      setTemplates(d)
    } catch {}
  }

  async function loadPages() {
    try {
      const res = await fetch('/api/manga?action=pages')
      const d = await res.json()
      if (d.pages) setPages(d.pages)
    } catch {}
  }

  // ─── 生成実行 ────────────────────────────────
  async function handleGenerate() {
    if (!script.trim()) return
    setGenerating(true)
    setLog('生成中... ComfyUI で画像を生成しています（数分かかります）')
    setLogType('info')
    try {
      const res = await fetch('/api/manga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          script,
          page_prefix: pagePrefix,
          panels_per_page: panelsPerPage,
          checkpoint: selectedCkpt,
          lora: loraEnabled ? selectedLora : null,
          lora_strength: loraStrength,
        }),
      })
      const d = await res.json()
      if (res.ok) {
        setLog(`✅ 完了！ ${d.pages} ページ / ${d.results} コマ 生成しました。`)
        setLogType('ok')
        await loadPages()
        setTab('pages')
      } else {
        setLog(`❌ エラー: ${d.error || d.detail}`)
        setLogType('error')
      }
    } catch (e) {
      setLog(`❌ 接続エラー: ${String(e)}`)
      setLogType('error')
    } finally {
      setGenerating(false)
    }
  }

  // ─── プロンプト編集保存 ───────────────────────
  function openEdit(pageName: string, panel: Panel) {
    setEditTarget({ pageName, panel })
    setEditPrompt(panel.prompt)
    setEditDialogue(panel.dialogue)
  }

  async function handleSave() {
    if (!editTarget) return
    setSaving(true)
    try {
      const res = await fetch('/api/manga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_prompt',
          page_name: editTarget.pageName,
          panel: editTarget.panel.panel,
          prompt: editPrompt,
          dialogue: editDialogue,
        }),
      })
      const d = await res.json()
      if (res.ok) {
        setLog('✅ 保存＆PDF更新しました')
        setLogType('ok')
        setEditTarget(null)
        await loadPages()
      } else {
        setLog(`❌ 保存エラー: ${d.error || d.detail}`)
        setLogType('error')
      }
    } catch (e) {
      setLog(`❌ 接続エラー: ${String(e)}`)
      setLogType('error')
    } finally {
      setSaving(false)
    }
  }

  // ─── UI ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 text-sm">
      {/* ヘッダー */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">🎌 漫画生成</span>
          <StatusBadge status={comfyStatus} onRefresh={checkStatus} />
        </div>
        <button
          onClick={() => window.open(`/api/manga?action=download&prefix=${pagePrefix}`, '_blank')}
          className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold"
        >
          📥 PDF DL
        </button>
      </div>

      {/* タブ */}
      <div className="border-b border-gray-800 px-6 flex gap-1">
        {(['generate', 'pages'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              tab === t
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {t === 'generate' ? '🖊 台本・設定' : `📄 ページ一覧 ${pages.length > 0 ? `(${pages.length})` : ''}`}
          </button>
        ))}
      </div>

      <div className="px-6 py-5 max-w-4xl mx-auto">

        {/* ログ */}
        {log && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-xs whitespace-pre-wrap ${
            logType === 'ok' ? 'bg-emerald-900/50 text-emerald-300' :
            logType === 'error' ? 'bg-red-900/50 text-red-300' :
            'bg-blue-900/50 text-blue-300'
          }`}>
            {log}
          </div>
        )}

        {/* ── タブ: 台本・設定 ── */}
        {tab === 'generate' && (
          <div className="space-y-5">

            {/* モデル設定 */}
            <Section title="🧠 モデル設定">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="チェックポイント">
                  <select
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-xs"
                    value={selectedCkpt}
                    onChange={e => setSelectedCkpt(e.target.value)}
                  >
                    {checkpoints.map(c => (
                      <option key={c} value={c}>{c.replace('.safetensors', '')}</option>
                    ))}
                  </select>
                </Field>
                <Field label={
                  <span className="flex items-center gap-2">
                    LoRA
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={loraEnabled}
                        onChange={e => setLoraEnabled(e.target.checked)}
                        className="accent-blue-500"
                      />
                      <span className="text-xs text-gray-400">使用する</span>
                    </label>
                  </span>
                }>
                  <select
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-xs disabled:opacity-40"
                    value={selectedLora}
                    onChange={e => setSelectedLora(e.target.value)}
                    disabled={!loraEnabled}
                  >
                    {loras.map(l => (
                      <option key={l} value={l}>{l.replace('.safetensors', '')}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {loraEnabled && (
                <div className="mt-3">
                  <label className="text-xs text-gray-400 mb-1 block">
                    LoRA 強度: <span className="text-white font-bold">{loraStrength.toFixed(2)}</span>
                  </label>
                  <input
                    type="range" min={0} max={1.5} step={0.05}
                    value={loraStrength}
                    onChange={e => setLoraStrength(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                    <span>0.0</span><span>0.5</span><span>1.0</span><span>1.5</span>
                  </div>
                </div>
              )}
            </Section>

            {/* 生成設定 */}
            <Section title="⚙️ 生成設定">
              <div className="grid grid-cols-2 gap-4">
                <Field label="プレフィックス（ファイル名）">
                  <input
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-xs"
                    value={pagePrefix}
                    onChange={e => setPagePrefix(e.target.value)}
                  />
                </Field>
                <Field label="コマ数 / ページ">
                  <select
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-xs"
                    value={panelsPerPage}
                    onChange={e => setPanelsPerPage(Number(e.target.value))}
                  >
                    {[2,3,4,6].map(n => <option key={n} value={n}>{n} コマ</option>)}
                  </select>
                </Field>
              </div>
            </Section>

            {/* テンプレート参考 */}
            {templates.characters && (
              <Section title="👤 キャラクター参考（台本で使えるタグ）">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templates.characters.map(c => (
                    <div key={c.name} className="bg-gray-800 rounded-lg p-3">
                      <div className="font-bold text-blue-400 mb-1">[{c.name}]</div>
                      <div className="text-xs text-gray-400">
                        別名: {c.aliases.join(' / ')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        衣装: {c.outfits.map(o => o.name).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* 台本入力 */}
            <Section title="📝 台本">
              <textarea
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-xs font-mono h-56 resize-y leading-relaxed"
                placeholder={`[maid_girl] 今日は、私がご案内します。\n[customer_boy] じゃあ、ゆっくりお願い。\n[maid_girl] えっと…少し緊張してます。\n\n---\n\n[maid_girl] ふわっ…スカートが！\n[customer_boy] 今のは危なかった。`}
                value={script}
                onChange={e => setScript(e.target.value)}
              />
              <div className="text-xs text-gray-500 mt-1">
                ページ区切り: <code className="bg-gray-800 px-1 rounded">---</code>
                　話者タグ: <code className="bg-gray-800 px-1 rounded">[キャラ名]</code>
              </div>
            </Section>

            {/* 実行 */}
            <button
              onClick={handleGenerate}
              disabled={generating || !script.trim() || comfyStatus !== 'running'}
              className="w-full py-3 rounded-xl font-bold text-base transition-all
                bg-blue-600 hover:bg-blue-500
                disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {generating
                ? '⏳ 生成中...'
                : comfyStatus !== 'running'
                  ? '⚠️ ComfyUI がオフライン'
                  : '🚀 生成実行'}
            </button>
          </div>
        )}

        {/* ── タブ: ページ一覧 ── */}
        {tab === 'pages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">{pages.length} ページ</span>
              <button onClick={loadPages} className="text-xs text-blue-400 hover:text-blue-300">
                🔄 更新
              </button>
            </div>

            {pages.length === 0 && (
              <div className="text-center text-gray-600 py-16">
                まだ生成結果がありません。<br />
                「台本・設定」タブから生成してください。
              </div>
            )}

            {pages.map(page => (
              <div key={page.name} className="bg-gray-900 rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-800 font-bold text-blue-400 text-xs">
                  {page.name}
                </div>
                <div className="divide-y divide-gray-800">
                  {page.panels.map(panel => (
                    <div key={panel.panel} className="px-4 py-3 flex items-start gap-3">
                      {/* コマ番号 */}
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
                        {panel.panel}
                      </div>
                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-blue-300">{panel.speaker}</span>
                          <span className="text-xs text-gray-600">{panel.speaker_side}</span>
                        </div>
                        <div className="text-white mb-1">「{panel.dialogue}」</div>
                        <div className="text-xs text-gray-500 truncate">{panel.prompt}</div>
                      </div>
                      {/* 編集ボタン */}
                      <button
                        onClick={() => openEdit(page.name, panel)}
                        className="shrink-0 bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded-lg"
                      >
                        編集
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── 編集モーダル ─────────────────────────── */}
      {editTarget && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">
                プロンプト編集 — {editTarget.pageName} / Panel {editTarget.panel.panel}
              </h3>
              <button
                onClick={() => setEditTarget(null)}
                className="text-gray-500 hover:text-gray-300 text-xl leading-none"
              >×</button>
            </div>

            <Field label="セリフ">
              <input
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 mb-4"
                value={editDialogue}
                onChange={e => setEditDialogue(e.target.value)}
              />
            </Field>

            <Field label="プロンプト（英語）">
              <textarea
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 h-36 font-mono text-xs resize-y"
                value={editPrompt}
                onChange={e => setEditPrompt(e.target.value)}
              />
            </Field>

            {/* テンプレートから追加 */}
            {(templates.expression || templates.pose || templates.background) && (
              <div className="mt-3 mb-4">
                <div className="text-xs text-gray-500 mb-2">クイック追加:</div>
                <div className="flex flex-wrap gap-1.5">
                  {templates.expression?.map(e => (
                    <button
                      key={e.name}
                      onClick={() => setEditPrompt(p => p + ', ' + e.text)}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                    >
                      {e.name}
                    </button>
                  ))}
                  {templates.pose?.map(p => (
                    <button
                      key={p.name}
                      onClick={() => setEditPrompt(prev => prev + ', ' + p.text)}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                    >
                      {p.name}
                    </button>
                  ))}
                  {templates.background?.map(b => (
                    <button
                      key={b.name}
                      onClick={() => setEditPrompt(p => p + ', ' + b.text)}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white py-2.5 rounded-xl font-bold"
              >
                {saving ? '保存中...' : '💾 保存 & PDF更新'}
              </button>
              <button
                onClick={() => setEditTarget(null)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-xl"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── 共通コンポーネント ───────────────────────────

function StatusBadge({ status, onRefresh }: { status: string; onRefresh: () => void }) {
  const color = status === 'running' ? 'bg-emerald-500' : status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
  const label = status === 'running' ? 'ComfyUI 稼働中' : status === 'offline' ? 'ComfyUI オフライン' : '確認中...'
  return (
    <div className="flex items-center gap-2">
      <span className={`${color} text-white text-xs px-2.5 py-1 rounded-full font-bold`}>{label}</span>
      <button onClick={onRefresh} className="text-xs text-gray-500 hover:text-gray-300">↺</button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 rounded-xl p-5">
      <h2 className="font-bold text-gray-300 mb-4">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}
